"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useChrome } from "./ChromeProvider";
import { useProductRange } from "@/lib/useProductRange";
import FooterLogo from "./FooterLogo";
import Collapse from "@/components/ui/Collapse";

/** Mobile footer (Figma "iPhone 13 & 14 - 7"): logo + blurb, link columns as an accordion, socials. */
export default function MobileFooter() {
  const { footerColumns, footerBlurb, socialLinks } = useChrome();
  const range = useProductRange();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <footer className={`lg:hidden ${range === "office" ? "bg-white" : "bg-silver-mobile"}`}>
      <div className="mobile-frame px-4 pt-20 pb-14">
        <div className="flex flex-col gap-4">
          <FooterLogo />
          <p className="font-archivo text-[13px] leading-[20px] text-ink/75">
            {footerBlurb}
          </p>
        </div>

        <ul className="mt-8 border-t border-[#8d8d8d]">
          {/* API: dynamic data – footer link columns */}
          {footerColumns.map((col) => {
            const expanded = open === col.title;
            const id = `footer-${col.title.toLowerCase().replace(/\W+/g, "-")}`;
            return (
              <li key={col.title} className="border-b border-[#8d8d8d]">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={id}
                  onClick={() => setOpen(expanded ? null : col.title)}
                  className="flex w-full cursor-pointer items-center justify-between py-8"
                >
                  <span className="font-lato text-[16px] leading-5 font-extrabold uppercase tracking-[1px] text-ink">
                    {col.title}
                  </span>
                  <Image
                    src="/icons/mobile/plus.svg"
                    alt=""
                    width={20}
                    height={20}
                    className={`transition-transform ${expanded ? "rotate-45" : ""}`}
                  />
                </button>
                <Collapse open={expanded} id={id} className={expanded ? "-mt-3" : ""}>
                  <ul className="flex flex-col gap-4 pb-8">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="font-archivo text-[14px] leading-none text-ink/75 hover:text-ink">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              </li>
            );
          })}
        </ul>

        <ul className="mt-20 flex items-center justify-center gap-4">
          {/* API: dynamic data – social links */}
          {socialLinks.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full bg-social"
              >
                <Image src={s.icon} alt="" width={16} height={16} />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center font-lexend text-[12px] leading-normal text-ink/80">© 2026 REDRAGON</p>
      </div>
    </footer>
  );
}
