"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const AUTOPLAY_MS = 5000;

type GamingHeroProps = {
  title: [string, string];
  description: string;
  images: string[];
};

/**
 * Figma "Hero Section 2" (Gaming Landing page) – blurred set-up backdrop,
 * "Gaming Produce" display title and slide dots. 688px tall below the header.
 */
export default function GamingHero({ title, description, images }: GamingHeroProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Gaming products"
      className="bg-silver relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrop: height-fitted, left-aligned, 4.5px blur (Figma "image 68") */}
      {images.map((src, i) => (
        <div
          key={i}
          aria-hidden
          className={`absolute inset-0 blur-[4.5px] transition-opacity duration-700 motion-reduce:transition-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            preload={i === 0}
            className="object-cover object-left"
          />
        </div>
      ))}

      <div className="page-frame relative h-[688px] text-white">
        <h1 className="absolute left-1/2 top-[228px] -translate-x-1/2 font-audiowide text-[112px] leading-[1.2] whitespace-nowrap">
          {title[0]} <span className="text-dragon">{title[1]}</span>
        </h1>
        <p className="absolute left-[705px] top-[370px] w-[766px] -translate-x-1/2 text-center font-lexend-deca text-[20px] font-medium leading-[1.5]">
          {description}
        </p>

        {count > 1 && (
          <div className="absolute left-1/2 top-[646px] flex -translate-x-1/2 gap-4">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`size-3 cursor-pointer rounded-full transition-colors ${
                  i === index ? "bg-white" : "border border-white/80 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
