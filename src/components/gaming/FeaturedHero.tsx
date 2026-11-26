"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Swatches } from "@/components/office/OfficeSpecHero";
import ProductActions from "@/components/product/ProductActions";
import ProductPointers from "@/components/product/ProductPointers";
import {
  categoryHref,
  type FeaturedHero as FeaturedHeroData,
  type GamingCategory,
  type GamingProduct,
} from "@/data/gaming";

/** "PRISM PRO M997" with model "M997" → ["PRISM PRO", "M997", ""]; the model part is shown in red. */
function splitName(name: string, model: string): [string, string, string] {
  const at = model ? name.indexOf(model) : -1;
  if (at <= 0) return [name, "", ""];
  return [name.slice(0, at).trim(), model, name.slice(at + model.length)];
}

// API: dynamic data – featured product header (via props)
/**
 * Gaming featured product header – Figma "TECHNICAL SPECIFICATIONS" (3245:1670, 1440×688):
 * breadcrumb, two-tone name, colour, description and the panel links on the silver background;
 * spotlight panel on the right with the dragon mark, outlined vertical model name, render and thumbnails.
 * Desktop only – on mobile ProductOverview opens the page.
 */
export default function FeaturedHero({
  hero,
  product,
  category,
}: {
  hero: FeaturedHeroData;
  product: GamingProduct;
  category: GamingCategory;
}) {
  const colors = product.colors ?? [];
  const [color, setColor] = useState(0);
  const [lead, model, rest] = splitName(product.name, hero.model);

  return (
    <section className="relative hidden overflow-hidden bg-silver lg:block">
      <div className="page-frame h-[688px]">
        {/* Spotlight panel – bleeds to the viewport edge above 1440px */}
        <div className="bg-hero-panel absolute left-[1036px] right-[min(0px,calc(720px-50vw))] top-0 h-[688px]" />
        <Image
          src="/images/home/dragon-head-logo.png"
          alt=""
          width={524}
          height={345}
          className="absolute left-[1142px] top-[492px] h-[196px] w-[297px] max-w-none object-cover opacity-35"
        />

        {/* Vertical outlined model name (rotated 90° CCW) */}
        <div className="absolute left-[797px] top-[161px] flex h-[344px] w-[166px] items-center justify-center">
          <p
            aria-hidden
            className="-rotate-90 font-lato text-[128px] font-bold leading-[1.3] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_#1a1a1a]"
          >
            {hero.model}
          </p>
        </div>

        <div className="absolute left-[858px] top-[50px] h-[589px] w-[343px] overflow-hidden drop-hero-main">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            width={1600}
            height={1600}
            preload
            className="absolute left-0 top-[0.05%] h-full w-[171.5%] max-w-none"
          />
        </div>

        <ul className="absolute left-[1210px] top-[119px] flex h-[451px] w-[150px] flex-col">
          {hero.thumbnails.map((t) => (
            <li key={t.src} className="relative aspect-square w-full shrink-0 drop-thumb">
              <Image src={t.src} alt={t.alt} fill sizes="150px" className="object-cover" />
            </li>
          ))}
        </ul>

        {/* Spec column */}
        {/* Stays in the spec column (the product image starts at ~692px); a long name ends in "…" */}
        <nav aria-label="Breadcrumb" className="absolute left-20 top-16 max-w-[600px]">
          <ol className="flex min-w-0 gap-[0.25em] font-lato text-[16px] leading-normal whitespace-nowrap text-ink/70">
            <li className="shrink-0">
              <Link href="/gaming" className="hover:text-dragon">
                Gaming Products
              </Link>
              <span aria-hidden className="ml-[0.25em]">/</span>
            </li>
            <li className="shrink-0">
              <Link href={categoryHref(category)} className="hover:text-dragon">
                Game {category.label}
              </Link>
              <span aria-hidden className="ml-[0.25em]">/</span>
            </li>
            <li aria-current="page" title={product.name} className="min-w-0 truncate">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* 56px fits two lines of ~14 characters before the colours at 259px; longer names step down to 44px (three lines) */}
        <h1 className={`absolute left-20 top-[101px] w-[640px] font-lexend-exa font-semibold leading-[1.2] text-ink [overflow-wrap:anywhere] ${product.name.length <= 28 ? "text-[56px]" : "text-[44px]"}`}>
          {model ? (
            <>
              <span className="block">{lead}</span>
              <span className="block">
                <span className="text-[#e01a22]">{model}</span>
                {rest}
              </span>
            </>
          ) : (
            lead
          )}
        </h1>

        {colors.length > 0 && (
          <div className="absolute left-20 top-[259px]">
            <p className="font-lexend text-[16px] font-medium leading-[1.2] text-ink">Color {colors[color].name}</p>
            <Swatches colors={colors} color={color} setColor={setColor} size="size-6" />
          </div>
        )}

        <hr className="absolute left-20 top-[326px] h-px w-[632px] border-0 bg-ink" />

        <div className="absolute left-20 top-[342px] w-[632px]">
          <p className="font-lexend text-[16px] font-medium leading-[1.2] text-ink">Description</p>
          <p className="mt-4 font-lexend text-[14px] font-light capitalize leading-[1.2] tracking-[0.84px] text-ink/75">
            {product.description ?? hero.description}
          </p>
          <ProductPointers product={product} className="mt-4 gap-4" />
          <ProductActions product={product} className="mt-4" />
        </div>
      </div>
    </section>
  );
}
