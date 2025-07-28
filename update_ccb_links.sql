-- Update CCB Profile Links for All Circle Leaders
-- This script updates all Circle Leaders to use the new CCB URL format
-- Replace the group ID (711) with each Circle Leader's UUID

-- Update all Circle Leaders to have the new CCB link format
UPDATE circle_leaders 
SET ccb_profile_link = 'https://valleycreekchurch.ccbchurch.com/goto/groups/' || id || '/events',
    updated_at = NOW()
WHERE ccb_profile_link IS NULL OR ccb_profile_link = '' OR ccb_profile_link != 'https://valleycreekchurch.ccbchurch.com/goto/groups/' || id || '/events';

-- Verify the updates
SELECT name, ccb_profile_link 
FROM circle_leaders 
ORDER BY name;

-- Show count of updated records
SELECT COUNT(*) as total_circle_leaders,
       COUNT(ccb_profile_link) as leaders_with_ccb_links
FROM circle_leaders;
