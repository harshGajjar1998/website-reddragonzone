import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/blog/ArticleDetail";
import BlogCard from "@/components/blog/BlogCard";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/lib/cms";
import { article as articleLd, breadcrumbs } from "@/lib/structured-data";

const pressArticle = async (slug: string) => (await getContent()).press.articles.find((a) => a.slug === slug);

export const dynamicParams = false;

export async function generateStaticParams() {
  // A static export needs at least one path; "_" is never linked and renders the 404 page.
  const slugs = (await getContent()).press.articles.map((a) => ({ slug: a.slug }));
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/press-and-awards/[slug]">): Promise<Metadata> {
  const article = await pressArticle((await params).slug);
  if (!article) return {};
  return pageMetadata(`/press-and-awards/${article.slug}/`, { title: `${article.title} | Redragon Press`, description: article.excerpt, image: article.image.src, type: "article" });
}

/** Press article: the blog detail layout with "Read More Articles". */
export default async function PressArticlePage({ params }: PageProps<"/press-and-awards/[slug]">) {
  const article = await pressArticle((await params).slug);
  if (!article) notFound();

  const { press, siteUrl } = await getContent();
  const related = press.articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const path = `/press-and-awards/${article.slug}/`;

  return (
    <>
      <JsonLd
        data={[
          articleLd(siteUrl, { path, title: article.title, description: article.excerpt, image: article.image.src, date: article.date, author: article.author.name }),
          breadcrumbs(siteUrl, [{ name: "Press & Awards", path: "/press-and-awards/" }, { name: article.title, path }]),
        ]}
      />
      <ArticleDetail
        backHref="/press-and-awards"
        article={{ ...article, category: article.kicker }}
        body={article.body}
        lead={article.body.lead || article.excerpt}
        relatedTitle="Read More Articles"
      >
        {related.map((a) => (
          <BlogCard key={a.slug} post={{ ...a, category: a.kicker }} basePath="/press-and-awards" />
        ))}
      </ArticleDetail>
    </>
  );
}
