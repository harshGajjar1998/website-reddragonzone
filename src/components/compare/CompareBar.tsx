"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import AddProductModal from "@/components/compare/AddProductModal";
import { useChrome } from "@/components/layout/ChromeProvider";
import { compareId, findCompareProduct } from "@/data/compare";
import type { GamingProduct } from "@/data/gaming";
import { COMPARE_MAX, COMPARE_MIN, removeFromCompare, setCompareReturn, useCompareState } from "@/lib/compare";

const STATUS: Record<number, string> = {
  1: "1 selected · Select 2–3 to compare",
  2: "2 of 3 selected · Add one more or compare now",
  3: "3 of 3 selected · Maximum reached",
};

function SelectedChip({ product }: { product: GamingProduct }) {
  return (
    <li className="flex h-10 max-w-[70%] shrink-0 items-center gap-2.5 rounded-[8px] bg-[#28282c] pr-2.5 pl-3.5 lg:h-[58px] lg:w-[230px] lg:max-w-none">
      {/* API: dynamic data – product name */}
      <span className="min-w-0 truncate font-lexend-deca text-[13px] leading-[18px] font-medium text-white">
        {product.name}
      </span>
      <button
        type="button"
        aria-label={`Remove ${product.name} from comparison`}
        onClick={() => removeFromCompare(compareId(product))}
        className="shrink-0 cursor-pointer font-lexend-deca text-[18px] leading-[25px] text-[#bababa] hover:text-white"
      >
        ×
      </button>
    </li>
  );
}

/** Figma "Compare / Sticky selected-products tray": pinned to the bottom of the screen. */
export default function CompareBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { ids } = useCompareState();
  const [adding, setAdding] = useState(false);

  // API: dynamic data – selected products
  const { catalogue } = useChrome();
  const products = ids.map((id) => findCompareProduct(catalogue, id)).filter((p) => p !== undefined);
  if (products.length === 0 || pathname.startsWith("/compare")) return null;

  const ready = products.length >= COMPARE_MIN;
  const compare = () => {
    setCompareReturn(window.location.pathname + window.location.search);
    router.push("/compare/");
  };

  return (
    <>
      {/* Keeps the end of the page clear of the fixed bar */}
      <div aria-hidden className="h-[168px] lg:h-[124px]" />
      <section
        aria-label="Compare products"
        className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-crimson bg-[#17171b] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="page-frame flex flex-col gap-3 px-4 py-3 lg:h-[121px] lg:flex-row lg:items-center lg:gap-0 lg:px-[120px] lg:py-0">
          <div className="flex items-center justify-between gap-3 lg:contents">
            <div className="min-w-0 lg:w-[270px] lg:shrink-0 lg:pr-3">
              <p className="font-lexend-deca text-[14px] leading-5 font-semibold text-white lg:text-[17px] lg:leading-6">
                COMPARE PRODUCTS
              </p>
              <p className="mt-0.5 font-lexend-deca text-[12px] leading-4 text-[#adb0b8] lg:mt-2 lg:text-[13px] lg:leading-[18px]">
                {STATUS[products.length]}
              </p>
            </div>
            <button
              type="button"
              disabled={!ready}
              onClick={compare}
              className={`h-11 w-[140px] shrink-0 rounded-[6px] font-lexend-deca text-[14px] leading-6 font-semibold whitespace-pre transition-colors lg:order-last lg:ml-auto lg:h-[55px] lg:w-[183px] lg:text-[16px] ${
                ready ? "cursor-pointer bg-dragon text-white hover:bg-[#c3151c]" : "cursor-not-allowed bg-graphite text-[#949494]"
              }`}
            >
              Compare now{"  "}→
            </button>
          </div>
          <ul className="flex min-w-0 gap-2 overflow-x-auto [scrollbar-width:none] lg:gap-3 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {products.map((product) => (
              <SelectedChip key={compareId(product)} product={product} />
            ))}
            {products.length < COMPARE_MAX && (
              <li className="shrink-0">
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="h-10 cursor-pointer rounded-[8px] border border-[#565860] bg-[#202025] px-3.5 font-lexend-deca text-[13px] leading-[18px] font-medium whitespace-pre text-[#b9bcc3] hover:text-white lg:h-[58px] lg:w-[230px]"
                >
                  +{"  "}Add product
                </button>
              </li>
            )}
          </ul>
        </div>
      </section>
      {adding && <AddProductModal onClose={() => setAdding(false)} />}
    </>
  );
}
