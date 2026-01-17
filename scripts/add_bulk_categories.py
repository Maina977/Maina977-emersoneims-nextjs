import json

# Read current database
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'r') as f:
    data = json.load(f)

def add_part(category, partNo, name, brand, compat, specs, price, bulk, qty, cat_type="General", warranty="12 months", tags=None):
    """Helper to add a part to a category"""
    category["parts"].append({
        "partNo": partNo,
        "name": name,
        "brand": brand,
        "category": cat_type,
        "compatibility": compat,
        "specifications": specs,
        "pricing": {
            "currency": "KES",
            "retailPrice": price,
            "bulkPrice": bulk,
            "minimumOrder": 1 if price > 100000 else 2 if price > 40000 else 4 if price > 10000 else 6
        },
        "inventory": {
            "stock": "In Stock",
            "quantity": qty,
            "location": "Nairobi Warehouse",
            "leadTime": "Same Day" if qty > 50 else "1-2 Days" if qty > 20 else "1 Week"
        },
        "warranty": warranty,
        "tags": tags or ["spare-part", brand.lower()]
    })

#========================
# 1. ENGINE VALVES & VALVE TRAIN
#========================
valves_train = {
    "id": "valves-train",
    "name": "Valves & Valve Train Components",
    "description": "Intake/exhaust valves, valve springs, rocker arms, pushrods, camshafts",
    "parts": []
}

# Intake Valves
valve_data = [
    ("3904120", "Intake Valve - Cummins 6BT (Set of 6)", "Cummins", ["6BT5.9", "6BTA5.9"], {"headDia": "39.5mm", "length": "127mm"}, 12500, 11500, 32),
    ("3904121", "Exhaust Valve - Cummins 6BT (Set of 6)", "Cummins", ["6BT5.9", "6BTA5.9"], {"headDia": "35mm", "length": "127mm"}, 13500, 12500, 28),
    ("3921111", "Intake Valve - Cummins 4BT (Set of 4)", "Cummins", ["4BT3.9", "4BTA3.9"], {"headDia": "39.5mm", "length": "125mm"}, 9500, 8500, 35),
    ("3921112", "Exhaust Valve - Cummins 4BT (Set of 4)", "Cummins", ["4BT3.9", "4BTA3.9"], {"headDia": "35mm", "length": "125mm"}, 10500, 9500, 32),
    ("3804917", "Intake Valve - Cummins 6CT (Set of 6)", "Cummins", ["6CT8.3", "6CTA8.3"], {"headDia": "42mm", "length": "135mm"}, 15500, 14500, 24),
    ("3804918", "Exhaust Valve - Cummins 6CT (Set of 6)", "Cummins", ["6CT8.3", "6CTA8.3"], {"headDia": "38mm", "length": "135mm"}, 16500, 15500, 22),
    ("4955997", "Intake Valve - Cummins ISBe (Set of 6)", "Cummins", ["ISBe4", "ISBe6"], {"headDia": "40mm", "length": "130mm"}, 14500, 13500, 26),
    ("4955998", "Exhaust Valve - Cummins ISBe (Set of 6)", "Cummins", ["ISBe4", "ISBe6"], {"headDia": "36mm", "length": "130mm"}, 15500, 14500, 24),
    ("U5VV0012", "Intake Valve - Perkins 1104C (Set of 4)", "Perkins", ["1104C-44", "1104C-44T"], {"headDia": "38mm", "length": "122mm"}, 10500, 9500, 28),
    ("U5VV0013", "Exhaust Valve - Perkins 1104C (Set of 4)", "Perkins", ["1104C-44", "1104C-44T"], {"headDia": "33mm", "length": "122mm"}, 11500, 10500, 26),
    ("U5VV0024", "Intake Valve - Perkins 1106C (Set of 6)", "Perkins", ["1106C-E66T"], {"headDia": "38mm", "length": "122mm"}, 14500, 13500, 22),
    ("U5VV0025", "Exhaust Valve - Perkins 1106C (Set of 6)", "Perkins", ["1106C-E66T"], {"headDia": "33mm", "length": "122mm"}, 15500, 14500, 20),
    ("4115P134", "Intake Valve - Perkins 403/404 (Set of 3)", "Perkins", ["403C-15", "404C-22"], {"headDia": "32mm", "length": "105mm"}, 7500, 6800, 32),
    ("4115P135", "Exhaust Valve - Perkins 403/404 (Set of 3)", "Perkins", ["403C-15", "404C-22"], {"headDia": "28mm", "length": "105mm"}, 8500, 7800, 28),
    ("265-1678", "Intake Valve - CAT 3054 (Set of 4)", "Caterpillar", ["3054C", "3056E"], {"headDia": "39mm", "length": "125mm"}, 12500, 11500, 20),
    ("265-1679", "Exhaust Valve - CAT 3054 (Set of 4)", "Caterpillar", ["3054C", "3056E"], {"headDia": "34mm", "length": "125mm"}, 13500, 12500, 18),
    ("320-1789", "Intake Valve - CAT C6.6 (Set of 6)", "Caterpillar", ["C6.6"], {"headDia": "40mm", "length": "132mm"}, 16500, 15500, 16),
    ("320-1790", "Exhaust Valve - CAT C6.6 (Set of 6)", "Caterpillar", ["C6.6"], {"headDia": "35mm", "length": "132mm"}, 17500, 16500, 14),
]

