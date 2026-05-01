import requests, sys
s = requests.Session()
payload = {'phase': 1, 'data': {
    'project_name': 'Audit Villa Nairobi',
    'location': 'Nairobi, Kenya',
    'area': 220, 'stories': 3, 'units': 1, 'bedrooms': 4,
    'style': 'modern', 'currency': 'USD',
    'plot_no': 'LR.NO. 1234/56', 'architect': 'A. N. Other (BORAQS A/1234)',
    'engineer': 'J. Mwangi (EBK 5678)', 'qs': 'B. Kamau (BORAQS Q/9012)',
    'client': 'Audit Test Co.'
}}
r = s.post('http://127.0.0.1:5000/api/generate', json=payload, timeout=30)
print('GEN', r.status_code, r.text[:200])
r = s.get('http://127.0.0.1:5000/api/export/pdf', timeout=120)
print('PDF', r.status_code, 'bytes=', len(r.content))
open('audit.pdf','wb').write(r.content)
from pypdf import PdfReader
txt = '\n'.join((p.extract_text() or '') for p in PdfReader('audit.pdf').pages)
print('CHARS', len(txt))
needles = ['VALIDATION ENGINE','AUTO-CORRECTED','KES','BAR BENDING SCHEDULE',
           'B \u2014 SUBSTRUCTURE','C \u2014 SUPERSTRUCTURE','RC suspended slabs',
           'Septic tank','GRAND TOTAL','BORAQS','EBK','PROFESSIONAL CERTIFICATION',
           'BS EN 1992','BS 8666','IEC 60364','Bar Mark','Slab thickness',
           'Main breaker','VAT 16','STATUTORY COMPLIANCE','Contingency 7.5']
for n in needles:
    print(('OK ' if n in txt else 'MISS ') + n)
