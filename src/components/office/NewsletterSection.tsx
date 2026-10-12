"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

type NewsletterSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  images: { src: string; alt: string }[];
};

/** Office "Section 9" (top half) – newsletter sign-up on #bebebe (375px). */
export default function NewsletterSection({ eyebrow, title, description, images }: NewsletterSectionProps) {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: connect to the newsletter / CRM endpoint
    setSubmitted(true);
  }

  return (
    <section className="bg-[#bebebe]">
      <div className="page-frame flex h-[375px] items-center gap-12 px-[120px]">
        <div className="flex w-[420px] shrink-0 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="font-lexend-giga text-[24px] font-semibold leading-[1.2] text-dragon">{eyebrow}</p>
            <h2 className="font-lexend-exa text-[32px] font-medium leading-[1.2] text-ink">{title}</h2>
          </div>
          <p className="font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-ink/70">
            {description}
          </p>
          <form onSubmit={onSubmit} className="flex items-start gap-4">
            <label htmlFor="office-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="office-newsletter-email"
              type="email"
              required
              placeholder="Enter your email address..."
              className="h-12 w-[271px] rounded-[4px] border border-black bg-transparent px-4 font-lexend-deca text-[16px] font-light tracking-[0.48px] text-ink outline-none placeholder:text-ink focus:border-dragon"
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
          {images.map((img) => (
            <li key={img.src} className="relative h-[236px] w-[233.33px] overflow-hidden rounded-[6px]">
              <Image src={img.src} alt={img.alt} fill sizes="234px" className="object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
