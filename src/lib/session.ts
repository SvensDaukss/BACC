import { redirect } from '@sveltejs/kit';

export function validateSession(cookies: any, redirectPath: string) {
  const sessionId = cookies.get('session_id');
  if (sessionId) {
    throw redirect(302, redirectPath);
  }
}