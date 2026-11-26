# Pagination: stay on the listing instead of jumping to the top

## Problem
On a category page, clicking a page number looked like a full page reload: the view jumped to the very top
(`UI-Errors/video1.mp4`). The page didn't actually reload. Pagination is a client-side Next.js `<Link>` to `?page=2`:
the products are swapped in place with no new HTML page and no new data load. But by default Next.js scrolls to the
top of the page after every navigation, so the visitor lost their place and had to scroll back down past the hero.

## Approach
- `src/components/gaming/CategoryListing.tsx`:
  - The pagination links (numbers and arrows) use `scroll={false}`, so Next.js keeps the scroll position.
  - When the page changes and the top of the listing is above the screen, the listing scrolls smoothly into view
    (instantly when the visitor prefers reduced motion). The filters, toolbar and new products are shown right away,
    not the page hero.
  - The URL still changes (`?page=2`), so Back/Forward and shared links work.
- `src/components/blog/BlogListing.tsx`: the blog already had `scroll={false}` but stayed at the bottom. It now brings
  the top of the post list into view the same way.

## Verify
- `npx tsc --noEmit`.
- On staging: scroll to the bottom of a category page and click page 2. The products change without a reload, and the
  view moves to the top of the listing, not the top of the page. Browser Back returns to page 1. Do the same on the
  blog.
