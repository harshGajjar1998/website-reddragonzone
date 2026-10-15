"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categoryHref, rangeOf, type GalleryImage, type GamingCategory, type GamingProduct } from "@/data/gaming";

function GalleryCell({ image, priority }: { image: GalleryImage; priority: boolean }) {
  return (
    <li className="relative h-[368px] w-[337px] overflow-hidden" style={{ background: image.bg }}>
      {image.crop ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          preload={priority}
          className="absolute max-w-none"
          style={{
            width: `${image.crop.w}%`,
            height: `${image.crop.h}%`,
            left: `${image.crop.left}%`,
            top: `${image.crop.top}%`,
          }}
        />
      ) : (
        <Image src={image.src} alt={image.alt} fill sizes="337px" preload={priority} className="object-cover" />
      )}
    </li>
  );
}

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
        <p className="mt-3 font-lexend text-[14px] font-light leading-[1.4] tracking-[0.84px] text-ink/75">{body}</p>
      )}
    </div>
  );
}

/**
 * KEWBOARD DETAIL PAGE "Desktop - 16" – breadcrumb, 2-column gallery (337×368 cells)
 * and the product info column (module switch, colour, description, accordions).
 */
export default function ProductOverview({
  product,
  category,
  special,
}: {
  product: GamingProduct;
  category: GamingCategory;
  /**
   * Mobile layout of the featured ("SPECIAL PAGE") product, Figma "Spice detal" screen 1:
   * no module switch, and the model name as a centred ghost word under the accordions.
   * Desktop keeps the featured hero, so only the mobile block renders.
   */
  special?: { ghost: string };
}) {
  const gallery: GalleryImage[] = product.gallery ?? [
    { ...product.image, alt: product.name, bg: "#f6f6f6" },
  ];
  const modules = product.modules ?? [{ label: product.name }];
  const colors = product.colors ?? [];
  const details = product.details ?? [];

  const office = product.range === "office";
  const range = rangeOf(product);
  const [module, setModule] = useState(0);
  const [color, setColor] = useState(0);

  const moduleSwitch = (className = "mt-2") => (
    <div role="radiogroup" aria-label="Module" className={`${className} flex border border-ink/50`}>
      {modules.map((m, i) => {
        const active = i === module;
        const cls = `flex flex-1 items-center justify-center px-2 py-[10px] font-lexend text-[12px] leading-none whitespace-nowrap ${
          active ? `bg-[#e60012] ${office ? "text-white" : "text-[#1f1c1c]"}` : "text-ink hover:bg-black/5"
        } ${i > 0 ? "border-l border-ink/50" : ""}`;
        return m.href && !active ? (
          <Link key={m.label} href={m.href} className={cls}>
            {m.label}
          </Link>
        ) : (
          <button
            key={m.label}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setModule(i)}
            className={`cursor-pointer ${cls}`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );

  const colorSwatches = (className = "mt-2 gap-3") => (
    <div role="radiogroup" aria-label="Color" className={`${className} flex`}>
      {colors.map((c, i) => (
        <button
          key={c.name}
          type="button"
          role="radio"
          aria-checked={i === color}
          aria-label={c.name}
          onClick={() => setColor(i)}
          className={`size-6 cursor-pointer rounded-full ${
            i === color && colors.length > 1 ? "ring-2 ring-dragon ring-offset-2" : ""
          }`}
          style={{ background: c.hex }}
        />
      ))}
    </div>
  );

  const breadcrumb = (className: string) => (
    <nav aria-label="Breadcrumb">
      <ol className={className}>
        <li>
          <Link href={range.base} className="hover:text-dragon">
            {range.label} Products
          </Link>
          <span aria-hidden className="ml-[0.3em]">/</span>
        </li>
        <li>
          <Link href={categoryHref(category)} className="hover:text-dragon">
            {range.label} {category.label}
          </Link>
          <span aria-hidden className="ml-[0.3em]">/</span>
        </li>
        <li aria-current="page">{product.name}</li>
      </ol>
    </nav>
  );

  return (
    <section
      className={`relative overflow-hidden ${office ? "bg-white" : "bg-silver-mobile lg:bg-silver"} ${special ? "lg:hidden" : ""}`}
    >
      {/* Mobile – Figma "Frame 153" screen 1 (394×1056 incl. 96px header) */}
      <div className={`mobile-frame pt-10 lg:hidden ${special ? "" : "pb-7"}`}>
        {/* Outlined product name behind the accordions, cropped by the section edge */}
        {!special && (
          <p
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-4 font-lato text-[64px] font-bold leading-[0.95] tracking-[-1.28px] text-transparent [-webkit-text-stroke:1.2px_rgb(116_116_116/0.3)]"
          >
            {product.name}
          </p>
        )}

        <div className="relative px-4">
          {breadcrumb("flex flex-wrap gap-x-[0.3em] font-lato text-[14px] leading-normal text-ink/80")}
          <h1 className="mt-2 font-lexend-exa text-[32px] font-semibold leading-[1.2] text-ink">{product.name}</h1>
        </div>

        <ul
          aria-label={`${product.name} gallery`}
          className="relative mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {gallery.map((image, i) => (
            <li
              key={image.src + i}
              className="relative h-[320px] w-[95%] max-w-[344px] shrink-0 snap-start overflow-hidden"
              style={{ background: image.bg ?? "#f6f6f6" }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 88vw, 344px"
                preload={i === 0}
                className="object-cover"
              />
            </li>
          ))}
        </ul>

        <div className="relative px-4">
          <hr className="mt-6 border-0 border-t border-ink" />
          {!special && (
            <>
              <p className="mt-4 font-lexend text-[16px] font-medium leading-[1.2] text-ink">Module</p>
              {moduleSwitch("mt-3")}
            </>
          )}
          {colors.length > 0 && (
            <>
              <p className="mt-5 font-lexend text-[16px] font-medium leading-[1.2] text-ink">
                Color {colors[color].name}
              </p>
              {colorSwatches("mt-3 gap-2")}
            </>
          )}
          <p className="mt-5 font-lexend text-[16px] font-medium leading-[1.2] text-ink">Description</p>
          <p className="mt-3 font-lexend text-[14px] font-light capitalize leading-[18px] tracking-[0.84px] text-ink/75">
            {product.description ?? product.tagline}
          </p>
          {details.length > 0 && (
            <div className="mt-5 flex flex-col gap-5">
              {details.map((d) => (
                <Accordion key={d.title} title={d.title} body={d.body} />
              ))}
            </div>
          )}
        </div>

        {/* Ghost model name, cut off by the section's bottom edge */}
        {special && (
          <div aria-hidden className="mt-3.5 h-[69px] overflow-hidden text-center">
            <p className="font-lato text-[96px] font-bold leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_rgb(116_116_116/0.55)]">
              {special.ghost}
            </p>
          </div>
        )}
      </div>

      {!special && (
        <div className="page-frame hidden px-20 pt-12 pb-24 lg:block">
          {breadcrumb(
            "flex gap-[0.3em] font-lexend-exa text-[16px] font-semibold leading-none tracking-[-0.48px] whitespace-nowrap text-ink",
          )}

          <div className="mt-8 flex items-start gap-[65px]">
            <ul className="grid shrink-0 grid-cols-[337px_337px] gap-x-[17px] gap-y-4" aria-label={`${product.name} gallery`}>
              {gallery.map((image, i) => (
                <GalleryCell key={image.src + i} image={image} priority={i < 2} />
              ))}
            </ul>

            <div className="flex w-[524px] shrink-0 flex-col">
              {product.series && (
                <p className="font-lexend-giga text-[24px] leading-[1.2] text-ink/80">{product.series}</p>
              )}
              <h1 className="mt-2 font-lexend-exa text-[56px] font-semibold leading-[1.2] text-ink">{product.name}</h1>

              <p className="mt-6 font-lexend text-[16px] font-medium leading-[1.2] text-ink">Module</p>
              {moduleSwitch()}

              {colors.length > 0 && (
                <>
                  <p className="mt-6 font-lexend text-[16px] font-medium leading-[1.2] text-ink">
                    Color {colors[color].name}
                  </p>
                  {colorSwatches()}
                </>
              )}

              <hr className={`mt-6 h-[1.5px] border-0 ${office ? "bg-[#e7e7e7]" : "bg-ink/50"}`} />

              <p className="mt-[30px] font-lexend text-[16px] font-medium leading-[1.2] text-ink">Description</p>
              <p className="mt-2 font-lexend text-[14px] font-light capitalize leading-[1.2] tracking-[0.84px] text-pretty text-ink/75">
                {product.description ?? product.tagline}
              </p>

              {details.length > 0 && (
                <div className="mt-6 flex flex-col gap-6">
                  {details.map((d) => (
                    <Accordion key={d.title} title={d.title} body={d.body} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
