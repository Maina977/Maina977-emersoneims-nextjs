import json

# Read the current database
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'r') as f:
    data = json.load(f)

# Helper function to add parts
def add_part(category, part_data):
    category["parts"].append({
        "partNo": part_data["partNo"],
        "name": part_data["name"],
        "brand": part_data["brand"],
        "category": part_data.get("cat", "General"),
        "compatibility": part_data["compat"],
        "specifications": part_data.get("specs", {}),
        "pricing": {
            "currency": "KES",
            "retailPrice": part_data["price"],
            "bulkPrice": part_data["bulk"],
            "minimumOrder": part_data.get("minOrder", 4)
        },
        "inventory": {
            "stock": "In Stock",
            "quantity": part_data["qty"],
            "location": "Nairobi Warehouse",
            "leadTime": "Same Day" if part_data["qty"] > 50 else "1-2 Days" if part_data["qty"] > 20 else "1 Week"
        },
        "warranty": part_data.get("warranty", "12 months"),
        "tags": part_data.get("tags", ["spare-part"])
    })

# Add Bearings & Seals Category (100+ parts)
bearings_seals = {
    "id": "bearings-seals",
    "name": "Bearings, Seals & Gaskets",
    "description": "Engine bearings, crankshaft seals, gaskets, and O-rings",
    "parts": []
}

