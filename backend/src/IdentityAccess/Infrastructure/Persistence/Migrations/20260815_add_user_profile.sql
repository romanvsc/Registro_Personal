ALTER TABLE users
  ADD COLUMN avatar_key VARCHAR(40) NULL AFTER is_active,
  ADD COLUMN biography VARCHAR(500) NOT NULL DEFAULT '' AFTER avatar_key;
