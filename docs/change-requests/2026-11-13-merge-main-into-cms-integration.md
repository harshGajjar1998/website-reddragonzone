# Merge `main` (32e0deb "new pages and sections added") into `feature/cms-integration`

## Problem
`main` added new pages and features (Compare, Press & Awards, Firmware & Software Finder, online/offline Where to Buy,
product-page panels, form feedback banners, enquiry pre-select) built on static data in `src/data/*`.
This branch had moved that data to the CMS, so 17 files conflicted and main's new code imported static lists that no longer exist.

## Approach
The CMS stays the source of content. Main's new UI is kept and fed from the CMS. Main's sample data is kept only where the CMS has no fields for it yet.

- **Forms** (`src/lib/forms.ts`): main's API (`useNewsletterForm`, `Feedback`, `FormFeedback` banners, validation), sending to the CMS
  (`/api/public/forms/{form}`) with the honeypot and the CMS's own error messages (`FormError`, `errorText`). Every form keeps `<Honeypot />`.
- **Contact**: enquiry types from the CMS; `?enquiry=` pre-select (`contactHref`, `enquiryFromSlug(slug, enquiryTypes)`) works on that list.
- **Where to Buy**: `CountryStores` (online/offline) built from CMS stores in `storesByCountry()` (`src/lib/cms/index.ts`).
  CMS stores become online cards (Redragon logo for official stores, Amazon logo by name, otherwise the name is shown).
  Offline stores use `sampleOfflineStores` (India) until the CMS has addresses and coordinates. The store list is also in
  `useChrome().storesByCountry` for the product-page panel.
- **Catalogue for client features**: `useChrome().catalogue` (all CMS products and categories) replaces the static
  `gamingProducts`/`officeProducts` in Compare (`src/data/compare.ts`) and the Finder (`supportProducts(catalogue)`,
  `findSupportProduct(catalogue, q)`). Finder downloads are still main's sample releases.
- **Support**: tiles, downloads and FAQs from the CMS; main's `SupportFaqs` gets the CMS FAQs as props. Download cards link to the Finder;
  the slug is the model code at the end of the CMS download name.
- **Blog/Press**: main's shared `ArticleDetail` now takes a `body` prop. Blog posts pass the CMS body; press pages pass `samplePressBody`.
- **Layout**: our `ChromeProvider`, footer `CmsSection`, `ScrollReveal` and preview bridge, plus main's `CompareBar`.
- **Navigation/footer**: these come from the CMS, so main's static menu edits were dropped (see follow-ups).

## Follow-ups (CMS content/schema)
- Add the **Press & Awards** tile to the Support mega menu (main changed it to 3 columns) and the footer Support column in the CMS.
- CMS fields still missing: offline store address/lat/lng/photo, store logos, FAQ topic (the topic filter only shows CMS FAQs under "All"),
  per-product download releases (Finder and product "Manuals & Software" panel), press articles.
- CMS download `software_url`/`manual_url` are no longer shown: cards now open the Finder.
- The catalogue in the chrome context adds about 60 KB (uncompressed) to every page. Trim it to the fields Compare and the Finder use if the catalogue grows.

## Verify
- `npx tsc --noEmit`, `npx eslint src`: clean.
- `CMS_API_URL=<cms> node scripts/build.mjs`: 68/68 pages generated.
- Manually: submit a newsletter form and the contact form (CMS Inbox receives them), open `/contact-us/?enquiry=product-support`,
  `/where-to-buy` (India shows online + offline), `/compare`, `/support/search/?q=k768vi-pro`, a blog post and a press article.
