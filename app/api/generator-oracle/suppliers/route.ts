/**
 * GENERATOR ORACLE SUPPLIERS API
 * Supplier database and parts ordering
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllSuppliers,
  searchSuppliers,
  getSuppliersByCity,
  getSupplierById,
  createPartsRequest,
  updatePartsRequestStatus,
  getPartsRequestsByDiagnosis,
  generateWhatsAppMessage,
  generateWhatsAppUrl,
  type PartItem,
} from '@/lib/generator-oracle/supplierService';

// ═══════════════════════════════════════════════════════════════════════════════
// GET - List suppliers or search
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const city = searchParams.get('city');
    const id = searchParams.get('id');

    // Get single supplier
    if (id) {
      const supplier = await getSupplierById(parseInt(id));
      if (!supplier) {
        return NextResponse.json(
          { success: false, error: 'Supplier not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, supplier });
    }

    // Search suppliers
    if (query) {
      const suppliers = await searchSuppliers(query);
      return NextResponse.json({
        success: true,
        suppliers,
        count: suppliers.length,
        query,
      });
    }

    // Filter by city
    if (city) {
      const suppliers = await getSuppliersByCity(city);
      return NextResponse.json({
        success: true,
        suppliers,
        count: suppliers.length,
        city,
      });
    }

    // Get all suppliers
    const suppliers = await getAllSuppliers();
    return NextResponse.json({
      success: true,
      suppliers,
      count: suppliers.length,
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get suppliers' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Create parts request or generate WhatsApp link
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Generate WhatsApp link
    if (action === 'whatsapp') {
      const { supplierId, parts, context } = body as {
        supplierId: number;
        parts: PartItem[];
        context?: { brand?: string; model?: string; faultCode?: string };
      };

      const supplier = await getSupplierById(supplierId);
      if (!supplier || !supplier.whatsapp) {
        return NextResponse.json(
          { success: false, error: 'Supplier not found or no WhatsApp' },
          { status: 400 }
        );
      }

      const message = generateWhatsAppMessage(parts, context);
      const url = generateWhatsAppUrl(supplier.whatsapp, message);

      return NextResponse.json({
        success: true,
        url,
        message,
        supplier: supplier.name,
      });
    }

    // Create parts request
    if (action === 'request') {
      const { supplierId, diagnosisId, parts, contactMethod, notes } = body;

      if (!supplierId || !parts || !contactMethod) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const partRequest = await createPartsRequest({
        supplierId,
        diagnosisId,
        partsRequested: parts,
        contactMethod,
        status: 'sent',
        notes,
      });

      if (!partRequest) {
        return NextResponse.json(
          { success: false, error: 'Failed to create request' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        request: partRequest,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Supplier action error:', error);
    return NextResponse.json(
      { success: false, error: 'Request failed' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATCH - Update parts request status
// ═══════════════════════════════════════════════════════════════════════════════

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, status, totalQuoted } = body;

    if (!requestId || !status) {
      return NextResponse.json(
        { success: false, error: 'Request ID and status required' },
        { status: 400 }
      );
    }

    const validStatuses = ['draft', 'sent', 'quoted', 'ordered', 'delivered'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const success = await updatePartsRequestStatus(requestId, status, totalQuoted);

    return NextResponse.json({
      success,
      message: success ? 'Status updated' : 'Update failed',
    });
  } catch (error) {
    console.error('Update request error:', error);
    return NextResponse.json(
      { success: false, error: 'Update failed' },
      { status: 500 }
    );
  }
}
