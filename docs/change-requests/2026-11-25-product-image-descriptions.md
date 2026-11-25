# Change request: product and colour photo descriptions from the CMS, 2026-11-25

## Problem
Product main photos and colour photos had no image description (alt text) of their own: the website always used the product name, or "name + colour". Blind visitors and search engines got no description of what the photo shows. The CMS now asks editors for one (CMS change request `2026-11-25-accessibility-and-recovery.md`, item 14).

## Approach
- The CMS public API sends `image_alts` (one per photo, same order as `images`, `''` = none) and `colors[].image_alt`.
- `src/lib/cms/api.ts`: the two optional fields.
- `src/lib/cms/index.ts`: the main product image takes `image_alts[0]` as `alt` when set; a colour photo uses `image_alt`, falling back to "name colour" as before.
- `src/data/gaming.ts`: `GamingProduct.image.alt` (optional).
- `ProductOverview.tsx`: the gallery's first picture uses the description, falling back to the product name.
No layout or style changes.

## How to verify
- `npx tsc --noEmit`, `npx eslint src`.
- Set an image description on a product's first photo and on a colour photo in the CMS, rebuild: the product page `<img alt>` shows the descriptions; products without one still show the name.
