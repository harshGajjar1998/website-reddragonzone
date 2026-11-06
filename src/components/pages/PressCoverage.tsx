"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import RevealOnView from "@/components/ui/RevealOnView";
import { pressArticles, pressHref, type PressArticle } from "@/data/press";

const ALL = "all";
const ROW = 64;
/** A year counts as current once its first article passes this far down the viewport */
const SPY_LINE = 200;

// API: dynamic data – one rail entry per year that has articles
const years = [...new Set(pressArticles.map((a) => a.year))].sort((a, b) => b - a);
const railItems = [{ id: ALL, label: "All Years" }, ...years.map((y) => ({ id: String(y), label: String(y) }))];

const smooth = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

/** Figma "Article" card, 1064×216 on desktop; stacks on mobile. */
function ArticleCard({ article }: { article: PressArticle }) {
  return (
    <RevealOnView>
      <article className="enter-bottom relative flex flex-col gap-4 rounded-[10px] border border-[#d8dee1] bg-white p-3.5 transition-shadow hover:shadow-card-hover lg:h-[216px] lg:flex-row lg:gap-[18px]">
        {/* API: dynamic data – article image, kicker, headline, summary and date */}
        <Image
          src={article.image.src}
          alt=""
          width={article.image.width}
          height={article.image.height}
          sizes="(max-width: 1023px) 100vw, 276px"
          className="aspect-[276/188] w-full shrink-0 rounded-[7px] object-cover lg:h-[188px] lg:w-[276px]"
        />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <p className="font-lexend-deca text-[14px] leading-5 font-semibold text-ink">{article.kicker}</p>
          <h3 className="mt-2 font-lexend-deca text-[18px] leading-6 font-semibold text-ink lg:mt-[17px]">{article.title}</h3>
          <p className="mt-3 font-lexend-deca text-[13px] leading-[19px] text-[#626466] lg:w-[670px]">{article.excerpt}</p>
          <div className="mt-4 flex items-center justify-between gap-3 lg:absolute lg:top-[157px] lg:mt-0 lg:w-[674px]">
            <p className="font-lexend-deca text-[12px] leading-[18px] font-medium text-[#626466]">{article.date}</p>
            <Link
              href={pressHref(article.slug)}
              className="flex items-center gap-1 font-lexend-deca text-[13px] leading-[19px] font-semibold text-crimson after:absolute after:inset-0 hover:underline"
            >
              Read article
              <Image src="/images/pages/where-to-buy/icon-external.svg" alt="" width={20} height={20} />
              <span className="sr-only">: {article.title}</span>
            </Link>
          </div>
        </div>
      </article>
    </RevealOnView>
  );
}

/** Figma "Year filter": the dot glides between years as the list scrolls. */
function YearRail({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const index = railItems.findIndex((item) => item.id === active);
  return (
    <nav aria-label="Articles by year" className="sticky top-[46px] mt-[22px] hidden h-fit w-[136px] shrink-0 lg:block">
      <div className="relative">
        <span aria-hidden className="absolute top-[14px] left-2 w-0.5 bg-[#d8dee1]" style={{ height: (railItems.length - 1) * ROW + 2 }} />
        <span
          aria-hidden
          className="absolute top-[7px] left-0.5 z-10 size-3.5 rounded-full bg-crimson transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateY(${index * ROW}px)` }}
        />
        <ul className="flex flex-col gap-[42px]">
          {railItems.map((item) => {
            const on = item.id === active;
            return (
              <li key={item.id} className="relative h-[22px]">
                <span aria-hidden className="absolute top-[7px] left-[3px] size-3 rounded-full border-[1.5px] border-[#9ba3af] bg-white" />
                <button
                  type="button"
                  aria-current={on ? "true" : undefined}
                  onClick={() => onSelect(item.id)}
                  className={`absolute left-8 cursor-pointer font-lexend-deca text-[14px] leading-[22px] whitespace-nowrap transition-colors duration-300 hover:text-crimson ${
                    on ? "font-semibold text-crimson" : "font-medium text-[#626466]"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/** Mobile version of the rail: a pinned strip of year chips. */
function YearChips({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const stripRef = useRef<HTMLDivElement>(null);

  // Keeps the current year in view as the page scrolls
  useEffect(() => {
    const strip = stripRef.current;
    const chip = strip?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!strip || !chip) return;
    strip.scrollTo({ left: chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2, behavior: smooth() });
  }, [active]);

  return (
    <div className="sticky top-0 z-10 -mx-4 mt-5 bg-[#fafafb] lg:hidden">
      <div
        ref={stripRef}
        className="relative flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {railItems.map((item) => {
          const on = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={on ? "true" : undefined}
              onClick={() => onSelect(item.id)}
              className={`h-9 shrink-0 cursor-pointer rounded-full border px-4 font-lexend-deca text-[14px] leading-[22px] whitespace-nowrap transition-colors duration-300 ${
                on ? "border-crimson bg-crimson font-semibold text-white" : "border-[#d8dee1] bg-white font-medium text-[#626466]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** "Latest Press Coverage": articles grouped by year, with a rail that follows the scroll. */
export default function PressCoverage() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(ALL);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const groups = [...(listRef.current?.children ?? [])] as HTMLElement[];
      if (groups.length === 0) return;
      // "All Years" until the list reaches its pinned position, then whichever year is at the line
      const pinned = parseFloat(getComputedStyle(groups[0]).scrollMarginTop) + 1;
      if (groups[0].getBoundingClientRect().top > pinned) return setActive(ALL);
      const line = Math.max(SPY_LINE, pinned);
      const current = groups.filter((group) => group.getBoundingClientRect().top <= line).at(-1);
      setActive(current?.dataset.year ?? ALL);
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (id: string) => {
    const target = id === ALL ? sectionRef.current : listRef.current?.querySelector(`[data-year="${id}"]`);
    target?.scrollIntoView({ behavior: smooth(), block: "start" });
  };

  return (
    <section ref={sectionRef} className="bg-[#fafafb]">
      <div className="page-frame px-4 pt-10 pb-10 lg:px-[120px] lg:pt-14 lg:pb-14">
        <h2 className="font-lexend-deca text-[28px] leading-9 font-semibold text-ink lg:text-[37px] lg:leading-[46px]">
          Latest Press Coverage
        </h2>
        <p className="mt-2 font-lexend-deca text-[15px] leading-[22px] text-[#626466] lg:mt-[11px]">
          Featured articles, reviews, and perspectives from the gaming community.
        </p>

        <YearChips active={active} onSelect={goTo} />

        <div className="flex lg:mt-[49px]">
          <YearRail active={active} onSelect={goTo} />
          <div ref={listRef} className="flex min-w-0 flex-1 flex-col gap-3.5">
            {years.map((year) => (
              <div key={year} data-year={year} className="flex scroll-mt-[60px] flex-col gap-3.5 lg:scroll-mt-6">
                {/* API: dynamic data – articles for this year */}
                {pressArticles
                  .filter((article) => article.year === year)
                  .map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
