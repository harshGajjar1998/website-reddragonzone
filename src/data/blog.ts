/* ==================================================================
   Blog (Figma "Blog Home Page", "Main Auto layout" detail page).
   Posts and categories come from the CMS (Content → Blog posts,
   Blog settings); see src/lib/cms.
   ================================================================== */

export type BlogCategory = string;

export type ArticleBody = {
  lead: string;
  paragraphs: string[];
  quote: { text: string; author: string };
  closing: string;
};

export type BlogPost = {
  /** CMS entry id (used by the CMS visual editor's preview) */
  cmsId?: number;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  readTime: string;
  date: string;
  image: { src: string; width: number; height: number; bg?: string };
  author: { name: string; position: string; avatar: string };
  body: ArticleBody;
};
