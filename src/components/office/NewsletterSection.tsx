"use client";

import Image from "next/image";
import Honeypot from "@/components/ui/Honeypot";
import { Button } from "@/components/ui/Button";
import FormFeedback from "@/components/ui/FormFeedback";
import { useNewsletterForm } from "@/lib/forms";

type NewsletterSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  images: { src: string; alt: string }[];
};

// API: dynamic data – newsletter block content (via props)
/** Office "Section 9" (top half) – newsletter sign-up on #bebebe (375px). */
export default function NewsletterSection({ eyebrow, title, description, images }: NewsletterSectionProps) {
  const { feedback, sending, onSubmit, onChange, invalid } = useNewsletterForm();

  const signUp = (
    <Button
      type="submit"
      chevron
      disabled={sending}
      className="h-12 w-[118px] shrink-0 font-outfit text-[12px] font-bold leading-normal tracking-[1px]"
    >
      Sign Up
    </Button>
  );

  return (
    <section className="bg-[#bebebe]">
      {/* Mobile – Figma "Office Produce" screen 6 (394×800) */}
      <div className="mobile-frame px-4 pt-14 pb-10 lg:hidden">
        <p className="font-lexend-giga text-[24px] font-semibold leading-[1.2] text-dragon">{eyebrow}</p>
        <h2 className="mt-3 font-lexend-exa text-[32px] font-medium leading-[1.2] text-ink">{title}</h2>
        <p className="mt-6 font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-ink/70">
          {description}
        </p>
        <form noValidate onSubmit={onSubmit} onChange={onChange} className="mt-6 flex gap-3">
          <Honeypot />
          <label htmlFor="office-newsletter-email-mobile" className="sr-only">
            Email address
          </label>
          <input
            id="office-newsletter-email-mobile"
            name="email"
            type="email"
            required
            aria-invalid={invalid || undefined}
            placeholder="Enter your email address..."
            className={`h-12 min-w-0 flex-1 rounded-[4px] border bg-transparent px-4 font-lexend-deca text-[16px] font-light tracking-[0.36px] text-ink outline-none placeholder:text-[12px] placeholder:text-white focus:border-dragon ${invalid ? "border-[#d32632]" : "border-black"}`}
          />
          {signUp}
        </form>
        {feedback && <FormFeedback feedback={feedback} compact className="mt-3" />}
        <ul className="mt-6 grid grid-cols-3 gap-4">
          <li className="relative col-span-3 h-[192px] overflow-hidden rounded-[6px]">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
          </li>
          {images.map((img) => (
            <li key={img.src} className="relative h-[157px] overflow-hidden rounded-[6px]">
              <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 33vw, 210px" className="object-cover" />
            </li>
          ))}
        </ul>
      </div>

      <div className="page-frame hidden h-[375px] items-center gap-12 px-[120px] lg:flex">
        <div className="flex w-[420px] shrink-0 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="font-lexend-giga text-[24px] font-semibold leading-[1.2] text-dragon">{eyebrow}</p>
            <h2 className="font-lexend-exa text-[32px] font-medium leading-[1.2] text-ink">{title}</h2>
          </div>
          <p className="font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-ink/70">
            {description}
          </p>
          <form noValidate onSubmit={onSubmit} onChange={onChange} className="relative flex items-start gap-4">
            <Honeypot />
            <label htmlFor="office-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="office-newsletter-email"
              name="email"
              type="email"
              required
              aria-invalid={invalid || undefined}
              placeholder="Enter your email address..."
              className={`h-12 w-[271px] rounded-[4px] border bg-transparent px-4 font-lexend-deca text-[16px] font-light tracking-[0.48px] text-ink outline-none placeholder:text-ink focus:border-dragon ${invalid ? "border-[#d32632]" : "border-black"}`}
            />
            <Button
              type="submit"
              chevron
              disabled={sending}
              className="px-7 py-[14px] font-outfit text-[14px] font-bold leading-normal tracking-[1px]"
            >
              Sign Up
            </Button>
            {/* Absolute so a message doesn't change the fixed section height */}
            {feedback && <FormFeedback feedback={feedback} compact className="absolute top-full right-0 left-0 mt-2" />}
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
