# Figure theme: review log

Screenshots: `npm run screens -- figure` (390, 768 and 1440 px, every page). PNGs are not
committed; regenerate them to compare.

Question asked each round: would a design-literate scientist believe a person made this, and does
it follow `DESIGN.md` and PLAN.md §6.1?

## Round 1

What works: pages read as figures (lettered panels, journal caption at the foot). The tagline is
the largest element; the lab name stays at 15px. No cards, shadows, icons or gradients. The nav
as a list of figures reads naturally.

Problems found:

1. **Missing spaces** between inline elements ("disease.About the lab", "…disease.Nature
   Immunology(2026)"). Cause: Astro 7's default `compressHTML: 'jsx'` drops whitespace between
   elements. Fixed site-wide with `compressHTML: true` (HTML-style collapsing), which is also
   safer for future theme authors.
2. **Credits between image and title** in the small multiples (home projects and highlights)
   competed with the titles. Moved those credits into the page caption, which is where journals
   put them. Single large figures keep the credit under the image.
3. **Fixed 4:3 frames on phones** left large blank areas under wide figures (the Crohn's panel
   is about 3.3:1). Frames now apply only from 760px up, with images sitting on the frame's
   bottom edge so titles line up across a row; on phones images keep their own proportions.
4. **Source panel letters inside crops** (a "b" in two crops, a "g" in another) collided with
   this theme's own panel letters. Removed from the three crops; credits now say "(cropped,
   panel label removed)", as CC BY requires changes to be indicated.
5. **Team portraits** were 290px grey squares and dominated the page. Now six per row on
   desktop (four on tablets, two on phones), placeholder grey lightened to `#F2F2F2`, and the
   role line under each name dropped (the group heading already says it).
6. **Project pager**: the next/previous links did not say which was which. Each now carries its
   real figure number ("Fig. 2b …").
7. Found while testing: **theme CSS leaked across themes** in preview mode, because Astro
   bundles the CSS of every component a route imports. All global theme CSS is now scoped under
   `:root[data-theme='<id>']` in a cascade layer; a test checks the scope attribute.

## Round 2

Fixed from round 1: all of the above, confirmed at 390, 768 and 1440 px.

New problems found:

1. **Stray spaces before commas** in author lists ("Simon Koplev , Osheen Sharma ,") once
   whitespace was preserved. Fixed by building the author list as text pieces in code
   (`src/lib/authors.ts`), shared with the reference theme.
2. **Blank highlight images at 768px** in screenshots only: lazy-loaded images were never
   scrolled into view. The screenshot script now scrolls the page and waits for images.
3. **Print**: fixed image frames printed as large empty boxes, and team portraits printed at
   full width. Print styles now release frame ratios, cap image height at 70mm and keep the team
   grid at four per row.

Checked and acceptable:

- Tablet (768px): mosaic falls back to full-width panels with people and join side by side;
  reading order matches the panel letters.
- Phones (390px): panels stack in letter order; nav wraps to two lines, no menu button; tap
  targets at least 24px.
- Publications: highlight panels, then the reference list with years in a left column and
  stable numbers right-aligned with tabular figures.

## Open issues (content, not design)

- **Project thumbnails** for the gut and heart projects are whole multi-panel figures; at
  thumbnail size they are unreadable. Simon should pick one panel per project (the heart figure
  is CC BY-NC-ND, so it cannot be cropped; a different image is needed for a thumbnail).
- **Panel b on the home page** is an empty set of axes until the data figure is built in
  Phase 4. Its legend and isolation controls are specified in `DESIGN.md`.
- All team members show the placeholder marker until photos are supplied.
