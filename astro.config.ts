import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { THEME_IDS } from './src/themes/ids';
import { DEFAULT_THEME, PLACEHOLDER_SITE_URL } from './src/site.config';

// astro:env is not available inside this file, so SITE_URL and BASE_PATH
// are read from the process environment (set by CI or your shell).
const site = process.env.SITE_URL || PLACEHOLDER_SITE_URL;
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [
    sitemap({
      // Theme preview pages are not meant to be indexed.
      filter: (page) => !new URL(page).pathname.includes('/themes/'),
    }),
  ],
  env: {
    schema: {
      THEME: envField.enum({
        context: 'server',
        access: 'public',
        values: [...THEME_IDS],
        default: DEFAULT_THEME,
      }),
      PREVIEW_THEMES: envField.boolean({
        context: 'server',
        access: 'public',
        default: false,
      }),
    },
  },
});
