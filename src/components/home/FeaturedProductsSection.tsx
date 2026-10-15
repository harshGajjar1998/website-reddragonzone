"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import BrowseLink from "@/components/ui/BrowseLink";
import type { FeaturedProduct } from "@/data/home";

const productShadow = "drop-bento";

const pad = (n: number) => String(n).padStart(2, "0");
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Slides kept mounted around the active one, so neighbours are in place before they slide into view. */
const SLOTS = [-2, -1, 0, 1, 2];

/**
 * Infinite strip. `pos` is an unbounded counter and each slide is keyed by its absolute position,
 * so on next/prev the same elements glide one slot over (no re-mount, no rewind when wrapping).
 * `place` returns the transform for a slot, plus any live drag offset.
 */
function SlideStrip({
  pos,
  dragging = false,
  place,
  className,
  render,
}: {
  pos: number;
  dragging?: boolean;
  place: (slot: number) => string;
  className: string;
  render: (p: number) => ReactNode;
}) {
  return SLOTS.map((slot) => {
    const p = pos + slot;
    return (
      <div
        key={p}
        inert={slot !== 0}
        aria-hidden={slot !== 0}
        className={`${className} ${
          dragging ? "" : "transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
        }`}
        style={{ transform: place(slot) }}
      >
        {render(p)}
      </div>
    );
  });
}

function ProductCopy({ product, width }: { product: FeaturedProduct; width: number }) {
  return (
    <>
      {product.series && (
        <p className="absolute left-[55px] top-[63px] font-lexend-giga text-[24px] leading-[1.2] whitespace-nowrap text-ink/80">
          {product.series}
        </p>
      )}
      <h3 className="absolute left-[55px] top-[100px] font-lexend-exa text-[56px] font-semibold leading-[1.2] whitespace-nowrap text-ink">
        {product.model}
      </h3>
      {product.description && (
        <p
          className="absolute left-[55px] top-[175px] font-lexend-deca text-[20px] font-light leading-[1.4] tracking-[0.6px] text-ink/60"
          style={{ width }}
        >
          {product.description}
        </p>
      )}
      <div className="absolute left-[55px] top-[287px] flex">
        <BrowseLink href={product.href} />
      </div>
    </>
  );
}

/** One 358×560 mobile card. */
function MobileSlide({ product, label }: { product: FeaturedProduct; label: string }) {
  const image = product.image ?? product.peekImage;
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      className="flex h-full flex-col border-x border-hairline bg-[#eeeeee]"
    >
      <div className="relative mt-6 aspect-[359/249] w-full">
        {image && (
          <Image
            src={image}
            alt={`${product.series} ${product.model}`.trim()}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className={product.image ? `object-cover ${productShadow}` : `object-contain ${productShadow}`}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col items-start px-6">
        {product.series && (
          <p className="mt-[35px] font-lexend-giga text-[24px] leading-[1.2] text-ink/80">{product.series}</p>
        )}
        <h3 className="mt-[3px] font-lexend-exa text-[48px] font-semibold leading-[1.2] text-ink">{product.model}</h3>
        {product.description && (
          <p className="mt-1.5 max-w-[310px] font-lexend-deca text-[16px] font-light leading-[1.4] tracking-[0.48px] text-ink/60">
            {product.description}
          </p>
        )}
        <Link
          href={product.href}
          className="group mt-auto mb-6 inline-flex items-center gap-3 font-lexend-deca text-[20px] font-semibold uppercase leading-[1.25] text-dragon"
        >
          Browse
          <Image
            src="/icons/arrow-circle-right.svg"
            alt=""
            width={32}
            height={32}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}

/** Mobile – Figma "Home Mobile version" screen 5: the card strip follows the finger, or tap the dots. */
function MobileFeatured({
  products,
  pos,
  go,
}: {
  products: FeaturedProduct[];
  pos: number;
  go: (step: number) => void;
}) {
  const count = products.length;
  const index = mod(pos, count);
  const touchX = useRef<number | null>(null);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);

  const endDrag = () => {
    if (touchX.current === null) return;
    if (Math.abs(dragPx) > 50) go(dragPx < 0 ? 1 : -1);
    touchX.current = null;
    setDragging(false);
    setDragPx(0);
  };

  return (
    <div className="mobile-frame pt-12 pb-10 lg:hidden">
      <div className="text-center whitespace-nowrap">
        <p className="font-lexend-giga text-[40px] font-bold leading-none tracking-[-3.2px] text-[rgba(230,0,18,0.8)]">
          New Gears
        </p>
        <h2 className="-mt-0.5 font-lexend-exa text-[22px] font-semibold leading-[1.2] text-ink">Features Products</h2>
      </div>

      <div
        className="mt-10 touch-pan-y border-y border-hairline px-4"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
          setDragging(true);
        }}
        onTouchMove={(e) => {
          if (touchX.current !== null) setDragPx(e.touches[0].clientX - touchX.current);
        }}
        onTouchEnd={endDrag}
        onTouchCancel={endDrag}
      >
        <div className="relative h-[560px] overflow-hidden">
          <SlideStrip
            pos={pos}
            dragging={dragging}
            className="absolute inset-0"
            place={(slot) => `translateX(calc(${slot * 100}% + ${dragPx}px))`}
            render={(p) => <MobileSlide product={products[mod(p, count)]} label={`${mod(p, count) + 1} of ${count}`} />}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        {products.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Go to product ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i - index)}
            className={`size-4 cursor-pointer rounded-full transition-colors duration-500 ${i === index ? "bg-dragon" : "border border-[#151c21]"}`}
          />
        ))}
      </div>
    </div>
  );
}

