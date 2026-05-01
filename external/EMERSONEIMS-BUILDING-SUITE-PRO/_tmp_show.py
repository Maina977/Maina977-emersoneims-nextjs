import json
d=json.load(open('audit_generate.json',encoding='utf-8-sig'))
p=d.get('project') or d
ph=p.get('phases',{})
print('TOP', list(d.keys()))
print('PROJECT', list(p.keys()))
print('PHASES', list(ph.keys()))
for k in ['phase_3','phase_5','phase_6','phase_7','phase_12']:
    print('===',k,'==='); print(json.dumps(ph.get(k),indent=2,default=str)[:6000])
