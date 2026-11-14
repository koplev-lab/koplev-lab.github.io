# Themes

The site's content and its design are separate. Content lives in `src/content/` and
`src/data/`. A **theme** is a complete design (layout, typography, colour, navigation) that
receives that content as typed data and renders it. Switching the theme changes the whole look
without touching any content file.

## How the pieces fit

```
src/content/, src/data/          the content (Markdown, YAML, JSON)
        │
src/lib/content.ts               reads it and returns "view models" (src/lib/types.ts)
        │
src/lib/components/PageRenderer  picks the theme and passes it the data
        │
src/themes/<id>/                 the theme renders the page
```

Routes in `src/pages/` are a few lines each and call `PageRenderer`. You should not need to
touch them when you add a theme.

## Choosing the active theme

- Default: `DEFAULT_THEME` in `src/site.config.ts`.
- Override for one run: `THEME=reference npm run dev`.
- On GitHub: set the repository variable `THEME` (Settings → Secrets and variables → Actions →
  Variables).

`THEME` must be one of the ids in `src/themes/ids.ts`; the build fails otherwise.

## Previewing every theme

`PREVIEW_THEMES=true npm run dev` (or `npm run build`) also generates every page of every
theme under `/themes/<id>/…`, plus an index at `/themes/`. These pages carry `noindex` and a
small theme switcher at the top.

## Creating a new theme

1. **Write the brief first.** Create `src/themes/<id>/DESIGN.md`: concept, references,
   typefaces (with licences), grid, colour tokens with contrast ratios, signature element, home
   page structure, and what the theme refuses to do. The rules in `CLAUDE.md` §3 apply.
2. **Copy the reference theme**: `cp -r src/themes/reference src/themes/<id>`. It implements
   the whole contract with plain HTML, so you start from something that passes every test.
3. **Register it**:
   - add the id to `THEME_IDS` in `src/themes/ids.ts`;
   - set `id` and `name` in `src/themes/<id>/index.ts`;
   - import it in `src/themes/index.ts` and add it to the `themes` object.
4. **Design it.** Change anything inside `src/themes/<id>/`: markup, structure, CSS, fonts,
   decorative assets. Run `THEME=<id> npm run dev`.
5. **Test it**: `npm test` builds every theme and checks content parity, links, accessibility,
   third-party URLs and the JS budget.

## The contract (`src/themes/contract.ts`)

A theme exports an object with an `id`, a `name` and eight page components:
`Home`, `Research`, `Project`, `Publications`, `Team`, `About`, `Join`, `NotFound`.
Each receives `ctx` (a `ThemeContext`) and, except `NotFound`, a `data` view model.

`ctx` gives you:

| Field             | Use                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `ctx.url(path)`   | Turn a path such as `/team/` or a view model's `path` into a link. Always use it.            |
| `ctx.site`        | Lab name, tagline, nav items, section titles, interface labels, contact, logo.               |
| `ctx.currentPath` | The current page's path, for marking the active nav item.                                    |
| `ctx.showDrafts`  | True in dev and preview mode: show a quiet "draft" marker on items with `placeholder: true`. |
| `ctx.preview`     | Set only on preview pages (used by `PreviewBar`).                                            |

### Rules

- **Never import** from `astro:content`, `src/content/` or `src/data/`. Use only the props you
  are given. (A test checks this.)
- **All links through `ctx.url()`**. The site may live under a sub-path such as `/website/`, and
  preview pages live under `/themes/<id>/`. Hard-coded paths break both. (The link test builds
  under `/base-test/` to catch this.)
- **All visible text from the data**: nav labels (`ctx.site.nav`), section headings
  (`ctx.site.sectionTitles`), and small interface words (`ctx.site.labels`). Only decorative
  glyphs and numbering may be written into the theme.
- **Render all required content**: every current member's name on the team page, every project
  title on the research page and on its own page, every highlight's title on the publications
  page, the about lede, the tagline on the home page, and the nav labels on every page. Which
  optional fields you show, and how, is up to you.
- **Own your styles**: import CSS only from your theme's `Layout.astro`; keep fonts and decorative
  files in `src/themes/<id>/assets/`. No global CSS outside themes. Self-host fonts.
- **Scope your global CSS.** Astro bundles the CSS of every component a route imports, and the
  page renderer imports every theme, so a theme's global CSS can end up on another theme's pages.
  Set `data-theme={ctx.themeId}` on `<html>` in your Layout and write every global rule under
  `:root[data-theme='<id>']`, inside a cascade layer (`@layer <id>.base { … }`) so your
  components' scoped styles still win. See `src/themes/figure/styles/` for an example. Styles in a
  component's own `<style>` block are already scoped and need nothing extra.
- **In every Layout**: render `<BaseHead>` inside `<head>` and `<PreviewBar>` first inside
  `<body>` (both in `src/lib/components/`).
- **Zero JavaScript** on every page except the home page's data figure.
- Images come as `ImageMetadata`; render them with `<Picture>` or `<Image>` from
  `astro:assets`. Team members without a photo have `photo: null`: draw the theme's geometric
  placeholder in the same frame used for photos.

## Useful view model fields

See `src/lib/types.ts` for the full list. Some that are easy to miss:

- `PublicationView.authorsBrief`: a shortened author list (first three, lab members, last
  author) where `null` marks an omission. `isMember` / `isPI` let you highlight the lab's
  authors.
- `PublicationView.number`: a stable reference number (1 = newest), the same in every theme.
- `HighlightView.number` and `ProjectSummary.number`: figure and project numbers, 1-based.
- `TeamData.rows`: current members split into rows by role, most senior first. Show them as
  one list with no role headings, starting each lower role on a new line.
