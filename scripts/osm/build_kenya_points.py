"""
Builds the offline Kenya point-feature index from a Geofabrik OSM extract.

Free; no service calls at run time. Introduced 2026-11-20 because the public
Overpass servers timed out for six days running.

Input:  kenya-latest.osm.pbf (Geofabrik, ODbL 1.0) and its .md5.
Output: data/osm/kenya-points-v1/points.json.gz and manifest.json.

Each point is [lat, lon, kind, name | null, extra | null], where extra holds
only the tags a mapper recorded (depth, pump:output, water_level,
start_date, operational_status). Nothing is inferred or filled.

Kinds:
- water_well, borehole, hand_pump, powered_pump: the nearby-boreholes tool;
- water_tap, power_pole, manhole: site-analysis infrastructure;
- hospital, school, shop, police, bus_stop: site-analysis amenities.

Usage (tools venv):
    python scripts/osm/build_kenya_points.py <kenya-latest.osm.pbf> <out_dir>

Licence of the output: ODbL 1.0 (derived database). Credit:
"© OpenStreetMap contributors".
"""
import gzip, hashlib, json, os, sys, time
import osmium

KEEP_EXTRA = ("depth", "pump:output", "water_level", "start_date", "operational_status")


def classify(tags):
    t = {k: v for k, v in tags}
    if t.get("man_made") == "water_well":
        return "water_well", t
    if t.get("waterway") == "borehole":
        return "borehole", t
    if t.get("pump") == "manual":
        return "hand_pump", t
    if t.get("pump") == "powered":
        return "powered_pump", t
    if t.get("man_made") == "water_tap":
        return "water_tap", t
    if t.get("power") == "pole":
        return "power_pole", t
    if t.get("man_made") == "manhole":
        return "manhole", t
    a = t.get("amenity")
    if a in ("hospital", "school", "police"):
        return a, t
    if "shop" in t:
        return "shop", t
    if t.get("highway") == "bus_stop":
        return "bus_stop", t
    return None, t


class Points(osmium.SimpleHandler):
    def __init__(self):
        super().__init__()
        self.rows = []

    def node(self, n):
        if not n.tags:
            return
        kind, t = classify(n.tags)
        if not kind or not n.location.valid():
            return
        extra = {k: t[k] for k in KEEP_EXTRA if k in t} or None
        self.rows.append([round(n.location.lat, 6), round(n.location.lon, 6), kind, t.get("name"), extra])


def main(pbf, out_dir):
    t0 = time.time()
    md5_expected = None
    if os.path.exists(pbf + ".md5"):
        md5_expected = open(pbf + ".md5").read().split()[0]
    h = hashlib.md5()
    with open(pbf, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    if md5_expected and h.hexdigest() != md5_expected:
        sys.exit(f"MD5 mismatch: {h.hexdigest()} != {md5_expected}")
    p = Points()
    p.apply_file(pbf, locations=False)
    os.makedirs(out_dir, exist_ok=True)
    data = json.dumps(p.rows, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    gz = gzip.compress(data, compresslevel=9, mtime=0)
    with open(os.path.join(out_dir, "points.json.gz"), "wb") as f:
        f.write(gz)
    counts = {}
    for r in p.rows:
        counts[r[2]] = counts.get(r[2], 0) + 1
    manifest = {
        "dataset": "kenya-points-v1",
        "source": "OpenStreetMap via Geofabrik kenya-latest.osm.pbf",
        "sourceMd5": h.hexdigest(),
        "sourceBytes": os.path.getsize(pbf),
        "sourceLastModified": os.environ.get("PBF_LAST_MODIFIED", ""),
        "licence": "ODbL 1.0 (derived database)",
        "attribution": "© OpenStreetMap contributors",
        "builtOn": time.strftime("%Y-%m-%d"),
        "points": len(p.rows),
        "byKind": counts,
        "outputSha256": hashlib.sha256(gz).hexdigest(),
        "outputBytes": len(gz),
        "row": "[lat, lon, kind, name|null, extra|null]",
        "note": "Only mapped features; most Kenyan boreholes are not in OpenStreetMap. Values only as tagged by mappers.",
        "buildSeconds": round(time.time() - t0, 1),
    }
    with open(os.path.join(out_dir, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=1, ensure_ascii=False)
    print(json.dumps(manifest, indent=1))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
