# Poster: conference poster with one big takeaway

**Concept.** Each page is a scientific poster built for a reader standing two metres away: one
plain takeaway in very large type, the evidence beside it, and a clear path for the curious.

## References and what is taken from each

| Reference                                                                                       | Taken                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mike Morrison, #betterposter (2019)                                                             | The central takeaway band in huge plain language; the "ammo bar" of supporting detail beside it; the rule that the main finding is a sentence, not a title.   |
| A0 conference posters (ISMB, AACR, Keystone poster sessions)                                    | Title bar with author and affiliation block, numbered figures ("Figure 1") with short legends, a box for "who to talk to".                                    |
| Josef Müller-Brockmann, _Grid Systems in Graphic Design_ (1981) and his Zürich Tonhalle posters | A strict modular grid with asymmetric weighting, flush-left ragged-right type, sans serif in few weights, colour as a structural band rather than decoration. |
| Swiss public-information posters (federal health and transport notices)                         | Plain public language, high contrast, one strong colour field, information ordered for strangers.                                                             |

## Typography

- **Libre Franklin** (Impallari Type, OFL-1.1, via `@fontsource-variable/libre-franklin`), a
  revival of Morris Fuller Benton's Franklin Gothic, the American workhorse of notices and
  newspapers. It is plain and sturdy at huge sizes and still legible at 15px, which is exactly
  what a poster asks of a face. Roman variable only (italic is not needed).
- **Three weights**: 400 (text), 600 (labels, nav, figure titles), 800 (takeaway band). Nothing
  else.
- **Verified features**: `frac`, `liga`, `sups`. **No tabular figures** in any release, and the
  default figures are proportional. Consequence for the design: no aligned columns of numbers.
  Reference numbers sit in a fixed-width box (`min-width: 2.5ch`, right-aligned); years appear as
  group headings, never as a column.
- **Scale** (perfect fourth, 1.333, from 18px): 15 / 18 / 24 / 32 / 42 / 56px, plus the takeaway
  at `clamp(2.6rem, 5.2vw, 5.25rem)` (≈42–84px), weight 800, line-height 1.05, tracking -0.01em,
  sentence case, max 18 words per line.
- Body 18px on 1.5, measure ≤ 68ch inside columns.

## Grid and breakpoints

12-column grid, 24px gutters, 4vw outer margins.

```
≥ 1200px
┌──────────────────────────────────────────────────────────────┐
│ title bar: lab name · authors (nav) · affiliations           │
├───────────────┬──────────────────────────────┬───────────────┤
│ Background    │                              │ Figure 1      │
│ (about lede)  │   TAKEAWAY BAND (teal)       │ (data hero)   │
│ Approach      │   tagline, very large        │               │
│ (projects)    │                              │ Prospective   │
│ cols 1–3      │   cols 4–9                   │ students box  │
│               │                              │ cols 10–12    │
└───────────────┴──────────────────────────────┴───────────────┘

768–1199px                          < 768px
┌──────────────────────────┐        ┌──────────────┐
│ title bar                │        │ title bar    │
│ TAKEAWAY BAND (full)     │        │ TAKEAWAY     │
├────────────┬─────────────┤        │ Figure 1     │
│ Background │ Figure 1    │        │ Background   │
│ Approach   │ Students    │        │ Approach     │
└────────────┴─────────────┘        │ Students     │
                                    └──────────────┘
```

On mobile the takeaway comes first and the columns stack in reading order (the order a poster
is read: takeaway, evidence, background, how to get involved).

## Colour tokens

| Token         | Hex       | Use                                 | Contrast                                     |
| ------------- | --------- | ----------------------------------- | -------------------------------------------- |
| `--white`     | `#FFFFFF` | ground                              | —                                            |
| `--ink`       | `#111111` | text, rules, title bar text         | 18.9 : 1 on white                            |
| `--band`      | `#0B5D5E` | takeaway band ground, section heads | 7.7 : 1 on white; white text on band 7.7 : 1 |
| `--ink-soft`  | `#555555` | legends, credits                    | 7.5 : 1 on white                             |
| `--band-tint` | `#E6EFEF` | the prospective-students box ground | ink on tint 16.2 : 1                         |

