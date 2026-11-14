# Slide: the glass slide and its label

**Concept.** Everything the lab measures starts as a tissue section on a glass slide, so every
image on the site is presented the way a lab presents a specimen: on a slide, with a printed
label on the frosted end that says what it is, where it came from and who made it.

## References and what is taken from each

| Reference                                                                                                         | Taken                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard 75 × 25 mm microscope slides with a frosted label end (and colour-frosted variants used to code batches) | The 3 : 1 slide format; the frosted end as the place for all metadata; one frost colour as the single accent.                                                              |
| 10x Genomics Visium capture slides                                                                                | The **fiducial frame**: the ring of dots around each capture area, used by image registration. It frames the data figure, where it means exactly what it means in the lab. |
| Laboratory label printers (Brady, Dymo industrial labels) and slide box labels                                    | Condensed sans lettering, fields in a fixed order (ID, title, date, source), no decoration.                                                                                |
| Plastic slide storage boxes with moulded slot numbers                                                             | Navigation as numbered slots; the current slide pulled out.                                                                                                                |

## Typography

- **Archivo** (Omnibus-Type, OFL-1.1, `@fontsource-variable/archivo`): a grotesque with a
  **width axis (62–125)** and a weight axis. One family does both jobs a lab label does:
  **condensed (wdth 70–75)** for labels, slot names and metadata fields, exactly like label-printer
  type; **normal width** for running text. Headings use wdth 100 at weight 600.
- Verified features: `wght` 100–900, `wdth` 62–125, `ccmp`, `locl`. No `tnum`; IDs and dates
  are set in the condensed width in fixed-width label fields rather than aligned columns.
- **Scale** (major third, 1.25, from 17px): 13.6 / 17 / 21.25 / 26.5 / 33px. Body 17px on 1.55,
  measure 66ch. Labels 13.6px condensed, weight 500. The tagline 33px, weight 500, normal width.
- No all-caps. Label fields use sentence case, as modern label printers do.

## Grid and breakpoints

```
≥ 1024px
┌──────────┬───────────────────────────────────────────────────────┐
│ slide    │  heading / tagline                                    │
│ box      │  ┌───────┬───────────────────────────────────────┐    │
│ ┌──┐ 1   │  │label  │  specimen area: figure / photo / map   │    │
│ ┌──┐ 2 ▸ │  │end    │                                       │    │
│ ┌──┐ 3   │  └───────┴───────────────────────────────────────┘    │
│ …        │  text column (66ch)                                    │
└──────────┴───────────────────────────────────────────────────────┘
```

- 12 columns: slide box 2, content 10 (text 7, figures may use all 10).
- A **slide** is a 3 : 1 frame: label end one quarter of the length, specimen area three quarters.
  Images keep their own aspect ratio inside the specimen area (letterboxed on the glass tone,
  never cropped to fit), so figures are never distorted or cut.
- 720–1023px: the slide box becomes a two-row strip of slide ends above the content.
- Under 720px: slides rotate to **portrait**: label end on top (as a strip), specimen area below,
  full width. Slide box becomes a 2 × 3 grid of slide ends at the top. This is designed, not
  squeezed: a slide held vertically.

## Colour tokens

| Token        | Hex       | Use                                                                            | Contrast                             |
| ------------ | --------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| `--glass`    | `#EEF3F2` | page ground and specimen areas: a flat, cool glass tone                        | —                                    |
| `--frost`    | `#FBFBF8` | label ends and text panels                                                     | —                                    |
| `--ink`      | `#17191B` | text                                                                           | 15.7 : 1 on glass, 17.0 : 1 on frost |
| `--eosin`    | `#B0305C` | the one accent, named for the H&E counterstain: links, the current slot, focus | 5.5 : 1 on glass, 5.9 : 1 on frost   |
| `--ink-soft` | `#545A5C` | label field names, credits                                                     | 6.3 : 1 on glass                     |
| `--edge`     | `#B7C4C2` | the slide edge line (decorative)                                               | —                                    |

Glass is a **flat tint with a single 1px edge line**. No transparency, blur, reflections or
glassmorphism of any kind.

Data colours: eight flat stain-inspired hues for clusters, set and checked (≥ 3 : 1 on glass)
in Phase 4.

## Signature element: the fiducial frame and the label end

- The **data figure** sits inside a Visium-style fiducial frame: a square of small ink dots
  around the capture area, with the corner pattern that marks orientation. To the field it is
  instantly recognisable; to anyone else it reads as a precise frame.
- **Every image** (figures, portraits) sits on a slide whose frosted label end lists, in order:
  an ID (`P1`, `H2`, `M3`: project, highlight, member, with their real order), title or name, date
  or year, and source/credit. The label is the caption; nothing is shown without one.

## Navigation: the slide box

A vertical column of six slots, each a slide end seen from above with its label (section name
in condensed Archivo) and the moulded slot number to its right (1–6, the real section order).
The current slide is pulled out 12px to the right, its label end in `--eosin` text. Mobile: the
2 × 3 grid of slide ends described above, 48px tall each.

## Home page structure, and why

```
slide box │ tagline (33px)                                    lab name sits
          │ intro paragraph                                   in the slide box
          │ ┌label─┬── fiducial frame ──────────────────────┐   header, 15px
          │ │ D1   │ · · · · · · · · · · · · · · · · · ·   │
          │ │ title│ ·   tissue map (data hero)          · │
          │ │ date │ · · · · · · · · · · · · · · · · · ·   │
          │ └──────┴────────────────────────────────────────┘
          │ Research: three project slides (P1–P3), stacked
          │ Selected publications: three highlight slides (H1–H3)
          │ People: a strip of portrait slides, two per row
          │ Join: a frosted panel with the join text
```

Why: it opens on the data in the frame the field uses for it, labelled like a real specimen.
Stacked slides make a calm, single-column reading order that holds up for funders.

## Other pages

- **Research**: the three project slides, larger, with summaries beside the label.
- **Project**: one large slide (figure + label with credit), then text; people as small portrait
  slides; related publications listed on a frosted panel.
- **Publications**: highlight slides first; the full list on frosted panels by year, lab
  authors in weight 600, the DOI in condensed type as the "ID" field.
- **Team**: portrait slides, two per row on desktop, one on mobile; label: ID, name, role,
  start year when known.
- **About / Join**: text on frosted panels.
- **404**: an empty slide with a blank label, and the not-found text.

## People

Portraits in colour, **square**, centred in the specimen area of a slide (glass tone around them),
label end with ID, name, role. Placeholder: the same slide with a flat circle outline in
`--ink-soft` in the specimen area (an unstained section outline), the label filled as usual.

## Logo lockup

Mark 18px in `--ink`, 8px gap, lab name in Archivo condensed 600 at 15px, at the top of the
slide box (desktop) or the top strip (mobile).

## Interaction, focus, print

- Links: `--eosin`, 1px underline. Hover: underline thickens.
- Focus: 2px `--eosin` outline, 2px offset, on both glass and frost.
- No motion. The pulled-out slot is static.
- Print (Team, Publications): slides print as bordered boxes with their labels, glass tone
  removed.
- Draft marker: an extra label field "status: `labels.draft`" in `--eosin` on the item's label.

## Fonts on first load

`archivo-latin-wdth-normal` (variable width and weight, preloaded), plus latin-ext when needed,
and the italic only if used. One to three files.

## What this theme refuses to do

- No glassmorphism, blur, transparency or reflections; glass is a flat tint.
- No microscope illustrations, DNA, petri dishes or lab-equipment clip art.
- No image without a label; no cropping a figure to fit a slide.
- No purple: the only accent is the eosin pink-red, used sparingly.
