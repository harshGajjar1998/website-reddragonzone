"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SocialPost } from "@/data/social";
import { Chevron, ExternalIcon, PlatformIcon, PlayIcon } from "./icons";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Figma "Social wall / Immersive post" (1440×900): the post on a dark stage, its story on the right
 * (publisher, title, caption, "View on <platform>", three more posts, previous/next with "01 / 05").
 *
 * Until the audience is confirmed (PENDING-TASKS D4) nothing loads from Instagram, TikTok or YouTube:
 * a post with a self-hosted MP4 plays here; any other shows its cover, and play opens the original.
 */
export default function SocialPostViewer({ posts, start, onClose }: { posts: SocialPost[]; start: number; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const count = posts.length;
  const post = posts[index];
  const go = (i: number) => setIndex((i + count) % count);
  const more = Array.from({ length: Math.min(3, count - 1) }, (_, k) => (index + k + 1) % count);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      else if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, onClose]);

  const round = "flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-colors";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${post.title}, ${post.platform}`}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#111418] animate-[fade-in_200ms_ease-out] lg:flex lg:items-center lg:justify-center lg:p-10"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex min-h-full w-full max-w-[1312px] flex-col overflow-hidden bg-[#0a0c0f] lg:h-[min(820px,calc(100vh-80px))] lg:min-h-0 lg:flex-row lg:rounded-xl">
        {/* Stage */}
        <div className="relative flex h-[62vh] shrink-0 items-center justify-center bg-[#0a0c0f] lg:h-full lg:flex-1">
          {post.video ? (
            <video
              key={post.video}
              src={post.video}
              poster={post.thumbnail.src}
              controls
              autoPlay
              playsInline
              className="aspect-[9/16] h-full max-w-full rounded-[6px] bg-black object-contain"
            />
          ) : (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Play on ${post.platform} (opens in a new tab)`}
              className="group relative block aspect-[9/16] h-full max-w-full overflow-hidden rounded-[6px]"
            >
              <Image key={post.thumbnail.src} src={post.thumbnail.src} alt={post.thumbnail.alt} fill sizes="(max-width: 1024px) 60vh, 470px" className="object-cover" />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#e60012] pl-1 text-white transition-transform group-hover:scale-105">
                <PlayIcon />
              </span>
              <span className="absolute bottom-5 left-5 flex items-center gap-2 font-lexend-deca text-[14px] font-medium text-white">
                <PlatformIcon platform={post.platform} className="size-4" />
                Watch on {post.platform}
              </span>
            </a>
          )}
        </div>

        {/* Story and navigation */}
        <div className="flex w-full shrink-0 flex-col bg-[#1c2026] px-6 py-6 lg:w-[448px] lg:overflow-y-auto lg:px-8 lg:py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-[60px] items-center justify-center rounded-[4px] bg-white">
                <Image src="/brand/redragon-logo.png" alt="" width={44} height={30} className="h-[30px] w-auto" />
              </span>
              <span>
                <span className="block font-lexend-deca text-[18px] font-medium leading-[27px] text-white">Redragon</span>
                <span className="flex items-center gap-2 font-lexend-deca text-[12px] leading-[18px] text-[#bdc3cc]">
                  <PlatformIcon platform={post.platform} className="size-4" />
                  {post.platform}
                </span>
              </span>
            </div>
            <button ref={closeBtn} type="button" aria-label="Close" onClick={onClose} className={`${round} size-11 bg-[#2a3038] hover:bg-[#3a414b]`}>
              <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M1 1l10 10M11 1 1 11" />
              </svg>
            </button>
          </div>

          <hr aria-hidden className="mt-8 h-0.5 border-0 bg-[#e60012]" />

          <h2 aria-live="polite" className="mt-8 font-lexend-exa text-[24px] font-semibold leading-[1.4] text-white lg:mt-10 lg:text-[28px]">
            {post.title}
          </h2>
          {post.caption && <p className="mt-5 whitespace-pre-line font-lexend-deca text-[16px] leading-[26px] text-[#bdc3cc]">{post.caption}</p>}

          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex h-14 shrink-0 items-center justify-between rounded-[6px] bg-[#e60012] px-5 font-lexend-deca text-[15px] font-medium text-white transition-colors hover:bg-[#c3151c] lg:mt-10"
          >
            View on {post.platform}
            <ExternalIcon />
            <span className="sr-only">(opens in a new tab)</span>
          </a>

          {more.length > 0 && (
            <>
              <hr aria-hidden className="mt-10 border-0 border-t border-[#383e47]" />
              <p className="mt-6 font-lexend-deca text-[14px] font-medium leading-[21px] text-white">More posts</p>
              <ul className="mt-4 grid grid-cols-3 gap-3">
                {more.map((i) => (
                  <li key={posts[i].cmsId}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Open ${posts[i].title}`}
                      className="relative block aspect-square w-full cursor-pointer overflow-hidden rounded-[6px] bg-[#111418] transition-opacity hover:opacity-80"
                    >
                      <Image src={posts[i].thumbnail.src} alt="" fill sizes="120px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {count > 1 && (
            <div className="mt-10 flex items-center justify-between lg:mt-auto lg:pt-10">
              <button type="button" aria-label="Previous post" onClick={() => go(index - 1)} className={`${round} bg-[#2a3038] hover:bg-[#3a414b]`}>
                <Chevron dir="left" />
              </button>
              <p className="font-lexend-deca text-[14px] font-medium text-[#bdc3cc]">
                {pad(index + 1)} / {pad(count)}
              </p>
              <button type="button" aria-label="Next post" onClick={() => go(index + 1)} className={`${round} bg-[#e60012] hover:bg-[#c3151c]`}>
                <Chevron dir="right" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
