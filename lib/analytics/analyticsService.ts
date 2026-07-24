/**
 * E-Commerce Analytics Dashboard
 * Real-time KPI tracking and business intelligence
 */

import type { Order } from './orderService';

export interface DashboardMetrics {
  // Revenue
  totalRevenue: number;
  revenueByPeriod: { date: string; amount: number }[];
  averageOrderValue: number;
  revenueTrend: number; // % change vs last period

  // Sales Volume
  totalOrders: number;
  ordersCompleted: number;
  ordersPerDay: number;
  conversionRate: number; // Cart to purchase

  // Inventory
  topSellingParts: Array<{ partCode: string; partName: string; unitsSold: number; revenue: number }>;
  lowStockItems: Array<{ partCode: string; partName: string; currentQty: number; reorderLevel: number }>;
  turnoverRate: number; // Units sold / avg inventory

  // Customer
  totalCustomers: number;
  returningCustomers: number;
  newCustomers: number;
  customerRetentionRate: number;
  averageRating: number;

  // Payments
  successfulPayments: number;
  failedPayments: number;
  paymentSuccessRate: number;
  averagePaymentTime: number; // Minutes from order to payment

  // Fulfillment
  averageDeliveryTime: number; // Days
  onTimeDeliveryRate: number;
  returnRate: number;
  averageRefundTime: number; // Days

  // Geographic
  ordersByLocation: { [location: string]: number };
  revenueByLocation: { [location: string]: number };

  // Reviews
  averageProductRating: number;
  totalReviews: number;
  reviewsThisPeriod: number;
}

export interface ReportConfig {
  startDate: Date;
  endDate: Date;
  groupBy: 'daily' | 'weekly' | 'monthly';
  includeProjections: boolean;
}

class AnalyticsService {
  /**
   * Calculate dashboard metrics
   */
  calculateMetrics(orders: Order[], timeframe: 'today' | 'week' | 'month' | 'year' = 'month'): DashboardMetrics {
    const now = new Date();
    const startDate = this.getStartDate(timeframe);
    const filtered = orders.filter(o => new Date(o.createdAt) >= startDate);

    // Revenue calculations
    const totalRevenue = filtered
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = filtered.length;
    const completedOrders = filtered.filter(o => o.status === 'delivered').length;

    // Customer metrics
    const uniqueCustomers = new Set(filtered.map(o => o.customerId)).size;
    const returningCustomers = this.countReturningCustomers(filtered);
    const averageRating = this.calculateAverageRating(filtered);

    // Payment metrics
    const successfulPayments = filtered.filter(o => o.paymentStatus === 'paid').length;
    const failedPayments = filtered.filter(o => o.paymentStatus === 'failed').length;

    return {
      // Revenue
      totalRevenue,
      revenueByPeriod: this.groupRevenueByPeriod(filtered, timeframe),
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
      revenueTrend: this.calculateTrend(filtered, 'revenue', timeframe),

      // Sales
      totalOrders,
      ordersCompleted: completedOrders,
      ordersPerDay: Math.round(totalOrders / this.getDayCount(timeframe)),
      conversionRate: this.calculateConversionRate(filtered),

      // Inventory
      topSellingParts: this.getTopSellingParts(filtered),
      lowStockItems: this.getLowStockItems(filtered),
      turnoverRate: this.calculateTurnoverRate(filtered),

      // Customer
      totalCustomers: uniqueCustomers,
      returningCustomers,
      newCustomers: uniqueCustomers - returningCustomers,
      customerRetentionRate: uniqueCustomers > 0 ? Math.round((returningCustomers / uniqueCustomers) * 100) : 0,
      averageRating,

      // Payments
      successfulPayments,
      failedPayments,
      paymentSuccessRate: totalOrders > 0 ? Math.round((successfulPayments / totalOrders) * 100) : 0,
      averagePaymentTime: this.calculateAveragePaymentTime(filtered),

      // Fulfillment
      averageDeliveryTime: this.calculateAverageDeliveryTime(filtered),
      onTimeDeliveryRate: this.calculateOnTimeDeliveryRate(filtered),
      returnRate: totalOrders > 0 ? Math.round((filtered.filter(o => o.status === 'returned').length / totalOrders) * 100) : 0,
      averageRefundTime: this.calculateAverageRefundTime(filtered),

      // Geographic
      ordersByLocation: this.groupOrdersByLocation(filtered),
      revenueByLocation: this.groupRevenueByLocation(filtered),

      // Reviews
      averageProductRating: averageRating,
      totalReviews: this.countTotalReviews(filtered),
      reviewsThisPeriod: this.countReviewsThisPeriod(filtered)
    };
  }

