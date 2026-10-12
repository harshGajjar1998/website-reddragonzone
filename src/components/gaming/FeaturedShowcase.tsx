import Image from "next/image";
import type { FeaturedDetail } from "@/data/gaming";
import ArtImage from "./ArtImage";

/**
 * SPECIAL PAGE "Desktop - 17" – "Designed for Gamers / Built for Performance":
 * lead banner (1280×600), three 416×384 feature cards, closing banner (1280×512).
 */
export default function FeaturedShowcase({ showcase }: { showcase: FeaturedDetail["showcase"] }) {
  const { banners } = showcase;
  return (
    <section id="features" className="bg-silver overflow-hidden">
      <div className="page-frame flex flex-col items-center px-20 pt-14 pb-20">
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
