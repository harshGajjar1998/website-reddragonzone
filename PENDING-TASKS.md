# Pending tasks – Redragon website + CMS

Updated 2026-11-26. Hosting: staging on Hostinger; production will be AWS Singapore (no China server).
Design source: Figma "Red Dragonzone V1" (`CJElvK5XeCWL1a7hc9QnOZ`), section "Change to be made in design"
(`3223:4652`), last read 2026-11-26 (newest node 3367). The Figma MCP Starter limit is used up; read the local copy
`Figma/Red Dragonzone V1.fig/` instead (how: memory note `redragon-figma`).

## Next: CMS deploy to staging, then live steps
- Committed and pushed 2026-11-26 (both repos, feature/cms-integration). The website push started its deploy.
- [ ] Deploy the CMS to staging: `deploy/hostinger.sh` over SSH (code changed: social posts, module links). Needs the
  Redragon Hostinger SSH details (not in `Documents/Hostinger/` yet); ask the owner first.
- [ ] Then on the CMS: `php artisan products:link-modules --dry-run`, review with the owner, run without `--dry-run`.
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
- [ ] U7.5 Landing pages: "Product launch" and "Promotion" templates built from existing website sections
  (approved 2026-11-26, `reddragon-cms/docs/ux/2026-11-26-u7-website-tree-and-publishing-proposal.md`).
- [ ] Homepage "Discard changes" (U7.2 gap: the homepage keeps its own draft copy; needs a reset-to-published endpoint).
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
