-- Fix RADIUS Database Issues
-- Run this SQL in Supabase SQL Editor

-- 1. Update users table to use ACPD instead of Admin
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('ACPD', 'Viewer'));

-- 2. Add email and phone columns to circle_leaders if they don't exist
ALTER TABLE public.circle_leaders 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 3. Insert the authenticated user with ACPD role
INSERT INTO public.users (id, email, name, role, campus, acpd)
VALUES (
    (SELECT auth.uid()),
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

-- 4. Update RLS policies to use ACPD instead of Admin
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Only admins can manage users" ON public.users;
DROP POLICY IF EXISTS "Users can view circle leaders" ON public.circle_leaders;
DROP POLICY IF EXISTS "Only admins can manage circle leaders" ON public.circle_leaders;
DROP POLICY IF EXISTS "Users can view communications" ON public.communications;
DROP POLICY IF EXISTS "Only admins can manage communications" ON public.communications;
DROP POLICY IF EXISTS "Users can view notes" ON public.notes;
DROP POLICY IF EXISTS "Only admins can manage notes" ON public.notes;

-- Create new policies with ACPD role
CREATE POLICY "Users can view their own data" ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Only ACPD can manage users" ON public.users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ACPD'
  )
);

CREATE POLICY "Users can view circle leaders" ON public.circle_leaders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Only ACPD can manage circle leaders" ON public.circle_leaders
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ACPD'
  )
);

CREATE POLICY "Users can view communications" ON public.communications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Only ACPD can manage communications" ON public.communications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ACPD'
  )
);

CREATE POLICY "Users can view notes" ON public.notes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Only ACPD can manage notes" ON public.notes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ACPD'
  )
);

-- 5. Verify the setup
SELECT 'Database fixes applied successfully!' as status;
