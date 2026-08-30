/**
 * The GLVITR'CLEAN mark, inlined so it costs no request and cannot go missing.
 *
 * Geometry is the prototype's CSS logo resolved to real coordinates: a circle
 * clipping two bars skewed by -18°, which at a 34px box shifts each edge
 * 17·tan(18°) ≈ 5.52px. The same artwork is committed as a standalone file in
 * public/assets/brand/ for handover (Google Business Profile, print, the
 * client's own use).
 */
const GOLD = '-4.48,0 14.52,0 3.48,34 -15.52,34';
const THIN = '20.52,0 25.52,0 14.48,34 9.48,34';

export function Logo({ inverse = false }: { inverse?: boolean }) {
  const id = inverse ? 'glv-mark-inverse' : 'glv-mark';
  return (
    <svg
      className="brand__mark"
      viewBox="0 0 34 34"
      width={34}
      height={34}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={id}>
          <circle cx="17" cy="17" r="17" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="34" height="34" fill={inverse ? '#ffffff' : 'var(--color-brand)'} />
        <polygon points={GOLD} fill="var(--color-accent)" />
        <polygon
          points={THIN}
          fill={inverse ? 'var(--color-brand)' : '#ffffff'}
          fillOpacity={inverse ? 1 : 0.4}
        />
      </g>
    </svg>
  );
}
