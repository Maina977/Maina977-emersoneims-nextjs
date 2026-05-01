const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync(process.env.TEMP + '\\wiz_test.js','utf8');
function makeEl(){ const el = { value:'', style:{}, innerHTML:'', textContent:'', children:[], classList:{add:()=>{},remove:()=>{},toggle:()=>{},contains:()=>false}, addEventListener:()=>{}, appendChild:(c)=>{el.children.push(c);return c;}, removeChild:()=>{}, remove:()=>{}, click:()=>{}, setAttribute:()=>{}, getAttribute:()=>null, querySelector:()=>null, querySelectorAll:()=>[], focus:()=>{}, getBoundingClientRect:()=>({width:0,height:0,top:0,left:0}) }; return el; }
const ctx = {
  document: {
    getElementById: (id) => makeEl(),
    createElement: ()=>makeEl(),
    createElementNS: ()=>makeEl(),
    head: makeEl(),
    body: makeEl(),
    documentElement: makeEl(),
    querySelectorAll: ()=>[],
    querySelector: ()=>null,
    addEventListener: ()=>{},
  },
  window: { location:{ href:'', origin:'http://127.0.0.1:5000' }, addEventListener:()=>{}, _repData: null, innerWidth:1200, innerHeight:800, devicePixelRatio:1 },
  navigator: { userAgent:'node' },
  console, setTimeout, clearTimeout, setInterval, clearInterval,
  fetch: ()=>Promise.resolve({ok:true,json:()=>Promise.resolve({}),text:()=>Promise.resolve(''),blob:()=>Promise.resolve(null), headers:{get:()=>''}}),
  URL: { createObjectURL: ()=>'', revokeObjectURL: ()=>{} },
  Blob: function(){},
  FormData: function(){ this.append=()=>{}; },
  alert: ()=>{}, confirm: ()=>true, prompt: ()=>'',
  localStorage: { getItem:()=>null, setItem:()=>{}, removeItem:()=>{} },
  sessionStorage: { getItem:()=>null, setItem:()=>{}, removeItem:()=>{} },
};
ctx.self = ctx; ctx.globalThis = ctx;
try {
  vm.createContext(ctx);
  vm.runInContext(src, ctx, { filename:'wiz_test.js', timeout: 5000 });
  console.log('LOAD OK');
  const fnNames = ['repRender','repBuild','renderReport','buildReport'];
  for(const n of fnNames) console.log('typeof', n, '=', typeof ctx[n]);
  // Inspect any callable starting with rep
  const reps = Object.keys(ctx).filter(k=>/^rep/i.test(k)).slice(0,30);
  console.log('rep* keys:', reps);
  const fakeReport = { project_summary:{ total_area_m2:220, stories:1, dwelling_units:1, bedrooms_per_unit:4 }, structural_summary:{}, cost_summary:{ currency:'KES', total_project_cost_local:1000000, total_project_cost_usd:7000, cost_per_sqm_local:5000 }, phases_summary:[] };
  const fakeQuote = { success:true, symbol:'KES', cost_summary:{}, trade_sections:{}, payment_schedule:[], exclusions:[], terms_and_conditions:[] };
  const fakeDrawings = { drawings:{ floor_plan:'<svg/>', elevation_north:'<svg/>' } };
  const fakeRender = { success:true, render:{}, lights:[] };
  const fakeP = { area:220, stories:1, units:1, bedrooms:4, location:'Nairobi', currency:'KES', client_name:'X' };
  if (typeof ctx.repRender === 'function') {
    try {
      ctx.repRender(fakeReport, fakeQuote, fakeDrawings, fakeRender, fakeP, {});
      console.log('repRender CALL OK');
    } catch(e){
      console.log('repRender CALL THREW:', e.message);
      console.log(e.stack.split('\n').slice(0,15).join('\n'));
    }
  } else {
    console.log('repRender not in ctx; trying via vm.runInContext call');
    try {
      vm.runInContext('typeof repRender', ctx);
    } catch(e){ console.log('eval err',e.message); }
  }
} catch(e){
  console.log('PARSE/RUN ERROR:', e.message);
  console.log(e.stack.split('\n').slice(0,10).join('\n'));
}
