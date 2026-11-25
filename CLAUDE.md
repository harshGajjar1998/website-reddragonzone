@AGENTS.md

# Project rules
- **Ask before any extra tool** (skills, subagents, browser, Figma/MCP connectors, web, artifacts, dev servers, builds, tests, deploys): name it, why, and a use/skip recommendation weighing token cost against result quality (plus the fallback if skipped); use it only after the owner says yes. Reading, searching and editing repo files, short inspect commands and `tsc` need no approval. (RULEBOOK §8)
- Status and to-dos: `PENDING-TASKS.md`. Start there; don't replay history.
- Follow `../reddragon-cms/docs/RULEBOOK.md` (§8 is how to work fast). In short: the CMS edits content only (never layout); every CMS image slot has a fixed size; CMS images go through `next/image` + `image-loader.ts`.
- Hosting: staging on Hostinger, production on AWS Singapore. Until the audience is confirmed (PENDING-TASKS D4), avoid services blocked in mainland China.
- Checks: `npx tsc --noEmit` only (it takes several minutes on this PC). No builds, dev servers, screenshots or test suites unless asked; the owner checks visually on staging.
- Figma: the MCP quota is used up; read the local `Figma/` copy (memory `redragon-figma`).
- Push and dispatch with the keyring login: `env -u GH_TOKEN git -c credential.helper= -c "credential.helper=!gh auth git-credential" push`, `env -u GH_TOKEN gh workflow run …`.
