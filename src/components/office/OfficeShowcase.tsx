import Image from "next/image";
import ArtImage from "@/components/gaming/ArtImage";
import type { FeaturedDetail } from "@/data/gaming";

/** Highlight the last two words of each title line in red (bold), rest regular (Figma runs) */
function TitleLine({ text }: { text: string }) {
  const words = text.split(" ");
  const lead = words.slice(0, -2).join(" ");
  const accent = words.slice(-2);
  return (
    <>
      <span className="font-medium text-ink/80">{lead} </span>
      <span className="font-bold text-[rgba(230,0,18,0.8)]">{accent[0]}</span>{" "}
      <span className="font-bold text-[rgba(230,0,18,0.8)]">{accent[1]}</span>
    </>
  );
}

/**
 * Office SPECIAL PAGE "Desktop - 17" – two-tone title, 1280×600 lead image,
 * three 416×384 rounded feature cards and a 1280×512 closing image.
 */
export default function OfficeShowcase({ showcase }: { showcase: FeaturedDetail["showcase"] }) {
  const { banners } = showcase;
  const [first, second] = showcase.title;
  // Design: "Built for Comfortable Control" – "Control" is bold #404040, not red
  const secondWords = second.split(" ");
  const last = secondWords.pop();
  const accent = secondWords.pop();

  return (
    <section id="features" className="overflow-hidden bg-white">
      <div className="page-frame flex flex-col items-center px-20 pt-14 pb-20">
        <h2 className="text-center font-lexend-giga text-[40px] leading-none tracking-[-3.2px]">
          <TitleLine text={first} />
          <br />
          <span className="font-medium text-ink/80">{secondWords.join(" ")} </span>
          <span className="font-bold text-[rgba(230,0,18,0.8)]">{accent}</span>{" "}
          <span className="font-bold text-[#404040]">{last}</span>
        </h2>
        <p className="mt-4 w-[950px] text-center font-lexend-deca text-[20px] font-light leading-[1.4] tracking-[0.6px] text-ink/60">
          {showcase.description}
        </p>

        {banners?.top && (
          <div className="relative mt-12 h-[600px] w-[1280px] overflow-hidden rounded-2xl">
            <Image src={banners.top} alt="" fill sizes="1280px" className="object-cover" />
          </div>
        )}

        <ul className="mt-4 flex gap-4">
          {showcase.cards.map((card) => (
            <li key={card.title} className="relative h-[384px] w-[416px] overflow-hidden rounded-2xl bg-[#f7f7f7]">
              <ArtImage art={{ ...card.image, sizes: "609px" }} />
              <h3 className="absolute left-6 top-8 font-lexend text-[24px] font-medium leading-none whitespace-nowrap text-ink">
                {card.title}
              </h3>
              <p className="absolute left-6 top-[68px] w-[352px] font-lexend text-[16px] font-light leading-none text-ink/80">
                {card.text}
              </p>
            </li>
          ))}
        </ul>

        {banners?.bottom && (
          <div className="relative mt-4 h-[512px] w-[1280px] overflow-hidden rounded-2xl">
            <Image src={banners.bottom} alt="" fill sizes="1280px" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
