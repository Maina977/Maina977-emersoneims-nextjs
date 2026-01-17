import json

# Read the current database
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'r') as f:
    data = json.load(f)

# Count current parts
current_parts = 0
for subcat in data["categories"][0]["subcategories"]:
    current_parts += len(subcat["parts"])

print(f"Current parts count: {current_parts}")

# 4. Electrical Components
electrical = {
    "id": "electrical-components",
    "name": "Electrical Components & Sensors",
    "description": "Starters, sensors, switches, gauges, and electrical parts",
    "parts": []
}

elec_data = [
    # Starters
    {"partNo": "3957597", "name": "Starter Motor - Cummins 6BT (12V 5kW)", "brand": "Delco Remy", "compat": ["6BT5.9", "6BTA5.9"], "voltage": "12V", "power": "5.0kW", "price": 35000, "bulk": 32000, "qty": 18},
    {"partNo": "3957598", "name": "Starter Motor - Cummins 6BT (24V 5.5kW)", "brand": "Delco Remy", "compat": ["6BT5.9", "6BTA5.9"], "voltage": "24V", "power": "5.5kW", "price": 38000, "bulk": 35000, "qty": 16},
    {"partNo": "3918376", "name": "Starter Motor - Cummins 4BT (12V 4kW)", "brand": "Delco Remy", "compat": ["4BT3.9", "4BTA3.9"], "voltage": "12V", "power": "4.0kW", "price": 28000, "bulk": 26000, "qty": 22},
    {"partNo": "5284084", "name": "Starter Motor - Cummins ISBe (24V 6kW)", "brand": "Delco Remy", "compat": ["ISBe4", "ISBe6"], "voltage": "24V", "power": "6.0kW", "price": 42000, "bulk": 39000, "qty": 14},
    {"partNo": "2873K404", "name": "Starter Motor - Perkins 1104C (12V 4.5kW)", "brand": "Lucas TVS", "compat": ["1104C-44", "1104C-44T"], "voltage": "12V", "power": "4.5kW", "price": 32000, "bulk": 30000, "qty": 18},
    {"partNo": "2873K625", "name": "Starter Motor - Perkins 1106C (24V 5kW)", "brand": "Lucas TVS", "compat": ["1106C-E66T"], "voltage": "24V", "power": "5.0kW", "price": 36000, "bulk": 33000, "qty": 15},
    {"partNo": "320-1845", "name": "Starter Motor - CAT 3054 (12V 4.5kW)", "brand": "Denso", "compat": ["3054C", "3056E"], "voltage": "12V", "power": "4.5kW", "price": 38000, "bulk": 35000, "qty": 12},
    {"partNo": "353-7890", "name": "Starter Motor - CAT C6.6 (24V 6kW)", "brand": "Denso", "compat": ["C6.6"], "voltage": "24V", "power": "6.0kW", "price": 45000, "bulk": 42000, "qty": 10},

    # Alternators (Charging)
    {"partNo": "3972730", "name": "Charging Alternator - Cummins 6BT (12V 70A)", "brand": "Delco Remy", "compat": ["6BT5.9", "6BTA5.9"], "voltage": "12V", "output": "70A", "price": 18500, "bulk": 17000, "qty": 32},
    {"partNo": "3972731", "name": "Charging Alternator - Cummins 6BT (24V 50A)", "brand": "Delco Remy", "compat": ["6BT5.9", "6BTA5.9"], "voltage": "24V", "output": "50A", "price": 21000, "bulk": 19000, "qty": 28},
    {"partNo": "3918559", "name": "Charging Alternator - Cummins 4BT (12V 55A)", "brand": "Delco Remy", "compat": ["4BT3.9", "4BTA3.9"], "voltage": "12V", "output": "55A", "price": 15500, "bulk": 14000, "qty": 35},
    {"partNo": "5318300", "name": "Charging Alternator - Cummins ISBe (24V 80A)", "brand": "Delco Remy", "compat": ["ISBe4", "ISBe6"], "voltage": "24V", "output": "80A", "price": 24500, "bulk": 22500, "qty": 22},
    {"partNo": "2871A301", "name": "Charging Alternator - Perkins 1104C (12V 65A)", "brand": "Lucas TVS", "compat": ["1104C-44"], "voltage": "12V", "output": "65A", "price": 17500, "bulk": 16000, "qty": 28},
    {"partNo": "2871A403", "name": "Charging Alternator - Perkins 1106C (24V 70A)", "brand": "Lucas TVS", "compat": ["1106C-E66T"], "voltage": "24V", "output": "70A", "price": 22000, "bulk": 20000, "qty": 24},

    # Sensors
    {"partNo": "4921517", "name": "Oil Pressure Sensor - Cummins 6BT/ISBe", "brand": "Cummins", "compat": ["6BT5.9", "ISBe4", "ISBe6"], "type": "Pressure Transducer", "range": "0-10 Bar", "price": 3850, "bulk": 3500, "qty": 85},
    {"partNo": "4921744", "name": "Water Temperature Sensor - Cummins 6BT/ISBe", "brand": "Cummins", "compat": ["6BT5.9", "ISBe4"], "type": "Temperature Sensor", "range": "-40 to 150°C", "price": 2850, "bulk": 2500, "qty": 95},
    {"partNo": "4921745", "name": "Fuel Pressure Sensor - Cummins ISBe", "brand": "Cummins", "compat": ["ISBe4", "ISBe6", "QSB6.7"], "type": "Pressure Sensor", "range": "0-2000 Bar", "price": 12500, "bulk": 11500, "qty": 42},
    {"partNo": "4921776", "name": "Speed Sensor - Cummins 6BT/4BT", "brand": "Cummins", "compat": ["6BT5.9", "4BT3.9"], "type": "Magnetic Pickup", "range": "0-3000 RPM", "price": 4850, "bulk": 4500, "qty": 68},
    {"partNo": "4087991", "name": "Crankshaft Position Sensor - Cummins ISBe", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "type": "Hall Effect Sensor", "output": "Digital Signal", "price": 8500, "bulk": 7800, "qty": 52},
    {"partNo": "4087992", "name": "Camshaft Position Sensor - Cummins ISBe", "brand": "Cummins", "compat": ["ISBe4", "ISBe6"], "type": "Hall Effect Sensor", "output": "Digital Signal", "price": 8500, "bulk": 7800, "qty": 48},
    {"partNo": "2848A127", "name": "Oil Pressure Sensor - Perkins 1104C/1106C", "brand": "Perkins", "compat": ["1104C-44", "1106C-E66T"], "type": "Pressure Sensor", "range": "0-10 Bar", "price": 3650, "bulk": 3300, "qty": 72},
    {"partNo": "2848A128", "name": "Water Temperature Sensor - Perkins 1104C/1106C", "brand": "Perkins", "compat": ["1104C-44", "1106C-E66T"], "type": "Temperature Sensor", "range": "-40 to 150°C", "price": 2950, "bulk": 2650, "qty": 88},
    {"partNo": "4444902", "name": "Fuel Temperature Sensor - Perkins 1104C", "brand": "Perkins", "compat": ["1104C-44T", "1104C-E44T"], "type": "Temperature Sensor", "range": "-40 to 120°C", "price": 3250, "bulk": 2950, "qty": 65},
    {"partNo": "320-3064", "name": "Oil Pressure Sensor - CAT C6.6/C7.1", "brand": "Caterpillar", "compat": ["C6.6", "C7.1"], "type": "Pressure Sensor", "range": "0-12 Bar", "price": 4850, "bulk": 4500, "qty": 55},
    {"partNo": "353-4637", "name": "Speed Sensor - CAT C6.6/C7.1", "brand": "Caterpillar", "compat": ["C6.6", "C7.1"], "type": "Hall Effect", "range": "0-3500 RPM", "price": 9500, "bulk": 8800, "qty": 38},

    # Switches & Relays
    {"partNo": "3056356", "name": "Oil Pressure Switch - Cummins (0.3 Bar)", "brand": "Cummins", "compat": ["Universal Cummins"], "type": "Warning Switch", "pressure": "0.3 Bar", "price": 1250, "bulk": 1100, "qty": 145},
    {"partNo": "3015237", "name": "Water Temperature Switch - Cummins (98°C)", "brand": "Cummins", "compat": ["Universal Cummins"], "type": "Warning Switch", "temp": "98°C", "price": 1150, "bulk": 1000, "qty": 155},
    {"partNo": "4983584", "name": "Fuel Shutoff Solenoid - Cummins 6BT (12V)", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "voltage": "12V", "type": "Pull Type", "price": 8500, "bulk": 7800, "qty": 52},
    {"partNo": "3930235", "name": "Fuel Shutoff Solenoid - Cummins 6BT (24V)", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "voltage": "24V", "type": "Pull Type", "price": 8500, "bulk": 7800, "qty": 48},
    {"partNo": "2848A189", "name": "Fuel Shutoff Solenoid - Perkins 1104C (12V)", "brand": "Perkins", "compat": ["1104C-44"], "voltage": "12V", "type": "Push Type", "price": 7500, "bulk": 6800, "qty": 45},
    {"partNo": "2848A190", "name": "Fuel Shutoff Solenoid - Perkins 1104C (24V)", "brand": "Perkins", "compat": ["1104C-44"], "voltage": "24V", "type": "Push Type", "price": 7500, "bulk": 6800, "qty": 42},
]

