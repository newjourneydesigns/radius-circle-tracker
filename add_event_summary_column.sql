-- Migration: Add event_summary_received column to circle_leaders table
-- Run this in your Supabase SQL editor

-- Add the new column if it doesn't exist
ALTER TABLE public.circle_leaders 
ADD COLUMN IF NOT EXISTS event_summary_received BOOLEAN DEFAULT FALSE;

-- Verify the column was added (optional check)
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'circle_leaders' 
AND column_name = 'event_summary_received';
