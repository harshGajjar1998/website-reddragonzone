# Page titles, descriptions, link previews and canonical URLs from the CMS

## Problem
`docs/launch/seo-requirements.md` steps 1–4 and 6:
- titles and descriptions were hard-coded or derived on each page
- there were no canonical links and no Open Graph or X previews
- staging could be indexed
- the sitemap had no press pages and no dates

## Approach
- **`src/lib/seo.ts`**: `pageMetadata(path, fallback)` builds each page's metadata in this order:
  1. the CMS "Search engines & sharing" fields
  2. the page's own text and picture
  3. the site defaults

  It adds `alternates.canonical`, `openGraph` (site name, type `article` for blog and press) and an X card. `productTitle()` gives "`<Model> <Name> | Redragon`" without repeating a model already in the name.
- **`src/lib/cms/index.ts`**:
  - `seo.pages` is the per-path SEO from the CMS: homepage, page singletons, categories, products, blog and press posts, with `updated` dates.
  - `seo.shareImage` is the default share picture.
  - `seo.index` comes from `indexable()`. Search engines may index only `*.redragonzone.com`; `SITE_INDEX=1` or `0` overrides that, and the CMS preview is never indexed.
- **Pages**: every route's `generateMetadata` uses `pageMetadata`. The homepage now has its own metadata.
- **Layout**: default `openGraph`, and `robots: noindex, nofollow` when the site isn't indexable. `robots.txt` disallows everything in that case.
- **Sitemap**: adds `/press-and-awards/` and its articles, and `lastModified` from the CMS.

## Files
- `src/lib/seo.ts`, `src/lib/cms/{api,index}.ts`
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- every `src/app/**/page.tsx` with metadata
- `.env.example` (`SITE_INDEX`)

## Verify
- `npx tsc --noEmit` and `npx eslint src image-loader.ts`: clean.
- Build against the local CMS with `--webpack` (see the note below), then check a product with a CMS SEO title. It shows the CMS title and description, a canonical URL, `og:*` and `twitter:*` tags, and the product render as `og:image`. On the staging domain it has `robots: noindex, nofollow` and `robots.txt` is `Disallow: /`.
- The sitemap lists press pages and has `<lastmod>` for CMS entries.

## Note: the default Turbopack build currently fails
`node scripts/build.mjs` (Turbopack) fails while loading Google Fonts with "next/font/google queries have exactly one entry". This happens with or without this change. A webpack build (`next build --webpack`) works. Self-hosting the fonts with `next/font/local` fixes it, and China hosting needs that anyway (CMS deployment doc §6, C3).

## Not in this change
JSON-LD (Organization, BreadcrumbList, Article, FAQPage: step 5), old-site redirects (step 11: needs the hosting choice), and product image alt text from the live-site import.
