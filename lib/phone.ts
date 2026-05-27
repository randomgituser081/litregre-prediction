/**
 * Normalise a user-supplied Nigerian phone number into the
 * international format the backend expects (no leading `+`, just digits).
 *
 *   08069916376       → 2348069916376
 *   8069916376        → 2348069916376
 *   +234 806 991 6376 → 2348069916376
 *   00234 806 991 6376→ 2348069916376
 *   2348069916376     → 2348069916376 (unchanged)
 *
 * If the input doesn't match any known Nigerian pattern, we still return
 * a digits-only string so the backend can reject it with a useful error.
 */
export function normalizeNigerianPhone(raw: string): string {
  if (!raw) return "";

  // Strip everything that isn't a digit (spaces, dashes, parens, leading +).
  let digits = raw.replace(/\D/g, "");

  // 00 prefix is the international access code for some carriers (e.g. 00234…)
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // Already in 234 format and reasonable length → keep.
  if (digits.startsWith("234") && digits.length >= 13) {
    return digits;
  }

  // Local 0-prefixed mobile (11 digits: 0XXXXXXXXXX) → swap leading 0 for 234.
  if (digits.length === 11 && digits.startsWith("0")) {
    return `234${digits.slice(1)}`;
  }

  // Mobile without leading 0 (10 digits starting with 7/8/9) → prepend 234.
  if (digits.length === 10 && /^[789]/.test(digits)) {
    return `234${digits}`;
  }

  return digits;
}
