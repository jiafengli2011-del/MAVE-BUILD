import {readFile,writeFile,mkdir,rm,cp} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {parseHTML} from 'linkedom';
import {info,makeSchema,makeLlms} from './site-metadata.mjs';
const routes=JSON.parse(await readFile('src/routes.json','utf8'));
const assets=JSON.parse(await readFile('src/assets.json','utf8'));
const origin=info.origin;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const val=(expr,scope)=>{const k=expr.trim();return k==='true'?true:k==='false'?false:k.split('.').reduce((v,k)=>v?.[k],scope);};
const interp=(s,v)=>s.replace(/{{(.*?)}}/gs,(_,x)=>val(x,v)??'');
class DCLogic{constructor(p){this.props=p;}setState(u){Object.assign(this.state,typeof u==='function'?u(this.state):u);}}
await rm('public',{recursive:true,force:true});await mkdir('public/site',{recursive:true});
await cp('src/assets','public/assets',{recursive:true});await cp('src/runtime.js','public/site/runtime.js');
const report=[];
for(const route of routes){
 const {document}=parseHTML(await readFile(route.source,'utf8'));
 const code=document.querySelector('script[type="text/x-dc"]');
 const props=Object.fromEntries(Object.entries(JSON.parse(code.getAttribute('data-props')||'{}')).map(([k,v])=>[k,v.default]));
 const logic=code.textContent;const Component=new Function('DCLogic',`${logic};return Component;`)(DCLogic);const instance=new Component(props);
 const price=logic.match(/const from\s*=\s*\d+,\s*to\s*=\s*(\d+)/)?.[1];
 if(price){props.staticPrice=Number(price);Object.assign(instance.state,{priceVal:Number(price),priceDone:true});}
 const initial={...props,...instance.state,...instance.renderVals()};const records=[];
 const register=(el,scopes,change={})=>{let id=el.getAttribute('data-mv');if(id===null){id=String(records.length);el.setAttribute('data-mv',id);records.push({scopes,attrs:{},events:{}});}Object.assign(records[+id],change);return records[+id];};
 const image=url=>{const a=assets[url]||assets[decodeURI(url).replace(/^\.\//,'')];if(!a)throw new Error(route.id+': unmapped image '+url);return a;};
 function compile(node,scope,scopes){
  if(node.nodeType===3){if(node.textContent.includes('{{')){const span=document.createElement('span');register(span,scopes,{text:node.textContent});span.textContent=interp(node.textContent,scope);node.replaceWith(span);}return;}
  if(node.nodeType!==1)return;
  if(node.localName==='sc-for'){
   const expr=node.getAttribute('list').replace(/^\s*{{|}}\s*$/g,'').trim(),name=node.getAttribute('as'),list=val(expr,scope)||[],original=[...node.childNodes],fragment=document.createDocumentFragment();
   list.forEach((item,index)=>{for(const child of original){const copy=child.cloneNode(true);fragment.append(copy);compile(copy,{...scope,[name]:item},[...scopes,{expr,name,index}]);}});node.replaceWith(fragment);return;
  }
  if(node.localName==='sc-if'){
   const condition=node.getAttribute('value').replace(/^\s*{{|}}\s*$/g,'').trim(),n=document.createElement('mv-if');n.style.display='contents';register(n,scopes,{condition});if(!val(condition,scope))n.setAttribute('hidden','');n.append(...node.childNodes);node.replaceWith(n);for(const c of [...n.childNodes])compile(c,scope,scopes);return;
  }
  if(['image-slot','x-import'].includes(node.localName)){
   const n=document.createElement(node.hasAttribute('src')?'img':'div');for(const a of [...node.attributes])if(['src','class','style','id'].includes(a.name))n.setAttribute(a.name,a.value);
   if(n.localName==='img'){let alt=node.getAttribute('alt')||node.getAttribute('placeholder')||'';if(/^(Drop|Closing)/i.test(alt))alt=route.title.replace(' | MAVE','')+' — exterior view';n.setAttribute('alt',alt);}
   n.style.cssText+=`;display:block;object-fit:${node.getAttribute('fit')||'cover'};`;if(!n.style.width)n.style.width='100%';if(!n.style.height)n.style.height='100%';if(node.hasAttribute('radius'))n.style.borderRadius=node.getAttribute('radius')+'px';node.replaceWith(n);node=n;
  }
  for(const a of [...node.attributes]){
   const name=a.name,raw=a.value;
   if(name.startsWith('hint-')){node.removeAttribute(name);continue;}
   if(/^on[a-z]+$/i.test(name)){register(node,scopes).events[name.slice(2).toLowerCase()]=raw.replace(/^\s*{{|}}\s*$/g,'').trim();node.removeAttribute(name);continue;}
   if(name==='ref'){register(node,scopes,{ref:raw.replace(/^\s*{{|}}\s*$/g,'').trim()});node.removeAttribute(name);continue;}
   if(name==='style-hover'){register(node,scopes,{hover:raw});node.removeAttribute(name);continue;}
   if(raw.includes('{{')){
    register(node,scopes).attrs[name]=raw;const m=raw.match(/^\s*{{(.*?)}}\s*$/s),v=m?val(m[1],scope):interp(raw,scope);
    if(['disabled','checked'].includes(name)){if(v)node.setAttribute(name,'');else node.removeAttribute(name);}else node.setAttribute(name,String(v??''));
   }
   if(name==='style'&&/url\(/.test(node.getAttribute(name)||'')){
    const urls={};node.setAttribute(name,node.getAttribute(name).replace(/url\(["']?([^"')]+)["']?\)/g,(_,u)=>{urls[u]=u.startsWith('/assets/')?u:image(u).url;return `url(${urls[u]})`;}));if(raw.includes('{{'))register(node,scopes,{urls});
   }
  }
  if(node.localName==='source' && node.hasAttribute('srcset')){
   node.setAttribute('srcset',node.getAttribute('srcset').split(',').map(part=>{
    const [url,descriptor]=part.trim().split(/\s+/);if(url.startsWith('/assets/'))return part.trim();
    const meta=image(url);return meta.url+(descriptor?.endsWith('w')?' '+meta.width+'w':descriptor?' '+descriptor:'');
   }).join(', '));
  }
  if(node.localName==='img'&&node.getAttribute('src')){
   const src=node.getAttribute('src'),a=image(src);node.setAttribute('src',a.url);node.setAttribute('width',String(a.width));node.setAttribute('height',String(a.height));if(a.small){node.setAttribute('srcset',`${a.small} ${a.smallWidth}w, ${a.url} ${a.width}w`);node.setAttribute('sizes','100vw');}node.setAttribute('decoding','async');if(!/logo/i.test(src))node.setAttribute('loading','lazy');const id=node.getAttribute('data-mv');if(id!==null&&records[+id].attrs.src)records[+id].image=true;
  }
  for(const child of [...node.childNodes])compile(child,scope,scopes);
 }
 const component=document.querySelector('x-dc'),helmet=component.querySelector('helmet');const styles=[...helmet.querySelectorAll('style')].map(el=>el.outerHTML).join('\n');helmet.remove();for(const child of [...component.childNodes])compile(child,initial,[]);
 const first=[...component.querySelectorAll('img')].find(el=>!el.closest('mv-if[hidden]')&&!/logo/i.test(el.alt||''));if(first){first.setAttribute('loading','eager');first.setAttribute('fetchpriority','high');}
 const product=info.products[route.id];
 const description=route.id==='home'?info.homeDescription:product?`${product.name}: ${product.delivery.toLowerCase()}, starting at $${product.minimumPrice.toLocaleString('en-US')} USD. Final pricing is quoted individually for each project.`:route.id==='about'?'Meet MAVE and the people behind our thoughtfully designed small homes. Good design, made more accessible.':route.id==='resources'?'Practical guides to modular homes, construction costs and the building process.':'Explore '+route.title.replace(' | MAVE','')+' with MAVE: design, materials, building options and project planning.';
 if(product){
  if(props.staticPrice && props.staticPrice!==product.minimumPrice)throw new Error('Price metadata differs from visible pricing: '+route.id);
  if(!component.textContent.includes('$'+product.minimumPrice.toLocaleString('en-US')))throw new Error('Published starting price missing from page: '+route.id);
 }
 const canonical=origin+route.path,schema=makeSchema(route,description,first?.getAttribute('src'));
 const client=`MAVE.attach(${logic.trim().replace(/;\s*$/,'')},${JSON.stringify(props)},${JSON.stringify(records)});\n`;await writeFile(`public/site/${route.id}.js`,client);
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(route.title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(canonical)}"><meta property="og:title" content="${esc(route.title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:type" content="${route.path.startsWith('/resources/')?'article':'website'}">${first?`<meta property="og:image" content="${origin}${first.getAttribute('src')}">`:''}<meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>${styles}<link rel="stylesheet" href="/assets/fonts.css"><link rel="describedby" type="text/plain" href="/llms.txt"><style>mv-if{display:contents}mv-if[hidden]{display:none!important}html{scroll-behavior:smooth;scroll-padding-top:90px}img{max-width:100%}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}</style><script defer src="/site/runtime.js"></script><script defer src="/site/${route.id}.js"></script></head><body>${component.innerHTML}</body></html>`;
 if(html.includes('{{'))throw new Error('Unresolved template '+route.id);const file=route.path==='/'?'public/index.html':join('public',route.path.slice(1),'index.html');await mkdir(dirname(file),{recursive:true});await writeFile(file,html);report.push({path:route.path,htmlBytes:Buffer.byteLength(html),logicBytes:Buffer.byteLength(client)});console.log('BUILT',route.path);
}
await writeFile('public/llms.txt',makeLlms(routes));
await writeFile('public/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>${origin}${r.path}</loc></url>`).join('')}</urlset>`);await writeFile('public/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);await writeFile('build-report.json',JSON.stringify(report,null,2));
