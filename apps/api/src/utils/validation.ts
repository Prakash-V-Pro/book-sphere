export function isValidPhone(value: string): boolean {
  return /^\+?[0-9][0-9\s\-]{7,14}$/.test(value);
}

