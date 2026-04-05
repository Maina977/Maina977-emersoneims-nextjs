/**
 * Building Projects API
 * CRUD operations for building projects
 *
 * Note: Requires database connection
 * Falls back to in-memory storage if database unavailable
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory storage fallback (for when database is not configured)
const projectsStore = new Map<string, any>();

function generateProjectNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PBS-${year}-${random}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('id');
  const userId = searchParams.get('userId');

  try {
    // Try database first
    try {
      const { prisma } = await import('@/lib/prisma/client');

      if (projectId) {
        const project = await prisma.buildingProject.findUnique({
          where: { id: projectId },
          include: {
            user: { select: { name: true, email: true } },
            quotations: true,
            documents: true,
          },
        });

        if (!project) {
          return NextResponse.json(
            { success: false, error: 'Project not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, data: project });
      }

      const projects = await prisma.buildingProject.findMany({
        where: userId ? { userId } : {},
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          user: { select: { name: true, email: true } },
        },
      });

      return NextResponse.json({
        success: true,
        data: { projects, total: projects.length },
      });

    } catch (dbError) {
      console.log('[Projects API] Database not available, using memory store');

      // Fallback to in-memory
      if (projectId) {
        const project = projectsStore.get(projectId);
        if (!project) {
          return NextResponse.json(
            { success: false, error: 'Project not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: project });
      }

      const projects = Array.from(projectsStore.values());
      return NextResponse.json({
        success: true,
        data: { projects, total: projects.length },
        notice: 'Using in-memory storage. Connect database for persistence.',
      });
    }

  } catch (error) {
    console.error('[Projects API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      latitude,
      longitude,
      buildingType,
      floors,
      totalArea,
      plotSize,
      width,
      depth,
      height,
      roofType,
      finishLevel,
      userId,
      siteAnalysis,
      structuralDesign,
      boqData,
      amenities,
      landscaping,
      utilities,
    } = body;

    // Validate required fields
    if (!name || !latitude || !longitude || !buildingType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, latitude, longitude, buildingType' },
        { status: 400 }
      );
    }

    const projectNumber = generateProjectNumber();

    // Try database first
    try {
      const { prisma } = await import('@/lib/prisma/client');

      const project = await prisma.buildingProject.create({
        data: {
          projectNumber,
          name,
          latitude,
          longitude,
          buildingType,
          floors: floors || 1,
          totalArea: totalArea || 0,
          plotSize,
          width,
          depth,
          height,
          roofType,
          finishLevel: finishLevel || 'standard',
          userId: userId || 'guest',
          siteAnalysis,
          structuralDesign,
          boqData,
          amenities,
          landscaping,
          utilities,
          status: 'DRAFT',
        },
      });

      return NextResponse.json({
        success: true,
        data: project,
      }, { status: 201 });

    } catch (dbError) {
      console.log('[Projects API] Database not available, using memory store');

      // Fallback to in-memory
      const project = {
        id: `mem_${Date.now()}`,
        projectNumber,
        name,
        latitude,
        longitude,
        buildingType,
        floors: floors || 1,
        totalArea: totalArea || 0,
        plotSize,
        width,
        depth,
        height,
        roofType,
        finishLevel: finishLevel || 'standard',
        userId: userId || 'guest',
        siteAnalysis,
        structuralDesign,
        boqData,
        amenities,
        landscaping,
        utilities,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      projectsStore.set(project.id, project);

      return NextResponse.json({
        success: true,
        data: project,
        notice: 'Using in-memory storage. Connect database for persistence.',
      }, { status: 201 });
    }

  } catch (error) {
    console.error('[Projects API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Project ID required' },
        { status: 400 }
      );
    }

    // Try database first
    try {
      const { prisma } = await import('@/lib/prisma/client');

      const project = await prisma.buildingProject.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, data: project });

    } catch (dbError) {
      // Fallback to in-memory
      const existing = projectsStore.get(id);
      if (!existing) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        );
      }

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      projectsStore.set(id, updated);

      return NextResponse.json({
        success: true,
        data: updated,
        notice: 'Using in-memory storage.',
      });
    }

  } catch (error) {
    console.error('[Projects API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Project ID required' },
      { status: 400 }
    );
  }

  try {
    // Try database first
    try {
      const { prisma } = await import('@/lib/prisma/client');

      await prisma.buildingProject.delete({
        where: { id },
      });

      return NextResponse.json({ success: true, message: 'Project deleted' });

    } catch (dbError) {
      // Fallback to in-memory
      if (!projectsStore.has(id)) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        );
      }

      projectsStore.delete(id);

      return NextResponse.json({
        success: true,
        message: 'Project deleted',
        notice: 'Using in-memory storage.',
      });
    }

  } catch (error) {
    console.error('[Projects API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete project' },
      { status: 500 }
    );
  }
}
