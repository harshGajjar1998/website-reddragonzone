# Figma "Final design" alignment

Status: audit done, awaiting approval before any code change.

## Problem
The site has to match the Figma file "Red Dragonzone V1", page **Final design** (desktop frames, the
"Mobile" section, and the "Change to be made in design" section). This doc lists every difference found.

## How the audit was done
- Desktop: full-page screenshots of the deployed site (1440 px) side by side with each Figma frame.
- All frames: every Figma text layer (font, size, weight, colour, position) matched against the same text on
  the live page, from the browser's computed styles (`scratchpad/cmp/diff.py`, `drift.py`).
- Mobile (390 px): Figma blocked image export (rate limit), so the mobile frames were drawn from the Figma
  data with their images (`render.py`) and compared with phone-size screenshots.
- States: menus, search, product side panels, Support finder (found / not found / no downloads), Compare.

## Already matching (no change)
Menus (Gaming, Office, Support) and search overlay; Support finder states; product side panels
(Specifications, Manuals & Software, Where to buy, In the Box, "not available in your country");
Press & Awards; Compare header and table; category pages; Office special page body; blog pages (desktop);
Contact (desktop, with the new Message field); Home, Gaming and Office (mobile); mobile product pages
(apart from D10).

## Changes – desktop
1. **SPECIAL PAGE – Gaming (2521:3548, header 3245:1670)** – PRISM PRO M997: replace the dark home-style
   banner with the light product header (breadcrumb, two-tone name, colour, description, the five panel links,
   outlined model name); add the large photo above the three feature cards and the wide photo below them;
   feature card titles 24 px and text 16 px (now 20 / 14).
2. **Office pages – footer** (Office landing, Mice PAGE, Product page, SPECIAL PAGE 2523:5770): white footer
   with the red "R" logo, as on mobile.
3. **Home page** – Office category card is missing its mouse image.
4. **About (redragon-about-us)** – "Join the Red Dragonzone" box needs the red outline.
5. **404 ERROR** – no footer in Figma.
6. **Where to buy (3222:1643 Online, 3222:1488 Nearby)** – rebuild: left-aligned "FIND YOUR WAY TO BUY",
   country picker with flag + "Use my location", Online/Nearby switch; Online = "SHOP ONLINE" cards (initials,
   name, type tag, text, "Explore products", VISIT STORE); Nearby = numbered store list with distance and
   "Get directions" + map with pins and "Change location". No "Still need help?" box.
7. **SPECIAL PAGE – Office (2523:5770)** – "Where to Buy" button overlaps the faded "BM4195".
8. **Support menu (3222:3847)** – add the third tile "Press & Awards".
9. **Hello bar** – "SECURE YOUR UNIT" is bold, not underlined.
10. **Product page (2521:3414)** – product text colour #000 (now #1a1a1a).
11. **Blog article (Main Auto layout 2593:1245)** – quote author name bold.

## Changes – mobile
12. **Blog home / Blog article (3044:1211, 3044:998)** – white page background (now grey); type scale:
    tags 12, titles 22, text 15, "Discover more" 14, newsletter 14 (site is 2 px larger each).
13. **About (3063:7045)** – type scale: section labels 14 (now 20), headings 26 (28), text 15 (16),
    hero label 12 (16); red short line under "Quality Meets Affordability" and "The Spirit of the Dragon".
14. **SPECIAL PAGE – Office (2840:837)** – blueprint shows the whole infographic, not a zoomed crop.
15. **Support (3063:6670)** – product card images larger (fill the card width).

## Content (CMS, not code)
Footer copyright "© 2026 REDRAGON ARCHITECTS. ALL WEAPONRY CONFORMS TO eSPORTS LATENCY CRITERIA.", footer
"Press & Awards" link, home hero slides (Figma 5, CMS 2), K768VI-PRO gallery and key features, "FAQ's" heading,
"NEW" badge on category cards. Also: Support menu child "Press & Awards"; Where to Buy heading/subtitle text
("Find your way to buy" / "Choose your country, then explore online partners or physical retailers."); store
`description` / `categories`; PRISM PRO desktop showcase banners (desktop now falls back to the mobile pair) and the
"3-MODE CONNECTIVITY" card image (Figma shows the mouse with its dongle).

