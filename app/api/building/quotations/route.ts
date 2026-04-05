/**
 * Quotations API
 * Generate and manage building project quotations
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory storage fallback
const quotationsStore = new Map<string, any>();

function generateQuotationNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QT-${year}${month}${day}-${random}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const projectId = searchParams.get('projectId');

  try {
    // Try database first
    try {
      const { prisma } = await import('@/lib/prisma/client');

      if (id) {
        const quotation = await prisma.quotation.findUnique({
          where: { id },
          include: {
            project: true,
            user: { select: { name: true, email: true, company: true } },
          },
        });

        if (!quotation) {
          return NextResponse.json(
            { success: false, error: 'Quotation not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, data: quotation });
      }

      const quotations = await prisma.quotation.findMany({
        where: projectId ? { projectId } : {},
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          project: { select: { name: true, projectNumber: true } },
          user: { select: { name: true, email: true } },
        },
      });

      return NextResponse.json({
        success: true,
        data: { quotations, total: quotations.length },
      });

    } catch (dbError) {
      // Fallback to in-memory
      if (id) {
        const quotation = quotationsStore.get(id);
        if (!quotation) {
          return NextResponse.json(
            { success: false, error: 'Quotation not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: quotation });
      }

      let quotations = Array.from(quotationsStore.values());
      if (projectId) {
        quotations = quotations.filter(q => q.projectId === projectId);
      }

      return NextResponse.json({
        success: true,
        data: { quotations, total: quotations.length },
        notice: 'Using in-memory storage.',
      });
    }

  } catch (error) {
    console.error('[Quotations API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      userId,
      items,
      subtotal,
      vat,
      discount,
      total,
      currency,
      terms,
      validity,
      clientInfo,
    } = body;

    // Validate required fields
    if (!projectId || !items || !total) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: projectId, items, total' },
        { status: 400 }
      );
    }

    const quotationNumber = generateQuotationNumber();
    const vatAmount = vat || (subtotal || total) * 0.16; // Default 16% VAT
    const calculatedTotal = (subtotal || total) + vatAmount - (discount || 0);

    // Try database first
    try {
      const { prisma } = await import('@/lib/prisma/client');

      const quotation = await prisma.quotation.create({
        data: {
          quotationNumber,
          projectId,
          userId: userId || 'guest',
          items,
          subtotal: subtotal || total,
          vat: vatAmount,
          discount: discount || 0,
          total: calculatedTotal,
          currency: currency || 'KES',
          terms,
          validity: validity || 30,
          status: 'DRAFT',
        },
        include: {
          project: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: quotation,
      }, { status: 201 });

    } catch (dbError) {
      // Fallback to in-memory
      const quotation = {
        id: `mem_${Date.now()}`,
        quotationNumber,
        projectId,
        userId: userId || 'guest',
        items,
        subtotal: subtotal || total,
        vat: vatAmount,
        discount: discount || 0,
        total: calculatedTotal,
        currency: currency || 'KES',
        terms,
        validity: validity || 30,
        status: 'DRAFT',
        clientInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      quotationsStore.set(quotation.id, quotation);

      return NextResponse.json({
        success: true,
        data: quotation,
        notice: 'Using in-memory storage.',
      }, { status: 201 });
    }

  } catch (error) {
    console.error('[Quotations API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create quotation' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Quotation ID required' },
        { status: 400 }
      );
    }

    // Try database first
    try {
      const { prisma } = await import('@/lib/prisma/client');

      const updateData: any = { ...updates, updatedAt: new Date() };

      // Handle status changes
      if (status) {
        updateData.status = status;
        if (status === 'SENT') updateData.sentAt = new Date();
        if (status === 'ACCEPTED') updateData.acceptedAt = new Date();
        if (status === 'REJECTED') updateData.rejectedAt = new Date();
      }

      const quotation = await prisma.quotation.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({ success: true, data: quotation });

    } catch (dbError) {
      // Fallback to in-memory
      const existing = quotationsStore.get(id);
      if (!existing) {
        return NextResponse.json(
          { success: false, error: 'Quotation not found' },
          { status: 404 }
        );
      }

      const updated = {
        ...existing,
        ...updates,
        status: status || existing.status,
        updatedAt: new Date().toISOString(),
      };

      if (status === 'SENT') updated.sentAt = new Date().toISOString();
      if (status === 'ACCEPTED') updated.acceptedAt = new Date().toISOString();
      if (status === 'REJECTED') updated.rejectedAt = new Date().toISOString();

      quotationsStore.set(id, updated);

      return NextResponse.json({
        success: true,
        data: updated,
        notice: 'Using in-memory storage.',
      });
    }

  } catch (error) {
    console.error('[Quotations API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update quotation' },
      { status: 500 }
    );
  }
}

// Generate PDF-ready quotation data
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (action === 'generate-pdf') {
      // Fetch quotation data
      let quotation: any;

      try {
        const { prisma } = await import('@/lib/prisma/client');
        quotation = await prisma.quotation.findUnique({
          where: { id },
          include: {
            project: true,
            user: true,
          },
        });
      } catch {
        quotation = quotationsStore.get(id);
      }

      if (!quotation) {
        return NextResponse.json(
          { success: false, error: 'Quotation not found' },
          { status: 404 }
        );
      }

      // Return formatted data for PDF generation
      const pdfData = {
        quotationNumber: quotation.quotationNumber,
        date: new Date(quotation.createdAt).toLocaleDateString('en-GB'),
        validUntil: new Date(
          new Date(quotation.createdAt).getTime() + quotation.validity * 24 * 60 * 60 * 1000
        ).toLocaleDateString('en-GB'),
        client: {
          name: quotation.user?.name || 'Client',
          email: quotation.user?.email || '',
          company: quotation.user?.company || '',
        },
        project: {
          name: quotation.project?.name || 'Building Project',
          number: quotation.project?.projectNumber || '',
          location: quotation.project?.address || '',
        },
        items: quotation.items,
        subtotal: quotation.subtotal,
        vat: quotation.vat,
        discount: quotation.discount,
        total: quotation.total,
        currency: quotation.currency,
        terms: quotation.terms || 'Standard terms and conditions apply.',
        company: {
          name: 'EmersonEIMS',
          address: 'Nairobi, Kenya',
          phone: '+254 700 000 000',
          email: 'info@emersoneims.co.ke',
          website: 'www.emersoneims.co.ke',
        },
      };

      return NextResponse.json({
        success: true,
        data: pdfData,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('[Quotations API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Action failed' },
      { status: 500 }
    );
  }
}
