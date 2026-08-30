import type { FaqEntry } from '@/data/faq';
import { strings } from '@/i18n/dictionary';
import type { Lang } from '@/i18n/config';

/**
 * Answer engines quote the FIRST SENTENCE of an answer and nothing else.
 * Entries in src/data/faq.ts are written so that first sentence stands alone in
 * both languages. Do not reorder or truncate answers here.
 */
export function Faq({
  entries,
  lang,
  heading,
}: {
  entries: FaqEntry[];
  lang: Lang;
  heading?: string;
}) {
  if (entries.length === 0) return null;
  return (
    <section className="faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading">{heading ?? strings(lang).faq.heading}</h2>
      <dl>
        {entries.map((e) => (
          <div key={e.id} className="faq__item">
            <dt>{e.question[lang]}</dt>
            <dd>{e.answer[lang]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
