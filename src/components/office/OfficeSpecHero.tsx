"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categoryHref, type GamingCategory, type GamingProduct } from "@/data/gaming";

const Q = "/images/office/products/bm4195";

function Accordion({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-3"
      >
        <span className="font-lexend text-[16px] font-medium leading-[1.2] whitespace-nowrap text-ink">{title}</span>
        <Image
          src="/icons/gaming/accordion-chevron.svg"
          alt=""
          width={16}
          height={16}
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <p className="mt-2 font-lexend text-[14px] font-light leading-[1.4] tracking-[0.84px] text-ink/75 lg:w-[632px]">
          {body}
        </p>
      )}
    </div>
  );
}

type SwatchProps = { colors: { name: string; hex: string }[]; color: number; setColor: (i: number) => void };

function Swatches({ colors, color, setColor, size }: SwatchProps & { size: string }) {
  return (
    <div role="radiogroup" aria-label="Color" className="mt-2 flex gap-2">
      {colors.map((c, i) => (
        <button
          key={c.name}
          type="button"
          role="radio"
          aria-checked={i === color}
          aria-label={c.name}
          onClick={() => setColor(i)}
          className={`${size} cursor-pointer rounded-full ${i === color ? "ring-1 ring-ink/40 ring-offset-2" : ""}`}
          style={{ background: c.hex }}
        />
      ))}
    </div>
  );
}

/** Mobile – Figma "Spice detal" screen 1: breadcrumb, name, swipeable renders, colour + description. */
function MobileSpecHero({
  product,
  category,
  ...swatches
}: { product: GamingProduct; category: GamingCategory } & SwatchProps) {
  const hero = product.featured!.hero;
  const shots = [
    { src: product.image.src, alt: product.name, cover: true },
    ...hero.thumbnails.map((t) => ({ src: t.src, alt: t.alt, cover: false })),
  ];
  const { colors, color } = swatches;

  return (
    <div className="mobile-frame pt-10 lg:hidden">
      <div className="px-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-x-[0.25em] font-lato text-[14px] leading-normal text-ink/80">
            <li>
              <Link href="/office">Office Products</Link> <span aria-hidden>/</span>
            </li>
            <li>
              <Link href={categoryHref(category)}>Office {category.label}</Link> <span aria-hidden>/</span>
            </li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>
        <h1 className="mt-2 font-lexend-exa text-[32px] font-semibold leading-[1.2] text-ink">{product.name}</h1>
      </div>

      <ul
        aria-label="Product images"
        className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shots.map((s, i) => (
          <li key={s.src} className="relative h-[320px] w-[95%] max-w-[344px] shrink-0 snap-start bg-[#f6f6f6]">
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(max-width: 640px) 88vw, 344px"
              preload={i === 0}
              className={s.cover ? "object-cover" : "object-contain p-6"}
            />
          </li>
        ))}
      </ul>

      <div className="px-4">
        <hr className="mt-[25px] border-0 border-t border-ink" />
        {colors.length > 0 && (
          <div className="mt-[18px]">
            <p className="font-lexend text-[16px] font-medium leading-[1.2] text-ink">Color {colors[color].name}</p>
            <Swatches {...swatches} size="size-6" />
          </div>
        )}
        <p className="mt-4 font-lexend text-[16px] font-medium leading-[1.2] text-ink">Description</p>
        <p className="mt-2.5 font-lexend text-[14px] font-light capitalize leading-[18px] tracking-[0.84px] text-ink/75">
          {product.description ?? product.tagline}
        </p>
        <div className="mt-5 flex flex-col gap-5">
          {(product.details ?? []).map((d) => (
            <Accordion key={d.title} title={d.title} body={d.body} />
          ))}
        </div>
      </div>

      {/* Outlined model name, cropped by the section edge */}
      <div aria-hidden className="mt-3 h-[72px] overflow-hidden px-[13px]">
        <p className="font-lato text-[96px] font-bold leading-[1.1] tracking-[-1.92px] whitespace-nowrap text-transparent [-webkit-text-stroke:1.675px_rgb(116_116_116/0.35)]">
          {hero.model}
        </p>
      </div>
    </div>
  );
}

