import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "@/components/pages/LandingPage";
import TextPage from "@/components/pages/TextPage";
import { getContent } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

/** Text pages and landing pages share the top-level web addresses (the CMS keeps their slugs unique across both). */
const findPage = async (slug: string) => {
  const { textPages, landingPages } = await getContent();
  const landing = landingPages.find((p) => p.slug === slug);
  if (landing) return { kind: "landing" as const, landing };
  const text = textPages.find((p) => p.slug === slug);
  return text ? { kind: "text" as const, text } : null;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  // A static export needs at least one path; "_" is never linked and renders the 404 page.
  const { textPages, landingPages } = await getContent();
  const slugs = [...textPages, ...landingPages].map((p) => ({ slug: p.slug }));
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const found = await findPage((await params).slug);
  if (!found) return {};
  if (found.kind === "landing") {
    const p = found.landing;
    const description = p.template === "promotion" ? p.hero.description : p.launch?.hero.description;
    return pageMetadata(`/${p.slug}/`, { title: `${p.title} | Redragon`, description: description || undefined });
  }
  const page = found.text;
  return pageMetadata(`/${page.slug}/`, {
    title: `${page.title} | Redragon`,
    description: page.intro || undefined,
  });
}

/** Text pages (Privacy Policy, Careers, Media Kit, …, linked from the footer) and landing pages (U7.5) from the CMS. */
export default async function TopLevelPage({ params }: PageProps<"/[slug]">) {
  const found = await findPage((await params).slug);
  if (!found) notFound();
  const { siteUrl } = await getContent();
  const page = found.kind === "landing" ? found.landing : found.text;
  return (
    <>
      <JsonLd
        data={breadcrumbs(siteUrl, [
          { name: page.title, path: `/${page.slug}/` },
        ])}
      />
      {found.kind === "landing" ? <LandingPage page={found.landing} /> : <TextPage page={found.text} />}
    </>
  );
}
