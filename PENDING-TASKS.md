# Pending tasks – Redragon website + CMS

Updated 2026-11-26. Hosting: staging on Hostinger; production will be AWS Singapore (no China server).
Design source: Figma "Red Dragonzone V1" (`CJElvK5XeCWL1a7hc9QnOZ`), section "Change to be made in design"
(`3223:4652`), last read 2026-11-26 (newest node 3367). The Figma MCP Starter limit is used up; read the local copy
`Figma/Red Dragonzone V1.fig/` instead (how: memory note `redragon-figma`).

## Next: CMS deploy to staging, then live steps
- Committed and pushed 2026-11-26 (both repos, feature/cms-integration). The website push started its deploy.
- [x] CMS deployed to staging (5eed263); `products:link-modules` run on staging: 150 products saved, only 5 link
  to another product (BM-4131/BM-4235, M690, K732WLB, K526SP, K769OFL); 220 versions have no page of their own.
- [x] D8 = (a) on-page version switch (owner, 2026-11-26), built. Website:
  `src/components/gaming/ProductOverview.tsx`, `src/components/product/ProductLightbox.tsx`, `src/data/gaming.ts`,
  `src/lib/cms/{api,index}.ts`, `docs/change-requests/2026-11-26-product-version-switch.md`. CMS:
  `backend/app/Content/{Schema,ImageSpecs,ModuleLinks}.php`, `backend/app/Import/LiveSite.php`,
  `docs/change-requests/2026-11-26-product-versions.md`.
- [x] Committed (website 7c3541e, CMS 3ce7f10), CMS deployed, versions imported on staging 2026-11-26: 144 products,
  833 photos copied (811 kept at the old 482 x 320 size; log `storage/logs/import-2026-11-25-225529.txt`).
- [ ] Ask the client for HD photos of the versions (export photos are 482 x 320); HD exists for 54 of 597 versions.
- [ ] Product test (`reddragon-cms/docs/testing/`): run 2 = 556 of 665 pass after manuals import (1250, linked to old site) + colour names (542). Left: 53 no gallery, 42 incomplete switches (28 = 5+ versions), 24 empty content, 2 empty drafts. Then send the workbook to the client.
- [ ] Production (AWS): copy manuals/drivers to our storage (`import:live-site … --only=firmware --files=all`, ~11 GB) before the old site goes offline; 3 drivers are Google Drive links. Staging has the changes uploaded but not committed (ColourName, NameProductColours, LiveSite).
  The `mediaBg` images are 1920 x 515 dark banners, not usable as gallery tiles.
