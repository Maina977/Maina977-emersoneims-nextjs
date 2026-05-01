const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync(process.env.TEMP + '\\wiz_v5.js', 'utf8');

function makeEl(tag){
  const el = {
    tagName: (tag||'div').toUpperCase(),
    children: [], style: {}, dataset: {},
    classList: { add(){}, remove(){}, toggle(){}, contains(){return false;} },
    attributes: {},
    _innerHTML: '',
    get innerHTML(){return this._innerHTML;},
    set innerHTML(v){this._innerHTML = v;},
    appendChild(c){ this.children.push(c); return c; },
    append(){ for(const c of arguments) this.children.push(c); },
    removeChild(c){ const i=this.children.indexOf(c); if(i>=0)this.children.splice(i,1); return c; },
    setAttribute(k,v){ this.attributes[k]=v; },
    getAttribute(k){ return this.attributes[k]; },
    removeAttribute(k){ delete this.attributes[k]; },
    addEventListener(){}, removeEventListener(){},
    querySelector(){return makeEl('div');},
    querySelectorAll(){return [];},
    closest(){return null;},
    getBoundingClientRect(){return {top:0,left:0,width:0,height:0,right:0,bottom:0};},
    focus(){}, blur(){}, click(){}, scrollIntoView(){},
    insertAdjacentHTML(pos, html){ this._innerHTML += html; },
    cloneNode(){return makeEl(this.tagName);},
    remove(){}
  };
  return el;
}

const document = {
  createElement: makeEl,
  createElementNS: (ns,tag)=>makeEl(tag),
  createTextNode: (t)=>({nodeValue:t}),
  createDocumentFragment: ()=>makeEl('fragment'),
  getElementById: (id)=>makeEl('div'),
  querySelector: ()=>makeEl('div'),
  querySelectorAll: ()=>[],
  body: makeEl('body'),
  head: makeEl('head'),
  documentElement: makeEl('html'),
  addEventListener(){}, removeEventListener(){},
  readyState: 'complete',
  cookie: ''
};

const window = {
  document,
  location: { href:'http://127.0.0.1:5000/', origin:'http://127.0.0.1:5000', pathname:'/' },
  addEventListener(){}, removeEventListener(){},
  setTimeout, clearTimeout, setInterval, clearInterval,
  requestAnimationFrame: (cb)=>setTimeout(cb,0),
  cancelAnimationFrame: (h)=>clearTimeout(h),
  navigator: { userAgent:'node', language:'en' },
  localStorage: { _d:{}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=String(v);}, removeItem(k){delete this._d[k];}, clear(){this._d={};} },
  sessionStorage: { _d:{}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=String(v);}, removeItem(k){delete this._d[k];}, clear(){this._d={};} },
  fetch: ()=>Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({}),text:()=>Promise.resolve(''),blob:()=>Promise.resolve({})}),
  alert(){}, confirm(){return true;}, prompt(){return '';},
  matchMedia: ()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}),
  scrollTo(){}, getComputedStyle: ()=>({getPropertyValue:()=>'' }),
  URL: { createObjectURL:()=>'blob:x', revokeObjectURL(){} },
  Blob: function(){},
  FileReader: function(){},
  console
};
window.window = window;
window.self = window;
window.globalThis = window;

const sandbox = Object.assign({}, window, { window, document, console, setTimeout, clearTimeout, setInterval, clearInterval, Promise, JSON, Math, Date, Error, Object, Array, Map, Set, String, Number, Boolean, RegExp, Symbol, Reflect, Proxy, ArrayBuffer, Uint8Array, TextEncoder: global.TextEncoder, TextDecoder: global.TextDecoder, fetch: window.fetch, URL: global.URL, btoa: (s)=>Buffer.from(s,'binary').toString('base64'), atob:(s)=>Buffer.from(s,'base64').toString('binary') });

vm.createContext(sandbox);
try {
  vm.runInContext(code, sandbox, { filename:'wizard.js' });
  console.log('LOAD OK');
} catch(e){
  console.log('LOAD ERROR:', e.message);
  console.log((e.stack||'').split('\n').slice(0,5).join('\n'));
  process.exit(1);
}

// Locate repRender
let repRender = sandbox.repRender || (sandbox.window && sandbox.window.repRender);
if(!repRender){
  // search by scanning sandbox for function named repRender
  for(const k of Object.keys(sandbox)){
    if(typeof sandbox[k]==='function' && sandbox[k].name==='repRender'){ repRender = sandbox[k]; break; }
  }
}
console.log('repRender found?', typeof repRender);

const fakeReport = {
  project_summary:{building_type:'Bungalow',area:220,stories:1,bedrooms:4,location:'Nairobi'},
  structural_summary:{foundation:'Strip',frame:'RC',roof:'Truss'},
  cost_summary:{total:1234567,currency:'KES',breakdown:{}},
  phases_summary:[{name:'Foundation',duration:'2w'}]
};
const fakeQuote = { success:true, trade_sections:{} };
const fakeDrawings = { drawings:{ floor_plan:'<svg/>' } };
const fakeRender = { success:true };
const extras = {};

function tryCall(stories){
  const fakeP = {area:220, stories, units:1, bedrooms:4, location:'Nairobi', currency:'KES', client_name:'X'};
  try {
    const out = repRender(fakeReport, fakeQuote, fakeDrawings, fakeRender, fakeP, extras);
    console.log('repRender CALL OK stories='+stories, '(returned type:'+typeof out+')');
  } catch(e){
    console.log('repRender ERROR stories='+stories+':', e.message);
    console.log((e.stack||'').split('\n').slice(0,5).join('\n'));
  }
}

if(typeof repRender === 'function'){
  tryCall(1);
  tryCall(2);
} else {
  console.log('repRender not found in sandbox; keys sample:', Object.keys(sandbox).filter(k=>k.toLowerCase().includes('rep')).slice(0,20));
}
