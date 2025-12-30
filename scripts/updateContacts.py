import json

# Read the JSON file
with open('app/data/kenyanMarketProducts.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

# Update all supplier contacts
for category_name, category_data in data.items():
    if isinstance(category_data, list):
        for item in category_data:
            if 'supplier' in item:
                item['supplier'] = 'EmersonEIMS'
                item['supplierContact'] = '+254 768 860 655 | +254 782 914 717'

# Write back to file
with open('app/data/kenyanMarketProducts.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ All supplier contacts updated to EmersonEIMS")
print("   Phone: +254 768 860 655 | +254 782 914 717")
print("   Email: emersoneimservices@gmail.com | info@emersoneims.com")
