# Card index: the lab as a card catalogue

**Concept.** The site is a card catalogue: every project, paper and person is a ruled index card
with a real call number, filed behind guide cards whose staggered tabs are the navigation.

## References and what is taken from each

| Reference                                                                                  | Taken                                                                                                                                   |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Carl Linnaeus's paper slips (Uppsala, 1760s), often cited as the first index cards         | The idea of knowledge kept on separate, re-orderable slips, each with one subject; a Swedish origin for a Stockholm lab.                |
| Library card catalogues (Library Bureau 3 × 5 in cards, Library of Congress printed cards) | Card anatomy: call number top-left, heading, body, tracings at the foot, the red top rule and blue ruled lines of standard index cards. |
| Guide cards with cut tabs (1/5 and 1/3 cut)                                                | Staggered tabs dividing a drawer into sections; the current section's guide card in front. Used as navigation.                          |
| Typewritten catalogue entries                                                              | Typed headings and fields, set apart from typeset reading text.                                                                         |

## Typography

- **Libre Caslon Text** (Impallari Type, OFL-1.1, `@fontsource/libre-caslon-text`) for all reading
  text and the tagline: a Caslon cut for screen text, the face of library printing. Weights 400,
  400 italic, 700. `tnum` available (verified) for call numbers set in it.
- **Courier Prime** (Alan Dague-Greene, OFL-1.1, `@fontsource/courier-prime`) for what is
  **typed on cards**: call numbers, field names, headings of entries, the guide-card tab labels.
  It is a monospace with real typewriter proportions, made to be read at length (it was drawn for
  screenplays). It is never used for running text paragraphs.
- **Scale** (minor third, 1.2, from 18px): 12.5 / 15 / 18 / 21.6 / 26 / 31px; tagline 31–37px
  Caslon 400. Body 18px on 1.6 (Caslon needs air), measure 62ch. Typed text 15px Courier Prime.
- No all-caps, no letter-spaced labels.

## Grid and breakpoints

```
≥ 1024px
 ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   guide tabs
─┴──────┴───┴──────┴───┴──────┴───┴──────┴───┴──────┴───┴──────┴─  (staggered)
┌────────────────────────────────────────────┐
│ red rule ─────────────────────────────────── │   front card: the page
│ call no.        HEADING (typed)              │   (8 of 12 columns,
│ ─────────────────────────────────────────── │    left-aligned, with
│ body text on blue rules (Caslon)             │    filed cards visible
│ ─────────────────────────────────────────── │    behind it at right)
│                    ○  (rod hole)            │
└────────────────────────────────────────────┘
```

- 12 columns. The front card takes 8, left-aligned; on wide screens the next two cards in the
  section show behind it, offset up and right by 8px each, so the page reads as a filed stack.
- Cards vary in height with their content; nothing is forced into a uniform grid.
- 720–1023px: cards take 10 columns, no stack offset.
- Under 720px: cards full width with 16px side gutters; guide tabs become a 3 × 2 grid of tabs at
  the top (same staggered tops within each row).
- Ruled lines align to the text baseline grid (18px × 1.6 = 28.8px), so body text sits on the rules
  as on a real card.

## Colour tokens

| Token        | Hex       | Use                                                                | Contrast                             |
| ------------ | --------- | ------------------------------------------------------------------ | ------------------------------------ |
| `--drawer`   | `#E3E4DF` | page ground: the drawer, cool grey                                 | —                                    |
| `--card`     | `#FFFFFF` | card stock                                                         | —                                    |
| `--ink`      | `#222222` | typed and printed text                                             | 15.9 : 1 on card, 12.5 : 1 on drawer |
| `--red`      | `#B5322A` | the one accent: the card's top rule, links, the current tab, focus | 6.1 : 1 on card, 4.8 : 1 on drawer   |
| `--rule`     | `#A9C0D9` | blue ruled lines (decorative, behind text)                         | —                                    |
| `--ink-soft` | `#5A5A5A` | tracings, credits                                                  | 6.9 : 1 on card                      |
| `--edge`     | `#C9CAC4` | card edges (1px)                                                   | —                                    |

