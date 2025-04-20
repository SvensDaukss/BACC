import { json } from '@sveltejs/kit';
import { calculateBAC } from '$lib/utils/bacCalculator';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { abv, volumeOz, weightLbs, gender, hoursSinceDrinking } = await request.json();

  if (!abv || !volumeOz || !weightLbs || !gender || hoursSinceDrinking === undefined) {
    return json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const bac = calculateBAC({ abv, volumeOz, weightLbs, gender, hoursSinceDrinking });

  return json({ bac });
};