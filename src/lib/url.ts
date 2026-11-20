/**
 * Site-relative page paths and the link builder. Every internal link goes
 * through url() so the site works under any BASE_PATH.
 */

export const paths = {
  home: '/',
  research: '/research/',
  project: (slug: string) => `/research/${slug}/`,
  publications: '/publications/',
  team: '/team/',
  news: '/news/',
  about: '/about/',
  /** The Figure credits section of the About page. */
  figureCredits: '/about/#figure-credits',
  join: '/join/',
} as const;

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;
const HAS_EXTENSION = /\.[a-z0-9]{1,5}$/i;

/**
 * Turn a site-relative path into a link under the base path. Page paths get a
 * trailing slash; external URLs, hash links and file paths pass through as they are.
 */
export function makeUrl(base: string): (path: string) => string {
  const root = base.endsWith('/') ? base : `${base}/`;
  return (path: string) => {
    if (EXTERNAL.test(path)) return path;
    const [pathname = '', hash = ''] = path.split(/(?=[?#])/);
    let clean = pathname.replace(/^\/+/, '');
    if (clean !== '' && !HAS_EXTENSION.test(clean) && !clean.endsWith('/')) clean += '/';
    return `${root}${clean}${hash}`;
  };
}

export const url = makeUrl(import.meta.env.BASE_URL);

/** The current page's path relative to the base (e.g. "/team/"), for nav states. */
export function sitePath(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const rel = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '');
  return `/${rel}`.replace(/\/?$/, '/');
}
