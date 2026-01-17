import json

# Read current database
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'r') as f:
    data = json.load(f)

def quick_add(cat, pn, name, brand, compat, price, bulk, qty, cat_type="Part"):
    """Simplified part addition"""
    cat["parts"].append({
        "partNo": pn,
        "name": name,
        "brand": brand,
        "category": cat_type,
        "compatibility": compat,
        "specifications": {"type": "OEM Specification", "quality": "Premium Grade"},
        "pricing": {"currency": "KES", "retailPrice": price, "bulkPrice": bulk, "minimumOrder": 4},
        "inventory": {"stock": "In Stock", "quantity": qty, "location": "Nairobi Warehouse", "leadTime": "1-2 Days" if qty > 20 else "1 Week"},
        "warranty": "12 months",
        "tags": ["spare-part", brand.lower()]
    })

#=== ENGINE BLOCK & COMPONENTS ===
engine_block = {"id": "engine-block", "name": "Engine Blocks & Core Components", "description": "Engine blocks, cylinder heads, oil pans", "parts": []}
block_parts = [
    ("3903920", "Cylinder Head - Cummins 6BT Complete", "Cummins", ["6BT5.9", "6BTA5.9"], 185000, 175000, 5),
    ("3920695", "Cylinder Head - Cummins 4BT Complete", "Cummins", ["4BT3.9", "4BTA3.9"], 145000, 135000, 6),
    ("3804930", "Cylinder Head - Cummins 6CT Complete", "Cummins", ["6CT8.3", "6CTA8.3"], 225000, 210000, 4),
    ("4955990", "Cylinder Head - Cummins ISBe Complete", "Cummins", ["ISBe4", "ISBe6"], 265000, 250000, 3),
    ("U5CH0048", "Cylinder Head - Perkins 1104C Complete", "Perkins", ["1104C-44"], 165000, 155000, 5),
    ("U5CH0096", "Cylinder Head - Perkins 1106C Complete", "Perkins", ["1106C-E66T"], 195000, 185000, 4),
    ("265-2345", "Cylinder Head - CAT 3054 Complete", "Caterpillar", ["3054C", "3056E"], 215000, 205000, 3),
    ("3901206", "Oil Pan - Cummins 6BT Steel", "Cummins", ["6BT5.9", "6BTA5.9"], 28500, 26000, 14),
    ("3920798", "Oil Pan - Cummins 4BT Steel", "Cummins", ["4BT3.9", "4BTA3.9"], 22500, 20000, 16),
    ("U5OP0024", "Oil Pan - Perkins 1104C", "Perkins", ["1104C-44"], 24500, 22000, 15),
]
for p in block_parts:
    quick_add(engine_block, p[0], p[1], p[2], p[3], p[4], p[5], p[6])
data["categories"][0]["subcategories"].append(engine_block)