- [ ] Set `META_OEMBED_TOKEN` on the CMS server for Instagram covers (optional).
Not to commit: `Figma/`, `UI-Errors/`, `docs/change-requests/2026-11-24-figma-design-update.md` (another session's).

## Done (2026-11-25 → 26)
- All 662 CMS products and 15 categories are on the site. Category filters work for imported products: text matching,
  a "Type" group, and options with no products are hidden.
- Category pages: 12 products per page, no gap above the pagination, "Filters" heading.
- Builds fetch the CMS bundle once. The catalogue loads on demand (`/catalogue.json`), so product pages went from
  ~3.9 MB to ~165 KB.
- Deploys upload only changed files (sha1 list on the server). A deploy with nothing changed takes 34 s. Code changes
  still re-send all page files (124 MB, ~30 min).
- CMS: products open in the visual editor, one section at a time. Deployed to Hostinger.
- Colour swatches switch the gallery's first photo when the colour has a "Photo in this colour". Field added in
  the CMS and deployed.
- Product page: Specifications, Materials & Sustainability and In the Box merged into one "Product Details" panel.
- CMS ease of use (UX audit `reddragon-cms/docs/ux/`): U3 help text, limits explained, "Request a change",
  "Edit this page" from the site; U4 honest save labels, readable errors, character counters; U5 accessibility,
  History everywhere, auto-redirects, "Used on", crop preview, alt text, build status; U6 fast product list, CMS
  search, phone layout, Duplicate; browser-check fixes; U7.1 Website map in the sidebar; U7.2 Save draft → Publish
  everywhere (drafts table, Discard, preview shows drafts); U7.4 phone and email in the footer and on Contact Us.
  Change requests: `reddragon-cms/docs/change-requests/2026-11-25-*` and `2026-11-26-*`.
- Figma section reviewed. Already built before: Where to buy, Support states, product side panels, Support FAQ,
  Press & Awards, Contact message field, form messages.

## Decisions
- D1 Compare: **concept C** (owner, 2026-11-26). Built, not committed.
- D2 Social wall: **"Community gallery"** grid + **dark immersive** opened post (owner, 2026-11-26). Build now with
  9:16 cards sized by us (adjust when the designer's frames arrive). Shown on Home, Gaming and Office landing pages,
  and placeable by editors as a CMS section. Until D4: thumbnails/video self-hosted, platform link opens in a new tab.
- D3 Quiz: the owner is adding it to the menu in Figma and will send the screen. Waiting.
- D4 Audience: mainland China or global? This decides whether social posts can embed Instagram/TikTok/YouTube,
  and whether the "no blocked services" rule still applies.
- D6 Compare: keep the pink "differs" rows and the "Where to buy" row? They aren't in concept C.
- Older, from the 13 Nov audit (`2026-11-13-figma-design-alignment.md`), still open: D1 mobile footer style,
  D2 mobile newsletter block, D3 Support mobile category list, D4 Gaming Keyboards mobile hero, D5 product-page
  "Where to Buy" button (also blocks item 7, the Office special page overlap), D7 second contact form design.

## Front-end website
- [x] F1 Compare "Remove" control with the 14 px cross 
- [x] F2 Compare redesign, concept C 
- [x] Product cards: fixed image slot 
- [ ] F3 Find-your-gear quiz (new page), after D3: 4 question screens + results ("YOUR GEAR. FOUND.", 3 cards with
  "Why this suits you", Start again). Add loading, no-match and mobile layouts (not in Figma).
- [x] F4 Social wall built : `src/components/social/*`, `src/data/social.ts`, `src/lib/cms/{index,api}.ts`,
  `src/app/{page,gaming/page,office/page}.tsx`, `src/data/home.ts`, `docs/change-requests/2026-11-26-social-wall.md`.
  CMS side : `backend/app/Content/{Schema,ImageSpecs}.php`, `backend/app/Services/SocialEmbed.php`,
  `backend/app/Http/Controllers/Admin/ContentController.php`, `backend/config/{cms,services}.php`, `backend/.env.example`,
  `frontend/src/{sections/registry.ts,sections/SiteRender.tsx,lib/types.ts,pages/Website.tsx}`,
  `docs/change-requests/2026-11-26-social-posts.md`.
  Follow-ups: match the designer's 9:16 frames when they arrive; embedded players if D4 = global; MP4 upload in the
  media library (now an MP4 link); `META_OEMBED_TOKEN` on the server for Instagram covers; editor guide chapter (C6).
- [ ] F5 Mobile layouts for F3–F4 (Figma has desktop only). The Compare page has its own mobile layout already.

## CMS
- [ ] C1 Quiz fields on products: use (gaming / office / both), priority (performance / comfort / quiet),
  connection (wireless / wired), optional "Why this suits you" sentence.
- [ ] C2 Quiz page content: questions, answers, step photos (fixed slot sizes), results heading and intro.
- [x] C3 Social posts collection + Community wall settings and section (see F4).
- [ ] C4 Compare page content: banner photo and text, category tile photos, step labels. They're in code for now.
- [ ] C5 Image slot sizes (ImageSpecs) and visual-editor support for every new image and block above.
- [ ] C6 Editor guide chapters for the quiz, social posts, compare page and colour photos.
- [x] U7.5 Landing pages: "Product launch" and "Promotion" templates built from existing website sections
  (done 2026-11-26, not committed: `reddragon-cms/docs/change-requests/2026-11-26-landing-pages.md`,
  `docs/change-requests/2026-11-26-landing-pages.md`).
- [x] Homepage "Discard changes" (done 2026-11-26, not committed: `reddragon-cms/docs/change-requests/2026-11-26-homepage-discard.md`).
- **Next phase release:** U7.3 review and scheduling: Send for review, field-by-field changes, Send back, publish at a
  set time. Deferred by the owner on 2026-11-26. Until then, the Dashboard's "Not published yet" list shows drafts
  waiting for an Editor.
- Content for the client team: add "Photo in this colour" to each colour (119 products have several colours), and
  rename colours that are only hex codes (e.g. "#615C5C").

## Hosting and deploys
- [ ] Faster deploys: pack changed files into one archive and upload over SSH (~1 min instead of ~30 for code
  changes). Needs a deploy-only SSH key: the user adds the private key as a GitHub secret. Waiting for go-ahead.
- [ ] AWS Singapore production: adapt `deploy/china` to `deploy/aws` (CloudFront, SES, S3). Offered, not started.

## Other
- Ask the designer to update the Figma product panels: the site now has one "Product Details" panel instead of
  three, and listing cards no longer let photos bleed past the edges.
- The other session (`reddragon-cms-fe`) added phone and email to the footer and Contact Us (shown only when set
  in the CMS). It's not in Figma, so the designer may want to place it.
