"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import FaqList from "@/components/pages/FaqList";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { contactHref, type Faq } from "@/data/pages";

// API: dynamic data – FAQ topics
const TOPICS = [
  { value: "all", label: "All" },
  { value: "firmware", label: "Firmware" },
  { value: "setup", label: "Setup" },
  { value: "compatibility", label: "Compatibility" },
  { value: "warranty", label: "Warranty" },
];

/** Support page FAQ block (Figma "Frame 167"): search, topic filter and accordion. */
// API: dynamic data – FAQs (CMS FAQs, via props). CMS FAQs have no topic yet, so they only show under "All".
export default function SupportFaqs({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");
  const [topic, setTopic] = useState("all");

  const term = applied.trim().toLowerCase();
  // API: dynamic data – FAQs, filtered by topic and search term
  const results = faqs.filter(
    (f) =>
      (topic === "all" || f.topic === topic) &&
      (!term || `${f.q} ${f.a.join(" ")}`.toLowerCase().includes(term)),
  );
  const filtered = topic !== "all" || term !== "";

  return (
    <section className="bg-white">
      <div className="page-frame flex flex-col items-center px-6 pt-12 pb-12 lg:px-0 lg:pt-20 lg:pb-[41px]">
        <h2 className="font-lexend-giga text-[32px] leading-none font-bold tracking-[-2.56px] text-dragon/80 lg:text-[40px] lg:tracking-[-3.2px]">
          FAQ&rsquo;s
        </h2>
        <p className="mt-2 text-center font-lexend-exa text-[18px] leading-[1.2] font-semibold text-ink lg:mt-[-2px] lg:text-[22px]">
          Frequently asked questions
        </p>
        <p className="mt-3 w-full text-center font-lexend-deca text-[16px] leading-[1.4] font-light tracking-[0.48px] text-ink/60 lg:mt-[19px] lg:w-[720px] lg:text-[20px] lg:tracking-[0.6px]">
          Find answers to common questions about Red Dragon products, software, setup, and more.
        </p>

        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            setApplied(query);
          }}
          className="mt-6 flex w-full flex-col gap-3 sm:flex-row lg:mt-8 lg:w-[720px] lg:gap-6"
        >
          <label className="flex h-[50px] min-w-0 items-center gap-3 rounded-[4px] border border-ink px-4 sm:flex-1 lg:h-[54px] lg:px-5">
            <span className="sr-only">Search FAQ</span>
            <Image src="/icons/pages/search.svg" alt="" width={20} height={20} className="shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQ"
              className="w-full bg-transparent font-lexend-deca text-[16px] leading-none font-light text-ink outline-none placeholder:text-ink/80 lg:text-[20px]"
            />
          </label>
          <button
            type="submit"
            className="h-[50px] w-full shrink-0 cursor-pointer rounded-[4px] bg-crimson font-lexend-deca text-[16px] font-semibold tracking-[1px] text-white uppercase transition-colors hover:bg-[#bc1018] sm:w-[147px] lg:h-[54px] lg:text-[20px]"
          >
            Search
          </button>
        </form>

        <div className="mt-4 w-full overflow-x-auto lg:w-[720px] lg:overflow-visible">
          <SegmentedControl
            pill
            label="FAQ topic"
            options={TOPICS}
            value={topic}
            onChange={setTopic}
            className="w-[600px] sm:w-full"
          />
        </div>

        <div className="mt-6 w-full lg:mt-8 lg:w-[720px]">
          {results.length > 0 ? (
            // Remount on filter change so the open item always belongs to the current list
            <FaqList key={`${topic}|${term}`} faqs={results} defaultOpen={filtered ? 0 : 1} />
          ) : (
            <p className="py-10 text-center font-lexend-deca text-[16px] text-[#666666]">No FAQs found.</p>
          )}
        </div>

        <p className="mt-6 font-lexend-deca text-[16px] leading-5 text-ink">
          Still need help?{" "}
          <Link href={contactHref("Product support")} className="font-medium text-crimson underline">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
}
