import type { SocialPlatform } from "@/data/social";

type P = { className?: string };

export function InstagramIcon({ className = "size-5" }: P) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3.2" y="3.2" width="13.6" height="13.6" rx="4" />
      <circle cx="10" cy="10" r="3.1" />
      <circle cx="14.3" cy="5.9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className = "size-5" }: P) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="currentColor" aria-hidden>
      <path d="M13.3 2.4c.3 1.9 1.5 3.3 3.3 3.5v2.6a6 6 0 0 1-3.3-1v5.1a4.6 4.6 0 1 1-4.6-4.6c.3 0 .5 0 .8.1v2.7a2 2 0 1 0 1.2 1.8V2.4h2.6Z" />
    </svg>
  );
}

export function YouTubeIcon({ className = "size-5" }: P) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden>
      <rect x="1.9" y="4.5" width="16.2" height="10.9" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 7.2v5.6l4.6-2.8-4.6-2.8Z" fill="currentColor" />
    </svg>
  );
}

export function PlatformIcon({ platform, className }: P & { platform: SocialPlatform }) {
  if (platform === "Instagram") return <InstagramIcon className={className} />;
  if (platform === "TikTok") return <TikTokIcon className={className} />;
  return <YouTubeIcon className={className} />;
}

export function PlayIcon({ className = "h-4 w-3" }: P) {
  return (
    <svg viewBox="0 0 12 16" className={className} fill="currentColor" aria-hidden>
      <path d="M0 0v16l12-8L0 0Z" />
    </svg>
  );
}

export function Chevron({ dir, className = "h-3.5 w-[7px]" }: P & { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 7 14" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d={dir === "right" ? "M1 1l5 6-5 6" : "M6 1L1 7l5 6"} />
    </svg>
  );
}

export function ExternalIcon({ className = "size-3" }: P) {
  return (
    <svg viewBox="0 0 12 13" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 1.5H1v10h10v-4M7.5 1H11v3.5M11 1 5.5 6.5" />
    </svg>
  );
}
