export function HeroDeskGlobe() {
  return (
    <svg
      className="hero-desk-globe"
      viewBox="0 0 220 260"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hero-ocean" cx="34%" cy="26%" r="78%">
          <stop offset="0" stopColor="#eefaff" />
          <stop offset="0.3" stopColor="#a8d9ed" />
          <stop offset="0.72" stopColor="#559bc1" />
          <stop offset="1" stopColor="#2f6f98" />
        </radialGradient>
        <linearGradient id="hero-stand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--terracotta)" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--terracotta) 58%, var(--foreground))" />
        </linearGradient>
        <clipPath id="hero-globe-clip">
          <circle cx="110" cy="95" r="67" />
        </clipPath>
        <filter id="hero-globe-shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#3b2a22" floodOpacity="0.2" />
        </filter>
        <g id="hero-world-land">
          <path d="M17 60 27 43l19-10 18 4 8 13-6 12-13 2-6 10-9 3-5 19-11-6-3-16-9-7Z" />
          <path d="m50 101 13 4 10 14-4 18-11 21-8-5 2-14-8-13-3-17Z" />
          <path d="m91 48 11-9 17 2 6 8-10 7-14-2Z" />
          <path d="m105 65 18-8 17 5 9 16-7 12-4 24-13 18-11-9 1-18-11-14-7-15Z" />
          <path d="m137 48 14-11 24 1 9 8 22 5 8 14-15 8-15-4-11 10-13-2-8-12Z" />
          <path d="m169 110 17-9 18 8 4 13-12 8-21-3-9-8Z" />
        </g>
      </defs>

      <ellipse className="hero-desk-globe__shadow" cx="111" cy="241" rx="67" ry="9" />
      <path className="hero-desk-globe__stem" d="M139 156c-2 25-13 49-29 69" />
      <path className="hero-desk-globe__base" d="M69 236c7-13 22-20 41-20s35 7 42 20Z" />

      <g transform="rotate(-12 110 95)" filter="url(#hero-globe-shadow)">
        <path className="hero-desk-globe__meridian" d="M110 17a78 78 0 1 1 0 156" />
        <circle className="hero-desk-globe__ocean" cx="110" cy="95" r="67" fill="url(#hero-ocean)" />

        <g clipPath="url(#hero-globe-clip)">
          <g className="hero-desk-globe__land">
            <use href="#hero-world-land" />
            <use href="#hero-world-land" x="220" />
          </g>
          <ellipse className="hero-desk-globe__grid" cx="110" cy="95" rx="67" ry="22" />
          <ellipse className="hero-desk-globe__grid" cx="110" cy="95" rx="67" ry="45" />
          <ellipse className="hero-desk-globe__grid" cx="110" cy="95" rx="26" ry="67" />
          <path className="hero-desk-globe__shine" d="M61 77c8-25 28-41 52-43" />
        </g>

        <circle className="hero-desk-globe__rim" cx="110" cy="95" r="68" />
        <circle className="hero-desk-globe__pin" cx="110" cy="18" r="5" />
        <circle className="hero-desk-globe__pin" cx="110" cy="172" r="5" />
      </g>
    </svg>
  );
}
