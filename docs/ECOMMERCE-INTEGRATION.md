# E-Commerce Platform Integration Guide

Complete end-to-end implementation for parts marketplace, payments, orders, reviews, and analytics.

## Architecture Overview

```
Customer Flow:
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Browse Parts   │ --> │  Add to Cart │ --> │ Checkout    │
└─────────────────┘     └──────────────┘     └─────────────┘
                              |
                              v
                        ┌──────────────┐
                        │  Create Order│
                        └──────────────┘
                              |
                              v
                        ┌──────────────┐
                        │ M-Pesa Payment
                        └──────────────┘
                              |
                              v
                        ┌──────────────┐
                        │Track Status  │
                        └──────────────┘
                              |
                              v
                        ┌──────────────┐
                        │ Submit Review│
                        └──────────────┘
```

## 1. Parts Marketplace

### Browse & Search
**Route:** `app/marketplace/parts/page.tsx`

Features:
- Amazon-style grid/list view toggle
- Search by name, code, brand
- Filter by category, price range, stock
- Sort by price, rating, newest
- Shopping cart with quantity tracking
- Wishlist functionality
- Part details with margin % display

### Parts Database
**File:** `lib/parts/partsInventoryParser.ts`

```typescript
// Import from CSV (15,452 parts)
const parts = await parsePartsCSV('lib/parts/inventory-2026-07-22.csv');

// Search
const results = searchParts(query);

// Filter
const filtered = filterParts(parts, {
  category: 'Engines',
  priceRange: [5000, 50000],
  brand: 'Perkins',
  inStock: true
});
```

**Fields per Part:**
- Code (unique ID)
- Name
- Category/Subcategory
- Brand
- UOM (Unit of Measure)
- Quantity on hand
- Cost
- Price
- Margin % (calculated)

### Return Policy
**Route:** `app/marketplace/returns/page.tsx`

- 30-day return window
- 5-step return process
- Refund table (100% → 0% based on condition)
- Warranty vs returns clarification
- FAQ with moderation details

## 2. Order Management

### Create Order
**Endpoint:** `POST /api/orders/create`

```typescript
// Request
{
  customerId: string;
  customerPhone: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  shippingLocation: string;
  paymentMethod: 'mpesa' | 'bank-transfer' | 'cash-on-delivery';
}

// Response
{
  orderId: 'ORD-20260724-1234';
  subtotal: 45000;
  tax: 7200;  // 16% VAT
  shippingCost: 500;  // Location-based
  total: 52700;
}
```

**Shipping Costs:**
- Nairobi: KES 500
- Mombasa: KES 1,500
- Kisumu: KES 1,200
- Nakuru: KES 800
- Eldoret: KES 1,000
- Naivasha: KES 700
- Others: KES 2,000
- **Free:** Orders > KES 50,000

### Order Statuses
```
pending → confirmed → processing → shipped → delivered
                   ↓
             cancelled (anytime)
                   ↓
             returned (post-delivery)
```

### Fetch Order Details
**Endpoint:** `GET /api/orders/[orderId]`

Returns full order with:
- Items with pricing
- Payment status
- Shipping details (method, courier, tracking)
- Estimated delivery date
- Timestamps (created, paid, shipped, delivered)

### Order Tracking UI
**Component:** `components/orders/OrderTracker.tsx`

- Real-time status visualization
- Timeline with icons and timestamps
- Shipping details card
- Order items summary
- Auto-refresh (every 30s)
- Manual refresh button

### Customer Order History
**Route:** `app/marketplace/orders/page.tsx`

- Lists all customer orders
- Sort by newest first
- Click to view full tracking
- Payment status indicator
- Order status badge

## 3. M-Pesa Payment Integration

### Configuration
**Environment Variables:**
```
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yoursite.com/api/payments/callback
MPESA_SHORTCODE=174379  // Sandbox
```

### Initiate Payment
**Endpoint:** `POST /api/payments/initiate`

```typescript
{
  orderId: string;
  amount: number;  // KES 1-150,000
  phoneNumber: string;  // 0XXXXXXXXX → 254XXXXXXXXX
  customerEmail: string;
}

// Returns
{
  checkoutRequestId: string;
  responseCode: '0';  // Success
  message: 'Success. Request accepted for processing';
}
```

