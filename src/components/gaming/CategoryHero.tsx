import Image from "next/image";
import Link from "next/link";
import type { GamingCategory } from "@/data/gaming";
import ArtImage from "./ArtImage";

const crumb = "font-lexend-giga text-[24px] leading-[1.2] whitespace-nowrap";

// API: dynamic data – category banner (via props)
/** Figma "Frame 3" of the category page – breadcrumb, title, copy and hero render (688px). */
export default function CategoryHero({ category }: { category: GamingCategory }) {
  const { hero } = category;
  return (
    <section className="bg-silver-mobile overflow-hidden lg:bg-silver">
      {/* Mobile – no Figma frame; follows the office category hero (copy over a 344×320 render) */}
      <div className="mobile-frame px-4 pt-10 pb-12 lg:hidden">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 font-lexend-giga text-[14px] leading-[1.2] text-ink">
            <li>
              <Link href="/gaming" className="text-ink/70">
                GAMING PRODUCTS
              </Link>
            </li>
            <li aria-hidden className="text-ink/70">
              /
            </li>
            <li aria-current="page" className="font-medium text-dragon">
              {hero.breadcrumb}
            </li>
          </ol>
        </nav>
        <h1 className="mt-2 font-lexend-exa text-[32px] font-semibold leading-[1.2] text-ink">{hero.title}</h1>
        <div className="relative mt-6 h-[320px] w-full">
          <Image
            src={hero.image.src}
            alt={hero.image.alt ?? hero.title}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            preload
            className={`object-contain ${hero.image.shadow ?? "drop-product"}`}
          />
        </div>
        <Image src="/icons/gaming/hero-rule.svg" alt="" width={87} height={2} className="mt-6" />
        <p className="mt-5 whitespace-pre-line font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-[#626466]">
          {hero.description}
        </p>
      </div>

      <div className="page-frame relative hidden h-[688px] lg:block">
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
