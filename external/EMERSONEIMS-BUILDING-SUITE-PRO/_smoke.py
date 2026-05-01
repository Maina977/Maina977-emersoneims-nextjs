import json, requests, time, sys
from pypdf import PdfReader
B='http://127.0.0.1:5000'
r=requests.post(B+'/api/generate', json={'area':220,'stories':2,'units':1,'bedrooms':4,'location':'Nakuru, Kenya','currency':'KES','style':'modern','foundation':'strip','client_name':'Smoke Test','project_name':'Override Test','geotech':{'safe_bearing_kPa':220,'water_table_m':4.2,'soil_class':'CL','report_ref':'NAK-GEO-2026-0117','geotech_engineer':'Eng. Kariuki'}})
print('GEN', r.status_code)
ovr={'overrides':{'RC suspended slabs C25/30':99999, 'Hardcore filling 200 mm':12345, 'Bulk excavation foundation trenches':7777}}
r=requests.post(B+'/api/project/price-overrides', json=ovr)
print('OVR', r.status_code, r.json())
r=requests.get(B+'/api/export/pdf')
print('PDF', r.status_code, len(r.content), 'bytes')
open('OVR_TEST.pdf','wb').write(r.content)
pdf=PdfReader('OVR_TEST.pdf')
text=''.join(p.extract_text() or '' for p in pdf.pages)
hits={}
for needle in ['99,999','99999','12,345','12345','7,777','7777','★','QS rate edits applied']:
    hits[needle] = text.count(needle)
print('HITS', hits)
print('OUTCOME', 'PASS' if (hits['QS rate edits applied']>=1 and (hits['99,999']>=1 or hits['99999']>=1)) else 'FAIL')
