import Image from "next/image";
import type { FeaturedDetail } from "@/data/gaming";
import ArtImage from "./ArtImage";

/**
 * SPECIAL PAGE "Desktop - 17" – "Designed for Gamers / Built for Performance":
 * lead banner (1280×600), three 416×384 feature cards, closing banner (1280×512).
 */
export default function FeaturedShowcase({ showcase }: { showcase: FeaturedDetail["showcase"] }) {
  const { banners } = showcase;
  const mobileBanners = showcase.mobileBanners ?? banners;
  return (
    <section id="features" className="bg-silver-mobile overflow-hidden lg:bg-silver">
      {/* Mobile – Figma "Spice detal" screen 2 (394×1379) */}
      <div className="mobile-frame flex flex-col items-center px-4 pt-[72px] pb-[72px] lg:hidden">
        {/* Each title line: lead words in ink, last word in red ("Designed for / Gamers") */}
        <h2 className="text-center font-lexend-deca text-[40px] font-semibold leading-[38px]">
          {showcase.title.map((line) => {
            const split = line.lastIndexOf(" ");
            return (
              <span key={line} className="block">
                <span className="block text-ink/80">{line.slice(0, split)}</span>
                <span className="block text-[rgba(230,0,18,0.8)]">{line.slice(split + 1)}</span>
              </span>
            );
          })}
        </h2>
        <p className="mt-6 text-center font-lexend-deca text-[18px] font-light leading-[25px] tracking-[0.54px] text-ink/60">
          {showcase.description}
        </p>
        <div className="mt-6 flex w-full flex-col gap-4">
          {mobileBanners?.top && (
            <div className="relative h-[232px] overflow-hidden rounded-2xl">
              <Image src={mobileBanners.top} alt="" fill sizes="(max-width: 640px) 100vw, 640px" className="object-cover" />
            </div>
          )}
          {showcase.cards.map((card) => (
            <div key={card.title} className="flex h-[144px] overflow-hidden rounded-2xl bg-[#f6f6f6]">
              <div className="relative w-[136px] shrink-0">
                <Image
                  src={card.mobileImage ?? card.image.src}
                  alt={card.image.alt ?? ""}
                  fill
                  sizes="136px"
                  className={card.mobileImage ? "object-cover" : "object-contain p-2"}
                />
              </div>
              <div className="flex flex-col justify-center gap-2 pr-3 pl-3.5">
                <h3 className="font-lexend text-[18px] font-medium leading-[22px] text-ink">{card.title}</h3>
                <p className="font-lexend text-[13px] font-light leading-4 text-ink/80">{card.text}</p>
              </div>
            </div>
          ))}
          {mobileBanners?.bottom && (
            <div className="relative h-[232px] overflow-hidden rounded-2xl">
              <Image src={mobileBanners.bottom} alt="" fill sizes="(max-width: 640px) 100vw, 640px" className="object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="page-frame hidden flex-col items-center px-20 pt-14 pb-20 lg:flex">
        <h2 className="text-center font-lexend-giga text-[40px] font-bold leading-none tracking-[-3.2px] text-[rgba(230,0,18,0.8)]">
          {showcase.title[0]}
          <br />
          {showcase.title[1]}
        </h2>
        <p className="mt-4 w-[810px] text-center font-lexend-deca text-[20px] font-light leading-[1.4] tracking-[0.6px] text-ink/60">
          {showcase.description}
        </p>

        {banners?.top && (
          <div className="relative mt-12 h-[600px] w-[1280px]">
            <Image src={banners.top} alt="" fill sizes="1280px" className="object-cover" />
          </div>
        )}

        <ul className="mt-4 flex gap-4">
          {showcase.cards.map((card) => (
            <li key={card.title} className="relative h-[384px] w-[416px] overflow-hidden bg-[#f6f6f6]">
              <ArtImage art={card.image} />
              <h3 className="absolute left-6 top-8 font-lexend text-[20px] font-medium uppercase leading-[1.2] text-ink">
                {card.title}
              </h3>
              <p className="absolute left-6 top-[68px] font-lexend text-[14px] font-light leading-[1.2] text-ink/75">
                {card.text}
              </p>
            </li>
          ))}
        </ul>

        {banners?.bottom && (
          <div className="relative mt-4 h-[512px] w-[1280px]">
            <Image src={banners.bottom} alt="" fill sizes="1280px" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
