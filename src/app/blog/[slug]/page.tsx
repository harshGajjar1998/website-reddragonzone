import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard from "@/components/blog/BlogCard";
import NewsletterCard from "@/components/blog/NewsletterCard";
import { articleBody, blogPosts, getPost } from "@/data/blog";

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

const body = "font-merriweather text-[16px] font-bold leading-[1.5]";

/** Figma blog detail ("Main Auto layout") */
export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  // API: dynamic data – blog post
  const post = getPost((await params).slug);
  if (!post) notFound();

  // API: dynamic data – related blog posts
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(-3);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden py-12 lg:py-24">
        <Image
          src="/images/pages/blog/detail-grid.png"
          alt=""
          width={2160}
          height={1326}
          className="pointer-events-none absolute left-1/2 top-0 h-[884px] w-[1440px] max-w-none -translate-x-1/2"
        />

        <article className="relative mx-auto flex w-full flex-col gap-8 px-4 lg:w-[688px] lg:gap-12 lg:px-0">
          <Link
            href="/blog"
            className="flex w-fit items-center gap-2 font-dm-sans text-[16px] font-bold leading-[1.1] text-black/40 underline hover:text-black/70"
          >
            <Image src="/icons/pages/back-arrow.svg" alt="" width={13} height={12} className="opacity-40" />
            Back
          </Link>

          <header className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5 font-lexend-deca text-[16px] font-bold leading-[1.25] tracking-[-0.32px]">
              <span className="rounded-2xl bg-white px-2 py-1 text-black">{post.category}</span>
              <span className="text-black/50">{post.date}</span>
            </div>
            <h1 className="font-lexend-deca text-[32px] leading-[1.1] text-black lg:text-[50px] lg:leading-[1.05]">{post.title}</h1>
            <div className="flex items-center gap-4">
              <Image
                src={post.author.avatar}
                alt=""
                width={140}
                height={140}
                className="size-[70px] rounded-full"
              />
              <div className="flex flex-col gap-1 leading-[1.25] tracking-[-0.32px]">
                <p className="font-lexend-deca text-[16px] font-bold text-black">{post.author.name}</p>
                <p className="font-lexend text-[16px] text-black/60">{post.author.position}</p>
              </div>
            </div>
          </header>

          <div className="flex flex-col gap-8">
            <div
              className="relative aspect-[688/383] w-full overflow-hidden rounded-xl lg:h-[383px] lg:w-[688px]"
              style={{ background: post.image.bg }}
            >
              <Image
                src={post.image.src}
                alt={post.title}
                fill
                sizes="(max-width: 1023px) 100vw, 688px"
                preload
                className="object-cover"
              />
            </div>
            {/* API: dynamic data – blog article body */}
            <p className={`${body} text-black`}>{articleBody.lead}</p>
            {articleBody.paragraphs.map((p, i) => (
              <p key={i} className={`${body} text-black/60`}>
                {p}
              </p>
            ))}
            <figure className="flex flex-col gap-5 rounded-[20px] bg-[#f5f5f5] p-6 lg:p-8">
              <Image src="/icons/pages/quote.svg" alt="" width={20} height={18} />
              <blockquote className="font-merriweather text-[20px] italic leading-[1.5] text-black">
                {articleBody.quote.text}
              </blockquote>
              <figcaption className="font-dm-sans text-[12px] tracking-[0.36px] text-black/48">
                {articleBody.quote.author}
              </figcaption>
            </figure>
            <p className={`${body} text-black/60`}>{articleBody.closing}</p>
          </div>
        </article>
      </section>

      <section className="bg-[#f5f5f5] py-14 lg:py-24">
        <div className="page-frame flex flex-col items-center gap-8 px-4 lg:gap-10 lg:px-16">
          <h2 className="font-lexend-deca text-[28px] leading-[1.05] text-black lg:text-[38px]">Read More Blogs</h2>
          <div className="flex w-full flex-col gap-6 lg:w-auto lg:flex-row lg:gap-8">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      <NewsletterCard />
    </div>
  );
}
