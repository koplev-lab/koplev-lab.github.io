/**
 * The data layer: the only module that reads content collections and data
 * files. Returns normalized view models (src/lib/types.ts) for themes.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import publicationsFile from '../data/publications.json';
import { paths } from './url';
import type {
  AboutData,
  AuthorView,
  ExternalLink,
  HighlightView,
  HomeData,
  JoinData,
  MemberView,
  NavItem,
  NavKey,
  ProjectData,
  ProjectSummary,
  PublicationsData,
  PublicationView,
  ResearchData,
  SiteData,
  TeamData,
} from './types';
import { ROLES } from './schemas';

/* ----------------------------------------------------------- raw types */

interface RawAuthor {
  name: string;
  orcid?: string;
}
interface RawPublication {
  id: string;
  doi: string | null;
  title: string;
  authors: RawAuthor[];
  venue: string | null;
  year: number;
  date: string;
  type: string;
  oaUrl?: string;
  preprintUrl?: string;
}
const rawPublications = (publicationsFile as { items: RawPublication[] }).items;

/* ------------------------------------------------------------- helpers */

const memo = <T>(fn: () => Promise<T>) => {
  let cached: Promise<T> | undefined;
  return () => (cached ??= fn());
};

const byOrder = <T extends { data: { order: number }; id: string }>(a: T, b: T) =>
  a.data.order - b.data.order || a.id.localeCompare(b.id);

async function single<C extends 'site' | 'home' | 'research' | 'about' | 'join'>(name: C) {
  const [entry] = await getCollection(name);
  if (!entry) throw new Error(`Missing content file for "${name}"`);
  return entry as CollectionEntry<C>;
}

const html = (entry: { rendered?: { html: string } }) => entry.rendered?.html ?? '';

/** Lower-case, strip accents and punctuation: "Bára Vavřinková" → "bara vavrinkova". */
const normName = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/* ---------------------------------------------------------------- site */

const NAV_ORDER: NavKey[] = ['home', 'research', 'publications', 'team', 'about', 'join'];

const logoFiles = import.meta.glob<string>('/src/assets/logo/mark.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export const getSiteData = memo(async (): Promise<SiteData> => {
  const { data: s } = await single('site');
  const nav: NavItem[] = NAV_ORDER.map((key) => ({ key, label: s.nav[key], path: paths[key] }));
  const social: ExternalLink[] = Object.entries(s.social)
    .filter((e): e is [string, string] => typeof e[1] === 'string')
    .map(([kind, href]) => ({ kind, label: kind, href }));
  return {
    labName: s.labName,
    tagline: s.tagline,
    piName: s.piName,
    description: s.description,
    affiliations: s.affiliations,
    funders: s.funders.map((f) => ({
      name: f.name,
      url: f.url,
      ...(f.logo ? { logo: { src: f.logo, alt: f.logoAlt || f.name } } : {}),
    })),
    contact: s.contact,
    nav,
    social,
    sectionTitles: s.sectionTitles,
    labels: s.labels,
    logoSvg: Object.values(logoFiles)[0] ?? null,
    placeholder: s.placeholder,
  };
});

/* ------------------------------------------------------------- members */

export const getMembers = memo(async (): Promise<MemberView[]> => {
  const { labels } = await getSiteData();
  const entries = (await getCollection('members')).sort(byOrder);
  return entries.map(({ id, data: m, ...rest }) => {
    const links: ExternalLink[] = [];
    if (m.orcid)
      links.push({
        kind: 'orcid',
        label: labels.links.orcid,
        href: `https://orcid.org/${m.orcid}`,
      });
    if (m.github)
      links.push({
        kind: 'github',
        label: labels.links.github,
        href: `https://github.com/${m.github.replace(/^@/, '')}`,
      });
    if (m.scholar) links.push({ kind: 'scholar', label: labels.links.scholar, href: m.scholar });
    if (m.website) links.push({ kind: 'website', label: labels.links.website, href: m.website });
    if (m.email)
      links.push({ kind: 'email', label: labels.links.email, href: `mailto:${m.email}` });
    return {
      slug: id,
      name: m.name,
      role: m.role,
      photo: m.photo ? { src: m.photo, alt: m.photoAlt ?? '' } : null,
      bioHtml: html(rest),
      links,
      ...(m.orcid ? { orcid: m.orcid } : {}),
      ...(m.startYear ? { startYear: m.startYear } : {}),
      current: m.current && m.role !== 'Alumni',
      placeholder: m.placeholder,
    };
  });
});

