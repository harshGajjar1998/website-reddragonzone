"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { enquiryTypes } from "@/data/pages";

const label = "font-lexend-deca text-[14px] font-medium leading-[1.6] text-ink";
const input =
  "h-10 w-full rounded-[4px] border border-ink px-3 font-lexend-deca text-[16px] font-light leading-none lg:text-[14px] text-ink outline-none placeholder:text-[#626466] focus:border-crimson";

function Field({ id, title, required, ...props }: { id: string; title: string; required?: boolean } & React.ComponentProps<"input">) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={label}>
        {title}
        {required && " *"}
      </label>
      <input id={id} name={id} required={required} className={input} {...props} />
    </div>
  );
}

/** Figma "Contact Us" card (632×509, white, r16) */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: post to the contact / CRM endpoint
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <div className="mt-8 rounded-2xl bg-white px-5 pt-6 pb-6 lg:absolute lg:left-[728px] lg:top-[214px] lg:mt-0 lg:h-[509px] lg:w-[632px] lg:px-[31px] lg:pt-8 lg:pb-0">
      <h2 className="font-lexend-exa text-[32px] leading-[1.1] tracking-[-2.4px] text-black lg:text-[48px] lg:tracking-[-3.84px]">Contact Us</h2>
      <p className="mt-3 font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-[#626466] lg:mt-5 lg:text-[20px] lg:tracking-[0.6px]">
        {sent ? "Thanks! We'll get back to you shortly." : "Looking forward to your feedback"}
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex w-full flex-col lg:w-[569px]">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-[276px_276px] lg:gap-y-5">
          <Field id="name" title="Name" required placeholder="Enter your name" autoComplete="name" />
          <Field id="phone" title="Phone Number" type="tel" placeholder="Enter your phone number" autoComplete="tel" />
          <Field id="country" title="Country" required placeholder="Enter your Country" autoComplete="country-name" />
          <Field id="email" title="Email" type="email" required placeholder="Enter your email" autoComplete="email" />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <label htmlFor="enquiry" className={label}>
            what&apos;s your enquiry *
          </label>
          <div className="relative">
            <select
              id="enquiry"
              name="enquiry"
              required
              defaultValue=""
              className={`${input} h-[46px] cursor-pointer appearance-none invalid:text-[#626466]`}
            >
              <option value="" disabled>
                Select
              </option>
              {enquiryTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <Image
              src="/icons/pages/select-arrow.svg"
              alt=""
              width={20}
              height={20}
              className="pointer-events-none absolute right-3 top-[13px]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 h-12 cursor-pointer rounded-[4px] bg-crimson font-lexend-deca text-[16px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c]"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
