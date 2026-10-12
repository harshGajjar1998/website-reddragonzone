type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  className?: string;
};

/** Red eyebrow (Lexend Giga 24) + dark title (Lexend Exa 32). Gap defaults to 8px. */
export default function SectionHeading({ eyebrow, title, className = "gap-2" }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <p className="font-lexend-giga text-[24px] font-semibold leading-[1.2] whitespace-nowrap text-dragon">
        {eyebrow}
      </p>
      <h2 className="font-lexend-exa text-[32px] font-medium leading-[1.2] whitespace-nowrap text-ink">
        {title}
      </h2>
    </div>
  );
}
