// src/components/SideOrnaments.jsx
function BuildingGlyph({ className }) {
  return (
    <svg
      viewBox="0 0 80 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="10" width="40" height="140" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="34" x2="60" y2="34" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="58" x2="60" y2="58" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="82" x2="60" y2="82" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="106" x2="60" y2="106" stroke="currentColor" strokeWidth="1" />
      <line x1="20" y1="130" x2="60" y2="130" stroke="currentColor" strokeWidth="1" />
      {[22, 46, 70, 94, 118].map((y) => (
        <g key={y}>
          <rect x="27" y={y} width="8" height="8" stroke="currentColor" strokeWidth="1" />
          <rect x="45" y={y} width="8" height="8" stroke="currentColor" strokeWidth="1" />
        </g>
      ))}
      <line x1="12" y1="150" x2="68" y2="150" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SealGlyph({ className }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="26" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M40 22 L48 36 L40 50 L32 36 Z" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="40"
        y="68"
        textAnchor="middle"
        fontSize="6"
        letterSpacing="1.5"
        fill="currentColor"
        className="font-mono uppercase"
      >
        Domicile
      </text>
    </svg>
  );
}

export default function SideOrnaments() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-4 top-1/2 z-0 hidden -translate-y-1/2 xl:block"
      >
        <BuildingGlyph className="h-40 w-20 animate-float text-brass-light/15" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-6 top-1/3 z-0 hidden -translate-y-1/2 xl:block"
      >
        <SealGlyph className="h-24 w-24 animate-float-slow text-brass-light/15" />
      </div>
    </>
  );
}
