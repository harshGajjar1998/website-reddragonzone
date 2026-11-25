"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import ProductActions from "@/components/product/ProductActions";
import ProductLightbox from "@/components/product/ProductLightbox";
import ProductPointers from "@/components/product/ProductPointers";
import { categoryHref, rangeOf, type GalleryImage, type GamingCategory, type GamingProduct, type ProductModule } from "@/data/gaming";

/**
 * The gallery with the picked colour's photo in the first cell. The number of cells stays the same
 * (fixed layout): the photo replaces its own copy if the gallery has one, else the first picture.
 */
function withColour(gallery: GalleryImage[], image?: GalleryImage): GalleryImage[] {
  if (!image) return gallery;
  const rest = gallery.filter((g) => g.src !== image.src);
  return [{ ...image, bg: gallery[0]?.bg }, ...rest].slice(0, Math.max(gallery.length, 1));
}

/**
 * Image tile rule: an image with a designed background (`bg`, e.g. a photo shot on colour) fills its tile;
 * any other image (transparent PNG, the CMS default) sits centred and padded on the product tile background.
 */
const tiled = (image: GalleryImage) => !image.bg && !image.crop;

const zoomCls =
  "relative block h-full w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dragon";

function GalleryCell({ image, priority, onOpen }: { image: GalleryImage; priority: boolean; onOpen: () => void }) {
  return (
    <li className={`relative h-[368px] w-[337px] ${tiled(image) ? "bg-product-tile" : ""}`} style={{ background: image.bg }}>
      <button type="button" aria-label={`View larger: ${image.alt}`} onClick={onOpen} className={zoomCls}>
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
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="337px"
          preload={priority}
          className={tiled(image) ? "object-contain p-8 drop-product" : "object-cover"}
        />
      )}
      </button>
    </li>
  );
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Every run of whole words, normalised: "AATROX M811W- RGB-PRO manual" → aatrox, m811w, m811wrgbpro, … */
const runs = (text: string) => {
  const words = text.split(/\s+/).filter(Boolean);
  return words.flatMap((_, i) => words.slice(i).map((__, j) => norm(words.slice(i, i + j + 1).join(" "))));
};

/**
 * The product as the page shows it while a version is picked (`version`, a module without a page):
 * its name, and the manuals and drivers of that version only. Files are matched by the version's
 * model in their title ("AATROX M811W-RGB-PRO manual"); a group with no match keeps all its files.
 * `module` is the highlighted module, which also narrows the files on the product's own version.
 */
function withVersion(product: GamingProduct, version: ProductModule | undefined, module: ProductModule | undefined): GamingProduct {
  const label = module ? norm(module.label) : "";
  const downloads = label
    ? product.downloads?.map((g) => {
        const mine = g.releases.filter((r) => runs(r.version).includes(label));
        return mine.length ? { ...g, releases: mine } : g;
      })
    : product.downloads;
  return { ...product, ...(version?.name ? { name: version.name } : {}), ...(downloads ? { downloads } : {}) };
}

