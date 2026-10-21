import Image from "next/image";

type GamingHeroProps = {
  title: [string, string];
  description: string;
  image: string;
};

// API: dynamic data – gaming banner content (via props)
/**
 * Figma "Hero Section 2" (Gaming Landing page) – blurred set-up backdrop and the
 * "Gaming Product" display title. A single banner, 688px tall below the header.
 */
export default function GamingHero({ title, description, image }: GamingHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(90deg,#454344_0%,#727071_78.646%)] lg:bg-silver">
      {/* Backdrop: height-fitted, left-aligned, 4.5px blur (Figma "image 68") */}
      <div aria-hidden className="absolute inset-0 mix-blend-multiply lg:mix-blend-normal lg:blur-[4.5px]">
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          preload
          className="object-cover object-[59.5%_center] lg:object-left"
        />
      </div>

      {/* Mobile – Figma "Game Product" screen 1 (394×800 incl. 96px header) */}
      <div className="mobile-frame relative flex h-[704px] flex-col items-center px-4 pt-[159px] text-center text-white lg:hidden">
        {/* 64px on a 390px frame, shrinking on narrower phones so "Products" stays on one line */}
        <h1 className="font-audiowide text-[min(64px,17cqw)] leading-[1.2]">
          {title[0]}
          <br />
          <span className="text-dragon">{title[1]}</span>
        </h1>
        <p className="mt-4 max-w-[358px] font-lexend-deca text-[16px] font-medium leading-6">{description}</p>
      </div>

      <div className="page-frame relative hidden h-[688px] text-white lg:block">
        <h1 className="absolute left-1/2 top-[228px] -translate-x-1/2 font-audiowide text-[112px] leading-[1.2] whitespace-nowrap">
          {title[0]} <span className="text-dragon">{title[1]}</span>
        </h1>
        <p className="absolute left-[705px] top-[370px] w-[766px] -translate-x-1/2 text-center font-lexend-deca text-[20px] font-medium leading-[1.5]">
          {description}
        </p>
      </div>
    </section>
  );
}
