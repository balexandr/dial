export function GameLogo() {
  const blue = '#0ea5e9';
  const light = '#38bdf8';

  return (
    <svg viewBox="0 0 48 48" width="26" height="26" aria-hidden="true" style={{ flexShrink: 0 }}>
      {/* Three overlapping dial rings */}
      <circle cx="16" cy="24" r="10.5" fill="none" stroke={blue} strokeWidth="3.4" />
      <circle cx="30" cy="24" r="10.5" fill="none" stroke={light} strokeWidth="3.4" />
      {/* Tick marks (dial indicators) */}
      <line x1="16" y1="13.5" x2="16" y2="17" stroke={blue} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="30" y1="13.5" x2="30" y2="17" stroke={light} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
