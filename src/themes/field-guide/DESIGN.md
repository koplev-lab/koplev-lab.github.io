# Field guide: natural-history field guide

**Concept.** The site is a field guide to the lab: text pages face keyed plates, and clusters,
projects and people are all identified the same way, by a number on the plate and an entry on
the facing page.

## References and what is taken from each

| Reference                                                                        | Taken                                                                                                                          |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Svensson, Mullarney and Zetterström, _Collins Bird Guide_                        | Text page facing a plate; small numbered figures on the plate keyed to short entries; dense but calm.                          |
| Roger Tory Peterson, _A Field Guide to the Birds_ (Peterson system)              | Pointers to the distinguishing mark; the idea that a plate is for identification, so every figure answers "which one is this". |
| Ernst Haeckel, _Kunstformen der Natur_ (1904)                                    | Specimens arranged on a plate ground, each numbered, the plate itself numbered; symmetry used inside a plate only.             |
| Herbarium specimen labels (for example at the Swedish Museum of Natural History) | Label typography: small caps, accession numbers, collector and date fields, a ruled label box.                                 |

## Typography

- **Crimson Pro** (Jacques Le Bailly, after Sebastian Kosch's Crimson Text; OFL-1.1, via
  `@fontsource-variable/crimson-pro`): an old-style book face with the warmth of a printed guide.
  Text at 20px (its x-height is small), headings in weight 600. Default figures are proportional
  lining; `tnum` is available and used in keys and plate numbers.
- **Alegreya Sans SC** (Huerta Tipográfica, OFL-1.1, via `@fontsource/alegreya-sans-sc`): a
  humanist sans whose lowercase _are_ small caps, so captions, labels and keyed entries get true
  small caps, as on herbarium labels. Weights 400 and 500. `tnum` and `lnum` available (default
  figures are small-cap height, which suits labels).
- **Scale** (perfect fourth, 1.333, from 20px text): 15 / 20 / 26.5 / 35.5px. Labels 15px Alegreya
  Sans SC with `letter-spacing: 0.02em` (the face is already small caps; no extra tracking beyond
  that). Body 20px on 1.5, measure 62ch.

## Grid and breakpoints

The desktop page is a **two-page spread**: a text page (left) and a plate (right), divided by a
spine gutter.

```
≥ 1100px
┌──────────────────────────┬┬──────────────────────────┐
│ TEXT PAGE                ││ PLATE  (ground #E7E8DF)   │
│ heading                  ││  ┌──┐ ┌──┐ ┌──┐           │
│ entries keyed 1, 2, 3 …  ││  │1 │ │2 │ │3 │  Plate 1  │
│                          ││  └──┘ └──┘ └──┘           │
│ page ref (p. 2)          ││  (keyed figures)          │
└──────────────────────────┴┴──────────────────────────┘
```

- Each spread: text page 5 columns, plate 6 columns, 1-column spine with a 1px rule, on a
  12-column grid.
- 720–1099px: the plate follows its text page (stacked), plate grid 3 columns.
- Under 720px: one column, plate after its text, **plate grids two columns** with keys under each
  figure.
- Plate ground is a tone, not a card: no border radius, no shadow, a hairline rule border.

## Colour tokens

| Token        | Hex       | Use                                           | Contrast                            |
| ------------ | --------- | --------------------------------------------- | ----------------------------------- |
| `--page`     | `#F6F6F1` | text page                                     | —                                   |
| `--ink`      | `#262520` | text                                          | 14.2 : 1 on page, 12.4 : 1 on plate |
| `--plate`    | `#E7E8DF` | plate ground                                  | —                                   |
| `--rule`     | `#CFCFC4` | hairlines, plate borders (decorative)         | —                                   |
| `--ink-soft` | `#5D5B52` | captions and labels                           | 6.3 : 1 on page, 5.5 : 1 on plate   |
| `--link`     | `#2F5D4A` | links (a deep sap green, used only for links) | 6.9 : 1 on page                     |

Natural pigment tones, **data only** (each checked ≥ 3 : 1 on the plate ground):
olive `#6B7F3A` (3.6), ochre `#94742C` (3.6, darkened from the direction's `#A9893F`, which was
2.7 : 1), umber `#7A4E3B` (5.7), slate `#4E6E7E` (4.4), madder `#9A4A4A` (4.9), indigo `#3E4E78`
(6.6), heather `#7A5C7E` (4.7), sap `#4F6B4A` (4.8).

No cream and terracotta: the page is a cool off-white and the only accent outside data is the
deep green of the links.

## Signature element: keyed plates

The same device everywhere: a numbered plate on the right, keyed entries on the left.

