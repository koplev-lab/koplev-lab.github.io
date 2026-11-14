import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  aboutSchema,
  highlightSchema,
  homeSchema,
  joinSchema,
  memberSchema,
  projectSchema,
  researchSchema,
  siteSchema,
} from './lib/schemas';

const base = './src/content';

/** One Markdown or YAML file as a single-entry collection. */
const single = (pattern: string) => glob({ base, pattern });

export const collections = {
  site: defineCollection({ loader: single('site.yaml'), schema: ({ image }) => siteSchema(image) }),
  members: defineCollection({
    loader: glob({ base: `${base}/members`, pattern: '*.md' }),
    schema: ({ image }) => memberSchema(image),
  }),
  projects: defineCollection({
    loader: glob({ base: `${base}/projects`, pattern: '*.md' }),
    schema: ({ image }) => projectSchema(image),
  }),
  highlights: defineCollection({
    loader: glob({ base: `${base}/highlights`, pattern: '*.md' }),
    schema: ({ image }) => highlightSchema(image),
  }),
  home: defineCollection({ loader: single('pages/home.md'), schema: homeSchema }),
  research: defineCollection({ loader: single('pages/research.md'), schema: researchSchema }),
  about: defineCollection({ loader: single('pages/about.md'), schema: aboutSchema }),
  join: defineCollection({ loader: single('pages/join.md'), schema: joinSchema }),
};
