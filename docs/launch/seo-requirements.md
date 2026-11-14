# SEO requirements and steps for launch

Status as of 2026-11-14: steps 1–7 and 11 are done (`docs/change-requests/2026-11-14-seo-metadata-from-cms.md`, `2026-11-14-self-hosted-fonts-jsonld-text-pages.md`, `2026-11-14-old-site-redirects-htaccess.md`). Product photos use the product name as alt text. Redirects come from the CMS: `out/.htaccess` at build time for Apache, and an nginx include on the China server. Open: step 12 (ask the client for other old links), then the launch-day checks.
Do the steps in order; each says where the change goes.
Today: sitemap.xml and robots.txt are generated from `SITE_URL`; there are no Open Graph tags, no canonical
links, and the temporary domain can be indexed.

## Before launch (on the staging domain)

1. **Keep staging out of Google.** When `SITE_URL` is not the production domain, render
   `<meta name="robots" content="noindex, nofollow">` (root `metadata.robots` in `src/app/layout.tsx`) and make
   `robots.txt` disallow everything. Also send `X-Robots-Tag: noindex` from the staging `.htaccess`.
2. **Canonical URLs.** Set `metadataBase` from `SITE_URL` in the root layout, and `alternates.canonical` on every
   page (trailing slash, same form as the sitemap).
3. **Titles and descriptions from the CMS.** Every page, product and blog post takes its title and meta
   description from the CMS (SEO fields with a 60 / 155 character guide), falling back to the current defaults.
   Product titles: `<Model> <Name> | Redragon`.
4. **Open Graph and Twitter cards.** `openGraph` + `twitter` metadata per page: title, description, image
   (1200×630; product image or a CMS default share image), site name, `og:type` article for blog and press.
5. ✅ **Structured data (JSON-LD).** Product JSON-LD exists; add `Organization` (logo, social profiles) on the home
   page, `BreadcrumbList` on category and product pages, `Article` on blog/press posts, `FAQPage` on Support/Contact.
6. **Sitemap.** Include every product, category, blog and press page with `lastModified` from the CMS
   `updated_at`; leave out the compare page and `/support/search/`. Check it lists all 653 products after the import.
7. **Images.** Every product image has alt text (import it from the product name + colour); keep the WebP
   widths the build already generates.
8. **Headings.** One `h1` per page; check product pages and the home page.
9. **404 page.** Exists (`404.html`); add search and links to Gaming, Office, Support.
10. **Performance.** Lighthouse on Home, a category, a product and Support (mobile): aim for LCP < 2.5 s,
    CLS < 0.1. Fix what it reports.

## Redirects from the old site (so rankings and printed links survive)

The current site uses these addresses (from its HTML and scripts):

| Old URL | New URL |
| --- | --- |
| `/index.html` | `/` |
| `/about.html` | `/about-us/` |
| `/faq.html` | `/support/` (FAQ block) |
| `/software.html` | `/support/` |
| `/wheretobuy.html`, `/official-store.html` | `/where-to-buy/` |
| `/product.html?categoryId=<id>` | `/gaming/<category>/` or `/office/<category>/`, per category id |
| `/detail.html?id=<itemId>` | the product page for that variant (from `legacy_url` saved by the import) |

11. Generate these as 301 rules in `public/.htaccess` at build time from the CMS (`legacy_url` on products,
    a category id map), because the query-string forms need `RewriteCond %{QUERY_STRING}`.
12. Ask the client for any other old links in ads, packaging or QR codes, and add them.
13. After launch, check the old URLs return 301 to the right page (script over the export's product ids).

## Launch day

14. Point redragonzone.com at the new site, set `SITE_URL` to it, rebuild; staging keeps `noindex`.
15. Verify the domain in Google Search Console (DNS record) and submit `https://www.redragonzone.com/sitemap.xml`.
16. Pick one host (`www` or bare domain) and 301 the other to it, HTTPS only (already forced by HSTS).
17. Request indexing for the home page and the top categories.

## After launch

18. Watch Search Console "Pages" and "Not found" for two weeks; add redirects for any old URL still getting hits.
19. Analytics (GA4 or Tag Manager) only after the cookie consent banner is in place.
