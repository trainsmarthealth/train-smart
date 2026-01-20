-- =============================================
-- TrainSmart Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. Programs Table
-- =============================================
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  exercise_count INTEGER DEFAULT 0,
  category TEXT, -- 'ruecken', 'huefte', 'knie', etc.
  is_free BOOLEAN DEFAULT FALSE, -- Welcome content flag
  price_cents INTEGER, -- NULL for free, otherwise price in cents
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. Exercises Table
-- =============================================
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. Entitlements Table (User Access)
-- =============================================
CREATE TABLE entitlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  is_subscriber BOOLEAN DEFAULT FALSE, -- Abo = all access
  purchase_type TEXT CHECK (purchase_type IN ('one_time', 'subscription')),
  expires_at TIMESTAMPTZ, -- NULL for lifetime access
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, program_id)
);

-- =============================================
-- 4. User Progress Table (optional, for tracking)
-- =============================================
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  last_position_seconds INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, exercise_id)
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX idx_exercises_program_id ON exercises(program_id);
CREATE INDEX idx_entitlements_user_id ON entitlements(user_id);
CREATE INDEX idx_entitlements_program_id ON entitlements(program_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- =============================================
-- Updated_at Trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
