import type { ThemeId } from './themes/ids';

/**
 * Build-level settings. Lab content (names, text, contact) lives in
 * src/content/, not here.
 */

/** Theme used when the THEME env var is not set. Switching the design means changing this one value. */
export const DEFAULT_THEME: ThemeId = 'figure';

/*
 * Inputs that are still unknown (see the Inputs table in PLAN.md).
 * Each one is a clearly named placeholder until the real value is filled in.
 */

/** Used when the SITE_URL env var is not set. Replace with the real URL or custom domain. */
export const PLACEHOLDER_SITE_URL = 'https://todo-github-org.github.io';

/** PI's ORCID iD (form 0000-0000-0000-0000), used by the publications script. */
export const PI_ORCID = '0000-0002-8586-5614';

/** GitHub organization that hosts the repo. */
export const GITHUB_ORG = 'TODO_GITHUB_ORG';

/** Repository name inside GITHUB_ORG. */
export const REPO_NAME = 'TODO_REPO_NAME';
