from pypdf import PdfReader; import re
r = PdfReader("pdf_audit4.pdf"); t = "\n".join(p.extract_text() or "" for p in r.pages)
open("pdf_audit4.txt","w",encoding="utf-8").write(t)
print("PAGES",len(r.pages),"CHARS",len(t))

def find(rx, label, n=4):
    ms = re.findall(rx, t)
    print(f"  {label:42s} -> {ms[:n]}")

print("\n=== STRUCTURAL CONSISTENCY ===")
find(r"Lx\s*([\d.]+)\s*m",                 "Slab Lx (m)")
find(r"Ly\s*([\d.]+)\s*m",                 "Slab Ly (m)")
find(r"L\s*([\d.]+)\s*m,\s*\d+",           "Beam clear span L (m)")
find(r"N\s*([\d,]+)\s*kN",                 "Column axial N (kN)")
find(r"B\s*=?\s*(\d{3,4})\s*mm",           "Strip width B (mm)")
find(r"\b(\d+)\s*columns",                 "Column count")
find(r"4\.5\s*x\s*4\.5",                   "4.5 grid mentions")
find(r"3\.5\s*x\s*3\.5",                   "3.5 grid mentions")

print("\n=== MEP CONSISTENCY ===")
find(r"(\d+\.?\d*)\s*kVA",                 "kVA")
find(r"(\d{3,4}(?:,\d{3})?)\s*L/day",      "Water L/day")
find(r"(\d+)\s*persons",                   "Occupants persons")

print("\n=== BOQ CONSISTENCY ===")
find(r"Subtotal[^\d]+([\d,]+\.\d{2})",     "Subtotal")
find(r"Grand\s*Total[^\d]+([\d,]+\.\d{2})", "Grand Total")
find(r"per\s*m\W*([\d,]+)",                "Cost per m²")

print("\n=== NEGATIVE TOKENS (should be 0) ===")
for tok in [r"\bPad\b",r"\bPAD\b",r"9\.2\s*kVA",r"\b900\s*L",r"\b6\s+occupants",r"15,?364,?781",r"18,?136,?152"]:
    print(f"  {tok:25s} count={len(re.findall(tok,t))}")

print("\n=== POSITIVE TOKENS ===")
for tok in ["BORAQS A/2341","EBK PE/5678","BORAQS QS/4421","AUTO-CORRECTED",
            "Wet signature","Strip","STRIP","Lightning protection","fixture-unit",
            "8 % of works","IEC 62305"]:
    print(f"  {tok:30s} count={t.count(tok)}")
print(f"  Annexure '[ ]' rows count: {t.count('[ ]')}")
