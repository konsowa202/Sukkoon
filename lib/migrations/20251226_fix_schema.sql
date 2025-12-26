-- Sukoon Platform Database Migration
-- Date: 2025-12-26
-- Purpose: Fix missing columns in payments and appointments tables

-- 1. Update payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS promo_code_id UUID;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS original_amount INTEGER;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS discount_amount INTEGER;

-- 2. Create/Update promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  max_uses INTEGER DEFAULT 100,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Update appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS service VARCHAR(255);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS meet_link TEXT;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS request_type VARCHAR(50);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS request_message TEXT;

-- 4. Update doctors table
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS commission_percent INTEGER DEFAULT 10 CHECK (commission_percent >= 0 AND commission_percent <= 100);

-- Comments for clarity
COMMENT ON COLUMN payments.promo_code_id IS 'References promo_codes(id) if a discount was applied';
COMMENT ON COLUMN payments.original_amount IS 'The base price before discount';
COMMENT ON COLUMN payments.discount_amount IS 'The amount deducted from original_amount';