// API: dynamic data – product details, gallery, specs (via props)
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
  const office = product.range === "office";
  const range = rangeOf(product);
  const [color, setColor] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  /*
   * Module (model) switch: the versions of this product. The highlighted one is this page: the
   * module linking here, else the one named like this product, else the first without a link.
   * Another version either links to its own page, or (no link) has its own name, photos and
   * colours, and picking it shows those here. A version with neither is greyed out; with no
   * other version to show, the switch is hidden (it would do nothing).
   */
  const modules = product.modules ?? [];
  const here = `/${product.slug}/`;
  const names = [product.name, product.model].filter(Boolean).map((s) => norm(s!));
  const linksHere = (m: ProductModule) => !!m.href && (m.href.endsWith(here) || m.href.endsWith(here.slice(0, -1)));
  let current = modules.findIndex(linksHere);
  if (current < 0) current = modules.findIndex((m) => names.includes(norm(m.label)));
  if (current < 0) current = modules.findIndex((m) => !m.href);
  const onPage = (m: ProductModule) => !m.href && !!(m.name || m.gallery?.length || m.colors?.length);
  const showModules = modules.some((m, i) => i !== current && (!!m.href || onPage(m)));
  const active = picked ?? current;
  const version = active !== current ? modules[active] : undefined;

  // What the page shows: this product, or the picked version's name, photos and colours
  const shown = withVersion(product, version, modules[active]);
  const baseGallery: GalleryImage[] = version?.gallery ??
    product.gallery ?? [{ ...product.image, alt: product.image.alt || product.name }];
  const colors = version?.colors ?? product.colors ?? [];
  const gallery = withColour(baseGallery, colors[color]?.image);
  const carousel = useRef<HTMLUListElement>(null);
  const pickColor = (i: number) => {
    setColor(i);
    // Phone carousel: bring the colour's photo (now first) into view
    if (colors[i]?.image) carousel.current?.scrollTo({ left: 0, behavior: "smooth" });
  };
  const pickVersion = (i: number) => {
    setPicked(i === current ? null : i);
    setColor(0);
    carousel.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const moduleSwitch = (className = "mt-2") => (
    <div role="group" aria-label="Model versions" className={`${className} flex border border-ink/50`}>
      {modules.map((m, i) => {
        const on = i === active;
        const usable = i === current || !!m.href || onPage(m);
        const cls = `flex flex-1 items-center justify-center px-2 py-[10px] font-lexend text-[12px] leading-none whitespace-nowrap ${
          on ? `bg-[#e60012] ${office ? "text-white" : "text-[#1f1c1c]"}` : usable ? "cursor-pointer text-ink hover:bg-black/5" : "text-ink/35"
        } ${i > 0 ? "border-l border-ink/50" : ""}`;
        if (m.href && i !== current) {
          return (
            <Link key={m.label} href={m.href} className={cls}>
              {m.label}
            </Link>
          );
        }
        return usable ? (
          <button key={m.label} type="button" aria-pressed={on} onClick={() => pickVersion(i)} className={cls}>
            {m.label}
          </button>
        ) : (
          <span key={m.label} aria-disabled className={cls}>
            {m.label}
          </span>
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
          onClick={() => pickColor(i)}
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
          <h1 className="mt-2 font-lexend-exa text-[32px] font-semibold leading-[1.2] text-ink">{shown.name}</h1>
        </div>

        <ul
          ref={carousel}
          aria-label={`${shown.name} gallery`}
          className="relative mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {gallery.map((image, i) => (
            <li
              key={image.src + i}
              className={`relative h-[320px] w-[95%] max-w-[344px] shrink-0 snap-start ${image.bg ? "" : "bg-product-tile"}`}
              style={image.bg ? { background: image.bg } : undefined}
            >
              <button type="button" aria-label={`View larger: ${image.alt}`} onClick={() => setViewer(i)} className={zoomCls}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 88vw, 344px"
                  preload={i === 0}
                  className={image.bg ? "object-cover" : "object-contain p-6 drop-product"}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="relative px-4">
          <hr className="mt-6 border-0 border-t border-ink" />
          {!special && showModules && (
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
          <ProductPointers product={shown} className="mt-5 gap-5" />
          <ProductActions product={shown} className="mt-6" />
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
            <ul className="grid shrink-0 grid-cols-[337px_337px] gap-x-[17px] gap-y-4" aria-label={`${shown.name} gallery`}>
              {gallery.map((image, i) => (
                <GalleryCell key={image.src + i} image={image} priority={i < 2} onOpen={() => setViewer(i)} />
              ))}
            </ul>

            <div className="flex w-[524px] shrink-0 flex-col">
              {product.series && (
                <p className="font-lexend-giga text-[24px] leading-[1.2] text-ink/80">{product.series}</p>
              )}
              <h1 className="mt-2 font-lexend-exa text-[56px] font-semibold leading-[1.2] text-ink">{shown.name}</h1>

              {showModules && (
                <>
                  <p className="mt-6 font-lexend text-[16px] font-medium leading-[1.2] text-ink">Module</p>
                  {moduleSwitch()}
                </>
              )}

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

              <ProductPointers product={shown} className="mt-6 gap-6" />
              <ProductActions product={shown} className="mt-8" />
            </div>
          </div>
        </div>
      )}

      {viewer !== null && (
        <ProductLightbox images={gallery} start={viewer} title={shown.name} onClose={() => setViewer(null)} />
      )}
    </section>
  );
}
