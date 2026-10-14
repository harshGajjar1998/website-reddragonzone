import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { cq } from "@/lib/mobile";

type MobileProductHeroProps = {
  eyebrow: string;
  title: ReactNode;
  /** h1 on the page's first hero, h2 elsewhere */
  as?: "h1" | "h2";
  description: string;
  href: string;
  /** Vertical outlined model name beside the render */
  model: string;
  image: { src: string; alt: string };
  thumbnails: { src: string; alt: string }[];
  priority?: boolean;
};

/**
 * Mobile product hero – Figma "Home Mobile version" screen 1 (390×800 incl. 96px header):
 * copy + button, then the outlined model name, a cropped square render and three thumbnails.
 * Shared by the home carousel and the gaming featured-product page.
 */
export default function MobileProductHero({
  eyebrow,
  title,
  as: Title = "h2",
  description,
  href,
  model,
  image,
  thumbnails,
  priority,
}: MobileProductHeroProps) {
  return (
    <div className="mobile-frame pb-2 lg:hidden">
      <div className="flex flex-col items-start px-4 pt-10 text-white">
        <p className="font-lexend text-[16px] leading-5 text-white/80">{eyebrow}</p>
        <Title className="mt-2 font-lexend-deca text-[32px] font-black leading-[1.2]">{title}</Title>
        <p className="mt-4 font-lato text-[16px] font-light leading-6 text-white/80">{description}</p>
        <ButtonLink href={href} chevron className="mt-6 h-10 px-5 font-lato text-[14px] font-bold leading-normal">
          More details
        </ButtonLink>
      </div>

      <div className="relative mt-[17px]" style={{ height: cq(359) }}>
        <div
          className="absolute flex items-center justify-center"
          style={{ left: cq(69), top: cq(48), width: cq(73), height: cq(250) }}
        >
          <p
            aria-hidden
            className="-rotate-90 font-lato font-bold leading-none whitespace-nowrap text-outline-white"
            style={{ fontSize: cq(93) }}
          >
            {model}
          </p>
        </div>
        <div
          className="absolute overflow-hidden drop-hero-main"
          style={{ left: cq(84), top: 0, width: cq(209), height: cq(359) }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={1600}
            height={1600}
            preload={priority}
            draggable={false}
            className="absolute left-0 top-0 h-full w-[171.5%] max-w-none"
          />
        </div>
        <ul className="absolute flex flex-col" style={{ left: cq(278), top: cq(31), width: cq(96) }}>
          {thumbnails.map((t) => (
            <li key={t.src} className="relative aspect-square w-full drop-thumb">
              <Image src={t.src} alt={t.alt} fill sizes="25vw" draggable={false} className="object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
