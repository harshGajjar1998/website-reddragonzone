# Design update — 3 Nov 2026 (Neelesh: WhatsApp + Figma)

Build instructions for the new screens.

**Sources**
- Neelesh's WhatsApp messages, 11:09–11:55: points 1–11 (point 7 was deleted) and 12 PNGs.
- The Figma file, read the same day (view-only, no Dev Mode): https://www.figma.com/design/FCBBkAXbToAMeI9ZTOdZjg/Red-Dragon-zone

**Figma pages:**

| Page | Contents | Used for |
|---|---|---|
| 01 Desktop Website — System Integration | All desktop pages, including revised Where to Buy frames | §1, §2, §6 |
| 02 Product Compare — Desktop Flow | Entry tray, compare home, browse, add modal, compare page | §10 |
| 03 UX Flows / Website Architecture | Sitemap and journeys; gives the press email | §6, routes |
| 04 Find Your Perfect Gear — Desktop | Full quiz flow, `node-id=232-4537` | §11 |
| 05 Contact & Newsletter — Form UX | Every form state | §9 |
| 06 Hardware Breakdown — Desktop + Mobile | Interactive exploded view | new §12 |
| 07 Design System | Fonts, colours, buttons | Design tokens below |

**Notes**
- Figma copy was read from zoomed frames. Values marked *≈* are approximate; check them in Dev Mode once Neelesh grants edit or Dev Mode access.
- All new pages reuse the existing header, announcement bar, **Esports Community** newsletter band and footer.

## Design tokens (Figma page 07)

**Fonts**
| Font | Use |
|---|---|
| Lexend Exa | Display / H1 |
| Lexend Deca | Headings, UI and body |
| JetBrains Mono | Utility / eyebrow text |

**Type scale**
| Style | Font and weight | Size / line height |
|---|---|---|
| Display | SemiBold | 64/72 |
| H1 | SemiBold | 40/48 |
| H2 | Medium | 32/40 |
| H3 | Medium | 24/32 |
| Body L | Regular | 18/28 |
| Body | Regular | 16/24 |
| Body S | Regular | 14/22 |
| Label / Button | Lexend Deca SemiBold | 16/24 |
| Eyebrow | JetBrains Mono Bold, uppercase | 11/16 |

**Colours**
| Token | Value |
|---|---|
| Brand crimson | `#E01A22` (already `--color-crimson` on the site) |
| Gaming red | `#E60012` |
| Canvas | `#111111` |
| Surface | `#1A1A1A` |
| Text primary | `#FFFFFF` |
| Text secondary | *≈* `#9A9A9A` |
| Border | *≈* `#393939` |
| Pressed red | *≈* `#A91A20` |

**Buttons:** 48 px tall, Lexend Deca SemiBold.
- **Primary:** red; hover is a lighter red, pressed is `#A91A20`.
- **Secondary:** dark navy/charcoal.
- **Tertiary:** text only.
- **Focus:** red outline. **Disabled:** grey.

Compare the fonts and colours above with the site's current CSS before changing anything global.

## Status at a glance

| # | Feature | Route | Screens received | Website today | CMS data |
|---|---|---|---|---|---|
| 1 | Firmware & Software Finder results | `/support/` (results view) | ✅ 3 states | Simple download cards only | ✅ `firmware` collection |
| 2 | Where to Buy results | `/where-to-buy/` | ✅ 4 states | Form + placeholder | ⚠️ `stores` needs new fields |
| 3 | "Where to Buy" on product pages | product pages | ✅ drawer (low-res) | none | ✅ `stores.products` |
| 4 | "Drivers & manuals" on product pages | product pages | ✅ drawer (low-res) | none | ✅ `firmware` |
| 5 | FAQ on Support | `/support/` | ✅ | FAQs only on Contact | ✅ `faqs.category` |
| 6 | Press | `/press/` | ✅ | 404 | ✅ `press`, `press_page` |
| 7 | *(deleted by designer; it introduced "Compare now")* | — | ❌ | — | — |
| 8 | "Your message" on contact form | `/contact-us/` | ✅ | field missing | check Inbox stores it |
| 9 | Form success / error / required states | contact + 5 newsletter boxes | ✅ Figma p05 (all states) | partial | — |
| 10 | Product comparison | `/support/compare/` + compare tray on listings | ✅ Figma p02 | none | specs on products |
| 11 | "Find your perfect gear" quiz | `/find-your-gear/` | ✅ Figma p04 | none | needs a quiz → product mapping |
| 12 | Hardware breakdown (interactive exploded view) | homepage blueprint + product pages | ✅ Figma p06 | static image + chips | needs hotspots on products |

