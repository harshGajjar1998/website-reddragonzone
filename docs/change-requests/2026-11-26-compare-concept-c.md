# Compare page: "Perfect Match" stepper (concept C)

Date: 2026-11-26 · Branch: feature/cms-integration

## Problem
The owner chose concept C from Figma "Change to be made in design" → Compare screen (`3314:1757`). Before this
change, the compare page only worked after visitors had ticked "Compare" on a category page. Opened directly, it
redirected away. Concept C lets visitors start on the page: pick a category, then pick the models.

## Approach
- **Banner** (`CompareHero`, Figma `3314:1758`): blurred desk photo, "Perfect Match" (Audiowide 112) and an intro line.
- **Step 01** (`ComparePicker`): Keyboards / Mice / Headsets tiles (faded outline word, product photo, red border
  when picked). Switching category clears the models, because different categories can't share the table.
- **Step 02**: three searchable model fields (`MODEL 01`, `02`, `03 / OPTIONAL`). Each field becomes usable once
  the previous one is filled. The list searches name and model, lists every product in that category (gaming and
  office), and hides models already picked. Model 03 has "SKIP · COMPARE TWO", and a filled field has
  "Clear this model". Escape or a click outside closes the list.
- **Table**: the existing table, right below on the same page. The "Add a … product" card now opens the next model
  field instead of the old pop-up. "Remove" uses the new 14 px cross from Figma (`3367:3019`).
- Before any model is picked, a dashed box explains what to do. This also leaves room for the open list.
- The selection still lives in `lib/compare.ts` (new `setCompareAt`, `clearCompare`), so the "Compare" ticks
  on category pages and the compare tray still work. The page no longer redirects when empty.
- Images: `public/images/compare/perfect-match-hero.jpg` and `category-keyboards.png` come from the Figma file.
  Mice and Headsets reuse `/images/home/mouse-m919.png` and `headset-h894.png`, the same images Figma uses.
- Unchanged, and still open to decision D6: the pink "differs" rows and the "Where to buy" row. They aren't in
  concept C.

## Files
src/components/compare/CompareView.tsx, ComparePicker.tsx (new), CompareHero.tsx (new); src/lib/compare.ts;
public/images/compare/

## Not yet in the CMS
The banner text and photo, the category tile photos and the step labels are in code. Moving them to the CMS
(as a "Compare page" block with fixed image slots) is PENDING-TASKS C4.

## Verify
1. Open `/compare/` directly: the banner, then steps 01 and 02 with an empty box below.
2. Pick Model 01: the table appears. Pick Model 02. "Add a third product" opens Model 03. "Skip · compare two" closes it.
3. Switch to Mice: the models clear and step 02 says "Select your mice".
4. Tick Compare on two products on a category page, then open the tray's Compare: both are filled in.
5. At phone width the tiles stack, the fields are full width and the page doesn't scroll sideways.
