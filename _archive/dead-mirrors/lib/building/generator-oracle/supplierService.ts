/**
 * GENERATOR ORACLE - SUPPLIER SERVICE
 * Manages supplier database and parts ordering
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { getPostgresPool } from '@/lib/db';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  location?: string;
  city?: string;
  country?: string;
  specialties?: string[];
  brandsCarried?: string[];
  isVerified: boolean;
  rating?: number;
  responseTime?: string;
  createdAt?: string;
}

export interface PartRequest {
  id?: number;
  diagnosisId?: string;
  supplierId: number;
  supplierName?: string;
  partsRequested: PartItem[];
  contactMethod: 'whatsapp' | 'phone' | 'email';
  status: 'draft' | 'sent' | 'quoted' | 'ordered' | 'delivered';
  notes?: string;
  totalQuoted?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartItem {
  name: string;
  partNumber?: string;
  quantity: number;
  description?: string;
  urgency?: 'normal' | 'urgent' | 'critical';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

export async function initSupplierTables(): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    // Suppliers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_suppliers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        whatsapp VARCHAR(20),
        email VARCHAR(255),
        location TEXT,
        city VARCHAR(100),
        country VARCHAR(100) DEFAULT 'Kenya',
        specialties JSONB DEFAULT '[]',
        brands_carried JSONB DEFAULT '[]',
        is_verified BOOLEAN DEFAULT FALSE,
        rating DECIMAL(3, 2),
        response_time VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Parts requests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_parts_requests (
        id SERIAL PRIMARY KEY,
        diagnosis_id VARCHAR(100),
        supplier_id INTEGER REFERENCES oracle_suppliers(id),
        parts_requested JSONB NOT NULL,
        contact_method VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'draft',
        notes TEXT,
        total_quoted DECIMAL(12, 2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_suppliers_city ON oracle_suppliers(city)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_suppliers_verified ON oracle_suppliers(is_verified)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_parts_requests_status ON oracle_parts_requests(status)`);

    // Seed initial suppliers if empty
    const countResult = await pool.query(`SELECT COUNT(*) as count FROM oracle_suppliers`);
    const count = countResult.rows[0] as { count: string };
    if (parseInt(count.count) === 0) {
      await seedInitialSuppliers();
    }

    return true;
  } catch (error) {
    console.error('Failed to init supplier tables:', error);
    return false;
  }
}

async function seedInitialSuppliers(): Promise<void> {
  const pool = await getPostgresPool();
  if (!pool) return;

  const suppliers = [
    {
      name: 'PowerGen Parts Kenya',
      phone: '+254 720 123 456',
      whatsapp: '+254720123456',
      email: 'sales@powergenparts.co.ke',
      location: 'Industrial Area, Nairobi',
      city: 'Nairobi',
      specialties: ['Cummins', 'Perkins', 'Filters', 'Belts'],
      brandsCarried: ['Cummins', 'Perkins', 'Caterpillar'],
      isVerified: true,
      rating: 4.5,
      responseTime: '< 2 hours',
    },
    {
      name: 'Generator Spares East Africa',
      phone: '+254 733 456 789',
      whatsapp: '+254733456789',
      email: 'info@genspares.co.ke',
      location: 'Mombasa Road, Nairobi',
      city: 'Nairobi',
      specialties: ['Controllers', 'AVR', 'Starters', 'Alternators'],
      brandsCarried: ['DeepSea', 'ComAp', 'Stamford', 'Leroy Somer'],
      isVerified: true,
      rating: 4.8,
      responseTime: '< 1 hour',
    },
    {
      name: 'Coast Power Solutions',
      phone: '+254 741 234 567',
      whatsapp: '+254741234567',
      email: 'parts@coastpower.co.ke',
      location: 'Nyali, Mombasa',
      city: 'Mombasa',
      specialties: ['Marine Generators', 'Cooling Systems', 'Fuel Systems'],
      brandsCarried: ['Volvo Penta', 'John Deere', 'MTU'],
      isVerified: true,
      rating: 4.3,
      responseTime: '< 4 hours',
    },
    {
      name: 'Western Generator Parts',
      phone: '+254 712 345 678',
      whatsapp: '+254712345678',
      location: 'Eldoret Town',
      city: 'Eldoret',
      specialties: ['Agricultural Generators', 'Small Parts'],
      brandsCarried: ['Kipor', 'Honda', 'Yamaha'],
      isVerified: false,
      rating: 4.0,
    },
    {
      name: 'FG Wilson Parts Direct',
      phone: '+254 722 111 222',
      whatsapp: '+254722111222',
      email: 'parts@fgwilsonkenya.com',
      location: 'Westlands, Nairobi',
      city: 'Nairobi',
      specialties: ['FG Wilson OEM', 'Service Kits', 'Controllers'],
      brandsCarried: ['FG Wilson', 'Perkins', 'DeepSea'],
      isVerified: true,
      rating: 4.9,
      responseTime: '< 30 minutes',
    },
  ];

  for (const supplier of suppliers) {
    await pool.query(
      `INSERT INTO oracle_suppliers (
        name, phone, whatsapp, email, location, city,
        specialties, brands_carried, is_verified, rating, response_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        supplier.name,
        supplier.phone,
        supplier.whatsapp,
        supplier.email || null,
        supplier.location,
        supplier.city,
        JSON.stringify(supplier.specialties),
        JSON.stringify(supplier.brandsCarried),
        supplier.isVerified,
        supplier.rating,
        supplier.responseTime || null,
      ]
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPLIER OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface SupplierRow {
  id: number;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  specialties: string[];
  brands_carried: string[];
  is_verified: boolean;
  rating: string | null;
  response_time: string | null;
  created_at: Date;
}

/**
 * Get all suppliers
 */
