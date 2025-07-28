-- Simple RADIUS Database Schema - Step by Step
-- Run this first to create basic tables without policies

-- Drop existing tables if they exist (be careful - this will delete data!)
DROP TABLE IF EXISTS public.communications CASCADE;
DROP TABLE IF EXISTS public.notes CASCADE;
DROP TABLE IF EXISTS public.circle_leaders CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.acpd_list CASCADE;
DROP TABLE IF EXISTS public.campus_list CASCADE;

-- Organization tables for managing ACPDs and Campuses
CREATE TABLE public.acpd_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.campus_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table for storing user profiles and roles
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'Viewer' CHECK (role IN ('Admin', 'Viewer')),
  campus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Circle Leaders table for storing circle leader information
CREATE TABLE public.circle_leaders (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communications table for tracking all interactions with circle leaders
CREATE TABLE public.communications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_leader_id UUID REFERENCES circle_leaders(id) ON DELETE CASCADE,
  communication_date DATE NOT NULL,
  communication_type TEXT NOT NULL CHECK (communication_type IN ('One-on-one', 'Circle Visit', 'Circle Leader Equipping', 'Text', 'Phone Call', 'In Passing')),
  note TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table for storing freeform notes and follow-ups
CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_leader_id UUID REFERENCES circle_leaders(id) ON DELETE CASCADE,
  note_date DATE NOT NULL,
  note TEXT,
  follow_up_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_communications_leader_id ON communications(circle_leader_id);
CREATE INDEX idx_communications_date ON communications(communication_date);
CREATE INDEX idx_communications_type ON communications(communication_type);
CREATE INDEX idx_notes_leader_id ON notes(circle_leader_id);
CREATE INDEX idx_notes_date ON notes(note_date);
CREATE INDEX idx_circle_leaders_status ON circle_leaders(status);
CREATE INDEX idx_circle_leaders_campus ON circle_leaders(campus);
CREATE INDEX idx_circle_leaders_acpd ON circle_leaders(acpd);

-- Insert sample organization data
INSERT INTO acpd_list (name, description) VALUES
  ('Men''s Ministry', 'Associate Campus Pastor Director for Men''s Ministry'),
  ('Women''s Ministry', 'Associate Campus Pastor Director for Women''s Ministry'),
  ('Young Adults', 'Associate Campus Pastor Director for Young Adults'),
  ('Students', 'Associate Campus Pastor Director for Students'),
  ('Children''s Ministry', 'Associate Campus Pastor Director for Children''s Ministry');

INSERT INTO campus_list (name, address) VALUES
  ('Main Campus', '123 Main Street, Flower Mound, TX'),
  ('North Campus', '456 North Road, Lewisville, TX'),
  ('South Campus', '789 South Avenue, Dallas, TX'),
  ('Online Campus', 'Virtual Campus');

-- Insert sample data
INSERT INTO users (email, name, role, campus) VALUES
  ('admin@valleycreek.org', 'Admin User', 'Admin', 'Main Campus'),
  ('viewer@valleycreek.org', 'Viewer User', 'Viewer', 'Main Campus');

INSERT INTO circle_leaders (name, status, circle_type, day, time, frequency, campus, acpd) VALUES
  ('John Smith', 'Active', 'Men', 'Tuesday', '7:00 PM', 'Weekly', 'Main Campus', 'Men''s Ministry'),
  ('Jane Doe', 'In Training', 'Women', 'Thursday', '6:30 PM', 'Bi-weekly', 'North Campus', 'Women''s Ministry'),
  ('Bob Johnson', 'Invited', 'Young Adult', 'Saturday', '9:00 AM', 'Monthly', 'South Campus', 'Young Adults');

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
