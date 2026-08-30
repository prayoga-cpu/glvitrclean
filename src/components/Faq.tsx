import type { FaqEntry } from '@/data/faq';

/**
 * Answer engines quote the FIRST SENTENCE of an answer and nothing else.
 * Entries in src/data/faq.ts are written so that first sentence stands alone.
 * Do not reorder or truncate answers here.
 */
export function Faq({ entries, heading = 'Questions fréquentes' }: { entries: FaqEntry[]; heading?: string }) {
  if (entries.length === 0) return null;
  return (
    <section className="faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading">{heading}</h2>
      <dl>
        {entries.map((e) => (
          <div key={e.id} className="faq__item">
            <dt>{e.question}</dt>
            <dd>{e.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
