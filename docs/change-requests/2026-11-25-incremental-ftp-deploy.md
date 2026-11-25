# Deploys upload only changed files

Date: 2026-11-25 · Branch: feature/cms-integration

## Problem
Every deploy, including every CMS publish, re-sent all ~4,200 page files and some assets to Hostinger over FTPS. That was ~2.7 GB before the catalogue fix and ~150 MB after, and took 27 minutes against a 30-minute limit. There were two causes:
- Next stamps every page with a new random build ID on each build, so every page file changed even when its content didn't.
- The upload couldn't tell which files had really changed: lftp `mirror` compares only size and time, so all pages were re-sent on purpose.

## Approach
- **Same code, same build ID** (`next.config.mjs` `generateBuildId`): the website's git commit (`GITHUB_SHA` in Actions). A CMS publish rebuilds the same commit, so only pages whose content changed come out different. A code push gets a new commit and therefore a new ID, which re-sends the pages (rare).
- **`scripts/deploy-ftp.sh`** replaces the three `mirror` passes:
  1. Fingerprints every file in `out/` (sha1) and downloads the list from the previous deploy (`.deploy-manifest` in the web root).
  2. Removes that list from the server first, so a deploy cut short is followed by a full one and nothing can be skipped by mistake.
  3. Uploads new or changed files over 8 FTPS sessions: assets first, then pages, so a page never points at a missing script. It then deletes files the build no longer has and saves the new list.
  4. With no list on the server (the first deploy, or after an interrupted one), it falls back to the old full mirror.
  It keeps the old safety checks: it refuses to upload into a folder that holds `public_html`, and leaves `.well-known` alone.
- The workflow's time limit is raised from 30 to 60 minutes, for the occasional full upload.

## Files
scripts/deploy-ftp.sh (new), next.config.mjs, .github/workflows/deploy-hostinger.yml

## Verify
- A dry run with a stub `lftp` uploaded only a changed page and image (assets first), deleted a removed file, quoted names with spaces and skipped `.well-known`.
- On GitHub: the first run after this change has no list on the server, so it does a full upload and saves one. A second run with nothing changed (Actions → Run workflow) should log about "Changed: 0 assets, 0 page files" and finish in a few minutes.
- After a CMS edit to one product, the log should show only that product's page files and the category and other pages that list it.
