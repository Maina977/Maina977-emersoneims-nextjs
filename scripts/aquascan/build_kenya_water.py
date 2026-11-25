"""Build kenyaWater.ts: OSM lake/reservoir polygons (ODbL) + Natural Earth 10m land on the Kenyan coast (public domain).

Usage: python build_kenya_water.py <data dir> <output kenyaWater.ts>
<data dir> holds: kelakes_bb.json (Overpass, kenya_water_overpass_names.overpassql: names + bounding boxes),
kelakes_geom.json (Overpass, kenya_water_overpass_geom.overpassql: geometry of the selected ids) and
ne_10m_land.geojson (https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_land.geojson).
Built 2026-11-25 (re-review of 126efdbc, M-2).
"""
import json, sys, math
D = sys.argv[1]
OUT = sys.argv[2]
TOL = 0.0012   # Douglas-Peucker tolerance in degrees (~130 m)

def dp(pts, tol):
    if len(pts) < 4: return pts
    keep = [False] * len(pts); keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = pts[a]; bx, by = pts[b]
        dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy)
        best, bi = -1, -1
        for i in range(a + 1, b):
            px, py = pts[i]
            d = abs(dy * (px - ax) - dx * (py - ay)) / L if L > 0 else math.hypot(px - ax, py - ay)
            if d > best: best, bi = d, i
        if best > tol:
            keep[bi] = True; stack.append((a, bi)); stack.append((bi, b))
    return [p for p, k in zip(pts, keep) if k]

def simplify_ring(r, tol):
    if r[0] != r[-1]: r = r + [r[0]]
    # split closed ring in two halves so DP has distinct endpoints
    m = len(r) // 2
    s = dp(r[:m + 1], tol)[:-1] + dp(r[m:], tol)
    return s if len(s) >= 4 else None

def clip(ring, x0, y0, x1, y1):
    """Sutherland-Hodgman against an axis-aligned box (output fine for even-odd point tests)."""
    def run(pts, inside, inter):
        out = []
        for i in range(len(pts)):
            cur, prev = pts[i], pts[i - 1]
            if inside(cur):
                if not inside(prev): out.append(inter(prev, cur))
                out.append(cur)
            elif inside(prev): out.append(inter(prev, cur))
        return out
    def ix(x):
        return lambda p, q: (x, p[1] + (q[1] - p[1]) * (x - p[0]) / (q[0] - p[0]))
    def iy(y):
        return lambda p, q: (p[0] + (q[0] - p[0]) * (y - p[1]) / (q[1] - p[1]), y)
    pts = [tuple(p) for p in ring]
    pts = run(pts, lambda p: p[0] >= x0, ix(x0)) if pts else pts
    pts = run(pts, lambda p: p[0] <= x1, ix(x1)) if pts else pts
    pts = run(pts, lambda p: p[1] >= y0, iy(y0)) if pts else pts
    pts = run(pts, lambda p: p[1] <= y1, iy(y1)) if pts else pts
    return [list(p) for p in pts]

def assemble(ways):
    """Join way segments (lists of (lon,lat)) into closed rings."""
    segs = [list(w) for w in ways if len(w) >= 2]
    rings = []
    while segs:
        cur = segs.pop()
        changed = True
        while cur[0] != cur[-1] and changed:
            changed = False
            for i, s in enumerate(segs):
                if s[0] == cur[-1]: cur += s[1:]
                elif s[-1] == cur[-1]: cur += s[::-1][1:]
                elif s[-1] == cur[0]: cur = s + cur[1:]
                elif s[0] == cur[0]: cur = s[::-1] + cur[1:]
                else: continue
                segs.pop(i); changed = True; break
        if cur[0] == cur[-1] and len(cur) >= 4: rings.append(cur)
    return rings

