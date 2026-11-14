/* Schema.org objects for <JsonLd>. Paths are site paths with a trailing slash; siteUrl has none. */

const CONTEXT = "https://schema.org";
export const absUrl = (siteUrl: string, src: string) =>
  /^https?:\/\//.test(src)
    ? src
    : `${siteUrl}${src.startsWith("/") ? "" : "/"}${src}`;

/** "October 19, 2026" or "2026-10-19" → "2026-10-19"; undefined when it isn't a date */
const isoDate = (d?: string) => {
  const t = d
    ? Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : `${d} UTC`)
    : NaN;
  return Number.isNaN(t) ? undefined : new Date(t).toISOString().slice(0, 10);
};

/** Social profiles must point at a profile, not a network's home page ("https://x.com/" placeholders are dropped). */
const isProfile = (href: string) => {
  try {
    return new URL(href).pathname.replace(/\/+$/, "").length > 0;
  } catch {
    return false;
  }
};

export function organization(siteUrl: string, logo: string, socialLinks: string[]) {
  const sameAs = socialLinks.filter(isProfile);
  return [
    {
      "@context": CONTEXT,
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Redragon",
      url: `${siteUrl}/`,
      logo: absUrl(siteUrl, logo),
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      "@context": CONTEXT,
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Redragon",
      url: `${siteUrl}/`,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ];
}

/** Home → … → this page. `trail` excludes Home. */
export function breadcrumbs(
  siteUrl: string,
  trail: { name: string; path: string }[],
) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteUrl}${c.path}`,
    })),
  };
}

export function article(
  siteUrl: string,
  a: {
    path: string;
    title: string;
    description?: string;
    image?: string;
    date?: string;
    author?: string;
  },
) {
  const published = isoDate(a.date);
  return {
    "@context": CONTEXT,
    "@type": "Article",
    headline: a.title.slice(0, 110),
    ...(a.description ? { description: a.description } : {}),
    ...(a.image ? { image: [absUrl(siteUrl, a.image)] } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(a.author
      ? { author: { "@type": "Person", name: a.author } }
      : { author: { "@id": `${siteUrl}/#organization` } }),
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: `${siteUrl}${a.path}`,
  };
}

export function faqPage(faqs: { q: string; a: string[] }[]) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.join("\n\n") },
    })),
  };
}
