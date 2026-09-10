/**
 * French grammar helpers for strings built out of place names.
 *
 * These belong in code rather than in the dictionary because the dictionary
 * holds template literals, and a template cannot know whether the name about
 * to be interpolated starts with a vowel. Five of the twelve communes do —
 * Arpajon, Égly, Étampes, Étréchy, Ollainville — so a bare `de ${commune}`
 * prints "de Étampes" on nearly half the commune pages, in a heading, in the
 * primary language. ROADMAP phase 8a caught it in the export.
 */

/**
 * `de` + a name, elided to `d'` before a vowel.
 *
 *   ofCommune('Étampes')   → "d'Étampes"
 *   ofCommune('Linas')     → 'de Linas'
 *   ofCommune('La Norville') → 'de La Norville'
 *
 * The accented capitals matter: `É` and `È` are what the Essonne list actually
 * contains, and a naive /^[aeiou]/i misses every one of them.
 *
 * Not handled, because no served commune needs it: a name whose article is
 * masculine — `Le Plessis-Pâté` takes `du Plessis-Pâté`, not `de Le`. Add that
 * case here if such a commune is ever added to `src/data/communes.ts`, rather
 * than working around it in the copy.
 */
export function ofCommune(name: string): string {
  return /^[aàâäeéèêëiîïoôöuùûüyAÀÂÄEÉÈÊËIÎÏOÔÖUÙÛÜY]/.test(name) ? `d'${name}` : `de ${name}`;
}
