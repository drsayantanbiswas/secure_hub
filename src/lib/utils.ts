import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type PasswordStrength = {
  score: number;
  level: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
  timeToCrack: string;
};

export type PasswordRequirements = {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  specialChars: boolean;
};

export const checkPasswordStrength = (password: string): { strength: PasswordStrength, requirements: PasswordRequirements } => {
  let score = 0;
  const requirements: PasswordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    specialChars: /[^A-Za-z0-9]/.test(password),
  };

  if (requirements.length) score += 25;
  if (requirements.uppercase) score += 20;
  if (requirements.lowercase) score += 10; // Lowercase is common, less points
  if (requirements.numbers) score += 20;
  if (requirements.specialChars) score += 25;

  // Bonus for length
  if (password.length > 12) score += 10;
  if (password.length > 16) score += 10;
  
  // Penalize for common sequences
  if (/(123|abc|password|qwerty)/i.test(password)) score -= 20;

  score = Math.max(0, Math.min(100, score));

  let level: PasswordStrength["level"];
  if (score < 20) level = "Very Weak";
  else if (score < 40) level = "Weak";
  else if (score < 60) level = "Fair";
  else if (score < 85) level = "Strong";
  else level = "Very Strong";
  
  const timeToCrack = estimateCrackTime(password);

  return { strength: { score, level, timeToCrack }, requirements };
};

function estimateCrackTime(password: string): string {
    const charsetSize = (/[a-z]/.test(password) ? 26 : 0) +
                        (/[A-Z]/.test(password) ? 26 : 0) +
                        (/[0-9]/.test(password) ? 10 : 0) +
                        (/[^A-Za-z0-9]/.test(password) ? 32 : 0);

    if (charsetSize === 0) return "instantly";

    const combinations = Math.pow(charsetSize, password.length);
    const guessesPerSecond = 1e12; // Assume 1 trillion guesses/sec for a powerful cracking rig
    const seconds = combinations / guessesPerSecond;

    if (seconds < 1) return "instantly";
    if (seconds < 60) return `~${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `~${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `~${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `~${Math.round(seconds / 86400)} days`;
    if (seconds < 3153600000) return `~${Math.round(seconds / 31536000)} years`;
    return "centuries";
}

export const generatePassword = (
  length: number,
  useUppercase: boolean,
  useLowercase: boolean,
  useNumbers: boolean,
  useSpecial: boolean,
  excludeAmbiguous: boolean
): string => {
  let charset = "";
  const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Excludes I, O
  const lowercaseChars = "abcdefghijkmnpqrstuvwxyz"; // Excludes l, o
  const numberChars = "23456789"; // Excludes 0, 1
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const fullUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const fullLowercase = "abcdefghijklmnopqrstuvwxyz";
  const fullNumbers = "0123456789";

  if (useUppercase) charset += excludeAmbiguous ? uppercaseChars : fullUppercase;
  if (useLowercase) charset += excludeAmbiguous ? lowercaseChars : fullLowercase;
  if (useNumbers) charset += excludeAmbiguous ? numberChars : fullNumbers;
  if (useSpecial) charset += specialChars;

  if (charset === "") return "Select at least one character type";

  let password = "";
  // cryptographic random values
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
};
