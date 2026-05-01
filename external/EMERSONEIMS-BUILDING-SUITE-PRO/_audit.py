from pypdf import PdfReader
r = PdfReader('pdf_audit.pdf')
t = ''.join(p.extract_text() or '' for p in r.pages)
print('PAGES', len(r.pages), 'CHARS', len(t))
print()
def hits(needle):
    return sum(1 for line in t.splitlines() if needle in line)
print('--- Foundation ---')
import re
fnd = sorted(set(re.findall(r'\b(STRIP|PAD|RAFT|Strip|Pad|Raft|strip|pad|raft)\b', t)))
print('Distinct foundation tokens:', fnd)
for kw in ['Foundation Type','foundation_type','FOUNDATION']:
    for line in t.splitlines():
        if kw in line and len(line) < 200:
            print('  >', line.strip())
print('\n--- Certification page ---')
for who in ['J. Mwangi','BORAQS A/2341','P. Otieno','EBK PE/5678','L. Wanjiru','BORAQS QS/4421']:
    print(f'  {who:25s}  appears={hits(who)}x')
print('  Wet signature warning lines:', hits('Wet signatures'))
print('  Annexure checkbox count   :', t.count('\u2610'))
print('\n--- Costing reconciliation ---')
for line in t.splitlines():
    s = line.strip()
    if ('GRAND TOTAL' in s.upper() or 'grand_total' in s or 'Grand Total' in s or 'cost_per_m2' in s or 'reconciled' in s.lower()):
        print(' >', s[:180])
kes = re.findall(r'KSh\s*[\d,]+', t)
print('  KSh amounts found:', sorted(set(kes))[:15])
print('\n--- MEP consistency ---')
for line in t.splitlines():
    if any(k in line for k in ['kVA','kW','daily_water','occupants','design_kVA','design_demand']):
        if len(line) < 200:
            print(' >', line.strip())
print('\n--- Compliance ---')
for line in t.splitlines():
    if 'Compliance Status' in line or 'BLOCKED' in line or 'AUTO-CORRECTED' in line or 'VERIFIED' in line:
        print(' >', line.strip())
