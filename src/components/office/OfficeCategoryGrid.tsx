import Image from "next/image";
import Link from "next/link";
import ArtImage from "@/components/gaming/ArtImage";
import CenteredHeading from "@/components/gaming/CenteredHeading";
import RevealOnView from "@/components/ui/RevealOnView";
import type { OfficeTile } from "@/data/office";
import { piece } from "@/lib/motion";

const TILE_BG = "/images/gaming/categories/tile-bg.png";

/**
 * Figma fills the short tiles with the pattern rotated 90° and cropped
 * (imageTransform). These CSS matrices map the 3000×2000 image onto the 632×248 tile.
 */
const SHORT_TILE_BG = [
  "matrix(0, -0.442876, 0.44288, 0, -0.108, 854.26)",
  "matrix(0, -0.315999, 0.3865, 0, 0, 598)",
];

function Browse({ href, label, className, delay }: { href: string; label: string; className: string; delay: number }) {
  return (
    <Link
      href={href}
      aria-label={`Browse ${label}`}
      style={piece("bottom", delay)}
      className={`piece group absolute flex items-center gap-4 font-lexend-deca text-[24px] font-medium uppercase leading-normal tracking-[1px] text-dragon ${className}`}
    >
      Browse
      <Image
        src="/icons/arrow-circle-right.svg"
        alt=""
        width={48}
        height={48}
        className="transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}

function TileArt({ tile, delay }: { tile: OfficeTile; delay: number }) {
  const { art } = tile;
  return (
    <Image
      src={art.src}
      alt={`Redragon office ${tile.label.toLowerCase()}`}
      width={art.width}
      height={art.height}
      className="piece card-art pointer-events-none absolute max-w-none"
      style={{ left: art.left, top: art.top, width: art.width / 2, height: art.height / 2, ...piece("right", delay) }}
    />
  );
}

/** One 632×248 tile (Keyboards / Combo) */
function ShortTile({ tile, bg, delay }: { tile: OfficeTile; bg: string; delay: number }) {
  return (
    <div className="group/card relative h-[248px] w-[632px] overflow-clip border border-black">
      {/* Wrapped: the pattern's own transform would clash with the entrance */}
      <div className="piece absolute inset-0" style={piece("bottom", delay)}>
        <Image
          src={TILE_BG}
          alt=""
          width={3000}
          height={2000}
          className="absolute left-0 top-0 h-[2000px] w-[3000px] max-w-none origin-top-left opacity-60"
          style={{ transform: bg }}
        />
      </div>
      <p
        aria-hidden
        className="piece absolute left-[-10px] top-0 font-gotham text-[120px] font-black leading-[1.2] whitespace-nowrap text-[#b6b6b6]/50"
        style={piece("left", delay + 100)}
      >
        {tile.ghost}
      </p>
      <h3
        className="piece absolute left-10 top-12 font-lexend-deca text-[40px] font-medium leading-[1.2] whitespace-nowrap text-ink"
        style={piece("bottom", delay + 250)}
      >
        {tile.label}
      </h3>
      {!tile.artOnTop && <TileArt tile={tile} delay={delay + 200} />}
      <Browse href={`/office/${tile.slug}`} label={tile.label} className="left-10 top-44" delay={delay + 320} />
      {tile.artOnTop && <TileArt tile={tile} delay={delay + 200} />}
    </div>
  );
}

/** 394×208 mobile tile – the pattern is turned 180° on every tile after the first. */
function MobileTile({ tile, flip, delay }: { tile: OfficeTile; flip: boolean; delay: number }) {
  // API: dynamic data – office category tile image, mobile (via props)
  const art = tile.mobileArt;
  return (
    <li className="group/card relative h-[208px] overflow-clip border border-[#696969]">
      <div className={`piece absolute inset-0 bg-white ${flip ? "-scale-100" : ""}`} style={piece("bottom", delay)}>
        <Image
          src="/images/home/office-pattern-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_9.3%] opacity-40"
        />
      </div>
      <p
        aria-hidden
        className="piece absolute left-[-9px] top-[23px] font-gotham text-[88px] font-black leading-[1.2] tracking-[-0.88px] whitespace-nowrap text-[#bababa]"
        style={piece("left", delay + 100)}
      >
        {tile.ghost === "Mice" ? "MICE" : tile.ghost}
      </p>
      {art && (
        <ArtImage
          art={{ ...art, alt: `Redragon office ${tile.label.toLowerCase()}`, sizes: "50vw" }}
          className="piece card-art"
          style={piece("right", delay + 200)}
        />
      )}
      <h3
        className="piece absolute left-4 top-16 font-lexend-deca text-[20px] font-medium leading-[1.2] text-ink"
        style={piece("bottom", delay + 250)}
      >
        {tile.label}
      </h3>
      <Link
        href={`/office/${tile.slug}`}
        aria-label={`Browse ${tile.label}`}
        style={piece("bottom", delay + 320)}
        className="piece group absolute left-4 top-[144px] flex items-center gap-4 font-lexend-deca text-[20px] font-medium uppercase leading-[1.25] tracking-[1px] text-dragon"
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
    </li>
  );
}

// API: dynamic data – office category tiles (via props)
/**
 * Figma "Desktop - 8" (Office landing page) – one tall + two short category tiles (1440×800). Like the gaming
 * category tiles, they assemble when scrolled into view and their art zooms on hover.
 */
export default function OfficeCategoryGrid({ tall, short }: { tall: OfficeTile; short: [OfficeTile, OfficeTile] }) {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mobile-frame pt-16 lg:hidden">
        <CenteredHeading compact title="Office Category" subtitle="Which gear type are you looking for?" />
        <RevealOnView className="mt-[29px]">
          <ul>
            {[tall, ...short].map((tile, i) => (
              <MobileTile key={tile.slug} tile={tile} flip={i > 0} delay={i * 100} />
            ))}
          </ul>
        </RevealOnView>
      </div>

      <div className="page-frame relative hidden h-[800px] lg:block">
        <CenteredHeading
          title="Office Category"
          subtitle="Which gear type are you looking for?"
          className="absolute left-1/2 top-20 -translate-x-1/2"
        />

        <RevealOnView className="absolute left-20 top-[208px] flex gap-4">
          {/* Tall tile (632×512) */}
          <div className="group/card relative h-[512px] w-[632px] overflow-clip border border-black">
            <div className="piece absolute inset-0" style={piece("bottom", 0)}>
              <Image src={TILE_BG} alt="" fill sizes="632px" className="object-cover opacity-60" />
            </div>
            <p
              aria-hidden
              className="piece absolute left-[-18px] top-10 font-gotham text-[152px] font-black leading-[1.2] whitespace-nowrap text-[#b6b6b6]/50"
              style={piece("left", 100)}
            >
              {tall.ghost}
            </p>
            <h3
              className="piece absolute left-[38px] top-[107px] font-lexend-deca text-[40px] font-medium leading-[1.2] whitespace-nowrap text-ink"
              style={piece("bottom", 250)}
            >
              {tall.label}
            </h3>
            <TileArt tile={tall} delay={200} />
            <Browse href={`/office/${tall.slug}`} label={tall.label} className="left-[38px] top-[408px]" delay={320} />
          </div>

          <div className="flex flex-col gap-4">
            {short.map((tile, i) => (
              <ShortTile key={tile.slug} tile={tile} bg={SHORT_TILE_BG[i]} delay={(i + 1) * 120} />
            ))}
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
