import requests, json, sys
B = 'http://127.0.0.1:5000'
s = requests.Session()
s.post(B + '/api/auth/register', json={'email':'audit@test.local','password':'Audit-9876!','full_name':'Audit'})
r = s.post(B + '/api/auth/login', json={'email':'audit@test.local','password':'Audit-9876!'})
print('login:', r.status_code, r.text[:120])
payload = {
    'area': 220, 'stories': 3, 'units': 1, 'bedrooms': 4,
    'location': 'Nairobi, Kenya',
    'currency': 'USD',
    'foundation_type': 'pad',
    'floors': 1,
    'style': 'modern',
    'project_name': 'Validation Engine Test'
}
r = s.post(B + '/api/generate', json=payload)
print('generate:', r.status_code, r.text[:300])
try:
    j = r.json()
except Exception:
    j = {}
pid = j.get('project_id') or j.get('id')
print('pid:', pid)
r = s.get(B + '/api/export/pdf', params={'project_id': pid} if pid else None)
print('pdf http:', r.status_code, 'ctype:', r.headers.get('Content-Type'), 'bytes:', len(r.content))
if r.status_code == 200 and r.content[:4] == b'%PDF':
    open('_pdf_audit.pdf', 'wb').write(r.content)
    txt = r.content
    needles = [b'Auto-Correction', b'KES', b'Nairobi', b'raft', b'AUTO-CORRECTED', b'Validation Engine']
    for n in needles:
        print('  contains', n.decode(), '->', n in txt)
else:
    print('PDF failed body:', r.text[:400])