export async function getAllSuppliers(): Promise<Supplier[]> {
  const pool = await getPostgresPool();
  if (!pool) return getDefaultSuppliers();

  try {
    await initSupplierTables();

    const result = await pool.query(
      `SELECT * FROM oracle_suppliers ORDER BY is_verified DESC, rating DESC NULLS LAST`
    );

    return result.rows.map((row: unknown) => mapSupplierRow(row as unknown as SupplierRow));
  } catch (error) {
    console.error('Failed to get suppliers:', error);
    return getDefaultSuppliers();
  }
}

/**
 * Search suppliers by brand or specialty
 */
export async function searchSuppliers(query: string): Promise<Supplier[]> {
  const pool = await getPostgresPool();
  if (!pool) {
    return getDefaultSuppliers().filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.brandsCarried?.some(b => b.toLowerCase().includes(query.toLowerCase())) ||
      s.specialties?.some(sp => sp.toLowerCase().includes(query.toLowerCase()))
    );
  }

  try {
    await initSupplierTables();

    const result = await pool.query(
      `SELECT * FROM oracle_suppliers
       WHERE name ILIKE $1
          OR specialties::text ILIKE $1
          OR brands_carried::text ILIKE $1
          OR city ILIKE $1
       ORDER BY is_verified DESC, rating DESC NULLS LAST`,
      [`%${query}%`]
    );

    return result.rows.map((row: unknown) => mapSupplierRow(row as unknown as SupplierRow));
  } catch (error) {
    console.error('Failed to search suppliers:', error);
    return [];
  }
}

/**
 * Get suppliers by city
 */
export async function getSuppliersByCity(city: string): Promise<Supplier[]> {
  const pool = await getPostgresPool();
  if (!pool) {
    return getDefaultSuppliers().filter(s =>
      s.city?.toLowerCase() === city.toLowerCase()
    );
  }

  try {
    await initSupplierTables();

    const result = await pool.query(
      `SELECT * FROM oracle_suppliers
       WHERE city ILIKE $1
       ORDER BY is_verified DESC, rating DESC NULLS LAST`,
      [city]
    );

    return result.rows.map((row: unknown) => mapSupplierRow(row as unknown as SupplierRow));
  } catch (error) {
    console.error('Failed to get suppliers by city:', error);
    return [];
  }
}

/**
 * Get supplier by ID
 */
export async function getSupplierById(id: number): Promise<Supplier | null> {
  const pool = await getPostgresPool();
  if (!pool) return null;

  try {
    const result = await pool.query(
      `SELECT * FROM oracle_suppliers WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0 ? mapSupplierRow(result.rows[0] as unknown as SupplierRow) : null;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARTS REQUEST OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface PartRequestRow {
  id: number;
  diagnosis_id: string | null;
  supplier_id: number;
  parts_requested: PartItem[];
  contact_method: 'whatsapp' | 'phone' | 'email';
  status: 'draft' | 'sent' | 'quoted' | 'ordered' | 'delivered';
  notes: string | null;
  total_quoted: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create parts request
 */
export async function createPartsRequest(request: Omit<PartRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<PartRequest | null> {
  const pool = await getPostgresPool();
  if (!pool) return null;

  try {
    await initSupplierTables();

    const result = await pool.query(
      `INSERT INTO oracle_parts_requests (
        diagnosis_id, supplier_id, parts_requested, contact_method, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        request.diagnosisId || null,
        request.supplierId,
        JSON.stringify(request.partsRequested),
        request.contactMethod,
        request.status || 'draft',
        request.notes || null,
      ]
    );

    return mapPartRequestRow(result.rows[0] as unknown as PartRequestRow);
  } catch (error) {
    console.error('Failed to create parts request:', error);
    return null;
  }
}

