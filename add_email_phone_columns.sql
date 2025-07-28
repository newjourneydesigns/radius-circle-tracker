-- Add email and phone columns to circle_leaders table
-- This will allow the Circle Leader form to save and retrieve email and phone data

ALTER TABLE public.circle_leaders 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update the updated_at timestamp when these columns are modified
CREATE OR REPLACE FUNCTION update_circle_leaders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_circle_leaders_updated_at_trigger ON public.circle_leaders;
CREATE TRIGGER update_circle_leaders_updated_at_trigger
  BEFORE UPDATE ON public.circle_leaders
  FOR EACH ROW
  EXECUTE FUNCTION update_circle_leaders_updated_at();
