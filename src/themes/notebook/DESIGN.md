# Notebook: journal manuscript with a working margin

**Concept.** The site reads as a carefully typeset research manuscript whose wide outer margin
holds the working notes: sources, credits, dates and cross-references, as a scientist would
annotate a bound notebook.

## References and what is taken from each

| Reference                                                                                             | Taken                                                                                                                           |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Edward Tufte, _Beautiful Evidence_ (2006) and _The Visual Display of Quantitative Information_ (1983) | Sidenotes beside the text they annotate, margin figures, small data graphics set inside the argument rather than in a gallery.  |
| _Philosophical Transactions of the Royal Society_, 19th-century volumes                               | Running heads, author names set apart typographically, numbered figures with full sentence captions, a numbered reference list. |
| Robert Bringhurst, _The Elements of Typographic Style_                                                | The measure (60–65ch), a modular scale, the habit of setting numbers and names with care.                                       |
| Bound laboratory notebooks (ruled margin, dated entries, page numbers)                                | The margin as a working space: dates, sources, who did what. Pencil-grey rules.                                                 |

## Typography

- **Newsreader** (Production Type, OFL-1.1, via `@fontsource-variable/newsreader`). A text serif
  designed for long reading on screen, with an **optical size axis (6–72)**: captions and margin
  notes get the small-size cut (sturdier, looser), headings the display cut (finer). That is the
  reason to use it: one family that behaves like a properly cut text face at every size. Variable
  `opsz,wght` roman and the `wght` italic.
- **One family only.** Hierarchy comes from size, optical size, italic and spacing, as in a
  journal.
- **Verified features** (checked in the Fontsource files and the Google Fonts upstream): default
  figures are tabular lining (good for reference numbers); `tnum`, `pnum`, `liga`. **There are no
  small caps (`smcp`) and no old-style figures in any release of Newsreader.**
  - Change from the direction: "small caps for author and member names" cannot use real small
    caps. Instead, names use **weight-compensated capitals**: `font-size: 0.8em`,
    `letter-spacing: 0.05em`, `font-weight` raised by about 50 on the variable axis so the strokes
    match the surrounding text. This is a recognised technique when a family lacks small caps,
    and the variable weight axis is what makes it look right. If review shows it reads as fake,
    the fallback is roman names with the lab's own authors in **italic**, which is also journal
    practice.
  - Lining figures in running text are acceptable at this size; no fake old-style.
- **Scale** (minor third, 1.2, from a 19px text size): 13 / 16 / 19 / 23 / 27 / 33px. Body 19px
  on 1.55 leading; margin notes 15–16px on 1.45 with `opsz` near 12; captions 16px.
- **Lab name**: letter-spaced capitals (the weight-compensated setting above, `0.12em` tracking)
  at 15px in the running head, as a journal's running head sets the journal title. This is the only
  place capitals are tracked out.

## Grid and breakpoints

```
≥ 1100px                                   760–1099px              < 760px
┌───────┬───────────────────┬───┬────────┐ ┌────┬──────────┬─────┐  ┌──────────────┐
│ inner │ text column 62ch  │gap│ margin │ │ in │ text     │marg.│  │ text         │
│ marg. │                   │   │ ~1/3   │ │    │ 58ch     │ 30% │  │ note ¹ inline│
└───────┴───────────────────┴───┴────────┘ └────┴──────────┴─────┘  └──────────────┘
```

- Page = narrow inner margin (about 8%) + text column (62ch, about 37rem) + 3rem gap + outer
  margin (about 18rem). The text block sits left of centre, so the page is asymmetric, like a
  verso.
- 760–1099px: margin column narrows to 30%, notes drop to 15px.
- Under 760px: one column. Each margin note moves directly **below the paragraph it belongs to**,
  indented, at 15px, keeping its superscript number, separated by a short pencil rule. Margin
  figures become full-width figures. This is a designed layout, not a collapse.
- Vertical rhythm: multiples of the 19px × 1.55 line (≈29px).

## Colour tokens

Paper and three inks; flat colour only.

| Token        | Hex       | Use                                                         | Contrast on paper              |
| ------------ | --------- | ----------------------------------------------------------- | ------------------------------ |
| `--paper`    | `#F5F3ED` | page                                                        | —                              |
| `--ink`      | `#22262C` | text, figure strokes                                        | 13.7 : 1                       |
| `--ink-blue` | `#2B4C7E` | links, note numbers, the current nav item                   | 7.8 : 1                        |
| `--pencil`   | `#AAA597` | hairline rules, figure frames (decorative only, never text) | 2.2 : 1 (non-text, decorative) |
| `--ink-soft` | `#5E6066` | dates and secondary text in the margin                      | 5.7 : 1                        |

- No orange, terracotta or warm accent. The warm paper is kept from the direction, but the
  cliché is warm paper **plus** a display serif **plus** a clay accent; here the only colour is a
  blue-black ink, which is what fountain-pen notebooks actually look like.
