import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  aboutSchema,
  coverSchema,
  highlightSchema,
  homeSchema,
  joinSchema,
  memberSchema,
  positionSchema,
  projectSchema,
  researchSchema,
  siteSchema,
  teamSchema,
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
  /* Files starting with "_" are held back (e.g. waiting for their figure) and not built. */
  highlights: defineCollection({
    loader: glob({ base: `${base}/highlights`, pattern: ['*.md', '!_*.md'] }),
    schema: ({ image }) => highlightSchema(image),
  }),
  covers: defineCollection({
    loader: glob({ base: `${base}/covers`, pattern: ['*.md', '!_*.md'] }),
    schema: ({ image }) => coverSchema(image),
  }),
  positions: defineCollection({
    loader: glob({ base: `${base}/positions`, pattern: ['*.md', '!_*.md'] }),
    schema: positionSchema,
  }),
  home: defineCollection({ loader: single('pages/home.md'), schema: homeSchema }),
  research: defineCollection({ loader: single('pages/research.md'), schema: researchSchema }),
  team: defineCollection({
    loader: single('pages/team.md'),
    schema: ({ image }) => teamSchema(image),
  }),
  about: defineCollection({ loader: single('pages/about.md'), schema: aboutSchema }),
  join: defineCollection({ loader: single('pages/join.md'), schema: joinSchema }),
};
