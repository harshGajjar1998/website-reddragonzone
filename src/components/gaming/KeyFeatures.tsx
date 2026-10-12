import Image from "next/image";
import type { GamingProduct } from "@/data/gaming";

type KeyFeaturesData = NonNullable<GamingProduct["keyFeatures"]>;

/**
 * KEWBOARD DETAIL PAGE "Desktop - 17" – heading, 1280×744 lifestyle shot and a
 * horizontally scrolling strip of 740/524×440 feature cards that bleeds off the right edge.
 */
export default function KeyFeatures({
  data,
  productName,
  light,
}: {
  data: KeyFeaturesData;
  productName: string;
  /** Office pages sit on plain white */
  light?: boolean;
}) {
  const { hero } = data;
  return (
    <section className={`overflow-hidden ${light ? "bg-white" : "bg-silver"}`}>
      <div className="page-frame flex flex-col items-center pt-14 pb-20">
        <h2 className="font-lexend-giga text-[40px] font-bold leading-none tracking-[-3.2px] text-[rgba(230,0,18,0.8)]">
          Key Features
        </h2>
        <p className="mt-4 w-[810px] text-center font-lexend-deca text-[20px] font-light leading-[1.4] tracking-[0.6px] text-ink/60">
          {data.description}
        </p>

        <div className="relative mt-12 h-[744px] w-[1280px] overflow-hidden">
          {hero.crop ? (
            <Image
              src={hero.src}
              alt={`${productName} in use`}
              width={hero.width}
              height={hero.height}
              className="absolute max-w-none"
              style={{
                width: `${hero.crop.w}%`,
                height: `${hero.crop.h}%`,
                left: `${hero.crop.left}%`,
                top: `${hero.crop.top}%`,
              }}
            />
          ) : (
            <Image src={hero.src} alt={`${productName} in use`} fill sizes="1280px" className="object-cover" />
          )}
        </div>

        {/* Strip starts at x=80 and runs to the viewport edge */}
        <ul
          aria-label={`${productName} features`}
          className="mt-6 mr-[min(0px,calc(720px-50vw))] flex snap-x snap-mandatory scroll-pl-20 gap-4 self-stretch overflow-x-auto px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.items.map((item, i) => (
            <li key={i} className={`shrink-0 snap-start ${item.wide ? "w-[740px]" : "w-[524px]"}`}>
              <div className="relative h-[440px] w-full overflow-hidden" style={{ background: item.image.bg }}>
                <Image
                  src={item.image.src}
                  alt={item.title ?? `${productName} detail`}
                  fill
                  sizes={item.wide ? "740px" : "524px"}
                  className="object-cover"
                />
              </div>
              {item.title && (
                <h3 className="mt-6 font-lexend text-[20px] font-medium leading-[1.2] text-ink">{item.title}</h3>
              )}
              {item.text && (
                <p className="mt-3 font-lexend text-[16px] font-light capitalize leading-[1.2] tracking-[0.96px] text-pretty text-ink/75">
                  {item.text}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
