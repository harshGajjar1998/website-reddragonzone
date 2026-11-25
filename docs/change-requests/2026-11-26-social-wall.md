# Social wall (Community gallery + immersive post)

## Problem
The site needs a social wall showing Redragon's Instagram reels, TikToks and YouTube Shorts, with the posts chosen in
the CMS. Owner decisions (2026-11-26, PENDING-TASKS D2): the Figma "Community gallery" grid with the "Immersive post"
viewer, upright 9:16 cards sized by us until the designer's frames arrive, shown on Home, Gaming and Office and
placeable by editors.

## Approach
- Data: `src/data/social.ts`. `src/lib/cms/index.ts` `socialWall()` maps the CMS "Community wall" settings and
  "Social posts" to `content.social`. A post needs a link and a cover; with no posts the wall is `null` and is not
  shown. `src/lib/cms/api.ts` holds the bundle types.
- `src/components/social/SocialWall.tsx` (Figma `3325:2032`): eyebrow with red accent, heading, intro, logo and
  "follow" buttons (from the profile links). The cards are a 9:16 snap row, 4 in view at 1280px (72% wide on phones).
  Below them: "01—04 / 08 POSTS", a progress bar and previous/next arrows.
- `src/components/social/SocialPostViewer.tsx` (Figma `3326:1854`): a dark full-screen viewer with the stage on the
  left and the story panel on the right (publisher, platform, title, caption, "View on <platform>", three more
  posts, previous/next and "01 / 05"). It stacks on phones and supports Esc, ← → and focus return.
- China rule (D4 open): nothing loads from Instagram, TikTok or YouTube. Covers are self-hosted. A post with an MP4
  link plays in the viewer; otherwise play and "View on …" open the original in a new tab. Embedded players can be
  added in the viewer if the audience is global.
- Placement: homepage section type `social` (`src/app/page.tsx`, heading overrides per section), and Gaming and Office
  pages when "Show on the Gaming/Office page" is on (`src/app/{gaming,office}/page.tsx`).
- Icons: `src/components/social/icons.tsx`.

## Verify
- `npx tsc --noEmit`.
- On staging: add 5+ Social posts in the CMS (paste YouTube Shorts/TikTok links; covers are fetched on save), publish
  them, then add the "Community wall" section on the homepage and switch the wall on for Gaming/Office. Check
  the arrows, the counter, swiping on a phone, opening a post, previous/next, "More posts", Esc, and a post with an MP4.
