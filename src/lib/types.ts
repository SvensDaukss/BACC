export type RegistrationInput = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country?: string;
    age?: number;
    gender: 'male' | 'female';
    weightLbs?: number;
    heightFt?: number;
    heightIn?: number;
  };
  