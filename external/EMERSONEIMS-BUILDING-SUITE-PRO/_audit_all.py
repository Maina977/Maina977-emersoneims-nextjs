"""Comprehensive audit: hit every registered endpoint, score health + latency.
Writes report to _AUDIT_REPORT.json + prints a summary table.
"""
import json, time, re, os, sys
import requests

BASE = 'http://127.0.0.1:5000'

# ---- Discover all routes by introspecting the live Flask app ----
sys.path.insert(0, os.path.dirname(__file__))
import app_professional as ap
RULES = []
for rule in ap.app.url_map.iter_rules():
    methods = sorted(m for m in rule.methods if m not in ('HEAD','OPTIONS'))
    RULES.append((rule.rule, methods))
RULES.sort()
print(f"[discover] {len(RULES)} routes")

# Realistic sample payloads for known POST endpoints. Endpoints not listed get
# an empty {} body — many will 400 (validation), which is still a "responds OK"
# signal vs 500 / timeout / connection-error.
SAMPLE_BODIES = {
    '/api/generate':          {'name':'AuditTest','building_type':'BUNGALOW','area':150,'bedrooms':3,'stories':1,'units':1,'style':'modern','location':'Nairobi'},
    '/api/projects':          {'name':'AuditProj','building_type':'BUNGALOW','area':150},
    '/api/design/brief/parse':{'brief':'Modern 3-bed house in Nairobi, 150 m2, budget USD 60k.'},
    '/api/drawings/floor-plan':{'units':1,'bedrooms':3,'area':150,'stories':1,'style':'modern'},
    '/api/drawings/elevation':{'units':1,'bedrooms':3,'area':150,'stories':1,'style':'modern','direction':'north'},
    '/api/drawings/section':  {'units':1,'bedrooms':3,'area':150,'stories':1,'style':'modern'},
    '/api/boq/generate':      {'building_type':'BUNGALOW','area':150,'bedrooms':3,'stories':1},
    '/api/mep/generate':      {'building_type':'BUNGALOW','area':150,'bedrooms':3,'stories':1},
    '/api/landscape/generate':{'plot_area':400,'building_footprint':150},
    '/api/quotation/generate':{'building_type':'BUNGALOW','area':150,'location':'Nairobi','currency':'USD'},
    '/api/permits/analyze':   {'location':'Nairobi','building_type':'BUNGALOW'},
    '/api/infrastructure/generate':{'building_type':'BUNGALOW','area':150},
    '/api/eng/wind/calc':     {'V':40,'h':10,'b':10,'d':10,'code':'ASCE7'},
    '/api/eng/seismic/calc':  {'Ss':1.5,'S1':0.6,'site_class':'D','R':6.5,'I':1.0,'h':10,'W':5000},
    '/api/eng/rc/beam':       {'b':300,'h':500,'fck':30,'fyk':500,'cover':30,'bars_top':[16,16],'bars_bot':[20,20,20],'span':6,'load_kN_per_m':25},
    '/api/eng/steel/bolt':    {'d':20,'grade':'8.8','plies':2,'fu':400,'shear_kN':50},
    '/api/eng/geotech/bearing':{'B':2,'L':3,'Df':1.5,'gamma':18,'phi':30,'c':5,'N':25},
    '/api/eng/frame/analyze': {'nodes':[[0,0],[5,0],[5,3]],'members':[[0,1],[1,2]],'supports':{'0':[1,1,1]},'loads':{'2':[10,-50,0]}},
    '/api/qs/fx/convert':     {'amount':1000,'from':'USD','to':'EUR'},
    '/api/qs/materials/lookup':{'item':'cement'},
    '/api/qs/rates/buildup':  {'activity':'concrete','quantity':10,'unit':'m3'},
    '/api/qs/cashflow/sCurve':{'duration_months':12,'total_value':100000},
    '/api/qs/risk/montecarlo':{'estimates':[{'p10':100,'p50':120,'p90':150}],'iterations':1000},
    '/api/qs/evm/calc':       {'PV':100,'EV':80,'AC':90,'BAC':500},
    '/api/qs/carbon/calc':    {'items':[{'material':'concrete','quantity':100,'unit':'m3'}]},
    '/api/qs/tender/compare': {'tenders':[{'name':'A','price':100000},{'name':'B','price':95000}]},
    '/api/qs/variations/calc':{'variations':[{'desc':'extra wall','amount':500}]},
    '/api/qs/ve/options':     {'baseline':100000,'target_pct':10},
    '/api/qs/nrm1/build':     {'gifa':150,'storeys':1,'building_type':'house'},
    '/api/arch/daylight/calc':{'room_area':20,'window_area':4,'orientation':'south'},
    '/api/arch/acoustics/reverberation':{'V':100,'A':20},
    '/api/arch/acoustics/recommended':{'room_type':'office','V':100},
    '/api/arch/uvalue/calc':  {'layers':[{'material':'brick','thickness':0.1,'k':0.7}]},
    '/api/arch/egress/check': {'occupants':50,'exits':2,'travel_distance':30,'occupancy':'B'},
    '/api/arch/accessibility/check':{'door_width':900,'corridor_width':1200,'ramp_slope':0.083},
    '/api/sched/cpm':         {'tasks':[{'id':'A','dur':5,'preds':[]},{'id':'B','dur':3,'preds':['A']}]},
    '/api/sched/gantt':       {'tasks':[{'id':'A','dur':5,'preds':[]},{'id':'B','dur':3,'preds':['A']}]},
    '/api/safety/risk-register':{'project_type':'residential','phase':'construction'},
    '/api/safety/method-statement':{'activity':'concrete_pour'},
    '/api/design/experience/palette':{'style':'modern','climate':'tropical'},
    '/api/design/experience/emotion-brief':{'rooms':['living','bedroom'],'mood':'calm'},
    '/api/design/marbella/details':{'style':'mediterranean'},
    '/api/curation/plants':   {'climate':'tropical','area_m2':100},
    '/api/curation/irrigation':{'area_m2':100,'plant_type':'tropical'},
    '/api/villa/style':       {'style':'modern'},
    '/api/villa/generate':    {'style':'modern','bedrooms':4,'levels':2},
    '/api/global/site-hazard':{'lat':-1.29,'lng':36.82},
    '/api/global/flood-catchment':{'lat':-1.29,'lng':36.82,'area_ha':10},
    '/api/bim/build':         {'project_id':'audit','building_type':'BUNGALOW','area':150,'bedrooms':3,'stories':1},
    '/api/ai/render':         None,  # handled specially via querystring
}

