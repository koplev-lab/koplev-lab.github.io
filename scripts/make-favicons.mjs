/**
 * Render the favicon PNGs from src/assets/logo/favicon.svg into public/.
 *
 *   node scripts/make-favicons.mjs
 *
 * Writes public/favicon.svg (a copy) and public/favicon-32.png, both transparent (the SVG turns
 * light in dark mode), and public/apple-touch-icon.png (180 px, on paper).
 * Run it again whenever favicon.svg changes, and commit the results.
 */
import { copyFileSync, readFileSync } from 'node:fs';
import sharp from 'sharp';

const src = 'src/assets/logo/favicon.svg';
const svg = readFileSync(src);
copyFileSync(src, 'public/favicon.svg');
await sharp(svg, { density: 384 }).resize(32, 32).png().toFile('public/favicon-32.png');
// The touch icon gets a margin so iOS's rounded corners don't clip the mark, and a paper
// background because iOS fills transparent touch icons with black.
await sharp(svg, { density: 768 })
  .resize(144, 144)
  .extend({ top: 18, bottom: 18, left: 18, right: 18, background: '#f6f4ee' })
  .flatten({ background: '#f6f4ee' })
  .png()
  .toFile('public/apple-touch-icon.png');
console.log('Wrote public/favicon.svg, favicon-32.png, apple-touch-icon.png');
