import { databasePool } from '$database/connection';

export async function getDrinksByUser(userId: string) {
  const res = await databasePool.query(
    'SELECT * FROM drinks WHERE user_id = $1 ORDER BY consumed_at ASC',
    [userId]
  );
  return res.rows;
}

export async function addDrink(drink: {
  userId: string;
  name: string;
  abv: number;
  volumeOz: number;
  consumedAt: string;
}) {
  const res = await databasePool.query(
    `INSERT INTO drinks (user_id, name, abv, volume_oz, consumed_at)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [drink.userId, drink.name, drink.abv, drink.volumeOz, drink.consumedAt]
  );
  return res.rows[0];
}

export async function deleteDrink(drinkId: string, userId: string) {
  await databasePool.query(
    'DELETE FROM drinks WHERE drink_id = $1 AND user_id = $2',
    [drinkId, userId]
  );
}