# Routes we deliberately skip in the smoke pass (long-running, side effects, or need a setup project_id)
SKIP_PATTERNS = [
    r'^/api/ai/render',           # 20-30s upstream call, tested separately
    r'^/__shutdown',
    r'^/api/bim/sheet-pack/.*/pdf',  # heavy
    r'^/api/projects/.*/delete',
    r'^/api/results/.*',          # needs valid session_id
    r'^/api/quotation/.*$',       # needs id (except /generate)
    r'^/api/pdf/.*',              # needs valid session_id
]
SKIP_RE = [re.compile(p) for p in SKIP_PATTERNS]

def should_skip(path):
    return any(rx.match(path) for rx in SKIP_RE)

def render_path(rule):
    """Replace <param> placeholders with sensible test values."""
    return re.sub(r'<(?:[^:>]+:)?([^>]+)>', lambda m: 'audit-test' if 'id' in m.group(1).lower() else '1', rule)

def hit(method, path, body=None, timeout=15):
    url = BASE + render_path(path)
    t0 = time.time()
    try:
        if method == 'GET':
            r = requests.get(url, timeout=timeout)
        elif method == 'POST':
            r = requests.post(url, json=body if body is not None else {}, timeout=timeout)
        elif method == 'PUT':
            r = requests.put(url, json=body if body is not None else {}, timeout=timeout)
        elif method == 'DELETE':
            r = requests.delete(url, timeout=timeout)
        else:
            return {'method':method,'path':path,'http':None,'time_ms':0,'note':'unsupported method'}
        dt = int((time.time()-t0)*1000)
        ctype = (r.headers.get('Content-Type') or '').split(';')[0]
        size = len(r.content)
        return {'method':method,'path':path,'http':r.status_code,'time_ms':dt,'size':size,'ctype':ctype}
    except requests.Timeout:
        return {'method':method,'path':path,'http':'TIMEOUT','time_ms':int((time.time()-t0)*1000),'size':0,'ctype':''}
    except Exception as e:
        return {'method':method,'path':path,'http':'ERROR','time_ms':int((time.time()-t0)*1000),'size':0,'ctype':'','note':type(e).__name__+':'+str(e)[:80]}

results = []
n_total = n_skip = n_ok = n_4xx = n_5xx = n_timeout = n_error = 0

for rule, methods in RULES:
    if should_skip(rule):
        n_skip += 1
        continue
    body = SAMPLE_BODIES.get(rule)
    for m in methods:
        if m not in ('GET','POST','PUT','DELETE'):
            continue
        n_total += 1
        res = hit(m, rule, body)
        results.append(res)
        h = res['http']
        if isinstance(h, int):
            if 200 <= h < 400: n_ok += 1
            elif 400 <= h < 500: n_4xx += 1
            else: n_5xx += 1
        elif h == 'TIMEOUT': n_timeout += 1
        else: n_error += 1

# ---- print report ----
print(f"\n{'='*78}")
print(f"AUDIT RESULTS  total={n_total}  ok(2xx/3xx)={n_ok}  4xx={n_4xx}  5xx={n_5xx}  timeout={n_timeout}  error={n_error}  skipped={n_skip}")
print('='*78)

# Slow ones (>1s)
slow = [r for r in results if isinstance(r.get('time_ms'),int) and r['time_ms']>1000]
slow.sort(key=lambda x:-x['time_ms'])
print(f"\n--- SLOW endpoints (>1s) [{len(slow)}] ---")
for r in slow[:30]:
    print(f"  {r['time_ms']:>5}ms  {r['method']:5} {r['http']}  {r['path']}")

# Server errors
errs = [r for r in results if r['http'] in ('TIMEOUT','ERROR') or (isinstance(r['http'],int) and r['http']>=500)]
print(f"\n--- BROKEN endpoints (5xx/timeout/error) [{len(errs)}] ---")
for r in errs[:60]:
    note = r.get('note','')
    print(f"  {str(r['http']):>8}  {r['method']:5} {r['path']:55s} {note}")

# 4xx (could indicate missing payload contract)
errs4 = [r for r in results if isinstance(r['http'],int) and 400<=r['http']<500]
print(f"\n--- 4xx endpoints (need payload? auth?) [{len(errs4)}] ---")
for r in errs4[:60]:
    print(f"  {r['http']:>4}  {r['method']:5} {r['path']}")

with open('_AUDIT_REPORT.json','w',encoding='utf-8') as f:
    json.dump({'summary':{'total':n_total,'ok':n_ok,'4xx':n_4xx,'5xx':n_5xx,'timeout':n_timeout,'error':n_error,'skipped':n_skip},
               'results':results}, f, indent=2)
print(f"\n[wrote _AUDIT_REPORT.json]")
