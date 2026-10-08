// Small line-art icon set replacing emoji in Dial's UI. Matches the
// 24x24 viewBox / stroke / currentColor style the rest of the suite
// uses. Share text is NOT touched by this: generateShareText() in
// useGameState.js builds the actual shared result string (🔐 header),
// plain text sent via SMS/clipboard, a custom icon can't survive that
// trip, so it stays real Unicode there.
function base(props) {
  return { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true, ...props };
}

export function IconSpin({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M19 12a7 7 0 1 1-2.3-5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 3v4.5h-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBrain({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M9.5 4.5a2.8 2.8 0 0 0-2.8 2.8c0 .2 0 .4.05.6A2.6 2.6 0 0 0 5 10.3a2.6 2.6 0 0 0 1 2 2.7 2.7 0 0 0 2.5 3.7c.2 0 .3 0 .5-.03V19a1.5 1.5 0 0 0 3 0V7.3a2.8 2.8 0 0 0-2.5-2.8Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14.5 4.5a2.8 2.8 0 0 1 2.8 2.8c0 .2 0 .4-.05.6A2.6 2.6 0 0 1 19 10.3a2.6 2.6 0 0 1-1 2 2.7 2.7 0 0 1-2.5 3.7c-.2 0-.3 0-.5-.03V19a1.5 1.5 0 0 1-3 0V7.3a2.8 2.8 0 0 1 2.5-2.8Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLock({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function IconUnlock({ size = 40, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10.5V7a4 4 0 0 1 7.5-1.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function IconKey({ size = 40, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M11 11l9 9M16.5 16.5l2.5-2.5M18.5 18.5l2-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClose({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheckmark({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconShare({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M12 15V4M12 4l-3.5 3.5M12 4l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTrophy({ size = 40, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 5H4.5A2.5 2.5 0 0 0 5 10h2M17 5h2.5A2.5 2.5 0 0 1 19 10h-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 14v3.5M9 21h6M10 17.5h4l.6 3.5H9.4l.6-3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