// API: dynamic data – office product + category (via props)
/**
 * Office featured product hero (Figma "TECHNICAL SPECIFICATIONS", 1440×688):
 * spec column on the left, spotlight panel with outlined model name, render and thumbnails.
 */
export default function OfficeSpecHero({ product, category }: { product: GamingProduct; category: GamingCategory }) {
  const hero = product.featured!.hero;
  const colors = product.colors ?? [];
  const [color, setColor] = useState(0);

  return (
    <section className="overflow-hidden bg-white">
      <MobileSpecHero product={product} category={category} colors={colors} color={color} setColor={setColor} />

      <div className="page-frame relative hidden h-[688px] lg:block">
        {/* Right spotlight panel (radial gradient fading to white + faint pattern) */}
        <Image
          src={`${Q}/hero-panel.png`}
          alt=""
          width={830}
          height={1376}
          preload
          className="absolute left-[1025px] top-0 h-[688px] w-[415px] max-w-none"
        />

        {/* Vertical outlined model name (rotated 90° CCW) */}
        <p
          aria-hidden
          className="absolute left-[772px] top-[565px] h-[146px] w-[440px] origin-top-left -rotate-90 font-lato text-[112px] font-bold leading-[1.3] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_#1a1a1a]"
        >
          {hero.model}
        </p>

        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          width={1092}
          height={1308}
          preload
          className="absolute left-[666px] top-[34px] h-[654px] w-[546px] max-w-none"
        />

        {/* Faint outlined wordmark */}
        <p
          aria-hidden
          className="absolute left-[76px] top-[595px] font-lato text-[128px] font-bold leading-none tracking-[-5.12px] whitespace-nowrap text-transparent [-webkit-text-stroke:1.675px_rgb(116_116_116/0.15)]"
        >
          {hero.model}
        </p>

        <Image
          src="/brand/redragon-logo-office.png"
          alt=""
          width={236}
          height={261}
          className="absolute left-[1204px] top-[427px] h-[261px] w-[236px] max-w-none object-cover opacity-5"
        />

        <ul className="absolute left-[1181px] top-[115px] flex flex-col">
          {hero.thumbnails.map((t, i) => (
            <li key={t.src} className={i > 0 ? "-mt-[74px]" : ""}>
              <Image src={t.src} alt={t.alt} width={380} height={448} className="h-[224px] w-[190px] max-w-none" />
            </li>
          ))}
        </ul>

        {/* Spec column */}
        <nav aria-label="Breadcrumb" className="absolute left-20 top-[120px]">
          <ol className="flex gap-[0.25em] font-lato text-[20px] leading-normal whitespace-nowrap text-ink/80">
            <li>
              <Link href="/office" className="hover:text-dragon">
                Office Products
              </Link>
              <span aria-hidden className="ml-[0.25em]">/</span>
            </li>
            <li>
              <Link href={categoryHref(category)} className="hover:text-dragon">
                Office {category.label}
              </Link>
              <span aria-hidden className="ml-[0.25em]">/</span>
            </li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <h1 className="absolute left-[76px] top-[152px] font-lexend-exa text-[56px] font-semibold leading-[1.2] whitespace-nowrap text-ink">
          {product.name}
        </h1>

        {colors.length > 0 && (
          <div className="absolute left-20 top-[235px]">
            <p className="font-lexend text-[16px] font-medium leading-[1.2] text-ink">Color {colors[color].name}</p>
            <Swatches colors={colors} color={color} setColor={setColor} size="size-6" />
          </div>
        )}

        <hr className="absolute left-20 top-[302px] h-[1.5px] w-[632px] border-0 bg-ink/50" />

        <div className="absolute left-20 top-[318px] w-[632px]">
          <p className="font-lexend text-[16px] font-medium leading-[1.2] text-ink">Description</p>
          <p className="mt-2 font-lexend text-[14px] font-light capitalize leading-[1.2] tracking-[0.84px] text-ink/75">
            {product.description ?? product.tagline}
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {(product.details ?? []).map((d) => (
              <Accordion key={d.title} title={d.title} body={d.body} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
