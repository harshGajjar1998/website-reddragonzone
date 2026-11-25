import Image from "next/image";

/** Figma "Original Perfect Match hero" (3314:1758): softly blurred desk photo, "Perfect Match" and an intro line. */
export default function CompareHero() {
  return (
    <section className="relative h-[420px] overflow-hidden bg-[#888b8e] lg:h-[688px]">
      {/* Figma: layer blur 9 on the photo; scaled up slightly so the blurred edges stay outside the frame */}
      <Image
        src="/images/compare/perfect-match-hero.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="scale-[1.03] object-cover blur-[4.5px]"
      />
      <div className="relative flex h-full flex-col items-center justify-start px-4 pt-[120px] text-center text-white [text-shadow:0_2px_16px_rgb(0_0_0/0.25)] lg:pt-[228px]">
        <h1 className="font-audiowide text-[52px] leading-[1.2] lg:text-[112px]">Perfect Match</h1>
        <p className="mt-4 max-w-[766px] font-lexend-deca text-[16px] leading-[1.5] font-medium lg:mt-2 lg:text-[20px]">
          Choose between Redragon keyboards, mice and headsets. Compare two favorites side by side, with a third choice if you
          want it.
        </p>
      </div>
    </section>
  );
}
