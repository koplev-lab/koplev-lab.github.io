import type { AuthorView } from './types';

export interface AuthorPart {
  text: string;
  /** True for a lab member (themes usually emphasise these). */
  member: boolean;
}

/**
 * Flatten a shortened author list into text pieces with separators included,
 * so themes can render it without whitespace between elements.
 * `null` entries (omissions) become an ellipsis.
 */
export function authorParts(authors: (AuthorView | null)[], end = '.'): AuthorPart[] {
  const parts: AuthorPart[] = [];
  authors.forEach((a, i) => {
    if (i > 0) parts.push({ text: ', ', member: false });
    parts.push(a === null ? { text: '…', member: false } : { text: a.name, member: a.isMember });
  });
  if (parts.length) parts.push({ text: end, member: false });
  return parts;
}
