-- ============================================================================
-- E-COMMERCE PLATFORM DATABASE SCHEMA
-- PostgreSQL 12+
-- ============================================================================

-- Create users table (for customer accounts)
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  fullName VARCHAR(100),
  phone VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table (customer profile + preferences)
CREATE TABLE customers (
  customerId VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  defaultShippingAddress VARCHAR(255),
  defaultCity VARCHAR(100),
  defaultCounty VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
  orderId VARCHAR(20) PRIMARY KEY,
  customerId VARCHAR(50) NOT NULL,
  customerPhone VARCHAR(20),
  customerEmail VARCHAR(100),
  customerName VARCHAR(100),
  subtotal INTEGER NOT NULL,
  tax INTEGER NOT NULL,
  shippingCost INTEGER NOT NULL,
  total INTEGER NOT NULL,
  paymentMethod VARCHAR(20),
  paymentStatus VARCHAR(20) DEFAULT 'pending',
  mpesaTransactionId VARCHAR(50),
  checkoutRequestId VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  shippingLocation VARCHAR(100),
  courierName VARCHAR(100),
  trackingNumber VARCHAR(100),
  notes TEXT,
  refundReason TEXT,
  refundAmount INTEGER,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paidAt TIMESTAMP,
  shippedAt TIMESTAMP,
  deliveredAt TIMESTAMP,
  refundedAt TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table (line items)
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  orderId VARCHAR(20) NOT NULL REFERENCES orders(orderId) ON DELETE CASCADE,
  partCode VARCHAR(50),
  partName VARCHAR(255),
  quantity INTEGER NOT NULL,
  unitPrice INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
  id VARCHAR(50) PRIMARY KEY,
  orderId VARCHAR(20) REFERENCES orders(orderId) ON DELETE SET NULL,
  partCode VARCHAR(50),
  partName VARCHAR(255),
  customerId VARCHAR(50),
  customerName VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(100),
  body TEXT,
  images JSON DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'pending',
  isSuspicious BOOLEAN DEFAULT FALSE,
  helpfulCount INTEGER DEFAULT 0,
  rejectionReason TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approvedAt TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create wishlists table
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  customerId VARCHAR(50) NOT NULL,
  partCode VARCHAR(50) NOT NULL,
  partName VARCHAR(255),
  addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customerId, partCode)
);

-- Create inventory_logs table (track stock changes)
CREATE TABLE inventory_logs (
  id SERIAL PRIMARY KEY,
  partCode VARCHAR(50),
  previousQty INTEGER,
  newQty INTEGER,
  reason VARCHAR(50),
  changedBy VARCHAR(100),
  changedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create analytics_snapshot table (daily snapshots)
CREATE TABLE analytics_snapshots (
  id SERIAL PRIMARY KEY,
  snapshotDate DATE,
  totalRevenue INTEGER,
  totalOrders INTEGER,
  totalCustomers INTEGER,
  averageOrderValue INTEGER,
  paymentSuccessRate DECIMAL(5,2),
  onTimeDeliveryRate DECIMAL(5,2),
  returnRate DECIMAL(5,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_orders_customer ON orders(customerId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_paymentStatus ON orders(paymentStatus);
CREATE INDEX idx_orders_createdAt ON orders(createdAt DESC);
CREATE INDEX idx_order_items_orderId ON order_items(orderId);
CREATE INDEX idx_reviews_partCode ON reviews(partCode);
CREATE INDEX idx_reviews_orderId ON reviews(orderId);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_pending ON reviews(status) WHERE status = 'pending';
CREATE INDEX idx_reviews_customerId ON reviews(customerId);
CREATE INDEX idx_wishlists_customer ON wishlists(customerId);
CREATE INDEX idx_wishlists_part ON wishlists(partCode);
CREATE INDEX idx_analytics_date ON analytics_snapshots(snapshotDate DESC);

-- Create trigger to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reviews_timestamp
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_customers_timestamp
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- MIGRATION NOTES
-- ============================================================================
-- 1. Replace in-memory InMemoryOrderDb with PostgresOrderDb
-- 2. Replace in-memory InMemoryReviewDb with PostgresReviewDb
-- 3. Set DATABASE_URL environment variable
-- 4. Run this schema script to create tables
-- 5. Orders and reviews now persist across app restarts
-- ============================================================================
