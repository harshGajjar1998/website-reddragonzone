# Colour swatches switch the product photo

Date: 2026-11-25 · Branch: feature/cms-integration · CMS change: same date in reddragon-cms

## Problem
Picking a colour swatch on a product page only changed the "Color …" label, and the photos stayed the same. Each colour in the CMS had only a name and a colour code, with nothing linking it to a picture. Imported products can't be linked automatically either: 119 products have several colours, but many colour names are plain hex codes, and the per-colour photos from the old site were too small to import.

## Approach
- CMS: each colour gets an optional "Photo in this colour" (`colors.*.image`). It uses the same fixed slot size as the gallery (`product.colors.*.image` in ImageSpecs).
- Website (`ProductOverview`): when the picked colour has a photo, that photo fills the first gallery cell. If the gallery already contains it, it moves to the front instead. The number of cells stays the same, so the layout never changes. On phones, the carousel scrolls back to the first photo.
- Colours without a photo behave as before: the label changes and the gallery stays.

## Files
src/lib/cms/api.ts, src/lib/cms/index.ts, src/data/gaming.ts, src/components/gaming/ProductOverview.tsx; CMS backend/app/Content/Schema.php, backend/app/Content/ImageSpecs.php

## Verify
1. In the CMS, open a product with two colours, add a photo to the second colour and publish.
2. On the product page, click the second swatch. The first gallery picture changes to that photo. Click the first swatch: the original gallery returns.
3. On a phone, after swiping the carousel, pick the colour again. The carousel scrolls back to show the photo.

## Not covered
The featured "special" product heroes (FeaturedHero, OfficeSpecHero) use hand-placed Figma renders, so their swatches still change only the label.
