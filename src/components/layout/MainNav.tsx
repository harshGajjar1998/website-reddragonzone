"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChrome } from "./ChromeProvider";
import { usePresence } from "@/lib/usePresence";
import { useProductRange } from "@/lib/useProductRange";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";

/** Grace period so the pointer can travel from a nav link down into its panel */
const CLOSE_DELAY_MS = 150;

export default function MainNav() {
  const { mainNav, megaMenus } = useChrome();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const range = useProductRange();
  const pathname = usePathname();

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
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  // Overlays stay mounted briefly after closing so they can animate out
  const menuMounted = usePresence(menuOpen);
  const searchMounted = usePresence(searchOpen);

  // Close the mega menu as soon as a navigation lands, even if the pointer never leaves the panel
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(null);
  }

  // Mobile mirrors desktop: office pages show the R mark, gaming pages the dragon head, other pages the wordmark
  const mobileLogo = (
    <Link href="/" aria-label="Redragon home" onClick={closeMenu} className="flex h-10 items-center">
      {range === "office" ? (
        <Image
          src="/brand/redragon-logo-office.png"
          alt="Redragon"
          width={1167}
          height={1290}
          sizes="32px"
          preload
          className="size-8 object-contain"
        />
      ) : range === "gaming" ? (
        /* Figma mobile "GAMING LOGO 2", 58×40 */
        <Image
          src="/brand/redragon-logo-gaming.png"
          alt="Redragon"
          width={58}
          height={40}
          preload
          className="h-10 w-[58px] max-w-none object-cover"
        />
      ) : (
        <Image
          src="/brand/redragon-logo.png"
          alt="Redragon"
          width={120}
          height={32}
          preload
          className="h-8 w-[120px] object-contain"
        />
      )}
    </Link>
  );

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Last opened menu stays mounted after closing so it can fade out
  const [shownMenu, setShownMenu] = useState<string | null>(null);
  if (openMenu && openMenu !== shownMenu) setShownMenu(openMenu);
  // API: dynamic data – mega menu content
  const panel = shownMenu ? megaMenus[shownMenu] : undefined;

  return (
    <>
      {/* Mobile header (Figma "Frame 130", 390×64) */}
      <div className="flex h-16 items-center justify-between bg-charcoal px-6 lg:hidden">
        {mobileLogo}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(true)}
            className="flex size-6 cursor-pointer items-center"
          >
            <Image src="/icons/mobile/search.svg" alt="" width={24} height={24} />
          </button>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="flex size-6 cursor-pointer items-center"
          >
            <Image src="/icons/mobile/menu.svg" alt="" width={24} height={24} />
          </button>
        </div>
      </div>
      {menuMounted && <MobileMenu open={menuOpen} onClose={closeMenu} logo={mobileLogo} />}

      <nav aria-label="Main" className="relative hidden bg-charcoal lg:block" onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
        <div className="page-frame flex items-center justify-between px-[120px] py-4">
          <Link href="/" aria-label="Redragon home" className="flex h-10 items-center">
            {range === "office" ? (
              /* Office pages use the R mark (Figma "image 5", 48×48 fit) */
              <Image
                src="/brand/redragon-logo-office.png"
                alt="Redragon"
                width={1167}
                height={1290}
                sizes="48px"
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
            {/* API: dynamic data – main navigation + mega menus */}
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

        {panel && shownMenu && (
          <MegaMenu
            id={`mega-menu-${shownMenu.toLowerCase()}`}
            menu={panel}
            open={openMenu !== null}
            onNavigate={() => {
              cancelClose();
              setOpenMenu(null);
            }}
          />
        )}
      </nav>

      {searchMounted && <SearchOverlay open={searchOpen} onClose={closeSearch} />}
    </>
  );
}