for v in valve_data:
    add_part(valves_train, v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], "Valve")

# Valve Springs
spring_data = [
    ("3901107", "Valve Spring Kit - Cummins 6BT (12 Springs)", "Cummins", ["6BT5.9", "6BTA5.9"], {"freeLength": "65mm", "coilDia": "32mm"}, 8500, 7800, 35),
    ("3920561", "Valve Spring Kit - Cummins 4BT (8 Springs)", "Cummins", ["4BT3.9", "4BTA3.9"], {"freeLength": "65mm", "coilDia": "32mm"}, 6500, 5800, 32),
    ("3804920", "Valve Spring Kit - Cummins 6CT (12 Springs)", "Cummins", ["6CT8.3", "6CTA8.3"], {"freeLength": "68mm", "coilDia": "34mm"}, 9500, 8800, 28),
    ("4955876", "Valve Spring Kit - Cummins ISBe (12 Springs)", "Cummins", ["ISBe4", "ISBe6"], {"freeLength": "66mm", "coilDia": "33mm"}, 9850, 9000, 26),
    ("U5VK0018", "Valve Spring Kit - Perkins 1104C (8 Springs)", "Perkins", ["1104C-44"], {"freeLength": "62mm", "coilDia": "30mm"}, 7500, 6800, 28),
    ("U5VK0036", "Valve Spring Kit - Perkins 1106C (12 Springs)", "Perkins", ["1106C-E66T"], {"freeLength": "62mm", "coilDia": "30mm"}, 10500, 9500, 24),
]

for s in spring_data:
    add_part(valves_train, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], "Valve Spring")

# Rocker Arms
rocker_data = [
    ("3918959", "Rocker Arm Set - Cummins 6BT (12pcs)", "Cummins", ["6BT5.9", "6BTA5.9"], {"material": "Cast Iron", "ratio": "1:1"}, 18500, 17000, 22),
    ("3920465", "Rocker Arm Set - Cummins 4BT (8pcs)", "Cummins", ["4BT3.9", "4BTA3.9"], {"material": "Cast Iron", "ratio": "1:1"}, 14500, 13000, 20),
    ("4955789", "Rocker Arm Set - Cummins ISBe (12pcs)", "Cummins", ["ISBe4", "ISBe6"], {"material": "Steel", "ratio": "1:1"}, 22500, 21000, 18),
    ("U5RA0024", "Rocker Arm Set - Perkins 1104C (8pcs)", "Perkins", ["1104C-44"], {"material": "Cast Iron", "ratio": "1:1"}, 16500, 15000, 18),
    ("U5RA0048", "Rocker Arm Set - Perkins 1106C (12pcs)", "Perkins", ["1106C-E66T"], {"material": "Cast Iron", "ratio": "1:1"}, 19500, 18000, 16),
]

for r in rocker_data:
    add_part(valves_train, r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], "Rocker Arm")

# Pushrods
pushrod_data = [
    ("3903196", "Pushrod Set - Cummins 6BT (12pcs)", "Cummins", ["6BT5.9", "6BTA5.9"], {"length": "280mm", "diameter": "9mm"}, 12500, 11500, 26),
    ("3920789-PR", "Pushrod Set - Cummins 4BT (8pcs)", "Cummins", ["4BT3.9", "4BTA3.9"], {"length": "275mm", "diameter": "9mm"}, 9500, 8500, 24),
    ("U5PR0024", "Pushrod Set - Perkins 1104C (8pcs)", "Perkins", ["1104C-44"], {"length": "265mm", "diameter": "8.5mm"}, 10500, 9500, 22),
    ("U5PR0048", "Pushrod Set - Perkins 1106C (12pcs)", "Perkins", ["1106C-E66T"], {"length": "265mm", "diameter": "8.5mm"}, 13500, 12500, 20),
]

