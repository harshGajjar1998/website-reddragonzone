# Product catalogue loaded on demand instead of built into every page

Date: 2026-11-25 · Branch: feature/cms-integration

## Problem
Since the live-site import, every one of the ~700 pages carried the whole catalogue: 662 products with all their data (galleries, key features, showcase…) in the site-wide `ChromeProvider`. Each page was about 1.1 MB of HTML plus about 2.8 MB of `.txt` data files.
- Deploys upload all page files on every run (about 2.7 GB over FTPS), so both deploys on 2026-11-25 hit the workflow's 30-minute limit and were cancelled partway through.
- Every visitor downloaded more than 1 MB per page, which is a problem for the China launch.

Only Compare, the Firmware & Software Finder and the product page's "Manuals & Software" panel use the catalogue.

## Approach
- `src/app/catalogue.json/route.ts` writes one static `/catalogue.json` at build time, holding only what those features need: name, image, category, tags, compare values and downloads for products, and slug and label for categories (about 220 KB).
- `useCatalogue(enabled)` (`src/lib/catalogue.ts`) fetches it once, on demand. The compare bar asks for it only when something is being compared, Compare and Add product always, and the Finder when there is a search term.
- `chrome.catalogue` is now set only on the CMS draft preview, which renders per request and must show unpublished edits.
- The product page's Manuals & Software panel reads the product's own `downloads`.
- `Catalogue` uses the slim `CatalogueProduct` / `CatalogueCategory` types.

## Files
src/app/catalogue.json/route.ts, src/lib/catalogue.ts, src/lib/cms/index.ts (`slimCatalogue`), src/data/gaming.ts, src/data/navigation.ts, src/components/compare/{AddProductModal,CompareBar,CompareView}.tsx, src/components/pages/ProductDownloads.tsx, src/components/product/ProductPanel.tsx

## Verify (done on `next dev` against the hosted CMS)
- /gaming/mice/m601-3/ HTML went from 1,124 KB to 95 KB. /catalogue.json lists 662 products and 15 categories.
- With nothing being compared, no catalogue request is made. With two products being compared, the compare bar lists them on another category page.
- /compare/ shows "Compare Mice" with both products and the spec table.
- /support/search/?q=m997 shows the product with "No downloads available" (the CMS has no driver files yet). An unknown term shows "Product not found".
- After deploy: `out/catalogue.json` exists, and the deploy finishes within the time limit.
