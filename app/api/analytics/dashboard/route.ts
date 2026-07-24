/**
 * GET /api/analytics/dashboard
 * Returns dashboard metrics for admin panel
 */

import { analyticsService } from '@/lib/analytics/analyticsService';

export async function GET(request: Request) {
  try {
    // In production, fetch from database
    // const orders = await db.orders.findAll();

    // Mock data for demonstration
    const mockOrders: any[] = [];

    const dashboardData = analyticsService.getDashboardData(mockOrders);

    return Response.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startDate, endDate, groupBy = 'monthly' } = body;

    // Mock data
    const mockOrders: any[] = [];

    const report = analyticsService.generateReport(mockOrders, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      groupBy: groupBy as any,
      includeProjections: true
    });

    return Response.json({
      success: true,
      report,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
