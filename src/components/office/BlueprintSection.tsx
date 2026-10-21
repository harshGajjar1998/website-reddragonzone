import Image from "next/image";

type BlueprintSectionProps = {
  src: string;
  alt: string;
  /** Mobile heading above the cropped artwork (desktop labels are part of the image) */
  heading?: { lead: string; accent: string; subtitle: string };
};

// API: dynamic data – product blueprint image + heading (via props)
/** Office SPECIAL PAGE "Section 3" – full-bleed exploded-view artwork (labels are part of the image). */
export default function BlueprintSection({ src, alt, heading }: BlueprintSectionProps) {
  return (
    <>
      {/* Mobile – Figma "Spice detal" screen 3: heading + 394×467 crop of the artwork */}
      <section className="overflow-hidden bg-white lg:hidden">
        <div className="mobile-frame pt-[73px] pb-14">
          {heading && (
            <div className="px-4">
              <h2 className="font-lexend-giga text-[32px] font-medium leading-[38px] tracking-[-2.56px]">
                <span className="block text-ink/80">{heading.lead}</span>
                <span className="block text-[#e60012]">{heading.accent}</span>
              </h2>
              <p className="mt-4 font-lexend-deca text-[18px] font-light leading-[1.4] tracking-[0.54px] text-ink/60">
                {heading.subtitle}
              </p>
            </div>
          )}
          <div className="relative mt-[47px] aspect-[394/467] w-full overflow-hidden bg-[#ebebeb]">
            <Image
              src={src}
              alt={alt}
              width={1681}
              height={936}
              sizes="(max-width: 640px) 274vw, 1750px"
              className="absolute left-[-86.76%] top-[-24.56%] h-[128.43%] w-[273.5%] max-w-none"
            />
          </div>
        </div>
      </section>

      <section className="relative hidden h-[800px] overflow-hidden bg-[#ebebeb] lg:block">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </section>
    </>
  );
}
