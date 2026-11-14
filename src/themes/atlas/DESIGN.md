# Atlas: a topographic map sheet of the tissue

**Concept.** Spatial transcriptomics maps tissue the way surveyors map land, so the site is laid
out as a printed topographic map sheet: the map face carries the science, and the collar around
it carries the title, legend, sources and the index to the other sheets.

## References and what is taken from each

| Reference                                                                                                           | Taken                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lantmäteriet's Swedish topographic map sheets (Terrängkartan 1:50 000) and Ordnance Survey Landranger sheets        | The **collar**: sheet title, legend panel, publication note with sources and dates, the "adjoining sheets" diagram used here as navigation.                                                                    |
| Eduard Imhof, _Kartographische Geländedarstellung_ (1965; English edition _Cartographic Relief Presentation_, 1982) | Restraint with colour: few inks, each with one job; contours as fine brown line, water in blue; lettering placed for the feature, not for decoration.                                                          |
| Map lettering conventions as used on Swiss national maps (swisstopo)                                                | Map lettering roles: letter-spaced small capitals for regions, roman for named places, italic for water. Here: small caps name areas of work, roman names things, italic is reserved for captions and sources. |
| The Human Cell Atlas reference maps                                                                                 | The idea of a reference map that others navigate by; legends with every class named.                                                                                                                           |

## Typography

- **Spectral** (Production Type, OFL-1.1, `@fontsource/spectral`) for text and headings: a screen
  serif with the narrow, crisp proportions of map lettering and enough colour at 18px for
  reading. Default figures are **tabular lining** (verified), good for grid references.
- **Spectral SC** (same designers, OFL-1.1, `@fontsource/spectral-sc`), a true small-caps cut,
  for the cartographic role of region names: section headings, legend headings, people's names on
  the team sheet, and the lab name. Real small caps, so letter-spacing (`0.08em`) is justified,
  as on a map.
- Weights: Spectral 400, 400 italic, 600; Spectral SC 500. Two families, one design.
- **Scale** (perfect fourth, 1.333, from 18px): 13.5 / 18 / 24 / 32 / 42.5px. Body 18px on 1.55,
  measure 64ch. Collar text 13.5–15px. The sheet title (tagline) at 32–42px, weight 400, not bold:
  map titles are large but calm.

## Grid and breakpoints

```
≥ 1100px
┌─────────────────────────────────────────────────────────────────────┐
│ collar top: lab name (SC) ······························ sheet 1 of 6│
├──────────────────────────────────────────────────┬──────────────────┤
│  neatline ┌────────────────────────────────────┐ │ SHEET TITLE      │
│     A  B  C  D  E  F  (grid ticks)              │ │ (tagline)        │
│  1 │                                          │ │ │ legend           │
│  2 │   MAP FACE: data hero / page content     │ │ │ adjoining sheets │
│  3 │                                          │ │ │ (navigation)     │
│    └────────────────────────────────────────────┘ │ publication note │
├──────────────────────────────────────────────────┴──────────────────┤
│ collar foot: affiliations, sources, contact                         │
└─────────────────────────────────────────────────────────────────────┘
```

- 12 columns; the map face takes 8, the collar panel 4, on the right as a side panel.
- 760–1099px: collar panel moves below the map face, legend and adjoining-sheets side by side.
- Under 760px: the collar's **sheet title comes first**, then the map face full width, then
  legend, then the adjoining-sheets diagram (full width, 3 × 2 tappable cells), then the
  publication note. Grid ticks on figures reduce to every second letter.
- Inner pages: the map face holds the page content in a 64ch column with figures breaking out to
  the full face width; the collar panel keeps title, legend (when the page has a figure), sheet
  index and sources for that page.

## Colour tokens

Map paper and four inks, each with one job, as in Imhof.

| Token        | Hex       | Job                                                                               | Contrast on paper    |
| ------------ | --------- | --------------------------------------------------------------------------------- | -------------------- |
| `--paper`    | `#F6F7F3` | map paper, cool white (not cream)                                                 | —                    |
| `--ink`      | `#1D1F1E` | lettering, neatlines                                                              | 15.4 : 1             |
| `--water`    | `#1F5F8B` | the one accent: links, current sheet, focus                                       | 6.4 : 1              |
| `--contour`  | `#A57B54` | fine rules and figure grid ticks only (decorative, never text)                    | 3.5 : 1              |
| `--tint`     | `#DCE6D0` | vegetation tint: fills for the legend box and the current cell of the sheet index | ink on tint 12.8 : 1 |
| `--ink-soft` | `#5B605C` | publication note, credits                                                         | 6.0 : 1              |

