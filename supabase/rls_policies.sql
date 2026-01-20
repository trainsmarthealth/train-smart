-- =============================================
-- TrainSmart Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Programs Policies
-- =============================================

-- Anyone can view FREE programs (is_free = true)
CREATE POLICY "public_free_programs" ON programs
  FOR SELECT
  USING (is_free = TRUE);

-- Authenticated users can view programs they have access to
CREATE POLICY "user_entitled_programs" ON programs
  FOR SELECT
  TO authenticated
  USING (
    -- User has direct entitlement OR is a subscriber
    EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.user_id = auth.uid()
      AND (
        e.program_id = programs.id 
        OR e.is_subscriber = TRUE
      )
      AND (e.expires_at IS NULL OR e.expires_at > NOW())
    )
  );

-- =============================================
-- Exercises Policies
-- =============================================

-- Anyone can view exercises from FREE programs
CREATE POLICY "public_free_exercises" ON exercises
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM programs p
      WHERE p.id = exercises.program_id
      AND p.is_free = TRUE
    )
  );

-- Authenticated users can view exercises from entitled programs
CREATE POLICY "user_entitled_exercises" ON exercises
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.user_id = auth.uid()
      AND (
        e.program_id = exercises.program_id
        OR e.is_subscriber = TRUE
      )
      AND (e.expires_at IS NULL OR e.expires_at > NOW())
    )
  );

-- =============================================
-- Entitlements Policies
-- =============================================

-- Users can only view their own entitlements
CREATE POLICY "user_own_entitlements" ON entitlements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only service role can insert/update entitlements (via webhooks)
-- No INSERT/UPDATE policies for anon/authenticated

-- =============================================
-- User Progress Policies
-- =============================================

-- Users can view their own progress
CREATE POLICY "user_own_progress_select" ON user_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own progress
CREATE POLICY "user_own_progress_insert" ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own progress
CREATE POLICY "user_own_progress_update" ON user_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
