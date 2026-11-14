"""Build the versioned Kenya soil extract (SoilGrids 2.0, 1 km aggregated).

- Reads only the Kenya window of each official ISRIC file (GDAL /vsicurl/ range
  reads), in the native Interrupted Goode Homolosine grid: no resampling, the
  stored integers are ISRIC's own values.
- Writes raw little-endian int16 grids plus manifest.json (source URL, HTTP
  Last-Modified/Content-Length, ISRIC's published full-file SHA-256, our
  SHA-256 of each extracted grid, window transform, scaling, units).
- Equivalence proof: if the full file was downloaded and verified against
  ISRIC's checksum (download.py), its window is compared byte-for-byte with
  the range-read window.
- Writes reference points (GDAL transforms of lat/lon to grid cells) used by
  the TypeScript tests to check the projection independently.
"""
import hashlib, json, pathlib, sys, urllib.request, datetime
import numpy as np, rasterio
from rasterio.windows import Window
from rasterio.warp import transform as warp_transform

BASE = "https://files.isric.org/soilgrids/latest/data_aggregated/1000m"
PROPS = {  # property: (divisor, unit) from the SoilGrids conversion table
    "clay": (10, "%"), "sand": (10, "%"), "silt": (10, "%"),
    "bdod": (100, "kg/dm³"), "soc": (10, "g/kg"), "phh2o": (10, "pH"),
}
DEPTHS = ["0-5cm", "5-15cm", "15-30cm"]
VERSION = "kenya-soilgrids-2.0-1km-v1"
OUT = pathlib.Path(sys.argv[1]) / VERSION
OUT.mkdir(parents=True, exist_ok=True)
BBOX = (33.9, -4.72, 41.91, 5.03)  # lon/lat, Kenya national extent (approximate)

def head(url):
    req = urllib.request.Request(url, method="HEAD")
    with urllib.request.urlopen(req) as r:
        return r.headers.get("Last-Modified"), int(r.headers.get("Content-Length"))

def isric_sums(prop):
    txt = urllib.request.urlopen(f"{BASE}/{prop}/checksum.sha256.txt").read().decode()
    return {n: h for h, n in (l.split() for l in txt.splitlines() if l.strip())}

# Window covering the bbox: densify the edges, project, take min/max, pad one cell.
lons = list(np.linspace(BBOX[0], BBOX[2], 60)) * 2 + [BBOX[0]] * 60 + [BBOX[2]] * 60
lats = [BBOX[1]] * 60 + [BBOX[3]] * 60 + list(np.linspace(BBOX[1], BBOX[3], 60)) * 2
first = f"/vsicurl/{BASE}/clay/clay_0-5cm_mean_1000.tif"
with rasterio.open(first) as src:
    xs, ys = warp_transform("EPSG:4326", src.crs, lons, lats)
    inv = ~src.transform
    cols, rows = zip(*[inv * (x, y) for x, y in zip(xs, ys)])
    c0, c1 = int(np.floor(min(cols))) - 1, int(np.ceil(max(cols))) + 1
    r0, r1 = int(np.floor(min(rows))) - 1, int(np.ceil(max(rows))) + 1
    win = Window(c0, r0, c1 - c0, r1 - r0)
    wt = src.window_transform(win)
    crs_wkt = src.crs.to_wkt()
print("window", win, "transform", tuple(wt)[:6], flush=True)

layers = []
for prop, (div, unit) in PROPS.items():
    sums = isric_sums(prop)
    for d in DEPTHS:
        name = f"{prop}_{d}_mean_1000.tif"
        url = f"{BASE}/{prop}/{name}"
        with rasterio.open(f"/vsicurl/{url}") as src:
            assert src.transform == rasterio.open(first).transform, "grid differs between layers"
            a = src.read(1, window=win)
            nodata = int(src.nodata)
        raw = a.astype("<i2").tobytes()
        fn = f"{prop}_{d}_mean.i16"
        (OUT / fn).write_bytes(raw)
        lm, size = head(url)
        layers.append({
            "property": prop, "depth": d, "statistic": "mean", "file": fn,
            "sha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw),
            "divisor": div, "unit": unit, "noData": nodata,
            "source": {"url": url, "lastModified": lm, "contentLength": size, "isricFullFileSha256": sums[name]},
            "validCells": int((a != nodata).sum()),
        })
        print(f"OK {fn} {a.shape} valid={layers[-1]['validCells']}", flush=True)

# Equivalence proof against a fully downloaded, checksum-verified file (if present).
proof = None
full = pathlib.Path(__file__).parent / "global" / "clay_0-5cm_mean_1000.tif"
if full.exists():
    h = hashlib.sha256(full.read_bytes()).hexdigest()
    if h == isric_sums("clay")["clay_0-5cm_mean_1000.tif"]:
        with rasterio.open(full) as src:
            local = src.read(1, window=win).astype("<i2").tobytes()
        proof = {"layer": "clay_0-5cm_mean", "fullFileSha256Verified": True,
                 "windowIdentical": local == (OUT / "clay_0-5cm_mean.i16").read_bytes()}
    else:
        proof = {"layer": "clay_0-5cm_mean", "fullFileSha256Verified": False}
print("proof", proof, flush=True)

# Reference points: GDAL's own projection of lat/lon into this grid (for the TS tests).
rng = np.random.default_rng(20261114)
plon = list(rng.uniform(BBOX[0], BBOX[2], 40)) + [36.8219, 39.6461, 35.0, 34.75, 40.0]
plat = list(rng.uniform(BBOX[1], BBOX[3], 40)) + [-1.2921, -0.4532, 1.0, -0.1, 3.5]
px, py = warp_transform("EPSG:4326", crs_wkt, plon, plat)
invw = ~wt
refs = []
for lo, la, x, y in zip(plon, plat, px, py):
    c, r = invw * (x, y)
    refs.append({"lon": round(lo, 6), "lat": round(la, 6), "x": x, "y": y, "col": int(np.floor(c)), "row": int(np.floor(r))})

manifest = {
    "datasetId": VERSION, "version": "1",
    "source": {"name": "SoilGrids 2.0 (1000 m aggregated)", "publisher": "ISRIC – World Soil Information", "release": "2.0", "url": f"{BASE}/", "retrievedOn": datetime.date.today().isoformat()},
    "licence": {"id": "CC-BY-4.0", "url": "https://creativecommons.org/licenses/by/4.0/",
                "attribution": "Soil data: SoilGrids 2.0 (Poggio et al. 2021), ISRIC – World Soil Information.",
                "changesMade": "Clipped to Kenya by EmersonEIMS (window read, native 1 km Homolosine grid, values unchanged)."},
    "grid": {"crs": "Interrupted Goode Homolosine (WGS84, ISRIC SoilGrids)", "crsWkt": crs_wkt, "resolutionM": 1000,
             "bbox": list(BBOX), "origin": [wt.c, wt.f], "pixel": [wt.a, wt.e], "width": int(win.width), "height": int(win.height),
             "note": "1 km aggregate of 250 m model predictions: regional context, not a site measurement."},
    "layers": layers, "equivalenceProof": proof, "createdBy": "EmersonEIMS (scripts in .tools/soil)", "createdOn": datetime.date.today().isoformat(),
}
(OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding="utf-8")
(OUT / "reference-points.json").write_text(json.dumps(refs, indent=1), encoding="utf-8")
print("DONE", len(layers), "layers", flush=True)
