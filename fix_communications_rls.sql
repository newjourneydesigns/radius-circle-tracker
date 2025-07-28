-- Fix RLS policies for communications table and ensure all tables have proper access
-- Run these commands in your Supabase SQL editor

-- Fix communications table RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to select communications" ON communications;
DROP POLICY IF EXISTS "Allow authenticated users to insert communications" ON communications;
DROP POLICY IF EXISTS "Allow authenticated users to update communications" ON communications;
DROP POLICY IF EXISTS "Allow authenticated users to delete communications" ON communications;

CREATE POLICY "Allow authenticated users to select communications"
ON communications FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert communications"
ON communications FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update communications"
ON communications FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete communications"
ON communications FOR DELETE
TO authenticated
USING (true);

-- Fix circle_leaders table RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to select circle_leaders" ON circle_leaders;
DROP POLICY IF EXISTS "Allow authenticated users to insert circle_leaders" ON circle_leaders;
DROP POLICY IF EXISTS "Allow authenticated users to update circle_leaders" ON circle_leaders;
DROP POLICY IF EXISTS "Allow authenticated users to delete circle_leaders" ON circle_leaders;

CREATE POLICY "Allow authenticated users to select circle_leaders"
ON circle_leaders FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert circle_leaders"
ON circle_leaders FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update circle_leaders"
ON circle_leaders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete circle_leaders"
ON circle_leaders FOR DELETE
TO authenticated
USING (true);

-- Fix notes table RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to select notes" ON notes;
DROP POLICY IF EXISTS "Allow authenticated users to insert notes" ON notes;
DROP POLICY IF EXISTS "Allow authenticated users to update notes" ON notes;
DROP POLICY IF EXISTS "Allow authenticated users to delete notes" ON notes;

CREATE POLICY "Allow authenticated users to select notes"
ON notes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert notes"
ON notes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update notes"
ON notes FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete notes"
ON notes FOR DELETE
TO authenticated
USING (true);

-- Check that the admin user exists and has the correct role
SELECT email, role, name FROM users WHERE email = 'admin@valleycreek.org';

-- First, check what columns exist in the users table
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public';

-- Add missing columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS campus TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS acpd TEXT;

-- If the user doesn't exist or has wrong role, create/update them
INSERT INTO users (email, name, role, campus, acpd) 
VALUES ('admin@valleycreek.org', 'Admin User', 'Admin', 'Main Campus', 'John Doe')
ON CONFLICT (email) 
DO UPDATE SET 
    role = 'Admin',
    name = COALESCE(users.name, 'Admin User'),
    updated_at = NOW();

-- Verify all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename IN ('users', 'circle_leaders', 'communications', 'notes')
ORDER BY tablename, cmd;