for elec in elec_data:
    electrical["parts"].append({
        "partNo": elec["partNo"],
        "name": elec["name"],
        "brand": elec["brand"],
        "category": "Starter Motor" if "Starter" in elec["name"] else "Charging Alternator" if "Charging" in elec["name"] else "Sensor" if "Sensor" in elec["name"] else "Switch/Solenoid",
        "compatibility": elec["compat"],
        "specifications": {
            "specification": elec.get("voltage", elec.get("type", elec.get("range", "Standard"))),
            "output": elec.get("power", elec.get("output", elec.get("pressure", elec.get("temp", "N/A"))))
        },
        "pricing": {
            "currency": "KES",
            "retailPrice": elec["price"],
            "bulkPrice": elec["bulk"],
            "minimumOrder": 2 if elec["price"] > 20000 else 4 if elec["price"] > 5000 else 10
        },
        "inventory": {
            "stock": "In Stock",
            "quantity": elec["qty"],
            "location": "Nairobi Warehouse",
            "leadTime": "Same Day" if elec["qty"] > 50 else "1-2 Days" if elec["qty"] > 20 else "1 Week"
        },
        "warranty": "12 months",
        "tags": ["electrical", elec["brand"].lower().replace(" ", "-")]
    })

data["categories"][0]["subcategories"].append(electrical)

