"use client";

import Image from "next/image";
import Link from "next/link";
import { useProductRange } from "@/lib/useProductRange";

/** Footer mark – gaming pages use "GAMING LOGO 1" (97×66), office pages the R mark (64×64, fit). */
export default function FooterLogo() {
  const range = useProductRange();
  return (
    <Link href="/" aria-label="Redragon home" className="block w-fit">
      {range === "office" ? (
        <Image
          src="/brand/redragon-logo-office.png"
          alt="Redragon"
          width={1167}
          height={1290}
          className="size-16 object-contain"
        />
      ) : (
        <Image
          src={range === "gaming" ? "/brand/redragon-logo-gaming.png" : "/brand/redragon-logo-dragon.png"}
          alt="Redragon"
          width={97}
          height={66}
          className="h-[66px] w-[97px] object-cover"
        />
      )}
    </Link>
  );
}
