"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

/** About page "newsletter-section" – dark boxed sign-up with red outline (1440×385 on #0f1115). */
export default function EliteClubNewsletter() {
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: connect to the newsletter / CRM endpoint
    setDone(true);
  }

  return (
    <section className="bg-[#0f1115]">
      <div className="page-frame px-[120px] py-16">
        <div className="relative isolate flex h-[257px] flex-col items-center gap-6 overflow-hidden rounded-2xl p-12 shadow-[inset_0_0_0_1px_#e01a22]">
          <Image src="/images/pages/about/newsletter.jpg" alt="" fill sizes="1200px" className="-z-10 object-cover" />
          <div className="absolute inset-0 -z-10 bg-[#1a1a1a]/95" />

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-lexend-giga text-[12px] font-bold uppercase tracking-[2px] text-crimson">
              REDRAGON ELITE CLUB
            </p>
            <h2 className="font-lexend-exa text-[32px] font-extrabold text-white">Join the Red Dragonezone</h2>
            <p className="font-lexend-deca text-[14px] text-[#9ba3af]">
              Sign up to receive technical updates, exclusive custom keycap drops, and early access sales.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-3">
            <label htmlFor="elite-email" className="sr-only">
              Email address
            </label>
            <input
              id="elite-email"
              type="email"
              required
              placeholder="Enter your hardware email address..."
              className="h-12 w-[346px] rounded-[4px] border border-[#3b424f] bg-[#0f1115] px-4 font-lexend-deca text-[14px] text-white outline-none placeholder:text-[#9ba3af] focus:border-crimson"
            />
            <button
              type="submit"
              className="flex h-[46px] w-[142px] cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-crimson font-lexend-deca text-[14px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c]"
            >
              {done ? "Thanks" : "Sign Up"}
              {!done && <Image src="/icons/pages/signup-chevron.svg" alt="" width={18} height={16} className="h-3.5 w-auto" />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
