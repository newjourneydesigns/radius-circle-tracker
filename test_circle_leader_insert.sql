-- Test Circle Leader Insert
-- Run this in Supabase SQL Editor to test if we can insert a circle leader

-- First, let's see the current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'circle_leaders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check communications table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'communications' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('circle_leaders', 'communications', 'users');

-- Test a simple insert
INSERT INTO public.circle_leaders (
    name, 
    email, 
    phone, 
    campus, 
    acpd, 
    circle_type, 
    day, 
    time, 
    frequency, 
    status
) VALUES (
    'Test Leader',
    'test@example.com',
    '555-1234',
    'Waterloo',
    'Trip Ochenski',
    'Life Group',
    'Wednesday',
    '7:00 PM',
    'Weekly',
    'Active'
);

-- Check if it was inserted
SELECT * FROM public.circle_leaders WHERE name = 'Test Leader';

-- Test communications insert
INSERT INTO public.communications (
    circle_leader_id,
    communication_date,
    communication_type,
    note
) VALUES (
    (SELECT id FROM public.circle_leaders WHERE name = 'Test Leader' LIMIT 1),
    CURRENT_DATE,
    'One-on-one',
    'Test communication'
);

-- Check communications
SELECT * FROM public.communications WHERE note = 'Test communication';