/* -------------------------------------------------------- publications */

/** Mark lab members in an author list: ORCID match first, then normalized full name. */
async function authorMatcher() {
  const members = await getMembers();
  const { piName } = await getSiteData();
  const byOrcid = new Map(members.filter((m) => m.orcid).map((m) => [m.orcid!, m]));
  const byName = new Map(members.map((m) => [normName(m.name), m]));
  const pi = normName(piName);
  return (a: RawAuthor): AuthorView => {
    const m = (a.orcid && byOrcid.get(a.orcid)) || byName.get(normName(a.name));
    return {
      name: a.name,
      isMember: Boolean(m),
      isPI: m ? m.role === 'PI' : normName(a.name) === pi,
      ...(m ? { memberSlug: m.slug } : {}),
    };
  };
}

function briefAuthors(authors: AuthorView[]): (AuthorView | null)[] {
  if (authors.length <= 8) return authors;
  const keep = new Set([0, 1, 2, authors.length - 1]);
  authors.forEach((a, i) => a.isMember && keep.add(i));
  const out: (AuthorView | null)[] = [];
  let last = -1;
  for (const i of [...keep].sort((a, b) => a - b)) {
    if (i !== last + 1) out.push(null);
    out.push(authors[i]!);
    last = i;
  }
  return out;
}

export const getPublications = memo(async (): Promise<PublicationView[]> => {
  const match = await authorMatcher();
  return rawPublications.map((p, i) => {
    const authors = p.authors.map(match);
    return {
      id: p.id,
      number: i + 1,
      doi: p.doi,
      url: p.doi ? `https://doi.org/${p.doi}` : (p.oaUrl ?? null),
      title: p.title,
      authors,
      authorsBrief: briefAuthors(authors),
      authorCount: authors.length,
      venue: p.venue,
      year: p.year,
      date: p.date,
      type: p.type,
      isPreprint: p.type === 'preprint',
      ...(p.oaUrl ? { oaUrl: p.oaUrl } : {}),
      ...(p.preprintUrl ? { preprintUrl: p.preprintUrl } : {}),
    };
  });
});

async function publicationByDoi() {
  const pubs = await getPublications();
  return new Map(pubs.filter((p) => p.doi).map((p) => [p.doi!, p]));
}

export const getHighlights = memo(async (): Promise<HighlightView[]> => {
  const byDoi = await publicationByDoi();
  const entries = (await getCollection('highlights')).sort(byOrder);
  return entries.map(({ id, data: h }, i) => {
    const publication = byDoi.get(h.doi);
    if (!publication)
      throw new Error(
        `Highlight "${id}" points to DOI ${h.doi}, which is not in publications.json. ` +
          `Run "npm run pubs" or add it under "add" in publications.overrides.json.`,
      );
    return {
      id,
      number: i + 1,
      publication,
      figure: { src: h.image, alt: h.imageAlt, credit: h.imageCredit },
      kind: h.imageKind,
      blurb: h.blurb,
      placeholder: h.placeholder,
    };
  });
});

/* ------------------------------------------------------------ projects */

const getProjectEntries = memo(async () => (await getCollection('projects')).sort(byOrder));

export const getProjects = memo(async (): Promise<ProjectSummary[]> =>
  (await getProjectEntries()).map(({ id, data: p }, i) => ({
    slug: id,
    path: paths.project(id),
    number: i + 1,
    title: p.title,
    summary: p.summary,
    figure: {
      src: p.image,
      alt: p.imageAlt,
      caption: p.imageCaption,
      ...(p.imageCredit ? { credit: p.imageCredit } : {}),
    },
    placeholder: p.placeholder,
  })),
);

export async function getProjectSlugs(): Promise<string[]> {
  return (await getProjects()).map((p) => p.slug);
}

