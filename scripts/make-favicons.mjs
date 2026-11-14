/**
 * Render the favicon PNGs from src/assets/logo/favicon.svg into public/.
 *
 *   node scripts/make-favicons.mjs
 *
 * Writes public/favicon.svg (a copy), public/favicon-32.png and public/apple-touch-icon.png (180 px).
 * Run it again whenever favicon.svg changes, and commit the results.
 */
import { copyFileSync, readFileSync } from 'node:fs';
import sharp from 'sharp';

const src = 'src/assets/logo/favicon.svg';
const svg = readFileSync(src);
copyFileSync(src, 'public/favicon.svg');
await sharp(svg, { density: 384 }).resize(32, 32).png().toFile('public/favicon-32.png');
// The touch icon gets a margin so iOS's rounded corners don't clip the mark.
await sharp(svg, { density: 768 })
  .resize(144, 144)
  .extend({ top: 18, bottom: 18, left: 18, right: 18, background: '#f6f4ee' })
  .png()
  .toFile('public/apple-touch-icon.png');
console.log('Wrote public/favicon.svg, favicon-32.png, apple-touch-icon.png');