Data colours: eight muted inks (typewriter-ribbon and stamp-pad colours) for clusters, set and
checked (≥ 3 : 1 on card) in Phase 4.

## Signature element: the catalogue card with a real call number

Every item is a card with:

- **Call number**, top-left, typed: a real identifier. Publications: the DOI. People: the ORCID
  iD when known, otherwise their role and start year. Projects: `P` + number + year of the
  latest related publication. Highlights: `F` + figure number + the DOI.
- **Heading**, typed; **body** in Caslon on the blue rules; **tracings** at the foot (as library
  cards list subject headings): for a project, its people and related papers; for a person, their
  projects.
- The red top rule, blue rules, and a rod hole at the bottom centre. (If the rod hole reads as
  kitsch in review, it is removed; the call number and tracings are the essential parts.)

## Navigation: guide-card tabs

Six guide-card tabs across the top, one per section, each one-sixth of the width, with tops at
three staggered heights like cut tabs in a drawer. Tab labels typed in Courier Prime. The current
section's tab is joined to the front card (same white, no border between), the others sit
slightly behind in the drawer tone with an edge line. Order is the real section order.

## Home page structure, and why

```
guide tabs
┌ front card: "title card" ─────────────┐
│ tagline (Caslon 31–37px)               │
│ intro paragraph                        │
│ tracings: affiliations, contact        │
└────────────────────────────────────────┘
┌ data card ───────────────────────────┐  the tissue map on a card,
│ F1   tissue map (data hero)           │  key typed beneath
└──────────────────────────────────────┘
Research: three project cards (P1–P3), each with its figure
Selected publications: three highlight cards with figure + DOI call numbers
People: one card listing names and roles, typed (a "shelf list")
Join: a card with the join text and contact
```

Why: a card catalogue is how scientists' knowledge was organised for centuries, and it makes
honesty structural: every card carries its source (call number) and its connections (tracings).
It feels relatable and hand-kept, not slick.

## The data figure

Printed on a card, full card width, with the call number `F1` and the typed heading. The key is
typed beneath as a list (swatch, cluster name, cell count with `tnum`). Hover or tap shows the
label. "Illustrative data" in the tracings while illustrative.

## Other pages

- **Research**: a filed stack of the three project cards, each with figure, summary and tracings.
- **Project**: the project card, larger, with figure (credit in the tracings), body, people and
  papers as tracings, each linking.
- **Publications**: highlight cards first; then the full list as a "shelf list": compact cards
  grouped behind year guide cards, DOI as call number, lab authors in Caslon bold.
- **Team**: one card per person, photo top-right, call number (ORCID), name typed, role, bio,
  links. Alumni as a single shelf-list card.
- **About / Join**: long-form text on a sequence of cards (one per section of the text).
- **404**: a card typed "no card filed under this address" using the content's not-found text.

## People

Portraits 3:4, in colour, set in the top-right corner of the person's card inside a 1px box, as a
photo mounted on a record card. Placeholder: the same box with two thin diagonal lines corner to
corner, the paste-up convention for "image goes here", in `--ink-soft`.

## Logo lockup

Mark 16px in `--ink`, 8px gap, lab name typed in Courier Prime 15px, at the top-left above the
guide tabs.

## Interaction, focus, print

- Links: `--red`, 1px underline; hover thickens.
- Focus: 2px `--red` outline, 2px offset.
- No motion; the current tab does not animate.
- Print (Team, Publications): each card prints as a bordered box with its rules removed, call
  numbers kept.
- Draft marker: `labels.draft` typed in `--red` at the top-right of the card, like a status stamp
  but flat and small (no rotation, no texture).

## Fonts on first load

`libre-caslon-text-latin-400-normal` (preloaded), `courier-prime-latin-400-normal`,
`libre-caslon-text-latin-400-italic`, plus latin-ext only when needed. At most four.

## What this theme refuses to do

- No rounded corners, drop shadows, paper textures, coffee stains, tape or paper clips.
- No rotated "stamps", no grunge typewriter fonts.
- No uniform card grid: cards are filed, varied in height, left-aligned.
- No call numbers that are invented: every one is a DOI, ORCID or derived from real order.
