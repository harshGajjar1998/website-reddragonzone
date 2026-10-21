import Image from "next/image";
import Link from "next/link";
import { productHref, type GamingProduct } from "@/data/gaming";
import ArtImage, { type Art } from "./ArtImage";

type Size = "large" | "small";

const SIZES = {
  // 470×416 – first two products on page 1
  large: {
    card: "h-[416px] w-[470px]",
    title: "left-6 w-[267px] text-[20px] tracking-[-0.2px]",
    keywords: "right-6",
    defaultBox: { left: 24, top: 33, w: 422, h: 422 },
    tagline: "left-16 top-[362px]",
    arrow: { size: 56, left: 390, top: 348, src: "/icons/gaming/arrow-circle-diag-card.svg" },
  },
  // 308×384 grid card
  small: {
    card: "h-[384px] w-[308px]",
    // width set per range below (gaming 128px, office 142px)
    title: "left-4 text-[16px] tracking-[-0.16px]",
    keywords: "right-4",
    defaultBox: { left: 17, top: 76, w: 274, h: 274 },
    tagline: "left-4 top-[334px]",
    arrow: { size: 40, left: 252, top: 328, src: "/icons/gaming/arrow-circle-diag-sm.svg" },
  },
} as const;

/** Figma "Thumbs up 1" – three stroked groups in a 32×38 frame */
function ThumbsUp() {
  return (
    <span aria-hidden className="absolute left-6 top-[357px] block h-[38px] w-8 overflow-clip">
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
  const spec = size === "large" ? product.largeArt : product.smallArt;
  const art: Art = {
    ...product.image,
    alt: product.name,
    fit: spec?.crop ? undefined : "contain",
    box: s.defaultBox,
    ...spec,
    sizes: size === "large" ? "470px" : "308px",
  };

  return (
    <Link
      href={productHref(product)}
      className={`group relative block shrink-0 overflow-hidden border-[1.2px] border-white/50 transition-[background-color,box-shadow] duration-200 hover:shadow-card-hover ${
        office ? "bg-[#f6f6f6]" : "bg-white hover:bg-[#eee] focus-visible:bg-[#eee]"
      } ${s.card}`}
    >
      {office ? (
        /* R mark (108×120, 5% opacity) in the bottom-left corner */
        <span
          aria-hidden
          className="absolute bottom-0 left-0.5 h-[120px] w-[108px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Image src="/brand/redragon-logo-office.png" alt="" fill sizes="108px" className="object-cover opacity-5" />
        </span>
      ) : (
        /* Dragon watermark (227×150, 10% opacity) in the bottom-right corner */
        <span
          aria-hidden
          className="absolute bottom-0 right-0 h-[150px] w-[227px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Image src="/images/gaming/dragon-watermark.png" alt="" fill sizes="227px" className="object-cover opacity-10" />
          <span className="absolute inset-0 bg-[rgba(238,238,238,0.2)]" />
        </span>
      )}

      <ArtImage art={art} />

      <h3
        className={`absolute top-6 font-lexend font-medium uppercase leading-[1.2] text-ink ${s.title} ${
          size === "small" ? (office ? "w-[142px]" : "w-32") : ""
        }`}
      >
        {product.name}
      </h3>
      <p className={`absolute top-6 font-lexend text-[12px] uppercase leading-[1.2] text-ink ${s.keywords}`}>
        {product.keywords}
      </p>

      {/* Hover details */}
      <div className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {size === "large" && <ThumbsUp />}
        <p
          className={`absolute w-[202px] font-lexend text-[12px] font-light capitalize leading-[1.2] tracking-[0.72px] text-balance ${office ? "text-ink/75" : "text-ink"} ${s.tagline}`}
        >
          {product.tagline}
        </p>
        <Image
          src={s.arrow.src}
          alt=""
          width={s.arrow.size}
          height={s.arrow.size}
          className="absolute"
          style={{ left: s.arrow.left, top: s.arrow.top }}
        />
      </div>
    </Link>
  );
}
