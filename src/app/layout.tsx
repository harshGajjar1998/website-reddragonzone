import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/layout/ScrollReveal";
import ChromeProvider from "@/components/layout/ChromeProvider";
import CmsSection from "@/components/cms/CmsSection";
import CmsPreviewBridge from "@/components/cms/CmsPreviewBridge";
import { isCmsPreview } from "@/lib/cms/api";
import { getContent } from "@/lib/cms";

/** Site title and description from the CMS (Settings & SEO); pages override them. */
export async function generateMetadata(): Promise<Metadata> {
  const { seo, siteUrl } = await getContent();
  return { metadataBase: new URL(siteUrl), title: seo.title, description: seo.description };
}

/** Scale factor for the 1440px desktop canvas (used by the `zoom` rule in globals.css). Runs before first paint. */
const desktopZoom = `(function(){var d=document.documentElement;function f(){d.style.setProperty("--desktop-zoom",Math.min(1,d.clientWidth/1440))}f();new ResizeObserver(f).observe(d)})()`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { chrome } = await getContent();
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: desktopZoom }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ChromeProvider value={chrome}>
          <Header />
          <main className="flex-1">{children}</main>
          <CmsSection ids={["type:footer"]}>
            <Footer />
          </CmsSection>
          <ScrollReveal />
          {isCmsPreview() && <CmsPreviewBridge adminOrigin={process.env.CMS_ADMIN_ORIGIN ?? "http://localhost:5174"} />}
        </ChromeProvider>
      </body>
    </html>
  );
}
