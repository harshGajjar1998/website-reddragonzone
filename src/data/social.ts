/** Community wall (CMS "Community wall" settings + "Social posts"), Figma "Social wall / Community gallery". */

export type SocialPlatform = "Instagram" | "TikTok" | "YouTube";

export type SocialPost = {
  cmsId: number;
  platform: SocialPlatform;
  /** The post on its platform (opens in a new tab) */
  url: string;
  title: string;
  caption: string;
  /** Upright 9:16 cover, self-hosted */
  thumbnail: { src: string; width: number; height: number; alt: string };
  /** Optional self-hosted MP4: plays on the site itself */
  video?: string;
};

export type SocialHeading = { eyebrow: string; title: string; intro: string };

export type SocialWall = SocialHeading & {
  profiles: { platform: SocialPlatform; url: string }[];
  posts: SocialPost[];
  showOnGaming: boolean;
  showOnOffice: boolean;
};
