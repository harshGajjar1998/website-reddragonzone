import Image from "next/image";
import Link from "next/link";
import { productHref, type FeaturedCard, type MobileFeaturedCard } from "@/data/gaming";
import ArtImage from "./ArtImage";
import CenteredHeading from "./CenteredHeading";

/** Mobile card without its own art: the desktop render, fitted into the card's image slot. */
const toMobileCard = (card: FeaturedCard): MobileFeaturedCard => {
  const art = card.art[card.art.length - 1];
  return {
    name: card.name,
    description: card.description,
    href: productHref(card.product),
    image: { ...art, box: { left: 10.69, top: 27.79, w: 149.63, h: 149.63 }, crop: undefined, fit: "contain" },
  };
};

/** 171×205 mobile card (Figma "Frame 130" … "Frame 140"). */
function MobileCard({ card }: { card: MobileFeaturedCard }) {
  return (
    <li>
      <Link href={card.href} className="relative block h-[205px] overflow-hidden bg-[#f6f6f6]">
        <ArtImage art={{ ...card.image, sizes: "45vw" }} />
        <h3 className="absolute left-[9px] top-[9px] w-[121px] font-lexend text-[10px] font-medium uppercase leading-[1.2] tracking-[-0.1px] text-ink">
          {card.name}
        </h3>
        <p className="absolute left-[9px] top-[181px] w-[116px] -translate-y-1/2 font-lexend text-[10px] font-light capitalize leading-[1.2] tracking-[0.6px] text-ink/75">
          {card.description}
        </p>
        <Image
          src="/icons/arrow-circle-right.svg"
          alt=""
          width={20}
          height={20}
          className="absolute right-[12px] top-[171px] size-5"
        />
      </Link>
    </li>
  );
}

/** Office mobile: the first product as a 358×376 hero card (Figma "Rectangle 28"). */
function MobileHeroCard({ card }: { card: MobileFeaturedCard }) {
  return (
    <Link href={card.href} className="relative block h-[376px] border border-white bg-[#f6f6f6]">
      <div className="absolute inset-x-0 top-[48px] h-[278px]">
        <Image src={card.image.src} alt={card.image.alt ?? ""} fill sizes="100vw" className="object-contain" />
      </div>
      <h3 className="absolute left-[21px] top-[22px] font-lexend text-[17.4px] font-medium uppercase leading-[1.2] tracking-[-0.17px] text-ink">
        {card.name}
      </h3>
      <p className="absolute bottom-[34px] left-[21px] w-[250px] font-lexend text-[10.4px] font-light capitalize leading-[1.25] tracking-[0.63px] text-ink/75">
        {card.description}
      </p>
      <Image src="/icons/arrow-circle-right.svg" alt="" width={40} height={40} className="absolute bottom-[28px] right-[18px] size-10" />
    </Link>
  );
}

type FeaturedProductsGridProps = {
  cards: FeaturedCard[];
  /** Mobile grid (defaults to `cards`) */
  mobileCards?: MobileFeaturedCard[];
  light?: boolean;
};

/** Figma "Desktop - 15" on the gaming landing page – three 416×432 product cards. */
export default function FeaturedProductsGrid({ cards, mobileCards, light }: FeaturedProductsGridProps) {
  const mobile = mobileCards ?? cards.map(toMobileCard);
  // Office leads with one large card; gaming is a plain two-column grid
  const [hero, ...rest] = light ? mobile : [undefined, ...mobile];

  return (
    <section className={`overflow-hidden ${light ? "bg-white" : "bg-silver-mobile lg:bg-silver"}`}>
      {/* Mobile – Figma "Game Product" / "Office Produce" screen 4 */}
      <div className={`mobile-frame px-4 pt-14 lg:hidden ${light ? "pb-14" : "pb-[88px]"}`}>
        <CenteredHeading compact title="FEATURED PRODUCTS" subtitle="Explore our new collection gear!" />
        <div className="mt-[42px] flex flex-col gap-4">
          {hero && <MobileHeroCard card={hero} />}
          <ul className="grid grid-cols-2 gap-x-[18px] gap-y-4">
            {rest.map((card) => card && <MobileCard key={card.name + card.href} card={card} />)}
          </ul>
        </div>
      </div>

      <div className="page-frame relative hidden h-[728px] lg:block">
        <CenteredHeading
          title="FEATURED PRODUCTS"
          subtitle="Explore our new collection gear!"
          className="absolute left-1/2 top-20 -translate-x-1/2"
        />

        <ul className="absolute left-20 top-[216px] flex gap-4">
          {cards.map((card) => (
            <li key={card.name}>
              <Link
                href={productHref(card.product)}
                className="group relative block h-[432px] w-[416px] border-[1.2px] border-white/50 bg-[#f6f6f6] transition-shadow hover:shadow-card-hover"
              >
                {card.art.map((art, i) => (
                  <ArtImage key={i} art={art} />
                ))}
                <h3 className="absolute left-6 top-6 w-[236px] font-lexend text-[20px] font-medium uppercase leading-[1.2] tracking-[-0.2px] text-ink">
                  {card.name}
                </h3>
                <p className="absolute right-6 top-6 font-lexend text-[12px] uppercase leading-[1.2] text-ink">
                  {card.label}
                </p>
                <p className="absolute left-6 top-[380px] w-[236px] font-lexend text-[12px] font-light capitalize leading-[1.2] tracking-[0.72px] text-balance text-ink/75">
                  {card.description}
                </p>
                {/* 56px diagonal arrow rotated 45° → points right (79.2px rotated box) */}
                <span className="absolute left-[372px] top-[354.4px] flex size-[79.196px] items-center justify-center">
                  <Image
                    src="/icons/arrow-circle-diag.svg"
                    alt=""
                    width={56}
                    height={56}
                    className="rotate-45 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