## Shared building blocks (build first)

1. **`StillNeedHelp` card.** Pink card (`#fde8e8`-ish, *Figma*) with a red-outlined circle and envelope icon on the left. Title "Still need help?", body "Can't find the answer you're looking for? Our dedicated support team is ready to assist you.", red button "CONTACT US >" to `/contact-us/`, faint dragon watermark on the right. Used on Where to Buy and the Support results. The Press page uses the same card with the title **"Press Contact"** and the body "For product review requests, media inquiries and interviews, please contact our team."
2. **`EmptyState` with illustration.** Dragon-in-a-box line art (see decision D1).
3. **`StoreCard`.** Logo, name, pink pill tag, and a red "Shop Now ↗" button. Used on the Where to Buy page and the product drawer.
4. **`VersionCard`** (Finder). Version + LATEST tag, meta line, "What's changed", a DOWNLOAD button, and a "Previous versions" accordion.
5. **`SideDrawer`.** Right-hand panel over a dimmed page, with a title, a subtitle and a close ×. Used for product-page Specifications, Where to Buy, and Manuals & Software.
6. **`OsSwitch`.** Segmented Windows | Mac control, pre-selected from `navigator.userAgentData?.platform ?? navigator.platform`.

---

## 1. Firmware & Software Finder (`/support/`)

### 1a. Support landing (updated look)
- **Hero:** desk photo background. Eyebrow "Support" (red), H1 "Manuals & Software's", sub "Get the latest software, drivers and manuals for your redragon products". Search input with a search icon, plus a red **FIND** button.
- **Category tiles:** 8 tiles in rows of 3, 3, 2. Mice, Keyboards, Combo / Headsets, Speakers, Content Creation / PC Components, Gamepads. Each tile has a grey background, a large faded outline word behind it, the label on the left and the product image on the right. These come from the `support_topics` collection (max 8, already in place).
- **"Manuals & Software's" grid** (subtitle "Features Products"): search + red SEARCH button.
  - 4-column cards: name + model (e.g. "EISA 100 PRO / K768VI-PRO"), category tag top-right ("KEYBOARDS"), product image, and red "↓ SOFTWARE" and "↓ MANUAL" links at the bottom.
  - Two rows, then a red pill **LOAD MORE** button.
- **FAQ block:** spec in section 5.

### 1b. Results view: product found
Triggered by FIND or search, or by clicking a product card or a "Drivers & manuals" link. Use a URL the page can be opened at, e.g. `/support/?product=eisa-100-pro`, so product pages can deep-link to it.
- Breadcrumb "Support / Search Results". Eyebrow "Support", H1 "Product downloads", and a red underlined **"Return to search"** link on the right.
- **Product band** (full-width light-grey gradient): image on the left; category (red, e.g. "Keyboards"), name in bold caps and model number in the middle; on the right, "Product found" + "Choose an operating system to view product downloads."
- **"Downloads"** + "Select your operating system", with the `OsSwitch` on the right.
- **One row per type, in this order.** The left column holds the type name and its description:
  - Driver: "Device connection and recognition"
  - Firmware: "On-device performance updates"
  - Software: "Customize your keyboard settings" (adapt per category)
  - Manual: "Setup and product documentation"
