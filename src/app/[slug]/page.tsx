import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TextPage from "@/components/pages/TextPage";
import { getContent } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

const textPage = async (slug: string) =>
  (await getContent()).textPages.find((p) => p.slug === slug);

export const dynamicParams = false;

export async function generateStaticParams() {
  // A static export needs at least one path; "_" is never linked and renders the 404 page.
  const slugs = (await getContent()).textPages.map((p) => ({ slug: p.slug }));
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const page = await textPage((await params).slug);
  if (!page) return {};
  return pageMetadata(`/${page.slug}/`, {
    title: `${page.title} | Redragon`,
    description: page.intro || undefined,
  });
}

/** Text pages from the CMS (Privacy Policy, Careers, Media Kit, …), linked from the footer navigation. */
export default async function TextPageRoute({ params }: PageProps<"/[slug]">) {
  const page = await textPage((await params).slug);
  if (!page) notFound();
  const { siteUrl } = await getContent();
  return (
    <>
      <JsonLd
        data={breadcrumbs(siteUrl, [
          { name: page.title, path: `/${page.slug}/` },
        ])}
      />
      <TextPage page={page} />
    </>
  );
}