/** Figma "Desktop - 10" – New Gears bento carousel (1440×800). */
export default function FeaturedProductsSection({ products }: { products: FeaturedProduct[] }) {
  // Unbounded position so the strip always slides the short way round (no rewind when wrapping)
  const [pos, setPos] = useState(0);
  const count = products.length;
  const index = mod(pos, count);

  const go = (step: number) => setPos((p) => p + step);

  return (
    <section className="bg-silver-mobile overflow-hidden lg:bg-silver" aria-roledescription="carousel" aria-label="New gears">
      <MobileFeatured products={products} pos={pos} go={go} />
      <div className="page-frame hidden h-[800px] flex-col lg:flex">
        {/* Heading row */}
        <div className="relative h-[200px] shrink-0 whitespace-nowrap">
          <p className="absolute left-1/2 top-[68px] -translate-x-1/2 font-lexend-giga text-[40px] font-bold leading-none tracking-[-3.2px] text-[rgba(230,0,18,0.8)]">
            New Gears
          </p>
          <h2 className="absolute left-1/2 top-[106px] -translate-x-1/2 font-lexend-exa text-[22px] font-semibold leading-[1.2] text-ink">
            Features Products
          </h2>
        </div>

        {/* Slides row: one strip of 960px slides – the active one is centred, its neighbours peek in the
            240px side columns, and the whole strip glides one slide per step */}
        <div className="relative h-[400px] shrink-0 overflow-clip border-y border-r border-hairline">
          <SlideStrip
            pos={pos}
            className="absolute top-0 left-[240px] h-full w-[960px] overflow-clip border-l border-hairline"
            place={(slot) => `translateX(${slot * 960}px)`}
            render={(p) => {
              const product = products[mod(p, count)];
              return (
                <div role="group" aria-roledescription="slide" aria-label={`${mod(p, count) + 1} of ${count}`}>
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={`${product.series} ${product.model}`.trim()}
                      width={623}
                      height={432}
                      className={`absolute left-[425px] top-[-44px] h-[432px] w-[623px] object-cover ${productShadow}`}
                    />
                  )}
                  <ProductCopy product={product} width={382} />
                </div>
              );
            }}
          />
        </div>

        {/* Controls row */}
        <div className="flex h-[200px] shrink-0">
          <div className="flex h-full w-[480px] items-center justify-center border-t border-r border-hairline">
            <button type="button" aria-label="Previous product" onClick={() => go(-1)} className="cursor-pointer">
              <Image src="/icons/slider-chevron.svg" alt="" width={72} height={72} className="-scale-x-100" />
            </button>
          </div>

          <div className="relative h-full w-[480px] border-x border-t border-hairline">
            <p className="absolute left-[111px] top-[84px] font-lexend-deca text-[24px] font-medium leading-normal text-dragon">
              {pad(index + 1)}
            </p>
            <Image
              src="/icons/slider-line.svg"
              alt=""
              width={182}
              height={2}
              className="absolute left-[147px] top-[97px]"
            />
            <p className="absolute left-[337px] top-[84px] font-lexend-deca text-[24px] font-medium leading-normal text-black">
              {pad(count)}
            </p>
          </div>

          <div className="flex h-full w-[480px] items-center justify-center border-t border-l border-hairline">
            <button type="button" aria-label="Next product" onClick={() => go(1)} className="cursor-pointer">
              <Image src="/icons/slider-chevron-right.svg" alt="" width={72} height={72} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
