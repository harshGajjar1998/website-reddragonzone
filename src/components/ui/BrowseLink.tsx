import Image from "next/image";
import Link from "next/link";

type BrowseLinkProps = {
  href: string;
  label?: string;
  /** lg: 24px label + 48px circled arrow, sm: 16px label + plain arrow */
  size?: "lg" | "sm";
  className?: string;
};

export default function BrowseLink({
  href,
  label = "Browse",
  size = "lg",
  className = "",
}: BrowseLinkProps) {
  if (size === "sm") {
    return (
      <Link
        href={href}
        className={`group inline-flex items-center gap-4 font-lexend-deca text-[16px] font-medium uppercase leading-normal text-dragon ${className}`}
      >
        {label}
        {/* SVG includes a 1.5px stroke bleed around the 22.4×16.8 arrow */}
        <Image
          src="/icons/arrow-right.svg"
          alt=""
          width={25.4}
          height={19.8}
          className="-m-[1.5px] transition-transform group-hover:translate-x-1"
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-4 font-lexend-deca text-[24px] font-medium uppercase leading-normal text-dragon ${className}`}
    >
      {label}
      <Image
        src="/icons/arrow-circle-right.svg"
        alt=""
        width={48}
        height={48}
        className="transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}
