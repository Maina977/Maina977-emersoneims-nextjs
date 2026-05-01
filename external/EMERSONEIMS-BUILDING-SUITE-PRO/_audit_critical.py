"""End-to-end deep test of critical user paths.
Tests the real flow a 1000-clients-per-day customer would follow."""
import json, time, requests, base64, re
B='http://127.0.0.1:5000'

def t(label, fn):
    t0=time.time()
    try:
        ok, info = fn()
        dt=int((time.time()-t0)*1000)
        flag = '[OK]' if ok else '[FAIL]'
        print(f"  {flag:6} {dt:>5}ms  {label:55s} {info}")
        return ok
    except Exception as e:
        dt=int((time.time()-t0)*1000)
        print(f"  [ERR] {dt:>5}ms  {label:55s} {type(e).__name__}: {str(e)[:60]}")
        return False

print("="*80)
print("CRITICAL USER PATH 1: House Design End-to-End")
print("="*80)

# 1. Parse a free-form brief
def step1():
    r=requests.post(f'{B}/api/design/brief/parse',
        json={'brief':'Modern 4-bedroom bungalow in Nairobi with rooftop terrace, garden and 2-car garage. About 220 m². Budget around 80,000 USD.'},timeout=15)
    j=r.json()
    e=j.get('extracted',{})
    ok = (e.get('bedrooms')==4 and e.get('area_m2')==220.0 and e.get('building_type')=='BUNGALOW')
    return ok, f"bedrooms={e.get('bedrooms')} area={e.get('area_m2')} type={e.get('building_type')} conf={j.get('confidence')}"

# 2. Generate a project
GEN_PROJECT=[None]
def step2():
    r=requests.post(f'{B}/api/generate',json={
        'name':'AuditVilla','building_type':'BUNGALOW','location':'Nairobi, Kenya',
        'area':220,'bedrooms':4,'stories':1,'units':1,'style':'modern',
        'gps_lat':-1.29,'gps_lng':36.82},timeout=30)
    j=r.json()
    GEN_PROJECT[0]=j
    cost=j.get('total_cost')
    pid=j.get('project_id') or j.get('id')
    ok = bool(pid) and isinstance(cost,(int,float)) and cost>0
    cost_per_m2 = cost/220 if cost else 0
    return ok, f"id={str(pid)[:8] if pid else 'NONE'} cost=${cost} (${cost_per_m2:.0f}/m²)"

# 3. Floor plan SVG with dimensions
def step3():
    r=requests.post(f'{B}/api/drawings/floor-plan',json={
        'units':1,'bedrooms':4,'area':220,'stories':1,'style':'modern','area_per_unit':220},timeout=30)
    j=r.json()
    svg=j.get('svg') or j.get('drawing','')
    has_svg='<svg' in svg
    has_dims=('mm' in svg or "stroke-dasharray" in svg or '<text' in svg)
    return has_svg and has_dims, f"svg={len(svg)}B has_dims={has_dims}"

# 4. Elevation
def step4():
    r=requests.post(f'{B}/api/drawings/elevation',json={
        'units':1,'bedrooms':4,'area':220,'stories':1,'style':'modern','direction':'north','unit_w':14.8},timeout=30)
    j=r.json()
    svg=j.get('svg') or j.get('drawing','')
    return '<svg' in svg, f"svg={len(svg)}B"

# 5. Section
def step5():
    r=requests.post(f'{B}/api/drawings/section',json={
        'units':1,'bedrooms':4,'area':220,'stories':1,'style':'modern'},timeout=30)
    j=r.json()
    svg=j.get('svg') or j.get('drawing','')
    return '<svg' in svg, f"svg={len(svg)}B"

# 6. BoQ with quantities
def step6():
    r=requests.post(f'{B}/api/boq/generate',json={
        'building_type':'BUNGALOW','area':220,'bedrooms':4,'stories':1,'location':'Nairobi'},timeout=30)
    j=r.json()
    items = j.get('items') or j.get('boq') or j.get('boq_items') or []
    if isinstance(items,dict):
        items = sum(items.values(),[]) if items else []
    n = len(items)
    total = j.get('total') or j.get('total_cost') or 0
    return n>10 and total>0, f"items={n} total=${total}"

