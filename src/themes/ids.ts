/**
 * Registered theme ids. This list feeds the THEME env enum in astro.config.ts
 * and must match the keys of the registry in src/themes/index.ts.
 * Add an id here when you add a theme folder.
 */
export const THEME_IDS = ['reference', 'figure', 'riso'] as const;

export type ThemeId = (typeof THEME_IDS)[number];