- **Right column is a `VersionCard`** with a light-grey background:
  - `v1.0.0` bold, followed by a red small-caps **LATEST** tag
  - "Release date: 01 Feb 2026 • OS: Windows"
  - "What's changed: …" from `release_notes`
  - Red **DOWNLOAD** button on the right
  - Divider, then **"Previous versions" ⌄**, an accordion listing older versions in the same format
- Filter rows by the OS switch. Items marked `Windows & Mac` / `Any` always show. Hide a type when it has no files for that OS.
- Footer row: "Looking for a different product?" on the left, red **"Browse all products"** on the right (returns to the grid).
- Data: `firmware` entries where `product` = the chosen product, grouped by `type` and sorted by `release_date` descending. The first entry is LATEST.

### 1c. No downloads available
The product band shows without the "Product found" text. Below it, centred: H2 **"No downloads available"**, body "There are no drivers, firmware, software or manuals listed for this product. Check the product name and model, or return to search for another product.", a red **RETURN TO SEARCH** button and a red underlined "Browse all products" link.

### 1d. Product not found
Same breadcrumb and H1. A grey band holds the dragon-in-box illustration, H2 **"Product not found"** and the body "We couldn't find a matching product. Check the spelling or try the model number printed on your product label." Below that: label "Product name or model", an input "Search product name or model" with a search icon, a red **FIND** button, and a red underlined "Browse all products" link.

## 2. Where to Buy (`/where-to-buy/`)

- **Hero:** full-width image of a globe with red arcs, and a huge white "WHERE TO BUY".
- **Intro:** "WHERE TO BUY" (red caps) + "Locate authorized stores for individual purchases".
- **Form:** wide **Select Country** dropdown + red **"📍 FIND STORES NEAR ME"** button. "Near me" uses geolocation to pick the country, and switches to Offline with distances.
- **Results** appear under the form once a country is chosen. A centred **Online Shopping | Offline Shopping** toggle sits between hairlines.
  - **Online:** "STORES IN {COUNTRY}" (red caps) + "Find official stores and trusted retail partners in your country." `StoreCard` list; the first card has a grey background, the rest are white with a border. Tags: *Official store*, *Online*.
  - **Offline:** "Find physical retailers" + "Map and store listings for this product".
    - **List on the left:** store photo with a red number badge (01, 02…), name, tag (*Retail Store* / *Authorized Retailer*), a 2-line address, distance ("2.8 km") and a red "Get directions ↗" link (Google Maps directions URL).
    - **Map on the right:** red numbered pins matching the list.
  - **No results:** "NO STORES FOUND" (red caps) + "Search results when no retail partner is available for the selected country." + illustration (decision D1).
- The `StillNeedHelp` card always shows below the results.
- Point 2 also asks for **cards grouped by region and country** and **optional product links per store**. Neither is in the screens; see D4.
- **Filtered by product** (from product pages): `/where-to-buy/?product=bm4195` shows the product mini-card, and only stores whose `products` include it.

**Alternative design in Figma page 01** ("Where to buy — Online & Nearby tabs / Revised"). It differs from the WhatsApp version. See decision D4.
- **Header and form:**
  - "FIND YOUR WAY TO BUY" + "Choose your country, then explore online partners or physical retailers."
  - Country select with a flag, plus a red link "📍 Use my location".
  - **Online | Nearby** tabs: a red filled pill when active, grey when not.
- **Online tab:** "SHOP ONLINE" + "Verified online shopping partners for {country}". A **3-column card grid**. Each card has:
  - a logo or monogram tile, name, and tag (*Official store* / *Online retailer*)
  - a one-line description
  - an "EXPLORE PRODUCTS" label with categories (e.g. "Keyboards · Mice")
  - a red **VISIT STORE ↗** button
  - The footnote says names and logos are placeholders.