for p in pushrod_data:
    add_part(valves_train, p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], "Pushrod")

# Camshafts
camshaft_data = [
    ("3929017", "Camshaft - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], {"material": "Chilled Cast Iron", "lobes": "12 Lobes"}, 85000, 78000, 8),
    ("3920693", "Camshaft - Cummins 4BT", "Cummins", ["4BT3.9", "4BTA3.9"], {"material": "Chilled Cast Iron", "lobes": "8 Lobes"}, 65000, 60000, 10),
    ("3804922", "Camshaft - Cummins 6CT", "Cummins", ["6CT8.3", "6CTA8.3"], {"material": "Chilled Cast Iron", "lobes": "12 Lobes"}, 95000, 88000, 6),
    ("4955890-CM", "Camshaft - Cummins ISBe", "Cummins", ["ISBe4", "ISBe6"], {"material": "Forged Steel", "lobes": "12 Lobes"}, 125000, 115000, 5),
    ("U5CM0024", "Camshaft - Perkins 1104C", "Perkins", ["1104C-44"], {"material": "Chilled Cast Iron", "lobes": "8 Lobes"}, 72000, 66000, 8),
    ("U5CM0048", "Camshaft - Perkins 1106C", "Perkins", ["1106C-E66T"], {"material": "Chilled Cast Iron", "lobes": "12 Lobes"}, 85000, 78000, 7),
]

for c in camshaft_data:
    add_part(valves_train, c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], "Camshaft")

data["categories"][0]["subcategories"].append(valves_train)

#========================
# 2. CRANKSHAFTS & CONNECTING RODS
#========================
crank_rods = {
    "id": "crankshafts-rods",
    "name": "Crankshafts & Connecting Rods",
    "description": "Crankshafts, connecting rods, flywheel, and related components",
    "parts": []
}

# Crankshafts
crankshaft_data = [
    ("3908032", "Crankshaft - Cummins 6BT5.9", "Cummins", ["6BT5.9", "6BTA5.9"], {"material": "Forged Steel", "journals": "7 Main + 6 Rod"}, 285000, 270000, 4),
    ("3908033", "Crankshaft - Cummins 4BT3.9", "Cummins", ["4BT3.9", "4BTA3.9"], {"material": "Forged Steel", "journals": "5 Main + 4 Rod"}, 195000, 185000, 5),
    ("3804925", "Crankshaft - Cummins 6CT8.3", "Cummins", ["6CT8.3", "6CTA8.3"], {"material": "Forged Steel", "journals": "7 Main + 6 Rod"}, 325000, 310000, 3),
    ("4955876-CK", "Crankshaft - Cummins ISBe6.7", "Cummins", ["ISBe6", "QSB6.7"], {"material": "Forged Steel", "journals": "7 Main + 6 Rod"}, 385000, 365000, 3),
    ("U5CK0048", "Crankshaft - Perkins 1104C", "Perkins", ["1104C-44", "1104C-44T"], {"material": "Forged Steel", "journals": "5 Main + 4 Rod"}, 225000, 210000, 4),
    ("U5CK0096", "Crankshaft - Perkins 1106C", "Perkins", ["1106C-E66T"], {"material": "Forged Steel", "journals": "7 Main + 6 Rod"}, 285000, 270000, 3),
    ("265-2045", "Crankshaft - CAT 3054", "Caterpillar", ["3054C", "3056E"], {"material": "Forged Steel", "journals": "5 Main + 4 Rod"}, 295000, 280000, 3),
    ("320-2456", "Crankshaft - CAT C6.6", "Caterpillar", ["C6.6"], {"material": "Forged Steel", "journals": "7 Main + 6 Rod"}, 385000, 365000, 2),
]

for ck in crankshaft_data:
    add_part(crank_rods, ck[0], ck[1], ck[2], ck[3], ck[4], ck[5], ck[6], ck[7], "Crankshaft")

