import type { Metadata } from "next";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import Image from "next/image";
import { Suspense } from "react";
import BlogListing, { BlogListingFromUrl } from "@/components/blog/BlogListing";
import NewsletterCard from "@/components/blog/NewsletterCard";
import { getContent } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Blog | Redragon", description: (await getContent()).blog.copy.description };
}

/** Figma "Blog Home Page" */
export default async function BlogPage() {
  const { posts: blogPosts, categories, copy } = (await getContent()).blog;
  return (
    <div className="bg-silver relative overflow-hidden">
      {/* Faint grid backdrop behind the heading */}
      <Image
        src="/images/pages/blog/hero-grid.png"
        alt=""
        width={2160}
        height={1326}
        preload
        className="pointer-events-none absolute left-1/2 top-[97px] h-[884px] w-[1440px] max-w-none -translate-x-1/2"
      />

      <div className="page-frame relative px-5 pt-10 pb-14 lg:px-16 lg:pt-20 lg:pb-20">
        <CmsSection ids={["singleton:blog_settings"]}>
        <header className="flex flex-col items-center gap-4 text-center lg:gap-3">
          <p className="flex h-[18px] items-center lg:h-7 gap-1 rounded-[37px] py-0.5 pr-2 pl-3 font-lexend-deca text-[16px] leading-[1.5] text-[#111] shadow-[0_4px_10px_rgb(17_17_17/0.02)]">
            {copy.eyebrow}
            <Image src="/icons/pages/sparkle.svg" alt="" width={16} height={16} />
          </p>
          <div className="flex flex-col items-center gap-4">
            <h1 className="w-full font-lexend-deca text-[36px] leading-[41px] text-[#111] lg:w-[1136px] lg:text-[64px] lg:leading-[1.2]">
              {copy.title}
            </h1>
            <p className="w-full max-w-[473px] font-lexend-deca text-[16px] leading-[1.5] text-[#111]/60 lg:text-[18px]">{copy.description}</p>
          </div>
        </header>
        </CmsSection>

        {/* Page 1 is pre-rendered; ?page=N is applied in the browser */}
        {/* API: dynamic data – blog posts */}
        <CmsSection ids={["singleton:blog_settings", ...entryIds(blogPosts)]}>
        <Suspense fallback={<BlogListing posts={blogPosts} categories={categories} page={1} />}>
          <BlogListingFromUrl posts={blogPosts} categories={categories} />
        </Suspense>
        </CmsSection>
      </div>

      <NewsletterCard />
    </div>
  );
}
