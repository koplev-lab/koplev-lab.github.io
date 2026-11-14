# Lab Website: Implementation Plan for Claude Code

> **For Mo, before starting:**
> 1. Fill in the **Inputs** table below.
> 2. Put this file in the root of the (empty) repo as `PLAN.md`.
> 3. Create `.claude/settings.json` yourself, with the content shown in §1.1, before the first session.
> 4. Start Claude Code in the repo and say: *"Read PLAN.md and execute Phase 0."*

---

## Inputs

| Key | Value | Notes |
|---|---|---|
| `LAB_NAME` | Koplev Lab | Display name; confirm with Simon |
| `PI_NAME` | Simon Koplev | |
| `PI_ORCID` | `TODO` | Needed for the publications pipeline |
| `GITHUB_ORG` | `TODO` | The organization already exists |
| `REPO_NAME` | `TODO` | e.g. `website`, or `<org>.github.io` for root hosting |
| `SITE_URL` | `TODO` | Custom domain if any; otherwise `https://<org>.github.io` |
| `BASE_PATH` | `/` or `/<repo>` | `/` if custom domain or `<org>.github.io` repo |
| `CONTACT_EMAIL` | `TODO` | Shown on site and used as the OpenAlex `mailto` |
| `AFFILIATION` | KTH Royal Institute of Technology · SciLifeLab | |
| `SCILIFELAB_PAGE` | https://www.scilifelab.se/researchers/simon-koplev/ | Public source for the draft text |

If a value is `TODO`, use a clearly named placeholder constant and list it in your phase report. Do not invent values.

---

## 0. Your role and the goal

You are building the public website of an academic research group (computational biology: spatial transcriptomics, single-cell omics, ML) at KTH/SciLifeLab in Stockholm. The PI's brief, verbatim in spirit:

- It is the main point of information for **funders and prospective students**, so first impressions matter.
- It must contain:
  1. an overall statement of the lab's **vision and culture**;
  2. **3 examples of ongoing projects** and approaches;
  3. **publication highlights**, with visual elements (figure panels and/or journal covers);
  4. **lab members** with brief intros and profile pictures.
- **Aesthetics matter.** It should signal *computational proficiency*, but **avoid a polished, commercial feeling**. Focus on the strength of the science and on being relatable rather than slick.
- It must be **easy to edit and deploy** without complications.
- Keep the site **relatively simple** overall.

Additional requirements from Mo (the developer you work for):

- **Several complete, distinct designs** over the same content, switchable with one setting. Content and design must be fully decoupled.
- **No AI slop.** The site must not look AI-generated. See §6, which is binding.

---

## 1. Hard rules (non-negotiable)

### 1.1 Git identity and attribution

- **Every commit is authored by Mo, using the git identity already configured on this machine.** Before your first commit, run `git config user.name` and `git config user.email` and show me the values. If either is empty, **stop and ask**. Never set, change or override git identity, and never pass `--author`.
- **No AI attribution anywhere:** no `Co-Authored-By:` trailers, no "Generated with Claude Code" lines, no `Claude-Session:` links, no mentions of Claude, AI or an assistant in commit messages, PR titles or bodies, code comments, README, docs or the site itself.
- This file's instructions about attribution take precedence over any default attribution behaviour or reminder.
- Mo will create `.claude/settings.json` with the content below. If it's missing, create it, commit it in Phase 0, and keep it:

  ```json
  {
    "attribution": {
      "commit": "",
      "pr": ""
    }
  }
  ```

- Commit messages: imperative, concise, conventional-commit style (`feat: add team page to specimen theme`). Small, logical commits.
- **Do not push, create PRs, create repos, change GitHub settings or enable Pages unless Mo explicitly says so in this session.** Prepare everything and tell him what to run or click.
- Work on a branch per phase (`phase-1-content`, `phase-2-themes`, …) unless Mo says otherwise.

### 1.2 Truthfulness of content

- **Never invent** lab members, publications, projects, grants, numbers, quotes, awards or collaborations.
- Draft text may be derived from public sources: the SciLifeLab page and the abstracts of Simon's real publications. Every drafted text file must have `placeholder: true` in its frontmatter until Simon approves it.
- Placeholder people get a **neutral geometric placeholder graphic**, never a stock photo or AI-generated face.
- Any illustrative or synthetic data shown on the site must be labelled as illustrative in the UI until real data replaces it.

