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

## Open issues

- The home cover is a highlight figure until the interactive tissue map exists (Phase 4); then
  the map becomes the cover, printed with the theme's ink tokens.
- Gut and heart project images are whole multi-panel figures; single panels would print better.
- No member photos yet.
