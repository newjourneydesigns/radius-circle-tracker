-- RLS Policies for RADIUS Database
-- Run this AFTER running simple_schema.sql successfully

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE acpd_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_list ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "All authenticated users can view circle leaders" ON circle_leaders;
DROP POLICY IF EXISTS "Admin users can modify circle leaders" ON circle_leaders;
DROP POLICY IF EXISTS "All authenticated users can view communications" ON communications;
DROP POLICY IF EXISTS "All authenticated users can view notes" ON notes;
DROP POLICY IF EXISTS "Admin users can modify communications" ON communications;
DROP POLICY IF EXISTS "Admin users can modify notes" ON notes;
DROP POLICY IF EXISTS "All authenticated users can view acpd list" ON acpd_list;
DROP POLICY IF EXISTS "Admin users can modify acpd list" ON acpd_list;
DROP POLICY IF EXISTS "All authenticated users can view campus list" ON campus_list;
DROP POLICY IF EXISTS "Admin users can modify campus list" ON campus_list;

-- Users can read and update their own data
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.email() = email);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text OR auth.email() = email);

-- Admin users can read all data, Viewers can read all data
CREATE POLICY "All authenticated users can view circle leaders" ON circle_leaders
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only Admin users can modify circle leader data
CREATE POLICY "Admin users can modify circle leaders" ON circle_leaders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE (auth.uid()::text = users.id::text OR auth.email() = users.email) 
      AND users.role = 'Admin'
    )
  );

-- All authenticated users can view communications and notes
CREATE POLICY "All authenticated users can view communications" ON communications
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can view notes" ON notes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only Admin users can modify communications and notes
CREATE POLICY "Admin users can modify communications" ON communications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE (auth.uid()::text = users.id::text OR auth.email() = users.email) 
      AND users.role = 'Admin'
    )
  );

CREATE POLICY "Admin users can modify notes" ON notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE (auth.uid()::text = users.id::text OR auth.email() = users.email) 
      AND users.role = 'Admin'
    )
  );

-- Organization data policies
CREATE POLICY "All authenticated users can view acpd list" ON acpd_list
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin users can modify acpd list" ON acpd_list
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE (auth.uid()::text = users.id::text OR auth.email() = users.email) 
      AND users.role = 'Admin'
    )
  );

CREATE POLICY "All authenticated users can view campus list" ON campus_list
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin users can modify campus list" ON campus_list
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE (auth.uid()::text = users.id::text OR auth.email() = users.email) 
      AND users.role = 'Admin'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_circle_leaders_updated_at ON circle_leaders;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_circle_leaders_updated_at BEFORE UPDATE ON circle_leaders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
