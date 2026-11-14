# Press & Awards, offline stores, Finder downloads, specs and compare values from the CMS

## Problem
After merging `main`, several new sections still used sample data in `src/data/*`:
- press articles, the article body and awards
- offline stores
- Finder releases
- compare-table values
- the mouse specification panel
- FAQ topics

Editors couldn't change any of these.

## Approach
The CMS now has fields for all of these (CMS change request `2026-11-13-new-sections-image-rules-cdn.md`), and the sample data is gone.
- **Press**: `getContent().press` (`pressContent()` in `src/lib/cms/index.ts`) supplies the page copy, the articles (newest first, year from the date) and the awards. `PressCoverage` takes `articles`/`title`/`text` props, and article pages render the CMS body. With no articles, the build still exports a placeholder `_` path, which shows the 404 page.
- **Stores**: CMS stores of type Retail store or Authorized retailer that have an address are offline stores; the rest are online. A store logo from the CMS replaces the guessed one.
- **Finder**: products carry `downloads` built from the CMS "Drivers & firmware" (`firmwareByProduct()`). Products without files show the "No downloads available" state. The design placement of the three Figma renders is kept (`finderArt`).
- **Compare / specs**: `product.compare` (CMS "Compare table") overrides the values derived from tags. `product.specs` comes from the CMS "Technical specifications panel".
- **FAQ topics**: a CMS FAQ's category becomes its Support-page topic.
- **Images**: `image-loader.ts` maps CMS uploads (`/storage/media/...`) to the CMS's responsive WebP copies (`-<width>.webp`).

## Files
- `src/lib/cms/{api,index}.ts`
- `src/data/{press,pages,compare,gaming,productInfo}.ts`
- `src/app/press-and-awards/page.tsx`, `src/app/press-and-awards/[slug]/page.tsx`
- `src/components/pages/{PressCoverage,SupportFaqs}.tsx`
- `image-loader.ts`, `CLAUDE.md`

## Verify
- `npx tsc --noEmit` and `npx eslint src image-loader.ts`: clean.
- Build against the local CMS: `CMS_API_URL=http://127.0.0.1:8010 node scripts/build.mjs`. It builds `/press-and-awards` and its 4 article pages. The page shows the CMS copy and awards, and Where to Buy (India) lists the CMS offline stores.
- Still to do for China (deployment doc §6): replace Google Maps with AMap, and switch to self-hosted fonts.
