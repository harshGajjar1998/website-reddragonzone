# Category pages: 12 products per page, no gap above pagination, "Filters" heading

Date: 2026-11-25 · Branch: feature/cms-integration

## Problem
- Category pages showed only 5 products on page 1 (2 large + 3 small) and 9 on later pages. That is too few for categories with 100+ products.
- The product grid had a fixed minimum height of 1290 px (and the section 1680 px), so a short page left a large empty gap above the pagination.
- The filter sidebar's heading read "Category" instead of naming the filters.

## Approach
- The Show options are now 12 / 24 / 36, with 12 as the default. Later pages hold N small cards; page 1 holds the 2 large cards plus N small ones (14 by default). N is a multiple of 6, so rows are full on desktop (3 across) and mobile (2 across).
- Removed the `min-h-[1290px]` on the product grid and `min-h-[1680px]` on the desktop section, so pagination follows the last row.
- Sidebar heading: "Category" → "Filters".

## Files
- src/components/gaming/CategoryListing.tsx (`SHOW_OPTIONS`, `DEFAULT_SHOW`, `LARGE_CARDS`)

## Verify
- /gaming/mice/: page 1 has 14 product cards and the next page has 12. Show 24 gives 26, then 24.
- On the last page of a category, pagination sits 40 px under the last row.
