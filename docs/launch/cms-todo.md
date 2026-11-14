# CMS to-do before launch

Status as of 2026-11-14. The CMS lives in `reddragon-cms`; its plan for the open items is `reddragon-cms/PENDING-TASKS.md`. Tick items as they land.

Live-site export (read-only, from the public API of redragonzone.com):
`C:\Users\harsh\OneDrive\Desktop\sandbox\reddragon-live-export\` (`export.py`, JSON files, `files.csv`).

## 1. Import the current site's content (make it editable in the CMS)

The live site has a JSON API, so everything it shows can be imported. Build one Artisan command
(e.g. `php artisan import:live-site <export dir>`) that is re-runnable (upsert by the live id, stored in a
`legacy_id` / `legacy_url` field) and copies every referenced file into Media.

| Live source | CMS target | Mapping notes |
| --- | --- | --- |
| `/api/category` (GAMING / OFFICE tree) | Categories | Match by name to the existing CMS categories; create the missing ones (live has a 3rd level, `categoryId3`: map to filter tags) |
| `/product/itemDetail` per product (653 products, 1,064 variants) | Products | One CMS product per live `productId`; `itemList` → `variants` + `modules`; `colorList` → `colors` + `gallery` (mediaFg/Bg 1–4); `specificationList` → `spec_groups`; `packageList` → `in_box`; `uspList` → `highlights`; `slogan` → `tagline`; `name` → name + `model_number`; `/detail.html?id=<id>` → `legacy_url` |
| `manualUrl`, `driverUrl` per variant (≈900) | Drivers & firmware (`firmware` collection) | One entry per file: type Manual / Driver, product, file copied to Media, `size` from the download. Version, date, OS, release notes stay empty until the client sends them |
| `/api/faq` (11) | FAQs | `name` → question, `intro` → answer; topic empty (client to assign) |
| `/api/store` (43, 17 countries) | Stores | Website-only rows → Online retailer; rows with an address → Retail store with address, lat/lng (needs the offline-store fields in progress) |
| `/api/area` → `officialStoreList` | Stores (Official store) | With logos from the live site |
| `/api/banner`, `/api/area` banners | Home / page banners | Review by hand: only reuse images that fit the new design sizes |
| `about.html` text | About Us page singleton | Philosophy and intro paragraphs |

- [x] Write the import command + a test with a small fixture from the export (2026-11-14: `php artisan import:live-site`, CMS change request `2026-11-14-live-site-import.md`)
- [~] Copy files. The export references 12,316 files, about 18 GB (sampled): 11,084 images ≈ 5.8 GB,
      705 PDFs ≈ 6.3 GB, 516 driver packages (zip/rar/exe/7z) ≈ 5.6 GB. Check the Hostinger disk quota first.
      Options: copy only the images the new design uses (gallery: up to 6 per product), and keep manuals/drivers
      on object storage (Cloudflare R2 / Backblaze B2 / S3) with the CMS storing their URLs.
- [ ] The website build resizes every image it uses (`scripts/optimize-images.mjs`); with 653 products, check
      build time and the size of `out/` before switching the import on for all products
- [~] Run it on a local CMS, check 10 products by hand against the live site, then run on the hosted CMS (needs OK) (local run of 10 products done 2026-11-14; hosted run still needs OK)
- [ ] Keep `export.py` + the import re-runnable until launch, so late changes on the live site can be pulled again

## 2. Collections and fields still missing

- [x] **Offline stores**: address, lat/lng, photo, logo (2026-11-13). Opening hours and phone: not in the design, not added
- [x] **Press articles + Awards**; website reads them (2026-11-13)
- [x] **FAQ topic**: select field (Compatibility, Setup, Warranty, Firmware) for the Support page filter
- [x] **Drivers & firmware**: "Windows & Mac" covers Both; the website lists files newest first by release date
- [x] **Blog author** fields already exist; nothing to add
- [x] **Footer/legal pages**: CMS "Text pages" (`text_pages`: title, intro, last updated, sections of heading + paragraphs); the website renders each at `/<slug>/` in the blog-article text style (2026-11-14). Link them from Navigation → Footer
- [x] **Support mega menu**: add the child "Press & Awards" → `/press-and-awards`, image `/images/nav/support-press.png`
      (the website already has its placement and the 3-column panel); also add "Press & Awards" to the footer Support column
- [x] **Stores (online)**: optional `description` (one line) and `categories` (list, e.g. Keyboards, Mice) – the new
      Where to Buy cards show them when set (the CMS mapping in `src/lib/cms` comes with the store/press work)
- [ ] **Forms**: add "Become a dealer" and "Product feedback / warranty" forms if the client wants them (the live site has both)

## 3. Website wiring (website repo, after the CMS fields exist)

- [x] Finder + product "Manuals & Software" panel read the `firmware` collection instead of the sample releases in `src/data/pages.ts`
- [x] Product spec panels read `spec_groups` / `spec_dimensions` / `in_box` instead of `src/data/productInfo.ts`
- [x] Compare reads the `compare_*` fields instead of `sampleSpecs` in `src/data/compare.ts`
- [x] Stores: offline cards from CMS stores, drop `sampleOfflineStores`
- [x] Press pages from the CMS; drop `src/data/press.ts`
- [x] FAQ topic filter from the CMS topic field

## 4. Forms: email and SMS

Finding: **no SMS service is needed.** No form verifies a phone number, and phone is optional on the contact form.
**Email is needed**, and the CMS only does the first item below today (plain text, and only when `CMS_NOTIFY_EMAIL` and `MAIL_*` are set).

| Email | Today | Needed |
| --- | --- | --- |
| Team alert for a new contact message | Plain text, if configured | Use a template; also send for dealer and feedback forms |
| Confirmation to the visitor ("we got your message") | None | Template with the message copy |
| Newsletter: confirm subscription (double opt-in) | None | Required in the EU (GDPR) and good practice everywhere; confirm link + token |
| Newsletter: unsubscribe | None | Link in every newsletter email, and a one-click unsubscribe endpoint |
| Newsletter campaigns | None | Send through a newsletter tool (Mailchimp / Brevo); the CMS syncs sign-ups to it, rather than sending bulk mail from Hostinger |

- [ ] Mail transport: Hostinger mailbox SMTP is enough for alerts and confirmations (low volume). Use a transactional service (Brevo, Amazon SES, Postmark) if volume or deliverability needs it. Set SPF, DKIM, DMARC on the sending domain.
- [x] **Email templates in the CMS**: a "Email templates" singleton or collection, one record per email (subject, heading, body with placeholders such as `{name}`, `{message}`, `{confirm_link}`), a shared header/footer with the logo, and a "Send test" button. Render with Laravel Mailables + Markdown mail components.
- [x] Queue the sends (database queue + cron `schedule:run` on Hostinger), so a slow mail server never slows the form (queued `SiteMail`; China runs the `redragon-queue` worker)
- [x] Newsletter: status column (pending / confirmed / unsubscribed) on sign-ups, confirm + unsubscribe routes, export or sync to the chosen newsletter tool
- [x] Inbox: reply-to set to the visitor (done for contact), add a "replied" state

## 5. Hosting and operations

- [ ] Real domain for the CMS (e.g. `cms.redragonzone.com`), then `SITE_URL`, `PREVIEW_URL`, `CORS_ALLOWED_ORIGINS` (lock to the site domain instead of `*`)
- [ ] Daily backup of the SQLite database and `storage/app` media, kept off the server
- [ ] Admin accounts for the Redragon team, with roles; remove test accounts
- [ ] Publish webhook points at the production deploy (GitHub Actions `workflow_dispatch` on `main`)
