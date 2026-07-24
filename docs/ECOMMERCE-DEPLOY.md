# E-Commerce Platform Deployment Guide

## Quick Start (Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Components Exist
All UI components are built:
- `components/marketplace/PartsGrid.tsx` - Product listing
- `components/marketplace/Cart.tsx` - Shopping cart
- `components/forms/QuickInquiryForm.tsx` - Lead capture
- `components/orders/OrderTracker.tsx` - Order status
- `components/reviews/ReviewForm.tsx` - Review submission

All API endpoints are built:
- `app/api/orders/create` - Create order
- `app/api/payments/initiate` - M-Pesa STK Push
- `app/api/payments/callback` - M-Pesa webhook
- `app/api/reviews/create` - Submit review
- `app/api/reviews/moderation/*` - Review approval workflow
- `app/api/analytics/dashboard` - Metrics
- `app/api/customers/[customerId]/orders` - Order history

All pages are built:
- `/marketplace/parts` - Browse parts
- `/marketplace/orders` - Order history & tracking
- `/marketplace/returns` - Return policy
- `/dashboard/analytics` - Analytics dashboard
- `/dashboard/reviews` - Review moderation

### 3. Run Dev Server
```bash
npm run dev
```

Navigate to:
- `http://localhost:3000/marketplace/parts` - Browse parts
- `http://localhost:3000/dashboard/analytics` - Analytics
- `http://localhost:3000/dashboard/reviews` - Moderation

## Production Deployment (Vercel)

### Step 1: Prepare M-Pesa Credentials

Obtain from Safaricom Daraja:
- Consumer Key (Bearer token)
- Consumer Secret
- Business Shortcode (174379 for sandbox, production code needed)
- Passkey (for STK Push)

### Step 2: Set Environment Variables

In Vercel project settings, add:

```
MPESA_CONSUMER_KEY=your_key_here
MPESA_CONSUMER_SECRET=your_secret_here
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=https://yourdomain.vercel.app/api/payments/callback
```

### Step 3: Configure Payment Webhook

1. Log into Safaricom Daraja portal
2. Set callback URL to: `https://yourdomain.vercel.app/api/payments/callback`
3. Test webhook connectivity
4. Verify TLS 1.2+ (auto-provided by Vercel)

### Step 4: Deploy

```bash
git add .
git commit -m "feat: e-commerce platform with M-Pesa payments"
git push origin main
```

Vercel auto-deploys (~4 min). Verify:

```bash
curl https://yourdomain.vercel.app/api/orders/health
```

### Step 5: Test End-to-End

1. **Create Test Order:**
```bash
curl -X POST https://yourdomain.vercel.app/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-001",
    "customerPhone": "0793573208",
    "customerEmail": "test@example.com",
    "customerName": "Test Customer",
    "items": [
      {
        "partCode": "ENG-001",
        "partName": "Diesel Engine 10kVA",
        "quantity": 1,
        "unitPrice": 85000,
        "subtotal": 85000
      }
    ],
    "shippingLocation": "Nairobi",
    "paymentMethod": "mpesa"
  }'
```

2. **Initiate Payment:**
```bash
curl -X POST https://yourdomain.vercel.app/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-20260724-1234",
    "amount": 95200,
    "phoneNumber": "0793573208",
    "customerEmail": "test@example.com"
  }'
```

3. **Test Callback** (Safaricom will send this automatically):
- M-Pesa STK Pop should appear on phone
- Enter M-Pesa PIN
- Callback triggers order status update

## Database Migration (When Ready)

### Current State
- All orders/reviews stored in-memory (Map)
- Data lost on app restart
- Single-process only

### PostgreSQL Setup