- Data colours (the figure only): eight muted ink hues, each checked against the paper:
  blue-black `#2B3A55` (10.3), iron-gall `#5A4632` (8.0), indigo `#3F4F8C` (7.0), viridian
  `#2F6B5B` (5.6), sepia `#7A5A3A` (5.7), madder `#93404A` (6.2), slate `#56707E` (4.7),
  ochre `#8A6A22` (4.5). They are close in lightness on purpose (one set of inks), so clusters are
  always named in the margin key and the hover label as well as coloured.

## Signature element: the working margin

Every page uses the margin for something true:

- **Home**: affiliations and contact beside the opening; figure credits beside Fig. 1; the
  publication venue and year beside each highlight.
- **Research and project pages**: the project's people, related references (as numbers pointing
  into the reference list on the same page) and the figure credit.
- **Publications**: the year and venue beside each highlight figure; in the reference list the
  margin carries open-access and preprint links.
- **Team**: portraits sit in the margin beside each person's paragraph, like margin figures.
- **About / Join**: dates and source notes; contact details.

Note numbers are real: a superscript in the text points to the matching note in the margin.

## Navigation: running head

A single running head across the top, like a journal page: lab name (tracked capitals) on the
left, the six section names on the right in 16px roman, current section in ink blue with a
pencil underline. No hamburger menu: on narrow screens the running head wraps to two lines (lab
name, then sections). A folio line at the foot of each page links to the previous and next
section, like turning a page.

## Home page structure, and why

```
running head ──────────────────────────────────────────────────────
                                    │
  Tagline as the manuscript title   │ KTH Royal Institute of Technology
  (33px, display opsz, not bold)    │ SciLifeLab, Stockholm
                                    │ simon.koplev@…
  Intro paragraph (the "abstract")  │
                                    │
  ┌ Fig. 1 ───────────────────────┐ │ Fig. 1 credit, "illustrative
  │ tissue map (data hero)        │ │ data" note, cluster key as
  └───────────────────────────────┘ │ a numbered list
  Fig. 1. Caption sentence.         │
                                    │
  1  Research                       │ people on each project
     three projects as short        │
     subsections with summaries     │
  2  Selected publications          │ venue, year
     Figs. 2–4 with full captions   │ credits
  3  People                         │
     run-in list of names           │
  4  Joining the lab                │
```

The manuscript order (title, abstract, figure, sections) is what a scientist expects and lets the
science lead. The tagline is the title, the lab name stays in the running head (rule 1). Section
numbers are the manuscript's real section structure.

## The data figure

"Fig. 1" inside the text column, full column width, framed by a pencil hairline. Caption below in
16px: "Fig. 1. _Spatial map of …_" with the "Illustrative data" note in the margin while the data
is illustrative. Cluster key in the margin as a numbered list matching the colours; hover or tap
shows the label at the point.

## Other pages

- **Research**: an introduction paragraph, then each project as a numbered section with its
  figure as a full-width figure (Fig. _n_) and the summary as its lede.
- **Project**: title, summary as standfirst, the figure, the body (Question / Approach / Why it
  matters as numbered subsections), people and references in the margin, numbered reference list
  at the foot.
- **Publications**: highlights first as Figs. 1–3 with full captions (blurb + citation) and the
  credit in the margin; then the full **numbered reference list** grouped by year, lab authors in
  the name setting, numbers right-aligned in a hanging column (Newsreader's default tabular
  figures).
- **Team**: each person a short paragraph (name in the name setting, role in italic, bio), with
  the portrait in the margin. Alumni as a plain list.
- **404**: a single "erratum"-style paragraph using the content's not-found text.

## People

Portraits 4:5, in colour, in the margin column (about 9rem wide), with a pencil hairline frame.
Placeholder: the same 4:5 frame containing a pencil-ink circle inscribed in the rectangle and a
short horizontal rule through its centre (a neutral drafting mark), no face, no initials.

## Logo lockup

Mark at the cap height of the running-head capitals (about 11px tall), in `--ink`, 0.5em gap,
followed by the tracked-capitals lab name. Text only until `mark.svg` exists.

## Interaction, focus, print

- Links: ink blue, underlined with a 1px offset underline in pencil, ink-blue underline on hover.
- Focus: 2px ink-blue outline, 3px offset, no glow.
- No motion except the figure's hover label. `prefers-reduced-motion` has nothing else to stop.
- Print (Team, Publications): margin notes move inline (as on mobile), links print their URL for
  DOIs, black ink only, page-break-avoid on entries.
- Draft marker: the word from `labels.draft` in the margin, italic, `--ink-soft`, beside the
  placeholder item.

## Fonts on first load

`newsreader-latin-opsz-normal` (preloaded) and `newsreader-latin-wght-italic`; latin-ext files
load only for names that need them (ř, ă). At most 4 files.

## What this theme refuses to do

- No warm accent colour, no terracotta, no gold.
- No drop caps, ornaments, fleurons or "vintage" textures. The period reference is in the
  structure, not in pastiche.
- No hairline-ruled newspaper columns; one text column only.
- No cards, no grid of thumbnails on the home page.
- No margin notes that are decoration: every note is a source, credit, date, person or link.
- No full-bleed hero image.
