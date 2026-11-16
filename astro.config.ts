import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import placeholderReport from './src/integrations/placeholder-report';
import { DEFAULT_SITE_URL } from './src/site.config';

// SITE_URL and BASE_PATH come from the shell or CI, e.g.
//   SITE_URL=https://example.org BASE_PATH=/website npm run build
const site = process.env.SITE_URL || DEFAULT_SITE_URL;
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  // Collapse whitespace like HTML (Astro 7 defaults to JSX-style removal, which drops
  // spaces between inline elements).
  compressHTML: true,
  integrations: [sitemap(), placeholderReport()],
});
