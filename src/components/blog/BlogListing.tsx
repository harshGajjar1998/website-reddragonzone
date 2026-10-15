"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { blogCategories, type BlogCategory, type BlogPost } from "@/data/blog";
import BlogCard, { DiscoverMore, PostMeta } from "./BlogCard";

const PER_PAGE = 6;

function FeaturedPost({ post }: { post: BlogPost }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="flex flex-col overflow-hidden rounded-[6px] bg-white outline outline-1 outline-[#111]/10 lg:h-[500px] lg:w-[1312px] lg:flex-row">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block h-[230px] w-full shrink-0 overflow-hidden lg:h-[500px] lg:w-[769px]"
      >
        <Image src={post.image.src} alt="" fill sizes="(max-width: 1023px) 100vw, 769px" preload className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-4 p-5 lg:gap-0 lg:px-14 lg:py-12">
        <div className="flex flex-col gap-4 lg:gap-6">
          <PostMeta post={post} />
          <div className="flex flex-col gap-4">
            <h2 className="font-lexend-deca text-[28px] leading-[36px] text-[#111] lg:text-[40px] lg:leading-[1.2]">
              <Link href={href} className="hover:text-dragon">
                {post.title}
              </Link>
            </h2>
            <p className="font-lexend text-[16px] leading-[1.5] text-[#111]/60">{post.excerpt}</p>
          </div>
        </div>
        <DiscoverMore href={href} rounded={4} />
      </div>
    </article>
  );
}

function Pagination({ page, total, href }: { page: number; total: number; href: (p: number) => string }) {
  const cell =
    "flex size-10 items-center justify-center rounded-[2px] font-lexend text-[16px] leading-[1.5] shadow-[inset_0_0_0_1px_rgb(17_17_17/0.1)]";
  const arrow = (dir: -1 | 1) => {
    const target = page + dir;
    const icon = (
      <Image src="/icons/gaming/page-next.svg" alt="" width={16} height={16} className={dir < 0 ? "-scale-x-100" : ""} />
    );
    const label = dir < 0 ? "Previous page" : "Next page";
    return target < 1 || target > total ? (
      <span aria-disabled aria-label={label} className={`${cell} bg-white opacity-50`}>
        {icon}
      </span>
    ) : (
      <Link href={href(target)} scroll={false} aria-label={label} className={`${cell} bg-white hover:bg-[#f0f0f0]`}>
        {icon}
      </Link>
    );
  };
  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <ul className="flex gap-4">
        <li>{arrow(-1)}</li>
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <Link
              href={href(p)}
              scroll={false}
              aria-current={p === page ? "page" : undefined}
              className={`${cell} ${p === page ? "bg-[#e60012] text-white shadow-none" : "bg-white text-[#111] hover:bg-[#f0f0f0]"}`}
            >
              {p}
            </Link>
          </li>
        ))}
        <li>{arrow(1)}</li>
      </ul>
    </nav>
  );
}

/** Category tabs, featured post, 3-column grid and pagination (Figma "Content" + "Pagination"). */
export default function BlogListing({ posts, page }: { posts: BlogPost[]; page: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [category, setCategory] = useState<BlogCategory | null>(null);

  const filtered = category ? posts.filter((p) => p.category === category) : posts;
  // Page 1 of "Browse all" leads with the featured post
  const featured = category ? undefined : filtered[0];
  const rest = category ? filtered : filtered.slice(1);
  const total = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const current = Math.min(Math.max(page, 1), total);
  const items = rest.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const rows: BlogPost[][] = [];
  for (let i = 0; i < items.length; i += 3) rows.push(items.slice(i, i + 3));

  const href = (p: number) => (p === 1 ? pathname : `${pathname}?page=${p}`);
  const choose = (c: BlogCategory | null) => {
    setCategory(c);
    if (page !== 1) router.replace(pathname, { scroll: false });
  };

  /** Mobile (Figma "Blog home — Mobile" Categories): outlined chips wrapping inside a white box */
  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`h-[38px] cursor-pointer rounded-[4px] border px-3 font-lexend text-[12px] leading-[18px] transition-colors ${
        active ? "border-[#e60012] bg-[#e60012] text-white" : "border-[#111]/70 text-[#111] hover:bg-[#111]/5"
      }`}
    >
      {label}
    </button>
  );

  const tab = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`cursor-pointer rounded-[4px] px-4 py-2 font-lexend text-[16px] leading-[1.5] transition-colors ${
        active ? "bg-[#e60012] text-white shadow-[0_1px_3px_rgb(0_0_0/0.05)]" : "text-[#111] hover:bg-[#111]/5"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div
        role="tablist"
        aria-label="Blog categories"
        className="mt-7 flex flex-wrap gap-1 rounded-[6px] bg-white p-2 shadow-[0_4px_10px_rgb(17_17_17/0.02),inset_0_0_0_1px_rgb(17_17_17/0.08)] lg:hidden"
      >
        {chip("Browse all", category === null, () => choose(null))}
        {blogCategories.map((c) => chip(c, category === c, () => choose(c)))}
      </div>

      <div className="mt-12 hidden justify-center lg:flex">
        <div
          role="tablist"
          aria-label="Blog categories"
          className="flex h-14 shrink-0 items-center rounded-[6px] whitespace-nowrap bg-white p-2 shadow-[0_4px_10px_rgb(17_17_17/0.02),inset_0_0_0_1px_rgb(17_17_17/0.08)]"
        >
          {tab("Browse all", category === null, () => choose(null))}
          {blogCategories.map((c) => tab(c, category === c, () => choose(c)))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6 lg:mt-16 lg:gap-16">
        {featured && current === 1 && <FeaturedPost post={featured} />}
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {row.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-16 text-center font-lexend text-[16px] text-[#111]/60">No articles in this category yet.</p>
        )}
      </div>

      <div className="mt-12 lg:mt-20">
        <Pagination page={current} total={total} href={href} />
      </div>
    </>
  );
}

/** Reads `?page=` in the browser (static export has no server-side searchParams). Wrap in <Suspense>. */
export function BlogListingFromUrl({ posts }: { posts: BlogPost[] }) {
  const page = Math.max(1, Number(useSearchParams().get("page")) || 1);
  return <BlogListing posts={posts} page={page} />;
}