- **Nearby tab:** "NEARBY STORES" + "Showing stores near New Delhi, India", and a red "⌖ Change location" link on the right.
  - Numbered list: badge, photo, name, tag, address, distance, "Get directions".
  - Map with numbered pins.
- The revised version covers the brief's "product links per store" point. **Recommend building the revised version.**

**CMS changes for `stores`:**
- Add `channel` (Online / Offline).
- Extend `type` options to Official store / Online / Retail store / Authorized retailer.
- Add `address` (area), `city`, `lat`, `lng`, `photo` (image) and `directions_url` (optional; otherwise built from lat/lng).
- Distance is calculated in the browser from the visitor's location.

## 3 & 4. Product pages: Where to Buy + Drivers & manuals

On the product page the info column lists rows with "›": Specifications, …, Where to Buy, Manuals & Software. Each row opens a **`SideDrawer`** over the dimmed page. Frames received (low-res, *Figma* for detail):
- **Specifications drawer:** grouped spec lists.
- **WHERE TO BUY drawer:** subtitle, then the Online/Offline toggle, a product mini-card (image, name, model) and `StoreCard` rows for the visitor's country.
  - Empty state: mini-card + dragon-in-box + "This product is not currently available in your country".
- **Manuals & Software drawer:** product mini-card with an OS dropdown (Windows), then grouped version cards with a full-width red DOWNLOAD button.

Requirement (points 3 and 4):
- **"Where to Buy"** must be the **main red button** in the top product section.
- **"Drivers & manuals for this model"** goes near it, or inside the Software and Support panel.
- Both open these drawers. Each drawer ends with a link to the full page: `/where-to-buy/?product=…` or `/support/?product=…`.

## 5. FAQ on the Support page

Below "Manuals & Software's":
- Red "FAQ's" + "Frequently asked questions", and the sub "Find answers to common questions about Red Dragon products, software, setup, and more."
- Search box + red **SEARCH**.
- Pill tabs: **All | Firmware | Setup | Compatibility | Warranty**, generated from `faqs.category`.
- Bordered accordion items with a chevron.
- A "Still need help? Contact us" link at the bottom (point 5).
- Reuse `components/pages/FaqList.tsx`, adding search and tabs.

## 6. Press (`/press/`)

Recommend a **separate page** linked from the footer (About us → Media Kit / Press). The design is a full page, and `press_page` in the CMS is already set up at `/press/`.
- **Hero:** dark red-lit desk photo, eyebrow "PRESS & MEDIA" (red), H1 "Redragon in the Spotlight", sub "Explore the latest news, reviews, awards, and media coverage on Redragon gaming gear."
- **"Latest Press Coverage"** + "Featured articles, reviews, and perspectives from the gaming community."
  - "All Categories" dropdown on the right.
  - **Year timeline** on the left: All Years, 2026 … 2019, with the active year marked by a red dot.
  - **Article cards:** image on the left, small kicker ("REDRAGON Wraps Up"), headline, 2–3 line summary, date, and a red "Read article ↗" link.
- **"Awards & Recognition"** + "A selection of recognitions celebrating quality, design and value in gaming accessories."
  - 4 cards, each with a gold star badge, award name, outlet, month/year and a one-line note.
- **Press Contact** card (the `StillNeedHelp` variant).
- **Press email:** the Figma sitemap (page 03) gives **marketing@redragon.com**. Show it in the Press Contact card; it comes from `press_page.contact_email`.
- **Gap:** the brief asks for a **press-kit / logo-pack download area**, but it isn't in the design. The CMS already has `press_kit`, `logo_pack` and `brand_assets`. See D3.
- Data: `press` collection. Type Award goes to the awards grid; Coverage and Review go to the list. Add a `kicker` text field.

## 8. Contact form: message field

In `components/pages/ContactForm.tsx` (Figma page 05):
- After "what's your enquiry *", add **"Your message *"**: a textarea about 80 px tall, placeholder "Tell us how we can help…".
- Under it, a helper line: "Please describe your question and include your product model if relevant."
- "Phone Number" uses the placeholder "Optional".
- Make sure the CMS Inbox stores and shows the message.

