# Product page: version switch

## Problem
The Module switch only worked where a version had its own product page (5 products). Most versions live inside one
product. The CMS now stores each version's name, photos and colours (reddragon-cms
`docs/change-requests/2026-11-26-product-versions.md`).

## Approach
- `src/data/gaming.ts`: `ProductModule` (label, href, name, gallery, colors). `src/lib/cms/{api,index}.ts` map the CMS
  fields; colours share one `colorsOf` helper.
- `src/components/gaming/ProductOverview.tsx`: a version without a link but with its own data is a button. Picking it
  swaps the heading name, the gallery, the colour swatches (reset to the first) and the Manuals & Software files to
  that version's (`withVersion`: files whose title contains the version's model as whole words; a group with no match
  keeps all its files). Picking this page's version returns to the product. Links to other pages and greyed-out
  versions work as before; the switch is hidden when no other version has a page or data.
- `src/components/product/ProductLightbox.tsx`: tile photos use `object-scale-down`, so small version photos
  (482 px) are never enlarged past their own size in the viewer.

## Verify
- `npx tsc --noEmit`.
- On staging after the CMS import: AATROX M811-RGB → pick M811W-RGB-PRO: the name, photos and colours change, and
  Manuals & Software lists that version's files. Pick M811-RGB again to go back.
