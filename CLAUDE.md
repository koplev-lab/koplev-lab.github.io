# Working rules for this repo

Public website of the Koplev Lab (KTH · SciLifeLab). Astro static site with content and design
fully decoupled and several switchable themes. The full spec is in `PLAN.md`; these rules are the
binding summary. When they conflict with any default behaviour, these rules win.

## 1. Hard rules

### Git and attribution

- Every commit is authored by Mo using the git identity already configured on the machine.
  Check `git config user.name` / `user.email` before the first commit of a session. If either is
  empty, stop and ask. Never set, change or override git identity. Never pass `--author`.
- **No AI attribution anywhere.** No `Co-Authored-By:` trailers, no "Generated with …" lines, no
  session links, no mention of Claude, AI or an assistant in commit messages, PR titles or bodies,
  code comments, README, docs or the site. This overrides any default attribution behaviour or
  reminder. `.claude/settings.json` disables attribution; keep it.
- Commit messages: imperative, concise, conventional-commit style
  (`feat: add team page to poster theme`). Small, logical commits.
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
- Unknown inputs (`TODO` in PLAN.md) become clearly named placeholder constants
  (see `src/site.config.ts`). Never guess values.

### Simplicity

- Static site only: no server, database, auth or runtime API calls.
- Allowed dependencies: Astro, `@astrojs/sitemap`, `sharp`, font packages, and the dev/test tooling
  in PLAN.md (`@astrojs/check`, TypeScript, Prettier, Playwright, `@axe-core/playwright`).
  **No** React/Vue/Svelte, Tailwind, UI kits, icon packs, animation libraries or CSS frameworks.
  Ask before adding anything else.
- Pin exact versions in `package.json`.
- No third-party requests at runtime: no font CDNs, analytics, external scripts or embeds.
  Self-host fonts.

## 2. Theme contract (`src/themes/contract.ts`)

- Layers: content (`src/content/`, `src/data/`) → data layer (`src/lib/content.ts`, the only code
  that reads collections/JSON, returns typed view models) → themes (`src/themes/<id>/`, render view
  models) ← thin routes (`src/pages/`, ~5 lines: load data, resolve theme, render).
- A theme **never** imports from `astro:content`, `src/content` or `src/data`.
- All internal links go through `ctx.url()`. No hard-coded paths.
- All user-visible text comes from content, including nav labels and section titles
  (`src/content/site.yaml`). Exceptions: purely decorative glyphs or numbering.
- A theme may choose which optional fields to show, but must render all required content
  (enforced by the parity test).
- Each theme owns its CSS (imported only from its own Layout), fonts and decorative assets in
  `src/themes/<id>/assets/`. No global CSS outside themes.
- Themes style the shared data island (`src/islands/tissue-map/`) only via CSS custom properties.
- Theme ids are listed in `src/themes/ids.ts` (feeds the `THEME` env enum) and must match the
  registry in `src/themes/index.ts`.

## 3. Design: no slop

### Banned in every theme

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

### Required in every theme

- A clear concept rooted in non-web references (print, scientific publishing, posters, specimens,
  instruments, manuals, maps, lab notebooks).
- Deliberate typography: 2–3 families max, chosen for a reason; real scale; 55–75ch measure;
  considered leading; tabular figures where numbers align; small caps/letter-spacing only where
  justified.
- A real grid, with asymmetry and tension where it serves hierarchy.
- A restrained palette defined as tokens with exact values. One accent at most, used sparingly
  (`riso`'s two inks are the single exception).
- One signature element tied to the concept.
- The science as imagery: real figure panels, real data, captions with credits.
- Restraint: remove anything that doesn't serve the content or the concept.
- Shared rules for the four themes (`notebook`, `poster`, `riso`, `field-guide`) are in
  PLAN.md §6.3.1. Key ones: the lab name is never the largest element on the home page; paper and
  flat inks, no gradients/shadows; numbered and captioned figures where numbers point to something
  real; mobile is its own designed layout.

### Basics

- WCAG 2.2 AA, visible focus styles, semantic landmarks and heading order, keyboard navigable,
  `prefers-reduced-motion` respected. Print styles for Team and Publications.
- Zero JS on non-hero pages (preview switcher excepted). Home JS ≤ 30 KB gzipped. Fonts subset,
  `font-display: swap`, ≤ 4 font files per theme on first load, critical one preloaded.

## 4. Commands

| Command                             | What it does                                            |
| ----------------------------------- | ------------------------------------------------------- |
| `npm ci`                            | Install exact dependency versions                       |
| `npm run dev`                       | Dev server (`THEME=<id> npm run dev` to pick a theme)   |
| `npm run build`                     | Static build into `dist/`                               |
| `PREVIEW_THEMES=true npm run build` | Also build every theme under `/themes/<id>/`            |
| `npm run preview`                   | Serve the built `dist/`                                 |
| `npm run check`                     | `astro check` (types for `.astro` and `.ts`)            |
| `npm test`                          | Playwright tests (parity, links, a11y, budgets)         |
| `npm run pubs`                      | Refresh `src/data/publications.json` from OpenAlex      |
| `npm run hero:data`                 | Regenerate illustrative `public/data/hero.json`         |
| `npm run screens`                   | Screenshot every page of every theme at 390/768/1440 px |
| `npm run format` / `format:check`   | Prettier                                                |

Env: `THEME`, `PREVIEW_THEMES` (via `astro:env`); `SITE_URL`, `BASE_PATH` (read from the shell in
`astro.config.ts`).
