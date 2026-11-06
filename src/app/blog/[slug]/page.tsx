import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/blog/ArticleDetail";
import BlogCard from "@/components/blog/BlogCard";
import { blogPosts, getPost } from "@/data/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  // API: dynamic data – blog post slugs
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  // API: dynamic data – blog post (page metadata)
  const post = getPost((await params).slug);
  if (!post) return {};
  return { title: `${post.title} | Redragon Blog`, description: post.excerpt };
}

/** Figma blog detail ("Main Auto layout") */
export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  // API: dynamic data – blog post
  const post = getPost((await params).slug);
  if (!post) notFound();

  // API: dynamic data – related blog posts
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(-3);

  return (
    <ArticleDetail backHref="/blog" article={post} relatedTitle="Read More Blogs">
      {related.map((p) => (
        <BlogCard key={p.slug} post={p} />
      ))}
    </ArticleDetail>
  );
}
