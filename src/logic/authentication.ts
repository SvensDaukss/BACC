import bcrypt from 'bcrypt';
import { databasePool } from '$database/connection';

import type { RegistrationInput } from '$lib/types';

export async function registerNewUser(userData: RegistrationInput) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      country,
      age,
      gender,
      weightLbs,
      heightFt,
      heightIn
    } = userData;

    const passwordHash = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (
        email, password_hash, first_name, last_name, country, age, gender, weight_lbs, height_ft, height_in
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING user_id, email, first_name;
    `;

    const result = await databasePool.query(insertQuery, [
      email,
      passwordHash,
      firstName,
      lastName,
      country,
      age,
      gender,
      weightLbs,
      heightFt,
      heightIn
    ]);

    return result.rows[0];
  } catch (err) {
    console.error('Error registering user:', err);
    throw new Error('Registration failed');
  }
}

export async function updateUserProfile(user: {
  user_id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  country: string;
  weight_lbs: number;
  height_ft: number;
  height_in: number;
}) {
  const {
    user_id,
    first_name,
    last_name,
    age,
    gender,
    country,
    weight_lbs,
    height_ft,
    height_in
  } = user;

  const result = await databasePool.query(
    `UPDATE users SET
      first_name = $1,
      last_name = $2,
      age = $3,
      gender = $4,
      country = $5,
      weight_lbs = $6,
      height_ft = $7,
      height_in = $8
     WHERE user_id = $9
     RETURNING *`,
    [first_name, last_name, age, gender, country, weight_lbs, height_ft, height_in, user_id]
  );

  console.log('Updated user:', result.rows[0]); // Debugging: Log the updated user

  return result.rows[0];
}

