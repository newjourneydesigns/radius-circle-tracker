-- Fix Circle Type Standardization
-- Update all variations of "men/mens" to standardized "Mens"

-- First, let's see what circle types we currently have
-- (Run this separately to see current state)
-- SELECT DISTINCT circle_type FROM circle_leaders ORDER BY circle_type;

-- Update "men" to "Mens"
UPDATE circle_leaders 
SET circle_type = 'Mens' 
WHERE LOWER(circle_type) = 'men';

-- Update "mens" to "Mens" 
UPDATE circle_leaders 
SET circle_type = 'Mens' 
WHERE LOWER(circle_type) = 'mens';

-- Update any other variations to ensure consistency
UPDATE circle_leaders 
SET circle_type = 'Mens' 
WHERE LOWER(circle_type) IN ('men''s', 'men''s', 'male', 'males');

-- Verify the changes
-- (Run this after the updates to confirm)
-- SELECT DISTINCT circle_type FROM circle_leaders ORDER BY circle_type;

-- Show count of updated records
SELECT 
    circle_type,
    COUNT(*) as count
FROM circle_leaders 
WHERE circle_type IS NOT NULL
GROUP BY circle_type 
ORDER BY circle_type;
