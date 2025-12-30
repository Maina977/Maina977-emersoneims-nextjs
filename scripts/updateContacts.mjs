import { readFileSync, writeFileSync } from 'fs';

// Read the JSON file
const data = JSON.parse(readFileSync('app/data/kenyanMarketProducts.json', 'utf8'));

// Update all supplier contacts
let updated = 0;
for (const category in data) {
  if (Array.isArray(data[category])) {
    data[category].forEach(item => {
      if (item.supplier) {
        item.supplier = 'EmersonEIMS';
        item.supplierContact = '+254 768 860 655 | +254 782 914 717';
        updated++;
      }
    });
  }
}

// Write back to file
writeFileSync('app/data/kenyanMarketProducts.json', JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Updated ${updated} products with EmersonEIMS contact`);
console.log('   Phone: +254 768 860 655 | +254 782 914 717');
console.log('   Email: emersoneimservices@gmail.com | info@emersoneims.com');
