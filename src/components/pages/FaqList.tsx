"use client";

import Image from "next/image";
import { useState } from "react";
import Collapse from "@/components/ui/Collapse";

type Faq = { q: string; a: string[] };

/** Figma FAQ accordion – 720px cards, one open at a time (the second starts open, as designed). */
export default function FaqList({ faqs, defaultOpen = 1 }: { faqs: Faq[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <ul className="flex w-full flex-col gap-4 lg:w-[720px] lg:gap-6">
      {/* API: dynamic data – FAQs */}
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q} className="rounded-[10px] bg-[#f6f6f6] shadow-[inset_0_0_0_1px_#1a1a1a]">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex min-h-[72px] w-full cursor-pointer items-center justify-between gap-3 px-5 py-5 text-left lg:min-h-[92.8px] lg:gap-2 lg:px-8 lg:py-8"
            >
              <span className="font-lexend-deca text-[16px] leading-[1.5] tracking-[-0.26px] text-black lg:w-[624px] lg:text-[16.5px] lg:leading-[28.8px]">
                {f.q}
              </span>
              <Image
                src={isOpen ? "/icons/pages/faq-open.svg" : "/icons/pages/faq-closed.svg"}
                alt=""
                width={24}
                height={24}
                className="shrink-0"
              />
            </button>
            <Collapse open={isOpen} id={`faq-${i}`} className={isOpen ? "-mt-3 lg:-mt-6" : ""}>
              <div className="px-5 pb-5 lg:px-8 lg:pb-8">
                {f.a.map((line) => (
                  <p key={line} className="font-lexend-deca text-[15px] font-light leading-7 tracking-[-0.18px] text-[#626466] lg:text-[16px] lg:leading-8">
                    {line}
                  </p>
                ))}
              </div>
            </Collapse>
          </li>
        );
      })}
    </ul>
  );
}
