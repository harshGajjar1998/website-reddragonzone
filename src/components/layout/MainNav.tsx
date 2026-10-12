"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { mainNav, megaMenus } from "@/data/navigation";
import { useProductRange } from "@/lib/useProductRange";
import MegaMenu from "./MegaMenu";
import SearchOverlay from "./SearchOverlay";

/** Grace period so the pointer can travel from a nav link down into its panel */
const CLOSE_DELAY_MS = 150;

export default function MainNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const range = useProductRange();

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const open = (label: string) => {
    cancelClose();
    setOpenMenu(label);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  };
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const activeMenu = openMenu ? megaMenus[openMenu] : undefined;

  return (
    <>
      <nav aria-label="Main" className="relative bg-charcoal" onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
        <div className="page-frame flex items-center justify-between px-[120px] py-4">
          <Link href="/" aria-label="Redragon home" className="flex h-10 items-center">
            {range === "office" ? (
              /* Office pages use the R mark (Figma "image 5", 48×48 fit) */
              <Image
                src="/brand/redragon-logo-office.png"
                alt="Redragon"
                width={1167}
                height={1290}
                preload
                className="size-12 max-w-none object-contain"
              />
            ) : range === "gaming" ? (
              /* Gaming pages use the dragon-head mark (Figma "GAMING LOGO 2", 70×48) */
              <Image
                src="/brand/redragon-logo-gaming.png"
                alt="Redragon"
                width={70}
                height={48}
                preload
                className="h-12 w-[70px] max-w-none object-cover"
              />
            ) : (
              /* Logo box is 143×98 in the design (object-contain) – it overflows the 40px row */
              <Image
                src="/brand/redragon-logo.png"
                alt="Redragon"
                width={143}
                height={98}
                preload
                className="h-[98px] w-[143px] max-w-none object-contain"
              />
            )}
          </Link>

          <ul className="absolute left-[calc(50%+0.5px)] top-[26.5px] flex -translate-x-1/2 items-center gap-6">
            {mainNav.map((item) => {
              const hasMenu = item.hasDropdown && megaMenus[item.label];
              const active = openMenu === item.label;
              const menuId = `mega-menu-${item.label.toLowerCase()}`;

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => (hasMenu ? open(item.label) : setOpenMenu(null))}
                >
                  <Link
                    href={item.href}
                    aria-expanded={hasMenu ? active : undefined}
                    aria-controls={hasMenu && active ? menuId : undefined}
                    onFocus={() => (hasMenu ? open(item.label) : setOpenMenu(null))}
                    onClick={() => setOpenMenu(null)}
                    className={`flex items-center gap-1 font-lexend-deca text-[15px] font-medium leading-normal whitespace-nowrap transition-colors ${
                      active ? "text-dragon" : "text-white hover:text-white/80"
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <Image
                        src={active ? "/icons/chevron-down-red.svg" : "/icons/chevron-down.svg"}
                        alt=""
                        width={10}
                        height={10}
                      />
                    )}
                  </Link>
                  {/* Red underline under the open item (Figma "Line 4": 1px, 6.75px below the label) */}
                  {active && <span aria-hidden className="absolute inset-x-0 top-[calc(100%+6.75px)] h-px bg-dragon" />}
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => {
              setOpenMenu(null);
              setSearchOpen(true);
            }}
            className="flex cursor-pointer items-center"
          >
            <Image src="/icons/search.svg" alt="" width={24} height={24} />
          </button>
        </div>

        {activeMenu && openMenu && (
          <MegaMenu key={openMenu} id={`mega-menu-${openMenu.toLowerCase()}`} menu={activeMenu} />
        )}
      </nav>

      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </>
  );
}
