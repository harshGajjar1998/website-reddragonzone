"use client";

import Image from "next/image";
import Honeypot from "@/components/ui/Honeypot";
import FormFeedback from "@/components/ui/FormFeedback";
import { useNewsletterForm } from "@/lib/forms";

/** About page "newsletter-section" – dark boxed sign-up with red outline (1440×385 on #0f1115). */
export default function EliteClubNewsletter() {
  const { feedback, sending, onSubmit, onChange, invalid } = useNewsletterForm();

  return (
    <section className="bg-[#0f1115]">
      <div className="page-frame px-4 py-14 lg:px-[120px] lg:py-16">
        <div className="relative isolate flex flex-col items-center gap-6 overflow-hidden rounded-2xl px-5 py-10 shadow-[inset_0_0_0_1px_#e01a22] lg:h-[257px] lg:p-12">
          <Image src="/images/pages/about/newsletter.jpg" alt="" fill sizes="1200px" className="-z-10 object-cover" />
          <div className="absolute inset-0 -z-10 bg-[#1a1a1a]/95" />

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-lexend-giga text-[12px] font-bold uppercase tracking-[2px] text-crimson">
              REDRAGON ELITE CLUB
            </p>
            <h2 className="font-lexend-exa text-[24px] font-extrabold text-white lg:text-[32px]">Join the Red Dragonezone</h2>
            <p className="font-lexend-deca text-[14px] text-[#9ba3af]">
              Sign up to receive technical updates, exclusive custom keycap drops, and early access sales.
            </p>
          </div>

          <form noValidate onSubmit={onSubmit} onChange={onChange} className="relative flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap">
            <Honeypot />
            <label htmlFor="elite-email" className="sr-only">
              Email address
            </label>
            <input
              id="elite-email"
              name="email"
              type="email"
              required
              aria-invalid={invalid || undefined}
              placeholder="Enter your hardware email address..."
              className={`h-12 w-full rounded-[4px] border bg-[#0f1115] px-4 font-lexend-deca text-[16px] text-white outline-none placeholder:text-[14px] placeholder:text-[#9ba3af] focus:border-crimson sm:w-[346px] sm:text-[14px] ${invalid ? "border-[#d32632]" : "border-[#3b424f]"}`}
            />
            <button
              type="submit"
              disabled={sending}
              className="flex h-[46px] w-full cursor-pointer items-center justify-center sm:w-[142px] gap-2 rounded-[4px] bg-crimson font-lexend-deca text-[14px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c] disabled:cursor-wait disabled:opacity-70"
            >
              Sign Up
              <Image src="/icons/pages/signup-chevron.svg" alt="" width={18} height={16} className="h-3.5 w-auto" />
            </button>
            {/* Absolute on desktop so a message doesn't change the fixed card height */}
            {feedback && <FormFeedback feedback={feedback} compact className="w-full lg:absolute lg:top-full lg:right-0 lg:left-0 lg:mt-1" />}
          </form>
        </div>
      </div>
    </section>
  );
}
