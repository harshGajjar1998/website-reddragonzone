type CenteredHeadingProps = {
  title: string;
  subtitle?: string;
  /** Mobile scale (Figma mobile frames): 32px title, wrapping 18px subtitle */
  compact?: boolean;
  className?: string;
};

/**
 * Gaming section heading: red Lexend Giga 40 title with a dark Lexend Exa 22
 * line tucked 2px under it ("Gaming Category", "The Latest", "FEATURED PRODUCTS").
 */
export default function CenteredHeading({ title, subtitle, compact, className = "" }: CenteredHeadingProps) {
  if (compact) {
    return (
      <div className={`flex flex-col items-center px-4 text-center ${className}`}>
        <h2 className="max-w-[358px] font-lexend-giga text-[32px] font-bold leading-[1.1] tracking-[-2.56px] text-[rgba(230,0,18,0.8)]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 max-w-[358px] font-lexend-exa text-[18px] font-semibold leading-[22px] text-ink">{subtitle}</p>
        )}
      </div>
    );
  }

  // Below lg (pages without a dedicated mobile layout) it falls back to the compact scale
  return (
    <div className={`flex flex-col items-center px-4 text-center lg:px-0 lg:whitespace-nowrap ${className}`}>
      <h2 className="font-lexend-giga text-[32px] font-bold leading-[1.1] tracking-[-2.56px] text-[rgba(230,0,18,0.8)] lg:text-[40px] lg:leading-none lg:tracking-[-3.2px]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 font-lexend-exa text-[18px] font-semibold leading-[22px] text-ink lg:-mt-0.5 lg:text-[22px] lg:leading-[1.2]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
