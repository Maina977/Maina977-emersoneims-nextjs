import json

# Read the existing partial database
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'r') as f:
    data = json.load(f)

# The existing file already has filters and pistons-rings sections complete
# We need to add more parts to reach 1247 total

# Add remaining subcategories
remaining_categories = []

# 1. Injectors & Fuel Systems
injectors_fuel = {
    "id": "injectors-fuel",
    "name": "Injectors & Fuel System Components",
    "description": "Fuel injectors, injection pumps, and fuel system parts",
    "parts": []
}

injector_data = [
    {"partNo": "3802866", "name": "Fuel Injector - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "type": "Mechanical Injector", "pressure": "300 Bar", "price": 12500, "bulk": 11500, "qty": 48},
    {"partNo": "3919350", "name": "Fuel Injector - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "type": "Mechanical Injector", "pressure": "300 Bar", "price": 11500, "bulk": 10500, "qty": 42},
    {"partNo": "5263262", "name": "Common Rail Injector - Cummins ISBe", "brand": "Cummins", "compat": ["ISBe4", "ISBe6", "QSB6.7"], "type": "Common Rail", "pressure": "1800 Bar", "price": 38500, "bulk": 36500, "qty": 24},
    {"partNo": "2645A747", "name": "Fuel Injector - Perkins 1104C", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "type": "Common Rail", "pressure": "1600 Bar", "price": 35500, "bulk": 33500, "qty": 28},
    {"partNo": "2645A738", "name": "Fuel Injector - Perkins 1106C", "brand": "Perkins", "compat": ["1106C-E66T", "1106C-70T"], "type": "Common Rail", "pressure": "1600 Bar", "price": 36500, "bulk": 34500, "qty": 26},
    {"partNo": "320-0677", "name": "HEUI Injector - CAT 3054", "brand": "Caterpillar", "compat": ["3054C", "3056E"], "type": "HEUI Electronic", "pressure": "3000 PSI", "price": 45500, "bulk": 43500, "qty": 18},
    {"partNo": "387-9427", "name": "Common Rail Injector - CAT C6.6", "brand": "Caterpillar", "compat": ["C6.6", "C6.6T"], "type": "Common Rail", "pressure": "2000 Bar", "price": 48500, "bulk": 46500, "qty": 16},
    {"partNo": "3803759", "name": "Injection Pump - Cummins 6BT (Bosch)", "brand": "Bosch", "compat": ["6BT5.9", "6BTA5.9"], "type": "P7100 Inline Pump", "flow": "180cc/stroke", "price": 125000, "bulk": 115000, "qty": 12},
    {"partNo": "3973228", "name": "Injection Pump - Cummins 4BT (Bosch)", "brand": "Bosch", "compat": ["4BT3.9", "4BTA3.9"], "type": "P7100 Inline Pump", "flow": "120cc/stroke", "price": 95000, "bulk": 88000, "qty": 10},
    {"partNo": "2644H013", "name": "High Pressure Pump - Perkins 1104C", "brand": "Delphi", "compat": ["1104C-44T", "1104C-E44T"], "type": "Common Rail HP Pump", "pressure": "1600 Bar", "price": 85000, "bulk": 78000, "qty": 14},
    {"partNo": "2644P501", "name": "High Pressure Pump - Perkins 1106C", "brand": "Delphi", "compat": ["1106C-E66T"], "type": "Common Rail HP Pump", "pressure": "1600 Bar", "price": 92000, "bulk": 85000, "qty": 12},
    {"partNo": "326-4635", "name": "High Pressure Pump - CAT C6.6", "brand": "Caterpillar", "compat": ["C6.6", "C6.6T"], "type": "Common Rail HP Pump", "pressure": "2000 Bar", "price": 115000, "bulk": 105000, "qty": 10},
    {"partNo": "3916854", "name": "Fuel Transfer Pump - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9", "6CT8.3"], "type": "Gear Type Lift Pump", "flow": "120 LPH", "price": 8500, "bulk": 7500, "qty": 65},
    {"partNo": "3930343", "name": "Fuel Transfer Pump - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "type": "Gear Type Lift Pump", "flow": "100 LPH", "price": 7500, "bulk": 6800, "qty": 58},
    {"partNo": "4988747", "name": "Fuel Transfer Pump - Cummins ISBe", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "type": "Electric Fuel Pump", "flow": "150 LPH", "price": 12500, "bulk": 11500, "qty": 42},
    {"partNo": "2644P605", "name": "Fuel Transfer Pump - Perkins 1104C", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "type": "Gear Type Lift Pump", "flow": "110 LPH", "price": 8850, "bulk": 8000, "qty": 48},
    {"partNo": "ULPK0040", "name": "Fuel Transfer Pump - Perkins 1106C", "brand": "Perkins", "compat": ["1106C-E66T"], "type": "Gear Type Lift Pump", "flow": "130 LPH", "price": 9500, "bulk": 8500, "qty": 45},
    {"partNo": "320-0690", "name": "Fuel Transfer Pump - CAT 3054", "brand": "Caterpillar", "compat": ["3054C", "3056E"], "type": "Gear Type Lift Pump", "flow": "115 LPH", "price": 11500, "bulk": 10500, "qty": 38},
]

for inj in injector_data:
    injectors_fuel["parts"].append({
        "partNo": inj["partNo"],
        "name": inj["name"],
        "brand": inj["brand"],
        "category": "Fuel Injector" if "Injector" in inj["name"] and "Pump" not in inj["name"] else "Injection Pump" if "Injection" in inj["name"] else "Fuel Pump",
        "compatibility": inj["compat"],
        "specifications": {
            "type": inj["type"],
            "pressure": inj.get("pressure", inj.get("flow", "N/A")),
            "application": "Fuel Delivery System"
        },
        "pricing": {
            "currency": "KES",
            "retailPrice": inj["price"],
            "bulkPrice": inj["bulk"],
            "minimumOrder": 2 if inj["price"] > 50000 else 4 if inj["price"] > 20000 else 6
        },
        "inventory": {
            "stock": "In Stock",
            "quantity": inj["qty"],
            "location": "Nairobi Warehouse",
            "leadTime": "Same Day" if inj["qty"] > 40 else "1-2 Days" if inj["qty"] > 20 else "1 Week"
        },
        "warranty": "12 months",
        "tags": ["fuel-system", inj["brand"].lower(), inj["name"].lower().replace(" ", "-")]
    })

remaining_categories.append(injectors_fuel)

# 2. Cooling System Parts
cooling_system = {
    "id": "cooling-system",
    "name": "Cooling System Components",
    "description": "Radiators, water pumps, thermostats, and cooling system parts",
    "parts": []
}

cooling_data = [
    {"partNo": "3800883", "name": "Water Pump - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "flow": "180 LPM", "price": 15500, "bulk": 14000, "qty": 38},
    {"partNo": "3803289", "name": "Water Pump - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "flow": "150 LPM", "price": 13500, "bulk": 12000, "qty": 35},
    {"partNo": "3804292", "name": "Water Pump - Cummins 6CT", "brand": "Cummins", "compat": ["6CT8.3", "6CTA8.3"], "flow": "220 LPM", "price": 18500, "bulk": 17000, "qty": 28},
    {"partNo": "5293643", "name": "Water Pump - Cummins ISBe", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "flow": "200 LPM", "price": 19500, "bulk": 18000, "qty": 25},
    {"partNo": "U5MW0155", "name": "Water Pump - Perkins 1104C", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "flow": "160 LPM", "price": 14500, "bulk": 13000, "qty": 32},
    {"partNo": "U5MW0183", "name": "Water Pump - Perkins 1106C", "brand": "Perkins", "compat": ["1106C-E66T"], "flow": "185 LPM", "price": 16500, "bulk": 15000, "qty": 28},
    {"partNo": "4115P156", "name": "Water Pump - Perkins 403/404", "brand": "Perkins", "compat": ["403C-15", "404C-22"], "flow": "120 LPM", "price": 9500, "bulk": 8500, "qty": 42},
    {"partNo": "265-1210", "name": "Water Pump - CAT 3054", "brand": "Caterpillar", "compat": ["3054C", "3056E"], "flow": "170 LPM", "price": 19500, "bulk": 18000, "qty": 22},
    {"partNo": "320-1234", "name": "Water Pump - CAT C6.6", "brand": "Caterpillar", "compat": ["C6.6"], "flow": "210 LPM", "price": 24500, "bulk": 23000, "qty": 18},
    {"partNo": "3802378", "name": "Thermostat - Cummins 6BT (82°C)", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "temp": "82°C", "price": 2850, "bulk": 2500, "qty": 125},
    {"partNo": "3802379", "name": "Thermostat - Cummins 6BT (71°C)", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "temp": "71°C", "price": 2850, "bulk": 2500, "qty": 95},
    {"partNo": "3928639", "name": "Thermostat - Cummins 4BT (82°C)", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "temp": "82°C", "price": 2650, "bulk": 2350, "qty": 105},
    {"partNo": "5259452", "name": "Thermostat - Cummins ISBe (88°C)", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "temp": "88°C", "price": 3150, "bulk": 2850, "qty": 85},
    {"partNo": "U5MW0048", "name": "Thermostat - Perkins 1104C (82°C)", "brand": "Perkins", "compat": ["1104C-44", "1104C-44T"], "temp": "82°C", "price": 2950, "bulk": 2650, "qty": 95},
    {"partNo": "U5MW0062", "name": "Thermostat - Perkins 1106C (88°C)", "brand": "Perkins", "compat": ["1106C-E66T"], "temp": "88°C", "price": 3050, "bulk": 2750, "qty": 88},
    {"partNo": "265-1345", "name": "Thermostat - CAT 3054 (82°C)", "brand": "Caterpillar", "compat": ["3054C", "3056E"], "temp": "82°C", "price": 3450, "bulk": 3150, "qty": 75},
    {"partNo": "3800815", "name": "Radiator - Cummins 6BT 100kVA", "brand": "Cummins", "compat": ["6BT5.9 - 100kVA"], "size": "800x600x65mm", "price": 65000, "bulk": 60000, "qty": 12},
    {"partNo": "3800816", "name": "Radiator - Cummins 6BT 150kVA", "brand": "Cummins", "compat": ["6BTA5.9 - 150kVA"], "size": "950x700x75mm", "price": 75000, "bulk": 70000, "qty": 10},
    {"partNo": "3803290", "name": "Radiator - Cummins 4BT 50kVA", "brand": "Cummins", "compat": ["4BT3.9 - 50kVA"], "size": "650x500x60mm", "price": 45000, "bulk": 42000, "qty": 14},
    {"partNo": "RAD-1104C-88", "name": "Radiator - Perkins 1104C 88kVA", "brand": "Perkins", "compat": ["1104C-44T - 88kVA"], "size": "750x580x70mm", "price": 58000, "bulk": 54000, "qty": 11},
    {"partNo": "RAD-1106C-138", "name": "Radiator - Perkins 1106C 138kVA", "brand": "Perkins", "compat": ["1106C-E66T - 138kVA"], "size": "900x680x75mm", "price": 68000, "bulk": 63000, "qty": 9},
    {"partNo": "3801939", "name": "Radiator Fan - Cummins 6BT (18inch)", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "size": "18 inch - 8 Blade", "price": 8500, "bulk": 7800, "qty": 48},
    {"partNo": "3928597", "name": "Radiator Fan - Cummins 4BT (16inch)", "brand": "Cummins", "compat": ["4BT3.9"], "size": "16 inch - 6 Blade", "price": 6500, "bulk": 5800, "qty": 52},
    {"partNo": "3924147", "name": "Fan Belt - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "size": "10PK2050", "price": 1850, "bulk": 1650, "qty": 155},
    {"partNo": "3911574", "name": "Fan Belt - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9"], "size": "8PK1750", "price": 1650, "bulk": 1450, "qty": 145},
]

for cool in cooling_data:
    cooling_system["parts"].append({
        "partNo": cool["partNo"],
        "name": cool["name"],
        "brand": cool["brand"],
        "category": "Water Pump" if "Pump" in cool["name"] else "Thermostat" if "Thermostat" in cool["name"] else "Radiator" if "Radiator" in cool["name"] else "Fan" if "Fan" in cool["name"] else "Belt",
        "compatibility": cool["compat"],
        "specifications": {
            "specification": cool.get("flow", cool.get("temp", cool.get("size", "Standard"))),
            "application": "Engine Cooling System"
        },
        "pricing": {
            "currency": "KES",
            "retailPrice": cool["price"],
            "bulkPrice": cool["bulk"],
            "minimumOrder": 2 if cool["price"] > 40000 else 4 if cool["price"] > 10000 else 8
        },
        "inventory": {
            "stock": "In Stock",
            "quantity": cool["qty"],
            "location": "Nairobi Warehouse",
            "leadTime": "Same Day" if cool["qty"] > 40 else "1-2 Days" if cool["qty"] > 15 else "1 Week"
        },
        "warranty": "12 months",
        "tags": ["cooling-system", cool["brand"].lower()]
    })

remaining_categories.append(cooling_system)

# 3. Alternators & Components
alternators = {
    "id": "alternators",
    "name": "Alternators & Electrical Components",
    "description": "Stamford, Leroy Somer, Mecc Alte alternators and electrical parts",
    "parts": []
}

alt_data = [
    # Stamford Alternators
    {"partNo": "STA-HCI434D", "name": "Stamford HCI434D Alternator - 100kVA", "brand": "Stamford", "rating": "100kVA / 80kW", "voltage": "400/230V", "price": 285000, "bulk": 270000, "qty": 4},
    {"partNo": "STA-HCI544D", "name": "Stamford HCI544D Alternator - 150kVA", "brand": "Stamford", "rating": "150kVA / 120kW", "voltage": "400/230V", "price": 395000, "bulk": 375000, "qty": 3},
    {"partNo": "STA-UCI274E", "name": "Stamford UCI274E Alternator - 62.5kVA", "brand": "Stamford", "rating": "62.5kVA / 50kW", "voltage": "400/230V", "price": 195000, "bulk": 185000, "qty": 5},
    {"partNo": "STA-UCI224F", "name": "Stamford UCI224F Alternator - 40kVA", "brand": "Stamford", "rating": "40kVA / 32kW", "voltage": "400/230V", "price": 145000, "bulk": 135000, "qty": 6},
    {"partNo": "STA-PI044G", "name": "Stamford PI044G Alternator - 20kVA", "brand": "Stamford", "rating": "20kVA / 16kW", "voltage": "400/230V", "price": 95000, "bulk": 88000, "qty": 8},
    {"partNo": "STA-S0L1D", "name": "Stamford S0L1D Alternator - 7.5kVA", "brand": "Stamford", "rating": "7.5kVA / 6kW", "voltage": "230V Single Phase", "price": 45000, "bulk": 42000, "qty": 12},

    # Leroy Somer Alternators
    {"partNo": "LSA-42.3L8", "name": "Leroy Somer LSA 42.3 L8 - 35kVA", "brand": "Leroy Somer", "rating": "35kVA / 28kW", "voltage": "400/230V", "price": 165000, "bulk": 155000, "qty": 5},
    {"partNo": "LSA-43.2L8", "name": "Leroy Somer LSA 43.2 L8 - 63kVA", "brand": "Leroy Somer", "rating": "63kVA / 50kW", "voltage": "400/230V", "price": 215000, "bulk": 205000, "qty": 4},
    {"partNo": "LSA-44.2M8", "name": "Leroy Somer LSA 44.2 M8 - 110kVA", "brand": "Leroy Somer", "rating": "110kVA / 88kW", "voltage": "400/230V", "price": 325000, "bulk": 310000, "qty": 3},
    {"partNo": "LSA-46.2M8", "name": "Leroy Somer LSA 46.2 M8 - 200kVA", "brand": "Leroy Somer", "rating": "200kVA / 160kW", "voltage": "400/230V", "price": 485000, "bulk": 465000, "qty": 2},
    {"partNo": "LSA-47.2M8", "name": "Leroy Somer LSA 47.2 M8 - 350kVA", "brand": "Leroy Somer", "rating": "350kVA / 280kW", "voltage": "400/230V", "price": 685000, "bulk": 650000, "qty": 2},

    # Mecc Alte Alternators
    {"partNo": "MEC-ECO28-1S", "name": "Mecc Alte ECO28-1S - 25kVA", "brand": "Mecc Alte", "rating": "25kVA / 20kW", "voltage": "400/230V", "price": 125000, "bulk": 115000, "qty": 6},
    {"partNo": "MEC-ECO32-1S", "name": "Mecc Alte ECO32-1S - 50kVA", "brand": "Mecc Alte", "rating": "50kVA / 40kW", "voltage": "400/230V", "price": 175000, "bulk": 165000, "qty": 5},
    {"partNo": "MEC-ECO38-1.5L", "name": "Mecc Alte ECO38-1.5L - 88kVA", "brand": "Mecc Alte", "rating": "88kVA / 70kW", "voltage": "400/230V", "price": 265000, "bulk": 250000, "qty": 4},
    {"partNo": "MEC-ECO40-2L", "name": "Mecc Alte ECO40-2L - 138kVA", "brand": "Mecc Alte", "rating": "138kVA / 110kW", "voltage": "400/230V", "price": 365000, "bulk": 345000, "qty": 3},
    {"partNo": "MEC-ECO43-2L", "name": "Mecc Alte ECO43-2L - 220kVA", "brand": "Mecc Alte", "rating": "220kVA / 176kW", "voltage": "400/230V", "price": 495000, "bulk": 475000, "qty": 2},

    # AVR (Automatic Voltage Regulators)
    {"partNo": "SX460-AVR", "name": "AVR SX460 - Stamford Original", "brand": "Stamford", "rating": "Universal - Up to 150kVA", "voltage": "190-264V AC Input", "price": 18500, "bulk": 17000, "qty": 45},
    {"partNo": "SX440-AVR", "name": "AVR SX440 - Stamford Original", "brand": "Stamford", "rating": "Universal - Up to 100kVA", "voltage": "190-264V AC Input", "price": 15500, "bulk": 14000, "qty": 52},
    {"partNo": "R438-AVR", "name": "AVR R438 - Leroy Somer Original", "brand": "Leroy Somer", "rating": "Universal - Up to 200kVA", "voltage": "190-264V AC Input", "price": 22500, "bulk": 21000, "qty": 38},
    {"partNo": "R449-AVR", "name": "AVR R449 - Leroy Somer Original", "brand": "Leroy Somer", "rating": "Universal - Up to 350kVA", "voltage": "190-264V AC Input", "price": 28500, "bulk": 26500, "qty": 28},
    {"partNo": "UVR6-AVR", "name": "AVR UVR6 - Mecc Alte Original", "brand": "Mecc Alte", "rating": "Universal - Up to 100kVA", "voltage": "190-264V AC Input", "price": 16500, "bulk": 15000, "qty": 42},
    {"partNo": "SR7-AVR", "name": "AVR SR7 - Mecc Alte Original", "brand": "Mecc Alte", "rating": "Universal - Up to 250kVA", "voltage": "190-264V AC Input", "price": 24500, "bulk": 23000, "qty": 32},
]

for alt in alt_data:
    alternators["parts"].append({
        "partNo": alt["partNo"],
        "name": alt["name"],
        "brand": alt["brand"],
        "category": "Alternator" if "Alternator" in alt["name"] else "AVR",
        "compatibility": ["Universal"] if "AVR" in alt["name"] else [alt["rating"]],
        "specifications": {
            "powerRating": alt["rating"],
            "voltage": alt["voltage"],
            "application": "Generator Head" if "Alternator" in alt["name"] else "Voltage Regulation"
        },
        "pricing": {
            "currency": "KES",
            "retailPrice": alt["price"],
            "bulkPrice": alt["bulk"],
            "minimumOrder": 1 if alt["price"] > 200000 else 2 if alt["price"] > 50000 else 4
        },
        "inventory": {
            "stock": "In Stock",
            "quantity": alt["qty"],
            "location": "Nairobi Warehouse",
            "leadTime": "1-2 Days" if alt["qty"] < 10 else "Same Day"
        },
        "warranty": "12 months",
        "tags": ["alternator" if "Alternator" in alt["name"] else "avr", alt["brand"].lower().replace(" ", "-")]
    })

remaining_categories.append(alternators)

# Append new categories to the main data
data["categories"][0]["subcategories"].extend(remaining_categories)

# Write the updated database
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Database updated successfully!")
print(f"Total categories: {len(data['categories'])}")
print(f"Total subcategories: {len(data['categories'][0]['subcategories'])}")
