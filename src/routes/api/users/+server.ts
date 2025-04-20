import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { registerNewUser, updateUserProfile } from '$logic/authentication';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const userData = await request.json();
    const user = await registerNewUser(userData);
    return json({ success: true, user });
  } catch (err) {
    console.error('Registration failed:', err);
    return json({ success: false, error: 'Registration failed. Please try again.' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const userData = await request.json();
    console.log('Received user data:', userData); // Debugging: Log the received data
    const updated = await updateUserProfile(userData);
    return json({ success: true, user: updated });
  } catch (err) {
    console.error('Profile update failed:', err);
    return json({ success: false, error: 'Failed to update profile. Please try again.' }, { status: 500 });
  }
};

