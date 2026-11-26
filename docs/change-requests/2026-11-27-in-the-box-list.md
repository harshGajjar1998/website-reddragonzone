# Product page: In the Box from the CMS list (2026-11-27)

## Problem
The Product Details panel's "In the Box" only read a CMS "Detail panel" titled "In the Box". Otherwise it showed "<name> and user manual." The CMS "In the Box" list (filled for 142 products from the Redragon team list) was never shown.

## Approach
- **Use the CMS list:** `lib/cms/index.ts` maps `in_box` to `inBox`.
- **Show it as a list:** `ProductPanel.tsx` shows it as a bulleted list, like the specification lines.
- **Fallbacks:** without a list it uses the detail panel text, then the default sentence, as before.

## Files
`src/data/gaming.ts`, `src/lib/cms/index.ts`, `src/components/product/ProductPanel.tsx`.

## Verify
- `tsc` is clean.
- A product with In the Box items, for example Draconic K530-RGB → Product Details → In the Box lists each item.
