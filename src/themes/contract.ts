/**
 * The theme contract. A theme is a complete design that renders the view
 * models below. See docs/THEMES.md.
 *
 * Rules (enforced by review and tests):
 * - Never import from astro:content, src/content or src/data.
 * - Every internal link goes through ctx.url().
 * - All visible text comes from the data (site.labels, site.sectionTitles,
 *   site.nav, …), apart from decorative glyphs and numbering.
 * - Render <BaseHead> in <head> and <PreviewBar> first in <body>
 *   (both from src/lib/components/).
 */
import type {
  AboutData,
  HomeData,
  JoinData,
  ProjectData,
  PublicationsData,
  ResearchData,
  SiteData,
  TeamData,
} from '../lib/types';

export interface PreviewInfo {
  themes: { id: string; name: string }[];
  /** Base URL of the /themes/ index. */
  indexUrl: string;
  /** URL of the current page in each theme, keyed by theme id. */
  urls: Record<string, string>;
}

export interface ThemeContext {
  /** Turns a site-relative path into a link. Respects BASE_PATH and the preview prefix. */
  url: (path: string) => string;
  themeId: string;
  site: SiteData;
  /** Site-relative path of the current page (e.g. "/team/"), for active nav states. */
  currentPath: string;
  /** True in `astro dev` and preview mode: show quiet "draft" markers on placeholder content. */
  showDrafts: boolean;
  /** Set only on /themes/<id>/… preview pages. */
  preview: PreviewInfo | null;
}

/** Astro components are typed as functions of their props (the return type is Astro-internal). */
export type AstroComponent<P> = (props: P) => any;

export interface Theme {
  id: string;
  name: string;
  pages: {
    Home: AstroComponent<{ ctx: ThemeContext; data: HomeData }>;
    Research: AstroComponent<{ ctx: ThemeContext; data: ResearchData }>;
    Project: AstroComponent<{ ctx: ThemeContext; data: ProjectData }>;
    Publications: AstroComponent<{ ctx: ThemeContext; data: PublicationsData }>;
    Team: AstroComponent<{ ctx: ThemeContext; data: TeamData }>;
    About: AstroComponent<{ ctx: ThemeContext; data: AboutData }>;
    Join: AstroComponent<{ ctx: ThemeContext; data: JoinData }>;
    NotFound: AstroComponent<{ ctx: ThemeContext }>;
  };
}
