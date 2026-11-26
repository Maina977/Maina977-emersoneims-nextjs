/**
 * Public parts search (security sweep 2026-11-26).
 *
 * This route is public (the spare-parts and marketplace pages call it). It
 * used to return every row of the internal stock file with its cost price,
 * margin %, reorder level and store location, with no cap on `limit`, so
 * one request (?limit=100000) gave anyone the whole cost and margin sheet.
 * It also invented a star rating and review count for every part with
 * Math.random(). It now returns only what a customer sees: code, name,
 * category, brand, unit, selling price, stock quantity and in-stock flag.
 * No rating or review count is returned until real reviews exist.
 * `limit` is clamped (the spare-parts page loads the catalogue in one call).
 */
import fs from 'fs';
import path from 'path';

/** What the public may see of a part. Cost, margin, reorder level and location are internal. */
interface PublicPart {
  id: string;
  code: string;
  name: string;
  category: string;
  subcategory: string;
  brand?: string;
  uom: string;
  quantity: number;
  sellingPrice: number;
  inStock: boolean;
  description?: string;
}

const MAX_LIMIT = 20_000;

// Cache the parsed CSV in memory
let partsCache: PublicPart[] | null = null;

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

function loadParts(): PublicPart[] {
  if (partsCache) return partsCache;

  const csvPath = path.join(process.cwd(), 'lib/parts/inventory-2026-07-22.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.trim().split('\n');

  const parts: PublicPart[] = lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    const price = parseInt(values[9] || '0');
    const qty = parseInt(values[6] || '0');

    return {
      id: `part-${index}`,
      code: values[0]?.trim() || '',
      name: values[1]?.trim() || '',
      category: values[2]?.trim() || 'Other',
      subcategory: values[3]?.trim() || '',
      brand: values[4]?.trim() || 'Generic',
      uom: values[5]?.trim() || 'pcs',
      quantity: qty,
      sellingPrice: price,
      inStock: qty > 0,
      description: `${values[1]} - ${values[3]}`,
    };
  });

  partsCache = parts;
  return parts;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : Infinity;
    const rawPage = parseInt(searchParams.get('page') || '1');
    const rawLimit = parseInt(searchParams.get('limit') || '20');
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;
    const limit = Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.min(rawLimit, MAX_LIMIT) : 20;
    const sort = searchParams.get('sort') || 'name';

    const parts = loadParts();

    // Filter
    let filtered = parts;

    if (query) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    filtered = filtered.filter(p =>
      p.sellingPrice >= minPrice && p.sellingPrice <= maxPrice
    );

    // Sort
    switch (sort) {
      case 'price-low':
        filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      // 'rating' has no data (ratings were invented and are no longer returned): sorted by name.
      case 'newest':
        break; // Maintains insertion order
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Paginate
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const results = filtered.slice(start, end);

    return Response.json({
      parts: results,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return Response.json(
      { error: 'Failed to fetch parts' },
      { status: 500 }
    );
  }
}
