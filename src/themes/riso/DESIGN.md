# Riso: two-ink risograph zine

**Concept.** The site is a small-run zine printed in two risograph inks, Fluorescent Pink and
Blue, where every image is the two inks overprinting into a third colour, and the layout stays
calm enough for a funder to read.

## References and what is taken from each

| Reference                                                                            | Taken                                                                                                     |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Riso Kagaku's standard ink chart (Fluorescent Pink, Blue, Federal Blue)              | The palette, as named inks with their published screen values, never invented tints.                      |
| Small-run riso print studios' work (for example Hato Press, London; Knust, Nijmegen) | Two-colour separation logic, halftone images, visible but slight misregistration, generous paper margins. |
| A5 saddle-stitched science and gig zines                                             | One big image per spread, short headings, a printed colophon listing inks and paper.                      |
| Swiss-style typographic zines of the 1990s                                           | A sober sans for text against loud imagery, so the loudness is contained in the pictures.                 |

## Typography

- **Chivo** (Omnibus-Type, OFL-1.1, via `@fontsource-variable/chivo`): a grotesque with a
  heavy Black weight that holds up when printed in a single ink, and a quiet Regular for text.
  Black (900) only for short display headings in **sentence case**; Regular (400) and Bold (700)
  for text. Default figures are tabular (verified: equal advance widths), plus `tnum`/`pnum`.
- **Chivo Mono** (Omnibus-Type, OFL-1.1, via `@fontsource-variable/chivo-mono`) for the
  colophon, figure numbers, credits and the plate-style figure labels, the way zines print their
  technical notes. It is **not** used for navigation, buttons or general UI labels (a mono face
  for small UI labels is a generated-site tell; here it marks printed metadata only).
- **Scale** (major third, 1.25, from 18px): 13 / 15 / 18 / 22.5 / 28 / 35 / 44px. Display headings
  35–44px Black, line-height 1.0. Body 18px on 1.55. Mono 13–15px, `letter-spacing: 0`.
- No all-caps anywhere. The lab name is set in Chivo Bold at 18px, sentence case as written.

## Grid and breakpoints

6-column grid, 20px gutters, very generous outer margins (8vw desktop), content max 72rem.

```
≥ 1024px                                         < 720px
┌─────────┬───────────────────────────────────┐  ┌───────────────┐
│ contents│  big two-ink image (cols 2–6)      │  │ lab name      │
│ (nav)   │                                    │  │ nav (stacked) │
│ col 1   │  heading (sentence case, Black)    │  │ image (full)  │
│         │  text (cols 2–5, ≤ 64ch)           │  │ heading       │
│         │                                    │  │ text          │
└─────────┴───────────────────────────────────┘  └───────────────┘
```

720–1023px: contents move to the top as a two-column list; images span all columns. One or two
big images per page, never a grid of many.

## Colour tokens

Paper + two inks. The overprint (multiply) of the two inks is the third colour.

| Token         | Hex                    | Use                                                                          | Contrast on paper                                           |
| ------------- | ---------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `--paper`     | `#F6F4EE`              | ground                                                                       | —                                                           |
| `--pink`      | `#FF48B0`              | Fluorescent Pink ink: image separations, fills, rules, the current-page mark | 2.8 : 1 (**never text, never the only carrier of meaning**) |
| `--blue`      | `#0078BF`              | Blue ink: image separations, display headings ≥ 28px                         | 4.3 : 1 (passes AA for large text only)                     |
| `--overprint` | `#002284`              | pink × blue multiplied; **running text, links, small headings**              | 12.2 : 1                                                    |
| `--pink-tint` | `#F6B7D4` (35% screen) | fills behind text blocks                                                     | overprint text on it 8.1 : 1                                |
| `--blue-tint` | `#B8D4DF` (25% screen) | fills                                                                        | overprint text on it 8.7 : 1                                |

