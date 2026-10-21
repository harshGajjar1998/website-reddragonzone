import Image from "next/image";
import Link from "next/link";
import { footerColumns, socialLinks } from "@/data/navigation";
import FooterLogo from "./FooterLogo";
import MobileFooter from "./MobileFooter";

export default function Footer() {
  return (
    <>
      <MobileFooter />
      <footer className="hidden bg-silver-footer lg:block shadow-[inset_0_0_0_1px_#171a21]">
        <div className="page-frame flex flex-col gap-16 px-[120px] pt-20 pb-10">
          {/* Top: brand + link columns */}
          <div className="flex items-start gap-12">
            <div className="flex w-[360px] shrink-0 flex-col gap-4">
              <FooterLogo />
              <p className="font-archivo text-[13px] leading-[1.5] text-ink/75">
                Engineering mechanical excellence for the global elite. Built for raw reactive
                triggers, structured matrix custom designs, and long-form combat stability.
              </p>
            </div>

            {/* API: dynamic data – footer link columns */}
            {footerColumns.map((col) => (
              <div key={col.title} className="flex w-[162px] shrink-0 flex-col gap-4">
                <h3 className="font-lato text-[14px] font-extrabold uppercase leading-normal tracking-[1px] text-ink">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="block font-archivo text-[13px] leading-[14px] text-ink/75 hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr className="h-px border-0 bg-footer-rule" />

          {/* Bottom: copyright + socials */}
          <div className="flex items-center justify-between">
            <p className="font-lexend text-[12px] leading-normal text-ink/80">© 2026 REDRAGON</p>
            <ul className="flex items-center gap-4">
              {/* API: dynamic data – social links */}
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex size-9 items-center justify-center rounded-full bg-social transition-opacity hover:opacity-80"
                  >
                    <Image src={s.icon} alt="" width={16} height={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
