import Image from "next/image";
import Link from "next/link";
import { productHref, type FeaturedCard } from "@/data/gaming";
import ArtImage from "./ArtImage";
import CenteredHeading from "./CenteredHeading";

/** Figma "Desktop - 15" on the gaming landing page – three 416×432 product cards. */
export default function FeaturedProductsGrid({ cards, light }: { cards: FeaturedCard[]; light?: boolean }) {
  return (
    <section className={`overflow-hidden ${light ? "bg-white" : "bg-silver"}`}>
      <div className="page-frame relative h-[728px]">
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
