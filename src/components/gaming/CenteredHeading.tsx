type CenteredHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

/**
 * Gaming section heading: red Lexend Giga 40 title with a dark Lexend Exa 22
 * line tucked 2px under it ("Gaming Category", "The Latest", "FEATURED PRODUCTS").
 */
export default function CenteredHeading({ title, subtitle, className = "" }: CenteredHeadingProps) {
  return (
    <div className={`flex flex-col items-center text-center whitespace-nowrap ${className}`}>
      <h2 className="font-lexend-giga text-[40px] font-bold leading-none tracking-[-3.2px] text-[rgba(230,0,18,0.8)]">
        {title}
      </h2>
      {subtitle && (
        <p className="-mt-0.5 font-lexend-exa text-[22px] font-semibold leading-[1.2] text-ink">{subtitle}</p>
      )}
    </div>
  );
}
