import type { ReactNode } from "react";
import BrowseLink from "@/components/ui/BrowseLink";
import { piece } from "@/lib/motion";

export type CategoryCardProps = {
  title: string;
  /** Oversized ghost word behind the title */
  ghost: string;
  href: string;
  /** Offsets inside the card – the design nudges these per card */
  titleTop?: number;
  browseTop?: number;
  ghostLeft?: number;
  /** Start of this card's entrance stagger (ms) */
  delay?: number;
  /** Art clipped to the rounded card (also clips the ghost word) */
  clippedArt?: ReactNode;
  /** Product art that breaks out of the card, positioned relative to it */
  children?: ReactNode;
};

/**
 * 592×176 dark rounded card from "Choose Your Gears". On entrance the card rises, the ghost word
 * slides in from the left and the copy follows; `.card-art` children zoom while it is hovered.
 */
export default function CategoryCard({
  title,
  ghost,
  href,
  titleTop = 66,
  browseTop = 129,
  ghostLeft = -8,
  delay = 0,
  clippedArt,
  children,
}: CategoryCardProps) {
  return (
    <div className="group/card relative h-[176px] w-[592px]">
      <div
        className={`piece absolute inset-0 rounded-[40px] bg-graphite ${clippedArt ? "overflow-clip" : ""}`}
        style={piece("bottom", delay)}
      >
        <p
          aria-hidden
          style={{ left: ghostLeft, ...piece("left", delay + 100) }}
          className="piece absolute top-[27px] font-gotham text-[88px] font-medium uppercase leading-[1.2] whitespace-nowrap text-ghost"
        >
          {ghost}
        </p>
        {clippedArt}
      </div>
      {children}

      <h3
        className="piece absolute left-8 font-lexend-deca text-[24px] font-medium leading-[1.2] whitespace-nowrap text-white"
        style={{ top: titleTop, ...piece("bottom", delay + 250) }}
      >
        {title}
      </h3>
      <div className="piece absolute left-8 flex" style={{ top: browseTop, ...piece("bottom", delay + 320) }}>
        <BrowseLink href={href} size="sm" />
      </div>
    </div>
  );
}
