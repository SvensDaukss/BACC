import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { databasePool } from '$database/connection';

export const load: PageServerLoad = async ({ cookies }) => {
  const sessionId = cookies.get('session_id');
  if (!sessionId) {
    throw redirect(302, '/login');
  }

  const result = await databasePool.query(
    `SELECT user_id, email, first_name, last_name, age, country, gender, weight_lbs, height_ft, height_in
     FROM users
     WHERE user_id = $1`,
    [sessionId]
  );

  const user = result.rows[0];

  return {
    session: {
      userId: sessionId
    },
    user
  };
};