- Contrast decision (from the direction's instruction to check blue against AA): Blue on paper is
  4.3 : 1, so it fails for body text. Running text is set in the **overprint colour**, which keeps
  the palette strictly two-ink (it is what pink printed over blue looks like) and reaches 12.2 : 1.
  Federal Blue would be a third drum, so it is not used.
- Text is always a single flat colour, never multiplied or offset (rule 6: imperfection on
  images and fills only).

## Signature element: two inks overprinting to a third

Wherever imagery appears, it is separated into the two inks and overprinted:

- **Figures and photos**: converted at build time (sharp) into two halftone separations, the pink
  plate and the blue plate, stacked with `mix-blend-mode: multiply`; the pink plate offset by
  1–3px (a fixed, per-image offset so it is stable, not random on every load).
- **Fills**: section bands and the draft marker use flat tints of a single ink.
- **Paper grain**: a subtle noise texture on image areas only.

The original full-colour figure is available by link ("View original figure"), because duotone
loses scientific information; the caption says the image is a two-ink rendering of the original.

## Navigation: the contents column

On desktop the left column is a printed contents list: the six sections as a vertical list in
Chivo Bold 18px, current page marked by a pink ink bar printed behind the word (overprinting the
text colour, as a highlighter would). Under 1024px the contents move to the top; under 720px a
plain stacked list, full width, with generous tap targets. No hamburger.

## Home page structure, and why

```
contents │  [the staining hero: H&E printed as two inks]
         │  tagline as a heading, sentence case, Black, blue ink (35–44px)
         │  intro paragraph
         │
         │  Research ── three projects, one per row: duotone figure left
         │              (cols 2–4), title + summary right (cols 5–6)
         │  Selected publications ── one large duotone highlight +
         │              two smaller ones, captions in mono
         │  (no People or Join sections on the home page; both are in the
         │   contents column)
         │
         │  colophon: "Printed in Fluorescent Pink and Blue" + affiliations
```

The cover image is the science (a section being stained), not the name. The rest is calm: one column of
reading with a handful of big images, so the loudness stays in the pictures.

## The hero figure

The shared staining island (`src/islands/staining-run/`): a drawn section of gut lining stained
with hematoxylin, then eosin, on a loop. H&E is itself a two-colour print, so hematoxylin prints
as the blue ink and eosin as the pink ink; nuclei multiply over the pink and come out in the
overprint colour. The steps sit under the figure in Chivo Mono, the current one in bold
overprint; the caption says it is an illustration, not a real sample. A Pause button stops the
loop; with reduced motion it starts paused on the stained frame.

## Other pages

- **Research**: each project as a spread: big duotone figure, heading, summary, link.
- **Project**: heading, summary, one big duotone figure with mono caption and credit, body text,
  people as a small duotone portrait row, references.
- **Publications**: highlights as large duotone figures (one per row), then the full list in a
  single column; years as Black headings; lab authors in Bold.
- **Team**: duotone portraits in one grid (2 columns on mobile) with no role headings, name in
  Bold, role in Regular, short bio. Each lower role starts a new row.
- **About / Join**: text pages with a single tint fill block for the lede.
- **404**: a misregistered pair of circles (pink, blue) beside the not-found text.

## People

Portraits 1:1, converted to the same two-ink halftone as figures, pink plate offset 2px.
Placeholder: the same square with two flat circles, one pink and one blue, overlapping so the
lens-shaped overlap prints as overprint. Neutral, geometric, on-concept.

## Logo lockup

Mark 22px tall. If the supplied mark has separable parts, it may print in two inks with the parts
overprinting; otherwise blue ink. Lab name in Chivo Bold 18px, 10px gap.

## Interaction, focus, print

- Links: overprint colour, underlined; hover adds a pink tint behind the link text.
- Focus: 3px blue outline with 2px paper-coloured offset ring, so it shows on tints too.
- Motion: only the hero's staining loop, which can be paused and starts paused with reduced
  motion.
- Print (Team, Publications): images print as grayscale halftones, text in black, contents list
  removed.
- Draft marker: `labels.draft` on a small pink-tint label beside the item.

## Fonts on first load

`chivo-latin-wght-normal` (preloaded), `chivo-mono-latin-wght-normal`, plus latin-ext only when
needed. Two to four files.

## Decisions made while building

Recorded from the review rounds (`tests/screenshots/riso/REVIEW.md`):

- **Images keep their original colours** (Mo's decision after round 2). The two inks carry the
  type, rules, tint fills, current-page mark and placeholders; figures and photos are never
  re-coloured. Figures use `mix-blend-mode: multiply` only so their white backgrounds take the
  paper tone instead of sitting in white boxes. This supersedes the two-ink image print
  described under "Signature element" above.
- The current-page mark is a thick pink stroke through the bottom of the word (pink behind
  overprint text is 4.4 : 1, below AA for 18px text, so it cannot be a full block).
- Credits and metadata use `--overprint-soft` `#4D5B8C` (6.0 : 1 on paper).
- There is no printed colophon line naming the inks: all visible text must come from content.
- All global CSS is scoped under `:root[data-theme='riso']` in cascade layers.

- **Navigation is a top bar** (Mo's decision after round 3): lab name left, sections right, a
  2px pink rule beneath; on phones the links wrap under the name. It replaces the contents
  column described under "Navigation" above, which left a third of the page empty and pushed
  the content off-centre. The home page opens with the hero at full content width, then the
  tagline (about 32px) beside the intro paragraph, so image and statement share the first
  screen.

## What this theme refuses to do

- No gradient between the inks, ever; no third ink.
- No giant lab name or all-caps display type (the feedback on the earlier preview).
- No misregistration on text, no rotated or skewed text, no "grunge".
- No more than two big images per page.
- No pink text.
