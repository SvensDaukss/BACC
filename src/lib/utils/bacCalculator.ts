export function calculateBAC({
  abv, // Alcohol by Volume (e.g., 5 for 5%)
  volumeOz, // Volume in ounces
  weightLbs, // Weight in pounds
  gender, // 'male' or 'female'
  hoursSinceDrinking // Time since drinking in hours
}: {
  abv: number;
  volumeOz: number;
  weightLbs: number;
  gender: 'male' | 'female';
  hoursSinceDrinking: number;
}): number {
  // Convert volume from oz to mL
  const volumeMl = volumeOz * 29.5735;

  // Calculate alcohol consumed in grams
  const alcoholGrams = volumeMl * (abv / 100) * 0.789;

  // Convert weight from lbs to grams
  const weightGrams = weightLbs * 453.592;

  // Alcohol distribution ratio based on gender
  const r = gender === 'male' ? 0.68 : 0.55;

  // Calculate BAC
  const bac = (alcoholGrams / (weightGrams * r)) * 100 - (0.015 * hoursSinceDrinking);

  // Ensure BAC is not negative
  return Math.max(bac, 0);
}

export function calculateTotalBAC({
  drinksList,
  user
}: {
  drinksList: Array<{
    abv: number;
    volume_oz: number;
    consumed_at: string;
  }>;
  user: {
    weight_lbs: number;
    gender: 'male' | 'female';
  };
}): number {
  if (!user.weight_lbs || !user.gender) {
    throw new Error('User profile must include weight and gender.');
  }

  const now = new Date();

  return drinksList.reduce((total, drink) => {
    const consumedAt = new Date(drink.consumed_at);
    const hoursSinceDrinking = (now.getTime() - consumedAt.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours

    const bac = calculateBAC({
      abv: drink.abv,
      volumeOz: drink.volume_oz,
      weightLbs: user.weight_lbs,
      gender: user.gender,
      hoursSinceDrinking
    });

    return total + bac;
  }, 0);
}