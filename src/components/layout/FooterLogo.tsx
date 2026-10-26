"use client";

import Image from "next/image";
import Link from "next/link";
import { useProductRange } from "@/lib/useProductRange";
import { useChrome } from "@/components/layout/ChromeProvider";

/** Footer mark – gaming pages use "GAMING LOGO 1" (97×66), office pages the R mark (64×64, fit). */
export default function FooterLogo() {
  const range = useProductRange();
  const { logos } = useChrome();
  return (
    <Link href="/" aria-label="Redragon home" className="block w-fit">
      {range === "office" ? (
        <Image
          src={logos.office}
          alt="Redragon"
          width={1167}
          height={1290}
          sizes="64px"
          className="size-16 object-contain"
        />
      ) : (
        <Image
          src={range === "gaming" ? logos.gaming : logos.footer}
          alt="Redragon"
          width={97}
          height={66}
          className="h-[66px] w-[97px] object-contain"
        />
      )}
    </Link>
  );
}
