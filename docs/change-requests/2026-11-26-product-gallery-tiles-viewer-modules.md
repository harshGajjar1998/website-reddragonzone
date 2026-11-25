# Product gallery: tile background, larger-image viewer, module switch

## Problem
On product pages (UI-Errors/3.png, AATROX M811-RGB):
1. Gallery photos are transparent PNGs, so they float on the page background with no visible cell. The design shows
   each photo on its own tile.
2. Clicking a photo does nothing; visitors expect a larger view they can scroll through.
3. The Module buttons change nothing. The live-site import created modules with empty links, and the switch only
   kept a selection state. It also highlighted the first module even when this page is a different one.

## Approach
1. **Tile background (code, not a CMS choice).** New utility `bg-product-tile` in `src/app/globals.css`: a soft
   light-grey sweep (#f9f9fa → #e2e4e6) with a hairline edge. It is lighter than the silver gaming page and darker than
   the white office page, so it reads on both; black products contrast strongly and white ones stay visible against the
   grey edges and drop shadow. Any gallery image without a designed `bg` sits centred and padded on this tile
   (`object-contain`, `drop-product`). Images with a designed background or crop keep their Figma look.
   CMS help text asks for transparent PNGs.
2. **Viewer.** New `src/components/product/ProductLightbox.tsx`: a full-screen dialog (portal) that opens on the
   clicked photo and holds every gallery image. It has swipe or scroll snap, arrow buttons, keyboard ← → and Esc, dots
   and a counter, locks page scroll and returns focus on close. Gallery cells on desktop and mobile are now buttons.
3. **Module switch** (`src/components/gaming/ProductOverview.tsx`): each module is a version with its own page. The
   highlighted module is this page (the link to this slug, else the label matching the product name or model, else the
   unlinked one). Other modules are links; a module without a link is greyed out. If no other module has a link, the
   switch is hidden. CMS help text (`reddragon-cms/backend/app/Content/Schema.php`) explains this.

## Verify
- `npx tsc --noEmit`.
- On staging, open a product page: the photos sit on light tiles. Clicking one opens the viewer at that photo, and
  arrows, swipe, keys and Esc work. Check both the black and the white colour.
- On AATROX M811-RGB, Module is hidden until its versions get links in the CMS. On a product whose modules have links,
  the current version is highlighted and the others navigate.
