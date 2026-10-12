import Image from "next/image";

/** Office SPECIAL PAGE "Section 3" – full-bleed exploded-view artwork (labels are part of the image). */
export default function BlueprintSection({ src, alt }: { src: string; alt: string }) {
  return (
    <section className="relative h-[800px] overflow-hidden bg-[#ebebeb]">
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
    </section>
  );
}
