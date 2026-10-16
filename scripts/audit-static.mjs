import {readFile,access} from 'node:fs/promises';import{join}from'node:path';import{parseHTML}from'linkedom';
import {info} from './site-metadata.mjs';
const routes=JSON.parse(await readFile('src/routes.json','utf8')),known=new Set(routes.map(r=>r.path)),failures=[];
for(const route of routes){const file=route.path==='/'?'public/index.html':join('public',route.path.slice(1),'index.html'),html=await readFile(file,'utf8'),{document}=parseHTML(html),fail=s=>failures.push(route.path+': '+s);
 if(document.body.textContent.trim().length<500)fail('insufficient content');for(const selector of['h1','meta[name="description"]','link[rel="canonical"]','.mv-nav'])if(!document.querySelector(selector))fail('missing '+selector);
 try{
  const graph=JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
  for(const type of ['Organization','WebSite'])if(!graph.some(x=>x['@type']===type))fail('missing schema '+type);
  const expected=info.products[route.id],product=graph.find(x=>x['@type']==='Product');
  if(expected){
   if(!product||product.name!==expected.name)fail('missing or incorrect Product');
   const offer=product?.offers,spec=offer?.priceSpecification;
   if(spec?.minPrice!==expected.minimumPrice||spec?.priceCurrency!=='USD')fail('incorrect minimum price or currency');
   if(offer?.price!==undefined)fail('starting price presented as fixed price');
   if(!product?.description.includes(expected.delivery)||!product?.description.includes('quoted individually'))fail('missing delivery or quotation scope');
   if(expected.format==='pod'&&/arrives as a kit/i.test(document.body.textContent))fail('Pod incorrectly described as a kit');
  }
 }catch(e){fail('invalid structured data: '+e.message);}
 if(/<x-dc|<sc-if|<sc-for|<image-slot|<x-import|{{/.test(html))fail('uncompiled template');if(/support\.js|react\.production|unpkg\.com/.test(html))fail('legacy renderer');
 for(const el of document.querySelectorAll('img,script[src],link[rel="stylesheet"]')){const u=el.getAttribute('src')||el.getAttribute('href');if(u?.startsWith('/'))try{await access(join('public',u));}catch{fail('missing asset '+u);}if(el.localName==='img'&&(!u?.startsWith('/assets/')||!el.hasAttribute('width')||!el.hasAttribute('height')))fail('invalid image '+u);}
 for(const a of document.querySelectorAll('a[href]')){const u=a.getAttribute('href');if(/\.dc\.html(?:$|[?#])/i.test(decodeURI(u)))fail('export-only page link '+u);if(u.startsWith('/')&&!known.has(u.split('#')[0].replace(/\/$/,'')||'/'))fail('unknown route '+u);}
 for(const el of document.querySelectorAll('source[srcset],img[srcset]'))for(const item of el.getAttribute('srcset').split(',')){
  const u=item.trim().split(/\s+/)[0];if(!u.startsWith('/assets/'))fail('unmapped image candidate '+u);else try{await access(join('public',u));}catch{fail('missing image candidate '+u);}
 }
 for(const m of html.matchAll(/url\(["']?([^"')]+)["']?\)/g)){if(/^https?:/.test(m[1]))fail('external background');if(m[1].startsWith('/'))try{await access(join('public',m[1]));}catch{fail('missing background '+m[1]);}}
 console.log('AUDIT',route.path);
}
const {document:home}=parseHTML(await readFile('public/index.html','utf8'));
if(home.querySelector('meta[name="description"]').content!==info.homeDescription)failures.push('Homepage description differs from approved copy');
const llms=await readFile('public/llms.txt','utf8');
for(const [id,p] of Object.entries(info.products)){
 if(!llms.includes(`${info.origin}/models/${id}`)||!llms.includes(`USD ${p.minimumPrice.toLocaleString('en-US')}`)||!llms.includes(p.delivery))failures.push('llms.txt missing product scope or price: '+id);
}
for(const m of llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)){
 const u=new URL(m[1]);if(u.origin!==info.origin||(!known.has(u.pathname)&&u.pathname!=='/sitemap.xml'))failures.push('llms.txt invalid page link '+m[1]);
}
if(!llms.includes('individual quotation')||!llms.includes('not fixed all-inclusive project totals'))failures.push('llms.txt missing quotation qualification');
for(const r of routes){const{document}=parseHTML(await readFile(r.path==='/'?'public/index.html':join('public',r.path.slice(1),'index.html'),'utf8'));for(const a of document.querySelectorAll('a[href^="/#"]'))if(!home.getElementById(a.getAttribute('href').slice(2)))failures.push('Missing home anchor '+a.getAttribute('href'));}
for(const m of(await readFile('public/assets/fonts.css','utf8')).matchAll(/url\(["']?([^"')]+)["']?\)/g))try{await access(join('public',m[1]));}catch{failures.push('Missing font '+m[1]);}
if(failures.length)throw new Error(failures.join('\n'));console.log('PASS: 10 complete static pages.');
