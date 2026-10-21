import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import type { FeaturedHero as FeaturedHeroData } from "@/data/gaming";

// API: dynamic data – featured product banner (via props)
/**
 * Featured product hero ("TECHNICAL SPECIFICATIONS", 1440×688 below the header):
 * dark gradient, spotlight panel, outlined model name, product render + thumbnails.
 */
export default function FeaturedHero({ hero, name }: { hero: FeaturedHeroData; name: string }) {
  return (
    // Desktop only – on mobile the page opens with the product overview instead
    <section className="relative hidden overflow-hidden bg-gradient-to-r from-[#454344] to-[#727071] to-[78.646%] lg:block">
      <div className="page-frame h-[688px]">
        {/* Spotlight panel – bleeds to the viewport edge above 1440px */}
        <div className="bg-hero-panel absolute left-[1025px] right-[min(0px,calc(720px-50vw))] top-0 h-[688px]" />

        <div className="absolute left-[788px] top-[161px] flex h-[344px] w-[166px] items-center justify-center">
          <p aria-hidden className="-rotate-90 font-lato text-[128px] font-bold leading-[1.3] whitespace-nowrap text-outline-white">
            {hero.model}
          </p>
        </div>
        <p
          aria-hidden
          className="absolute left-[120px] top-[443px] w-[679px] font-lato text-[140px] font-bold leading-none tracking-[-5.6px] text-outline-faint [text-box:trim-both_cap_alphabetic]"
        >
          {hero.ghostLines[0]}
        </p>
        <p
          aria-hidden
          className="absolute left-[120px] top-[585px] w-[679px] font-lato text-[142.947px] font-bold leading-none tracking-[-5.7179px] text-outline-faint [text-box:trim-both_cap_alphabetic]"
        >
          {hero.ghostLines[1]}
        </p>

        <div className="absolute left-[849px] top-[50px] h-[589px] w-[343px] overflow-hidden drop-hero-main">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            width={1600}
            height={1600}
            preload
            className="absolute left-0 top-[0.05%] h-full w-[171.5%] max-w-none"
          />
        </div>

        <ul className="absolute left-[1201px] top-[119px] flex h-[451px] w-[150px] flex-col">
          {hero.thumbnails.map((t) => (
            <li key={t.src} className="relative aspect-square w-full shrink-0 drop-thumb">
              <Image src={t.src} alt={t.alt} fill sizes="150px" className="object-cover" />
            </li>
          ))}
        </ul>

        <div className="absolute left-[120px] top-[173px] flex flex-col items-start text-white">
          <p className="font-lato text-[20px] leading-normal text-white/80">{hero.eyebrow}</p>
          <h1 className="mt-2 font-lato text-[40px] font-black leading-normal whitespace-nowrap">
            <span className="sr-only">{name} – </span>
            {hero.title}
          </h1>
          <p className="mt-2 w-[592px] font-lato text-[16px] font-light leading-[1.5] text-white/80">
            {hero.description}
          </p>
          <ButtonLink
            href="#features"
            chevron
            className="mt-[33px] px-7 py-[14.5px] font-lato text-[16px] font-semibold leading-normal"
          >
            More details
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
