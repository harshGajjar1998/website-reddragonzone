# Product details in one panel

Date: 2026-11-25 · Branch: feature/cms-integration

## Problem
The product page had three separate links: Specifications, Materials & Sustainability and In the Box. Each opened its own side panel. Visitors had to open and close three panels to read a product's details.

## Approach
- The three links become one **"Product Details"** link (`ProductPointers`). Manuals & Software and Where to Buy are unchanged.
- It opens one side panel (`ProductDetails` in `ProductPanel.tsx`) with three sections, separated by rules:
  - Specifications (dimensions and technical groups)
  - Materials & Sustainability
  - In the Box
- Buttons under the title jump to each section. They scroll the panel, not the page.
- Content and CMS fields are unchanged (`productSpecs`, `productMaterials`, `productBoxContents`), so nothing has to be re-entered.
- `PanelId` is now `"details" | "manuals" | "buy"`.

## Files
src/components/product/ProductPanel.tsx, src/components/product/ProductPointers.tsx

## Verify
1. Open any product page. Under the description there are three links: Product Details, Manuals & Software, Where to Buy.
2. Product Details opens one panel with Specifications, Materials & Sustainability and In the Box. Each jump button scrolls the panel to its section.
3. Check it on a phone width and on a featured product (dark hero). Escape and the close button both close the panel.
