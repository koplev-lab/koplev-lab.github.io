/**
 * Zod schemas for every content file. Used by src/content.config.ts and,
 * for derived types, by src/lib/types.ts. Keep in sync with .pages.yml.
 */
import { z } from 'astro/zod';
import type { SchemaContext } from 'astro:content';

type ImageHelper = SchemaContext['image'];

export const ROLES = [
  'PI',
  'Postdoc',
  'PhD student',
  'Research engineer',
  'Research assistant',
  'Master student',
  'Bachelor student',
  'Visiting',
  'Alumni',
] as const;
export type Role = (typeof ROLES)[number];

/** A required, non-empty string. */
const text = () => z.string().trim().min(1);
const url = () => z.url();
/** A DOI without the https://doi.org/ prefix, e.g. 10.1038/s41586-024-07571-1. */
const doi = () =>
  z
    .string()
    .trim()
    .transform((s) => s.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').toLowerCase())
    .pipe(z.string().regex(/^10\.\d{4,9}\/\S+$/, 'Expected a DOI like 10.1038/xxxx'));

const placeholder = () => z.boolean().default(false);

/* ------------------------------------------------------------------ site */

export const sectionTitlesSchema = z.object({
  projects: text(),
  highlights: text(),
  allPublications: text(),
  currentMembers: text(),
  alumni: text(),
  vision: text(),
  join: text(),
  contact: text(),
  affiliations: text(),
  funders: text(),
  projectPeople: text(),
  projectPublications: text(),
});

export const labelsSchema = z.object({
  skipToContent: text(),
  mainNav: text(),
  draft: text(),
  illustrativeData: text(),
  readMore: text(),
  allProjects: text(),
  allPublications: text(),
  allMembers: text(),
  /** Short name for a page's main text block (used e.g. in figure captions). */
  overview: text(),
  /** Shown in place of the data figure until its data exists. */
  figurePending: text(),
  preprint: text(),
  openAccess: text(),
  code: text(),
  etAl: text(),
  noAlumni: text(),
  links: z.object({
    orcid: text(),
    github: text(),
    scholar: text(),
    website: text(),
    email: text(),
  }),
  /** Plural headings for grouping members by role on the team page. */
  roleGroups: z.object(
    Object.fromEntries(ROLES.map((r) => [r, text()])) as Record<Role, ReturnType<typeof text>>,
  ),
  notFound: z.object({ title: text(), body: text() }),
});

export const siteSchema = (image: ImageHelper) =>
  z.object({
    labName: text(),
    tagline: text(),
    piName: text(),
    description: text(),
    affiliations: z.array(z.object({ name: text(), url: url() })).min(1),
    funders: z
      .array(
        z.object({
          name: text(),
          url: url(),
          logo: image().optional(),
          logoAlt: z.string().optional(),
        }),
      )
      .default([]),
    contact: z.object({
      email: z.email(),
      address: z.string().optional(),
      mapUrl: url().optional(),
    }),
    nav: z.object({
      home: text(),
      research: text(),
      publications: text(),
      team: text(),
      about: text(),
      join: text(),
    }),
    social: z
      .object({
        github: url().optional(),
        bluesky: url().optional(),
        mastodon: url().optional(),
        linkedin: url().optional(),
      })
      .default({}),
    sectionTitles: sectionTitlesSchema,
    labels: labelsSchema,
    placeholder: placeholder(),
  });

/* --------------------------------------------------------------- members */

export const memberSchema = (image: ImageHelper) =>
  z
    .object({
      name: text(),
      role: z.enum(ROLES),
      photo: image().optional(),
      photoAlt: z.string().optional(),
      order: z.number().int().default(100),
      current: z.boolean().default(true),
      orcid: z
        .string()
        .regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/, 'Expected an ORCID iD like 0000-0002-1825-0097')
        .optional(),
      github: z.string().optional(),
      scholar: url().optional(),
      website: url().optional(),
      email: z.email().optional(),
      startYear: z.number().int().min(1990).max(2100).optional(),
      placeholder: placeholder(),
    })
    .refine((m) => !m.photo || (m.photoAlt && m.photoAlt.trim().length > 0), {
      message: 'photoAlt is required when a photo is set',
      path: ['photoAlt'],
    });

/* -------------------------------------------------------------- projects */

export const projectSchema = (image: ImageHelper) =>
  z.object({
    title: text(),
    summary: text(),
    image: image(),
    imageAlt: text(),
    imageCaption: text(),
    imageCredit: z.string().optional(),
    members: z.array(z.string()).default([]),
    publications: z.array(doi()).default([]),
    repo: url().optional(),
    order: z.number().int().default(100),
    placeholder: placeholder(),
  });

/* ------------------------------------------------------------ highlights */

export const highlightSchema = (image: ImageHelper) =>
  z.object({
    doi: doi(),
    image: image(),
    imageAlt: text(),
    imageKind: z.enum(['figure', 'cover']),
    imageCredit: text(),
    blurb: text(),
    order: z.number().int().default(100),
    placeholder: placeholder(),
  });

/* ----------------------------------------------------------------- pages */

export const aboutSchema = z.object({ title: text(), lede: text(), placeholder: placeholder() });
export const joinSchema = z.object({ title: text(), lede: text(), placeholder: placeholder() });
export const researchSchema = z.object({ title: text(), lede: text(), placeholder: placeholder() });
export const homeSchema = z.object({
  /** Title of the home page's data figure (the interactive tissue map). */
  figureTitle: text(),
  /** One or two sentences explaining the data figure to a non-specialist. */
  figureCaption: text(),
  /** Project slugs to feature on the home page. Empty: all projects by `order`. */
  featuredProjects: z.array(z.string()).default([]),
  /** Highlight ids to feature on the home page. Empty: all highlights by `order`. */
  featuredHighlights: z.array(z.string()).default([]),
  placeholder: placeholder(),
});

export type SectionTitles = z.infer<typeof sectionTitlesSchema>;
export type Labels = z.infer<typeof labelsSchema>;
