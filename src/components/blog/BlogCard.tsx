import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";

export function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-4">
      <span className="rounded-[2px] bg-[#111] px-2 py-1 font-lexend text-[14px] leading-[1.5] text-white">
        {post.category}
      </span>
      <span className="font-lexend text-[14px] leading-[1.5] text-[#111]">{post.readTime}</span>
    </div>
  );
}

/** Outlined "Discover more ›" button (Figma "Button") */
export function DiscoverMore({ href, rounded = 2 }: { href: string; rounded?: 2 | 4 }) {
  return (
    <Link
      href={href}
      className={`inline-flex w-fit items-center gap-1 border border-[#111] px-4 py-2 font-lexend text-[16px] leading-[1.5] text-[#111] transition-colors hover:bg-[#111] hover:text-white ${
        rounded === 4 ? "rounded-[4px]" : "rounded-[2px]"
      } group`}
    >
      Discover more
      <Image
        src="/icons/pages/btn-chevron.svg"
        alt=""
        width={16}
        height={16}
        className="transition group-hover:invert"
      />
    </Link>
  );
}

/** 416px blog card – 300px image + tag, title, excerpt and button. */
export default function BlogCard({ post }: { post: BlogPost }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="flex w-[416px] flex-col overflow-hidden rounded-[6px] bg-white outline outline-1 outline-[#111]/10">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="relative block h-[300px] w-full shrink-0 overflow-hidden shadow-[inset_0_-1px_0_rgb(17_17_17/0.1)]"
        style={{ background: post.image.bg }}
      >
        <Image
          src={post.image.src}
          alt=""
          fill
          sizes="416px"
          className="object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4">
          <PostMeta post={post} />
          <div className="flex flex-col gap-2">
            <h3 className="font-lexend-deca text-[24px] leading-[1.39] text-[#111]">
              <Link href={href} className="hover:text-dragon">
                {post.title}
              </Link>
            </h3>
            <p className="font-lexend text-[16px] leading-[1.5] text-[#111]/60">{post.excerpt}</p>
          </div>
        </div>
        <DiscoverMore href={href} />
      </div>
    </article>
  );
}