/**
 * Update parts request status
 */
export async function updatePartsRequestStatus(
  id: number,
  status: PartRequest['status'],
  totalQuoted?: number
): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query(
      `UPDATE oracle_parts_requests
       SET status = $1, total_quoted = $2, updated_at = NOW()
       WHERE id = $3`,
      [status, totalQuoted || null, id]
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Get parts requests by diagnosis
 */
export async function getPartsRequestsByDiagnosis(diagnosisId: string): Promise<PartRequest[]> {
  const pool = await getPostgresPool();
  if (!pool) return [];

  try {
    const result = await pool.query(
      `SELECT pr.*, s.name as supplier_name
       FROM oracle_parts_requests pr
       LEFT JOIN oracle_suppliers s ON pr.supplier_id = s.id
       WHERE pr.diagnosis_id = $1
       ORDER BY pr.created_at DESC`,
      [diagnosisId]
    );

    return result.rows.map((row: unknown) => ({
      ...mapPartRequestRow(row as unknown as PartRequestRow),
      supplierName: (row as { supplier_name?: string }).supplier_name,
    }));
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// WHATSAPP INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate WhatsApp message for parts request
 */
export function generateWhatsAppMessage(parts: PartItem[], context?: {
  brand?: string;
  model?: string;
  faultCode?: string;
}): string {
  let message = `*PARTS INQUIRY*\n\n`;

  if (context?.brand || context?.model) {
    message += `Generator: ${context.brand || ''} ${context.model || ''}\n`;
  }
  if (context?.faultCode) {
    message += `Fault Code: ${context.faultCode}\n`;
  }

  message += `\n*Parts Needed:*\n`;

  parts.forEach((part, index) => {
    message += `${index + 1}. ${part.name}`;
    if (part.partNumber) message += ` (P/N: ${part.partNumber})`;
    message += ` - Qty: ${part.quantity}`;
    if (part.urgency === 'urgent') message += ` ⚡`;
    if (part.urgency === 'critical') message += ` 🔴`;
    message += `\n`;
  });

  message += `\nPlease provide availability and pricing. Thank you!`;

  return message;
}

/**
 * Generate WhatsApp URL
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  // Remove any non-numeric characters except +
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate phone call URL
 */
export function generatePhoneUrl(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
}

/**
 * Generate email URL
 */
export function generateEmailUrl(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function mapSupplierRow(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone || undefined,
    whatsapp: row.whatsapp || undefined,
    email: row.email || undefined,
    location: row.location || undefined,
    city: row.city || undefined,
    country: row.country || undefined,
    specialties: row.specialties || [],
    brandsCarried: row.brands_carried || [],
    isVerified: row.is_verified,
    rating: row.rating ? parseFloat(row.rating) : undefined,
    responseTime: row.response_time || undefined,
    createdAt: row.created_at?.toISOString(),
  };
}

function mapPartRequestRow(row: PartRequestRow): PartRequest {
  return {
    id: row.id,
    diagnosisId: row.diagnosis_id || undefined,
    supplierId: row.supplier_id,
    partsRequested: row.parts_requested,
    contactMethod: row.contact_method,
    status: row.status,
    notes: row.notes || undefined,
    totalQuoted: row.total_quoted ? parseFloat(row.total_quoted) : undefined,
    createdAt: row.created_at?.toISOString(),
    updatedAt: row.updated_at?.toISOString(),
  };
}

function getDefaultSuppliers(): Supplier[] {
  return [
    {
      id: 1,
      name: 'PowerGen Parts Kenya',
      phone: '+254 720 123 456',
      whatsapp: '+254720123456',
      email: 'sales@powergenparts.co.ke',
      location: 'Industrial Area, Nairobi',
      city: 'Nairobi',
      specialties: ['Cummins', 'Perkins', 'Filters', 'Belts'],
      brandsCarried: ['Cummins', 'Perkins', 'Caterpillar'],
      isVerified: true,
      rating: 4.5,
      responseTime: '< 2 hours',
    },
    {
      id: 2,
      name: 'Generator Spares East Africa',
      phone: '+254 733 456 789',
      whatsapp: '+254733456789',
      email: 'info@genspares.co.ke',
      location: 'Mombasa Road, Nairobi',
      city: 'Nairobi',
      specialties: ['Controllers', 'AVR', 'Starters', 'Alternators'],
      brandsCarried: ['DeepSea', 'ComAp', 'Stamford', 'Leroy Somer'],
      isVerified: true,
      rating: 4.8,
      responseTime: '< 1 hour',
    },
  ];
}
