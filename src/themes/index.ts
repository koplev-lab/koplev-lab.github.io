/**
 * Theme registry. Keys must match THEME_IDS in ./ids.ts (checked by the
 * `satisfies` clause below).
 */
import type { Theme } from './contract';
import type { ThemeId } from './ids';
import reference from './reference';

export const themes = { reference } satisfies Record<ThemeId, Theme>;

export const themeList: Theme[] = Object.values(themes);
