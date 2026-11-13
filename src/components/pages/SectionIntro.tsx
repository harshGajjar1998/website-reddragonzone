/** Red Lexend Giga eyebrow + 36px Lexend Exa title + 85px red rule (About page "section-header"). */
export default function SectionIntro({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-lexend-giga text-[14px] font-semibold leading-[1.4] text-crimson lg:text-[24px] lg:leading-[1.2]">{eyebrow}</p>
      <h2 className="font-lexend-exa text-[26px] font-semibold leading-[1.25] tracking-[-0.78px] text-ink lg:text-[36px] lg:leading-[1.2] lg:tracking-normal">{title}</h2>
      <span aria-hidden className="h-0.5 w-[85px] bg-crimson" />
    </div>
  );
}
