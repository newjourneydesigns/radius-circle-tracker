-- RADIUS Circle Leader Tracker Database Schema
-- Run this SQL in your Supabase SQL editor to create the required tables
-- Make sure to enable Row Level Security (RLS) as needed for your security requirements

-- Users table for storing user profiles and roles
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'Viewer' CHECK (role IN ('Admin', 'Viewer')),
  campus TEXT,
  acpd TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Circle Leaders table for storing circle leader information
CREATE TABLE IF NOT EXISTS public.circle_leaders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Invited' CHECK (status IN ('Invited', 'In Training', 'Active', 'Paused')),
  circle_type TEXT,
  day TEXT,
  time TEXT,
  frequency TEXT,
  campus TEXT,
  acpd TEXT,
  ccb_profile_link TEXT,
  calendar_link TEXT,
  last_communication_date DATE,
  follow_up_date DATE,
  follow_up_note TEXT,
  event_summary_received BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communications table for tracking all interactions with circle leaders
CREATE TABLE IF NOT EXISTS public.communications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_leader_id UUID REFERENCES circle_leaders(id) ON DELETE CASCADE,
  communication_date DATE NOT NULL,
  communication_type TEXT NOT NULL CHECK (communication_type IN ('One-on-one', 'Circle Visit', 'Circle Leader Equipping', 'Text', 'Phone Call', 'In Passing')),
  note TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table for storing freeform notes and follow-ups
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_leader_id UUID REFERENCES circle_leaders(id) ON DELETE CASCADE,
  note_date DATE NOT NULL,
  note TEXT,
  follow_up_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_communications_leader_id ON communications(circle_leader_id);
CREATE INDEX IF NOT EXISTS idx_communications_date ON communications(communication_date);
CREATE INDEX IF NOT EXISTS idx_communications_type ON communications(communication_type);
CREATE INDEX IF NOT EXISTS idx_notes_leader_id ON notes(circle_leader_id);
CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(note_date);
CREATE INDEX IF NOT EXISTS idx_circle_leaders_status ON circle_leaders(status);
CREATE INDEX IF NOT EXISTS idx_circle_leaders_campus ON circle_leaders(campus);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your security requirements)

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "All authenticated users can view circle leaders" ON circle_leaders;
DROP POLICY IF EXISTS "Admin users can modify circle leaders" ON circle_leaders;
DROP POLICY IF EXISTS "All authenticated users can view communications" ON communications;
DROP POLICY IF EXISTS "All authenticated users can view notes" ON notes;
DROP POLICY IF EXISTS "Admin users can modify communications" ON communications;
DROP POLICY IF EXISTS "Admin users can modify notes" ON notes;

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