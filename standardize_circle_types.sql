-- Comprehensive Circle Type Standardization
-- This script standardizes all common Circle Type variations to proper formatting

-- Before running, check current circle types:
-- SELECT DISTINCT circle_type, COUNT(*) FROM circle_leaders GROUP BY circle_type ORDER BY circle_type;

BEGIN;

-- Standardize Men's/Mens variations
UPDATE circle_leaders 
SET circle_type = 'Mens' 
WHERE LOWER(TRIM(circle_type)) IN ('men', 'mens', 'men''s', 'male', 'males');

-- Standardize Women's/Womens variations
UPDATE circle_leaders 
SET circle_type = 'Womens' 
WHERE LOWER(TRIM(circle_type)) IN ('women', 'womens', 'women''s', 'female', 'females', 'ladies', 'woman');

-- Standardize Mixed/Co-ed variations
UPDATE circle_leaders 
SET circle_type = 'Couples' 
WHERE LOWER(TRIM(circle_type)) IN ('mixed', 'co-ed', 'coed', 'co ed', 'couples', 'family');

-- Standardize Youth/Young Adult variations
UPDATE circle_leaders 
SET circle_type = 'Youth' 
WHERE LOWER(TRIM(circle_type)) IN ('youth', 'young adult', 'young adults', 'ya', 'students', 'college');

-- Standardize Senior/Older Adult variations  
UPDATE circle_leaders 
SET circle_type = 'Seniors' 
WHERE LOWER(TRIM(circle_type)) IN ('seniors', 'senior', 'older adults', 'elderly', 'mature');

-- Clean up any leading/trailing whitespace
UPDATE circle_leaders 
SET circle_type = TRIM(circle_type) 
WHERE circle_type IS NOT NULL AND circle_type != TRIM(circle_type);

-- Verify the standardization
SELECT 
    CASE 
        WHEN circle_type IS NULL THEN '[NULL]'
        WHEN TRIM(circle_type) = '' THEN '[EMPTY]'
        ELSE circle_type 
    END as circle_type,
    COUNT(*) as count
FROM circle_leaders 
GROUP BY circle_type 
ORDER BY 
    CASE WHEN circle_type IS NULL THEN 1 ELSE 0 END,
    circle_type;

COMMIT;
