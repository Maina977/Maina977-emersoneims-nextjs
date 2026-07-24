/**
 * Parts Inventory Parser - Import 15,452 parts from CSV
 * Converts raw CSV data into searchable, typed parts catalog
 */

export interface Part {
  id: string;
  code: string;
  name: string;
  category: string;
  subcategory: string;
  brand?: string;
  uom: string; // Unit of Measure (pcs, pack, set, etc.)
  quantity: number; // Currently in stock
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  location: string;
  margin: number; // Calculated: (sellingPrice - costPrice) / sellingPrice * 100
  inStock: boolean;
  image?: string;
  description?: string;
  rating?: number;
  reviews?: number;
}

// Raw CSV data mapping
const CSV_DATA = `Code,Name,Category,Subcategory,Brand,UOM,Qty,Reorder,Cost,Price,Location`;

/**
 * Parse CSV and generate parts database
 * Since CSV is large, we'll generate it once and cache
 */
export function parsePartsCSV(csvContent: string): Part[] {
  const lines = csvContent.trim().split('\n');
  const header = lines[0].split(',');

  return lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    const cost = parseInt(values[8] || '0');
    const price = parseInt(values[9] || '0');

    return {
      id: `part-${index}`,
      code: values[0]?.trim() || '',
      name: values[1]?.trim() || '',
      category: values[2]?.trim() || 'Other',
      subcategory: values[3]?.trim() || '',
      brand: values[4]?.trim() || 'Generic',
      uom: values[5]?.trim() || 'pcs',
      quantity: parseInt(values[6] || '0'),
      reorderLevel: parseInt(values[7] || '0'),
      costPrice: cost,
      sellingPrice: price,
      location: values[10]?.trim() || 'Main Store',
      margin: price > 0 ? Math.round(((price - cost) / price) * 100) : 0,
      inStock: parseInt(values[6] || '0') > 0,
      description: `${values[1]} - ${values[3]}`,
      rating: Math.random() * 5, // Placeholder - will be updated with real reviews
      reviews: Math.floor(Math.random() * 50)
    };
  });
}

/**
 * Parse CSV line respecting quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Generate static parts list for Nextjs
 * This will be generated at build time from the CSV
 */
export const PARTS_CATEGORIES = [
  'Abrasives',
  'Bearings',
  'Belts & Chains',
  'Electrical',
  'Engine Parts',
  'Fasteners',
  'Filters',
  'Fluids',
  'Gaskets & Seals',
  'Hydraulics',
  'Motors',
  'Pumps',
  'Valves',
  'Other'
];

export const PARTS_PRICE_RANGES = [
  { min: 0, max: 500, label: 'Under KES 500' },
  { min: 500, max: 2000, label: 'KES 500 - 2,000' },
  { min: 2000, max: 5000, label: 'KES 2,000 - 5,000' },
  { min: 5000, max: 10000, label: 'KES 5,000 - 10,000' },
  { min: 10000, max: Infinity, label: 'Above KES 10,000' }
];

/**
 * Search parts by query
 */
export function searchParts(parts: Part[], query: string): Part[] {
  const q = query.toLowerCase();
  return parts.filter(part =>
    part.name.toLowerCase().includes(q) ||
    part.code.toLowerCase().includes(q) ||
    part.category.toLowerCase().includes(q) ||
    part.brand?.toLowerCase().includes(q)
  );
}

/**
 * Filter parts by criteria
 */
export function filterParts(
  parts: Part[],
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
  }
): Part[] {
  return parts.filter(part => {
    if (filters.category && part.category !== filters.category) return false;
    if (filters.brand && part.brand !== filters.brand) return false;
    if (filters.minPrice !== undefined && part.sellingPrice < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && part.sellingPrice > filters.maxPrice) return false;
    if (filters.inStockOnly && !part.inStock) return false;
    return true;
  });
}
