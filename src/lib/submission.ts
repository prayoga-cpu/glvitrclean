/**
 * Shared field contract between the quote form (src/components/QuoteForm.tsx)
 * and the quote endpoint (api/submit.ts + api/_lib/email.ts). Keeping the
 * allowlist in one place means a field can be added on the form only by also
 * adding it here — it cannot silently be dropped on the server side, and the
 * server cannot be tricked into accepting a key the form never sends.
 */

export const FIELD_KEYS = [
  'name',
  'phone',
  'service',
  'commune',
  'access',
  'details',
  'email',
] as const;

export type FieldKey = (typeof FIELD_KEYS)[number];

export type SubmissionField = { key: FieldKey; value: string };

export const MAX_VALUE_LENGTH = 2000;

export function isFieldKey(key: string): key is FieldKey {
  return (FIELD_KEYS as readonly string[]).includes(key);
}

/**
 * Pulls the allowed fields off a FormData, in FIELD_KEYS order, dropping
 * empties and anything not on the allowlist (the `consent` checkbox and the
 * `company_website` honeypot are never in FIELD_KEYS, so both are dropped
 * here automatically).
 */
export function collectFields(data: FormData): SubmissionField[] {
  const values = new Map<FieldKey, string>();
  for (const key of FIELD_KEYS) {
    const raw = data.get(key);
    if (typeof raw !== 'string') continue;
    const trimmed = raw.trim().slice(0, MAX_VALUE_LENGTH);
    if (trimmed) values.set(key, trimmed);
  }
  return FIELD_KEYS.filter((key) => values.has(key)).map((key) => ({
    key,
    value: values.get(key)!,
  }));
}