# Connecting Rods
conrod_data = [
    ("3901257", "Connecting Rod - Cummins 6BT (1 piece)", "Cummins", ["6BT5.9", "6BTA5.9"], {"material": "Forged Steel", "centerDistance": "192mm"}, 12500, 11500, 38),
    ("3920562", "Connecting Rod - Cummins 4BT (1 piece)", "Cummins", ["4BT3.9", "4BTA3.9"], {"material": "Forged Steel", "centerDistance": "192mm"}, 11500, 10500, 35),
    ("3901258", "Connecting Rod Set - Cummins 6BT (6 pieces)", "Cummins", ["6BT5.9", "6BTA5.9"], {"material": "Forged Steel", "complete": "With bolts & bearings"}, 68000, 63000, 12),
    ("3920563", "Connecting Rod Set - Cummins 4BT (4 pieces)", "Cummins", ["4BT3.9", "4BTA3.9"], {"material": "Forged Steel", "complete": "With bolts & bearings"}, 42000, 39000, 14),
    ("4955890-CR", "Connecting Rod - Cummins ISBe (1 piece)", "Cummins", ["ISBe4", "ISBe6"], {"material": "Forged Steel", "centerDistance": "205mm"}, 14500, 13500, 28),
    ("U5CR0024", "Connecting Rod - Perkins 1104C (1 piece)", "Perkins", ["1104C-44"], {"material": "Forged Steel", "centerDistance": "185mm"}, 13500, 12500, 32),
    ("U5CR0048", "Connecting Rod - Perkins 1106C (1 piece)", "Perkins", ["1106C-E66T"], {"material": "Forged Steel", "centerDistance": "185mm"}, 14500, 13500, 28),
    ("265-1890-CR", "Connecting Rod - CAT 3054 (1 piece)", "Caterpillar", ["3054C", "3056E"], {"material": "Forged Steel", "centerDistance": "180mm"}, 15500, 14500, 24),
    ("320-1890-CR", "Connecting Rod - CAT C6.6 (1 piece)", "Caterpillar", ["C6.6"], {"material": "Forged Steel", "centerDistance": "200mm"}, 17500, 16500, 20),
]

for cr in conrod_data:
    add_part(crank_rods, cr[0], cr[1], cr[2], cr[3], cr[4], cr[5], cr[6], cr[7], "Connecting Rod")

# Flywheels
flywheel_data = [
    ("3934906", "Flywheel - Cummins 6BT (14 inch)", "Cummins", ["6BT5.9", "6BTA5.9"], {"diameter": "14 inch", "teeth": "153"}, 95000, 88000, 6),
    ("3920789-FW", "Flywheel - Cummins 4BT (14 inch)", "Cummins", ["4BT3.9", "4BTA3.9"], {"diameter": "14 inch", "teeth": "127"}, 75000, 70000, 8),
    ("3804926", "Flywheel - Cummins 6CT (16 inch)", "Cummins", ["6CT8.3", "6CTA8.3"], {"diameter": "16 inch", "teeth": "168"}, 125000, 115000, 4),
    ("U5FW0024", "Flywheel - Perkins 1104C (13 inch)", "Perkins", ["1104C-44"], {"diameter": "13 inch", "teeth": "122"}, 65000, 60000, 7),
    ("U5FW0048", "Flywheel - Perkins 1106C (14 inch)", "Perkins", ["1106C-E66T"], {"diameter": "14 inch", "teeth": "138"}, 85000, 78000, 6),
]

for fw in flywheel_data:
    add_part(crank_rods, fw[0], fw[1], fw[2], fw[3], fw[4], fw[5], fw[6], fw[7], "Flywheel")

