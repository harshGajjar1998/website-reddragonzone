import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found | Redragon" };

/** Figma "404 ERROR" – shown for every unknown URL (and notFound() calls). */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-black">
      <Image src="/images/pages/not-found/hero.png" alt="" fill sizes="100vw" preload className="object-cover" />
      <div className="page-frame relative h-[800px]">
        <h1 className="absolute left-1/2 top-[199px] -translate-x-1/2 text-center text-white">
          <span className="block font-lexend-exa text-[200px] font-extrabold leading-[1.1] tracking-[-12px]">404</span>
          <span className="mt-2 block whitespace-nowrap font-lexend-exa text-[64px] font-medium leading-[1.1] tracking-[-5.12px]">
            PAGE NOT FOUND
          </span>
        </h1>
        <Link
          href="/"
          className="absolute left-[409px] top-[521px] flex h-12 w-[622px] items-center justify-center rounded-[4px] bg-crimson font-lexend-deca text-[16px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-[#c3151c]"
        >
          Home
        </Link>
      </div>
    </section>
  );
}
