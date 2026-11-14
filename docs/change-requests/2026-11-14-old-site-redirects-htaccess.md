# Old-site redirects in the static build (.htaccess)

## Problem
SEO plan step 11: Apache/LiteSpeed hosts (Hostinger) need the old-site 301 rules as a `.htaccess` file in the site root. The old URLs use query strings, so `_redirects` and Next redirects can't express them.

## Approach
`scripts/build.mjs`:
1. After a successful static export, it loads the same `.env` files Next uses (`@next/env`).
2. It fetches `CMS_API_URL/api/public/redirects/apache` from the CMS (`App\Services\Redirects`).
3. It writes `out/.htaccess` with those rules plus `ErrorDocument 404 /404.html`.

If the CMS can't be reached, the build still succeeds and logs a warning. Netlify ignores the file. The China nginx server gets the same rules from the CMS repo's `deploy/china/site-build.sh`.

## Verify
`node scripts/build.mjs` against the local CMS: the build passes and `out/.htaccess` has `RewriteRule ^product\.html$ /office/mice/? [R=301,L]`-style rules.
