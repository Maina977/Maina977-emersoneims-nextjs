-- ═══════════════════════════════════════════════════════════════════════════════
-- LEADS TABLE MIGRATION
-- Stores all lead/contact form submissions
-- © 2026 EmersonEIMS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Drop existing table if exists (for clean migration)
DROP TABLE IF EXISTS leads CASCADE;

-- Create leads table
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,

  -- Contact Information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),

  -- Lead Details
  message TEXT NOT NULL,
  service VARCHAR(50) DEFAULT 'general',
  source VARCHAR(100) DEFAULT 'contact_form', -- Which form/page it came from
  location VARCHAR(255), -- For location-specific pages (e.g., "Nairobi", "Mombasa")

  -- Tracking Information
  ip_address VARCHAR(45),
  user_agent TEXT,
  referer TEXT,

  -- Lead Management
  status VARCHAR(20) DEFAULT 'new', -- new, contacted, qualified, converted, lost
  assigned_to VARCHAR(255), -- Sales person assigned
  notes TEXT,

  -- Follow-up tracking
  first_contacted_at TIMESTAMP WITH TIME ZONE,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,

  -- Revenue tracking
  estimated_value DECIMAL(12, 2),
  actual_value DECIMAL(12, 2),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_service ON leads(service);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_location ON leads(location);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_source ON leads(source);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════════
-- LEAD STATUS HISTORY TABLE
-- Track all status changes for CRM purposes
-- ═══════════════════════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS lead_status_history CASCADE;

CREATE TABLE lead_status_history (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lead_status_history_lead_id ON lead_status_history(lead_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- LEAD COMMUNICATIONS TABLE
-- Track all communications with a lead
-- ═══════════════════════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS lead_communications CASCADE;

CREATE TABLE lead_communications (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- call, email, whatsapp, sms, meeting
  direction VARCHAR(10) NOT NULL, -- inbound, outbound
  subject VARCHAR(255),
  content TEXT,
  outcome VARCHAR(50), -- interested, callback, not_interested, no_answer, voicemail
  next_action TEXT,
  next_action_date TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lead_communications_lead_id ON lead_communications(lead_id);
CREATE INDEX idx_lead_communications_type ON lead_communications(type);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SAMPLE DATA (for testing)
-- ═══════════════════════════════════════════════════════════════════════════════

-- INSERT INTO leads (name, email, phone, company, message, service, source, location, status)
-- VALUES
--   ('Test User', 'test@example.com', '+254712345678', 'Test Company', 'Test message', 'generators', 'cta_form', 'Nairobi', 'new');

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON TABLE leads TO your_app_user;
-- GRANT ALL PRIVILEGES ON TABLE lead_status_history TO your_app_user;
-- GRANT ALL PRIVILEGES ON TABLE lead_communications TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
