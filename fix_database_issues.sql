-- Fix RADIUS Database Issues
-- Run this SQL in Supabase SQL Editor
-- Simplified permissions: Any authenticated user gets full access

-- 0. Create organization tables if they don't exist and add missing columns
CREATE TABLE IF NOT EXISTS public.acpd_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add description column to acpd_list if it doesn't exist
ALTER TABLE public.acpd_list 
ADD COLUMN IF NOT EXISTS description TEXT;

CREATE TABLE IF NOT EXISTS public.campus_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add address column to campus_list if it doesn't exist
ALTER TABLE public.campus_list 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Insert some default data for testing (only insert name first, then update with description)
INSERT INTO public.acpd_list (name) VALUES
('Trip Ochenski'),
('John Smith'),
('Jane Doe')
ON CONFLICT (name) DO NOTHING;

-- Update with descriptions now that the column exists
UPDATE public.acpd_list SET description = 'Adult Community & Partnership Development Director' WHERE name = 'Trip Ochenski';
UPDATE public.acpd_list SET description = 'ACPD Staff Member' WHERE name = 'John Smith';
UPDATE public.acpd_list SET description = 'ACPD Staff Member' WHERE name = 'Jane Doe';

INSERT INTO public.campus_list (name) VALUES
('Waterloo'),
('Franklin'),
('Main Campus')
ON CONFLICT (name) DO NOTHING;

-- Update with addresses now that the column exists
UPDATE public.campus_list SET address = '123 Main St, Waterloo' WHERE name = 'Waterloo';
UPDATE public.campus_list SET address = '456 Oak Ave, Franklin' WHERE name = 'Franklin';
UPDATE public.campus_list SET address = '789 Church Rd, King of Prussia' WHERE name = 'Main Campus';

-- Ensure notes table exists with correct schema
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_leader_id UUID REFERENCES circle_leaders(id) ON DELETE CASCADE,
  note_date DATE NOT NULL,
  content TEXT,
  follow_up_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to notes table if they don't exist
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS note_date DATE,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS follow_up_date DATE,
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 1. Update users table to use ACPD instead of Admin (keep for compatibility)
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('ACPD', 'Viewer'));

-- 2. Add missing columns to users table if they don't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS campus TEXT,
ADD COLUMN IF NOT EXISTS acpd TEXT;

-- Ensure the id column has a default UUID generator
ALTER TABLE public.users 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Add email and phone columns to circle_leaders if they don't exist
ALTER TABLE public.circle_leaders 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS event_summary_received BOOLEAN DEFAULT FALSE;

