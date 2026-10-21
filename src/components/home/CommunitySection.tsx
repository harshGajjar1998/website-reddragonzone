"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { communityImages } from "@/data/home";

/** Figma "Section 6" (top half) – Esports community newsletter sign-up. */
export default function CommunitySection() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: connect to the newsletter / CRM endpoint
    setSubmitted(true);
  }

  return (
    <section className="bg-[linear-gradient(180deg,#727071_0%,#454344_100%)] lg:bg-[linear-gradient(90deg,#727071_0%,#454344_100%)]">
      {/* Mobile – Figma "iPhone 13 & 14 - 6" (390×800) */}
      <div className="mobile-frame px-4 pt-14 pb-10 lg:hidden">
        <p className="font-lexend-giga text-[24px] font-semibold leading-[1.2] text-dragon">Press Contact</p>
        <h2 className="mt-3 font-lexend-exa text-[32px] font-medium leading-[1.2] text-white">Esports Community</h2>
        <p className="mt-6 font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-white/80">
          The best players in the world choose Redragon because every millisecond determines victory. Join the
          vanguard division.
        </p>
        <form onSubmit={onSubmit} className="mt-6 flex gap-3">
          <label htmlFor="community-email-mobile" className="sr-only">
            Email address
          </label>
          <input
            id="community-email-mobile"
            type="email"
            required
            placeholder="Enter your email address..."
            className="h-12 min-w-0 flex-1 rounded-[4px] border border-black bg-transparent px-4 font-lexend-deca text-[16px] font-light tracking-[0.36px] text-white outline-none placeholder:text-[12px] placeholder:text-white focus:border-white"
          />
          <Button
            type="submit"
            chevron
            className="h-12 w-[118px] shrink-0 font-outfit text-[12px] font-bold leading-normal tracking-[1px]"
          >
            {submitted ? "Thanks" : "Sign Up"}
          </Button>
        </form>
        {/* API: dynamic data – community images (mobile) */}
        <ul className="mt-6 grid grid-cols-3 gap-4">
          <li className="relative col-span-3 h-[181.5px] overflow-hidden rounded-[6px]">
            <Image
              src="/images/home/mobile/community-1.jpg"
              alt={communityImages[0].alt}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
          </li>
          {[1, 2, 3].map((n, i) => (
            <li key={n} className="relative h-[181.5px] overflow-hidden rounded-[6px]">
              <Image
                src={`/images/home/mobile/community-${n}.jpg`}
                alt={communityImages[i].alt}
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
          <SectionHeading eyebrow="Press Contact" title="Esports Community" className="gap-3" />
          <p className="font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-white/70">
            The best players in the world choose Redragon because every millisecond determines
            victory. Join the vanguard division.
          </p>
          <form onSubmit={onSubmit} className="flex items-start gap-4">
            <label htmlFor="community-email" className="sr-only">
              Email address
            </label>
            <input
              id="community-email"
              type="email"
              required
              placeholder="Enter your email address..."
              className="h-12 w-[271px] rounded-[4px] border border-black bg-transparent px-4 font-lexend-deca text-[16px] font-light tracking-[0.48px] text-white outline-none placeholder:text-white focus:border-white"
            />
            <Button
              type="submit"
              chevron
              className="px-7 py-[14px] font-outfit text-[14px] font-bold leading-normal tracking-[1px]"
            >
              {submitted ? "Thanks" : "Sign Up"}
            </Button>
          </form>
        </div>

        <ul className="flex gap-4">
          {/* API: dynamic data – community images */}
          {communityImages.map((img) => (
            <li key={img.src} className="relative h-[236px] w-[233.33px] overflow-hidden rounded-[6px]">
              <Image src={img.src} alt={img.alt} fill sizes="234px" className="object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
