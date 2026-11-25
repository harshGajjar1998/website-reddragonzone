# Hero image frames (container rule)

## Problem
On category pages the hero product image touched and crossed the bottom of the section (UI-Errors/2.png). The slot
was a 564px box starting 162px down a 688px section, so it ran 38px past the bottom edge. Images had no padded
container of their own, and the office spotlight hero and office product hero had the same flaw (images reached y=688).

## Approach
Site-wide rule: every section image sits in a fixed, padded **image frame** inside its section and never touches its
edges. The image is fitted (`contain`) inside the frame and centred vertically in it, so the space above and below is
equal and any CMS image works. Mobile heroes follow the same rule: a fixed 320px frame with the image centred in it.

- `src/lib/cms/layout.ts`: `FRAMES` per CMS slot plus `fitToFrame()`. `placed()` scales every placement (the designed
  one or the default) down to fit its slot's frame and moves it inside.
  - `category.hero` (gaming category, 1440×688): frame x 720–1360, y 64–624.
  - `category.spotlight` (office category, 1440×688): frame x 700–1360, y 48–640.
  - The default `category.hero` box is now 560×560 inside its frame.
- `src/components/office/OfficeSpecHero.tsx`: the product image now sits in a 494×592 frame, 48px from the top and
  bottom, with `object-contain` (it used to be a fixed 546×654 image ending at the section's bottom).
- Slider tiles and cards keep their designed crop inside their own clipped tile (unchanged). Mobile heroes already
  used fixed 320px frames.

## Verify
- `npx tsc --noEmit`.
- On staging, open /gaming/mice and the other gaming categories: the product clears the section's bottom edge with
  space below it. Check an office category page (spotlight) and an office product page in the same way.
