# Breadcrumbs: smaller, and never over the hero image

## Problem
On category pages the desktop breadcrumb was 24 px Lexend Giga, a very wide font, and couldn't wrap. A long category
such as "HOME / GAMING PRODUCTS / MECHANICAL KEYBOARDS" ran across the hero image (`UI-Errors/4.png`). A breadcrumb is
secondary navigation, so it should be clearly quieter than the page title (64 px). The product page breadcrumbs
(20 px, ending in the full product name) had the same risk.

## Approach
- `src/components/gaming/CategoryHero.tsx`:
  - The desktop breadcrumb is now 15 px with slight letter spacing, in ink at 75%; the current page stays red.
  - It is held inside the copy column (`max-w-[620px]`, which ends before the image frame at 720 px).
  - A name that is still too long ends in "…", with the full name on hover.
  - It is moved down 10 px so the gap to the title stays the same.
- `src/components/gaming/FeaturedHero.tsx`, `src/components/office/OfficeSpecHero.tsx` (product pages, desktop):
  - The breadcrumb is 16 px (was 20) and kept within 600 px.
  - The category links never shrink; the product name ends in "…", with the full name on hover.
- The mobile breadcrumbs already wrap at 14 px and are unchanged.

## Verify
- `npx tsc --noEmit`.
- On staging (desktop):
  - Gaming › Mechanical Keyboards: the breadcrumb is small and ends well before the keyboard image.
  - A product with a long name: the breadcrumb ends in "…" before the product image.

## Product titles (added)
- `OfficeSpecHero.tsx`: the 56 px title couldn't wrap, so a name like "WIRELESS MOUSE BM-4186G" ran into the product
  image.
  - The spec column (breadcrumb, title, colours, rule, description) is now one top-to-bottom stack, 600 px wide, with
    the design's spacing kept for short names. A wrapped title pushes the rest down instead of overlapping.
  - Title size steps by name length: 56 px up to 12 characters, 44 px up to 18, else 36 px. The longest office name
    (30 characters) takes two lines and stays inside the 688 px hero.
- `FeaturedHero.tsx` (gaming): the title already wrapped in 640 px. Names over 28 characters now use 44 px, so they
  never reach a third line over the colours. The longest is 36 characters.