# 5. Control Panels & Switches
control_panels = {
    "id": "control-panels",
    "name": "Control Panels & Automation",
    "description": "AMF panels, manual panels, controllers, and automation equipment",
    "parts": []
}

control_data = [
    # Auto Mains Failure (AMF) Controllers
    {"partNo": "DSE7320", "name": "Deep Sea DSE7320 Auto Mains Failure Controller", "brand": "Deep Sea Electronics", "type": "AMF Controller", "rating": "Up to 500kVA", "features": "LCD Display, Modbus, Email/SMS", "price": 85000, "bulk": 78000, "qty": 12},
    {"partNo": "DSE7420", "name": "Deep Sea DSE7420 Auto Start Controller", "brand": "Deep Sea Electronics", "type": "AMF Controller", "rating": "Up to 1000kVA", "features": "LCD Display, CAN, Ethernet", "price": 125000, "bulk": 115000, "qty": 8},
    {"partNo": "DSE6020", "name": "Deep Sea DSE6020 MKII Manual Start Controller", "brand": "Deep Sea Electronics", "type": "Manual Controller", "rating": "Up to 250kVA", "features": "LCD Display, Engine Protection", "price": 42000, "bulk": 38000, "qty": 18},
    {"partNo": "DSE4520", "name": "Deep Sea DSE4520 MKII Auto Start Controller", "brand": "Deep Sea Electronics", "type": "Auto Start", "rating": "Up to 300kVA", "features": "LCD Display, Alarms", "price": 55000, "bulk": 50000, "qty": 15},
    {"partNo": "ComAp-IG-NT", "name": "ComAp InteliGen NT AMF Controller", "brand": "ComAp", "type": "AMF Controller", "rating": "Up to 600kVA", "features": "Color Display, Modbus, SNMP", "price": 95000, "bulk": 88000, "qty": 10},
    {"partNo": "ComAp-IG-NTC", "name": "ComAp InteliGen NTC BaseBox Controller", "brand": "ComAp", "type": "AMF Controller", "rating": "Up to 1500kVA", "features": "Touchscreen, CAN, Ethernet", "price": 145000, "bulk": 135000, "qty": 6},
    {"partNo": "SmartGen-HGM6120", "name": "SmartGen HGM6120 Genset Controller", "brand": "SmartGen", "type": "Auto Start", "rating": "Up to 400kVA", "features": "LCD Display, RS485, USB", "price": 38000, "bulk": 35000, "qty": 22},
    {"partNo": "SmartGen-HGM6320", "name": "SmartGen HGM6320 AMF Controller", "brand": "SmartGen", "type": "AMF Controller", "rating": "Up to 500kVA", "features": "LCD Display, Modbus, CAN", "price": 52000, "bulk": 48000, "qty": 16},
    {"partNo": "DATAKOM-D300", "name": "DATAKOM D-300 MPU Speed Controller", "brand": "DATAKOM", "type": "Speed Governor", "rating": "Universal", "features": "Digital Speed Control, MPU Input", "price": 18500, "bulk": 17000, "qty": 28},
    {"partNo": "DATAKOM-D200", "name": "DATAKOM D-200 MKII Generator Controller", "brand": "DATAKOM", "type": "Manual Controller", "rating": "Up to 200kVA", "features": "LED Display, Protection Modules", "price": 28000, "bulk": 25000, "qty": 20},

    # Manual Transfer Switches (MTS)
    {"partNo": "MTS-63A-3P", "name": "Manual Transfer Switch 63A 3-Pole", "brand": "Schneider Electric", "type": "MTS", "rating": "63A / 400V", "poles": "3-Pole", "price": 15500, "bulk": 14000, "qty": 35},
    {"partNo": "MTS-125A-3P", "name": "Manual Transfer Switch 125A 3-Pole", "brand": "Schneider Electric", "type": "MTS", "rating": "125A / 400V", "poles": "3-Pole", "price": 28500, "bulk": 26000, "qty": 24},
    {"partNo": "MTS-250A-3P", "name": "Manual Transfer Switch 250A 3-Pole", "brand": "Schneider Electric", "type": "MTS", "rating": "250A / 400V", "poles": "3-Pole", "price": 45000, "bulk": 42000, "qty": 18},
    {"partNo": "MTS-400A-3P", "name": "Manual Transfer Switch 400A 3-Pole", "brand": "Schneider Electric", "type": "MTS", "rating": "400A / 400V", "poles": "3-Pole", "price": 68000, "bulk": 63000, "qty": 12},
    {"partNo": "MTS-630A-3P", "name": "Manual Transfer Switch 630A 3-Pole", "brand": "Schneider Electric", "type": "MTS", "rating": "630A / 400V", "poles": "3-Pole", "price": 95000, "bulk": 88000, "qty": 8},

    # Automatic Transfer Switches (ATS)
    {"partNo": "ATS-100A-3P", "name": "Automatic Transfer Switch 100A 3-Pole", "brand": "Schneider Electric", "type": "ATS", "rating": "100A / 400V", "poles": "3-Pole + Controller", "price": 85000, "bulk": 78000, "qty": 14},
    {"partNo": "ATS-200A-3P", "name": "Automatic Transfer Switch 200A 3-Pole", "brand": "Schneider Electric", "type": "ATS", "rating": "200A / 400V", "poles": "3-Pole + Controller", "price": 125000, "bulk": 115000, "qty": 10},
    {"partNo": "ATS-400A-3P", "name": "Automatic Transfer Switch 400A 3-Pole", "brand": "Schneider Electric", "type": "ATS", "rating": "400A / 400V", "poles": "3-Pole + Controller", "price": 185000, "bulk": 175000, "qty": 7},
    {"partNo": "ATS-630A-3P", "name": "Automatic Transfer Switch 630A 3-Pole", "brand": "Schneider Electric", "type": "ATS", "rating": "630A / 400V", "poles": "3-Pole + Controller", "price": 265000, "bulk": 250000, "qty": 5},

    # Circuit Breakers
    {"partNo": "MCB-63A-3P", "name": "Miniature Circuit Breaker 63A 3-Pole C-Curve", "brand": "Schneider Electric", "type": "MCB", "rating": "63A / 400V", "curve": "C-Curve", "price": 4850, "bulk": 4500, "qty": 85},
    {"partNo": "MCCB-100A-3P", "name": "Molded Case Circuit Breaker 100A 3-Pole", "brand": "Schneider Electric", "type": "MCCB", "rating": "100A / 400V", "icu": "50kA", "price": 12500, "bulk": 11500, "qty": 45},
    {"partNo": "MCCB-250A-3P", "name": "Molded Case Circuit Breaker 250A 3-Pole", "brand": "Schneider Electric", "type": "MCCB", "rating": "250A / 400V", "icu": "50kA", "price": 28500, "bulk": 26000, "qty": 28},
    {"partNo": "MCCB-400A-3P", "name": "Molded Case Circuit Breaker 400A 3-Pole", "brand": "Schneider Electric", "type": "MCCB", "rating": "400A / 400V", "icu": "70kA", "price": 45000, "bulk": 42000, "qty": 18},
    {"partNo": "ACB-630A-3P", "name": "Air Circuit Breaker 630A 3-Pole", "brand": "Schneider Electric", "type": "ACB", "rating": "630A / 400V", "icu": "85kA", "price": 125000, "bulk": 115000, "qty": 8},
]

