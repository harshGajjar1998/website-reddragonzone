"use client";

import Image from "next/image";
import { useState } from "react";
import BrowseLink from "@/components/ui/BrowseLink";
import type { FeaturedProduct } from "@/data/home";

const productShadow = "drop-bento";

const pad = (n: number) => String(n).padStart(2, "0");

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

/** Figma "Desktop - 10" – New Gears bento carousel (1440×800). */
export default function FeaturedProductsSection({ products }: { products: FeaturedProduct[] }) {
  const [index, setIndex] = useState(0);
  const count = products.length;
  const current = products[index];
  const prev = products[(index - 1 + count) % count];
  const next = products[(index + 1) % count];

  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  return (
    <section className="bg-silver overflow-hidden" aria-roledescription="carousel" aria-label="New gears">
      <div className="page-frame flex h-[800px] flex-col">
        {/* Heading row */}
        <div className="relative h-[200px] shrink-0 whitespace-nowrap">
          <p className="absolute left-1/2 top-[68px] -translate-x-1/2 font-lexend-giga text-[40px] font-bold leading-none tracking-[-3.2px] text-[rgba(230,0,18,0.8)]">
            New Gears
          </p>
          <h2 className="absolute left-1/2 top-[106px] -translate-x-1/2 font-lexend-exa text-[22px] font-semibold leading-[1.2] text-ink">
            Features Products
          </h2>
        </div>

        {/* Slides row: previous peek | active | next peek */}
        <div className="flex h-[400px] shrink-0">
          <div className="relative h-full flex-1 overflow-clip border-y border-r border-hairline">
            {prev.peekImage && (
              <div className="absolute left-[calc(50%+0.82px)] top-[calc(50%+0.44px)] flex h-[368.129px] w-[124.901px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                <div className={`relative h-[124.901px] w-[368.129px] flex-none rotate-90 overflow-hidden ${productShadow}`}>
                  <Image
                    src={prev.peekImage}
                    alt={prev.model}
                    width={541}
                    height={359}
                    className="absolute left-[-23.5%] top-[-93.82%] h-[287.63%] w-[146.99%] max-w-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div key={current.id} className="relative h-full w-[960px] shrink-0 overflow-clip border border-hairline">
            {current.image && (
              <Image
                src={current.image}
                alt={`${current.series} ${current.model}`.trim()}
                width={623}
                height={432}
                className={`absolute left-[425px] top-[-44px] h-[432px] w-[623px] object-cover ${productShadow}`}
              />
            )}
            <ProductCopy product={current} width={382} />
          </div>

          <div className="relative h-full flex-1 overflow-clip border-y border-l border-hairline">
            <ProductCopy product={next} width={306} />
          </div>
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
