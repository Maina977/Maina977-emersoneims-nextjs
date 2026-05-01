from pypdf import PdfReader
import re
def scan(path):
    t = "\n".join((p.extract_text() or "") for p in PdfReader(path).pages)
    return t, len(PdfReader(path).pages)

print("\n========= NO_GEOTECH.pdf (should be BLOCKED) =========")
t1, n1 = scan("NO_GEOTECH.pdf")
print(f"Pages: {n1}, Chars: {len(t1)}")
for label, rx, expect in [
    ("BLOCKED status",            r"BLOCKED",                    "yes"),
    ("Geotech-missing blocker",   r"[Gg]eotechnical investigation", "yes"),
    ("PRESUMED placeholder",      r"PRESUMED",                   "yes"),
    ("Soil NOT TESTED",           r"NOT TESTED",                 "yes"),
    ("Geotech engineer REQUIRED", r"REQUIRED",                   "yes"),
    ("Should NOT be AUTO-CORRECTED-only", r"\bAUTO-CORRECTED\b", "any"),
]:
    n = len(re.findall(rx, t1))
    print(f"  {label:38s} matches={n}")

print("\n========= WITH_GEOTECH.pdf (should be APPROVED with real values) =========")
t2, n2 = scan("WITH_GEOTECH.pdf")
print(f"Pages: {n2}, Chars: {len(t2)}")
for label, rx, expect in [
    ("BLOCKED status (should be 0)", r"BLOCKED",                 0),
    ("AUTO-CORRECTED status",        r"AUTO-CORRECTED",          "any"),
    ("Real bearing 220 kPa",         r"220\s*kPa",               "any"),
    ("Soil class CL shown",          r"\bCL\b",                  "any"),
    ("Water table 4.2 m",            r"4\.2\s*m",                "any"),
    ("Report ref NAK-GEO-2026-0117", r"NAK-GEO-2026-0117",       "any"),
    ("Geotech engineer Kariuki",     r"Kariuki",                 "any"),
    ("PRESUMED text gone",           r"PRESUMED",                0),
]:
    n = len(re.findall(rx, t2))
    print(f"  {label:38s} matches={n}")