for ctrl in control_data:
    control_panels["parts"].append({
        "partNo": ctrl["partNo"],
        "name": ctrl["name"],
        "brand": ctrl["brand"],
        "category": ctrl["type"],
        "compatibility": ["Universal"],
        "specifications": {
            "rating": ctrl["rating"],
            "features": ctrl.get("features", ctrl.get("poles", ctrl.get("curve", ctrl.get("icu", "Standard"))))
        },
        "pricing": {
            "currency": "KES",
            "retailPrice": ctrl["price"],
            "bulkPrice": ctrl["bulk"],
            "minimumOrder": 1 if ctrl["price"] > 100000 else 2 if ctrl["price"] > 40000 else 4
        },
        "inventory": {
            "stock": "In Stock",
            "quantity": ctrl["qty"],
            "location": "Nairobi Warehouse",
            "leadTime": "Same Day" if ctrl["qty"] > 30 else "1-2 Days" if ctrl["qty"] > 10 else "1 Week"
        },
        "warranty": "24 months" if "Controller" in ctrl["name"] else "12 months",
        "tags": ["control-panel", ctrl["brand"].lower().replace(" ", "-"), ctrl["type"].lower().replace(" ", "-")]
    })

data["categories"][0]["subcategories"].append(control_panels)

# 6. Turbochargers & Air Systems
turbo_air = {
    "id": "turbochargers",
    "name": "Turbochargers & Air Intake Systems",
    "description": "Turbochargers, intercoolers, intake manifolds, and exhaust components",
    "parts": []
}

