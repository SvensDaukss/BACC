import { json } from '@sveltejs/kit';
import { databasePool } from '$database/connection';
import bcrypt from 'bcrypt';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    const result = await databasePool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return json({ success: false, error: 'User not found' }, { status: 401 });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }

    // Set cookie with user_id (or token if using JWT later)
    cookies.set('session_id', user.user_id, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // Secure in production
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    const { password_hash, ...safeUser } = user;
    return json({ success: true, user: safeUser });

  } catch (err) {
    console.error('Login error:', err);
    return json({ success: false, error: 'Login failed' }, { status: 500 });
  }
};
