import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import type { GamingProduct } from "@/data/gaming";
import { contactHref, supportSearchHref, whereToBuyHref } from "@/data/pages";

/**
 * Main product page actions: "Where to Buy" opens that page filtered to this product,
 * "Drivers & manuals" opens the Support Finder already showing it, and
 * "Contact support" opens the contact form with Product support selected.
 */
export default function ProductActions({
  product,
  dark,
  className = "",
}: {
  product: GamingProduct;
  /** Light text for the dark featured hero */
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}>
      {/* API: dynamic data – product slug and name in both links */}
      <ButtonLink
        href={whereToBuyHref(product)}
        className="h-[50px] w-full px-7 font-lexend-deca text-[16px] leading-5 font-semibold tracking-[1px] sm:w-auto"
      >
        Where to Buy
      </ButtonLink>
      <div className={`flex flex-col gap-1 font-lexend-deca text-[14px] leading-[18px] font-medium underline ${dark ? "text-white" : "text-crimson"}`}>
        <Link href={supportSearchHref(product.slug)}>Drivers &amp; manuals for this model</Link>
        <Link href={contactHref("Product support")}>Need help? Contact support</Link>
      </div>
    </div>
  );
}
