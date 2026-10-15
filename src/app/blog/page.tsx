import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import BlogListing, { BlogListingFromUrl } from "@/components/blog/BlogListing";
import NewsletterCard from "@/components/blog/NewsletterCard";
import { blogPosts } from "@/data/blog";

const description =
  "Explore the newest Redragon Zone gaming peripherals, product launches, exclusive deals, gamer testimonials, and industry news.";

export const metadata: Metadata = { title: "Blog | Redragon", description };

/** Figma "Blog Home Page" */
export default function BlogPage() {
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
        <header className="flex flex-col items-center gap-4 text-center lg:gap-3">
          <p className="flex h-[18px] items-center lg:h-7 gap-1 rounded-[37px] py-0.5 pr-2 pl-3 font-lexend-deca text-[16px] leading-[1.5] text-[#111] shadow-[0_4px_10px_rgb(17_17_17/0.02)]">
            Redragon Zone Blog
            <Image src="/icons/pages/sparkle.svg" alt="" width={16} height={16} />
          </p>
          <div className="flex flex-col items-center gap-4">
            <h1 className="w-full font-lexend-deca text-[36px] leading-[41px] text-[#111] lg:w-[1136px] lg:text-[64px] lg:leading-[1.2]">
              Latest in Gaming Tech &amp; Accessories
            </h1>
            <p className="w-full max-w-[473px] font-lexend-deca text-[16px] leading-[1.5] text-[#111]/60 lg:text-[18px]">{description}</p>
          </div>
        </header>

        {/* Page 1 is pre-rendered; ?page=N is applied in the browser */}
        <Suspense fallback={<BlogListing posts={blogPosts} page={1} />}>
          <BlogListingFromUrl posts={blogPosts} />
        </Suspense>
      </div>

      <NewsletterCard />
    </div>
  );
}
