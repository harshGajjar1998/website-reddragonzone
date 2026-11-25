"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SocialHeading, SocialWall as Wall } from "@/data/social";
import { Chevron, PlatformIcon, PlayIcon } from "./icons";
import SocialPostViewer from "./SocialPostViewer";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Figma "Social wall / Community gallery" (1440×760): heading with follow buttons, a row of
 * upright 9:16 post cards (4 in view on desktop, swipe on phones) and a range counter with
 * arrows. A card opens the post in the immersive viewer (SocialPostViewer).
 * The cards are sized 9:16 here until the designer's resized frames arrive (PENDING-TASKS D2).
 */
export default function SocialWall({ wall, heading }: { wall: Wall; heading?: Partial<SocialHeading> }) {
  const eyebrow = heading?.eyebrow || wall.eyebrow;
  const title = heading?.title || wall.title;
  const intro = heading?.intro || wall.intro;
  const { posts, profiles } = wall;
  const count = posts.length;

  const track = useRef<HTMLUListElement>(null);
  const [range, setRange] = useState<[number, number]>([0, Math.min(count, 4)]);
  const [open, setOpen] = useState<number | null>(null);

  // Which cards are in view: drives "01—04 / 08 POSTS", the progress bar and the arrows
  const measure = useCallback(() => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const first = Math.round(el.scrollLeft / step);
    const visible = Math.max(1, Math.floor((el.clientWidth + 1 + step - card.offsetWidth) / step));
    setRange([first, Math.min(count, first + visible)]);
  }, [count]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const arrow = "flex size-12 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-default disabled:opacity-40";

  return (
    <section aria-labelledby="social-wall-title" className="overflow-hidden bg-white">
      <div className="page-frame px-4 pt-10 pb-12 lg:px-20 lg:pt-8 lg:pb-10">
        {/* Heading: copy on the left, logo and follow buttons on the right */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[730px]">
            <p className="flex items-center gap-3 font-lexend-deca text-[12px] font-medium leading-[18px] tracking-[0.08em] text-dragon">
              <span aria-hidden className="h-[3px] w-7 bg-[#e60012]" />
              {eyebrow}
            </p>
            <h2 id="social-wall-title" className="mt-4 font-lexend-exa text-[28px] font-semibold leading-[1.25] text-[#1c2024] lg:mt-6 lg:text-[40px]">
              {title}
            </h2>
            {intro && <p className="mt-3 font-lexend-deca text-[16px] leading-6 text-[#626a75] lg:mt-5">{intro}</p>}
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Image src="/brand/redragon-logo.png" alt="" width={92} height={63} className="hidden h-[63px] w-auto lg:block" />
            {profiles.length > 0 && (
              <ul aria-label="Follow Redragon" className="flex flex-wrap gap-2">
                {profiles.map((p) => (
                  <li key={p.platform}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 items-center gap-2.5 rounded-full border border-[#e0e3e6] bg-white pr-5 pl-3.5 font-lexend-deca text-[14px] font-medium text-[#1c2024] transition-colors hover:border-[#1c2024]"
                    >
                      <PlatformIcon platform={p.platform} />
                      {p.platform}
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Posts: snap row, 4 in view at 1280px (308px cards, 16px gaps) */}
        <ul
          ref={track}
          aria-label="Community posts"
          onScroll={measure}
          className="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {posts.map((post, i) => (
            <li key={post.cmsId} className="w-[72%] max-w-[308px] shrink-0 snap-start sm:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)]">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`${post.title}, ${post.platform}: open post`}
                className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-[#e0e3e6] bg-white text-left transition-shadow hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dragon"
              >
                <span className="relative block aspect-[9/16] w-full overflow-hidden rounded-t-[6px] bg-[#111418]">
                  <Image
                    src={post.thumbnail.src}
                    alt={post.thumbnail.alt}
                    fill
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 33vw, 308px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-4 left-4 flex h-9 items-center gap-2 rounded-full bg-white pr-4 pl-3 font-lexend-deca text-[12px] font-medium text-[#1c2024]">
                    <PlatformIcon platform={post.platform} />
                    {post.platform}
                  </span>
                  <span className="absolute top-1/2 left-1/2 flex size-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#1c2024]/85 pl-1 text-white transition-colors group-hover:bg-[#e60012]">
                    <PlayIcon />
                  </span>
                </span>
                <span className="flex flex-col gap-3.5 px-5 pt-4 pb-5">
                  <span className="line-clamp-2 font-lexend-deca text-[17px] font-medium leading-[1.4] text-[#1c2024] lg:text-[19px]">{post.title}</span>
                  <span className="flex items-center justify-between font-lexend-deca text-[13px] leading-5 text-[#626a75]">
                    {post.video || post.platform !== "Instagram" ? "Watch video" : "View post"}
                    <Chevron dir="right" className="h-3.5 w-[7px] text-[#e60012]" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Range, progress and arrows */}
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="flex items-baseline gap-2 font-lexend-deca font-medium">
              <span className="text-[16px] leading-6 text-[#1c2024]">
                {pad(range[0] + 1)}—{pad(range[1])}
              </span>
              <span className="text-[12px] leading-[18px] text-[#626a75]">/ {pad(count)} POSTS</span>
            </p>
            <div aria-hidden className="mt-2 h-[3px] w-[180px] rounded-full bg-[#e0e3e6] lg:w-[280px]">
              <div
                className="h-full rounded-full bg-[#e60012] transition-all duration-300"
                style={{ marginLeft: `${(range[0] / count) * 100}%`, width: `${((range[1] - range[0]) / count) * 100}%` }}
              />
            </div>
          </div>
          {count > range[1] - range[0] && (
            <div className="flex gap-4">
              <button type="button" aria-label="Previous posts" disabled={range[0] === 0} onClick={() => page(-1)} className={`${arrow} border border-[#e0e3e6] bg-white text-[#1c2024] hover:border-[#1c2024]`}>
                <Chevron dir="left" />
              </button>
              <button type="button" aria-label="Next posts" disabled={range[1] >= count} onClick={() => page(1)} className={`${arrow} bg-[#e60012] text-white hover:bg-[#c3151c]`}>
                <Chevron dir="right" />
              </button>
            </div>
          )}
        </div>
      </div>

      {open !== null && <SocialPostViewer posts={posts} start={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
