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
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glow ? { filter: "drop-shadow(0 0 6px var(--home-glow, #00F2FE))" } : undefined}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={GRADIENT_ID} x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>
      <path
        d="M16 2 L28 13 L16 30 L4 13 Z"
        stroke={`url(#${GRADIENT_ID})`}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path d="M4 13 L28 13" stroke={`url(#${GRADIENT_ID})`} strokeWidth={1.1} opacity={0.65} />
      <path d="M16 2 L16 30" stroke={`url(#${GRADIENT_ID})`} strokeWidth={1.1} opacity={0.45} />
    </svg>
  );
}
