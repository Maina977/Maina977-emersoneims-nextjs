from pypdf import PdfReader
import re
r = PdfReader("FINAL_REPORT.pdf"); t = "\n".join(p.extract_text() or "" for p in r.pages)
print(f"Pages: {len(r.pages)}  Chars: {len(t)}")

checks = [
    ("Foundation: STRIP only (no Pad)",      r"\bPad\b|\bPAD\b",         0, 0),
    ("MEP: 16.8 kVA canonical",              r"16\.8\s*kVA",             1, 99),
    ("MEP: legacy 9.2 kVA gone",             r"9\.2\s*kVA",              0, 0),
    ("Water: 1,600 L/day (200 L/p/d KE std)", r"1[,.]?600\s*L",          1, 99),
    ("Water: legacy 900 L/day gone",         r"\b900\s*L/day",           0, 0),
    ("Occupants: 8 persons",                 r"\b8\s*persons",           1, 99),
    ("Architect on cert page",               r"BORAQS A/2341",           2, 99),
    ("Engineer on cert page",                r"EBK PE/5678",             2, 99),
    ("QS on cert page",                      r"BORAQS QS/4421",          2, 99),
    ("Wet-signature warnings",               r"Wet signature",           1, 99),
    ("AUTO-CORRECTED status",                r"AUTO-CORRECTED",          1, 99),
    ("Lightning protection line",            r"Lightning protection",    1, 99),
    ("Fixture-unit-based plumbing rate",     r"fixture-unit",            1, 99),
    ("Annexure checkboxes [ ]",              r"\[ \]",                   15, 99),
    ("Slab span = grid 4.5 m",               r"Lx\s*4\.50",              1, 99),
]
passed = failed = 0
for label, rx, lo, hi in checks:
    n = len(re.findall(rx, t))
    ok = lo <= n <= hi
    mark = "PASS" if ok else "FAIL"
    print(f"  [{mark}] {label:45s} count={n} (need {lo}..{hi})")
    if ok: passed += 1
    else:  failed += 1

print(f"\nRESULT: {passed}/{passed+failed} checks passed")
print("\n>>> APPROVED FOR COUNTY SUBMISSION" if failed==0 else f"\n>>> {failed} BLOCKER(S) REMAIN")
