-- Fix RADIUS Database Issues
-- Run this SQL in Supabase SQL Editor
-- Simplified permissions: Any authenticated user gets full access

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

-- 6. Create simplified RLS policies - any authenticated user gets full access
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

-- 7. Verify the setup
SELECT 'Database fixes applied successfully! All authenticated users now have full access.' as status;