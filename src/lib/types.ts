/**
 * View models: the typed, normalized data the pages render.
 * Produced only by src/lib/content.ts; pages and components import types
 * from here, never from astro:content or the content files.
 *
 * `path` fields are site-relative page paths (e.g. "/research/x/"); turn
 * them into links with url(path) from src/lib/url.ts.
 */
import type { ImageMetadata } from 'astro';
import type { Labels, License, Role, SectionTitles } from './schemas';

export type { Labels, License, Role, SectionTitles };

export interface Img {
  src: ImageMetadata;
  alt: string;
}

export interface Figure extends Img {
  caption?: string;
  /** Short source shown with the figure, e.g. "Koplev et al., Nat. Immunol. 2026". */
  credit?: string;
}

/** One entry in the Figure credits list: full source, changes made and licence. */
export interface FigureCredit {
  /** Where the figure appears on this site. */
  usedOn: { title: string; path: string };
  credit: string;
  license?: { name: License; url: string };
}

export interface ExternalLink {
  kind: string;
  label: string;
  href: string;
}

export type NavKey = 'home' | 'research' | 'publications' | 'team' | 'news' | 'about' | 'join';

export interface NavItem {
  key: NavKey;
  label: string;
  path: string;
}

export interface SiteData {
  labName: string;
  tagline: string;
  piName: string;
  description: string;
  affiliations: { name: string; url: string }[];
  fundersNote: string;
  funders: { name: string; url?: string; logo?: Img }[];
  contact: { email: string; address?: string; mapUrl?: string };
  nav: NavItem[];
  social: ExternalLink[];
  sectionTitles: SectionTitles;
  labels: Labels;
  /** Inline SVG markup of the lab mark (uses currentColor), or null until src/assets/logo/mark.svg exists. */
  logoSvg: string | null;
  placeholder: boolean;
}

/* --------------------------------------------------------- publications */

export interface AuthorView {
  name: string;
  isMember: boolean;
  isPI: boolean;
  memberSlug?: string;
}

export interface PublicationView {
  id: string;
  /** Position in the full reference list, 1 = newest. Stable. */
  number: number;
  doi: string | null;
  /** Canonical link: the DOI resolver, or the open-access copy if there is no DOI. */
  url: string | null;
  title: string;
  authors: AuthorView[];
  /**
   * Shortened author list: first three, every lab member, and the last author.
   * `null` marks an omission (render as an ellipsis or `labels.etAl`).
   */
  authorsBrief: (AuthorView | null)[];
  authorCount: number;
  venue: string | null;
  year: number;
  date: string;
  type: string;
  isPreprint: boolean;
  oaUrl?: string;
  preprintUrl?: string;
}

export interface HighlightView {
  id: string;
  /** Figure number among highlights, 1-based, in `order`. */
  number: number;
  publication: PublicationView;
  figure: Figure;
  kind: 'figure' | 'cover';
  blurb: string;
  placeholder: boolean;
}

/* ---------------------------------------------------------------- people */

export interface MemberView {
  slug: string;
  name: string;
  role: Role;
  photo: Img | null;
  bioHtml: string;
  links: ExternalLink[];
  orcid?: string;
  startYear?: number;
  current: boolean;
  /** Alumni: the confirmed position they moved on to. */
  nextPosition?: string;
  placeholder: boolean;
}

/* ---------------------------------------------------------------- covers */

/** A journal cover featuring the lab's work, shown as a decorative band (no alt text). */
export interface CoverView {
  id: string;
  src: ImageMetadata;
  /** The lab's paper in the issue: the cover links to it and is named by its title. */
  publication: PublicationView;
  placeholder: boolean;
}

/* ------------------------------------------------------------- positions */

export interface PositionView {
  slug: string;
  title: string;
  url: string;
  /** Closing date, ISO (YYYY-MM-DD), for <time datetime>. */
  deadline: string;
  /** Closing date as text, e.g. "29 November 2026". */
  deadlineText: string;
  summary: string;
  placeholder: boolean;
}

/* ------------------------------------------------------------------ news */

export interface NewsItemView {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD), for <time datetime>. */
  date: string;
  /** The date as text, e.g. "20 November 2026". */
  dateText: string;
  /** The picture, with its optional credit. */
  figure: Figure;
  bodyHtml: string;
  link?: string;
  placeholder: boolean;
}

/* -------------------------------------------------------------- projects */

export interface ProjectSummary {
  slug: string;
  path: string;
  /** 1-based position in `order`. */
  number: number;
  title: string;
  summary: string;
  figure: Figure;
  placeholder: boolean;
}

/* ------------------------------------------------------------ page data */

export interface HomeData {
  tagline: string;
  introHtml: string;
  /** The hero figure: title, plain caption and text alternative. */
  figure: { title: string; caption: string; alt: string };
  projects: ProjectSummary[];
  highlights: HighlightView[];
  /** News items that rotate on the home page (empty: no news block). */
  news: NewsItemView[];
  newsPath: string;
  about: { title: string; lede: string; path: string };
  /** Advertised positions still open at build time. */
  positions: PositionView[];
  joinPath: string;
  placeholder: boolean;
}

export interface ResearchData {
  title: string;
  lede: string;
  introHtml: string;
  projects: ProjectSummary[];
  placeholder: boolean;
}

export interface ProjectData extends ProjectSummary {
  bodyHtml: string;
  members: MemberView[];
  publications: PublicationView[];
  repo?: string;
  prev: ProjectSummary | null;
  next: ProjectSummary | null;
}

export interface PublicationsData {
  title: string;
  highlights: HighlightView[];
  /** Journal covers in the band under the heading, in `order` (at most five). */
  covers: CoverView[];
  publications: PublicationView[];
  byYear: { year: number; items: PublicationView[] }[];
}

export interface TeamData {
  title: string;
  /**
   * Current members in role order (most senior first, then by `order`). The Team page fills them
   * straight across the grid, without role headings or a new row per role.
   */
  current: MemberView[];
  alumni: MemberView[];
  /** Group photos (empty until the lab adds some). */
  photos: Figure[];
  /** Caption for the line-up graphic shown while `photos` is empty. */
  photoPlaceholderCaption?: string;
  placeholder: boolean;
}

export interface NewsData {
  title: string;
  /** Newest first. */
  items: NewsItemView[];
}

export interface AboutData {
  title: string;
  lede: string;
  bodyHtml: string;
  affiliations: SiteData['affiliations'];
  fundersNote: string;
  funders: SiteData['funders'];
  credits: FigureCredit[];
  placeholder: boolean;
}

export interface JoinData {
  title: string;
  lede: string;
  bodyHtml: string;
  contact: SiteData['contact'];
  /** Advertised positions still open at build time. */
  positions: PositionView[];
  placeholder: boolean;
}
