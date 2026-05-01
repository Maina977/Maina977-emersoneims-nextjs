from pypdf import PdfReader
import re
from collections import Counter
r=PdfReader("pdf_audit2.pdf"); t="".join(p.extract_text() or "" for p in r.pages)
print("PAGES",len(r.pages),"CHARS",len(t))
print()
print("--- Foundation tokens (should be only Strip family, no Pad/PAD) ---")
toks = re.findall(r"\b(STRIP|PAD|RAFT|Strip|Pad|Raft|strip|pad|raft)\b", t)
print(" Counts:", dict(Counter(toks)))
for m in re.finditer(r"\bPad\b|\bPAD\b", t):
    print(" Pad ctx:", repr(t[max(0,m.start()-60):m.start()+60]))
print()
print("--- Cert names ---")
for n in ["J. Mwangi","BORAQS A/2341","P. Otieno","EBK PE/5678","L. Wanjiru","BORAQS QS/4421"]:
    print(f"  {n:25s} count={t.count(n)}")
print("  Wet-sign warnings:", sum(1 for l in t.splitlines() if "Wet signature" in l))
print("  Annexure [ ] rows:", t.count("[ ]"))
print()
print("--- Phase data dump ---")
for line in t.splitlines():
    if any(k in line for k in ["Phase phase_3","Phase phase_5","Phase phase_6","Phase phase_7","Phase phase_12"]):
        print("  >",line.strip())
print()
print("--- Compliance ---")
for line in t.splitlines():
    if "Compliance Status" in line: print("  >",line.strip())
