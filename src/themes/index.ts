/**
 * Theme registry. Keys must match THEME_IDS in ./ids.ts (checked by the
 * `satisfies` clause below).
 */
import type { Theme } from './contract';
import type { ThemeId } from './ids';
import figure from './figure';
import reference from './reference';
import riso from './riso';

export const themes = { reference, figure, riso } satisfies Record<ThemeId, Theme>;

export const themeList: Theme[] = Object.values(themes);