#### 1. Create Database
```sql
-- orders table
CREATE TABLE orders (
  orderId VARCHAR(20) PRIMARY KEY,
  customerId VARCHAR(50) NOT NULL,
  customerPhone VARCHAR(20),
  customerEmail VARCHAR(100),
  customerName VARCHAR(100),
  subtotal INTEGER,
  tax INTEGER,
  shippingCost INTEGER,
  total INTEGER,
  paymentMethod VARCHAR(20),
  paymentStatus VARCHAR(20),
  status VARCHAR(20),
  mpesaTransactionId VARCHAR(50),
  checkoutRequestId VARCHAR(50),
  createdAt TIMESTAMP,
  paidAt TIMESTAMP,
  shippedAt TIMESTAMP,
  deliveredAt TIMESTAMP,
  notes TEXT,
  refundReason TEXT,
  refundAmount INTEGER,
  refundedAt TIMESTAMP
);

-- order_items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  orderId VARCHAR(20) REFERENCES orders(orderId),
  partCode VARCHAR(50),
  partName VARCHAR(100),
  quantity INTEGER,
  unitPrice INTEGER,
  subtotal INTEGER
);

-- reviews table
CREATE TABLE reviews (
  id VARCHAR(50) PRIMARY KEY,
  orderId VARCHAR(20) REFERENCES orders(orderId),
  partCode VARCHAR(50),
  partName VARCHAR(100),
  customerId VARCHAR(50),
  customerName VARCHAR(100),
  rating INTEGER,
  title VARCHAR(100),
  body TEXT,
  images TEXT[],
  status VARCHAR(20),
  isSuspicious BOOLEAN,
  createdAt TIMESTAMP,
  approvedAt TIMESTAMP,
  rejectionReason TEXT
);

-- indexes
CREATE INDEX idx_orders_customer ON orders(customerId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment ON orders(paymentStatus);
CREATE INDEX idx_reviews_part ON reviews(partCode);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_pending ON reviews(status) WHERE status = 'pending';
```

#### 2. Install Package
```bash
npm install pg
```

#### 3. Create PostgresOrderDb Class

File: `lib/db/orders-postgres.ts`

```typescript
import { Pool } from 'pg';
import type { Order, OrderRepository } from '@/lib/db/orders';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

class PostgresOrderDb implements OrderRepository {
  async create(order: Order): Promise<Order> {
    const result = await pool.query(
      `INSERT INTO orders (
        orderId, customerId, customerPhone, customerEmail, customerName,
        subtotal, tax, shippingCost, total, paymentMethod, paymentStatus,
        status, createdAt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        order.orderId, order.customerId, order.customerPhone,
        order.customerEmail, order.customerName, order.subtotal,
        order.tax, order.shippingCost, order.total, order.paymentMethod,
        order.paymentStatus, order.status, order.createdAt
      ]
    );
    return result.rows[0];
  }

  async findById(orderId: string): Promise<Order | null> {
    const result = await pool.query(
      'SELECT * FROM orders WHERE orderId = $1',
      [orderId]
    );
    return result.rows[0] || null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const result = await pool.query(
      'SELECT * FROM orders WHERE customerId = $1 ORDER BY createdAt DESC',
      [customerId]
    );
    return result.rows;
  }

  async update(orderId: string, updates: Partial<Order>): Promise<Order> {
    const result = await pool.query(
      'UPDATE orders SET paymentStatus = $1, status = $2, paidAt = $3 WHERE orderId = $4 RETURNING *',
      [updates.paymentStatus, updates.status, updates.paidAt, orderId]
    );
    return result.rows[0];
  }

  // ... implement other methods similarly
}

export const ordersRepository = new PostgresOrderDb();
```

#### 4. Update Environment
```
DATABASE_URL=postgresql://user:password@host:5432/ecommerce
```

#### 5. Test Connection
```bash
npm run test:db
```

## Scaling Checklist

### Load Testing
- [ ] Test with 100+ concurrent orders
- [ ] Verify analytics doesn't timeout
- [ ] Check M-Pesa rate limits

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Monitor database query performance
- [ ] Alert on failed payments > 5%

### Caching
- [ ] Cache popular parts (Redis)
- [ ] Cache analytics snapshots
- [ ] Cache customer ratings

### Optimization
- [ ] Index analytics queries
- [ ] Paginate large result sets
- [ ] Archive old orders

## Troubleshooting

### M-Pesa Callback Not Received
1. Verify `MPESA_CALLBACK_URL` is HTTPS
2. Check Vercel logs for 500 errors
3. Verify Daraja token isn't expired
4. Test webhook manually:
```bash
curl -X POST https://yourdomain.vercel.app/api/payments/callback \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "MerchantRequestID": "test",
        "CheckoutRequestID": "test",
        "ResultCode": 0,
        "ResultDesc": "Success"
      }
    }
  }'
```

### Orders Not Saving
1. Check database connection (if using PostgreSQL)
2. Verify in-memory fallback working
3. Check Vercel Postgres quotas

### Analytics Dashboard Blank
1. Verify orders exist: `/api/orders/health`
2. Check analytics service calculates metrics
3. Test endpoint directly: `/api/analytics/dashboard`

### Reviews Not Moderating
1. Check `/api/reviews/moderation/pending`
2. Verify review status is 'pending'
3. Check admin user permissions

## Support

For issues or questions:
1. Check logs: `vercel logs --follow`
2. Review error tracking (Sentry)
3. Test locally: `npm run dev`
