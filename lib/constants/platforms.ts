export const PLATFORMS = {
  twitter: {
    name: 'Twitter/X',
    icon: '𝕏',
    maxChars: 280,
    maxImages: 4,
    maxVideos: 1,
    color: '#000000',
    supports: ['text', 'images', 'videos', 'polls', 'threads'],
  },
  facebook: {
    name: 'Facebook',
    icon: 'f',
    maxChars: 63206,
    maxImages: 30,
    maxVideos: 1,
    color: '#1877F2',
    supports: ['text', 'images', 'videos', 'links'],
  },
  instagram: {
    name: 'Instagram',
    icon: '📷',
    maxChars: 2200,
    maxImages: 10, // carousel
    maxVideos: 1,
    color: '#E4405F',
    supports: ['images', 'videos', 'reels', 'stories', 'carousels'],
    requiresMedia: true,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'in',
    maxChars: 3000,
    maxImages: 20,
    maxVideos: 1,
    color: '#0A66C2',
    supports: ['text', 'images', 'videos', 'articles', 'polls'],
  },
  tiktok: {
    name: 'TikTok',
    icon: '♪',
    maxChars: 2200,
    maxVideos: 1,
    color: '#000000',
    supports: ['videos'],
    requiresMedia: true,
  },
} as const;

export type Platform = keyof typeof PLATFORMS;

export const PLATFORM_LIMITS = {
  twitter: {
    poll: { maxOptions: 4, maxOptionLength: 25 },
    thread: { maxTweets: 25 },
  },
  facebook: {
    story: { duration: 24 }, // hours
  },
  instagram: {
    story: { duration: 24 }, // hours
    reel: { maxDuration: 90 }, // seconds
  },
  linkedin: {
    poll: { maxOptions: 4, maxDuration: 14 }, // days
    article: { maxLength: 110000 },
  },
};

export function getPlatformCharLimit(platform: Platform): number {
  return PLATFORMS[platform].maxChars;
}

export function validatePostLength(content: string, platform: Platform): boolean {
  return content.length <= PLATFORMS[platform].maxChars;
}