import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
for (const [id,from,to] of [['hearth-pod',41990,33990],['grove-pod',52990,42990]]) {
 for (const reduced of [false,true]) {
  const w=new Window({url:'https://mavebuild.vercel.app/models/'+id,settings:{enableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true,suppressInsecureJavaScriptEnvironmentWarning:true}});
  w.matchMedia=()=>({matches:reduced});
  const observers=[];w.IntersectionObserver=class {constructor(fn){this.fn=fn;observers.push(this);}observe(el){this.el=el;}disconnect(){this.disconnected=true;}};
  let frames=[];w.requestAnimationFrame=fn=>{frames.push(fn);return frames.length;};
  w.document.write(await readFile(`public/models/${id}/index.html`,'utf8'));
  const price=w.document.querySelector('.mv-price');
  const amount=()=>Number(price.textContent.replace(/[^0-9]/g,''));
  assert.equal(amount(),to,'bare HTML must expose the offer price');
  const schema=JSON.parse(w.document.querySelector('script[type="application/ld+json"]').textContent);
  assert.ok(JSON.stringify(schema).includes(String(to)));
  w.eval(await readFile('public/site/runtime.js','utf8'));
  w.eval(await readFile(`public/site/${id}.js`,'utf8'));
  assert.equal(amount(),to,'keep final price until visible');
  const observer=observers.find(o=>o.el?.contains(price));assert.ok(observer);
  observer.fn([{isIntersecting:true}]);
  if(reduced){assert.equal(amount(),to);assert.equal(frames.length,0);}
  else {
   assert.equal(amount(),from,'animate from the original price');
   const start=w.performance.now();
   for(const elapsed of [300,600,1000,1600]){const fn=frames.shift();assert.ok(fn);fn(start+elapsed);if(elapsed===300)assert.ok(amount()<from&&amount()>to);}
   assert.equal(amount(),to);assert.equal(frames.length,0);
   observer.fn([{isIntersecting:true}]);assert.equal(frames.length,0,'play once');
  }
  assert.equal(price,w.document.querySelector('.mv-price'),'update existing HTML');
  await w.happyDOM.close();
 }
 console.log('PRICE PASS',id,from,'→',to,'including reduced motion');
}
