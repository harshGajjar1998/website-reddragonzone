"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryImage } from "@/data/gaming";

/**
 * Full-screen product photo viewer: every gallery image on a product tile, swipe or scroll
 * left/right (snap), arrow buttons, keyboard ← → and Esc, and a counter.
 */
export default function ProductLightbox({
  images,
  start,
  title,
  onClose,
}: {
  images: GalleryImage[];
  start: number;
  title: string;
  onClose: () => void;
}) {
  const track = useRef<HTMLUListElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(start);
  const count = images.length;

  const go = (i: number, smooth = true) => {
    const el = track.current;
    if (!el) return;
    const next = Math.min(Math.max(i, 0), count - 1);
    el.scrollTo({ left: next * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  // Open on the clicked image, lock page scroll, focus the dialog, restore focus on close
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    go(start, false);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const arrow =
    "absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-card-hover transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:flex";

  // Portal: escape the page section's stacking context and clipping
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="fixed inset-0 z-[100] flex flex-col bg-[#0f1115]/90 backdrop-blur-sm animate-[fade-in_200ms_ease-out]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-8 sm:py-5">
        <p aria-live="polite" className="font-lexend-deca text-[14px] tracking-[0.06em]">
          {index + 1} / {count}
        </p>
        <button
          ref={closeBtn}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <ul
          ref={track}
          className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== index) setIndex(Math.min(Math.max(i, 0), count - 1));
          }}
        >
          {images.map((image, i) => (
            <li key={image.src + i} className="flex h-full w-full shrink-0 snap-center items-center justify-center px-4 pb-6 sm:px-24">
              <div
                className={`relative aspect-square max-h-full w-full max-w-[min(100%,calc(100vh-140px))] overflow-hidden ${image.bg ? "" : "bg-product-tile"}`}
                style={image.bg ? { background: image.bg } : undefined}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 90vh"
                  preload={i === start}
                  className={image.bg ? "object-cover" : "object-scale-down p-[6%] drop-product"}
                />
              </div>
            </li>
          ))}
        </ul>

        {count > 1 && (
          <>
            <button type="button" aria-label="Previous photo" disabled={index === 0} onClick={() => go(index - 1)} className={`${arrow} left-6`}>
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button type="button" aria-label="Next photo" disabled={index === count - 1} onClick={() => go(index + 1)} className={`${arrow} right-6`}>
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 pb-5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Photo ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className={`size-2.5 cursor-pointer rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/35 hover:bg-white/60"}`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
