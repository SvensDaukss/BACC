CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  country TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female')),
  weight_lbs INTEGER,
  height_ft INTEGER,
  height_in INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drinks (
  drink_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  abv NUMERIC(5, 2) NOT NULL,
  volume_oz NUMERIC(5, 2) NOT NULL,
  consumed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add the index for better performance
CREATE INDEX IF NOT EXISTS idx_consumed_at ON drinks (consumed_at);