### Callback Handler
**Endpoint:** `POST /api/payments/callback`

M-Pesa sends transaction result. Handler:
1. Verifies callback signature
2. Parses payment result
3. Updates order status
4. Triggers inventory update
5. Sends confirmation SMS

**Result Codes:**
- `0`: Payment successful
- Other: Payment failed (see M-Pesa docs)

### Service Class
**File:** `lib/payments/mpesaService.ts`

Key methods:
- `getAccessToken()`: OAuth token retrieval
- `initiateSTKPush(payment)`: Trigger payment prompt
- `queryTransaction(checkoutRequestId)`: Poll status
- `processCallback(body)`: Handle webhook
- `isPaymentSuccessful(resultCode)`: Verify success

## 4. Customer Reviews

### Submit Review
**Route:** `components/reviews/ReviewForm.tsx`

Requirements:
- Rating: 1-5 stars
- Title: 5-100 characters
- Body: 10-2000 characters
- Images: Up to 3, optional
- Verified purchase (orderId)

**Endpoint:** `POST /api/reviews/create`

Reviews enter **pending** status → await moderation.

### Review Moderation
**Dashboard:** `app/dashboard/reviews/page.tsx`

Admin workflow:
1. View pending reviews
2. Spam detection (excessive punctuation, keywords, all caps)
3. Approve → status = **approved** (live on product)
4. Reject with reason → status = **rejected**

### Moderation Endpoints

**Fetch Pending:**
```
GET /api/reviews/moderation/pending
```

**Approve:**
```
POST /api/reviews/moderation/approve
{ reviewId: string }
```

**Reject:**
```
POST /api/reviews/moderation/reject
{ reviewId: string; reason: string }
```

### Part Ratings Aggregation

Approved reviews only:
- Average rating (1-5, 1 decimal)
- Rating distribution (5★, 4★, 3★, 2★, 1★ counts)
- Most helpful reviews (by helpfulness votes)
- Top keywords extracted

**Endpoint:**
```
GET /api/parts/[partCode]/rating
```

## 5. Analytics Dashboard

### Admin Dashboard
**Route:** `app/dashboard/analytics/page.tsx`

**Top KPIs:**
- Total Revenue (KES)
- Orders count
- Customers count
- Average Rating (★)

**Performance Metrics:**

*Sales Section:*
- Conversion Rate (%)
- Payment Success Rate (%)
- On-Time Delivery Rate (%)
- Customer Retention Rate (%)

*Fulfillment Section:*
- Average Delivery Time (days)
- Average Refund Time (days)
- Completed Orders count
- Return Rate (%)

**Top Performers:**
- Top 5 selling parts (by revenue)
- Units sold per part
- Revenue per part

**Geographic Analysis:**
- Orders by location (all 47 Kenya counties)
- Revenue by location

**Alerts:**
- Low payment success rate (< 80%)
- Poor on-time delivery (< 90%)
- High return rate (> 5%)

### Analytics Engine
**File:** `lib/analytics/analyticsService.ts`

**Metrics Tracked (50+):**

Revenue:
- totalRevenue
- revenueByPeriod (daily/weekly/monthly)
- averageOrderValue
- revenueTrend (% change)

Sales:
- totalOrders
- ordersCompleted
- ordersPerDay
- conversionRate

Inventory:
- topSellingParts
- lowStockItems
- turnoverRate

Customer:
- totalCustomers
- returningCustomers
- newCustomers
- customerRetentionRate

Payments:
- successfulPayments
- failedPayments
- paymentSuccessRate
- averagePaymentTime (minutes)

Fulfillment:
- averageDeliveryTime (days)
- onTimeDeliveryRate (%)
- returnRate (%)
- averageRefundTime (days)

### Analytics API
**Endpoint:** `GET /api/analytics/dashboard`

Optional query params:
```
?startDate=2026-07-01
&endDate=2026-07-31
&groupBy=daily|weekly|monthly
```

Returns complete DashboardMetrics object.

## 6. Database Abstraction

### In-Memory MVP (Current)

**Orders:** `lib/db/orders.ts`
- InMemoryOrderDb class
- Map<string, Order> storage
- Customer orders index for fast lookups
- All CRUD methods implemented

