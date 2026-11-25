import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsSection, { entryIds } from "@/components/cms/CmsSection";
import Image from "next/image";
import { Suspense } from "react";
import CenteredHeading from "@/components/gaming/CenteredHeading";
import CommunitySection from "@/components/home/CommunitySection";
import ContactForm, { ContactFormFromUrl } from "@/components/pages/ContactForm";
import FaqList from "@/components/pages/FaqList";
import ContactLinks from "@/components/layout/ContactLinks";
import { getContent } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/contact-us/", { title: "Contact Us | Redragon", description: "Get in touch with Redragon – product support, warranty, partnerships and press enquiries." });
}

/** Figma "Contact us" */
export default async function ContactPage() {
  const { pages, chrome } = await getContent();
  const { faqs, enquiryTypes, copy } = pages;
  const c = copy.contact;
  return (
    <>
      <CmsSection ids={["singleton:contact_page"]}>
      <section className="relative overflow-hidden">
        <Image src={c.heroImage} alt="" fill sizes="100vw" preload className="object-cover" />
        <div className="absolute inset-0 bg-black/16" />
        <div className="page-frame relative px-4 pt-14 pb-14 lg:h-[1010px] lg:p-0">
          <h1 className="font-lexend-exa text-[40px] font-medium leading-[1.1] tracking-[-3px] text-white lg:absolute lg:left-[77px] lg:top-20 lg:text-[64px] lg:tracking-[-5.12px]">
            {c.title}
          </h1>
          <p className="mt-3 font-lexend-deca text-[18px] leading-[1.4] tracking-[0.54px] text-white/80 lg:absolute lg:left-20 lg:top-[166px] lg:mt-0 lg:text-[24px] lg:tracking-[0.72px]">
            {c.subtitle}
          </p>
          {/* The plain form is prerendered; the URL is only readable in the browser */}
          <Suspense fallback={<ContactForm enquiryTypes={enquiryTypes} />}>
            <ContactFormFromUrl enquiryTypes={enquiryTypes} />
          </Suspense>
        </div>
      </section>
      </CmsSection>

      {/* Phone and email from the CMS (Footer screen); the strip is left out when both are empty */}
      {(chrome.contact.phone || chrome.contact.email) && (
        <section className="bg-white">
          <div className="page-frame flex flex-col items-center gap-2 px-4 py-10 text-center lg:py-12">
            <p className="font-lexend-deca text-[18px] leading-[1.4] text-ink">Prefer to call or email?</p>
            <ContactLinks contact={chrome.contact} className="items-center font-archivo text-[15px] leading-[1.6] text-ink/75" />
          </div>
        </section>
      )}

      <CmsSection ids={["singleton:contact_page", ...entryIds(faqs)]}>
      <section className="bg-[#f6f6f6]">
        <div className="page-frame flex flex-col items-center pt-14 pb-14 lg:pt-20 lg:pb-20">
          <CenteredHeading title={c.faqTitle} subtitle={c.faqSubtitle} />
          <div className="mt-10 w-full px-4 lg:mt-14 lg:w-auto lg:px-0">
            {/* API: dynamic data – FAQs */}
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>
      </CmsSection>

      <CmsSection ids={["shared:community"]}>
        <CommunitySection />
      </CmsSection>
    </>
  );
}
