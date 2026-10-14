import Image from "next/image";
import ExplodedHotspots from "./ExplodedHotspots";

/**
 * Mobile exploded view – Figma "Home Mobile version" screen 3 (390×800): heading, then the
 * M997 exploded render with tappable part hotspots. Also used on the gaming featured page.
 */
export default function MobileExplodedView({ productName }: { productName: string }) {
  return (
    <div className="mobile-frame pt-14 pb-[95px] lg:hidden">
      <div className="px-4">
        <p className="font-lexend-giga text-[20px] font-semibold leading-[1.2] text-dragon">
          Exploded Architectural Blueprint
        </p>
        <h2 className="mt-3 font-lexend-exa text-[28px] font-medium leading-[1.2] text-ink">
          Unrivaled Internal Assembly of {productName}
        </h2>
      </div>
      <div className="relative mt-[79px] aspect-[390/408] w-full">
        <Image
          src="/images/home/m997-exploded.png"
          alt={`Exploded view of the ${productName} internal components`}
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
        />
        <ExplodedHotspots />
      </div>
    </div>
  );
}
