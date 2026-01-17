import json

# Read current database
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'r') as f:
    data = json.load(f)

# Add Safety & Fire Protection category with 19+ parts
safety = {
    "id": "safety-fire",
    "name": "Safety Equipment & Fire Protection",
    "description": "Fire extinguishers, safety switches, emergency stops, PPE",
    "parts": [
        {
            "partNo": "FIRE-EXT-6KG-DCP",
            "name": "Fire Extinguisher - 6kg DCP (Dry Chemical Powder)",
            "brand": "Safe-T",
            "category": "Fire Safety",
            "compatibility": ["Universal - Class ABC Fires"],
            "specifications": {"capacity": "6kg", "type": "DCP", "rating": "8A 34B C"},
            "pricing": {"currency": "KES", "retailPrice": 4500, "bulkPrice": 4000, "minimumOrder": 4},
            "inventory": {"stock": "In Stock", "quantity": 85, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "12 months",
            "tags": ["safety", "fire-extinguisher"]
        },
        {
            "partNo": "FIRE-EXT-9KG-DCP",
            "name": "Fire Extinguisher - 9kg DCP (Dry Chemical Powder)",
            "brand": "Safe-T",
            "category": "Fire Safety",
            "compatibility": ["Universal - Class ABC Fires"],
            "specifications": {"capacity": "9kg", "type": "DCP", "rating": "13A 55B C"},
            "pricing": {"currency": "KES", "retailPrice": 6500, "bulkPrice": 5800, "minimumOrder": 4},
            "inventory": {"stock": "In Stock", "quantity": 75, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "12 months",
            "tags": ["safety", "fire-extinguisher"]
        },
        {
            "partNo": "FIRE-EXT-6KG-CO2",
            "name": "Fire Extinguisher - 6kg CO2 (Carbon Dioxide)",
            "brand": "Safe-T",
            "category": "Fire Safety",
            "compatibility": ["Universal - Electrical Fires"],
            "specifications": {"capacity": "6kg", "type": "CO2", "rating": "34B Electrical"},
            "pricing": {"currency": "KES", "retailPrice": 8500, "bulkPrice": 7800, "minimumOrder": 2},
            "inventory": {"stock": "In Stock", "quantity": 55, "location": "Nairobi Warehouse", "leadTime": "1-2 Days"},
            "warranty": "12 months",
            "tags": ["safety", "fire-extinguisher"]
        },
        {
            "partNo": "E-STOP-RED",
            "name": "Emergency Stop Button - Red Mushroom Head",
            "brand": "Schneider Electric",
            "category": "Safety Switch",
            "compatibility": ["Universal"],
            "specifications": {"type": "Mushroom Push Button", "contact": "NC (Normally Closed)"},
            "pricing": {"currency": "KES", "retailPrice": 2850, "bulkPrice": 2500, "minimumOrder": 6},
            "inventory": {"stock": "In Stock", "quantity": 125, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "24 months",
            "tags": ["safety", "emergency-stop"]
        },
        {
            "partNo": "E-STOP-REMOTE",
            "name": "Remote Emergency Stop - Wired with 5m Cable",
            "brand": "Universal",
            "category": "Safety Switch",
            "compatibility": ["Universal"],
            "specifications": {"type": "Wired Remote", "cable": "5 meters"},
            "pricing": {"currency": "KES", "retailPrice": 4500, "bulkPrice": 4000, "minimumOrder": 4},
            "inventory": {"stock": "In Stock", "quantity": 85, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "12 months",
            "tags": ["safety", "emergency-stop"]
        },
        {
            "partNo": "SAFETY-SIGN-DANGER",
            "name": "Safety Sign - DANGER High Voltage (300x200mm)",
            "brand": "Universal",
            "category": "Safety Signage",
            "compatibility": ["Universal"],
            "specifications": {"size": "300x200mm", "material": "Aluminum"},
            "pricing": {"currency": "KES", "retailPrice": 850, "bulkPrice": 750, "minimumOrder": 10},
            "inventory": {"stock": "In Stock", "quantity": 285, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "N/A",
            "tags": ["safety", "signage"]
        },
        {
            "partNo": "SAFETY-SIGN-AUTO",
            "name": "Safety Sign - AUTO START Generator (300x200mm)",
            "brand": "Universal",
            "category": "Safety Signage",
            "compatibility": ["Universal"],
            "specifications": {"size": "300x200mm", "material": "Aluminum"},
            "pricing": {"currency": "KES", "retailPrice": 850, "bulkPrice": 750, "minimumOrder": 10},
            "inventory": {"stock": "In Stock", "quantity": 265, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "N/A",
            "tags": ["safety", "signage"]
        },
        {
            "partNo": "PPE-GLOVES-ELEC",
            "name": "Electrical Safety Gloves - Class 0 (1000V)",
            "brand": "Ansell",
            "category": "PPE",
            "compatibility": ["Universal"],
            "specifications": {"voltage": "1000V AC", "class": "Class 0"},
            "pricing": {"currency": "KES", "retailPrice": 4500, "bulkPrice": 4000, "minimumOrder": 5},
            "inventory": {"stock": "In Stock", "quantity": 95, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "6 months",
            "tags": ["safety", "ppe", "gloves"]
        },
        {
            "partNo": "PPE-GOGGLES",
            "name": "Safety Goggles - Clear Anti-Fog",
            "brand": "3M",
            "category": "PPE",
            "compatibility": ["Universal"],
            "specifications": {"lens": "Polycarbonate", "coating": "Anti-Fog"},
            "pricing": {"currency": "KES", "retailPrice": 1250, "bulkPrice": 1100, "minimumOrder": 10},
            "inventory": {"stock": "In Stock", "quantity": 185, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "6 months",
            "tags": ["safety", "ppe", "goggles"]
        },
        {
            "partNo": "PPE-HELMET",
            "name": "Safety Helmet - Hard Hat Yellow",
            "brand": "MSA",
            "category": "PPE",
            "compatibility": ["Universal"],
            "specifications": {"type": "Hard Hat", "color": "Yellow"},
            "pricing": {"currency": "KES", "retailPrice": 1850, "bulkPrice": 1650, "minimumOrder": 10},
            "inventory": {"stock": "In Stock", "quantity": 165, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "12 months",
            "tags": ["safety", "ppe", "helmet"]
        },
        {
            "partNo": "PPE-EARPLUGS",
            "name": "Hearing Protection - Foam Ear Plugs (Pack of 10 pairs)",
            "brand": "3M",
            "category": "PPE",
            "compatibility": ["Universal"],
            "specifications": {"nrr": "33dB", "type": "Disposable Foam"},
            "pricing": {"currency": "KES", "retailPrice": 650, "bulkPrice": 550, "minimumOrder": 20},
            "inventory": {"stock": "In Stock", "quantity": 385, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "N/A",
            "tags": ["safety", "ppe", "hearing"]
        },
        {
            "partNo": "PPE-BOOTS",
            "name": "Safety Boots - Steel Toe Cap Size 42",
            "brand": "Bata Industrials",
            "category": "PPE",
            "compatibility": ["Universal"],
            "specifications": {"size": "42", "protection": "Steel Toe Cap"},
            "pricing": {"currency": "KES", "retailPrice": 6500, "bulkPrice": 5800, "minimumOrder": 5},
            "inventory": {"stock": "In Stock", "quantity": 75, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "6 months",
            "tags": ["safety", "ppe", "boots"]
        },
        {
            "partNo": "LOCKOUT-KIT",
            "name": "Lockout/Tagout Kit - Electrical Safety",
            "brand": "Master Lock",
            "category": "Safety Equipment",
            "compatibility": ["Universal"],
            "specifications": {"type": "Complete LOTO Kit", "components": "Locks, Tags, Devices"},
            "pricing": {"currency": "KES", "retailPrice": 12500, "bulkPrice": 11500, "minimumOrder": 2},
            "inventory": {"stock": "In Stock", "quantity": 45, "location": "Nairobi Warehouse", "leadTime": "1-2 Days"},
            "warranty": "24 months",
            "tags": ["safety", "lockout"]
        },
        {
            "partNo": "FIRST-AID-KIT",
            "name": "First Aid Kit - Industrial (Wall Mounted)",
            "brand": "St John Ambulance",
            "category": "Safety Equipment",
            "compatibility": ["Universal"],
            "specifications": {"type": "Wall Mounted Box", "capacity": "50 Person"},
            "pricing": {"currency": "KES", "retailPrice": 8500, "bulkPrice": 7800, "minimumOrder": 4},
            "inventory": {"stock": "In Stock", "quantity": 65, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "N/A",
            "tags": ["safety", "first-aid"]
        },
        {
            "partNo": "FIRE-BLANKET",
            "name": "Fire Blanket - 1.2m x 1.8m",
            "brand": "Safe-T",
            "category": "Fire Safety",
            "compatibility": ["Universal"],
            "specifications": {"size": "1.2m x 1.8m", "material": "Fiberglass"},
            "pricing": {"currency": "KES", "retailPrice": 3850, "bulkPrice": 3500, "minimumOrder": 5},
            "inventory": {"stock": "In Stock", "quantity": 95, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "12 months",
            "tags": ["safety", "fire-blanket"]
        },
        {
            "partNo": "SMOKE-DETECTOR",
            "name": "Smoke Detector - Optical Sensor with Battery",
            "brand": "Honeywell",
            "category": "Fire Safety",
            "compatibility": ["Universal"],
            "specifications": {"type": "Optical Sensor", "power": "9V Battery"},
            "pricing": {"currency": "KES", "retailPrice": 2850, "bulkPrice": 2500, "minimumOrder": 10},
            "inventory": {"stock": "In Stock", "quantity": 145, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "12 months",
            "tags": ["safety", "smoke-detector"]
        },
        {
            "partNo": "SPILL-KIT",
            "name": "Spill Kit - Oil & Fuel (20 Liter Capacity)",
            "brand": "Spilltech",
            "category": "Safety Equipment",
            "compatibility": ["Universal"],
            "specifications": {"capacity": "20 Liters", "type": "Oil & Fuel Absorbent"},
            "pricing": {"currency": "KES", "retailPrice": 6500, "bulkPrice": 5800, "minimumOrder": 4},
            "inventory": {"stock": "In Stock", "quantity": 55, "location": "Nairobi Warehouse", "leadTime": "1-2 Days"},
            "warranty": "N/A",
            "tags": ["safety", "spill-kit"]
        },
        {
            "partNo": "SAFETY-HARNESS",
            "name": "Safety Harness - Full Body with Lanyard",
            "brand": "Miller",
            "category": "PPE",
            "compatibility": ["Universal"],
            "specifications": {"type": "Full Body Harness", "lanyard": "2m Shock Absorbing"},
            "pricing": {"currency": "KES", "retailPrice": 18500, "bulkPrice": 17000, "minimumOrder": 2},
            "inventory": {"stock": "In Stock", "quantity": 35, "location": "Nairobi Warehouse", "leadTime": "1-2 Days"},
            "warranty": "12 months",
            "tags": ["safety", "ppe", "harness"]
        },
        {
            "partNo": "SAFETY-CONE",
            "name": "Traffic Safety Cone - 750mm Orange with Reflective Band",
            "brand": "Universal",
            "category": "Safety Equipment",
            "compatibility": ["Universal"],
            "specifications": {"height": "750mm", "color": "Orange with Reflective"},
            "pricing": {"currency": "KES", "retailPrice": 1450, "bulkPrice": 1300, "minimumOrder": 10},
            "inventory": {"stock": "In Stock", "quantity": 215, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "N/A",
            "tags": ["safety", "traffic-cone"]
        },
        {
            "partNo": "SAFETY-BARRIER",
            "name": "Safety Barrier Tape - Yellow/Black (500m Roll)",
            "brand": "Universal",
            "category": "Safety Equipment",
            "compatibility": ["Universal"],
            "specifications": {"length": "500 meters", "color": "Yellow & Black"},
            "pricing": {"currency": "KES", "retailPrice": 2850, "bulkPrice": 2500, "minimumOrder": 5},
            "inventory": {"stock": "In Stock", "quantity": 125, "location": "Nairobi Warehouse", "leadTime": "Same Day"},
            "warranty": "N/A",
            "tags": ["safety", "barrier-tape"]
        }
    ]
}

data["categories"][0]["subcategories"].append(safety)

# Update total count
data["totalParts"] = sum(len(sc["parts"]) for sc in data["categories"][0]["subcategories"])

# Write final database
with open(r'c:\Users\PC\my-app\app\data\spare-parts-database-COMPLETE.json', 'w') as f:
    json.dump(data, f, indent=2)

# Final report
total = data["totalParts"]
print(f"\n{'='*70}")
print(f"       COMPLETE SPARE PARTS DATABASE - FINAL VERSION")
print(f"{'='*70}")
print(f"Total Parts in Database: {total}")
print(f"Original Target: 1247")
print(f"Status: {'✅ TARGET ACHIEVED AND EXCEEDED!' if total >= 1247 else '❌ Need more'}")
print(f"\n{'-'*70}")
print(f"Complete Category Breakdown:")
print(f"{'-'*70}")
for idx, sc in enumerate(data["categories"][0]["subcategories"], 1):
    print(f"{idx:2}. {sc['name']:<55} {len(sc['parts']):>4} parts")
print(f"{'-'*70}")
print(f"{'TOTAL':<58} {total:>4} parts")
print(f"{'='*70}\n")
print(f"✅ Database file saved successfully!")
print(f"📁 Location: c:\\Users\\PC\\my-app\\app\\data\\spare-parts-database-COMPLETE.json")
print(f"\n")
