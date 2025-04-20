import { json } from '@sveltejs/kit';
import { addDrink, getDrinksByUser, deleteDrink } from '$database/queries/drinks';
import type { RequestEvent } from './$types';

export async function GET({ cookies }: RequestEvent) {
  const userId = cookies.get('session_id');
  if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const drinks = await getDrinksByUser(userId);
    return json(drinks);
  } catch (err) {
    console.error('Failed to fetch drinks:', err);
    return json({ error: 'Failed to fetch drinks' }, { status: 500 });
  }
}

export async function POST({ request, cookies }: RequestEvent) {
  const userId = cookies.get('session_id');
  if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, abv, volumeOz, consumedAt } = await request.json();
    const drink = await addDrink({ userId, name, abv, volumeOz, consumedAt });
    return json(drink);
  } catch (err) {
    console.error('Failed to add drink:', err);
    return json({ error: 'Failed to add drink' }, { status: 500 });
  }
}

export async function DELETE({ request, cookies }: RequestEvent) {
  const userId = cookies.get('session_id');
  if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { drinkId } = await request.json();
    await deleteDrink(drinkId, userId);
    return json({ success: true });
  } catch (err) {
    console.error('Failed to delete drink:', err);
    return json({ error: 'Failed to delete drink' }, { status: 500 });
  }
}
