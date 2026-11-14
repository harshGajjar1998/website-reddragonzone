/**
 * Schema.org structured data for search engines (node_modules/next/dist/docs/01-app/02-guides/json-ld.md).
 * `<` is escaped so CMS text can't close the script tag.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}