# 7. Quotation
QUOTE=[None]
def step7():
    r=requests.post(f'{B}/api/quotation/generate',json={
        'building_type':'BUNGALOW','area':220,'location':'Nairobi','currency':'USD',
        'bedrooms':4,'stories':1},timeout=30)
    j=r.json()
    QUOTE[0]=j
    qid=j.get('quotation_id') or j.get('id')
    total=j.get('total_amount') or j.get('total') or j.get('grand_total')
    line_items=j.get('line_items') or j.get('items') or []
    if isinstance(line_items,dict):
        line_items=sum(line_items.values(),[])
    return bool(qid) and bool(total) and len(line_items)>0, f"id={str(qid)[:10] if qid else 'NONE'} total={total} lines={len(line_items)}"

# 8. PDF report
def step8():
    r=requests.get(f'{B}/api/export/pdf',timeout=30,stream=True)
    body=r.content
    is_pdf = body[:4]==b'%PDF'
    return is_pdf, f"size={len(body)}B {'PDF magic OK' if is_pdf else 'NOT A PDF'}"

# 9. Excel export
def step9():
    r=requests.get(f'{B}/api/export/excel',timeout=30,stream=True)
    body=r.content
    is_xlsx = body[:2]==b'PK'  # zip magic
    return is_xlsx, f"size={len(body)}B {'XLSX magic OK' if is_xlsx else 'NOT XLSX'}"

# 10. 3D model (BIM)
def step10():
    r=requests.post(f'{B}/api/bim/build',json={
        'project_id':'audit-3d','building_type':'BUNGALOW','area':220,'bedrooms':4,'stories':1,'style':'modern'},timeout=30)
    j=r.json()
    elements=j.get('elements') or j.get('bim_elements') or []
    return len(elements)>0 or j.get('success'), f"elements={len(elements)} success={j.get('success')}"

# 11. IFC export
def step11():
    r=requests.post(f'{B}/api/bim/build',json={
        'project_id':'audit-ifc','building_type':'BUNGALOW','area':220,'bedrooms':4,'stories':1},timeout=30)
    return r.status_code==200, f"HTTP {r.status_code}"

# 12. Engineering: wind + seismic + RC + steel + geotech (real engineer payloads)
def stepE_wind():
    r=requests.post(f'{B}/api/eng/wind/calc',json={'V':40,'h':10,'b':12,'d':10,'code':'ASCE7','exposure':'C','Kd':0.85,'Kzt':1,'GCpi':0.18,'category':'II'},timeout=15)
    j=r.json() if r.headers.get('Content-Type','').startswith('application/json') else {}
    return r.status_code==200, f"HTTP {r.status_code} keys={list(j.keys())[:5]}"

def stepE_seismic():
    r=requests.post(f'{B}/api/eng/seismic/calc',json={'Ss':1.5,'S1':0.6,'site_class':'D','R':6.5,'I':1.0,'h':10,'W':5000,'code':'ASCE7'},timeout=15)
    return r.status_code==200, f"HTTP {r.status_code}"

def stepE_rc():
    r=requests.post(f'{B}/api/eng/rc/beam',json={'b':300,'h':500,'fck':30,'fyk':500,'cover':30,'bars_top':[16,16],'bars_bot':[20,20,20],'span':6,'load_kN_per_m':25},timeout=15)
    return r.status_code==200, f"HTTP {r.status_code}"

# 13. Cost accuracy: cross-check generate vs BoQ vs quotation
def step_consistency():
    g = GEN_PROJECT[0] or {}
    q = QUOTE[0] or {}
    g_cost = g.get('total_cost')
    q_total = q.get('total_amount') or q.get('total') or q.get('grand_total')
    if not (g_cost and q_total): return False, f"missing values g={g_cost} q={q_total}"
    diff_pct = abs(g_cost - q_total) / max(g_cost, q_total) * 100
    return diff_pct < 50, f"generate=${g_cost:.0f} quotation=${q_total:.0f} diff={diff_pct:.1f}%"

