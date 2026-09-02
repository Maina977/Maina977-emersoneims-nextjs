import { chromium } from 'playwright';
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const fails=[]; const ok=m=>console.log('  PASS  '+m); const bad=m=>{fails.push(m);console.log('  FAIL  '+m);};
const b=await chromium.launch();
const p=await b.newPage({userAgent:UA,viewport:{width:1600,height:1400}});
await p.goto('https://www.emersoneims.com/generator-oracle',{waitUntil:'domcontentloaded',timeout:90000});
await p.waitForTimeout(7000);
// remove fixed overlays that intercept pointer events
const clean=async()=>p.evaluate(()=>{
  ['#accessibility-settings','#main-navigation'].forEach(sel=>{
    const e=document.querySelector(sel); if(e) e.style.display='none';
  });
  // cookie banner buttons sit in a fixed bar at the bottom
  const cb=[...document.querySelectorAll('button')].find(b=>/^Accept All$/i.test(b.textContent.trim()));
  if(cb) cb.click();
});
const txt=async()=>(await p.locator('body').innerText()).replace(/\s+/g,' ');
const tap=async(rx,label)=>{ await clean();
  const el=p.getByRole('button',{name:rx}).first();
  await el.scrollIntoViewIfNeeded().catch(()=>{});
  await el.dispatchEvent('click'); await p.waitForTimeout(3000);
  if(label) console.log('  · clicked '+label); };

await tap(/I Understand & Accept/i,'disclaimer');
await tap(/WIRING & MANUALS/i,'WIRING & MANUALS');
await tap(/Wiring Diagrams/i,'Wiring Diagrams');
console.log('[1] reached the wiring panel');

console.log('\n[2] model list — counts and provenance labels');
let t=await txt();
/7320 MKII[\s\S]{0,60}58 terminals/.test(t)?ok('DSE 7320 shows "58 terminals" from the verified map'):bad('7320 terminal count wrong');
/7310 MKII[\s\S]{0,80}No verified pinout/.test(t)?ok('DSE 7310 shows "No verified pinout"'):bad('7310 label wrong');
!/7310 MKII[\s\S]{0,60}\d+ terminals/.test(t)?ok('unverified models show no fabricated pin count'):bad('unverified model still shows a pin count');

console.log('\n[3] DSE 7320 pinout table');
await tap(/7320 MKII/,'model 7320'); await tap(/Pinout/i,'Pinout tab');
t=await txt(); console.log('  text length:', t.length);
for(const [n,w] of [
 ['DC plant supply input, negative','terminal 1 is the NEGATIVE (was "B+ Battery Positive")'],
 ['DC plant supply input, positive','terminal 2 is the POSITIVE'],
 ['Emergency stop input','terminal 3 is the emergency stop (was "Chassis Ground")'],
 ['Not specified by OEM','wire colour is not invented'],
 ['15 A DC','fuel/start rated 15 A as DSE specify (was 3 A / 5 A)'],
 ['Charge Fail / Excite','terminal 6 is the charge alternator excite'],
]) t.includes(n)?ok(w):bad(`${w} — MISSING "${n}"`);
for(const [n,w] of [
 ['Battery Positive Input','fabricated "pin 1 = B+ Battery Positive"'],
 ['Chassis Ground','fabricated "pin 3 = Chassis Ground"'],
 ['START-RET','fabricated START-RETURN pin'],
]) !t.includes(n)?ok(`${w} is gone`):bad(`${w} STILL PRESENT`);

console.log('\n[4] PowerWizard 2.0 must refuse to show a pinout');
await tap(/PowerWizard/i,'brand PowerWizard'); await tap(/^2\.0/,'model 2.0');
t=await txt();
/not yet available|No verified pinout|refer to OEM manual/i.test(t)?ok('shows the wiring-unavailable notice'):bad('no unavailable notice');
!t.includes('BATT+')?ok('fabricated PowerWizard BATT+ pin is gone'):bad('fabricated PowerWizard pin STILL PRESENT');

console.log('\n[5] Woodward easYgen-3000 must declare PARTIAL coverage');
await tap(/Woodward/i,'brand Woodward'); await tap(/easYgen 3000/i,'model easYgen 3000');
t=await txt();
/Partial/i.test(t)?ok('Woodward is labelled partial coverage'):bad('Woodward partial-coverage label missing');
!t.includes('X1:1')?ok('fabricated Woodward X1:1 connector is gone'):bad('fabricated Woodward pin STILL PRESENT');

await p.screenshot({path:'scratchpad/live-oracle-wiring.png'});
await b.close();
console.log(`\n${fails.length===0?'ALL LIVE CHECKS PASSED':fails.length+' LIVE CHECK(S) FAILED'}`);
process.exit(fails.length===0?0:1);
