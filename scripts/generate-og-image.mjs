// Builds public/og-image.png: the social-share preview image, same
// convention every sibling NoodleGame ships (2400x1260, dark background,
// wordmark + tagline + brand label). Renders an SVG to PNG with sharp so
// it can be regenerated if the copy or colors ever change. Modeled on
// Weave's generate-og-image.mjs.
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WIDTH = 2400;
const HEIGHT = 1260;
const BLUE = '#0ea5e9';
const BLUE_LIGHT = '#38bdf8';
const TEXT_SECONDARY = '#9dc3d6';
const TEXT_DIM = '#567988';

// Same two-ring dial mark as GameLogo.jsx, scaled up from its 48x48 viewBox.
// Plain paths (no font dependency) so the icon renders identically
// regardless of what fonts are on the machine doing the rendering.
const iconScale = 3.6;
const iconSvg = `
  <g transform="translate(800, 330) scale(${iconScale})">
    <circle cx="16" cy="24" r="10.5" fill="none" stroke="${BLUE}" stroke-width="3.4" />
    <circle cx="30" cy="24" r="10.5" fill="none" stroke="${BLUE_LIGHT}" stroke-width="3.4" />
    <line x1="16" y1="13.5" x2="16" y2="17" stroke="${BLUE}" stroke-width="2.6" stroke-linecap="round" />
    <line x1="30" y1="13.5" x2="30" y2="17" stroke="${BLUE_LIGHT}" stroke-width="2.6" stroke-linecap="round" />
  </g>
`;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a141c" />
      <stop offset="55%" stop-color="#070d12" />
      <stop offset="100%" stop-color="#05090d" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="28%" r="55%">
      <stop offset="0%" stop-color="${BLUE}" stop-opacity="0.16" />
      <stop offset="100%" stop-color="${BLUE}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />

  ${iconSvg}

  <text x="980" y="470" font-family="Arial, Helvetica, sans-serif" font-weight="800"
        font-size="200" fill="${BLUE}">Dial</text>

  <text x="${WIDTH / 2}" y="660" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-weight="400" font-size="62" fill="${TEXT_SECONDARY}">
    Spin each wheel to spell the hidden word.
  </text>
  <text x="${WIDTH / 2}" y="740" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-weight="400" font-size="62" fill="${TEXT_SECONDARY}">
    One real word, no download needed.
  </text>

  <text x="${WIDTH / 2}" y="880" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-weight="700" font-size="38" letter-spacing="4" fill="${TEXT_DIM}">
    NOODLEGAMES · DAILY WORD PUZZLE
  </text>
</svg>
`;

const outPath = join(__dirname, '../public/og-image.png');
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Wrote ${outPath} (${WIDTH}x${HEIGHT}).`);