Data colours (the map face only) follow land-cover logic: eight flat, muted classes chosen for
distinguishable lightness, each named in the legend. Final hex values are set and checked
(≥ 3 : 1 on paper) when the data figure is built in Phase 4.

## Signature element: the map collar

Every page is a sheet with a collar: sheet title, a legend for whatever figure is on the sheet,
the **adjoining-sheets diagram** (navigation), and a **publication note** listing the sources
for that sheet (figure credits, data source, "illustrative data" while it is). The collar is where
honesty about sources lives, which is what map collars are for.

Grid references are real. Figures carry a neatline with lettered and numbered ticks; the legend
gives each cluster's densest grid square ("Fibroblasts C4"), computed from the data. Captions can
point into a figure by square.

## Navigation: the adjoining-sheets diagram

A small 3 × 2 diagram of six rectangles, one per section, each lettered with its name (13.5px),
the current sheet filled with `--tint` and set in 600. It sits in the collar panel on every page,
exactly where the adjoining-sheets diagram sits on a printed sheet. The sheet number in the top
collar ("sheet 2 of 6") is real: each section is a sheet in a fixed order. On mobile the diagram
is full width with 44px cells.

## Home page structure, and why

The map face holds the **tissue map** (data hero) at full face width, framed by a neatline with
grid ticks. The collar panel holds the **sheet title** (tagline), the legend (clusters with grid
squares), the adjoining sheets, and the publication note (lab, affiliations, data source).

Below the sheet, three short "insets" (small map-face frames, as maps inset detail areas): the
projects (figure thumbnail + title + summary), the highlights, and a line of people. Then the join
paragraph in the collar foot.

Why: the first thing a visitor sees is tissue mapped at single-cell resolution, with every class
named, which is the lab's work. The lab name sits in the top collar at 15px small caps.

## The data figure

The map face: cells or spots plotted at their coordinates in the land-cover palette, a neatline
with grid ticks A–H and 1–6, and a scale bar **only** when the data provides a physical scale
(`meta.micronsPerUnit`); otherwise no scale bar and the publication note says "coordinates
normalised". Legend in the collar: swatch, cluster name, grid square. Hover or tap shows the
name. "Illustrative data" in the publication note while illustrative.

## Other pages

- **Research** (sheet 2): projects as insets on the map face, each with its figure inside a
  neatline, title, summary.
- **Project**: its own sheet: title in the collar, figure as the map face with credit in the
  publication note, body text below, people and references in the collar.
- **Publications** (sheet 3): highlights as insets (figure, finding, citation); the full list
  as a "gazetteer" set in two columns on desktop, grouped by year, lab authors in Spectral SC.
- **Team** (sheet 4): portraits as small insets with neatlines, names in Spectral SC, roles in
  roman, bios short.
- **About / Join**: text on the map face, contact details in the collar.
- **404**: "Off the map", from the content's not-found text, with an empty neatline frame.

## People

Square portraits in colour inside a double neatline (thin outer, heavier inner, the map frame),
name in Spectral SC below. Placeholder: the same frame with three concentric contour rings in
`--contour`, centred: the map symbol for a hill, neutral and geometric.

## Logo lockup

Mark 14px tall in `--ink`, 8px gap, lab name in Spectral SC 500 at 15px, top-left of the collar.

## Interaction, focus, print

- Links: `--water`, 1px underline; hover thickens it.
- Focus: 2px `--water` outline, 2px offset.
- No motion; the figure's hover label only.
- Print (Team, Publications): the collar prints at the foot of each page, figures keep their
  neatlines, one column.
- Draft marker: `labels.draft` in Spectral SC in a thin `--contour` box, in the collar beside the
  item.

## Fonts on first load

`spectral-latin-400-normal` (preloaded), `spectral-latin-400-italic`, `spectral-sc-latin-500-normal`,
plus latin-ext only for names that need it. Three to four files.

## What this theme refuses to do

- No compass rose, north arrow, treasure-map parchment or antique cartouche. Tissue has no north.
- No fake scale bars or grid references that point nowhere.
- No topographic contour backgrounds as decoration.
- No more inks than the five above, plus data.
