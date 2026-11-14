import { paths } from './url';

export type PageKind =
  'home' | 'research' | 'project' | 'publications' | 'team' | 'about' | 'join' | 'notFound';

/** Site-relative path of a page. */
export function pathFor(kind: PageKind, slug?: string): string {
  if (kind === 'project') {
    if (!slug) throw new Error('A project page needs a slug');
    return paths.project(slug);
  }
  return paths[kind];
}
