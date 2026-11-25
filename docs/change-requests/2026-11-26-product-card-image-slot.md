# Product cards: photos stay inside a fixed image slot

Date: 2026-11-26 · Branch: feature/cms-integration · Reported: `UI-Errors/1.png`

## Problem
On category pages, the desktop product cards placed every part at fixed pixel positions on top of each other.
The photo box (274 px small, 422 px large) reached down into the hover description and arrow. The name was
squeezed into a 128 px column, so long imported names ran into the photo. Hand-placed Figma photo positions
(`smallArt` / `largeArt`) could also spill past the card. On PRISM PRO M997, the photo covered "Lightweight
Magnesium Alloy Wireless Gaming Mouse" and the thumbs-up.

## Approach
`ProductCard` is now three stacked areas inside the same card sizes (470×416, 308×384):
1. **Header**: the name, cut off after 2 lines with the full name on hover. Two lines are always reserved, so
   photos line up across a row. The label sits on the right, with room kept for the Compare tick below it.
2. **Image slot**: fills the space between header and footer (250 px tall on large cards, 240 px on small ones).
   The photo is fitted inside it (`object-contain`) and clipped at its edges.
3. **Footer**: a strip kept for the hover description (up to 3 lines), the thumbs-up (large cards) and the arrow.
   It stays empty until hover, so nothing sits under the photo.

On phones (`MobileProductCard` in `CategoryListing.tsx`), the photo box now starts below the label and the label
is cut off with "…", so the two can't overlap.

Trade-off: listing cards no longer use the hand-placed Figma photo positions (`smallArt` / `largeArt`). Every
photo is fitted the same way. The data is still there, but nothing on the listing uses it now.

## Files
src/components/gaming/ProductCard.tsx, src/components/gaming/CategoryListing.tsx

## Verify
1. Open `/gaming/mice/` at desktop width and hover each card. The description and arrow sit below the photo,
   never on it.
2. Long names (e.g. "ASTROLABE LITE M725W-LIT") wrap onto two lines above the photo.
3. Script check used: on all 14 mice cards, no header or footer overlaps the image slot, and every photo stays
   inside its slot.
4. On a phone, the label (e.g. "MOUSE") stays readable above the photo.