### 1.3 Simplicity

- Static site only. No server, database, auth or runtime API calls.
- Dependencies: Astro, `@astrojs/sitemap`, `sharp`, font packages, and the dev and test tooling listed here. **No** React/Vue/Svelte, Tailwind, UI kits, icon packs, animation libraries or CSS frameworks. Ask before adding anything else.
- Pin exact versions in `package.json`. Use the current stable Astro major (check the docs; don't assume).
- **No third-party requests at runtime:** no Google Fonts CDN (an EU/GDPR issue), no analytics, no external scripts or embeds. Self-host fonts.

---

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Astro (static output), TypeScript strict |
| Content | Astro content collections (Markdown + YAML), Zod schemas |
| Admin UI | Pages CMS (`.pages.yml`), git-based, no backend |
| Publications | Build-independent script pulling from the OpenAlex API → committed JSON |
| Interactivity | One vanilla-TS island (the data hero); everything else is zero-JS |
| Hosting | GitHub Pages via GitHub Actions, in the existing org |
| Tests | Playwright (screenshots, parity, a11y via `@axe-core/playwright`), `astro check` |

---

## 3. Architecture: content and design fully decoupled

This is the core of the project. Get it right before any styling.

### 3.1 Layers

```
content/ (Markdown, YAML)  ──►  src/lib/content.ts  ──►  view models (typed)
                                                           │
                         src/pages/*  (thin routes)  ──────┤ pick theme
                                                           ▼
                              src/themes/<id>/  (complete design: layout,
                              components, CSS, fonts, decorative assets)
```

- **Content layer** (`src/content/`, `src/data/`): pure data, no presentation.
- **Data layer** (`src/lib/content.ts`): the only code that reads collections and JSON. It returns normalized, typed **view models** (`HomeData`, `ResearchData`, `PublicationsData`, `TeamData`, `AboutData`, `JoinData`, `SiteData`). It handles sorting, joining highlights to publications, bolding member names in author lists, and filtering current vs alumni.
- **Theme layer** (`src/themes/<id>/`): receives view models as props and renders them. A theme **never** imports from `astro:content`, `src/content` or `src/data`. Themes are free to differ *completely*: layout, structure, typography, colour, navigation pattern, what goes on the home page and in which order.
- **Routes** (`src/pages/`): about 5 lines each. Load data, resolve the theme, render the theme's page component.

### 3.2 The theme contract

Define it in `src/themes/contract.ts`:

```ts
export interface ThemeContext {
  url: (path: string) => string;   // respects BASE_PATH and preview prefix
  themeId: string;
  site: SiteData;                  // lab name, nav labels, contact, affiliations, funders
}

export interface Theme {
  id: string;
  name: string;
  pages: {
    Home: AstroComponent<{ ctx: ThemeContext; data: HomeData }>;
    Research: AstroComponent<{ ctx: ThemeContext; data: ResearchData }>;
    Project: AstroComponent<{ ctx: ThemeContext; data: ProjectData }>;
    Publications: AstroComponent<{ ctx: ThemeContext; data: PublicationsData }>;
    Team: AstroComponent<{ ctx: ThemeContext; data: TeamData }>;
    About: AstroComponent<{ ctx: ThemeContext; data: AboutData }>;
    Join: AstroComponent<{ ctx: ThemeContext; data: JoinData }>;
    NotFound: AstroComponent<{ ctx: ThemeContext }>;
  };
}
```

Rules for themes:

- All internal links go through `ctx.url()`. No hard-coded paths.
- **All user-visible text comes from content**, including nav labels and section titles, which live in `src/content/site.yaml`. The only exceptions are purely decorative glyphs or numbering.
- A theme may choose *which* optional fields to show and how, but it must render all **required content** (see the parity test in §8).
- Each theme owns its CSS (imported only from its own Layout), fonts, and decorative assets in `src/themes/<id>/assets/`. No global CSS outside themes.
- Themes style the shared data island only through CSS custom properties (§6.6).

### 3.3 Theme selection and preview mode

- The registry `src/themes/index.ts` maps id → `Theme`.
- The active theme comes from the `THEME` env var (use `astro:env` with an enum of registered ids), defaulting to the value in `src/site.config.ts`. **Switching the design means changing one value.**
- **Preview mode** (`PREVIEW_THEMES=true`): additionally generate every page under `/themes/<id>/…` for every registered theme, plus a `/themes/` index page listing them. Preview pages get `<meta name="robots" content="noindex">` and a small, unobtrusive theme switcher that is not part of any theme and is styled minimally and neutrally. This is how Simon compares designs side by side on the live URL during the design phase.
- Write `docs/THEMES.md` explaining how to create a new theme by copying the reference theme (§5.1) and implementing the contract.

### 3.4 Directory layout

```
.
├── .claude/settings.json
├── .github/workflows/{deploy.yml,publications.yml,ci.yml}
├── .pages.yml
├── CLAUDE.md
├── PLAN.md
├── README.md
├── docs/{THEMES.md,EDITING.md,DEVELOPING.md}
├── public/
│   ├── images/{team,projects,publications}/   # CMS uploads
│   ├── data/hero.json
│   └── CNAME                                 # only if custom domain
├── scripts/
│   ├── fetch-publications.mjs
│   ├── make-hero-data.mjs                    # illustrative data
│   ├── anndata_to_hero.py                    # real data from .h5ad
│   └── optimize-images.mjs
├── src/
│   ├── assets/logo/{mark.svg,favicon.svg}        # shared logo, supplied by Mo (§6.7)
│   ├── content/
│   │   ├── site.yaml
│   │   ├── members/*.md
│   │   ├── projects/*.md
│   │   ├── highlights/*.md
│   │   └── pages/{about.md,join.md,home.md}
│   ├── data/{publications.json,publications.overrides.json}
│   ├── content.config.ts
│   ├── lib/{content.ts,types.ts,url.ts}
│   ├── islands/tissue-map/                   # shared data hero
│   ├── themes/
│   │   ├── contract.ts
│   │   ├── index.ts
│   │   ├── reference/                        # unstyled semantic baseline
│   │   ├── atlas/{DESIGN.md,Layout.astro,pages/,components/,styles/,assets/}
│   │   ├── slide/…
│   │   ├── card-index/…
│   │   └── figure/…
│   ├── pages/                                # thin routes + preview routes
│   └── site.config.ts
└── tests/
```

---

## 4. Content model

### 4.1 Collections (`src/content.config.ts`)

Use the glob loader and Zod schemas. Minimum fields:

- **site.yaml** (single file): `labName`, `tagline` (one plain sentence), `piName`, `affiliations[] {name, url}`, `funders[] {name, url, logo?}`, `contact {email, address, mapUrl?}`, `nav {home, research, publications, team, about, join}` labels, `social {github?, bluesky?, mastodon?, linkedin?}`, `sectionTitles {…}`.
- **members**: `name`, `role` (enum: PI, Postdoc, PhD student, Research engineer, Research assistant, Master student, Visiting, Alumni), `photo`, `order`, `current` (bool), `orcid?`, `github?`, `scholar?`, `website?`, `email?`, `startYear?`, `placeholder?`; body = bio (2–4 sentences).
- **projects**: `title`, `summary` (one sentence), `image`, `imageCaption`, `imageCredit?`, `members[]` (member slugs), `publications[]` (DOIs), `repo?`, `order`, `placeholder?`; body = longer description (question, approach, why it matters).
- **highlights**: `doi`, `image`, `imageKind` (figure | cover), `imageCredit`, `blurb` (1–2 sentences, plain language), `order`.
- **pages/about.md**: vision and culture. Body in Markdown; frontmatter `title`, `lede`, `placeholder`.
- **pages/join.md**: open positions and how to reach out.
- **pages/home.md**: optional short intro paragraph; which projects and highlights to feature (or default to `order`).

`placeholder: true` files are rendered normally, but in `astro dev` and preview mode they get a small, visually quiet "draft" marker. The build prints a list of placeholder files.

### 4.2 Images

Prefer Astro's image optimization (`image()` schema helper, `<Picture>` with AVIF/WebP and responsive sizes) **if** you can make Pages CMS write paths that Astro resolves. Test it. If not, store uploads in `public/images/` and run `scripts/optimize-images.mjs` (sharp) in CI to cap dimensions (2400px long edge) and generate WebP variants. Document the choice and the reason in `docs/DEVELOPING.md`.

All images need meaningful `alt` text. Make alt a required field in the schemas and the CMS.

---

## 5. Publications pipeline

1. `scripts/fetch-publications.mjs`:
   - Query OpenAlex `works` filtered by `author.orcid:${PI_ORCID}`, with cursor pagination and the `mailto` param.
   - Normalize to `{ id, doi, title, authors[{name, orcid?}], venue, year, date, type, oaUrl?, preprintOf? }`.
   - Exclude paratext, errata, peer reviews and similar non-article types.
   - Deduplicate a preprint against its published version (normalized-title match). Keep the published version and attach the preprint link.
   - Apply `publications.overrides.json`: `hide[]` (DOIs), `fix{doi: partial}`, `add[]` (manual entries).
   - Write `src/data/publications.json`, sorted by date descending, with stable formatting so diffs stay small.
   - **On network failure: exit non-zero and leave the existing file untouched.** The site build must never depend on the network.
2. `.github/workflows/publications.yml`: weekly cron plus manual dispatch. Run the script and commit only if the file changed, as `github-actions[bot]`.
3. The data layer joins highlights to publications by DOI and marks lab members in author lists by ORCID match first, then name match.

---

## 6. Design (binding)

### 6.1 What "no AI slop" means here

The output must look like it was made by a person with taste and a point of view. **Banned** in every theme:

- Purple, indigo or blue-to-pink gradients; gradient text; mesh or blob backgrounds; glassmorphism; neon glows; dark mode as the default "tech" signal.
- Inter, Roboto, Open Sans, Poppins, Montserrat, Lato, Space Grotesk, DM Sans, Plus Jakarta Sans, Manrope, Outfit, Bricolage Grotesque, Fraunces, Instrument Serif, Playfair Display, JetBrains Mono, Fira Code. These are the fingerprints of generated sites.
- The default Tailwind palette look (slate/zinc/indigo), `rounded-2xl` cards with soft drop shadows, pill buttons everywhere.
- The SaaS hero: giant centered headline + subheading + two CTA buttons + floating screenshot.
- Three-column "feature" grids with an icon above each title. Icon packs (Lucide, Heroicons, Font Awesome) and emoji as decoration.
- Fade-up-on-scroll for every element, parallax, animated counters, fake stats ("50+ publications!").
- Generic illustration: DNA helices, glowing neural networks, abstract "data" particles, stock lab photos, AI-generated imagery.
- Everything centered. Uniform spacing everywhere. Symmetric layouts by default.
- Marketing copy: *cutting-edge, leverage, unlock, empower, revolutionize, seamless, harness, at the intersection of, pioneering, world-class, passionate about, journey, dive into*. UI microcopy is plain: "Publications", not "Explore our research output".

**Required** in every theme:

- A clear concept rooted in **non-web references**: print, scientific publishing, posters, typography specimens, instruments, technical manuals, maps, lab notebooks.
- **Deliberate typography**: at most 2–3 families, chosen for a reason, with a real typographic scale, proper measure (55–75ch for text), considered leading, tabular figures where numbers align, real small caps or letter-spacing only where justified.
- **A real grid**, with asymmetry and tension where it serves hierarchy.
- **A restrained palette** with exact values, defined as tokens. One accent at most, used sparingly.
- **One signature element** that makes the theme memorable and is tied to the concept.
- **The science as imagery**: real figure panels, real data, captions with credits. The decoration is the content.
- Restraint: if an element doesn't serve the content or the concept, remove it.

### 6.2 Process per theme

1. Write `src/themes/<id>/DESIGN.md` **before any code**:
   - concept in one sentence;
   - 3–5 concrete references (named publications, posters, designers, objects), with what is taken from each;
   - typefaces, with the reason and the license (must be self-hostable: OFL or similar);
   - grid and breakpoints;
   - colour tokens with hex values and contrast ratios;
   - the signature element;
   - how the home page is structured and why;
   - what this theme explicitly refuses to do.
2. **Stop after all briefs are written** and present them together, so Mo can redirect cheaply.
3. Build. If a `frontend-design` skill is available, read and follow it.
4. **Review loop** (at least 2 rounds per theme): run the site, use Playwright to screenshot every page at 390px, 768px and 1440px widths into `tests/screenshots/<theme>/`, view them, then critique each against §6.1 and the brief in writing (`tests/screenshots/<theme>/REVIEW.md`). Fix the issues and repeat. Be harsh: would a design-literate scientist believe a person made this?
5. Check that the four themes are clearly **different from each other** in concept, typography, layout and navigation, not recolours of one layout.

### 6.3 Design direction

**Built:** `riso` (the default) and `figure`. **Briefs only, not built:** `atlas`, `slide`,
`card-index`. Mo chose `riso` to build first.

The briefed themes are `riso`, `atlas`, `slide`, `card-index` and `figure`. Each is grounded in the lab's own
material (spatial maps of tissue, the glass slides its data comes from, the way scientific
knowledge is filed, and the figures it publishes). Their full briefs are in
`src/themes/<id>/DESIGN.md`; those briefs are binding for Phase 3. The earlier directions
(`notebook`, `poster`, `field-guide`, `specimen`, `instrument`) are not built.

#### 6.3.1 Shared rules (all themes)

What the themes have in common: each is an object or document that scientists make or use
themselves (a map sheet, a labelled slide, a catalogue card, a journal figure). None of them is
corporate. Carry that into every theme:

1. **The science is the hero, not the name.** The lab name is never the largest element on the home page. The largest thing is either a plain sentence about the science (`tagline`) or a figure. No giant all-caps lab name in any theme. Mo's feedback on an earlier preview: an oversized "KOPLEV LAB" read as commercial.
2. **Paper and ink.** Design each theme as a physical, printed object: one ground colour plus a small, named set of inks (text ink included). Flat colour only. No gradients, shadows, transparency or blur effects.
3. **Numbered, keyed and captioned.** Figures, panels and references are numbered or lettered. Every image has a caption and a credit. A number, letter, grid reference or call number must point to something real, never act as decoration.
4. **One plain takeaway.** Write `tagline` as one sentence, in plain language, that both a funder and a prospective student understand. Treat each project's `summary` the same way.
5. **People shown warmly and consistently.** Each theme gives team photos one consistent treatment (same crop ratio, same framing). Placeholder people (§1.2) get the same frame with the theme's geometric placeholder.
6. **Hand-made, not sloppy.** Imperfection only where the reference has it, and only on images and fills. Never on text legibility, alignment or spacing.
7. **Mobile is its own layout.** Collars, slide labels, card stacks and panel mosaics each need a designed narrow version (specified in each brief).
8. **One logo everywhere** (§6.7). The mark stays the same across themes; it takes the theme's ink and sits next to the lab name set in the theme's own typeface.

#### 6.3.2 The four themes (summary; see each DESIGN.md)

- **`riso`**: a two-ink risograph zine. Chivo + Chivo Mono. Paper `#F6F4EE`, Fluorescent Pink `#FF48B0` and Blue `#0078BF`, overprinting to `#002284` (used for running text). The two inks carry type, rules, fills and placeholders; figures and photos keep their original colours. Navigation: a contents column.
- **`atlas`**: a topographic map sheet. Spectral + Spectral SC. The map face carries the science; the collar carries title, legend, sources and the adjoining-sheets diagram as navigation. Signature: the map collar with real grid references.
- **`slide`**: the glass slide and its label. Archivo (width axis: condensed for labels, normal for text). Every image sits on a slide with a frosted label end; the data figure sits in a Visium-style fiducial frame. Navigation: a slide box of numbered slots.
- **`card-index`**: the lab as a card catalogue (after Linnaeus's paper slips). Libre Caslon Text + Courier Prime. Every item is a ruled card with a real call number (DOI, ORCID) and tracings. Navigation: staggered guide-card tabs.
- **`figure`**: every page is a multi-panel journal figure. Atkinson Hyperlegible Next (distinguishes I/l/1 in gene names). Lettered panels on a mosaic grid, a full caption per page, Okabe–Ito data palette. Navigation: a list of figures.

Verify each font's license and availability (Fontsource or the foundry) before committing to it. If a candidate isn't available or doesn't work, choose another that isn't on the banned list, and explain why.

### 6.4 Accessibility and basics

- WCAG 2.2 AA contrast. Visible focus styles that fit the theme. Semantic landmarks and heading order. Keyboard navigable. `prefers-reduced-motion` respected.
- Fully responsive. Mobile is a designed layout, not a squashed desktop.
- Print stylesheet for the Team and Publications pages (people do print these).

### 6.5 Performance budget

- Non-hero pages: **zero JS** (preview switcher excepted).
- Home page JS ≤ 30 KB gzipped (the island).
- Fonts: subset, `font-display: swap`, at most 4 font files per theme on first load, with the critical one preloaded.

### 6.6 The shared data hero (`src/islands/tissue-map/`)

A small interactive visual of spatial transcriptomics data: spots or cells at their tissue coordinates, coloured by cluster, with hover or tap showing the cluster label. It is a quiet, honest demonstration of what the lab works on.

- Vanilla TypeScript with canvas, or SVG if the point count allows. No libraries unless clearly justified. Lazy-initialized, under the budget above.
- Reads `public/data/hero.json` (`{ meta: {source, license, illustrative}, clusters: [{id, label}], points: [[x, y, clusterId], …] }`).
- **Styled only by CSS custom properties** set by the theme: `--hero-bg`, `--hero-fg`, `--hero-data-1 … --hero-data-12`, `--hero-font`, `--hero-point-size`, plus optional `--hero-blend` and `--hero-offset`. Each theme presents it differently, as specified in its DESIGN.md: the map face in `atlas`, a fiducial-framed capture area in `slide`, a card in `card-index`, panel b in `figure`.
- Accessible: a text alternative describing the data, keyboard focusable, static rendering with reduced motion.
- `scripts/make-hero-data.mjs` generates **illustrative** data (a plausible tissue-like layout with spatially coherent clusters, about 2–4k points). The UI shows "Illustrative data" while `meta.illustrative` is true.
- `scripts/anndata_to_hero.py`: Mo will use it to export real data from an `.h5ad` file (`obsm['spatial']`, a chosen `obs` cluster column, a downsample count, coordinates normalized). Write it with clear CLI args and a docstring. Mo will run it himself.

### 6.7 Logo

- Mo picks the mark. He will put the chosen SVG at `src/assets/logo/mark.svg`. Until that file exists, every theme shows the lab name as text only. Do not design or invent a logo yourself.
- The mark is a simple geometric SVG: one colour via `currentColor`, no gradients, no text inside the mark. It must stay legible at 16 px. If it doesn't, Mo supplies a simplified `favicon.svg`.
- Each theme colours the mark with its own ink.
- Lockup: the mark next to the lab name, with the name set in the theme's typeface. Each theme's `DESIGN.md` defines the lockup's size and spacing. Per §6.3.1 rule 1, it stays modest.
- Generate the favicon set (`favicon.svg`, 32 px PNG, 180 px `apple-touch-icon`) and use the mark on each theme's default Open Graph image.

---

## 7. Pages CMS

- Write `.pages.yml` so that every collection and page in §4 is editable through forms. Field types and validation must match the Zod schemas; required fields are required in the CMS too. Use selects for enums, image fields for images, rich text for bodies, and the right media folders per collection.
- Hide generated or internal files (`publications.json`) from the CMS. Do expose `publications.overrides.json` (hide list) only if it can be made simple; otherwise leave it out.
- Write `docs/EDITING.md` for Simon and lab members, in plain language with no git knowledge assumed: how to sign in, add a member, update a bio, swap a photo, feature a publication, what happens after saving, and how long until it's live. Leave marked spots for screenshots that Mo will add.
- Mo will install the Pages CMS GitHub App on the org himself. Tell him exactly what's needed.

---

## 8. Quality checks (`ci.yml` on every push and PR)

1. `astro check` and a strict type check with zero errors.
2. Build the **active theme** and, with `PREVIEW_THEMES=true`, **all themes**.
3. **Content parity test** (Playwright or HTML parsing on the build output): for every theme, assert that every current member's name, every project title, every highlight's title, the vision lede and all nav labels appear on the right pages. This enforces "same content, different design."
4. No broken internal links in any theme.
5. Axe: no serious or critical violations on any page of any theme.
6. **No third-party URLs** in the built HTML, CSS or JS (fonts, scripts, images), except outbound `<a href>` links.
7. JS budget check per §6.5.

---

## 9. Deployment

- `deploy.yml`: on push to `main`, build with the official `withastro/action` (use its current major version from the Astro docs) and deploy to GitHub Pages (`actions/deploy-pages`). Read `THEME`, `PREVIEW_THEMES`, `SITE_URL` and `BASE_PATH` from repository **variables**, so Mo can switch the theme or toggle preview mode in GitHub settings without touching code.
- `astro.config` takes `site` and `base` from env. Add `@astrojs/sitemap`, per-page `<title>`/description, Open Graph tags with a default share image per theme, and `robots.txt` (preview routes excluded).
- If `SITE_URL` is a custom domain, add `public/CNAME`. Otherwise don't.
- Write the exact manual steps for Mo in `docs/DEVELOPING.md`: create the repo in the org, push, Settings → Pages → Source: GitHub Actions, set the repository variables, add the domain and DNS records if applicable, install the Pages CMS app.

---

## 10. Repo docs to create

- **`CLAUDE.md`** (first thing in Phase 0): a condensed version of §1 (all of it), the theme contract rules (§3.2), the §6.1 banned/required lists, and the command list. Future sessions must follow it.
- **`README.md`**: what this is, the links (live site, CMS, docs), a quickstart (`npm ci`, `npm run dev`, `THEME=atlas npm run dev`), where things live.
- **`docs/THEMES.md`**, **`docs/EDITING.md`**, **`docs/DEVELOPING.md`**, as described above. Write them for the *next* person, who may be a student with little web experience.

---

## 11. Execution phases

At the end of each phase: run the checks, commit (rules in §1.1), and **stop with a short report**: what was done, decisions made and why, open `TODO` inputs, and what you need from Mo. Wait for "go" before the next phase.

**Phase 0: Setup**
Verify git identity (§1.1) and show it. Create `CLAUDE.md` and check `.claude/settings.json`. Scaffold Astro (static, TS strict, pinned versions), `site.config.ts`, the env schema, the base `astro.config`, npm scripts (`dev`, `build`, `preview`, `check`, `test`, `pubs`, `hero:data`, `screens`), Prettier, and the CI workflow skeleton.

**Phase 1: Content layer and contract**
Collections and schemas, `site.yaml`, draft content (real public facts only, marked placeholder), the publications script (run it if `PI_ORCID` is set), the data layer and view models, `contract.ts`, the registry, thin routes, preview routes, and the **`reference` theme**: unstyled semantic HTML that implements the full contract. Parity, link and a11y tests passing for `reference`.

**Phase 2: Design briefs**
Write `DESIGN.md` for all four themes (§6.3). **Stop and present them.** No theme code yet.

**Phase 3: Build themes**
Implement the themes one at a time, each fully (all pages, responsive, print), each with at least 2 screenshot review rounds (§6.2). Keep `REVIEW.md` per theme. All CI checks green for all themes.

**Phase 4: Data hero**
The island, the illustrative data generator, the AnnData export script, and per-theme presentation.

**Phase 5: CMS, deploy, docs**
`.pages.yml`, `deploy.yml`, `publications.yml`, image optimization, all docs, SEO basics.

**Phase 6: Final QA**
Full screenshot set for every theme. A list of all placeholder content for Simon to review. A one-page `docs/HANDOFF.md` for Mo: how to demo the themes to Simon (preview mode URLs), what's still TODO, and the manual GitHub steps.

---

## 12. Definition of done

- [ ] Switching `THEME` changes the whole design. Content files are untouched and the parity tests pass.
- [ ] Preview mode shows all themes side by side under `/themes/<id>/`.
- [ ] Four themes (`atlas`, `slide`, `card-index`, `figure`), each with a brief, a review log and a clearly distinct identity, none violating §6.1.
- [ ] Simon can edit members, projects, highlights and the vision text through Pages CMS without git.
- [ ] Publications refresh weekly without manual work. The build never needs the network.
- [ ] Zero runtime third-party requests. JS only on the home hero.
- [ ] CI green. Docs written for the next maintainer.
- [ ] Every commit authored by Mo, with no AI attribution anywhere.