#=== TIMING GEARS & CHAINS ===
timing = {"id": "timing-gears", "name": "Timing Gears, Chains & Tensioners", "description": "Timing gears, gear trains, tensioners, timing covers", "parts": []}
timing_parts = [
    ("3901095", "Camshaft Gear - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 18500, 17000, 22),
    ("3901096", "Crankshaft Gear - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 16500, 15000, 24),
    ("3901097", "Idler Gear - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 14500, 13000, 26),
    ("3920801", "Camshaft Gear - Cummins 4BT", "Cummins", ["4BT3.9", "4BTA3.9"], 15500, 14000, 24),
    ("3920802", "Crankshaft Gear - Cummins 4BT", "Cummins", ["4BT3.9", "4BTA3.9"], 13500, 12000, 26),
    ("4955892", "Timing Gear Set - Cummins ISBe (Complete)", "Cummins", ["ISBe4", "ISBe6"], 42000, 39000, 12),
    ("U5TG0024", "Timing Gear Set - Perkins 1104C", "Perkins", ["1104C-44"], 35000, 32000, 14),
    ("U5TG0048", "Timing Gear Set - Perkins 1106C", "Perkins", ["1106C-E66T"], 38000, 35000, 13),
    ("3901250", "Front Gear Cover - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 32000, 30000, 10),
    ("3920805", "Front Gear Cover - Cummins 4BT", "Cummins", ["4BT3.9", "4BTA3.9"], 25000, 23000, 12),
]
for p in timing_parts:
    quick_add(timing, p[0], p[1], p[2], p[3], p[4], p[5], p[6])
data["categories"][0]["subcategories"].append(timing)

#=== OIL PUMPS & LUBRICATION ===
oil_system = {"id": "oil-pumps", "name": "Oil Pumps & Lubrication System", "description": "Oil pumps, oil coolers, oil pressure regulators", "parts": []}
oil_parts = [
    ("3803698", "Oil Pump - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 42000, 39000, 14),
    ("3920806", "Oil Pump - Cummins 4BT", "Cummins", ["4BT3.9", "4BTA3.9"], 35000, 32000, 16),
    ("3804932", "Oil Pump - Cummins 6CT", "Cummins", ["6CT8.3", "6CTA8.3"], 48000, 45000, 12),
    ("4955893", "Oil Pump - Cummins ISBe", "Cummins", ["ISBe4", "ISBe6"], 52000, 48000, 11),
    ("U5OP0024-P", "Oil Pump - Perkins 1104C", "Perkins", ["1104C-44"], 38000, 35000, 14),
    ("U5OP0048-P", "Oil Pump - Perkins 1106C", "Perkins", ["1106C-E66T"], 42000, 39000, 13),
    ("265-2456", "Oil Pump - CAT 3054", "Caterpillar", ["3054C", "3056E"], 45000, 42000, 10),
    ("320-2678", "Oil Pump - CAT C6.6", "Caterpillar", ["C6.6"], 58000, 54000, 8),
    ("3968190", "Oil Cooler - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 28500, 26000, 16),
    ("3920808", "Oil Cooler - Cummins 4BT", "Cummins", ["4BT3.9", "4BTA3.9"], 22500, 20000, 18),
    ("4955894", "Oil Cooler - Cummins ISBe", "Cummins", ["ISBe4", "ISBe6"], 32000, 30000, 14),
    ("U5OC0024", "Oil Cooler - Perkins 1104C", "Perkins", ["1104C-44"], 24500, 22000, 16),
    ("U5OC0048", "Oil Cooler - Perkins 1106C", "Perkins", ["1106C-E66T"], 28000, 26000, 14),
]
for p in oil_parts:
    quick_add(oil_system, p[0], p[1], p[2], p[3], p[4], p[5], p[6])
data["categories"][0]["subcategories"].append(oil_system)

#=== EXHAUST SYSTEM ===
exhaust = {"id": "exhaust-system", "name": "Exhaust System Components", "description": "Exhaust manifolds, mufflers, flex pipes, clamps", "parts": []}
exhaust_parts = [
    ("3925540", "Exhaust Manifold - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 32000, 30000, 14),
    ("3929164", "Exhaust Manifold - Cummins 4BT", "Cummins", ["4BT3.9", "4BTA3.9"], 24500, 22000, 16),
    ("3804934", "Exhaust Manifold - Cummins 6CT", "Cummins", ["6CT8.3", "6CTA8.3"], 38000, 35000, 12),
    ("U5EM0024", "Exhaust Manifold - Perkins 1104C", "Perkins", ["1104C-44"], 27000, 25000, 14),
    ("U5EM0048", "Exhaust Manifold - Perkins 1106C", "Perkins", ["1106C-E66T"], 35000, 32000, 11),
    ("EXH-MUF-20", "Generator Muffler - 20kVA (2 inch)", "Universal", ["20-30kVA Gensets"], 8500, 7800, 35),
    ("EXH-MUF-50", "Generator Muffler - 50kVA (3 inch)", "Universal", ["40-75kVA Gensets"], 12500, 11500, 28),
    ("EXH-MUF-100", "Generator Muffler - 100kVA (4 inch)", "Universal", ["80-150kVA Gensets"], 18500, 17000, 22),
    ("EXH-MUF-200", "Generator Muffler - 200kVA (5 inch)", "Universal", ["150-300kVA Gensets"], 28500, 26000, 15),
    ("EXH-FLEX-2", "Exhaust Flex Pipe - 2 inch", "Universal", ["Universal"], 3850, 3500, 55),
    ("EXH-FLEX-3", "Exhaust Flex Pipe - 3 inch", "Universal", ["Universal"], 4850, 4500, 48),
    ("EXH-FLEX-4", "Exhaust Flex Pipe - 4 inch", "Universal", ["Universal"], 6500, 5800, 42),
    ("EXH-CLAMP-2", "Exhaust Clamp - 2 inch", "Universal", ["Universal"], 850, 750, 125),
    ("EXH-CLAMP-3", "Exhaust Clamp - 3 inch", "Universal", ["Universal"], 950, 850, 115),
    ("EXH-CLAMP-4", "Exhaust Clamp - 4 inch", "Universal", ["Universal"], 1150, 1000, 105),
]
for p in exhaust_parts:
    quick_add(exhaust, p[0], p[1], p[2], p[3], p[4], p[5], p[6])
data["categories"][0]["subcategories"].append(exhaust)

#=== BELTS & PULLEYS ===
belts = {"id": "belts-pulleys", "name": "Belts, Pulleys & Tensioners", "description": "V-belts, serpentine belts, pulleys, tensioners", "parts": []}
belt_parts = [
    ("3911574", "Fan Belt - Cummins 4BT (8PK1750)", "Gates", ["4BT3.9"], 1650, 1450, 145),
    ("3924147", "Fan Belt - Cummins 6BT (10PK2050)", "Gates", ["6BT5.9", "6BTA5.9"], 1850, 1650, 155),
    ("3935949", "Fan Belt - Cummins 6CT (10PK2250)", "Gates", ["6CT8.3", "6CTA8.3"], 2050, 1850, 125),
    ("4955895", "Serpentine Belt - Cummins ISBe (8PK2100)", "Gates", ["ISBe4", "ISBe6"], 2250, 2050, 115),
    ("UB-1104C", "Fan Belt - Perkins 1104C (8PK1850)", "Gates", ["1104C-44"], 1750, 1550, 135),
    ("UB-1106C", "Fan Belt - Perkins 1106C (10PK2100)", "Gates", ["1106C-E66T"], 1950, 1750, 125),
    ("VBELT-A56", "V-Belt A-56 (Honda GX Series)", "Mitsuboshi", ["Honda GX160-390"], 650, 550, 185),
    ("VBELT-A68", "V-Belt A-68 (Small Gensets)", "Mitsuboshi", ["Universal Small"], 750, 650, 165),
    ("3936213", "Crankshaft Pulley - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 15500, 14000, 18),
    ("3920812", "Crankshaft Pulley - Cummins 4BT", "Cummins", ["4BT3.9"], 12500, 11500, 22),
    ("3936214", "Water Pump Pulley - Cummins 6BT", "Cummins", ["6BT5.9"], 8500, 7800, 32),
    ("3920813", "Water Pump Pulley - Cummins 4BT", "Cummins", ["4BT3.9"], 7500, 6800, 35),
    ("3936215", "Alternator Pulley - Cummins 6BT", "Cummins", ["6BT5.9"], 6500, 5800, 42),
    ("3920814", "Alternator Pulley - Cummins 4BT", "Cummins", ["4BT3.9"], 5500, 4950, 45),
    ("3901290", "Belt Tensioner - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 14500, 13000, 24),
    ("4955896", "Belt Tensioner - Cummins ISBe", "Cummins", ["ISBe4", "ISBe6"], 16500, 15000, 20),
]
for p in belt_parts:
    quick_add(belts, p[0], p[1], p[2], p[3], p[4], p[5], p[6])
data["categories"][0]["subcategories"].append(belts)

#=== HOSES & CLAMPS ===
hoses = {"id": "hoses-clamps", "name": "Hoses, Pipes & Clamps", "description": "Radiator hoses, fuel hoses, air hoses, hydraulic hoses, clamps", "parts": []}
hose_parts = [
    ("3901303", "Upper Radiator Hose - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 4500, 4000, 48),
    ("3901304", "Lower Radiator Hose - Cummins 6BT", "Cummins", ["6BT5.9", "6BTA5.9"], 4500, 4000, 45),
    ("3920816", "Upper Radiator Hose - Cummins 4BT", "Cummins", ["4BT3.9"], 3850, 3500, 52),
    ("3920817", "Lower Radiator Hose - Cummins 4BT", "Cummins", ["4BT3.9"], 3850, 3500, 50),
    ("UH-1104C-U", "Upper Radiator Hose - Perkins 1104C", "Perkins", ["1104C-44"], 4250, 3850, 45),
    ("UH-1104C-L", "Lower Radiator Hose - Perkins 1104C", "Perkins", ["1104C-44"], 4250, 3850, 42),
    ("UH-1106C-U", "Upper Radiator Hose - Perkins 1106C", "Perkins", ["1106C-E66T"], 4850, 4500, 38),
    ("UH-1106C-L", "Lower Radiator Hose - Perkins 1106C", "Perkins", ["1106C-E66T"], 4850, 4500, 36),
    ("HOSE-FUEL-6", "Fuel Hose - 6mm ID (Per Meter)", "Universal", ["Universal"], 450, 400, 250),
    ("HOSE-FUEL-8", "Fuel Hose - 8mm ID (Per Meter)", "Universal", ["Universal"], 550, 500, 230),
    ("HOSE-FUEL-10", "Fuel Hose - 10mm ID (Per Meter)", "Universal", ["Universal"], 650, 580, 210),
    ("HOSE-AIR-38", "Air Intake Hose - 38mm (Per Meter)", "Universal", ["Universal"], 1250, 1100, 145),
    ("HOSE-AIR-50", "Air Intake Hose - 50mm (Per Meter)", "Universal", ["Universal"], 1450, 1300, 135),
    ("HOSE-AIR-63", "Air Intake Hose - 63mm (Per Meter)", "Universal", ["Universal"], 1750, 1550, 120),
    ("HOSE-HYD-10", "Hydraulic Hose - 10mm (Per Meter)", "Universal", ["Universal"], 850, 750, 180),
    ("HOSE-HYD-12", "Hydraulic Hose - 12mm (Per Meter)", "Universal", ["Universal"], 950, 850, 165),
    ("CLAMP-16-25", "Hose Clamp - 16-25mm", "Universal", ["Universal"], 150, 130, 350),
    ("CLAMP-25-40", "Hose Clamp - 25-40mm", "Universal", ["Universal"], 180, 150, 325),
    ("CLAMP-40-60", "Hose Clamp - 40-60mm", "Universal", ["Universal"], 220, 180, 285),
    ("CLAMP-60-80", "Hose Clamp - 60-80mm", "Universal", ["Universal"], 280, 230, 245),
]
for p in hose_parts:
    quick_add(hoses, p[0], p[1], p[2], p[3], p[4], p[5], p[6])
data["categories"][0]["subcategories"].append(hoses)

# Write and count
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'w') as f:
    json.dump(data, f, indent=2)

total = sum(len(sc["parts"]) for sc in data["categories"][0]["subcategories"])
print(f"\n=== EXPANSION COMPLETE ===")
print(f"Total Parts: {total}")
print(f"Target: 1247")
print(f"Remaining: {1247 - total}")