## 9. Form states (Figma page 05, all designed)

One **status box** sits under the submit row: full width, rounded, a small icon on the left and one line of text.

**Contact form** (state label in red small caps above the card, e.g. "CONTACT UX STATE: SUCCESS"):

| State | Box | Text | Extra |
|---|---|---|---|
| Required | pink, red `!` | "Please fill this in. Your message is required." | invalid fields get a red border |
| Submitting | light blue-grey, `…` | "Sending your enquiry…" | button disabled |
| Success | light green, green ✓ | "Thanks, we'll be in touch." | red link "Send another enquiry ↺" resets the form |
| Server error | pink, red `!` | "Something went wrong, try again." | red link "Try again ↺" resubmits |

**Newsletter.** Five placements: Homepage, Gaming (dark band, so use dark variants), Office, About and Blog. Each has 7 states, with the box under the input + SIGN UP row:

| State | Message |
|---|---|
| Default | none |
| Required | "Please fill this in." |
| Invalid email | "Enter a valid email address." (input gets a red border) |
| Filled | helper "Filled with a valid email address; ready to submit." (designer annotation; don't render it) |
| Submitting | "Subscribing…" |
| Success | "Thanks, we'll be in touch." |
| Server error | "Something went wrong, try again." |

Implementation:
- Extend `lib/forms.ts` `useFormSubmit` to expose `status: idle | sending | done | error` plus a field-error map.
- Build one `<FormStatus kind message action />` component.
- Replace the current approach of showing newsletter errors as the browser's own validation message.

## 10. Product comparison (Figma page 02)

**Routes:** `/support/compare/` (home) → `/support/compare/{category}/` (browse) → `/support/compare/{category}/?ids=a,b,c` (results). The breadcrumb on results reads "GAMING / KEYBOARDS / COMPARE".

**Entry points** (sitemap):
- A **"Compare"** checkbox on every product card on category listing pages.
- The Support menu gets a **"Compare products"** item. The full menu is: Help centre · Downloads · Compare products · FAQ.

**Compare tray.** A dark bar pinned to the bottom of listing and browse pages:
- "COMPARE PRODUCTS" + "n of 3 selected · Add one more or compare".
- Up to 3 chips ("EISA 100 PRO ×"); empty slots are dashed "+ Add product" and open the add modal.
- Red **Compare now →**.

**Rules** (designer's handoff note):
1. With 0–1 selected, Compare now is disabled. With 2–3 selected, it's enabled.
2. At 3 selected, the other cards show a disabled Compare and the tray says "3 of 3 selected · Maximum reached".
3. Compare now opens the side-by-side page.
4. Removing an item updates the tray and frees a slot.
5. Specs marked "Not specified" need product-team verification.

Persist the selection in `sessionStorage`, per category.

**Compare home** (`/support/compare/`):
- **Hero:** dark band, breadcrumb "Home / Support / Compare", eyebrow "COMPARE PRODUCTS", H1 "Find the right Redragon gear.", sub "Start with a category or search for a product. Choose 2 or 3 items to compare side by side."
- **Search:** "Search product name, series or model number…" with a red **Search products →** button.
- **"Choose a category"** + "Browse products by type, then add your favorites to a comparison." 4 cards: Keyboards, Mice, Headsets, Accessories. Each has an icon in a pink circle and a red "Explore & compare →" link.
- **"Popular products to compare":** rows with image, name, spec line, model and a red **+ Add** button.
- **"Your comparison is empty"** + "Select two or three products to see their specifications side by side.", with 3 dashed slots "+ Add product 1/2/3".
- **Steps strip:** "01 Pick a category or search · 02 Select up to three products · 03 Compare features".

**Browse** (`/support/compare/keyboards/`):
- "Compare gaming keyboards" + "Find your model, browse recommended keyboards, and add up to three products."
- Category tabs: Keyboards | Mice | Headsets | Accessories. The active tab has a pink fill and red border.
- Search with a red **Search keyboards →** button.
- "Keyboards recommended for comparison" + "5 keyboards · Select up to 3", then a 2-column list of rows. Each row has image, NAME, spec line, model, and a red **+ Add** button. When added, the button becomes pink **✓ Added** and the row turns pink with a red border.
- Pink **TIP** box: "Select Add next to a keyboard. The comparison bar shows your chosen products, and opens a product finder for empty slots."
- Tray, then a grey note: "Maximum 3 products. Compare now becomes available when at least 2 products are selected."
- Searching shows "Search results for "NUBULA"".

**Add-product modal:**
- Dark header "Add a product to compare" / "Find a matching model, choose a category, or browse recommendations." with a close ×.
- Pink bar: "2 of 3 products selected · 1 slot left".
- Search, then tabs Keyboards | Mice | Headsets | All products, then "Suggested keyboards" rows with **+ Add**.
- Right column: "CURRENTLY SELECTED 2 / 3 products" chips, plus a dashed "+ One place remaining".
- Footnote: "You can compare up to 3 products. Remove a selected product to make space."

**Compare page:**
- H1 "Compare Keyboards", sub "Review the differences between selected keyboards before choosing the right fit.", "← Back to Keyboards" on the left and "3 PRODUCTS SELECTED" on the right.
- One white card. The header row has the label "SPECIFICATIONS", then one column per product: red "01 / 03", "× Remove", image, NAME, model and a spec line.
- With only 2 products, the third column is a dashed **"+ ADD A THIRD PRODUCT"** card ("Choose another keyboard to expand the comparison.").
- Row groups:
  - **OVERVIEW:** Product type, Connectivity, Layout / key count, Hot-swappable, Switch technology
  - **PERFORMANCE & DETAILS:** Polling rate, Mounting / build, RGB lighting, Software support, Warranty
- Empty values show "Not specified", or "—" for an empty slot.
- Bottom band: "Find your best keyboard / Need more detail? Open the relevant product page to verify full technical specifications." with a red **View keyboards →** button.

**Data:** add a fixed set of **comparison spec keys per category** in the CMS (`config/cms.php` or the content schema). Products fill them through their existing `specs` key/value rows; matching is by key name, and a missing key means "Not specified".

**Gaps vs the brief:** no "Where to Buy" under each product, no highlighting of differences, no mobile swipe frames. See D2.

## 11. "Find your perfect gear" quiz (Figma page 04)

**Route:** `/find-your-gear/`. Breadcrumb "Home / Find your perfect gear".
- Entry from the homepage and the Gaming/Office pages: the designer asked us to suggest it. **Recommend** a compact dark banner above the footer newsletter, "Not sure which to pick? **Find my gear →**".

**Welcome screen:**
- Dark hero with a desk photo: eyebrow "DISCOVER / YOUR NEXT SETUP", H1 "Find your perfect gear.", sub "Not sure which keyboard, mouse or headset fits? Answer four quick questions and get product suggestions with clear reasons."
- Red **Find my gear →** button, with "4 questions · No account required" beside it.
- "Get a recommendation that makes sense", with 3 cards:
  - **01 Tell us your setup:** Gaming, office, or a bit of both
  - **02 Choose what matters:** Your product category and priority
  - **03 See why it fits:** Clear recommendations and shopping options
- Red **Start the quiz →** button.

**Question screen** (one per step):
- **Dark band:** eyebrow "GEAR FINDER", H1 "Your setup. Your perfect match.", sub "Four quick questions to narrow down the Redragon gear that fits your needs."
- **Top row:** "QUESTION n OF 4" in red small caps on the left; "Exit quiz ×" and "← Back" on the right; a 4-segment red progress bar.
- **Answers:** H2 question + helper line, then a 2×2 grid of answer cards (icon tile, title, sub, radio on the right).
  - Selected card: pink fill, red border, red icon tile, filled red radio.
- **Below the answers:** "Select one answer to continue." until something is chosen, then "YOUR ANSWER / {answer}" in red.
- **Buttons:** red **← Back**; **Continue →** (dark grey and disabled until answered, then red). On Q4 the button reads **See my recommendations →**.
- **Grey note:** "No account needed. You can change an answer with Back, or restart from your results."

**Questions:**

| # | Question / helper | Answers (title — sub) |
|---|---|---|
| Q1 | Where will you use your gear most? / We'll tailor the suggestions for your environment. | Gaming & competition — Play, precision and immersive setups · Office & everyday work — Productivity, typing and comfort · A bit of both — One setup for work and play · I am just exploring — Show me versatile options |
| Q2 | What kind of gear are you looking for? / Choose a product type to keep recommendations relevant. | A keyboard — Typing feel, layout and switches · A mouse — Comfort, tracking and control · A headset — Clear audio for work or gaming · Not sure yet — Recommend a useful starting point |
| Q3 | What matters to you the most? / We'll use this to explain why a product fits. | Speed & precision — Responsive performance and control · Comfort for long sessions — A setup that feels good for hours · Flexible everyday use — Versatility across different tasks · Great value — Strong essentials without extras |
| Q4 | How would you like to connect? / If you are unsure, we can keep both options open. | Wireless freedom — A cleaner desk and flexible movement · Prefer wired — A consistent direct connection · Both options — Switch between setups as needed · No preference — Show me the closest overall matches |

**Loading screen:** white card, "BUILDING YOUR SHORTLIST", red circle icon, "Finding gear that fits your answers…", "Checking your preferences against the available product categories.", red progress bar. The office variant says "Looking for the best fit from the Redragon Office range."

**Results screen:**
- **Dark band:** eyebrow "YOUR PERSONALIZED SHORTLIST", H1 "Your {gaming keyboard} matches", "Based on gaming, keyboards, speed and wireless freedom.", and answer chips (GAMING · KEYBOARDS · SPEED · WIRELESS).
- **"Recommended for you"** + "These suggestions are based on your answers. Product details should be confirmed before purchase."
- **2–3 product cards:** image; tag (**BEST MATCH** / **GREAT ALTERNATIVE** / **ALTERNATIVE TO EXPLORE**); NAME; model · short spec; red label "WHY THIS SUITS YOU" + one sentence; full-width red **Where to Buy →**.
- **Grey "WHY THESE PICKS?" note:** "We match category and stated preferences first…".
- **Buttons:** dark **Start again ↺** and **← Adjust answers**.

**No match screen:** card with a "?" in a pink circle, "NO EXACT MATCH YET", "We could not find a confident match.", "Try a different connection preference or a broader product category. You can also browse the full Redragon range." Buttons: dark **← Change my answer**, red **Browse products →**.

**Confirm modals:**

| Trigger | Eyebrow | Title | Body | Buttons |
|---|---|---|---|---|
| Exit quiz | CONFIRM ACTION | "Leave the gear finder?" | "Your current answers will be lost if you exit before finishing." | dark **Keep my answers**, red **Leave the quiz →** |
| Start again | CONFIRM ACTION | "Start the quiz again?" | "This will clear your answers and let you find a different recommendation." | dark **Keep my answers**, red **Yes, start again ↺** |

**Logic:** the designer's note reads "Recommendation route depends on combined answers; requires catalogue logic."

| Answer | Narrows by |
|---|---|
| Q1 | product section (Gaming / Office / both) |
| Q2 | category ("Not sure yet" means all) |
| Q3 | scoring tag |
| Q4 | connectivity |

Proposed CMS fields:
- Add `quiz_tags` to products: priority tags (speed, comfort, flexible, value) and connectivity (wireless, wired, both).
- Add an optional `quiz_reason` sentence to products, used for "Why this suits you".

How results are picked:
1. Filter by section and category.
2. Score by priority and connectivity.
3. Take the top 2–3, tagged BEST MATCH / GREAT ALTERNATIVE / ALTERNATIVE TO EXPLORE.
4. If nothing scores, show No match.

Everything runs client-side over the published products in the bundle.

## 12. Hardware breakdown (Figma page 06)

An interactive version of the homepage "Exploded Architectural Blueprint". It also suits product pages.
- **Header:** eyebrow "EXPLODED ARCHITECTURAL BLUEPRINT", H2 "Inside the design of PRISM M997", sub "Explore the materials and construction details that matter. Select a numbered point to learn more."
- **Layout:**
  - **Left:** exploded image on a light panel, with numbered circle hotspots 01–06. The active one is filled red.
  - **Right:** a detail card with a red rule, "POINT 02 / 06", title ("Iceflow"), a description and a small source line.
  - **Below the card:** "SELECT A NUMBERED COMPONENT" + "Each point highlights a physical part in the original exploded image." and a "02 / 06 COMPONENTS" counter.
- **Mobile:** stacked; tapping a hotspot shows its detail below.
- Other products appear as "Awaiting artwork" placeholders.
- Designer's CMS note: "max 6 hotspots / product. Image is a replaceable layered asset; hotspots use coordinates aligned to the final image. Copy requires technical approval."
- **CMS:** on the `blueprint` section, or on the product, add a `hotspots` repeater (max 6) with `x%`, `y%`, `title` and `description`. The admin needs a point-picker to place hotspots on the image.

## Decisions needed from you / the designer

- **D1. Not-found illustration.** Neelesh asks: (a) the 3D dragon holding a "Product Not Found" sign, or (b) the line-art dragon in a box. **Recommend (b).** It's already used on the Support not-found screen and the product drawer.
- **D2. Comparison gaps.** The Figma compare page has no "Where to Buy" under each product, no highlighting of differences and no mobile swipe, though the brief asked for all three. **Recommend:** add a Where to Buy button per column and a "Highlight differences" toggle using existing button and pill styles. Ask Neelesh for mobile frames.
- **D3. Press kit downloads.** Not in the design. **Recommend:** add a "Press kit & logos" strip of download cards above the Press Contact card, fed from `press_page`.
- **D4. Where to Buy: two versions.** WhatsApp shows "Online Shopping / Offline Shopping" list cards. Figma page 01 has the **revised "Online / Nearby"** version with 3-column online cards and "Explore products". **Recommend the Figma revised version**, but confirm with Neelesh which is final.
- **D5. Map provider.** Google Maps needs an API key and billing; OpenStreetMap/Leaflet is free. **Recommend Leaflet + OSM.**
- **D6. Mobile frames.** Only the hardware breakdown has mobile frames. Ask for mobile frames for Finder, Where to Buy, compare and the quiz, or we'll adapt using the existing mobile patterns.
- **D7. Fonts.** The design system uses Lexend Exa / Lexend Deca / JetBrains Mono. The site already loads Lexend (`src/lib/fonts.ts`). Only check that JetBrains Mono is loaded before using it for eyebrows.

## Suggested build order

1. **Shared blocks and form states:** StillNeedHelp, EmptyState, StoreCard, VersionCard, SideDrawer, OsSwitch and `FormStatus`, then #8 and #9 across the contact form and all 5 newsletters.
2. **Support:** #1 Finder results (3 states) and #5 FAQ.
3. **Where to Buy:** add the CMS `stores` fields, then build #2 (revised Online/Nearby version, pending D4).
4. **Product pages:** #3 and #4 drawers.
5. **Press:** #6.
6. **Compare:** #10 with the CMS comparison spec keys.
7. **Quiz:** #11 with CMS `quiz_tags` / `quiz_reason`.
8. **Hardware breakdown:** #12 with the CMS hotspots repeater and point-picker.
