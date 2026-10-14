"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mainNav, megaMenus, socialLinks } from "@/data/navigation";

/**
 * Full-screen navigation drawer opened by the mobile header's menu button.
 * Not in the Figma file – styled after the dark mega-menu panels (charcoal / graphite,
 * Lexend Deca labels) and reuses their category tiles as sub-links.
 */
export default function MobileMenu({ onClose, logo }: { onClose: () => void; logo: React.ReactNode }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-charcoal lg:hidden"
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-6">
        {logo}
        <button type="button" aria-label="Close menu" onClick={onClose} className="flex size-6 cursor-pointer items-center">
          <Image src="/icons/close.svg" alt="" width={24} height={24} />
        </button>
      </div>

      <nav aria-label="Mobile" className="flex-1 px-6 pb-10">
        <ul className="border-t border-white/10">
          {mainNav.map((item) => {
            const menu = item.hasDropdown ? megaMenus[item.label] : undefined;
            const open = expanded === item.label;
            const panelId = `mobile-menu-${item.label.toLowerCase()}`;
            return (
              <li key={item.label} className="border-b border-white/10">
                {menu ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setExpanded(open ? null : item.label)}
                      className={`flex h-16 w-full cursor-pointer items-center justify-between font-lexend-deca text-[20px] font-medium transition-colors ${
                        open ? "text-dragon" : "text-white"
                      }`}
                    >
                      {item.label}
                      <Image
                        src={open ? "/icons/chevron-down-red.svg" : "/icons/chevron-down.svg"}
                        alt=""
                        width={14}
                        height={14}
                        className={`transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <ul id={panelId} className="flex flex-col gap-2 pb-5">
                        <li>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="flex h-12 items-center rounded-[12px] px-4 font-lexend-deca text-[16px] font-light text-white/70 hover:text-white"
                          >
                            All {item.label}
                          </Link>
                        </li>
                        {menu.tiles.map((tile) => (
                          <li key={tile.label}>
                            <Link
                              href={tile.href}
                              onClick={onClose}
                              className="flex h-16 items-center gap-4 rounded-[12px] bg-graphite px-3 font-lexend-deca text-[16px] font-light text-white/70 transition-colors hover:text-white"
                            >
                              <span className="relative size-12 shrink-0">
                                <Image src={tile.images[0].src} alt="" fill sizes="48px" className="object-contain" />
                              </span>
                              {tile.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex h-16 items-center font-lexend-deca text-[20px] font-medium text-white"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <ul className="mt-10 flex items-center justify-center gap-4">
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
      </nav>
    </div>
  );
}
