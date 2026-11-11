import{readFile}from'node:fs/promises';import assert from'node:assert/strict';import{Window}from'happy-dom';
async function load(id,path){const w=new Window({url:'https://mavebuild.vercel.app'+path,settings:{enableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});w.matchMedia=()=>({matches:true});w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};w.Element.prototype.animate=()=>({cancel(){}});w.document.write(await readFile('public'+(path==='/'?'/index.html':path+'/index.html'),'utf8'));w.eval(await readFile('public/site/runtime.js','utf8'));w.eval(await readFile('public/site/'+id+'.js','utf8'));return w;}
const resources=await load('resources','/resources');
for(const slug of['modular-vs-traditional-construction','how-much-does-a-modular-adu-cost']){
 const a=resources.document.querySelector(`a[href="/resources/${slug}"]`);assert.ok(a,'article must use deployed URL');const cover=a.querySelector('img');assert.ok(cover,'article needs a native cover image');assert.ok(cover.getAttribute('src').startsWith('/assets/'));assert.ok(cover.getAttribute('srcset').split(',').every(x=>x.trim().startsWith('/assets/')));
 await readFile('public/resources/'+slug+'/index.html');
}
resources.document.querySelector('.mv-nav-cta').click();resources.document.dispatchEvent(new resources.KeyboardEvent('keydown',{key:'Escape'}));assert.ok([...resources.document.querySelectorAll('a[href]')].every(a=>!a.getAttribute('href').includes('.dc.html')));
const home=await load('home','/'),about=await load('about','/about');
const assets=JSON.parse(await readFile('src/assets.json','utf8'));
const picture=about.document.querySelector('[data-parallax] picture');
assert.ok(picture,'About retains the new responsive image');
assert.equal(picture.querySelector('img').getAttribute('src'),assets['assets/about-studio-exterior-2400.jpg'].url);
for(const id of ['hearth-studio','grove-studio','hearth-one-bedroom','hearth-pod','grove-pod']){
 const w=await load(id,'/models/'+id),plan=w.document.querySelector('.mv-floorplan-img-wrap');
 assert.ok(plan,'Model has a floor plan');assert.equal(plan.querySelector('img').style.objectFit,'contain');
 assert.ok(w.document.body.textContent.includes('Quoted separately based on actual shipping costs and delivery location.'));
 assert.ok(w.document.body.textContent.includes('Applicable taxes are not included in the listed price.'));
 await w.happyDOM.close();
}
const info=JSON.parse(await readFile('src/site-info.json','utf8'));
for(const [id,product] of Object.entries(info.products)){
 const a=home.document.querySelector(`a[href="/models/${id}"][style*="border-bottom"]`);
 assert.ok(a.parentElement.textContent.includes('$'+product.minimumPrice.toLocaleString('en-US')),id+': homepage matches model price');
}
assert.ok(home.document.getElementById('plans'),'Homepage model anchor remains functional');
assert.ok(!home.document.body.textContent.includes('167 sq ft'),'Homepage uses the updated Hearth Pod area');
for(const w of[resources,home,about])await w.happyDOM.close();console.log('PASS: article URLs and covers after interaction, responsive About image, contained floor plans, shipping/tax scope and homepage model prices.');
