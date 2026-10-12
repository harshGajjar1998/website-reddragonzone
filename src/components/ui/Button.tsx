import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "outline";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[4px] uppercase whitespace-nowrap transition-colors cursor-pointer";

const variants: Record<Variant, string> = {
  solid: "bg-crimson text-white hover:bg-[#c3151c]",
  // inset ring = Figma "inside" stroke, so the border adds no size
  outline: "shadow-[inset_0_0_0_1px_#000] text-ink hover:bg-black/5",
};

type CommonProps = {
  variant?: Variant;
  /** Show the white chevron-right icon after the label */
  chevron?: boolean;
  className?: string;
  children: ReactNode;
};

function Content({ chevron, children }: Pick<CommonProps, "chevron" | "children">) {
  return (
    <>
      {children}
      {chevron && <Image src="/icons/chevron-right.svg" alt="" width={14} height={14} />}
    </>
  );
}

/** "crimson-btn" from the design system, rendered as a link. */
export function ButtonLink({
  variant = "solid",
  chevron,
  className = "",
  children,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      <Content chevron={chevron}>{children}</Content>
    </Link>
  );
}

/** "crimson-btn" from the design system, rendered as a button. */
export function Button({
  variant = "solid",
  chevron,
  className = "",
  children,
  ...props
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      <Content chevron={chevron}>{children}</Content>
    </button>
  );
}
