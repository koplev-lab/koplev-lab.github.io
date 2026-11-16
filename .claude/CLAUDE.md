# Working rules for this repo

Public website of the Koplev Lab (KTH · SciLifeLab). Astro static site with content and design
decoupled: content in `src/content/`, one design on top. The original spec is `docs/PLAN.md` (its
multi-theme parts are superseded: the site has a single design); these rules are the binding
summary. When they conflict with any default behaviour, these rules win.

## 1. Hard rules

### Git and attribution

- Commit messages: imperative, concise, conventional-commit style
  (`feat: add team page`). Small, logical commits.
- Do not push, create PRs or repos, change GitHub settings or enable Pages unless Mo explicitly
  says so in the current session. Prepare everything and tell him what to run or click.
- One branch per phase (`phase-1-content`, `phase-2-themes`, …) unless Mo says otherwise.
- End each phase by running the checks, committing, and stopping with a short report: what was
  done, decisions and why, open `TODO` inputs, what is needed from Mo. Wait for "go".

### Truthfulness of content

- Never invent lab members, publications, projects, grants, numbers, quotes, awards or
  collaborations.
- Drafts may only be derived from public sources (the SciLifeLab page, abstracts of Simon's real
  publications). Every drafted file has `placeholder: true` in its frontmatter until Simon
  approves it.
- Placeholder people get a neutral geometric placeholder graphic. Never stock photos or generated
  faces.
- Illustrative or synthetic data is labelled as illustrative in the UI until real data replaces it.
- Unknown inputs (`TODO` in docs/PLAN.md) become clearly named placeholder constants
  (see `src/site.config.ts`). Never guess values.

### Simplicity

- Static site only: no server, database, auth or runtime API calls.
- Allowed dependencies: Astro, `@astrojs/sitemap`, `sharp`, font packages, and the dev/test tooling
  in docs/PLAN.md (`@astrojs/check`, TypeScript, Prettier, Playwright, `@axe-core/playwright`).
  **No** React/Vue/Svelte, Tailwind, UI kits, icon packs, animation libraries or CSS frameworks.
  Ask before adding anything else.
- Pin exact versions in `package.json`.
- No third-party requests at runtime: no font CDNs, analytics, external scripts or embeds.
  Self-host fonts.

## 2. Structure

- Layers: content (`src/content/`, `src/data/`) → data layer (`src/lib/content.ts`, the only code
  that reads collections/JSON, returns typed view models from `src/lib/types.ts`) → pages
  (`src/pages/`) built from `src/layouts/Layout.astro` and `src/components/`.
- Pages and components **never** import from `astro:content`, `src/content` or `src/data`.
- All internal links go through `url()` from `src/lib/url.ts`. No hard-coded paths.
- All user-visible text comes from content, including nav labels and section titles
  (`src/content/site.yaml`). Exceptions: purely decorative glyphs or numbering.
- Pages must render all required content (enforced by `tests/content.spec.ts`).
- Global CSS lives only in `src/styles/` (imported by the Layout); everything else is scoped
  component CSS. The hero animation (`src/components/StainingRun.astro`) is styled only via its
  `--hero-*` custom properties.

## 3. Design: no slop

### Banned

- Purple/indigo or blue-to-pink gradients; gradient text; mesh or blob backgrounds;
  glassmorphism; neon glows; dark mode as the default "tech" signal.
- Fonts: Inter, Roboto, Open Sans, Poppins, Montserrat, Lato, Space Grotesk, DM Sans,
  Plus Jakarta Sans, Manrope, Outfit, Bricolage Grotesque, Fraunces, Instrument Serif,
  Playfair Display, JetBrains Mono, Fira Code.
- Default Tailwind palette look (slate/zinc/indigo), `rounded-2xl` cards with soft shadows, pill
  buttons everywhere.
- The SaaS hero (giant centred headline + subheading + two CTAs + floating screenshot).
- Three-column feature grids with an icon above each title. Icon packs and emoji as decoration.
- Fade-up-on-scroll, parallax, animated counters, fake stats.
- Generic illustration: DNA helices, glowing neural nets, "data" particles, stock lab photos,
  generated imagery.
- Everything centred; uniform spacing everywhere; symmetric layouts by default.
- Marketing copy: cutting-edge, leverage, unlock, empower, revolutionize, seamless, harness,
  at the intersection of, pioneering, world-class, passionate about, journey, dive into.
  UI microcopy is plain ("Publications").

### Required

- A clear concept rooted in non-web references (print, scientific publishing, posters, specimens,
  instruments, manuals, maps, lab notebooks).
- Deliberate typography: 2–3 families max, chosen for a reason; real scale; 55–75ch measure;
  considered leading; tabular figures where numbers align; small caps/letter-spacing only where
  justified.
- A real grid, with asymmetry and tension where it serves hierarchy.
- A restrained palette defined as tokens with exact values. One accent at most, used sparingly.
- One signature element tied to the concept.
- The science as imagery: real figure panels, real data, captions with credits.
- Restraint: remove anything that doesn't serve the content or the concept.
- The design brief (two-ink risograph zine) and the decisions made while building it are in
  `docs/DESIGN.md`. Key rules: the lab name is never the largest element on the home page; flat
  colour, no gradients, shadows, transparency or blur (except the multiply overprint); every
  number, letter, grid reference or call number points to something real; mobile is its own
  designed layout.

### Basics

- WCAG 2.2 AA, visible focus styles, semantic landmarks and heading order, keyboard navigable,
  `prefers-reduced-motion` respected. Print styles for Team and Publications.
- Zero JS on non-home pages. Home JS ≤ 30 KB gzipped. Fonts subset,
  `font-display: swap`, ≤ 4 font files on first load, critical one preloaded.

## 4. Commands

| Command                           | What it does                                                                                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                          | Install exact dependency versions                                                                                                                    |
| `npm run dev`                     | Dev server                                                                                                                                           |
| `npm run clean`                   | Delete Astro's caches and `dist/`. Run it (dev server stopped) after changing `src/lib/schemas.ts` or `src/content.config.ts`: Astro reuses old data |
| `npm run build`                   | Static build into `dist/`                                                                                                                            |
| `npm run preview`                 | Serve the built `dist/`                                                                                                                              |
| `npm run check`                   | `astro check` (types for `.astro` and `.ts`)                                                                                                         |
| `npm test`                        | Build under `/base-test/`, then all Playwright tests                                                                                                 |
| `npm run test:only`               | Re-run the tests against the existing `dist/`                                                                                                        |
| `npm run pubs`                    | Refresh `src/data/publications.json` from OpenAlex                                                                                                   |
| `npm run screens`                 | Screenshot every page at 390/768/1440 px into `screenshots/`                                                                                         |
| `npm run format` / `format:check` | Prettier                                                                                                                                             |

Env: `SITE_URL`, `BASE_PATH` (read from the shell in `astro.config.ts`).
