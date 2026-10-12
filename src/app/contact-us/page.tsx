import type { Metadata } from "next";
import Image from "next/image";
import CenteredHeading from "@/components/gaming/CenteredHeading";
import CommunitySection from "@/components/home/CommunitySection";
import ContactForm from "@/components/pages/ContactForm";
import FaqList from "@/components/pages/FaqList";
import { faqs } from "@/data/pages";

export const metadata: Metadata = {
  title: "Contact Us | Redragon",
  description: "Get in touch with Redragon – product support, warranty, partnerships and press enquiries.",
};

/** Figma "Contact us" */
export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Image src="/images/pages/contact/hero.png" alt="" fill sizes="100vw" preload className="object-cover" />
        <div className="absolute inset-0 bg-black/16" />
        <div className="page-frame relative h-[1010px]">
          <h1 className="absolute left-[77px] top-20 font-lexend-exa text-[64px] font-medium leading-[1.1] tracking-[-5.12px] text-white">
            Get in touch
          </h1>
          <p className="absolute left-20 top-[166px] font-lexend-deca text-[24px] leading-[1.4] tracking-[0.72px] text-white/80">
            Would love to hear from you
          </p>
          <ContactForm />
        </div>
      </section>

      <section className="bg-[#f6f6f6]">
        <div className="page-frame flex flex-col items-center pt-20 pb-20">
          <CenteredHeading title="FAQS" subtitle="Frequently asked questions" />
          <div className="mt-14">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>

      <CommunitySection />
    </>
  );
}