  /**
   * Generate performance report
   */
  generateReport(orders: Order[], config: ReportConfig): object {
    const filtered = orders.filter(o => {
      const date = new Date(o.createdAt);
      return date >= config.startDate && date <= config.endDate;
    });

    const metrics = this.calculateMetrics(filtered);

    return {
      reportPeriod: {
        startDate: config.startDate,
        endDate: config.endDate,
        days: this.daysBetween(config.startDate, config.endDate)
      },
      metrics,
      topPerformers: {
        parts: this.getTopSellingParts(filtered, 10),
        customers: this.getTopCustomers(filtered, 5),
        locations: this.getTopLocations(filtered, 5)
      },
      alerts: this.generateAlerts(metrics),
      recommendations: this.generateRecommendations(metrics)
    };
  }

  /**
   * Get dashboard data for admin panel
   */
  getDashboardData(orders: Order[]) {
    const thisMonth = this.calculateMetrics(orders, 'month');
    const lastMonth = this.calculateMetrics(orders, 'month'); // Would filter differently in real app

    return {
      summary: {
        revenue: thisMonth.totalRevenue,
        orders: thisMonth.totalOrders,
        customers: thisMonth.totalCustomers,
        rating: thisMonth.averageRating
      },
      trends: {
        revenueChange: thisMonth.revenueTrend,
        orderGrowth: this.calculateTrend(orders, 'orders', 'month'),
        customerGrowth: this.calculateTrend(orders, 'customers', 'month')
      },
      topParts: thisMonth.topSellingParts.slice(0, 10),
      recentOrders: orders.slice(0, 20),
      alerts: this.generateAlerts(thisMonth)
    };
  }

  // Helper methods

  private getStartDate(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }

  private getDayCount(timeframe: string): number {
    switch (timeframe) {
      case 'today': return 1;
      case 'week': return 7;
      case 'month': return 30;
      case 'year': return 365;
      default: return 30;
    }
  }

  private daysBetween(date1: Date, date2: Date): number {
    return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
  }

  private groupRevenueByPeriod(orders: Order[], timeframe: string) {
    const grouped: { [key: string]: number } = {};
    orders.forEach(order => {
      if (order.paymentStatus !== 'paid') return;
      const date = new Date(order.createdAt);
      let key = '';
      if (timeframe === 'daily') key = date.toISOString().split('T')[0];
      else if (timeframe === 'weekly') key = `Week ${Math.ceil(date.getDate() / 7)}`;
      else key = date.toLocaleString('default', { month: 'short' });
      grouped[key] = (grouped[key] || 0) + order.total;
    });
    return Object.entries(grouped).map(([date, amount]) => ({ date, amount }));
  }

  private calculateTrend(orders: Order[], metric: string, timeframe: string): number {
    // Placeholder: In real app, compare current period vs previous period
    return Math.random() * 20 - 10; // -10% to +10%
  }

  private calculateConversionRate(orders: Order[]): number {
    if (orders.length === 0) return 0;
    const paid = orders.filter(o => o.paymentStatus === 'paid').length;
    return Math.round((paid / orders.length) * 100);
  }

