import fs from 'fs';
import path from 'path';
import type { Part } from '@/lib/parts/partsInventoryParser';

// Cache the parsed CSV in memory
let partsCache: Part[] | null = null;

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

function loadParts(): Part[] {
  if (partsCache) return partsCache;

  const csvPath = path.join(process.cwd(), 'lib/parts/inventory-2026-07-22.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.trim().split('\n');

  const parts: Part[] = lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    const cost = parseInt(values[8] || '0');
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
      reorderLevel: parseInt(values[7] || '0'),
      costPrice: cost,
      sellingPrice: price,
      location: values[10]?.trim() || 'Main Store',
      margin: price > 0 ? Math.round(((price - cost) / price) * 100) : 0,
      inStock: qty > 0,
      description: `${values[1]} - ${values[3]}`,
      rating: 4.5 + Math.random() * 0.5,
      reviews: Math.floor(Math.random() * 150) + 10
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
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
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
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
