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
  'Summer intern',
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

/** Licences of figures reused from papers. The data layer adds the licence URL. */
export const LICENSES = ['CC BY 4.0', 'CC BY-NC-ND 4.0'] as const;
export type License = (typeof LICENSES)[number];

/* ------------------------------------------------------------------ site */

export const sectionTitlesSchema = z.object({
  projects: text(),
  highlights: text(),
  allPublications: text(),
  currentMembers: text(),
  alumni: text(),
  vision: text(),
  contact: text(),
  affiliations: text(),
  funders: text(),
  projectPeople: text(),
  projectPublications: text(),
  positions: text(),
  figureCredits: text(),
  groupPhotos: text(),
});

export const labelsSchema = z.object({
  skipToContent: text(),
  mainNav: text(),
  illustrativeData: text(),
  readMore: text(),
  allProjects: text(),
  allPublications: text(),
  /** Short name for a page's main text block (used e.g. in figure captions). */
  overview: text(),
  preprint: text(),
  openAccess: text(),
  code: text(),
  etAl: text(),
  noAlumni: text(),
  /** Column headings of the alumni table. */
  alumni: z.object({ name: text(), role: text(), next: text() }),
  /** Shown on the Join page when no advertised position is open. */
  noPositions: text(),
  /** Label before a position's closing date, e.g. "Apply by". */
  deadline: text(),
  /** Link text to the full advertisement. */
  positionAd: text(),
  /** Home page notice that positions are open, before the list of titles. */
  hiring: text(),
  /** Footer link to the figure credits on the About page. */
  figureCredits: text(),
  links: z.object({
    orcid: text(),
    github: text(),
    scholar: text(),
    website: text(),
    email: text(),
    linkedin: text(),
    x: text(),
    bluesky: text(),
    mastodon: text(),
  }),
  notFound: z.object({ title: text(), body: text() }),
});

export const siteSchema = (image: ImageHelper) =>
  z.object({
    labName: text(),
    tagline: text(),
    piName: text(),
    description: text(),
    affiliations: z.array(z.object({ name: text(), url: url() })).min(1),
    /** One or two sentences of thanks shown above the funders on the About page. */
    fundersNote: text(),
    funders: z
      .array(
        z.object({
          name: text(),
          url: url().optional(),
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
    /** Lab profiles elsewhere, shown in the footer and on the About page, in this order. */
    social: z
      .object({
        github: url().optional(),
        scholar: url().optional(),
        linkedin: url().optional(),
        x: url().optional(),
        bluesky: url().optional(),
        mastodon: url().optional(),
      })
      .default({}),
    sectionTitles: sectionTitlesSchema,
    labels: labelsSchema,
    placeholder: placeholder(),
  });

/* --------------------------------------------------------------- members */

export const memberSchema = (image: ImageHelper) =>
  z.object({
    name: text(),
    role: z.enum(ROLES),
    photo: image().optional(),
    /** Text alternative for the photo. Defaults to the person's name. */
    photoAlt: z.string().optional(),
    order: z.number().int().default(100),
    current: z.boolean().default(true),
    /** Alumni only: the confirmed position the person moved on to. Never a pending application. */
    nextPosition: z.string().trim().min(1).optional(),
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
  });

/* -------------------------------------------------------------- projects */

export const projectSchema = (image: ImageHelper) =>
  z.object({
    title: text(),
    summary: text(),
    image: image(),
    imageAlt: text(),
    imageCaption: text(),
    /** Short source shown under the figure, e.g. "Koplev et al., Nat. Immunol. 2026". */
    imageSource: z.string().trim().min(1).optional(),
    /** Full source and any changes made, listed under Figure credits on the About page. */
    imageCredit: z.string().optional(),
    imageLicense: z.enum(LICENSES).optional(),
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
    /** Full source and any changes made, listed under Figure credits on the About page. */
    imageCredit: text(),
    imageLicense: z.enum(LICENSES).optional(),
    blurb: text(),
    order: z.number().int().default(100),
    placeholder: placeholder(),
  });

/* ------------------------------------------------------------- positions */

export const positionSchema = z.object({
  /** Job title as advertised. */
  title: text(),
  /** The advertisement (SciLifeLab, KTH or Varbi page). */
  url: url(),
  /** Last day to apply (YYYY-MM-DD). The position is hidden from builds after this day. */
  deadline: z.coerce.date(),
  /** One or two plain sentences about the position. */
  summary: text(),
  placeholder: placeholder(),
});

/* ----------------------------------------------------------------- pages */

export const aboutSchema = z.object({ title: text(), lede: text(), placeholder: placeholder() });
export const joinSchema = z.object({ title: text(), lede: text(), placeholder: placeholder() });
export const teamSchema = (image: ImageHelper) =>
  z.object({
    /** Group photos, shown at the top of the Team page in this order. Empty: none shown. */
    photos: z
      .array(
        z.object({ image: image(), alt: text(), caption: text(), credit: z.string().optional() }),
      )
      .default([]),
    /** Caption under the line-up graphic shown while there is no group photo. */
    photoPlaceholderCaption: z.string().trim().min(1).optional(),
    placeholder: placeholder(),
  });
export const researchSchema = z.object({ title: text(), lede: text(), placeholder: placeholder() });
export const homeSchema = z.object({
  /** Title of the home page's hero figure (the staining illustration). */
  figureTitle: text(),
  /** One or two sentences explaining the hero figure to a non-specialist. */
  figureCaption: text(),
  /** Text alternative for the hero drawing. */
  figureAlt: text(),
  /** Project slugs to feature on the home page. Empty: all projects by `order`. */
  featuredProjects: z.array(z.string()).default([]),
  /** Highlight ids to feature on the home page. Empty: all highlights by `order`. */
  featuredHighlights: z.array(z.string()).default([]),
  placeholder: placeholder(),
});

export type SectionTitles = z.infer<typeof sectionTitlesSchema>;
export type Labels = z.infer<typeof labelsSchema>;
