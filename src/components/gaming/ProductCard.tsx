import Image from "next/image";
import Link from "next/link";
import CompareToggle from "@/components/compare/CompareToggle";
import { productHref, type GamingProduct } from "@/data/gaming";

type Size = "large" | "small";

/*
 * The card is three stacked areas that never overlap (UI-Errors/1.png: a tall photo covered the tagline):
 * header (name + label, Compare tick beside it), a fixed image slot the photo is fitted inside, and a
 * footer kept free for the hover tagline and arrow. Card sizes are the Figma ones.
 */
const SIZES = {
  // 470×416 – first two products on page 1
  large: {
    card: "h-[416px] w-[470px]",
    pad: "px-6 pt-6 pb-3",
    title: "text-[20px] tracking-[-0.2px]",
    image: "my-3",
    footer: "h-14 gap-2",
    sizes: "422px",
    arrow: { size: 56, src: "/icons/gaming/arrow-circle-diag-card.svg" },
  },
  // 308×384 grid card
  small: {
    card: "h-[384px] w-[308px]",
    pad: "px-4 pt-6 pb-4",
    title: "text-[16px] tracking-[-0.16px]",
    image: "my-3",
    footer: "h-10 gap-2",
    sizes: "276px",
    arrow: { size: 40, src: "/icons/gaming/arrow-circle-diag-sm.svg" },
  },
} as const;

/** Figma "Thumbs up 1" – three stroked groups in a 32×38 frame */
function ThumbsUp() {
  return (
    <span aria-hidden className="relative block h-[38px] w-8 shrink-0 overflow-clip">
      <Image src="/icons/gaming/thumb-1.svg" alt="" width={11.514} height={21.032} className="absolute left-0 top-[16.97px] max-w-none" />
      <Image src="/icons/gaming/thumb-2.svg" alt="" width={21.508} height={28.737} className="absolute left-[10.5px] top-[7.72px] max-w-none" />
      <Image src="/icons/gaming/thumb-3.svg" alt="" width={26.96} height={10.27} className="absolute left-[2.22px] top-0 max-w-none" />
    </span>
  );
}

// API: dynamic data – product (via props)
/**
 * Category listing card. Gaming cards rest white and turn #eee on hover/focus with the
 * dragon watermark (bottom-right); office cards rest #f6f6f6 and show the faint R mark
 * (bottom-left). Both reveal the tagline and circled arrow and lift with a soft shadow.
 */
export default function ProductCard({ product, size }: { product: GamingProduct; size: Size }) {
  const s = SIZES[size];
  const office = product.range === "office";
  const reveal = "opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100";

  return (
    <div className={`relative shrink-0 ${s.card}`}>
      <Link
        href={productHref(product)}
        className={`group relative flex size-full flex-col overflow-hidden border-[1.2px] border-white/50 transition-[background-color,box-shadow] duration-200 hover:shadow-card-hover ${s.pad} ${
          office ? "bg-[#f6f6f6]" : "bg-white hover:bg-[#eee] focus-visible:bg-[#eee]"
        }`}
      >
        {office ? (
          /* R mark (108×120, 5% opacity) in the bottom-left corner */
          <span aria-hidden className={`absolute bottom-0 left-0.5 h-[120px] w-[108px] ${reveal}`}>
            <Image src="/brand/redragon-logo-office.png" alt="" fill sizes="108px" className="object-cover opacity-5" />
          </span>
        ) : (
          /* Dragon watermark (227×150, 10% opacity) in the bottom-right corner */
          <span aria-hidden className={`absolute right-0 bottom-0 h-[150px] w-[227px] ${reveal}`}>
            <Image src="/images/gaming/dragon-watermark.png" alt="" fill sizes="227px" className="object-cover opacity-10" />
            <span className="absolute inset-0 bg-[rgba(238,238,238,0.2)]" />
          </span>
        )}

        {/* Header: name (2 lines max) and label; the right column keeps room for the Compare tick below the label */}
        <div className="relative flex shrink-0 items-start justify-between gap-4">
          <h3 title={product.name} className={`line-clamp-2 min-h-[2.4em] min-w-0 font-lexend font-medium uppercase leading-[1.2] text-ink ${s.title}`}>
            {product.name}
          </h3>
          <div className="flex w-[84px] shrink-0 flex-col items-end">
            <p className="max-w-full truncate font-lexend text-[12px] uppercase leading-[1.2] text-ink" title={product.keywords}>
              {product.keywords}
            </p>
            <span aria-hidden className="mt-2 h-4" />
          </div>
        </div>

        {/* Image slot: takes the space between header and footer; the photo is fitted inside and clipped to it */}
        <div className={`relative min-h-0 flex-1 overflow-hidden ${s.image}`}>
          <Image src={product.image.src} alt={product.name} fill sizes={s.sizes} className="object-contain" />
        </div>

        {/* Footer: kept free for the hover tagline and arrow */}
        <div className={`relative flex shrink-0 items-center ${s.footer} ${reveal}`}>
          {size === "large" && <ThumbsUp />}
          <p
            className={`line-clamp-3 min-w-0 flex-1 font-lexend text-[12px] font-light capitalize leading-[1.2] tracking-[0.72px] text-balance ${office ? "text-ink/75" : "text-ink"}`}
          >
            {product.tagline}
          </p>
          <Image src={s.arrow.src} alt="" width={s.arrow.size} height={s.arrow.size} className="shrink-0" />
        </div>
      </Link>
      {/* Sits beside the link, not in it, so ticking it doesn't open the product */}
      <CompareToggle product={product} className={`absolute top-[46px] ${size === "large" ? "right-6" : "right-4"}`} />
    </div>
  );
}
