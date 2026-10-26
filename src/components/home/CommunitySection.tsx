"use client";

import Image from "next/image";
import { useFormSubmit } from "@/lib/forms";
import Honeypot from "@/components/ui/Honeypot";
import { Button } from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { useChrome } from "@/components/layout/ChromeProvider";
import type { Community } from "@/data/home";

/** Figma "Section 6" (top half) – Esports community newsletter sign-up. */
// API: dynamic data – copy and photos (CMS homepage "Email signup" section, shown on most pages)
export default function CommunitySection({ community }: { community?: Community }) {
  const chrome = useChrome();
  const { onSubmit, done: submitted } = useFormSubmit("newsletter");
  // A homepage section passes its own content; other pages show the homepage's first one.
  const c = community ?? chrome.community;
  if (!c) return null;

  return (
    <section className="bg-[linear-gradient(180deg,#727071_0%,#454344_100%)] lg:bg-[linear-gradient(90deg,#727071_0%,#454344_100%)]">
      {/* Mobile – Figma "iPhone 13 & 14 - 6" (390×800) */}
      <div className="mobile-frame px-4 pt-14 pb-10 lg:hidden">
        <p className="font-lexend-giga text-[24px] font-semibold leading-[1.2] text-dragon">{c.eyebrow}</p>
        <h2 className="mt-3 font-lexend-exa text-[32px] font-medium leading-[1.2] text-white">{c.title}</h2>
        <p className="mt-6 font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-white/80">
          {c.body}
        </p>
        <form onSubmit={onSubmit} className="mt-6 flex gap-3">
          <Honeypot />
          <label htmlFor="community-email-mobile" className="sr-only">
            Email address
          </label>
          <input
            id="community-email-mobile"
            type="email"
            name="email"
            required
            placeholder="Enter your email address..."
            className="h-12 min-w-0 flex-1 rounded-[4px] border border-black bg-transparent px-4 font-lexend-deca text-[16px] font-light tracking-[0.36px] text-white outline-none placeholder:text-[12px] placeholder:text-white focus:border-white"
          />
          <Button
            type="submit"
            chevron
            className="h-12 w-[118px] shrink-0 font-outfit text-[12px] font-bold leading-normal tracking-[1px]"
          >
            {submitted ? "Thanks" : c.button}
          </Button>
        </form>
        {/* API: dynamic data – community images (mobile) */}
        <ul className="mt-6 grid grid-cols-3 gap-4">
          {c.mobileImages[0] && (
            <li className="relative col-span-3 h-[181.5px] overflow-hidden rounded-[6px]">
              <Image
                src={c.mobileImages[0].src}
                alt={c.mobileImages[0].alt}
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
              />
            </li>
          )}
          {c.mobileImages.map((img, i) => (
            <li key={i + 1} className="relative h-[181.5px] overflow-hidden rounded-[6px]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 33vw, 210px"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="page-frame hidden h-[364px] items-center gap-12 px-[120px] pb-[60px] pt-[63px] lg:flex">
        <div className="flex w-[420px] shrink-0 flex-col gap-6">
          <SectionHeading eyebrow={c.eyebrow} title={c.title} className="gap-3" />
          <p className="font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-white/70">
            {c.body}
          </p>
          <form onSubmit={onSubmit} className="flex items-start gap-4">
            <Honeypot />
            <label htmlFor="community-email" className="sr-only">
              Email address
            </label>
            <input
              id="community-email"
              type="email"
              name="email"
              required
              placeholder="Enter your email address..."
              className="h-12 w-[271px] rounded-[4px] border border-black bg-transparent px-4 font-lexend-deca text-[16px] font-light tracking-[0.48px] text-white outline-none placeholder:text-white focus:border-white"
            />
            <Button
              type="submit"
              chevron
              className="px-7 py-[14px] font-outfit text-[14px] font-bold leading-normal tracking-[1px]"
            >
              {submitted ? "Thanks" : c.button}
            </Button>
          </form>
        </div>

        <ul className="flex gap-4">
          {/* API: dynamic data – community images */}
          {c.images.map((img) => (
            <li key={img.src} className="relative h-[236px] w-[233.33px] overflow-hidden rounded-[6px]">
              <Image src={img.src} alt={img.alt} fill sizes="234px" className="object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
