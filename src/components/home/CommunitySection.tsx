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
    <section className="bg-[linear-gradient(90deg,#727071_0%,#454344_100%)]">
      <div className="page-frame flex h-[364px] items-center gap-12 px-[120px] pb-[60px] pt-[63px]">
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
