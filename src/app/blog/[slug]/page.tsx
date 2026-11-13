import type { Metadata } from "next";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/blog/ArticleDetail";
import BlogCard from "@/components/blog/BlogCard";
import { getContent } from "@/lib/cms";

const getPost = async (slug: string) => (await getContent()).blog.posts.find((p) => p.slug === slug);

export async function generateStaticParams() {
  // API: dynamic data – blog post slugs
  return (await getContent()).blog.posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  // API: dynamic data – blog post (page metadata)
  const post = await getPost((await params).slug);
  if (!post) return {};
  return { title: `${post.title} | Redragon Blog`, description: post.excerpt };
}

/** Figma blog detail ("Main Auto layout") */
export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  // API: dynamic data – blog post
  const post = await getPost((await params).slug);
  if (!post) notFound();

  // API: dynamic data – related blog posts
  const related = (await getContent()).blog.posts.filter((p) => p.slug !== post.slug).slice(-3);

  return (
    <CmsSection ids={entryIds([post, ...related])}>
      <ArticleDetail backHref="/blog" article={post} body={post.body} relatedTitle="Read More Blogs">
        {related.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </ArticleDetail>
    </CmsSection>
  );
}
