import { ExplodedParts, ExplodedStage } from "./ExplodedMouse";
import ExplodedHotspots from "./ExplodedHotspots";

/**
 * Mobile exploded view – Figma "Home Mobile version" screen 3 (390×800): heading, then the
 * M997 exploded render (comes apart as it scrolls in) with tappable part hotspots.
 * Also used on the gaming featured page.
 */
export default function MobileExplodedView({
  eyebrow = "Exploded Architectural Blueprint",
  productName,
  parts,
}: {
  eyebrow?: string;
  productName: string;
  /** Part labels, in callout order */
  parts: string[];
}) {
  return (
    <div className="mobile-frame pt-14 pb-[95px] lg:hidden">
      <div className="px-4">
        <p className="font-lexend-giga text-[20px] font-semibold leading-[1.2] text-dragon">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-lexend-exa text-[28px] font-medium leading-[1.2] text-ink">
          Unrivaled Internal Assembly of {productName}
        </h2>
      </div>
      <ExplodedStage className="relative mt-[79px] aspect-[390/408] w-full">
        <ExplodedParts
          alt={`Exploded view of the ${productName} internal components`}
          className="absolute inset-0"
        />
        <ExplodedHotspots parts={parts} />
      </ExplodedStage>
    </div>
  );
}
