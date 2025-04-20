import { validateSession } from '$lib/session';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  validateSession(cookies, '/dashboard');
  return {};
};
