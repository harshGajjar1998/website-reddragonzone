import Image from "next/image";
import type { TextPage as TextPageData } from "@/lib/cms";

const bodyText = "font-merriweather text-[16px] font-bold leading-[1.5]";

/** CMS text page (Privacy Policy, Careers, …) in the blog article's text style, without photo or author. */
export default function TextPage({ page }: { page: TextPageData }) {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden py-12 lg:py-24">
        <Image
          src="/images/pages/blog/detail-grid.png"
          alt=""
          width={2160}
          height={1326}
          className="pointer-events-none absolute left-1/2 top-0 h-[884px] w-[1440px] max-w-none -translate-x-1/2"
        />

        <article className="relative mx-auto flex w-full flex-col gap-8 px-4 lg:w-[688px] lg:gap-12 lg:px-0">
          <header className="flex flex-col gap-6">
            {page.updated && (
              <p className="font-lexend-deca text-[12px] font-bold leading-[1.25] tracking-[-0.32px] text-black/50 lg:text-[16px]">
                Last updated {page.updated}
              </p>
            )}
            <h1 className="font-lexend-deca text-[32px] leading-[1.1] text-black lg:text-[50px] lg:leading-[1.05]">
              {page.title}
            </h1>
          </header>

          {/* API: dynamic data – CMS text page */}
          <div className="flex flex-col gap-8">
            {page.intro && (
              <p className={`${bodyText} text-black`}>{page.intro}</p>
            )}
            {page.sections.map((s, i) => (
              <section key={i} className="flex flex-col gap-4">
                {s.heading && (
                  <h2 className="font-lexend-deca text-[22px] leading-[1.25] text-black lg:text-[28px]">
                    {s.heading}
                  </h2>
                )}
                {s.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className={`${bodyText} whitespace-pre-line text-black/60`}
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
