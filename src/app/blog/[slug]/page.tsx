import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/blog/ArticleDetail";
import BlogCard from "@/components/blog/BlogCard";
import { getContent } from "@/lib/cms";
import JsonLd from "@/components/JsonLd";
import { article, breadcrumbs } from "@/lib/structured-data";

const getPost = async (slug: string) => (await getContent()).blog.posts.find((p) => p.slug === slug);

export async function generateStaticParams() {
  // API: dynamic data – blog post slugs
  return (await getContent()).blog.posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  // API: dynamic data – blog post (page metadata)
  const post = await getPost((await params).slug);
  if (!post) return {};
  return pageMetadata(`/blog/${post.slug}/`, { title: `${post.title} | Redragon Blog`, description: post.excerpt, image: post.image.src, type: "article" });
}

/** Figma blog detail ("Main Auto layout") */
export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  // API: dynamic data – blog post
  const post = await getPost((await params).slug);
  if (!post) notFound();

  // API: dynamic data – related blog posts
  const { blog, siteUrl } = await getContent();
  const related = blog.posts.filter((p) => p.slug !== post.slug).slice(-3);
  const path = `/blog/${post.slug}/`;

  return (
    <CmsSection ids={entryIds([post, ...related])}>
      <JsonLd
        data={[
          article(siteUrl, { path, title: post.title, description: post.excerpt, image: post.image.src, date: post.date, author: post.author.name }),
          breadcrumbs(siteUrl, [{ name: "Blog", path: "/blog/" }, { name: post.title, path }]),
        ]}
      />
      <ArticleDetail backHref="/blog" article={post} body={post.body} relatedTitle="Read More Blogs">
        {related.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </ArticleDetail>
    </CmsSection>
  );
}
