"use client";

import Image from "next/image";
import { useState } from "react";

type Faq = { q: string; a: string[] };

/** Figma FAQ accordion – 720px cards, one open at a time (the second starts open, as designed). */
export default function FaqList({ faqs, defaultOpen = 1 }: { faqs: Faq[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <ul className="flex w-[720px] flex-col gap-6">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q} className="rounded-[10px] bg-[#f6f6f6] shadow-[inset_0_0_0_1px_#1a1a1a]">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex min-h-[92.8px] w-full cursor-pointer items-center justify-between gap-2 px-8 py-8 text-left"
            >
              <span className="w-[624px] font-lexend-deca text-[16.5px] leading-[28.8px] tracking-[-0.26px] text-black">
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
            {isOpen && (
              <div id={`faq-${i}`} className="-mt-6 px-8 pb-8">
                {f.a.map((line) => (
                  <p key={line} className="font-lexend-deca text-[16px] font-light leading-8 tracking-[-0.18px] text-[#626466]">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