g = json.load(open(D + '/kelakes_geom.json', encoding='utf-8'))
bb = {e['id']: e for e in json.load(open(D + '/kelakes_bb.json', encoding='utf-8'))['elements']}
water = []
VIC_BOX = (33.85, -1.10, 35.00, 0.45)   # the Kenyan part of Lake Victoria (Winam Gulf and the open lake to the border)
for e in g['elements']:
    t = e.get('tags', {})
    if t.get('intermittent') == 'yes': continue
    name = t.get('name', '?')
    if e['type'] == 'way':
        rings = [[(n['lon'], n['lat']) for n in e['geometry']]]
        if rings[0][0] != rings[0][-1]: continue
    else:
        outer = [[(n['lon'], n['lat']) for n in m['geometry']] for m in e['members'] if m['type'] == 'way' and m.get('role') in ('outer', '') and 'geometry' in m]
        inner = [[(n['lon'], n['lat']) for n in m['geometry']] for m in e['members'] if m['type'] == 'way' and m.get('role') == 'inner' and 'geometry' in m]
        rings = assemble(outer) + assemble(inner)
    out = []
    for r in rings:
        r = [list(p) for p in r]
        if name == 'Lake Victoria':
            xs = [p[0] for p in r]; ys = [p[1] for p in r]
            if max(xs) < VIC_BOX[0] or min(xs) > VIC_BOX[2] or max(ys) < VIC_BOX[1] or min(ys) > VIC_BOX[3]: continue
            r = clip(r, *VIC_BOX)
            if len(r) < 4: continue
        s = simplify_ring(r, TOL)
        if not s: continue
        # drop islets/holes under ~0.3 km2 (shoelace, deg2 -> km2 ~ 12321)
        a = abs(sum(s[i][0] * s[i - 1][1] - s[i - 1][0] * s[i][1] for i in range(len(s)))) / 2 * 12321
        if a < 0.3: continue
        out.append([[round(x, 4), round(y, 4)] for x, y in s])
    if out:
        water.append({'name': name, 'kind': t.get('water', 'lake'), 'osm': f"{e['type']}/{e['id']}", 'rings': out})

# Natural Earth 10 m land, clipped to the Kenyan coast
COAST = (38.9, -4.85, 41.9, -1.45)
land = []
ne = json.load(open(D + '/ne_10m_land.geojson', encoding='utf-8'))
for f in ne['features']:
    geom = f['geometry']
    polys = [geom['coordinates']] if geom['type'] == 'Polygon' else geom['coordinates']
    for poly in polys:
        for r in poly:
            xs = [p[0] for p in r]; ys = [p[1] for p in r]
            if max(xs) < COAST[0] or min(xs) > COAST[2] or max(ys) < COAST[1] or min(ys) > COAST[3]: continue
            c = clip(r, *COAST)
            if len(c) < 4: continue
            s = simplify_ring(c, 0.002)
            if s: land.append([[round(x, 4), round(y, 4)] for x, y in s])

n = sum(len(r) for w in water for r in w['rings'])
print('water bodies', len(water), 'points', n, '| coast land rings', len(land), 'points', sum(len(r) for r in land))
for w in water: print(' ', w['name'], w['kind'], w['osm'], len(w['rings']), sum(len(r) for r in w['rings']))

def js(x): return json.dumps(x, separators=(',', ':'), ensure_ascii=True)
with open(OUT, 'w', encoding='utf-8', newline='\n') as fh:
    fh.write('''/**
 * Kenyan open water for the offline water-body check (re-review of 126efdbc, M-2, 2026-11-25).
 * GENERATED by scripts/aquascan/build_kenya_water.py; rebuild from the sources, do not edit by hand.
 *
 * - LAKES and RESERVOIRS: OpenStreetMap natural=water polygons (water=lake|reservoir, or named
 *   "Lake ..."), named, perennial (intermittent=yes dropped), bounding box over ~3 km2; queried via
 *   the Overpass API on 2026-11-25. (c) OpenStreetMap contributors, Open Database Licence (ODbL) 1.0,
 *   https://www.openstreetmap.org/copyright . Lake Victoria is clipped to the Kenyan part.
 *   Simplified (Douglas-Peucker, 0.0012 deg ~ 130 m); islands and holes under ~0.3 km2 dropped.
 * - COAST: Natural Earth 10 m land polygons (public domain, https://www.naturalearthdata.com/about/terms-of-use/),
 *   clipped to the Kenyan coast 38.9..41.9 E, 4.85..1.45 S and simplified (0.002 deg ~ 220 m).
 * Coordinates are [lon, lat].
 */
export interface WaterBody { name: string; kind: string; osm: string; rings: [number, number][][] }
''')
    fh.write('export const KENYA_WATER: WaterBody[] = ' + js(water) + ';\n')
    fh.write('export const KENYA_COAST_BOX: [number, number, number, number] = ' + js(list(COAST)) + ';\n')
    fh.write('export const KENYA_COAST_LAND: [number, number][][] = ' + js(land) + ';\n')
print('written')
