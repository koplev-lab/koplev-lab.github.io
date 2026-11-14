# Riso theme: review log

Screenshots: `npm run screens -- riso` (390, 768 and 1440 px, every page). PNGs are not
committed.

## Round 1

What works: the two-ink print gives every figure the same printed character (blue plate, pink
plate, overprint where they meet, 2px misregistration). Chivo Black headings in blue ink and the
mono figure notes read as a zine, while the single reading column keeps it calm. The contents
column and its pink current-page stroke work as navigation.

Problems found:

1. **Grain darkened the paper inside images**, so each figure sat in a visibly greyer box.
   The filter now applies grain only where there is ink; image paper equals page paper.
2. **Plates too pale**: light figures (skin atlas) nearly vanished. Blue density boosted (×1.4),
   pink plate retuned so reds and magentas print fully and blacks overprint to navy.
3. **Cover pushed the tagline off the first screen**: the first highlight is a tall figure. The
   cover is now the first landscape highlight (ratio ≥ 1.4), currently the skin Xenium map.
4. **Tall project figures** (heart atlas) dominated their rows: capped at 22rem high.
5. **Link underline included a trailing space**, and titles lacked a full stop.

## Round 2

Fixed from round 1: all of the above, confirmed at 390, 768 and 1440 px.

New problems found:

1. **Tagline ran to ten lines on phones** at 44px. Now fluid, 31px on a 390px screen.
2. **Placeholder portraits floated in empty squares** on the team page. Circles enlarged to
   fill the frame; four members per row on desktop, three on tablets, two on phones.

Checked and acceptable: contents column moves to the top (three columns on tablets, two on
phones, tap targets ≥ 24px); project, publications, about and join pages; 404; print styles.
All tests pass (parity, links, axe, no third-party URLs, zero JS).

## Round 3

Mo's direction: figures and photos must keep their original colours. The two-ink image filter is
removed; images render as published, with white figure backgrounds multiplied onto the paper so
they don't sit in white boxes. The "original in full colour" link and its label are removed
(no longer needed). Inks remain on type, rules, fills, the nav mark and placeholder portraits.

## Round 4

Mo: "the structure looks a bit odd". Diagnosis: the left contents column left a third of the
page empty and pushed everything off-centre; the hero and a five-line 44px headline competed;
the hero floated with nothing aligned to it. Changes: navigation moved to a top bar with a pink
rule; hero at full content width; tagline reduced to about 32px and set beside the intro in a
7/5 split, single column under 900px. Checked at 390, 768 and 1440 px; inner pages share the
bar. The drawing's edges were checked closely: both are straight section cuts, left unchanged.

## Round 5

Mo: hard to tell which figure belongs to which project. Cause: on the home page each figure sat
left of its text with similar spacing inside and between projects, and the figure caption fell
between two projects; on the Research page the title came after the figure, so a figure read as
belonging to the text above it. Fix: every project is now one unit opened by a pink rule and its
title, then its figure (with caption) and summary; space between projects is about four times
the space inside one. Home: figure column hugs the figure so the summary sits beside it. Research:
title and summary above the figure, figure height capped at 38rem.

## Open issues

- The home cover is a highlight figure until the interactive tissue map exists (Phase 4).
- Gut and heart project images are whole multi-panel figures; single panels would read better.
- No member photos yet.
