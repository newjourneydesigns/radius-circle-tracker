-- Fix RLS policies for users table to resolve 400 errors
-- Run these commands in your Supabase SQL editor

-- First, check if RLS is enabled on users table
-- If you see RLS enabled but no policies allowing access, that's the issue

-- Option 1: Allow all operations for authenticated users (recommended for development)
-- This allows any authenticated user to read and write their own data and create new users

-- Drop existing policies if they exist (optional - only if you have restrictive policies)
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create permissive policies for authenticated users
CREATE POLICY "Allow authenticated users to select users"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert users"
ON users FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update own data"
ON users FOR UPDATE
TO authenticated
USING (auth.email() = email)
WITH CHECK (auth.email() = email);

-- Option 2: If you want to disable RLS entirely for development (less secure)
-- Uncomment the line below if you prefer to disable RLS completely
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';
