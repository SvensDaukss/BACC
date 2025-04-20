import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const POST = async ({ cookies }: RequestEvent) => {
  cookies.delete('session_id', { path: '/' });
  return json({ success: true });
};
