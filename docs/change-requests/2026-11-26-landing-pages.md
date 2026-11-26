# U7.5 Landing pages (2026-11-26)

## Problem
The CMS now has Landing pages (`reddragon-cms/docs/change-requests/2026-11-26-landing-pages.md`); the website
must render them from fixed templates made of existing sections, in the same design.

## Approach
- `src/app/[slug]/page.tsx` serves both text pages and landing pages at `/<slug>/` (the CMS keeps slugs unique
  across both), with metadata and breadcrumb JSON-LD; SEO overrides come from `seo.pages`.
- `src/components/pages/LandingPage.tsx` assembles the templates in a fixed order:
  - Product launch: ProductOverview (mobile) + FeaturedHero, KeyFeatures (from the product), ExplodedViewSection
    (if on), FeaturedProductsGrid (if cards), NewsletterSection (if on and three photos).
  - Promotion: CategoryHero, TextBlock (if filled), FeaturedProductsGrid (if cards), CategorySplitSection (if on and
    both images), store finder link (Text block style + BrowseLink to /where-to-buy/), FaqList (if on).
- `CategoryHero` takes an optional `parent` breadcrumb step (default Gaming Products; landing pages pass null).
- `src/lib/cms/{api,index}.ts`: `CmsLandingPage`, `LandingPage`, `landingPage()` adapter (reuses `featuredCards`,
  `placed`), SEO map. `src/app/sitemap.ts` lists the pages. Menu links arrive in `navigation.header` from the CMS.

## Verify
`npx tsc --noEmit` passes. With a published landing page of each template, open `/<slug>/` on desktop and phone.
