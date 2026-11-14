/**
 * Site-relative page paths and the URL builder behind ctx.url().
 */

export const paths = {
  home: '/',
  research: '/research/',
  project: (slug: string) => `/research/${slug}/`,
  publications: '/publications/',
  team: '/team/',
  about: '/about/',
  join: '/join/',
  notFound: '/404/',
} as const;

/** Prefix under which preview mode renders each theme. */
export const previewPrefix = (themeId: string) => `themes/${themeId}/`;

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;
const HAS_EXTENSION = /\.[a-z0-9]{1,5}$/i;

/**
 * Build a url() function for a given base path (import.meta.env.BASE_URL) and
 * optional preview prefix. Page paths get a trailing slash; external URLs,
 * hash links and file paths pass through unchanged (files skip the preview prefix).
 */
export function makeUrl(base: string, prefix = ''): (path: string) => string {
  const root = base.endsWith('/') ? base : `${base}/`;
  return (path: string) => {
    if (EXTERNAL.test(path)) return path;
    const [pathname = '', hash = ''] = path.split(/(?=[?#])/);
    let clean = pathname.replace(/^\/+/, '');
    if (HAS_EXTENSION.test(clean)) return `${root}${clean}${hash}`;
    if (clean !== '' && !clean.endsWith('/')) clean += '/';
    return `${root}${prefix}${clean}${hash}`;
  };
}