**Reviews:** `lib/db/reviews.ts`
- InMemoryReviewDb class
- Separate indices for part reviews
- Pending reviews queue for moderation workflow
- All CRUD methods + approval/rejection

### PostgreSQL Migration Path

Documented in both files with example code:

```typescript
// PostgreSQL replacement
class PostgresOrderDb implements OrderRepository {
  async create(order: Order): Promise<Order> {
    const result = await pool.query(
      'INSERT INTO orders (...) VALUES (...) RETURNING *',
      [...]
    );
    return result.rows[0];
  }
  // ... other methods
}
```

**Next Steps:**
1. Install `pg` package
2. Create tables (orders, reviews, order_items)
3. Implement PostgresOrderDb and PostgresReviewDb
4. Swap in `app/api/` endpoints (no code changes needed)

## 7. Customer Workflows

### Purchase Flow
1. Browse parts at `/marketplace/parts`
2. Search, filter, sort
3. Add to cart
4. Proceed to checkout
5. Enter shipping location
6. Select M-Pesa payment
7. Complete STK Push
8. Order created (pending)
9. Auto-transitions to confirmed once payment cleared
10. Tracking available at `/marketplace/orders`

### Review Flow (Post-Delivery)
1. View delivered order in `/marketplace/orders`
2. Click "Write Review"
3. Submit ReviewForm with:
   - Rating (1-5)
   - Title + body
   - Optional photos
4. Review enters pending moderation
5. Admin approves/rejects in `/dashboard/reviews`
6. If approved: appears on product page

### Admin Workflows

**Monitor Operations:**
- Visit `/dashboard/analytics` for real-time KPIs
- Check alerts for failing payment/delivery rates
- Review top sellers and geographic performance

**Moderate Content:**
- Visit `/dashboard/reviews` for pending reviews
- Spam detection helps identify suspicious reviews
- Approve legitimate → live on product
- Reject with reason

## 8. Environment Setup

### Required Environment Variables

```bash
# M-Pesa
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/callback

# Database (future PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

# Email (order confirmations, review notifications)
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

# Optional: Analytics tracking
ANALYTICS_TOKEN=
```

### Deployment (Vercel)

1. Set all env vars in Vercel project settings
2. Push to main branch
3. Vercel auto-deploys (~4 min)
4. M-Pesa callback must be HTTPS (auto-provided by Vercel)

## 9. Testing Checklist

- [ ] Create test order via `/api/orders/create`
- [ ] Initiate M-Pesa payment (use sandbox credentials)
- [ ] Verify callback received and order status updated
- [ ] Test order tracking at `/marketplace/orders/[orderId]`
- [ ] Submit review → verify pending status
- [ ] Approve review in moderation dashboard
- [ ] Verify approved review appears on product
- [ ] Check analytics dashboard shows all metrics
- [ ] Test alerts triggering (simulate low payment rate)

## 10. Known Limitations & TODOs

### Current In-Memory
- Orders/reviews lost on app restart
- No audit trail
- No data backups
- Single-server only

### Migration Required
- [ ] PostgreSQL database setup
- [ ] Order/review table schema
- [ ] Migration from in-memory to persistent
- [ ] Automated backups

### Future Enhancements
- [ ] Courier API integration (e.g., Jiji, Truckpark)
- [ ] SMS notifications for order status updates
- [ ] Email invoices (PDF generation)
- [ ] Automated refund processing
- [ ] Inventory sync with ERP
- [ ] Customer loyalty/rewards program
- [ ] Admin bulk operations (export orders, bulk status update)
- [ ] Multi-currency support (beyond KES)

## 11. Troubleshooting

**Orders not created:**
- Check M-Pesa environment variables
- Verify /api/payments/callback is reachable from Vercel
- Check server logs for validation errors

**Reviews not appearing:**
- Verify admin dashboard at /dashboard/reviews
- Check review status is "approved" (not "pending")
- Clear browser cache

**Analytics blank:**
- Ensure orders exist in database
- Check /api/analytics/dashboard endpoint directly
- Verify no TypeScript errors

**Payment failures:**
- Test with M-Pesa sandbox first
- Verify phone number format (254XXXXXXXXX)
- Check amount within 1-150,000 KES range
- Review M-Pesa callback logs
