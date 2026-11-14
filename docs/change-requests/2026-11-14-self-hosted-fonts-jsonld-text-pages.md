# Self-hosted fonts, structured data (JSON-LD) and CMS text pages

## Problem
- The normal build (`node scripts/build.mjs`, Turbopack) failed while downloading Google Fonts ("next/font/google queries have exactly one entry"). Google Fonts is also blocked in mainland China, where the site will be hosted.
- SEO step 5 (`docs/launch/seo-requirements.md`): only products had JSON-LD.
- Privacy Policy, Careers, Media Kit and Partner programs needed a developer for every new text page (`cms-todo.md` §2).

## Approach
- **Fonts**: `src/lib/fonts.ts` uses `next/font/local` with latin woff2 files in `src/fonts/` (14 families, variable where Google ships them; Lato static 300/400/700/900; Merriweather variable normal + italic). Same CSS variables (`--nf-*`), so no styles changed. No Google requests at build or run time. Licences: SIL OFL (`src/fonts/README.md`).
- **JSON-LD**: `src/components/JsonLd.tsx` (escapes `<`) and builders in `src/lib/structured-data.ts`.
  - Every page (layout): `Organization` + `WebSite`. `sameAs` lists only real profile links from Settings → social (placeholder home-page links are dropped).
  - Category pages: `BreadcrumbList`. Product pages: `Product` + `BreadcrumbList` (`ProductJsonLd`, now with the category name).
  - Blog and press posts: `Article` (headline, image, datePublished, author) + `BreadcrumbList`.
  - Support: `FAQPage` from the CMS FAQs. Text pages: `BreadcrumbList`.
- **Text pages**: CMS collection `text_pages` → `SiteContent.textPages`. Route `src/app/[slug]/page.tsx` (static, `dynamicParams = false`; with no pages it renders one never-linked `/_` 404, like press). `src/components/pages/TextPage.tsx` reuses the blog article's typography. SEO fields, canonical and sitemap entries as for other pages. Footer links come from CMS Navigation; the CMS refuses slugs the site already uses.
- Also: removed a duplicated nested `CmsSection` around the community block on featured gaming products.

## Files
`src/lib/fonts.ts`, `src/fonts/*`, `src/components/JsonLd.tsx`, `src/lib/structured-data.ts`, `src/components/cms/ProductJsonLd.tsx`, `src/components/pages/TextPage.tsx`, `src/app/[slug]/page.tsx`, `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/support/page.tsx`, `src/app/{gaming,office}/[category]/page.tsx`, `src/app/{gaming,office}/[category]/[product]/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/press-and-awards/[slug]/page.tsx`, `src/lib/cms/{api,index}.ts`.

## Verify
- `npx tsc --noEmit`, `npx eslint src image-loader.ts`: clean.
- `node scripts/build.mjs` (Turbopack) succeeds against the local CMS. Built HTML has no `fonts.googleapis`/`fonts.gstatic` references.
- With a test text page `privacy-policy`: `/privacy-policy/` renders title, last-updated date, sections, CMS SEO description, canonical, and is in the sitemap. Without text pages the build still succeeds.
- JSON-LD types in `out/`: home `Organization, WebSite`; category `BreadcrumbList`; product `Product, BreadcrumbList`; blog/press post `Article, BreadcrumbList`; support `FAQPage`. Check with Google's Rich Results Test after launch.
