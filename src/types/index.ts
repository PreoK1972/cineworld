export type ContentType = 'movie' | 'series' | 'animation';

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  overview: string;
  duration: string;
  thumbnail: string;
  embedUrl: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface DownloadOption {
  quality: '360p Data Saver' | '720p HD' | '1080p Full HD' | '4K Ultra HDR';
  resolution: string;
  fileSize: string;
  format: string;
  isVipOnly: boolean;
  downloadUrl: string;
  magnetUrl?: string;
  directSpeed: string;
}

export interface MovieItem {
  id: string;
  title: string;
  type: ContentType;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number; // e.g. 8.8
  voteCount: string;
  releaseYear: number;
  duration: string;
  quality: '4K' | '1080p' | 'HD';
  genres: string[];
  cast: string[];
  director?: string;
  trailerYoutubeId: string;
  embedServers: {
    name: string;
    serverLocation: string;
    quality: string;
    embedUrl: string;
  }[];
  seasons?: Season[];
  downloadOptions: DownloadOption[];
  tmdbId?: string;
  featured?: boolean;
  trending?: boolean;
  topRated?: boolean;
  spotlightAfrica?: boolean;
}

export type SubscriptionPlan = 'free' | 'vip_daily' | 'vip_weekly' | 'vip_monthly' | 'vip_mkw2000';

export interface UserSubscription {
  plan: SubscriptionPlan;
  activeUntil: string | null; // ISO string
  isVip: boolean;
  downloadLimitPerDay: number;
  adsEnabled: boolean;
}

export interface CPMStats {
  monthlyVisitors: number;
  averagePageViews: number;
  globalTier1Percentage: number; // e.g., 40%
  tier1CPM: number; // e.g., $9.50
  tier3CPM: number; // e.g., $2.00
  subscribersCount: number;
}
