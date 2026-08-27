export default function Logo({ className = "", size = 52 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="JF & Family logo"
    >
      <defs>
        <linearGradient id="jfBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6d5dfc" />
          <stop offset="0.55" stopColor="#ff6fb5" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="jfText" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e7e2ff" />
        </linearGradient>
        <linearGradient id="jfAccent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#6d5dfc" />
        </linearGradient>
        <radialGradient id="jfGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff6fb5" stopOpacity="0.65" />
          <stop offset="1" stopColor="#6d5dfc" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="60" cy="60" r="58" fill="url(#jfGlow)" />

      <rect x="14" y="14" width="92" height="92" rx="27" fill="url(#jfBg)" />

      <rect
        x="20"
        y="20"
        width="80"
        height="80"
        rx="21"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1.6"
      />

      <path
        d="M22 36 C 28 26, 38 20, 52 18.5 L 56 22 C 42 23.5, 30 30, 24 40 Z"
        fill="#ffffff"
        fillOpacity="0.28"
      />

      <path
        d="M90 24 C 93 22, 97 24, 97.5 27.5 C 98 31, 94.5 32, 91.5 30.5 C 96 34, 93 40, 88 38 C 85 37, 84 32.5, 86.5 30.5 Z"
        fill="url(#jfAccent)"
        fillOpacity="0.95"
      />

      <g
        stroke="url(#jfText)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M33 35 H55" />
        <path d="M44 35 V57 Q44 71 53 71 L60 71 L60 67" />
        <path d="M66 35 V76" />
        <path d="M62 38 H77" />
        <path d="M62 56 H73" />
      </g>
    </svg>
  );
}
