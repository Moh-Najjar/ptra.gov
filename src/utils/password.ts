const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()-_=+[]{}';
const ALL_PASSWORD_CHARS = `${LOWERCASE_CHARS}${UPPERCASE_CHARS}${NUMBER_CHARS}${SYMBOL_CHARS}`;

export type PasswordStrengthLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthResult {
  level: PasswordStrengthLevel;
  score: number;
  progress: number;
}

const randomIndex = (max: number): number => {
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);
  return randomValues[0] % max;
};

const shuffleArray = <T>(values: T[]): T[] => {
  const shuffledValues = [...values];

  for (let index = shuffledValues.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    const currentValue = shuffledValues[index];
    shuffledValues[index] = shuffledValues[swapIndex];
    shuffledValues[swapIndex] = currentValue;
  }

  return shuffledValues;
};

/** Generates a secure password with mixed character classes. */
export const generateSecurePassword = (length = 24): string => {
  const passwordLength = Math.max(length, 12);
  const requiredChars = [
    LOWERCASE_CHARS[randomIndex(LOWERCASE_CHARS.length)],
    UPPERCASE_CHARS[randomIndex(UPPERCASE_CHARS.length)],
    NUMBER_CHARS[randomIndex(NUMBER_CHARS.length)],
    SYMBOL_CHARS[randomIndex(SYMBOL_CHARS.length)],
  ];

  const passwordChars = [...requiredChars];

  for (let index = requiredChars.length; index < passwordLength; index += 1) {
    passwordChars.push(ALL_PASSWORD_CHARS[randomIndex(ALL_PASSWORD_CHARS.length)]);
  }

  return shuffleArray(passwordChars).join('');
};

/** Estimates password strength for UI feedback. */
export const getPasswordStrength = (password: string): PasswordStrengthResult => {
  if (password.trim().length === 0) {
    return { level: 'empty', score: 0, progress: 0 };
  }

  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 2) {
    return { level: 'weak', score, progress: 25 };
  }

  if (score <= 3) {
    return { level: 'fair', score, progress: 50 };
  }

  if (score <= 4) {
    return { level: 'good', score, progress: 75 };
  }

  return { level: 'strong', score, progress: 100 };
};

export const getPasswordStrengthColor = (
  level: PasswordStrengthLevel,
): 'error' | 'warning' | 'info' | 'success' | 'inherit' => {
  switch (level) {
    case 'weak':
      return 'error';
    case 'fair':
      return 'warning';
    case 'good':
      return 'info';
    case 'strong':
      return 'success';
    default:
      return 'inherit';
  }
};