## Progress (2026-11-14) – items that needed no decision
| # | Status | What changed |
|---|---|---|
| 1 | Done | `FeaturedHero.tsx` rebuilt as the light header from 3245:1670 (breadcrumb, name with the model in red, colour swatches, panel links, outlined vertical model, dragon mark); `FeaturedShowcase.tsx`: desktop banners fall back to the mobile ones, cards 24/16 px without forced capitals, rounded 16 px, heading lead words in ink |
| 2 | Done | `Footer.tsx` is now a client component and turns white on Office pages (`useProductRange`), like the mobile footer |
| 3 | Dropped | Not a bug: the Office mouse is there; the first screenshot was taken before its entrance animation |
| 4 | Done | `EliteClubNewsletter.tsx`: real red border (the inset shadow was hidden under the background image) |
| 5 | Done | `not-found.tsx` marks itself `data-hide-footer`; `globals.css` hides `.site-footer` on such pages |
| 6 | Done | `StoreFinder.tsx` rebuilt to 3222:1643 / 3222:1488: left heading, country picker with flag, "Use my location", Online/Nearby switch, Shop Online cards (logo or initials, type tag, optional description and categories, Visit store), nearby list + map, "Change location"; starts on the visitor's country; no "Still need help?" box. Flags use a self-hosted Twemoji Country Flags font (`public/fonts`, MIT) because Windows has no flag emoji |
| 7 | Waiting | Overlap is caused by the "Where to Buy" button (decision D5) |
| 8 | Done (code) | `design-layout.json`: Support panel 3 columns + placement for `/images/nav/support-press.png` (values from main's `navigation.ts`, lost in the CMS move); the tile appears once the CMS menu item exists |
| 9 | Done | Hello bar link underlined on hover only |
| 10 | Skipped | #000 vs #1a1a1a is not visible, and the shared components are #1a1a1a in the other Figma frames |
| 11 | Done | Quote author bold (`ArticleDetail.tsx`) |
| 12 | Done | Blog mobile type scale (cards 12/22/15/14, article meta 12–14, quote 18, related heading 30, eyebrow and newsletter label 14); background stays – Figma uses the same silver gradient |
| 13 | Done | About mobile: type scale via `SectionIntro` and the page (labels 14, headings 26, text 15, hero 12/34/19/15), 24 px side padding, hero 544 px with 45% overlay and full-width button, Elite Club 10/25 |
| 14 | Dropped | Office special blueprint crop already matches Figma (my first render ignored the image crop) |
| 15 | Done | Support mobile download cards: image fills the 302×200 box (Figma "Fill") |

## Decisions needed (Figma disagrees with itself or with the brief)
- D1 **Mobile footer**: Home/Gaming/Office/product frames use collapsible sections (as the site does);
  Blog/About/Support frames show all links open in two columns with icons + long copyright. Which one?
- D2 **Mobile newsletter block**: Support frame stacks email + full-width SIGN UP with 3 small images;
  all other frames match the site (inline button + large image). Which one?
- D3 **Support mobile**: Figma has the 2-column category grid *and* a second full-width category list.
  Both, or grid only (site)?
- D4 **Gaming Keyboards mobile (3046:1034)**: Figma starts with a product hero (RIO K771BGP) like Office Mice;
  desktop uses the category banner (site). Which one?
- D5 **Product pages – "Where to Buy" button + "Drivers & manuals" / "Need help?" links**: not in Figma
  (Figma uses the "Where to buy" and "Manuals & Software" panel links). Keep (brief items 3–4) or remove?
- D6 **Compare**: pink difference rows and "Where to buy" row are not in Figma. Keep or remove?
- D7 **Contact us (2521:4427)**: a second, shorter contact design with "Product Model No./Name" and
  "Where did you purchase your product?". Use it (e.g. for Product support enquiries) or ignore?
- Figma says "Gaming Produce" / "Office Produce" – treated as a typo; site keeps "Products".
- Google Maps stays for now (owner decision 2026-11-13); revisit if hosting is in mainland China.

## Key files (expected)
`src/components/layout/Footer.tsx`, `MobileFooter.tsx`, `HelloBar.tsx`, `MegaMenu.tsx`;
`src/components/gaming/FeaturedHero.tsx`, `ProductOverview.tsx`; `src/components/office/OfficeSpecHero.tsx`;
`src/components/home/CategoryCard.tsx`; `src/components/pages/StoreFinder.tsx`, `EliteClubNewsletter.tsx`;
`src/app/not-found.tsx`, `src/app/layout.tsx`; blog and about components.

## How to verify
Re-run `scratchpad/cmp` screenshots and `diff.py` after the changes; each item above should show no difference.
