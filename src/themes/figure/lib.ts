import type { NavItem } from '../../lib/types';

/** Panel letter for a 0-based index: 0 → "a". */
export const letter = (i: number) => String.fromCharCode(97 + i);

export interface PanelRef {
  letter: string;
  desc: string;
}

/**
 * Letters a page's panels in reading order. The same list drives the panel
 * labels and the caption, so every letter is referenced in the caption.
 */
export const panels = (descs: string[]): PanelRef[] =>
  descs.map((desc, i) => ({ letter: letter(i), desc }));

/** Figure number of a page: its section's position in the nav, 1-based; null if none. */
export function figureNumber(nav: NavItem[], currentPath: string): number | null {
  const i = nav.findIndex((n) =>
    n.path === '/' ? currentPath === '/' : currentPath.startsWith(n.path),
  );
  return i >= 0 ? i + 1 : null;
}

/** Ends a caption fragment with a full stop unless it already ends a sentence. */
export const sentence = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);
