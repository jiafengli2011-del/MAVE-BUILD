/* Attach interactions to complete static HTML; never remount the page. */
(()=>{
 const value=(expr,scope)=>{const k=expr.trim();return k==='true'?true:k==='false'?false:k.split('.').reduce((v,k)=>v?.[k],scope);};
 const text=(raw,scope)=>raw.replace(/{{(.*?)}}/gs,(_,x)=>value(x,scope)??'');
 class DCLogic{constructor(props){this.props=props;}setState(update){Object.assign(this.state,typeof update==='function'?update(this.state):update);this.refresh?.();}}
 window.DCLogic=DCLogic;
 window.MAVE={attach(Component,props,records){
  const instance=new Component(props);if(props.staticPrice){Object.assign(instance.state,{priceVal:props.staticPrice,priceDone:true});instance._priceRan=true;}
  let vals={...props,...instance.state,...instance.renderVals()};const nodes=[...document.querySelectorAll('[data-mv]')].map(el=>({el,r:records[+el.dataset.mv]}));
  const scopeFor=r=>{const s={...vals};for(const f of r.scopes)s[f.name]=(value(f.expr,s)||[])[f.index];return s;};
  let lastFocus=null,dialogOpen=false;
  instance.refresh=()=>{
   vals={...props,...instance.state,...instance.renderVals()};
   for(const {el,r}of nodes){const scope=scopeFor(r);if(r.condition)el.hidden=!value(r.condition,scope);if(r.text!==undefined){const v=text(r.text,scope);if(el.textContent!==v)el.textContent=v;}
    for(const [name,raw]of Object.entries(r.attrs)){if(name==='src'&&r.image)continue;const m=raw.match(/^\s*{{(.*?)}}\s*$/s);let v=m?value(m[1],scope):text(raw,scope);if(r.urls&&typeof v==='string')for(const [source,url]of Object.entries(r.urls))v=v.replaceAll(source,url);
     if(name==='disabled'||name==='checked'){el[name]=!!v;el.toggleAttribute(name,!!v);}else if(name==='value'){if(el.value!==String(v??''))el.value=String(v??'');}else if(el.getAttribute(name)!==String(v??''))el.setAttribute(name,String(v??''));}
   }
   const open=!!instance.state.contactOpen;if(open!==dialogOpen){if(open){lastFocus=document.activeElement;document.body.style.overflow='hidden';}else{document.body.style.overflow='';lastFocus?.focus();}dialogOpen=open;}
   if(open){const modal=document.querySelector('.mv-modal');modal?.setAttribute('role','dialog');modal?.setAttribute('aria-modal','true');modal?.setAttribute('aria-label','Contact MAVE');}
   document.querySelector('.mv-hamburger')?.setAttribute('aria-expanded',String(!!instance.state.mobileMenuOpen));
  };
  for(const {el,r}of nodes){for(const [event,expr]of Object.entries(r.events))el.addEventListener(event,e=>{if(event==='submit'&&!el.reportValidity())return;const fn=value(expr,scopeFor(r));if(typeof fn==='function')fn(e);});if(r.hover){let base='';el.addEventListener('mouseenter',()=>{base=el.getAttribute('style')||'';el.style.cssText+=';'+r.hover;});el.addEventListener('mouseleave',()=>{el.setAttribute('style',base);instance.refresh();});}}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')instance.setState({contactOpen:false,mobileMenuOpen:false,aduOpen:false});if(e.key==='Tab'&&dialogOpen){const items=[...document.querySelectorAll('.mv-modal a,.mv-modal button,.mv-modal input,.mv-modal textarea,.mv-modal select')].filter(e=>!e.disabled&&e.getClientRects().length),first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
  instance.refresh();for(const {el,r}of nodes)if(r.ref){const fn=value(r.ref,scopeFor(r));if(typeof fn==='function')fn(el);}instance.componentDidMount?.();window.addEventListener('pagehide',()=>instance.componentWillUnmount?.(),{once:true});window.__maveReady=true;
 }};
})();