export async function getProjectData(slug: string): Promise<ProjectData> {
  const entries = await getProjectEntries();
  const summaries = await getProjects();
  const index = summaries.findIndex((p) => p.slug === slug);
  const entry = entries[index];
  const summary = summaries[index];
  if (!entry || !summary) throw new Error(`Unknown project "${slug}"`);

  const members = await getMembers();
  const bySlug = new Map(members.map((m) => [m.slug, m]));
  const projectMembers = entry.data.members.map((s) => {
    const m = bySlug.get(s);
    if (!m) throw new Error(`Project "${slug}" lists unknown member "${s}"`);
    return m;
  });

  const byDoi = await publicationByDoi();
  const publications = entry.data.publications.map((d) => {
    const p = byDoi.get(d);
    if (!p) throw new Error(`Project "${slug}" lists DOI ${d}, which is not in publications.json`);
    return p;
  });

  return {
    ...summary,
    bodyHtml: html(entry),
    members: projectMembers,
    publications,
    ...(entry.data.repo ? { repo: entry.data.repo } : {}),
    prev: summaries[index - 1] ?? null,
    next: summaries[index + 1] ?? null,
  };
}

/* ----------------------------------------------------------- page data */

export async function getHomeData(): Promise<HomeData> {
  const site = await getSiteData();
  const home = await single('home');
  const about = await single('about');
  const projects = await getProjects();
  const highlights = await getHighlights();
  const pick = <T extends { slug?: string; id?: string }>(all: T[], ids: string[], kind: string) =>
    ids.length === 0
      ? all
      : ids.map((id) => {
          const found = all.find((x) => (x.slug ?? x.id) === id);
          if (!found) throw new Error(`home.md features unknown ${kind} "${id}"`);
          return found;
        });
  return {
    tagline: site.tagline,
    introHtml: html(home),
    figure: {
      title: home.data.figureTitle,
      caption: home.data.figureCaption,
      alt: home.data.figureAlt,
    },
    projects: pick(projects, home.data.featuredProjects, 'project'),
    highlights: pick(highlights, home.data.featuredHighlights, 'highlight'),
    about: { title: about.data.title, lede: about.data.lede, path: paths.about },
    placeholder: home.data.placeholder || site.placeholder,
  };
}

export async function getResearchData(): Promise<ResearchData> {
  const research = await single('research');
  return {
    title: research.data.title,
    lede: research.data.lede,
    introHtml: html(research),
    projects: await getProjects(),
    placeholder: research.data.placeholder,
  };
}

export async function getPublicationsData(): Promise<PublicationsData> {
  const site = await getSiteData();
  const publications = await getPublications();
  const years = new Map<number, PublicationView[]>();
  for (const p of publications) years.set(p.year, [...(years.get(p.year) ?? []), p]);
  return {
    title: site.nav.find((n) => n.key === 'publications')!.label,
    highlights: await getHighlights(),
    publications,
    byYear: [...years].sort((a, b) => b[0] - a[0]).map(([year, items]) => ({ year, items })),
  };
}

export async function getTeamData(): Promise<TeamData> {
  const site = await getSiteData();
  const members = await getMembers();
  const current = members.filter((m) => m.current);
  const rows = ROLES.filter((r) => r !== 'Alumni')
    .map((role) => current.filter((m) => m.role === role))
    .filter((row) => row.length > 0);
  return {
    title: site.nav.find((n) => n.key === 'team')!.label,
    current: rows.flat(),
    rows,
    alumni: members.filter((m) => !m.current),
  };
}

export async function getAboutData(): Promise<AboutData> {
  const site = await getSiteData();
  const about = await single('about');
  return {
    title: about.data.title,
    lede: about.data.lede,
    bodyHtml: html(about),
    affiliations: site.affiliations,
    funders: site.funders,
    placeholder: about.data.placeholder,
  };
}

export async function getJoinData(): Promise<JoinData> {
  const site = await getSiteData();
  const join = await single('join');
  return {
    title: join.data.title,
    lede: join.data.lede,
    bodyHtml: html(join),
    contact: site.contact,
    placeholder: join.data.placeholder,
  };
}
