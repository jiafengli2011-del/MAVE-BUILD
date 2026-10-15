import {readFile,access} from 'node:fs/promises';import{join}from'node:path';import{parseHTML}from'linkedom';
const routes=JSON.parse(await readFile('src/routes.json','utf8')),known=new Set(routes.map(r=>r.path)),failures=[];
for(const route of routes){const file=route.path==='/'?'public/index.html':join('public',route.path.slice(1),'index.html'),html=await readFile(file,'utf8'),{document}=parseHTML(html),fail=s=>failures.push(route.path+': '+s);
 if(document.body.textContent.trim().length<500)fail('insufficient content');for(const selector of['h1','meta[name="description"]','link[rel="canonical"]','.mv-nav'])if(!document.querySelector(selector))fail('missing '+selector);
 if(/<x-dc|<sc-if|<sc-for|<image-slot|<x-import|{{/.test(html))fail('uncompiled template');if(/support\.js|react\.production|unpkg\.com/.test(html))fail('legacy renderer');
 for(const el of document.querySelectorAll('img,script[src],link[rel="stylesheet"]')){const u=el.getAttribute('src')||el.getAttribute('href');if(u?.startsWith('/'))try{await access(join('public',u));}catch{fail('missing asset '+u);}if(el.localName==='img'&&(!u?.startsWith('/assets/')||!el.hasAttribute('width')||!el.hasAttribute('height')))fail('invalid image '+u);}
 for(const a of document.querySelectorAll('a[href]')){const u=a.getAttribute('href');if(u.startsWith('/')&&!known.has(u.split('#')[0].replace(/\/$/,'')||'/'))fail('unknown route '+u);}
 for(const m of html.matchAll(/url\(["']?([^"')]+)["']?\)/g)){if(/^https?:/.test(m[1]))fail('external background');if(m[1].startsWith('/'))try{await access(join('public',m[1]));}catch{fail('missing background '+m[1]);}}
 console.log('AUDIT',route.path);
}
const {document:home}=parseHTML(await readFile('public/index.html','utf8'));
for(const r of routes){const{document}=parseHTML(await readFile(r.path==='/'?'public/index.html':join('public',r.path.slice(1),'index.html'),'utf8'));for(const a of document.querySelectorAll('a[href^="/#"]'))if(!home.getElementById(a.getAttribute('href').slice(2)))failures.push('Missing home anchor '+a.getAttribute('href'));}
for(const m of(await readFile('public/assets/fonts.css','utf8')).matchAll(/url\(["']?([^"')]+)["']?\)/g))try{await access(join('public',m[1]));}catch{failures.push('Missing font '+m[1]);}
if(failures.length)throw new Error(failures.join('\n'));console.log('PASS: 10 complete static pages.');
