/* ==================================================================
   Press & Awards (Figma "Press")
   ================================================================== */

import type { ArticleBody } from "@/data/blog";

export type PressArticle = {
  slug: string;
  /** Small line above the headline */
  kicker: string;
  title: string;
  excerpt: string;
  date: string;
  year: number;
  readTime: string;
  image: { src: string; width: number; height: number };
  author: { name: string; position: string; avatar: string };
  body: ArticleBody;
  /** CMS entry id (used by the CMS visual editor's preview) */
  cmsId?: number;
};

export const pressHref = (slug: string) => `/press-and-awards/${slug}`;

export type PressAward = { cmsId?: number; title: string; publication: string; date: string; description: string };

/** Press & Awards page: copy, articles (newest first) and awards, all from the CMS. */
export type PressContent = {
  copy: {
    heroEyebrow: string; heroTitle: string; heroText: string; heroImage: string;
    coverageTitle: string; coverageText: string; awardsTitle: string; awardsText: string; contactTitle: string; contactText: string;
  };
  articles: PressArticle[];
  awards: PressAward[];
};
