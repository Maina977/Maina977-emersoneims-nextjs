-- Generator Oracle - License & Payment Tables
-- Run this migration to set up the database schema

-- Oracle Licenses Table
-- Stores all license keys with device binding
CREATE TABLE IF NOT EXISTS oracle_licenses (
  id SERIAL PRIMARY KEY,
  license_key VARCHAR(19) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_name VARCHAR(255),
  device_fingerprint VARCHAR(64),
  device_info JSONB,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_reference VARCHAR(100),
  last_heartbeat TIMESTAMP WITH TIME ZONE,
  activation_attempts INTEGER DEFAULT 0,
  notes TEXT
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_oracle_licenses_key ON oracle_licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_oracle_licenses_email ON oracle_licenses(customer_email);
CREATE INDEX IF NOT EXISTS idx_oracle_licenses_phone ON oracle_licenses(customer_phone);
CREATE INDEX IF NOT EXISTS idx_oracle_licenses_device ON oracle_licenses(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_oracle_licenses_status ON oracle_licenses(status);
CREATE INDEX IF NOT EXISTS idx_oracle_licenses_expires ON oracle_licenses(expires_at);

-- Oracle Payments Table
-- Tracks all payment submissions and verifications
CREATE TABLE IF NOT EXISTS oracle_payments (
  id SERIAL PRIMARY KEY,
  transaction_code VARCHAR(50) UNIQUE NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('mpesa', 'bank')),
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_name VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'refunded')),
  device_fingerprint VARCHAR(64),
  license_key VARCHAR(19) REFERENCES oracle_licenses(license_key),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by VARCHAR(100),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_oracle_payments_code ON oracle_payments(transaction_code);
CREATE INDEX IF NOT EXISTS idx_oracle_payments_email ON oracle_payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_oracle_payments_phone ON oracle_payments(customer_phone);
CREATE INDEX IF NOT EXISTS idx_oracle_payments_status ON oracle_payments(status);
CREATE INDEX IF NOT EXISTS idx_oracle_payments_license ON oracle_payments(license_key);

-- Oracle Activation Logs Table
-- Audit log for all activation attempts (for security monitoring)
CREATE TABLE IF NOT EXISTS oracle_activation_logs (
  id SERIAL PRIMARY KEY,
  license_key VARCHAR(19) NOT NULL,
  device_fingerprint VARCHAR(64) NOT NULL,
  device_info JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for security monitoring
CREATE INDEX IF NOT EXISTS idx_oracle_logs_key ON oracle_activation_logs(license_key);
CREATE INDEX IF NOT EXISTS idx_oracle_logs_device ON oracle_activation_logs(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_oracle_logs_created ON oracle_activation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_oracle_logs_success ON oracle_activation_logs(success);

-- Rate limiting table (for tracking activation attempts per hour)
CREATE TABLE IF NOT EXISTS oracle_rate_limits (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(100) NOT NULL, -- device fingerprint or IP
  identifier_type VARCHAR(20) NOT NULL CHECK (identifier_type IN ('device', 'ip')),
  attempts INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, identifier_type)
);

CREATE INDEX IF NOT EXISTS idx_oracle_rate_identifier ON oracle_rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_oracle_rate_window ON oracle_rate_limits(window_start);

-- Function to clean up old rate limit entries
CREATE OR REPLACE FUNCTION cleanup_oracle_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM oracle_rate_limits
  WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE oracle_licenses IS 'Stores Generator Oracle license keys with ONE device binding per license';
COMMENT ON TABLE oracle_payments IS 'Tracks payment submissions for manual admin verification';
COMMENT ON TABLE oracle_activation_logs IS 'Audit log of all license activation attempts for security';
COMMENT ON TABLE oracle_rate_limits IS 'Rate limiting to prevent brute force activation attempts';

COMMENT ON COLUMN oracle_licenses.device_fingerprint IS 'SHA-256 hash of device characteristics - bound on first activation';
COMMENT ON COLUMN oracle_licenses.last_heartbeat IS 'Last time the device checked in (24-hour heartbeat required)';
COMMENT ON COLUMN oracle_licenses.activation_attempts IS 'Number of activation attempts for rate limiting';
