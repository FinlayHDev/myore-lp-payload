import { cn } from "@/lib/utils";

// The ore from the My Ore mark (three facets), drawn as fine line art and set along a ridge.
// Local coordinates: 388 wide, 220 tall, baseline at y = 220.
const LEFT = "M0 220 L66 31 L279 220 Z";
const RIGHT = "M129 220 L319 0 L388 220 Z";
const INNER = "M129 220 L194 145 L279 220 Z";

// x position, scale, and whether the cluster carries the orange fill.
const CLUSTERS: [number, number, boolean][] = [
  [-10, 0.27, false],
  [180, 0.4, false],
  [440, 0.6, true],
  [780, 0.33, false],
  [980, 0.48, true],
];

/** A quiet line-art ridge of ore, used as the page's one decorative motif. */
export function OreRidge({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const line = tone === "dark" ? "oklch(0.2 0.03 262 / 0.28)" : "oklch(0.97 0.01 90 / 0.3)";
  return (
    <svg
      viewBox="0 0 1200 150"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className={cn("pointer-events-none select-none", className)}
      fill="none"
    >
      <line x1="0" y1="149" x2="1200" y2="149" stroke={line} strokeWidth="1" />
      {CLUSTERS.map(([x, s, accent]) => (
        <g key={x} transform={`translate(${x} ${150 - 220 * s}) scale(${s})`}>
          {accent && <path d={RIGHT} fill="oklch(0.69 0.185 45)" fillOpacity="0.92" />}
          {accent && <path d={INNER} fill="oklch(0.5 0.15 40)" fillOpacity="0.9" />}
          {[LEFT, RIGHT, INNER].map((d) => (
            <path key={d} d={d} stroke={line} strokeWidth={1 / s} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      ))}
    </svg>
  );
}
