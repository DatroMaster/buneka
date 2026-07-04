const GRADIENT_ID = "buneka-mark-gradient";

export function BunekaMark({
  size = 32,
  className = "",
  glow = true,
}: {
  size?: number;
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glow ? { filter: "drop-shadow(0 0 8px var(--home-glow, #f4f7fb))" } : undefined}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={GRADIENT_ID} x1="4" y1="4" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--mark-from, #f4f7fb)" />
          <stop offset="100%" stopColor="var(--mark-to, #f4f7fb)" />
        </linearGradient>
      </defs>
      {/* Outer diamond */}
      <polygon
        points="50,4 96,50 50,96 4,50"
        stroke={`url(#${GRADIENT_ID})`}
        strokeWidth={3}
        strokeLinejoin="miter"
      />
      {/* Inner diamond */}
      <polygon
        points="50,22 78,50 50,78 22,50"
        stroke={`url(#${GRADIENT_ID})`}
        strokeWidth={2.5}
        strokeLinejoin="miter"
      />
      {/* Center cross */}
      <line x1="50" y1="4" x2="50" y2="96" stroke={`url(#${GRADIENT_ID})`} strokeWidth={3} />
      <line x1="4" y1="50" x2="96" y2="50" stroke={`url(#${GRADIENT_ID})`} strokeWidth={3} />
      {/* Diagonal spark refractions */}
      <line
        x1="22"
        y1="22"
        x2="78"
        y2="78"
        stroke={`url(#${GRADIENT_ID})`}
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.6}
      />
      <line
        x1="78"
        y1="22"
        x2="22"
        y2="78"
        stroke={`url(#${GRADIENT_ID})`}
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.6}
      />
    </svg>
  );
}
