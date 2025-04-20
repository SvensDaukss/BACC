import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

export const databasePool = new Pool({
  connectionString: process.env.DATABASE_URL
});
