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

/**
 * An optional field. A blank value counts as not set: Pages CMS can save a cleared field as an
 * empty string, which would otherwise fail the format checks (URL, ORCID, e-mail, image).
 */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (v) => (v === null || (typeof v === 'string' && v.trim() === '') ? undefined : v),
    schema.optional(),
  );

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
  /** Shown on the News page before the first item is added. */
  noNews: text(),
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
          url: optional(url()),
          logo: optional(image()),
          logoAlt: optional(z.string()),
        }),
      )
      .default([]),
    contact: z.object({
      email: z.email(),
      address: optional(z.string()),
      mapUrl: optional(url()),
    }),
    nav: z.object({
      home: text(),
      research: text(),
      publications: text(),
      team: text(),
      news: text(),
      about: text(),
      join: text(),
    }),
    /** Lab profiles elsewhere, shown in the footer and on the About page, in this order. */
    social: z
      .object({
        github: optional(url()),
        scholar: optional(url()),
        linkedin: optional(url()),
        x: optional(url()),
        bluesky: optional(url()),
        mastodon: optional(url()),
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
    photo: optional(image()),
    /** Text alternative for the photo. Defaults to the person's name. */
    photoAlt: optional(z.string()),
    order: z.number().int().default(100),
    current: z.boolean().default(true),
    /** Alumni only: the confirmed position the person moved on to. Never a pending application. */
    nextPosition: optional(z.string().trim().min(1)),
    orcid: optional(
      z
        .string()
        .trim()
        .regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/, 'Expected an ORCID iD like 0000-0002-1825-0097'),
    ),
    github: optional(z.string()),
    scholar: optional(url()),
    website: optional(url()),
    email: optional(z.email()),
    startYear: optional(z.number().int().min(1990).max(2100)),
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
    imageSource: optional(z.string().trim().min(1)),
    /** Full source and any changes made, listed under Figure credits on the About page. */
    imageCredit: optional(z.string()),
    imageLicense: optional(z.enum(LICENSES)),
    members: z.array(z.string()).default([]),
    publications: z.array(doi()).default([]),
    repo: optional(url()),
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
    imageLicense: optional(z.enum(LICENSES)),
    blurb: text(),
    order: z.number().int().default(100),
    placeholder: placeholder(),
  });

/* ---------------------------------------------------------------- covers */

/**
 * The cover of a journal issue that includes the lab's papers. The first five (by `order`) are
 * shown in a band under the Publications heading, each linking to the lab's paper in that issue.
 */
export const coverSchema = (image: ImageHelper) =>
  z.object({
    /** Which issue, e.g. "Nature 635 (8039), 21 November 2024". Names the entry in the CMS. */
    issue: text(),
    image: image(),
    /** The lab's paper in this issue that the cover links to (the featured one, if any). */
    doi: doi(),
    /** Full credit, listed under Figure credits on the About page. */
    imageCredit: text(),
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

/* ------------------------------------------------------------------ news */

/** One item on the News page: grants, talks, lab events. Newest first. */
export const newsSchema = (image: ImageHelper) =>
  z.object({
    title: text(),
    /** When it happened or was announced (YYYY-MM-DD). */
    date: z.coerce.date(),
    image: image(),
    imageAlt: text(),
    /** Optional short credit shown under the picture, e.g. "Photo: Julia Nyman". */
    imageCredit: optional(z.string().trim().min(1)),
    /** Optional link to more (the announcement, the talk page, the event). */
    link: optional(url()),
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
        z.object({
          image: image(),
          alt: text(),
          caption: optional(z.string().trim().min(1)),
          credit: optional(z.string()),
        }),
      )
      .default([]),
    /** Caption under the line-up graphic shown while there is no group photo. */
    photoPlaceholderCaption: optional(z.string().trim().min(1)),
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