# Main Bearings - Multiple sizes
bearing_parts = [
    {"partNo": "3802070", "name": "Main Bearing Set - Cummins 6BT STD", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 18500, "bulk": 17000, "qty": 32},
    {"partNo": "3802071", "name": "Main Bearing Set - Cummins 6BT 0.25mm US", "brand": "Cummins", "compat": ["6BT5.9"], "specs": {"size": "0.25mm US", "material": "Tri-Metal"}, "price": 18500, "bulk": 17000, "qty": 28},
    {"partNo": "3802072", "name": "Main Bearing Set - Cummins 6BT 0.50mm US", "brand": "Cummins", "compat": ["6BT5.9"], "specs": {"size": "0.50mm US", "material": "Tri-Metal"}, "price": 18500, "bulk": 17000, "qty": 24},
    {"partNo": "3802073", "name": "Main Bearing Set - Cummins 6BT 0.75mm US", "brand": "Cummins", "compat": ["6BT5.9"], "specs": {"size": "0.75mm US", "material": "Tri-Metal"}, "price": 18500, "bulk": 17000, "qty": 18},
    {"partNo": "3802564", "name": "Main Bearing Set - Cummins 4BT STD", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 14500, "bulk": 13000, "qty": 22},
    {"partNo": "3802565", "name": "Main Bearing Set - Cummins 4BT 0.25mm US", "brand": "Cummins", "compat": ["4BT3.9"], "specs": {"size": "0.25mm US", "material": "Tri-Metal"}, "price": 14500, "bulk": 13000, "qty": 18},
    {"partNo": "3802566", "name": "Main Bearing Set - Cummins 4BT 0.50mm US", "brand": "Cummins", "compat": ["4BT3.9"], "specs": {"size": "0.50mm US", "material": "Tri-Metal"}, "price": 14500, "bulk": 13000, "qty": 15},
    {"partNo": "3804905-MB", "name": "Main Bearing Set - Cummins 6CT STD", "brand": "Cummins", "compat": ["6CT8.3", "6CTA8.3"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 22500, "bulk": 21000, "qty": 28},
    {"partNo": "3804906-MB", "name": "Main Bearing Set - Cummins 6CT 0.25mm US", "brand": "Cummins", "compat": ["6CT8.3"], "specs": {"size": "0.25mm US", "material": "Tri-Metal"}, "price": 22500, "bulk": 21000, "qty": 22},
    {"partNo": "4089996", "name": "Main Bearing Set - Cummins ISBe STD", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 21500, "bulk": 20000, "qty": 24},
    {"partNo": "4089997-MB", "name": "Main Bearing Set - Cummins ISBe 0.25mm US", "brand": "Cummins", "compat": ["ISBe6"], "specs": {"size": "0.25mm US", "material": "Tri-Metal"}, "price": 21500, "bulk": 20000, "qty": 18},
    {"partNo": "U5MB0156", "name": "Main Bearing Set - Perkins 1104C STD", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 19500, "bulk": 18000, "qty": 26},
    {"partNo": "U5MB0157", "name": "Main Bearing Set - Perkins 1104C 0.25mm US", "brand": "Perkins", "compat": ["1104C-44"], "specs": {"size": "0.25mm US", "material": "Tri-Metal"}, "price": 19500, "bulk": 18000, "qty": 20},
    {"partNo": "U5MB0268", "name": "Main Bearing Set - Perkins 1106C STD", "brand": "Perkins", "compat": ["1106C-E66T"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 20500, "bulk": 19000, "qty": 22},
    {"partNo": "U5MB0269", "name": "Main Bearing Set - Perkins 1106C 0.25mm US", "brand": "Perkins", "compat": ["1106C-E66T"], "specs": {"size": "0.25mm US", "material": "Tri-Metal"}, "price": 20500, "bulk": 19000, "qty": 18},
    {"partNo": "4115P025", "name": "Main Bearing Set - Perkins 403/404 STD", "brand": "Perkins", "compat": ["403C-15", "404C-22"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 14500, "bulk": 13000, "qty": 18},
    {"partNo": "265-1089", "name": "Main Bearing Set - CAT 3054 STD", "brand": "Caterpillar", "compat": ["3054C", "3056E"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 23500, "bulk": 22000, "qty": 20},
    {"partNo": "320-0945", "name": "Main Bearing Set - CAT C6.6 STD", "brand": "Caterpillar", "compat": ["C6.6"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 26500, "bulk": 25000, "qty": 18},
    {"partNo": "353-6189", "name": "Main Bearing Set - CAT C7.1 STD", "brand": "Caterpillar", "compat": ["C7.1"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 29500, "bulk": 28000, "qty": 14},
]

# Connecting Rod Bearings
connecting_rod_bearings = [
    {"partNo": "3802241", "name": "Con Rod Bearing Set - Cummins 6BT STD", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 12500, "bulk": 11500, "qty": 38},
    {"partNo": "3802242", "name": "Con Rod Bearing Set - Cummins 6BT 0.25mm US", "brand": "Cummins", "compat": ["6BT5.9"], "specs": {"size": "0.25mm US", "material": "Tri-Metal"}, "price": 12500, "bulk": 11500, "qty": 32},
    {"partNo": "3802243", "name": "Con Rod Bearing Set - Cummins 6BT 0.50mm US", "brand": "Cummins", "compat": ["6BT5.9"], "specs": {"size": "0.50mm US", "material": "Tri-Metal"}, "price": 12500, "bulk": 11500, "qty": 28},
    {"partNo": "3802567", "name": "Con Rod Bearing Set - Cummins 4BT STD", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 9500, "bulk": 8500, "qty": 28},
    {"partNo": "3802568", "name": "Con Rod Bearing Set - Cummins 4BT 0.25mm US", "brand": "Cummins", "compat": ["4BT3.9"], "specs": {"size": "0.25mm US", "material": "Tri-Metal"}, "price": 9500, "bulk": 8500, "qty": 22},
    {"partNo": "3804907-CB", "name": "Con Rod Bearing Set - Cummins 6CT STD", "brand": "Cummins", "compat": ["6CT8.3", "6CTA8.3"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 15500, "bulk": 14500, "qty": 24},
    {"partNo": "4089997", "name": "Con Rod Bearing Set - Cummins ISBe STD", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 14500, "bulk": 13500, "qty": 26},
    {"partNo": "U5LB0179", "name": "Con Rod Bearing Set - Perkins 1104C STD", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 13500, "bulk": 12500, "qty": 24},
    {"partNo": "U5LB0289", "name": "Con Rod Bearing Set - Perkins 1106C STD", "brand": "Perkins", "compat": ["1106C-E66T"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 14500, "bulk": 13500, "qty": 22},
    {"partNo": "265-1090", "name": "Con Rod Bearing Set - CAT 3054 STD", "brand": "Caterpillar", "compat": ["3054C", "3056E"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 15500, "bulk": 14500, "qty": 18},
    {"partNo": "320-0946", "name": "Con Rod Bearing Set - CAT C6.6 STD", "brand": "Caterpillar", "compat": ["C6.6"], "specs": {"size": "STD", "material": "Tri-Metal"}, "price": 18500, "bulk": 17500, "qty": 16},
]

# Oil Seals
oil_seals = [
    {"partNo": "3802374", "name": "Front Crankshaft Oil Seal - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "specs": {"size": "130x155x14mm", "material": "Viton"}, "price": 2850, "bulk": 2500, "qty": 85},
    {"partNo": "3929028", "name": "Rear Crankshaft Oil Seal - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "specs": {"size": "140x165x15mm", "material": "Viton"}, "price": 3150, "bulk": 2850, "qty": 78},
    {"partNo": "3918602", "name": "Front Crankshaft Oil Seal - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "specs": {"size": "105x130x12mm", "material": "Viton"}, "price": 2450, "bulk": 2200, "qty": 72},
    {"partNo": "3918603", "name": "Rear Crankshaft Oil Seal - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "specs": {"size": "115x140x13mm", "material": "Viton"}, "price": 2650, "bulk": 2400, "qty": 68},
    {"partNo": "3804908", "name": "Front Crankshaft Oil Seal - Cummins 6CT", "brand": "Cummins", "compat": ["6CT8.3", "6CTA8.3"], "specs": {"size": "140x165x14mm", "material": "Viton"}, "price": 3250, "bulk": 2950, "qty": 62},
    {"partNo": "4955229", "name": "Rear Crankshaft Oil Seal - Cummins ISBe", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "specs": {"size": "145x170x15mm", "material": "Viton"}, "price": 3450, "bulk": 3150, "qty": 65},
    {"partNo": "2418F401", "name": "Front Crankshaft Oil Seal - Perkins 1104C", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "specs": {"size": "115x140x13mm", "material": "Viton"}, "price": 2750, "bulk": 2500, "qty": 68},
    {"partNo": "2418F417", "name": "Rear Crankshaft Oil Seal - Perkins 1104C", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "specs": {"size": "125x150x14mm", "material": "Viton"}, "price": 2950, "bulk": 2650, "qty": 62},
    {"partNo": "2418F425", "name": "Front Crankshaft Oil Seal - Perkins 1106C", "brand": "Perkins", "compat": ["1106C-E66T"], "specs": {"size": "115x140x13mm", "material": "Viton"}, "price": 2850, "bulk": 2550, "qty": 58},
    {"partNo": "2418F432", "name": "Rear Crankshaft Oil Seal - Perkins 1106C", "brand": "Perkins", "compat": ["1106C-E66T"], "specs": {"size": "125x150x14mm", "material": "Viton"}, "price": 3050, "bulk": 2750, "qty": 54},
    {"partNo": "4115P045", "name": "Front Crankshaft Oil Seal - Perkins 403/404", "brand": "Perkins", "compat": ["403C-15", "404C-22"], "specs": {"size": "85x105x10mm", "material": "Viton"}, "price": 1950, "bulk": 1750, "qty": 95},
    {"partNo": "265-1567", "name": "Front Crankshaft Oil Seal - CAT 3054", "brand": "Caterpillar", "compat": ["3054C", "3056E"], "specs": {"size": "110x135x13mm", "material": "Viton"}, "price": 3150, "bulk": 2850, "qty": 52},
    {"partNo": "320-1234", "name": "Rear Crankshaft Oil Seal - CAT C6.6", "brand": "Caterpillar", "compat": ["C6.6"], "specs": {"size": "135x160x14mm", "material": "Viton"}, "price": 3650, "bulk": 3350, "qty": 48},
]

# Gasket Sets
gasket_sets = [
    {"partNo": "3802376", "name": "Upper Gasket Set - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "specs": {"type": "Complete Upper Set", "material": "Multi-layer"}, "price": 12500, "bulk": 11500, "qty": 32},
    {"partNo": "3802165", "name": "Lower Gasket Set - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "specs": {"type": "Complete Lower Set", "material": "Multi-layer"}, "price": 8500, "bulk": 7800, "qty": 28},
    {"partNo": "3804280", "name": "Full Gasket Set - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "specs": {"type": "Complete Full Set", "material": "Multi-layer"}, "price": 19500, "bulk": 18000, "qty": 24},
    {"partNo": "3802567-GS", "name": "Upper Gasket Set - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "specs": {"type": "Complete Upper Set", "material": "Multi-layer"}, "price": 9500, "bulk": 8500, "qty": 26},
    {"partNo": "3920466", "name": "Lower Gasket Set - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "specs": {"type": "Complete Lower Set", "material": "Multi-layer"}, "price": 6500, "bulk": 5800, "qty": 24},
    {"partNo": "3804909-GS", "name": "Upper Gasket Set - Cummins 6CT", "brand": "Cummins", "compat": ["6CT8.3", "6CTA8.3"], "specs": {"type": "Complete Upper Set", "material": "Multi-layer"}, "price": 15500, "bulk": 14500, "qty": 22},
    {"partNo": "4955596", "name": "Upper Gasket Set - Cummins ISBe", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "specs": {"type": "Complete Upper Set", "material": "Multi-layer"}, "price": 14500, "bulk": 13500, "qty": 22},
    {"partNo": "U5LT0015", "name": "Upper Gasket Set - Perkins 1104C", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "specs": {"type": "Complete Upper Set", "material": "Multi-layer"}, "price": 11500, "bulk": 10500, "qty": 24},
    {"partNo": "U5LT0029", "name": "Upper Gasket Set - Perkins 1106C", "brand": "Perkins", "compat": ["1106C-E66T"], "specs": {"type": "Complete Upper Set", "material": "Multi-layer"}, "price": 12500, "bulk": 11500, "qty": 20},
    {"partNo": "4115P067", "name": "Upper Gasket Set - Perkins 403/404", "brand": "Perkins", "compat": ["403C-15", "404C-22"], "specs": {"type": "Complete Upper Set", "material": "Multi-layer"}, "price": 7500, "bulk": 6800, "qty": 18},
    {"partNo": "265-1890", "name": "Upper Gasket Set - CAT 3054", "brand": "Caterpillar", "compat": ["3054C", "3056E"], "specs": {"type": "Complete Upper Set", "material": "Multi-layer"}, "price": 14500, "bulk": 13500, "qty": 16},
    {"partNo": "320-1567", "name": "Upper Gasket Set - CAT C6.6", "brand": "Caterpillar", "compat": ["C6.6"], "specs": {"type": "Complete Upper Set", "material": "Multi-layer"}, "price": 16500, "bulk": 15500, "qty": 14},
]

# Head Gaskets
head_gaskets = [
    {"partNo": "3802370", "name": "Cylinder Head Gasket - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "specs": {"material": "MLS - Multi Layer Steel", "thickness": "1.2mm"}, "price": 8500, "bulk": 7800, "qty": 45},
    {"partNo": "3920255", "name": "Cylinder Head Gasket - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "specs": {"material": "MLS - Multi Layer Steel", "thickness": "1.2mm"}, "price": 6500, "bulk": 5800, "qty": 38},
    {"partNo": "3804905-HG", "name": "Cylinder Head Gasket - Cummins 6CT", "brand": "Cummins", "compat": ["6CT8.3", "6CTA8.3"], "specs": {"material": "MLS - Multi Layer Steel", "thickness": "1.3mm"}, "price": 9500, "bulk": 8800, "qty": 32},
    {"partNo": "4955229-HG", "name": "Cylinder Head Gasket - Cummins ISBe", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "specs": {"material": "MLS - Multi Layer Steel", "thickness": "1.2mm"}, "price": 9850, "bulk": 9000, "qty": 28},
    {"partNo": "U5LB0156", "name": "Cylinder Head Gasket - Perkins 1104C", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "specs": {"material": "MLS - Multi Layer Steel", "thickness": "1.1mm"}, "price": 7850, "bulk": 7200, "qty": 35},
    {"partNo": "U5LB0234", "name": "Cylinder Head Gasket - Perkins 1106C", "brand": "Perkins", "compat": ["1106C-E66T"], "specs": {"material": "MLS - Multi Layer Steel", "thickness": "1.1mm"}, "price": 8500, "bulk": 7800, "qty": 30},
    {"partNo": "4115P089", "name": "Cylinder Head Gasket - Perkins 403/404", "brand": "Perkins", "compat": ["403C-15", "404C-22"], "specs": {"material": "MLS - Multi Layer Steel", "thickness": "1.0mm"}, "price": 5500, "bulk": 4950, "qty": 28},
    {"partNo": "265-1945", "name": "Cylinder Head Gasket - CAT 3054", "brand": "Caterpillar", "compat": ["3054C", "3056E"], "specs": {"material": "MLS - Multi Layer Steel", "thickness": "1.2mm"}, "price": 9850, "bulk": 9000, "qty": 25},
    {"partNo": "320-1678", "name": "Cylinder Head Gasket - CAT C6.6", "brand": "Caterpillar", "compat": ["C6.6"], "specs": {"material": "MLS - Multi Layer Steel", "thickness": "1.3mm"}, "price": 11500, "bulk": 10500, "qty": 22},
]

# Valve Stem Seals
valve_seals = [
    {"partNo": "3901179", "name": "Valve Stem Seal Set - Cummins 6BT (12pcs)", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "specs": {"quantity": "12 Seals", "material": "Viton"}, "price": 3850, "bulk": 3500, "qty": 55},
    {"partNo": "3901180", "name": "Valve Stem Seal Set - Cummins 4BT (8pcs)", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "specs": {"quantity": "8 Seals", "material": "Viton"}, "price": 2850, "bulk": 2500, "qty": 48},
    {"partNo": "4955872", "name": "Valve Stem Seal Set - Cummins ISBe (12pcs)", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "specs": {"quantity": "12 Seals", "material": "Viton"}, "price": 4250, "bulk": 3850, "qty": 42},
    {"partNo": "U5VS0012", "name": "Valve Stem Seal Set - Perkins 1104C (8pcs)", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "specs": {"quantity": "8 Seals", "material": "Viton"}, "price": 3450, "bulk": 3150, "qty": 38},
    {"partNo": "U5VS0024", "name": "Valve Stem Seal Set - Perkins 1106C (12pcs)", "brand": "Perkins", "compat": ["1106C-E66T"], "specs": {"quantity": "12 Seals", "material": "Viton"}, "price": 4150, "bulk": 3750, "qty": 35},
]

# O-Ring Kits
oring_kits = [
    {"partNo": "3802680", "name": "O-Ring Kit - Cummins 6BT Complete Set", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "specs": {"quantity": "50+ O-Rings", "material": "Nitrile/Viton"}, "price": 4500, "bulk": 4000, "qty": 42},
    {"partNo": "3920789", "name": "O-Ring Kit - Cummins 4BT Complete Set", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "specs": {"quantity": "40+ O-Rings", "material": "Nitrile/Viton"}, "price": 3850, "bulk": 3500, "qty": 38},
    {"partNo": "4955890", "name": "O-Ring Kit - Cummins ISBe Complete Set", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "specs": {"quantity": "60+ O-Rings", "material": "Nitrile/Viton"}, "price": 5500, "bulk": 5000, "qty": 32},
    {"partNo": "U5OR0045", "name": "O-Ring Kit - Perkins 1104C Complete Set", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "specs": {"quantity": "45+ O-Rings", "material": "Nitrile/Viton"}, "price": 4200, "bulk": 3800, "qty": 35},
    {"partNo": "U5OR0067", "name": "O-Ring Kit - Perkins 1106C Complete Set", "brand": "Perkins", "compat": ["1106C-E66T"], "specs": {"quantity": "55+ O-Rings", "material": "Nitrile/Viton"}, "price": 4850, "bulk": 4500, "qty": 30},
]

# Add all bearing and seal parts
for part in bearing_parts + connecting_rod_bearings + oil_seals + gasket_sets + head_gaskets + valve_seals + oring_kits:
    add_part(bearings_seals, part)

data["categories"][0]["subcategories"].append(bearings_seals)

# Save and report
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'w') as f:
    json.dump(data, f, indent=2)

total_parts = sum(len(subcat["parts"]) for subcat in data["categories"][0]["subcategories"])
print(f"\n=== BEARINGS & SEALS ADDED ===")
print(f"Total Parts: {total_parts}")
print(f"Bearings & Seals: {len(bearings_seals['parts'])} parts")