- **Plate 1, the tissue**: the data hero as small multiples (below).
- **Plate 2, projects**: the three project figures, keyed 1–3, entries on the facing page.
- **Plate 3, publications**: highlight figure panels as plate entries keyed to their citations.
- **Plate 4, people**: portraits keyed by number; the facing page lists number, name, role.

Plate numbers and keys are real: each number on a plate appears once on the facing page.

## Navigation: key to the site, and thumb index

- **Key to the site** (home page, first text page): a short dichotomous-key style list in
  Alegreya Sans SC: each line is a plain question, dotted leader, section name and its page
  reference, for example "what we study ……… Research, p. 2". The page numbers are real: every page
  carries its number in the running foot (Home p. 1, Research p. 2, …, Join p. 6).
- **Thumb index** on every page: a column of tabs at the right edge of the spread (desktop), one
  per section, labelled in small caps, the current one in plate tone with ink text. Under 1100px
  the thumb index becomes a horizontal strip at the top that wraps to two lines on phones.

## Home page structure, and why

```
TEXT PAGE (p. 1)                        │ PLATE 1  The tissue
tagline as the heading (35px, 600)      │ ┌───┬───┬───┬───┐
intro paragraph                         │ │ 1 │ 2 │ 3 │ 4 │  small multiples:
Key to the site (nav as a key)          │ ├───┼───┼───┼───┤  one cluster each
entries 1–8: cluster names, one line    │ │ 5 │ 6 │ 7 │ 8 │
each, keyed to the plate                │ └───┴───┴───┴───┘
                                        │ [ full section, all clusters ]
────────────────────────────────────────┼──────────────────────────────
Research (3 entries, summaries)         │ PLATE 2  projects 1–3
Selected publications (3 citations)     │ PLATE 3  highlight panels
People (number, name, role)             │ PLATE 4  portraits keyed
```

Opening on the tissue itself is the most characteristic thing a spatial biology lab can show;
the field-guide logic (identify each cell type on its own, then see them together) is also the
honest way to read a cluster map.

## The data figure

Small multiples: one plate entry per cluster, each showing **only that cluster's points in its
pigment, with all other points as faint ink stipple** for context, keyed by number. Then the full
section with every cluster coloured. Facing entries give number, cluster label and point count
(`tnum`). Hover or tap on the full section still shows the cluster label. Because each cluster is
identified by position and number, not colour alone, this is the most accessible of the four hero
treatments. "Illustrative data" sits in the plate caption while illustrative.

## Other pages

- **Research**: spread with project entries facing Plate 2; each entry links to the project.
- **Project**: text page (title, summary, Question / Approach / Why it matters) facing a plate with
  the project figure as the main entry, keyed details (credit, related publications) beneath.
- **Publications**: spread with the highlights (Plate 3, panels keyed to citations), then the full
  list as a text-only "index" section, grouped by year, lab authors in small caps (Alegreya Sans
  SC), numbers in `tnum`.
- **Team**: Plate 4, portraits keyed by number; facing page with number, name (small caps), role
  and short bio, set like specimen entries.
- **About / Join**: text pages with a herbarium-label box carrying the contact details
  (institution, address, email) in ruled fields.
- **404**: "Not in this guide", using the content's not-found text, with an empty keyed frame.

## People

Portraits 3:4 in colour, set on the plate ground inside a hairline frame with the key number
below in Alegreya Sans SC. Placeholder: the same frame with a neutral concentric ellipse outline
in `--rule` and `--ink-soft`, the key number unchanged.

## Logo lockup

Mark 20px tall in `--ink`, 8px gap, lab name in Crimson Pro 600 at 20px (text size). Sits at
the top of the text page, like a guide's running head.

## Interaction, focus, print

- Links: `--link` green, underline 1px; hover thickens the underline.
- Focus: 2px ink outline, 2px offset; on plates, outline in ink on the plate tone.
- Motion: none beyond the hero label.
- Print (Team, Publications): spreads print sequentially (text, then plate), plate ground
  removed, keys kept.
- Draft marker: `labels.draft` in Alegreya Sans SC inside a small ruled label box.

## Fonts on first load

`crimson-pro-latin-wght-normal` (preloaded), `alegreya-sans-sc-latin-500-normal`,
`alegreya-sans-sc-latin-400-normal`, and Crimson Pro italic only where used. At most four.

## What this theme refuses to do

- No botanical illustration, leaves, vines, butterflies or vintage engraving pastiche. The plates
  hold real figures.
- No sepia filter, aged-paper texture or cream and terracotta.
- No keys or numbers that point nowhere.
- No rounded cards; plates are flat tones with hairlines.
