/* eslint-disable @typescript-eslint/no-explicit-any */
export function JsonLd({ data }: { data: Record<string, any> | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
