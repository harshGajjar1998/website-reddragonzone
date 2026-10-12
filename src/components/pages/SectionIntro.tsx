/** Red Lexend Giga eyebrow + 36px Lexend Exa title + 85px red rule (About page "section-header"). */
export default function SectionIntro({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-lexend-giga text-[24px] font-semibold leading-[1.2] text-crimson">{eyebrow}</p>
      <h2 className="font-lexend-exa text-[36px] font-semibold leading-[1.2] text-ink">{title}</h2>
      <span aria-hidden className="h-0.5 w-[85px] bg-crimson" />
    </div>
  );
}
