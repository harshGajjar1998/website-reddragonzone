"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

/**
 * "Stay in the Game!" newsletter card (Figma "Newslette section", 1312×286).
 * The faint grid overlay sits on top of the copy, fading its right edge as in the design.
 */
export default function NewsletterCard() {
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: connect to the newsletter / CRM endpoint
    setDone(true);
  }

  return (
    <section className="page-frame px-5 pb-10 lg:px-16">
      <div className="relative flex flex-col items-start gap-6 overflow-hidden rounded-[6px] bg-white p-6 lg:h-[286px] lg:flex-row lg:items-center lg:gap-20 lg:p-20 shadow-[inset_0_0_0_1px_rgb(17_17_17/0.05)]">
        <div className="flex w-full flex-col gap-3 lg:w-[614px] lg:shrink-0 lg:gap-6">
          <h2 className="font-lexend-deca text-[28px] leading-[1.2] text-[#111] lg:text-[40px]">Stay in the Game!</h2>
          <p className="font-lexend text-[16px] leading-[1.5] text-[#111] lg:text-[18px]">
            Subscribe to the Redragon Zone newsletter for exclusive offers and updates.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex w-full flex-col gap-4 lg:w-[458px]">
          <label htmlFor="blog-newsletter-email" className="font-lexend text-[16px] leading-[1.5] text-[#111]">
            Join our newsletter ↓
          </label>
          {/* Mobile stacks a full-width field over a full-width button (Figma "Blog home — Mobile") */}
          <div className="flex flex-col gap-2.5 lg:h-10 lg:flex-row lg:gap-0 lg:bg-[#f5f8fb]">
            <input
              id="blog-newsletter-email"
              type="email"
              required
              placeholder="Enter your email address"
              className="h-[49px] min-w-0 flex-1 bg-[#f5f8fb] px-3 py-2 lg:h-10 lg:w-[333px] lg:flex-none font-lexend text-[16px] leading-[1.5] text-[#111] outline outline-1 outline-[#111]/10 placeholder:text-[#111]/40 focus:outline-dragon"
            />
            <button
              type="submit"
              className="h-[49px] w-full shrink-0 cursor-pointer bg-[#e60012] lg:h-10 lg:w-[125px] px-6 py-2 font-lexend text-[16px] leading-[1.5] text-white outline outline-1 outline-[#e60012] transition-colors hover:bg-[#c3000f]"
            >
              {done ? "Thanks!" : "Subscribe"}
            </button>
          </div>
        </form>

        <Image
          src="/images/pages/blog/newsletter-grid.png"
          alt=""
          width={1147}
          height={428}
          className="pointer-events-none absolute left-0 top-0 hidden h-[285px] w-[764.24px] max-w-none lg:block"
        />
      </div>
    </section>
  );
}