-- Update status field constraints for circle_leaders
-- First, check if status is an ENUM and handle it appropriately
DO $$
BEGIN
    -- Check if the status column is using an ENUM type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'circle_leaders' 
        AND column_name = 'status' 
        AND data_type = 'USER-DEFINED'
    ) THEN
        -- Drop the existing ENUM constraint and convert to TEXT with CHECK constraint
        ALTER TABLE public.circle_leaders 
        ALTER COLUMN status TYPE TEXT;
        
        -- Drop any existing ENUM type (this might fail if other tables use it, that's ok)
        BEGIN
            DROP TYPE IF EXISTS circle_leader_status CASCADE;
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors if the type is still in use elsewhere
            NULL;
        END;
    END IF;
    
    -- Drop any existing CHECK constraint before updating data
    ALTER TABLE public.circle_leaders 
    DROP CONSTRAINT IF EXISTS circle_leaders_status_check;
    
END $$;

-- Update any existing status values to match new constraints BEFORE adding the constraint
UPDATE public.circle_leaders 
SET status = 'invited' 
WHERE status = 'Invited';

UPDATE public.circle_leaders 
SET status = 'active' 
WHERE status IN ('Active', 'In Training');

UPDATE public.circle_leaders 
SET status = 'paused' 
WHERE status = 'Paused';

-- Handle any other status values that might exist
UPDATE public.circle_leaders 
SET status = 'invited' 
WHERE status NOT IN ('invited', 'pipeline', 'active', 'paused', 'off-boarding');

-- NOW add the CHECK constraint after all data has been updated
ALTER TABLE public.circle_leaders 
ADD CONSTRAINT circle_leaders_status_check 
CHECK (status IN ('invited', 'pipeline', 'active', 'paused', 'off-boarding'));

-- Remove any follow-up related data since we're deprecating this feature
UPDATE public.circle_leaders 
SET follow_up_date = NULL, follow_up_note = NULL;

-- Add missing communication_date column to communications table
ALTER TABLE public.communications 
ADD COLUMN IF NOT EXISTS communication_date DATE DEFAULT CURRENT_DATE;

-- 4. Insert the authenticated user with ACPD role
-- First, try to get the current auth user ID, or generate a new UUID
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Try to get the authenticated user ID
    SELECT auth.uid() INTO user_id;
    
    -- If no authenticated user, we'll insert/update based on email only
    IF user_id IS NULL THEN
        -- Insert or update user without specifying ID (let it auto-generate)
        INSERT INTO public.users (email, name, role, campus, acpd)
        VALUES (
            'trip.ochenski@valleycreek.org',
            'Trip Ochenski', 
            'ACPD',
            'Waterloo',
            'Trip Ochenski'
        )
        ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            campus = EXCLUDED.campus,
            acpd = EXCLUDED.acpd,
            updated_at = NOW();
    ELSE
        -- Insert or update with the authenticated user ID
        INSERT INTO public.users (id, email, name, role, campus, acpd)
        VALUES (
            user_id,
            'trip.ochenski@valleycreek.org',
            'Trip Ochenski', 
            'ACPD',
            'Waterloo',
            'Trip Ochenski'
        )
        ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            campus = EXCLUDED.campus,
            acpd = EXCLUDED.acpd,
            updated_at = NOW();
    END IF;
END $$;

-- 5. Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Only admins can manage users" ON public.users;
DROP POLICY IF EXISTS "Only ACPD can manage users" ON public.users;
DROP POLICY IF EXISTS "ACPD users can manage all users" ON public.users;
DROP POLICY IF EXISTS "Users can view circle leaders" ON public.circle_leaders;
DROP POLICY IF EXISTS "Only admins can manage circle leaders" ON public.circle_leaders;
DROP POLICY IF EXISTS "Only ACPD can manage circle leaders" ON public.circle_leaders;
DROP POLICY IF EXISTS "ACPD can insert circle leaders" ON public.circle_leaders;
DROP POLICY IF EXISTS "Authenticated users can view circle leaders" ON public.circle_leaders;
DROP POLICY IF EXISTS "ACPD users can manage circle leaders" ON public.circle_leaders;
DROP POLICY IF EXISTS "Authenticated users have full access to circle leaders" ON public.circle_leaders;
DROP POLICY IF EXISTS "Users can view communications" ON public.communications;
DROP POLICY IF EXISTS "Only admins can manage communications" ON public.communications;
DROP POLICY IF EXISTS "Only ACPD can manage communications" ON public.communications;
DROP POLICY IF EXISTS "ACPD can insert communications" ON public.communications;
DROP POLICY IF EXISTS "Authenticated users can view communications" ON public.communications;
DROP POLICY IF EXISTS "ACPD users can manage communications" ON public.communications;
DROP POLICY IF EXISTS "Authenticated users have full access to communications" ON public.communications;
DROP POLICY IF EXISTS "Users can view notes" ON public.notes;
DROP POLICY IF EXISTS "Only admins can manage notes" ON public.notes;
DROP POLICY IF EXISTS "Only ACPD can manage notes" ON public.notes;
DROP POLICY IF EXISTS "ACPD can insert notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users can view notes" ON public.notes;
DROP POLICY IF EXISTS "ACPD users can manage notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users have full access to notes" ON public.notes;
DROP POLICY IF EXISTS "All authenticated users can view acpd list" ON public.acpd_list;
DROP POLICY IF EXISTS "Admin users can modify acpd list" ON public.acpd_list;
DROP POLICY IF EXISTS "All authenticated users can view campus list" ON public.campus_list;
DROP POLICY IF EXISTS "Admin users can modify campus list" ON public.campus_list;
DROP POLICY IF EXISTS "Authenticated users have full access to acpd list" ON public.acpd_list;
DROP POLICY IF EXISTS "Authenticated users have full access to campus list" ON public.campus_list;

-- 6. Enable RLS on organization tables
ALTER TABLE public.acpd_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_list ENABLE ROW LEVEL SECURITY;

-- 7. Create simplified RLS policies - any authenticated user gets full access
-- Users table - disable RLS completely to avoid recursion
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Circle leaders - any authenticated user can do anything
CREATE POLICY "Authenticated users have full access to circle leaders" ON public.circle_leaders
FOR ALL USING (auth.uid() IS NOT NULL);

-- Communications - any authenticated user can do anything
CREATE POLICY "Authenticated users have full access to communications" ON public.communications
FOR ALL USING (auth.uid() IS NOT NULL);

-- Notes - any authenticated user can do anything
CREATE POLICY "Authenticated users have full access to notes" ON public.notes
FOR ALL USING (auth.uid() IS NOT NULL);

-- ACPD List - any authenticated user can do anything
CREATE POLICY "Authenticated users have full access to acpd list" ON public.acpd_list
FOR ALL USING (auth.uid() IS NOT NULL);

-- Campus List - any authenticated user can do anything
CREATE POLICY "Authenticated users have full access to campus list" ON public.campus_list
FOR ALL USING (auth.uid() IS NOT NULL);

-- 8. Verify the setup
SELECT 'Database fixes applied successfully! All authenticated users now have full access.' as status;