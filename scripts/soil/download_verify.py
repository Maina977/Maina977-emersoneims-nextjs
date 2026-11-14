"""Download the ISRIC SoilGrids 2.0 1 km aggregated layers AquaScan needs and
verify each against ISRIC's published SHA-256 before use. Global files are
kept only until the Kenya clip is made (clip.py)."""
import hashlib, sys, urllib.request, pathlib

BASE = "https://files.isric.org/soilgrids/latest/data_aggregated/1000m"
PROPS = ["clay", "sand", "silt", "bdod", "soc", "phh2o"]
DEPTHS = ["0-5cm", "5-15cm", "15-30cm"]
OUT = pathlib.Path(__file__).parent / "global"
OUT.mkdir(exist_ok=True)

def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()

ok = 0
for prop in PROPS:
    sums = {}
    for line in urllib.request.urlopen(f"{BASE}/{prop}/checksum.sha256.txt").read().decode().splitlines():
        if line.strip():
            h, name = line.split()
            sums[name] = h
    for d in DEPTHS:
        name = f"{prop}_{d}_mean_1000.tif"
        dst = OUT / name
        if not (dst.exists() and sha256(dst) == sums[name]):
            urllib.request.urlretrieve(f"{BASE}/{prop}/{name}", dst)
        got = sha256(dst)
        status = "OK" if got == sums[name] else "MISMATCH"
        print(f"{status} {name} {dst.stat().st_size} {got[:16]}", flush=True)
        ok += status == "OK"
print(f"DONE {ok}/{len(PROPS) * len(DEPTHS)} verified", flush=True)
sys.exit(0 if ok == len(PROPS) * len(DEPTHS) else 1)
