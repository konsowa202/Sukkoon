-- Sukoon Platform Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- ==========================================
-- 1. MIGRATIONS (Run these if tables already exist)
-- ==========================================

-- Robustly add/fix columns for users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ALTER COLUMN image_url TYPE TEXT;

-- Robustly add/fix columns for doctors table
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS google_maps_link TEXT;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS commission_percent INTEGER DEFAULT 10 CHECK (commission_percent >= 0 AND commission_percent <= 100);
ALTER TABLE doctors ALTER COLUMN image_url TYPE TEXT;

-- ==========================================
-- 2. FULL SCHEMA (For fresh setup)
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  image_url TEXT, -- Supports Base64 fallback strings
  date_of_birth DATE,
  gender VARCHAR(20),
  role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url TEXT, -- Supports Base64 fallback strings
  rating DECIMAL(3,2) DEFAULT 4.8 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 10,
  price_online INTEGER NOT NULL DEFAULT 0,
  price_offline INTEGER DEFAULT 0,
  experience INTEGER DEFAULT 0,
  gender VARCHAR(50) CHECK (gender IN ('male', 'female')),
  languages TEXT[] DEFAULT '{"Arabic", "English"}',
  consultation_type VARCHAR(50) NOT NULL DEFAULT 'both' CHECK (consultation_type IN ('online', 'offline', 'both')),
  location VARCHAR(500),
  google_maps_link TEXT,
  city VARCHAR(100),
  availability JSONB DEFAULT '{"Monday": ["09:00", "10:00", "11:00"], "Wednesday": ["14:00", "15:00"]}',
  is_verified BOOLEAN DEFAULT FALSE,
  google_calendar_enabled BOOLEAN DEFAULT FALSE,
  google_refresh_token TEXT,
  commission_percent INTEGER DEFAULT 10 CHECK (commission_percent >= 0 AND commission_percent <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  patient_name VARCHAR(255),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('online', 'offline')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  service VARCHAR(255),
  meet_link TEXT,
  google_event_id VARCHAR(255),
  notes TEXT,
  request_type VARCHAR(50),
  request_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  method VARCHAR(50) NOT NULL CHECK (method IN ('bank_transfer', 'vodafone_cash', 'instapay')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  proof_image_url TEXT,
  promo_code_id UUID, -- References promo_codes(id) but without strict FK for now
  original_amount INTEGER,
  discount_amount INTEGER,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE, -- Optional restriction
  max_uses INTEGER DEFAULT 100,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table (for Chat System)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(appointment_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_messages_appointment_id ON messages(appointment_id);
CREATE INDEX IF NOT EXISTS idx_reviews_doctor_id ON reviews(doctor_id);

-- Prevent duplicate non-cancelled appointments for the same doctor/slot
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_appointment 
ON appointments (doctor_id, date, time) 
WHERE status != 'cancelled';

-- Performance Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_doctors_updated_at ON doctors;
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update Doctor Rating Trigger
CREATE OR REPLACE FUNCTION update_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE doctors
    SET 
        rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE doctor_id = NEW.doctor_id),
        review_count = (SELECT COUNT(*) FROM reviews WHERE doctor_id = NEW.doctor_id)
    WHERE id = NEW.doctor_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_doctor_rating_on_review ON reviews;
CREATE TRIGGER update_doctor_rating_on_review AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_doctor_rating();

-- Donations Table (New)
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('general', 'specific_doctor')),
  amount INTEGER NOT NULL,
  proof_image_url TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_doctor_id ON donations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