- Deep teal is the only colour outside data. It appears as large fields (the band) and as section
  head colour, never as small decoration.
- **Data only, a second hue**: a rust family. The figure uses at most six groups built from two
  hues in lightness steps, each ≥ 3 : 1 on white: teal `#0B5D5E` (7.7), `#2B7F7B` (4.8),
  `#4E9C97` (3.2); rust `#B2532E` (5.0), `#C46A3F` (3.8); grey `#8A8A8A` (3.5) for "other". Any
  merged groups are labelled honestly ("other clusters"). The paler tints the direction implied
  (around `#9CC5C1`) fail 3 : 1 on white and are not used for data marks.

## Signature element: the takeaway band

A full-height teal band in the centre column carrying one sentence in 800 weight at poster scale.
On the home page it carries the site `tagline`; on each project page, that project's `summary`.
It is the largest thing on every page where it appears and is never decorated (no icons, no
quotes, no arrows).

## Navigation: the title bar

The title bar works like a poster's header strip: lab name on the left at 24px/600 (with the
mark), the six section links in a row beside it at 18px/600, affiliations on the right at 15px.
A 6px ink rule closes the bar. Current section: ink underline 3px. On narrow screens the bar
stacks (name, links wrapping on one or two lines, affiliations hidden to the footer). No menu
button.

## Home page structure, and why

The poster grid above. Left: **Background** (about lede and a link to About) and **Approach** (the
three projects as one-line items with their numbers 1–3, linking to each project poster). Centre:
the takeaway band (tagline). Right: **Figure 1** (the data hero) and a **Prospective students**
box (join lede, contact email, link to Join). Below the poster, a short strip with the three
highlight figures as a mini poster-session row.

Why: a funder or a student gets the main point in two seconds (band), the evidence is one glance
right (figure), and the people who want more have obvious next steps.

## The data figure

"Figure 1" heading (600) in the right column, figure at column width on white, legend underneath
as a small key of coloured squares + labels (15px). Legend text in `--ink-soft`. "Illustrative
data" set as part of the legend while the data is illustrative.

## Other pages

- **Research**: a three-column wall of the projects, each a small poster tile (number, title,
  figure, one-sentence summary). Not cards: no rounded corners, no shadows, just the grid and a
  2px ink top rule.
- **Project**: its own poster. Title bar (project title + people), takeaway band (summary), left
  column Question and Approach, right column the key figure as "Figure 1" with caption and credit,
  related publications at the foot as numbered references.
- **Publications**: the poster-session wall. Highlights as tiles: figure, one-line finding
  (blurb) in 24px/600, citation below. Then the full list grouped by year headings, references in
  a single column, lab authors in 600 weight.
- **Team**: the poster's author and affiliation block, enlarged: names in a row-wrapped list in
  24px/600, superscript role numbers keyed to a role list (as affiliations are keyed on posters),
  then square photos in a grid with name and role beneath, bios on demand in plain text.
- **About / Join**: single poster each, about lede or join lede in the band.

## People

Square crops, full colour, on white with no frame. Placeholder: the same square in
`--band-tint` with a teal quarter circle anchored to the lower-left corner (a neutral geometric
mark), no initials.

## Logo lockup

Mark 28px tall in `--ink` at the left of the title bar, 12px gap, lab name at 24px/600. Not
larger anywhere.

## Interaction, focus, print

- Links: ink, 2px underline; hover underline in teal.
- Focus: 3px solid ink outline, 2px offset (high visibility, poster-plain).
- No motion. The band does not animate.
- Print (Team, Publications): the band prints as a 2px teal rule with the sentence in ink, white
  ground, one column.
- Draft marker: `labels.draft` in a small ink-outlined box after the item's heading.

## Fonts on first load

`libre-franklin-latin-wght-normal` (preloaded, 28 KB) and its latin-ext companion only when needed.
Two files.

## What this theme refuses to do

- No gradients across the band, no rounded tiles, no shadows, no icons.
- No more than one non-data colour.
- No centred text: everything is flush left.
- No stock "conference" clichés (lanyards, speech bubbles, QR codes as decoration).
- The lab name is never in the band and never larger than 24px.