  private getTopSellingParts(orders: Order[], limit = 5) {
    const parts: { [code: string]: { name: string; units: number; revenue: number } } = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!parts[item.partCode]) {
          parts[item.partCode] = { name: item.partName, units: 0, revenue: 0 };
        }
        parts[item.partCode].units += item.quantity;
        parts[item.partCode].revenue += item.subtotal;
      });
    });
    return Object.entries(parts)
      .map(([code, data]) => ({ partCode: code, partName: data.name, unitsSold: data.units, revenue: data.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }

  private getLowStockItems(orders: Order[]) {
    // This would query inventory system in real app
    return [];
  }

  private calculateTurnoverRate(orders: Order[]): number {
    // Placeholder
    return 0;
  }

  private countReturningCustomers(orders: Order[]): number {
    const customerOrders: { [id: string]: number } = {};
    orders.forEach(o => {
      customerOrders[o.customerId] = (customerOrders[o.customerId] || 0) + 1;
    });
    return Object.values(customerOrders).filter(count => count > 1).length;
  }

  private calculateAverageRating(orders: Order[]): number {
    // Would query reviews system
    return 4.5;
  }

  private calculateAveragePaymentTime(orders: Order[]): number {
    // Placeholder
    return 5; // minutes
  }

  private calculateAverageDeliveryTime(orders: Order[]): number {
    const delivered = orders.filter(o => o.deliveredAt && o.createdAt);
    if (delivered.length === 0) return 0;
    const totalTime = delivered.reduce((sum, o) => {
      return sum + (new Date(o.deliveredAt!).getTime() - new Date(o.createdAt).getTime());
    }, 0);
    return Math.ceil(totalTime / delivered.length / (1000 * 60 * 60 * 24));
  }

  private calculateOnTimeDeliveryRate(orders: Order[]): number {
    const delivered = orders.filter(o => o.status === 'delivered' && o.shipping?.estimatedDelivery);
    if (delivered.length === 0) return 0;
    const onTime = delivered.filter(o => new Date(o.deliveredAt!) <= new Date(o.shipping!.estimatedDelivery!)).length;
    return Math.round((onTime / delivered.length) * 100);
  }

  private calculateAverageRefundTime(orders: Order[]): number {
    const refunded = orders.filter(o => o.refundedAt);
    if (refunded.length === 0) return 0;
    const totalTime = refunded.reduce((sum, o) => {
      return sum + (new Date(o.refundedAt!).getTime() - new Date(o.createdAt).getTime());
    }, 0);
    return Math.ceil(totalTime / refunded.length / (1000 * 60 * 60 * 24));
  }

  private groupOrdersByLocation(orders: Order[]): { [location: string]: number } {
    const locations: { [key: string]: number } = {};
    orders.forEach(o => {
      const loc = o.shipping?.location || 'Unknown';
      locations[loc] = (locations[loc] || 0) + 1;
    });
    return locations;
  }

  private groupRevenueByLocation(orders: Order[]): { [location: string]: number } {
    const revenue: { [key: string]: number } = {};
    orders
      .filter(o => o.paymentStatus === 'paid')
      .forEach(o => {
        const loc = o.shipping?.location || 'Unknown';
        revenue[loc] = (revenue[loc] || 0) + o.total;
      });
    return revenue;
  }

  private countTotalReviews(orders: Order[]): number {
    // Would query reviews system
    return 0;
  }

  private countReviewsThisPeriod(orders: Order[]): number {
    // Would query reviews system
    return 0;
  }

  private getTopCustomers(orders: Order[], limit = 5) {
    const customers: { [id: string]: { name: string; orderCount: number; totalSpent: number } } = {};
    orders.forEach(o => {
      if (!customers[o.customerId]) {
        customers[o.customerId] = { name: o.customerName, orderCount: 0, totalSpent: 0 };
      }
      customers[o.customerId].orderCount++;
      customers[o.customerId].totalSpent += o.total;
    });
    return Object.values(customers)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }

  private getTopLocations(orders: Order[], limit = 5) {
    return Object.entries(this.groupOrdersByLocation(orders))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([location, count]) => ({ location, orders: count }));
  }

  private generateAlerts(metrics: DashboardMetrics): string[] {
    const alerts: string[] = [];
    if (metrics.paymentSuccessRate < 80) alerts.push('Payment success rate below 80%');
    if (metrics.onTimeDeliveryRate < 90) alerts.push('On-time delivery rate below 90%');
    if (metrics.returnRate > 5) alerts.push('Return rate exceeds 5%');
    if (metrics.lowStockItems.length > 10) alerts.push('Multiple items running low on stock');
    return alerts;
  }

  private generateRecommendations(metrics: DashboardMetrics): string[] {
    const recommendations: string[] = [];
    if (metrics.topSellingParts.length > 0) {
      recommendations.push(`Stock up on ${metrics.topSellingParts[0].partName} - your best seller`);
    }
    if (metrics.averageOrderValue < 5000) {
      recommendations.push('Consider bundle deals to increase AOV');
    }
    if (metrics.customerRetentionRate < 30) {
      recommendations.push('Launch loyalty program to improve retention');
    }
    return recommendations;
  }
}

export const analyticsService = new AnalyticsService();
