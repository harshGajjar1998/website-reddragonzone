# Self-hosted fonts

Latin subsets of Google Fonts families, downloaded as woff2 and loaded with `next/font/local` (`src/lib/fonts.ts`), so the site makes no requests to Google (blocked in mainland China).

All families are licensed under the SIL Open Font License 1.1 (https://openfontlicense.org), which allows bundling them with the site. To refresh a file, download the latin `woff2` from the family's Google Fonts CSS (`https://fonts.googleapis.com/css2?family=<Family>:wght@<range>`) and keep the file name.
