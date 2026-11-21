# Footer copyright from the CMS

## Problem
"© 2026 REDRAGON" was written into `Footer.tsx` and `MobileFooter.tsx`. It couldn't be changed without a code change, and it would go stale in January.

## Approach
The CMS now has a site-wide **Copyright** setting under Site-wide › Footer (`settings.copyright`, default `© {year} REDRAGON`). `chrome()` in `src/lib/cms/index.ts` turns it into `chrome.copyright`, replacing `{year}` with the build year. Both footers render it. Because the site rebuilds on every CMS publish, the year stays current.

## Files
`src/lib/cms/api.ts` (`settings.copyright`), `src/data/navigation.ts` (`ChromeContent.copyright`), `src/lib/cms/index.ts`, `src/components/layout/Footer.tsx`, `src/components/layout/MobileFooter.tsx`.

## Verify
Build against the CMS. The footer (desktop and phone) shows "© 2026 REDRAGON". Change the copyright in the CMS and rebuild: the footer shows the new text.
