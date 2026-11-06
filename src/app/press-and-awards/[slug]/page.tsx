import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/blog/ArticleDetail";
import BlogCard from "@/components/blog/BlogCard";
import { getPressArticle, pressArticles } from "@/data/press";

export const dynamicParams = false;

export function generateStaticParams() {
  // API: dynamic data – press article slugs
  return pressArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/press-and-awards/[slug]">): Promise<Metadata> {
  // API: dynamic data – press article (page metadata)
  const article = getPressArticle((await params).slug);
  if (!article) return {};
  return { title: `${article.title} | Redragon Press`, description: article.excerpt };
}

/** Press article: the blog detail layout with "Read More Articles". */
export default async function PressArticlePage({ params }: PageProps<"/press-and-awards/[slug]">) {
  // API: dynamic data – press article
  const article = getPressArticle((await params).slug);
  if (!article) notFound();

  // API: dynamic data – related press articles
  const related = pressArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <ArticleDetail
      backHref="/press-and-awards"
      article={{ ...article, category: article.kicker }}
      lead={article.excerpt}
      relatedTitle="Read More Articles"
    >
      {related.map((a) => (
        <BlogCard key={a.slug} post={{ ...a, category: a.kicker }} basePath="/press-and-awards" />
      ))}
    </ArticleDetail>
  );
}
