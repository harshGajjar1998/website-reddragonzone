import type { ReactNode } from "react";
import BrowseLink from "@/components/ui/BrowseLink";

export type CategoryCardProps = {
  title: string;
  /** Oversized ghost word behind the title */
  ghost: string;
  href: string;
  /** Offsets inside the card – the design nudges these per card */
  titleTop?: number;
  browseTop?: number;
  ghostLeft?: number;
  /** Art clipped to the rounded card (also clips the ghost word) */
  clippedArt?: ReactNode;
  /** Product art that breaks out of the card, positioned relative to it */
  children?: ReactNode;
};

/** 592×176 dark rounded card from "Choose Your Gears". */
export default function CategoryCard({
  title,
  ghost,
  href,
  titleTop = 66,
  browseTop = 129,
  ghostLeft = -8,
  clippedArt,
  children,
}: CategoryCardProps) {
  return (
    <div className="relative h-[176px] w-[592px]">
      <div className={`absolute inset-0 rounded-[40px] bg-graphite ${clippedArt ? "overflow-clip" : ""}`}>
        <p
          aria-hidden
          style={{ left: ghostLeft }}
          className="absolute top-[27px] font-gotham text-[88px] font-medium uppercase leading-[1.2] whitespace-nowrap text-ghost"
        >
          {ghost}
        </p>
        {clippedArt}
      </div>
      {children}

      <h3
        className="absolute left-8 font-lexend-deca text-[24px] font-medium leading-[1.2] whitespace-nowrap text-white"
        style={{ top: titleTop }}
      >
        {title}
      </h3>
      <div className="absolute left-8 flex" style={{ top: browseTop }}>
        <BrowseLink href={href} size="sm" />
      </div>
    </div>
  );
}