results = []
results.append(('brief parse', t('1. Parse free-form brief', step1)))
results.append(('generate',    t('2. Generate full project', step2)))
results.append(('floor plan',  t('3. Floor plan SVG with dimensions', step3)))
results.append(('elevation',   t('4. Elevation SVG', step4)))
results.append(('section',     t('5. Section SVG', step5)))
results.append(('boq',         t('6. Bill of Quantities', step6)))
results.append(('quotation',   t('7. Quotation', step7)))
results.append(('pdf',         t('8. PDF report (binary)', step8)))
results.append(('excel',       t('9. Excel export (binary)', step9)))
results.append(('bim/3d',      t('10. 3D/BIM model', step10)))
results.append(('ifc',         t('11. IFC build', step11)))
results.append(('eng:wind',    t('12. Wind loads (ASCE 7)', stepE_wind)))
results.append(('eng:seismic', t('13. Seismic ELF', stepE_seismic)))
results.append(('eng:RC',      t('14. RC beam design (EN 1992)', stepE_rc)))
results.append(('consistency', t('15. Cost consistency (generate vs quote)', step_consistency)))

passed = sum(1 for _,ok in results if ok)
print(f"\n  PASS: {passed}/{len(results)}")
print()

print("="*80)
print("CRITICAL USER PATH 2: Asset weight (mobile/tablet readiness)")
print("="*80)

def asset_weights():
    r1 = requests.get(B+'/', timeout=10)
    js_url = re.search(r'/static/wizard-[a-f0-9]+\.js', r1.text).group(0)
    css_url = re.search(r'/static/wizard-[a-f0-9]+\.css', r1.text).group(0)
    js  = requests.get(B+js_url, timeout=10)
    css = requests.get(B+css_url, timeout=10)
    js_gz  = requests.get(B+js_url, timeout=10, headers={'Accept-Encoding':'gzip'})
    css_gz = requests.get(B+css_url, timeout=10, headers={'Accept-Encoding':'gzip'})
    html_gz = requests.get(B+'/', timeout=10, headers={'Accept-Encoding':'gzip'})
    print(f"  HTML shell:   {len(r1.content):>7,}B raw  →  {len(html_gz.content):>7,}B gzipped")
    print(f"  CSS bundle:   {len(css.content):>7,}B raw  →  {len(css_gz.content):>7,}B gzipped")
    print(f"  JS bundle:    {len(js.content):>7,}B raw  →  {len(js_gz.content):>7,}B gzipped")
    total_gz = len(html_gz.content)+len(css_gz.content)+len(js_gz.content)
    print(f"  TOTAL over wire (gzipped): {total_gz:,}B  ({total_gz/1024:.0f} KB)")
    # Mobile budget: <300 KB transfer is a good 3G/4G target
    print(f"  Verdict: {'OK for mobile' if total_gz < 300_000 else 'TOO HEAVY for 3G/slow mobile'}")

asset_weights()

print()
print("="*80)
print("CRITICAL USER PATH 3: Concurrent load (1000 clients/day = ~100 peak/hour)")
print("="*80)

import concurrent.futures as cf
def one_request():
    t0=time.time()
    r=requests.get(B+'/', timeout=10)
    return time.time()-t0, r.status_code

def concurrent_test(n=20):
    t0=time.time()
    with cf.ThreadPoolExecutor(max_workers=n) as ex:
        futs=[ex.submit(one_request) for _ in range(n)]
        results=[f.result() for f in futs]
    total=time.time()-t0
    times=[t for t,_ in results]
    return total, sum(times)/len(times)*1000, max(times)*1000, min(times)*1000

for n in [5,10,20,50]:
    total, avg, mx, mn = concurrent_test(n)
    print(f"  {n:>3} concurrent:  wallclock={total*1000:>5.0f}ms  avg={avg:>5.0f}ms  min={mn:>4.0f}ms  max={mx:>5.0f}ms")
