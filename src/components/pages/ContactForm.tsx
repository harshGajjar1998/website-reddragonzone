"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import FormFeedback from "@/components/ui/FormFeedback";
import { enquiryFromSlug, enquiryTypes, type EnquiryType } from "@/data/pages";
import {
  FORM_ERROR,
  FORM_SUCCESS,
  INVALID_EMAIL,
  isEmail,
  requiredMessage,
  submitForm,
  type Feedback,
} from "@/lib/forms";

const label = "font-lexend-deca text-[14px] font-medium leading-[22px] text-ink";
const input =
  "w-full rounded-[4px] border px-3 font-lexend-deca text-[16px] font-light lg:text-[14px] text-ink outline-none placeholder:text-[#626466]";
const border = (invalid: boolean) => (invalid ? "border-[#d32632]" : "border-ink focus:border-crimson");

/** Required fields in page order, with the word used in the "please fill this in" message */
const REQUIRED = [
  { name: "name", word: "name" },
  { name: "country", word: "country" },
  { name: "email", word: "email" },
  { name: "enquiry", word: "enquiry" },
  { name: "message", word: "message" },
];

function Field({
  id,
  title,
  required,
  invalid = false,
  ...props
}: { id: string; title: string; required?: boolean; invalid?: boolean } & React.ComponentProps<"input">) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={label}>
        {title}
        {required && " *"}
      </label>
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={invalid || undefined}
        className={`${input} h-10 leading-none ${border(invalid)}`}
        {...props}
      />
    </div>
  );
}

/** Figma "Contact Us" card (632×740 with the feedback banner, white, r16) */
export default function ContactForm({ enquiry }: { enquiry?: EnquiryType }) {
  const [invalid, setInvalid] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const missing = REQUIRED.filter(({ name }) => !values[name]?.trim());
    const badEmail = !!values.email?.trim() && !isEmail(values.email.trim());
    if (missing.length > 0 || badEmail) {
      const names = missing.map((field) => field.name);
      if (badEmail) names.push("email");
      setInvalid(names);
      setFeedback({ tone: "error", text: missing[0] ? requiredMessage(missing[0].word) : INVALID_EMAIL });
      form.querySelector<HTMLElement>(`[name="${missing[0]?.name ?? "email"}"]`)?.focus();
      return;
    }

    setInvalid([]);
    setSending(true);
    try {
      // API: dynamic data – contact form submission
      await submitForm("contact", values);
      setFeedback({ tone: "success", text: FORM_SUCCESS });
      form.reset();
    } catch {
      setFeedback({ tone: "error", text: FORM_ERROR });
    } finally {
      setSending(false);
    }
  }

  /** The red state clears field by field, and the banner moves on to the next problem */
  function onChange(e: FormEvent<HTMLFormElement>) {
    const { name } = e.target as HTMLInputElement;
    const remaining = invalid.filter((field) => field !== name);
    setInvalid(remaining);
    const next = REQUIRED.find((field) => remaining.includes(field.name));
    if (!next) return setFeedback(null);
    const filled = !!new FormData(e.currentTarget).get(next.name);
    setFeedback({ tone: "error", text: filled ? INVALID_EMAIL : requiredMessage(next.word) });
  }

  const bad = (name: string) => invalid.includes(name);

  return (
    <div className="mt-8 rounded-2xl bg-white px-5 pt-6 pb-6 lg:absolute lg:left-[728px] lg:top-[214px] lg:mt-0 lg:w-[632px] lg:px-[31px] lg:pt-8 lg:pb-8">
      <h2 className="font-lexend-exa text-[32px] leading-[1.1] tracking-[-2.4px] text-black lg:text-[48px] lg:tracking-[-3.84px]">Contact Us</h2>
      <p className="mt-3 font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-[#626466] lg:mt-5 lg:text-[20px] lg:tracking-[0.6px]">
        Looking forward to your feedback
      </p>

      <form noValidate onSubmit={onSubmit} onChange={onChange} className="mt-5 flex w-full flex-col lg:w-[569px]">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-[276px_276px] lg:gap-y-5">
          <Field id="name" title="Name" required invalid={bad("name")} placeholder="Enter your name" autoComplete="name" />
          <Field id="phone" title="Phone Number" type="tel" placeholder="Enter your phone number" autoComplete="tel" />
          <Field id="country" title="Country" required invalid={bad("country")} placeholder="Enter your Country" autoComplete="country-name" />
          <Field id="email" title="Email" type="email" required invalid={bad("email")} placeholder="Enter your email" autoComplete="email" />
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
              defaultValue={enquiry ?? ""}
              aria-invalid={bad("enquiry") || undefined}
              className={`${input} ${border(bad("enquiry"))} h-[46px] cursor-pointer appearance-none leading-none invalid:text-[#626466]`}
            >
              <option value="" disabled>
                Select
              </option>
              {/* API: dynamic data – enquiry types */}
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

        <div className="mt-3 flex flex-col gap-2">
          <label htmlFor="message" className="font-lexend-deca text-[14px] leading-[22px] text-ink">
            Your message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            aria-invalid={bad("message") || undefined}
            placeholder="Tell us how we can help…"
            className={`${input} ${border(bad("message"))} h-[104px] resize-none py-4 leading-[1.4]`}
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="mt-6 h-12 cursor-pointer rounded-[4px] bg-crimson font-lexend-deca text-[16px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c] disabled:cursor-wait disabled:opacity-70"
        >
          Submit
        </button>

        {feedback && <FormFeedback feedback={feedback} className="mt-6" />}
      </form>
    </div>
  );
}

/** Pre-selects the enquiry from the link the visitor followed. The key resets the form when that changes. */
export function ContactFormFromUrl() {
  const enquiry = enquiryFromSlug(useSearchParams().get("enquiry"));
  return <ContactForm key={enquiry ?? "none"} enquiry={enquiry} />;
}
