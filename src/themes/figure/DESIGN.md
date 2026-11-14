# Figure: every page is a multi-panel journal figure

**Concept.** The lab publishes its work as multi-panel figures, so each page is composed as one:
lettered panels on a strict grid, axes and legends drawn with care, and a full figure caption that
describes every panel.

## References and what is taken from each

| Reference                                                                                                               | Taken                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _Nature_ and _Nature Immunology_ figure style (including the lab's own figures, for example Koplev et al. 2026, Fig. 1) | Bold lowercase panel letters top-left of each panel; the caption format "**Fig. 2 \| Title.** **a**, … **b**, …"; thin black axes; flush-left legends.        |
| Edward Tufte, _The Visual Display of Quantitative Information_ (1983)                                                   | Small multiples, data-ink ratio: axes only where they carry information, no chart junk.                                                                       |
| Okabe and Ito, _Color Universal Design_ (2008)                                                                          | The categorical palette that computational biologists use because it stays distinguishable for colour-blind readers.                                          |
| Matplotlib and ggplot figure grids (`subplot_mosaic`, `patchwork`)                                                      | Panels of different sizes on one grid; the composition logic of a figure built in code, which signals the lab's computational practice without a "tech" look. |

## Typography

- **Atkinson Hyperlegible Next** (Braille Institute, OFL-1.1,
  `@fontsource-variable/atkinson-hyperlegible-next`): designed so that easily confused characters
  stay distinct (I, l and 1; 0 and O; rn and m). This site is full of gene and protein names
  (_IL1B_, _COL7A1_, _CCL19_, _IL11_), so that design goal is a real requirement here, not a
  style choice. Its plain grotesque forms also sit naturally in figures, where Helvetica and
  Arial normally appear.
- Weights: 400 text, 700 for panel letters and caption titles. `tnum` available (verified) for
  axis ticks and counts; default figures are proportional.
- **Scale** (major third, 1.25, from 17px): 13.6 / 17 / 21.25 / 26.5 / 33px. Body 17px on 1.5,
  measure 66ch. Panel letters 21px bold. Caption text 15px on 1.45. Tagline 33px, 400.
- Gene names in italic where the content marks them, as journals require.

## Grid and breakpoints

```
≥ 1100px   (a page = one figure, panels on a 12-column grid)
┌───────────────────────────┬────────────────────────────┐
│ a  tagline + intro         │ b  tissue map (data hero)  │
│    (text panel, cols 1–5)  │    cols 6–12, tall         │
├──────────┬──────────┬──────┤                            │
│ c  proj 1│ c′ proj 2│proj 3│                            │
├──────────┴──────────┴──────┴────────────────────────────┤
│ d  selected publications (three panels)  │ e  people    │
├──────────────────────────────────────────┴──────────────┤
│ Fig. 1 | Caption title. a, … b, … c, … d, … e, …        │
└─────────────────────────────────────────────────────────┘
```

- 12 columns, 16px gutters (figure-tight), panels separated by whitespace, not boxes.
- Panel sizes vary deliberately: one large panel per page, the rest smaller.
- 760–1099px: two-column mosaic, panel order kept.
- Under 760px: panels stack in letter order (a, b, c …), each full width, panel letter kept, and
  the caption follows the panels. Small multiples (projects, people) become two-up.

## Colour tokens

| Token     | Hex       | Use                                                                      | Contrast on white |
| --------- | --------- | ------------------------------------------------------------------------ | ----------------- |
| `--white` | `#FFFFFF` | page                                                                     | —                 |
| `--black` | `#000000` | text, axes, panel letters (true black, as in printed figures)            | 21 : 1            |
| `--grey`  | `#6B6B6B` | tick labels, captions' secondary text, gridlines (sparingly)             | 5.3 : 1           |
| `--blue`  | `#0072B2` | the one accent (Okabe–Ito blue): links, current figure in the nav, focus | 5.2 : 1           |

Data palette: **Okabe–Ito** (`#E69F00`, `#56B4E9`, `#009E73`, `#F0E442`, `#0072B2`, `#D55E00`,
`#CC79A7`, `#000000`). It is chosen for colour-blind safety, and its known weakness is
**contrast on white**: orange (2.3 : 1), sky blue (2.3), yellow (1.3) and purple (3.1, borderline)
are below or near 3 : 1. So colour is never the only carrier: legend entries are buttons that
isolate a cluster (others turn grey), every cluster is named in the legend and the hover label,
and the text alternative lists them. Yellow is used last, only when eight groups are needed.

## Signature element: panel letters and the full caption

- Every block of content is a **panel** with a bold lowercase letter (a, b, c …) at its top-left,
  in reading order. The letters are real: the caption refers to each one.
- Every page ends with a **figure caption** in journal format: "**Fig. 3 | Publications.** **a**,
  Selected publications. **b**, All publications, by year." The caption is generated from the
  page's section titles (content), so it stays true when content changes.

## Navigation: list of figures

A single line at the top: the six sections as "Fig. 1 Home", "Fig. 2 Research", … "Fig. 6 Join
us", each a link, the current one in `--blue` with a 2px underline. "Fig." and the numbers are
numbering; the names come from content. Project pages are panels of Fig. 2 ("Fig. 2a", "2b",
"2c"), which is how they are numbered in the nav breadcrumb. On mobile the list wraps onto two or
three lines, no menu button.

## Home page structure, and why

The mosaic above: **a**, the tagline and intro as a text panel; **b**, the tissue map, the largest
panel; **c**, the three projects as small multiples (thumbnail, title, summary); **d**, the
highlights; **e**, people as a small grid of portraits; then the caption. The join text is
the caption's final sentence plus a link panel **f** on mobile.

Why: scientists read figures before text. A page that behaves like a well-made figure shows the
lab's computational and visual literacy directly, with nothing borrowed from product design.

## The data figure

Panel **b**: points at their coordinates, thin black L-shaped axes with a few ticks (no box),
axis labels from the data file's metadata, legend flush-left beneath with Okabe–Ito swatches as
buttons (isolate on click or Enter). Hover or tap shows the label. "Illustrative data" written in
the caption's sentence for panel b while illustrative.

## Other pages

- **Research** (Fig. 2): one panel per project (**a–c**), each with its figure, title and summary.
- **Project** (Fig. 2a/2b/2c): panel **a** the project figure, **b** the text (question, approach,
  why it matters), **c** people, **d** related publications; caption at the foot including the
  figure credit.
- **Publications** (Fig. 3): **a**, highlights as panels (figure + finding + citation); **b**,
  the full list by year, lab authors in bold.
- **Team** (Fig. 4): small multiples of portraits (**a**, current members, grouped by role with
  sub-letters), **b** alumni.
- **About / Join** (Figs. 5–6): text panels, with contact as its own panel.
- **404**: an empty panel with axes and the not-found text in the caption.

## People

Portraits **1:1**, colour, no border, in small multiples with name (700) and role (400) beneath,
like panel titles. Placeholder: the same square in a very light grey (`#EDEDED`) with a single
black open circle, the plotting marker for "no data", centred.

## Logo lockup

Mark 18px in `--black`, 8px gap, lab name in Atkinson 700 at 15px, left of the list of figures.

## Interaction, focus, print

- Links: `--blue`, 1px underline; hover thickens.
- Focus: 2px `--blue` outline, 2px offset.
- The only interaction is the data figure's legend isolation and hover label. No other motion.
- Print (Team, Publications): panels stack one column, caption kept, colours kept (figures print
  in colour).
- Draft marker: `labels.draft` in `--grey`, in brackets after the panel letter.

## Fonts on first load

`atkinson-hyperlegible-next-latin-wght-normal` (preloaded, 33 KB) and its italic when gene names
appear, plus latin-ext only when needed. Two to three files.

## Decisions made while building

Recorded from the review rounds (`tests/screenshots/figure/REVIEW.md`):

- Small multiples (home projects and highlights) carry their image credits in the page caption,
  journal style; single figures keep the credit under the image.
- Fixed image frames apply from 760px up (images sit on the frame's bottom edge so titles align);
  on phones images keep their own proportions. Projects are one per row on phones, people two
  (team page) or three (home) per row.
- Images are never cropped by the layout. Source panel letters inside crops were removed from the
  image files (and the credit says so) so they do not collide with this theme's panel letters.
- The project pager names neighbouring projects by their figure number ("Fig. 2b …").
- All global CSS is scoped under `:root[data-theme='figure']` in cascade layers
  (`figure.tokens`, `figure.base`, `figure.print`).

## What this theme refuses to do

- No dashboard look: no KPI tiles, no big numbers, no cards with shadows.
- No dark theme, no neon, no code-editor styling.
- No panel letter or figure number that is not referenced in the caption.
- No decorative charts: every plotted mark is real data or the illustrative data, labelled.