turbo_data = [
    # Turbochargers
    {"partNo": "3802908", "name": "Turbocharger - Cummins 6BT5.9 HX35W", "brand": "Holset", "compat": ["6BT5.9", "6BTA5.9"], "model": "HX35W", "ar": "0.63 A/R", "price": 95000, "bulk": 88000, "qty": 12},
    {"partNo": "3590044", "name": "Turbocharger - Cummins 6CT8.3 HX40W", "brand": "Holset", "compat": ["6CT8.3", "6CTA8.3"], "model": "HX40W", "ar": "0.68 A/R", "price": 125000, "bulk": 115000, "qty": 9},
    {"partNo": "4955908", "name": "Turbocharger - Cummins ISBe HE221W", "brand": "Holset", "compat": ["ISBe4", "ISBe6"], "model": "HE221W VGT", "ar": "Variable Geometry", "price": 185000, "bulk": 175000, "qty": 6},
    {"partNo": "4955909", "name": "Turbocharger - Cummins QSB6.7 HE300VG", "brand": "Holset", "compat": ["QSB6.7"], "model": "HE300VG VGT", "ar": "Variable Geometry", "price": 215000, "bulk": 205000, "qty": 5},
    {"partNo": "2674A200", "name": "Turbocharger - Perkins 1104C GT2052S", "brand": "Garrett", "compat": ["1104C-44T", "1104C-E44T"], "model": "GT2052S", "ar": "0.60 A/R", "price": 85000, "bulk": 78000, "qty": 10},
    {"partNo": "2674A225", "name": "Turbocharger - Perkins 1106C GT2556S", "brand": "Garrett", "compat": ["1106C-E66T"], "model": "GT2556S", "ar": "0.63 A/R", "price": 95000, "bulk": 88000, "qty": 8},
    {"partNo": "320-1840", "name": "Turbocharger - CAT 3054 S200G", "brand": "Schwitzer", "compat": ["3054C", "3056E"], "model": "S200G", "ar": "0.60 A/R", "price": 115000, "bulk": 105000, "qty": 7},
    {"partNo": "353-0681", "name": "Turbocharger - CAT C6.6 S300SX", "brand": "BorgWarner", "compat": ["C6.6"], "model": "S300SX", "ar": "0.70 A/R", "price": 165000, "bulk": 155000, "qty": 5},
    {"partNo": "387-5820", "name": "Turbocharger - CAT C7.1 S400SX", "brand": "BorgWarner", "compat": ["C7.1"], "model": "S400SX", "ar": "0.75 A/R", "price": 195000, "bulk": 185000, "qty": 4},

    # Intercoolers
    {"partNo": "3966670", "name": "Intercooler - Cummins 6BTA5.9", "brand": "Cummins", "compat": ["6BTA5.9"], "size": "450x300x65mm", "cooling": "Air-to-Air", "price": 35000, "bulk": 32000, "qty": 14},
    {"partNo": "3974681", "name": "Intercooler - Cummins 6CTA8.3", "brand": "Cummins", "compat": ["6CTA8.3"], "size": "550x350x75mm", "cooling": "Air-to-Air", "price": 42000, "bulk": 39000, "qty": 11},
    {"partNo": "4965093", "name": "Intercooler - Cummins ISBe", "brand": "Cummins", "compat": ["ISBe6"], "size": "600x400x80mm", "cooling": "Air-to-Air", "price": 48000, "bulk": 45000, "qty": 9},
    {"partNo": "U45017800", "name": "Intercooler - Perkins 1104C-44T", "brand": "Perkins", "compat": ["1104C-44T"], "size": "400x280x60mm", "cooling": "Air-to-Air", "price": 32000, "bulk": 30000, "qty": 12},
    {"partNo": "U45066700", "name": "Intercooler - Perkins 1106C-E66T", "brand": "Perkins", "compat": ["1106C-E66T"], "size": "500x320x70mm", "cooling": "Air-to-Air", "price": 38000, "bulk": 35000, "qty": 10},

    # Intake & Exhaust Manifolds
    {"partNo": "3943740", "name": "Intake Manifold - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "material": "Cast Iron", "ports": "6 Ports", "price": 28500, "bulk": 26000, "qty": 16},
    {"partNo": "3920692", "name": "Intake Manifold - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "material": "Cast Iron", "ports": "4 Ports", "price": 22500, "bulk": 20000, "qty": 18},
    {"partNo": "3925540", "name": "Exhaust Manifold - Cummins 6BT", "brand": "Cummins", "compat": ["6BT5.9", "6BTA5.9"], "material": "Ductile Iron", "ports": "6 Ports", "price": 32000, "bulk": 30000, "qty": 14},
    {"partNo": "3929164", "name": "Exhaust Manifold - Cummins 4BT", "brand": "Cummins", "compat": ["4BT3.9", "4BTA3.9"], "material": "Ductile Iron", "ports": "4 Ports", "price": 24500, "bulk": 22000, "qty": 16},
    {"partNo": "U5MW0089", "name": "Intake Manifold - Perkins 1104C", "brand": "Perkins", "compat": ["1104C-44"], "material": "Aluminum", "ports": "4 Ports", "price": 25000, "bulk": 23000, "qty": 14},
    {"partNo": "U5MW0127", "name": "Exhaust Manifold - Perkins 1106C", "brand": "Perkins", "compat": ["1106C-E66T"], "material": "Cast Iron", "ports": "6 Ports", "price": 35000, "bulk": 32000, "qty": 11},
]

for turbo in turbo_data:
    turbo_air["parts"].append({
        "partNo": turbo["partNo"],
        "name": turbo["name"],
        "brand": turbo["brand"],
        "category": "Turbocharger" if "Turbocharger" in turbo["name"] else "Intercooler" if "Intercooler" in turbo["name"] else "Manifold",
        "compatibility": turbo["compat"],
        "specifications": {
            "specification": turbo.get("model", turbo.get("size", turbo.get("material", "Standard"))),
            "detail": turbo.get("ar", turbo.get("cooling", turbo.get("ports", "N/A")))
        },
        "pricing": {
            "currency": "KES",
            "retailPrice": turbo["price"],
            "bulkPrice": turbo["bulk"],
            "minimumOrder": 1 if turbo["price"] > 100000 else 2
        },
        "inventory": {
            "stock": "In Stock",
            "quantity": turbo["qty"],
            "location": "Nairobi Warehouse",
            "leadTime": "1-2 Days" if turbo["qty"] > 8 else "1 Week"
        },
        "warranty": "12 months",
        "tags": ["turbo-air-system", turbo["brand"].lower()]
    })

data["categories"][0]["subcategories"].append(turbo_air)

# Write updated database
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'w') as f:
    json.dump(data, f, indent=2)

# Count final parts
final_parts = 0
for subcat in data["categories"][0]["subcategories"]:
    final_parts += len(subcat["parts"])

print(f"\n=== DATABASE UPDATE COMPLETE ===")
print(f"Total Parts: {final_parts}")
print(f"Total Subcategories: {len(data['categories'][0]['subcategories'])}")
print(f"\nSubcategory Breakdown:")
for subcat in data["categories"][0]["subcategories"]:
    print(f"  - {subcat['name']}: {len(subcat['parts'])} parts")
