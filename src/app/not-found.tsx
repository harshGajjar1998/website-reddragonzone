import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found | Redragon" };

/** Figma "404 ERROR" – shown for every unknown URL (and notFound() calls). */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-black">
      <Image src="/images/pages/not-found/hero.png" alt="" fill sizes="100vw" preload className="object-cover" />
      <div className="page-frame relative flex h-[600px] flex-col items-center justify-center gap-10 px-4 lg:block lg:h-[800px] lg:px-0">
        <h1 className="text-center text-white lg:absolute lg:left-1/2 lg:top-[199px] lg:-translate-x-1/2">
          <span className="block font-lexend-exa text-[120px] font-extrabold leading-[1.1] tracking-[-7px] lg:text-[200px] lg:tracking-[-12px]">
            404
          </span>
          <span className="mt-2 block whitespace-nowrap font-lexend-exa text-[32px] font-medium leading-[1.1] tracking-[-2px] lg:text-[64px] lg:tracking-[-5.12px]">
            PAGE NOT FOUND
          </span>
        </h1>
        <Link
          href="/"
          className="flex h-12 w-full max-w-[622px] items-center justify-center lg:absolute lg:left-[409px] lg:top-[521px] lg:w-[622px] rounded-[4px] bg-crimson font-lexend-deca text-[16px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c]"
        >
          Home
        </Link>
      </div>
    </section>
  );
}
