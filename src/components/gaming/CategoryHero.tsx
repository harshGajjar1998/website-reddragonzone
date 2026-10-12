import Image from "next/image";
import Link from "next/link";
import type { GamingCategory } from "@/data/gaming";
import ArtImage from "./ArtImage";

const crumb = "font-lexend-giga text-[24px] leading-[1.2] whitespace-nowrap";

/** Figma "Frame 3" of the category page – breadcrumb, title, copy and hero render (688px). */
export default function CategoryHero({ category }: { category: GamingCategory }) {
  const { hero } = category;
  return (
    <section className="bg-silver overflow-hidden">
      <div className="page-frame relative h-[688px]">
        <ArtImage art={hero.image} />

        <nav aria-label="Breadcrumb" className="absolute left-20 top-[217px]">
          <ol className="flex items-center text-ink">
            <li>
              <Link href="/" className={`${crumb} hover:text-dragon`}>
                HOME
              </Link>
            </li>
            <li className="flex items-center pl-3">
              <span aria-hidden className={`${crumb} px-2 [text-box:trim-both_cap_alphabetic]`}>
                /
              </span>
              <Link href="/gaming" className={`${crumb} hover:text-dragon`}>
                GAMING PRODUCTS
              </Link>
            </li>
            <li className="flex items-center pl-3">
              <span aria-hidden className={`${crumb} px-2 [text-box:trim-both_cap_alphabetic]`}>
                /
              </span>
              <span aria-current="page" className={`${crumb} font-medium text-dragon`}>
                {hero.breadcrumb}
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="absolute left-20 top-[262px] font-lexend-exa text-[64px] font-semibold leading-[1.2] whitespace-nowrap text-ink">
          {hero.title}
        </h1>

        <div className="absolute left-20 top-[363px] flex w-[556px] flex-col gap-5">
          <Image src="/icons/gaming/hero-rule.svg" alt="" width={87} height={2} className="-mx-px -my-px" />
          <p className="whitespace-pre-line font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-[#626466]">
            {hero.description}
          </p>
        </div>
      </div>
    </section>
  );
}
