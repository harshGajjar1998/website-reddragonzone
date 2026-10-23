This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Content comes from the CMS

All page content (menus, announcement bar, homepage sections, categories, products, blog, FAQs, stores,
downloads…) is loaded from the Redragon CMS (`../reddragon-cms`) when the site is built:

1. Run the CMS API (`cd ../reddragon-cms/backend && php artisan serve --port=8010`, see its `SETUP.md`).
2. Copy `.env.example` to `.env.local` — it sets `CMS_API_URL`. The build fails with a clear message if
   the CMS can't be reached.
3. `npm run dev` / `npm run build` as usual.

On Netlify, set `CMS_API_URL` in the site's environment variables and put the site's build hook in the
CMS's `CMS_PUBLISH_WEBHOOKS`, so publishing in the CMS rebuilds the site.

- `src/lib/cms/` — fetches the bundle (`api.ts`) and turns it into the shapes the components render (`index.ts`).
- `src/data/*.ts` — those shapes (types only) plus URL helpers.
- `src/data/design-layout.json` — exact image placement from the Figma design, keyed by image path
  (`src/lib/cms/layout.ts`). It applies only while that exact image is used; a new or replaced image gets the
  slot's default placement. Edit this file to fine-tune how a new image sits in its slot.

## Exact preview in the CMS visual editor

The editor's canvas shows the real website with your draft (autosaved, not yet published):

```bash
npm run preview:cms      # http://localhost:3002 – drafts, for the editor only
```

It needs `CMS_PREVIEW_KEY` in `.env.local` set to the same value as `CMS_PREVIEW_KEY` in the CMS backend `.env`.
Each homepage section is wrapped in `<CmsSection>` (only on this server – the public HTML is unchanged), and
`CmsPreviewBridge` lets the editor select sections, scroll to them and refresh after every autosave.
If it isn't running, the editor falls back to a simplified canvas.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
