/** Free "Text block" section from the CMS homepage editor: a headline and a paragraph. */
export default function TextBlock({ title, body }: { title: string; body: string }) {
  return (
    <section className="bg-silver">
      <div className="page-frame flex flex-col items-center gap-6 px-4 py-14 text-center lg:px-[120px] lg:py-20">
        <h2 className="font-lexend-exa text-[28px] font-medium leading-[1.2] text-ink lg:text-[32px]">{title}</h2>
        <p className="max-w-[720px] whitespace-pre-line font-lexend-deca text-[16px] font-light leading-[1.6] tracking-[0.48px] text-ink/80">
          {body}
        </p>
      </div>
    </section>
  );
}
