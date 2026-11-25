# CMS catalogue: working filters and a build that survives 650+ products

Date: 2026-11-25 · Branch: feature/cms-integration

## Problem
- After the live-site import, the CMS has 662 published products in 15 categories. Every product and category already had a page, sat in the sitemap and appeared in the header menu (checked against the hosted CMS bundle and the live sitemap: 0 missing).
- **Filters returned almost nothing.** Filters match product `tags`, but the imported products carry the old site's sub-category tags ("Mechanical Keyboards", "CPU Coolers", "Monitor"), and 151 have no tags. For example, Gaming → Mice → Wired showed 0 of 105, and PC Components (90 products) had only a Connectivity filter that matched none.
- **Deploys failed.** The bundle is now over 2 MB, which is Next's fetch-cache limit, so each of the ~700 pages downloaded it again. The 2026-11-24 runs either failed with "Could not reach the CMS … fetch failed" or were cancelled after an hour, so later CMS changes didn't go live.

## Approach
- `listingFor(category, products)` (src/lib/cms/index.ts) builds each category page's filters and products:
  - A product matches a filter option that is in its tags, or that its name, tagline, tags or spec lines contain as a whole word ("Wired" doesn't match "Wireless"; "TKL (80%)" also matches "TKL").
  - Tags that no filter option covers (CPU Coolers, Cases, Soundbars, RGB Mice …) become a **Type** group above the CMS groups.
  - Options and groups that match no product in the category are hidden, so no filter leads to an empty grid.
  - The result is stored on the product as `filterTags` (category page only); `tags` is unchanged, so spec panels and Compare are unaffected. The CMS filter definitions and the layout are unchanged.
- `scripts/build.mjs` fetches the bundle once to `node_modules/.cache/redragon/cms-bundle.json` and passes `CMS_BUNDLE_FILE`. `fetchBundle()` (src/lib/cms/api.ts) reads that file once per build worker. `next dev` and the draft preview still fetch live.

## Files
- src/lib/cms/index.ts: `listingFor`
- src/lib/cms/api.ts: `CMS_BUNDLE_FILE` read path
- src/app/gaming/[category]/page.tsx, src/app/office/[category]/page.tsx: use `listingFor`
- src/components/gaming/CategoryListing.tsx: filter on `filterTags`
- src/data/gaming.ts: `filterTags` type
- scripts/build.mjs: single bundle fetch

## Verify
- `CMS_API_URL=<hosted CMS> npm run build`: the log shows "CMS bundle saved for this build" and no "items over 2MB" warnings.
- /gaming/pc-components/: a Type filter (Cases, CPU Coolers, Monitor, Power Supplies, Fans) narrows the grid.
- /gaming/mice/: Connectivity → Wired shows wired mice. /gaming/keyboards/: Keyboards Type → Mechanical shows mechanical keyboards.

## Still content work (CMS)
Text matching can't cover options like DPI ranges, button counts or colours. Those need tags on the products in the CMS. Mouse pads, laptop accessories and DIY accessories have nothing to filter on yet, so they show no filter options.