# Flywheel Ring Gears
ring_gear_data = [
    ("3934907", "Flywheel Ring Gear - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], {"teeth": "153 Teeth", "module": "2.5"}, 12500, 11500, 18),
    ("3920790", "Flywheel Ring Gear - Cummins 4BT", "Cummins", ["4BT3.9", "4BTA3.9"], {"teeth": "127 Teeth", "module": "2.5"}, 9500, 8500, 22),
    ("U5RG0024", "Flywheel Ring Gear - Perkins 1104C", "Perkins", ["1104C-44"], {"teeth": "122 Teeth", "module": "2.0"}, 8500, 7800, 20),
]

for rg in ring_gear_data:
    add_part(crank_rods, rg[0], rg[1], rg[2], rg[3], rg[4], rg[5], rg[6], rg[7], "Ring Gear")

data["categories"][0]["subcategories"].append(crank_rods)

#========================
# 3. CYLINDER LINERS & SLEEVES
#========================
liners = {
    "id": "cylinder-liners",
    "name": "Cylinder Liners & Sleeves",
    "description": "Wet and dry cylinder liners, liner kits, and installation tools",
    "parts": []
}

# Cylinder Liners
liner_data = [
    ("3802230", "Cylinder Liner Kit - Cummins 6BT (6pcs)", "Cummins", ["6BT5.9", "6BTA5.9"], {"bore": "102mm", "type": "Wet Liner", "flange": "Yes"}, 45000, 42000, 16),
    ("3920478", "Cylinder Liner Kit - Cummins 4BT (4pcs)", "Cummins", ["4BT3.9", "4BTA3.9"], {"bore": "102mm", "type": "Wet Liner", "flange": "Yes"}, 32000, 30000, 18),
    ("3804928", "Cylinder Liner Kit - Cummins 6CT (6pcs)", "Cummins", ["6CT8.3", "6CTA8.3"], {"bore": "114mm", "type": "Wet Liner", "flange": "Yes"}, 55000, 52000, 12),
    ("4955890-CL", "Cylinder Liner Kit - Cummins ISBe (6pcs)", "Cummins", ["ISBe4", "ISBe6"], {"bore": "107mm", "type": "Wet Liner", "flange": "Yes"}, 52000, 48000, 14),
    ("U5LN0024", "Cylinder Liner Kit - Perkins 1104C (4pcs)", "Perkins", ["1104C-44"], {"bore": "105mm", "type": "Wet Liner", "flange": "Yes"}, 38000, 35000, 15),
    ("U5LN0048", "Cylinder Liner Kit - Perkins 1106C (6pcs)", "Perkins", ["1106C-E66T"], {"bore": "105mm", "type": "Wet Liner", "flange": "Yes"}, 48000, 45000, 13),
    ("4115P178", "Cylinder Liner Kit - Perkins 403/404 (3pcs)", "Perkins", ["403C-15", "404C-22"], {"bore": "84mm", "type": "Wet Liner", "flange": "Yes"}, 22000, 20000, 20),
    ("265-2134", "Cylinder Liner Kit - CAT 3054 (4pcs)", "Caterpillar", ["3054C", "3056E"], {"bore": "94mm", "type": "Dry Liner", "flange": "No"}, 42000, 39000, 12),
    ("320-2567", "Cylinder Liner Kit - CAT C6.6 (6pcs)", "Caterpillar", ["C6.6"], {"bore": "105mm", "type": "Dry Liner", "flange": "No"}, 58000, 54000, 10),
]

for ln in liner_data:
    add_part(liners, ln[0], ln[1], ln[2], ln[3], ln[4], ln[5], ln[6], ln[7], "Cylinder Liner")

# Liner O-Ring Kits
liner_oring_data = [
    ("3802682", "Liner O-Ring Kit - Cummins 6BT (Complete)", "Cummins", ["6BT5.9", "6BTA5.9"], {"quantity": "18 O-Rings", "material": "Viton"}, 4500, 4000, 38),
    ("3920792", "Liner O-Ring Kit - Cummins 4BT (Complete)", "Cummins", ["4BT3.9", "4BTA3.9"], {"quantity": "12 O-Rings", "material": "Viton"}, 3500, 3200, 42),
    ("U5LO0024", "Liner O-Ring Kit - Perkins 1104C (Complete)", "Perkins", ["1104C-44"], {"quantity": "12 O-Rings", "material": "Viton"}, 3850, 3500, 35),
    ("U5LO0048", "Liner O-Ring Kit - Perkins 1106C (Complete)", "Perkins", ["1106C-E66T"], {"quantity": "18 O-Rings", "material": "Viton"}, 4850, 4500, 32),
]

for lo in liner_oring_data:
    add_part(liners, lo[0], lo[1], lo[2], lo[3], lo[4], lo[5], lo[6], lo[7], "O-Ring Kit")

data["categories"][0]["subcategories"].append(liners)

# Write final database
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'w') as f:
    json.dump(data, f, indent=2)

# Count and report
total_parts = sum(len(subcat["parts"]) for subcat in data["categories"][0]["subcategories"])
print(f"\n=== BULK CATEGORIES ADDED ===")
print(f"Total Parts Now: {total_parts}")
print(f"\nNew Categories:")
print(f"  - Valves & Valve Train: {len(valves_train['parts'])} parts")
print(f"  - Crankshafts & Connecting Rods: {len(crank_rods['parts'])} parts")
print(f"  - Cylinder Liners: {len(liners['parts'])} parts")
