-- Migration: Convert to group RSVP model
-- Each invite link can have multiple individual RSVPs (one per person in a group).
-- dietary and guest_count columns are no longer needed.

ALTER TABLE rsvp_responses DROP COLUMN IF EXISTS dietary;
ALTER TABLE rsvp_responses DROP COLUMN IF EXISTS guest_count;

-- email is no longer required for group members
ALTER TABLE rsvp_responses ALTER COLUMN email DROP NOT NULL;
ALTER TABLE rsvp_responses ALTER COLUMN email SET DEFAULT '';
