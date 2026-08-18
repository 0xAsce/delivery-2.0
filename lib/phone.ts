export function normalizeAlgerianPhone(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const raw = input.trim().replace(/[\s().-]/g, "");
  if (/^0[567]\d{8}$/.test(raw)) return `+213${raw.slice(1)}`;
  if (/^213[567]\d{8}$/.test(raw)) return `+${raw}`;
  if (/^\+213[567]\d{8}$/.test(raw)) return raw;
  return null;
}

export function isValidAlgerianPhone(input: unknown): boolean {
  return normalizeAlgerianPhone(input) !== null;
}