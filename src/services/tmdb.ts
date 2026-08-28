import { MovieItem, DownloadOption } from '@/types';

// Multi-API Support: TMDB, TVMaze (Free/No-Key), Jikan/Anime (Free/No-Key)
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '4f298a53e5522830c82ff1bb86537a52';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Universal embed generators for any movie or TV series across 5 streaming mirrors
export function getEmbedServers(
  id: string | number, 
  type: 'movie' | 'series' | 'animation', 
  season: number = 1, 
  episode: number = 1
) {
  const idStr = String(id).replace(/[^0-9]/g, '') || '1399'; // fallback id if alphanumeric
  const isTV = type === 'series' || type === 'animation';

  if (isTV) {
    return [
      {
        name: 'Server 1 - VidSrc Multi-CDN (Ultra Fast)',
        serverLocation: 'Global Edge',
        quality: '4K / 1080p',
        embedUrl: `https://vidsrc.me/embed/tv?tmdb=${idStr}&season=${season}&episode=${episode}`,
      },
      {
        name: 'Server 2 - SuperEmbed Global',
        serverLocation: 'Europe',
        quality: '1080p HD',
        embedUrl: `https://superembed.stream/embed/tv/${idStr}/${season}/${episode}`,
      },
      {
        name: 'Server 3 - 2Embed Multi-Language',
        serverLocation: 'North America',
        quality: '1080p / 720p',
        embedUrl: `https://2embed.cc/embedtv/${idStr}&s=${season}&e=${episode}`,
      },
      {
        name: 'Server 4 - AutoEmbed HD',
        serverLocation: 'Asia / Africa Route',
        quality: '720p Low-Data Adaptive',
        embedUrl: `https://autoembed.to/tv/tmdb/${idStr}-${season}-${episode}`,
      },
    ];
  }

  return [
    {
      name: 'Server 1 - VidSrc Multi-CDN (Ultra Fast)',
      serverLocation: 'Global Edge',
      quality: '4K / 1080p',
      embedUrl: `https://vidsrc.me/embed/movie?tmdb=${idStr}`,
    },
    {
      name: 'Server 2 - SuperEmbed Global',
      serverLocation: 'Europe',
      quality: '1080p HD',
      embedUrl: `https://superembed.stream/embed/movie/${idStr}`,
    },
    {
      name: 'Server 3 - 2Embed Multi-Language',
      serverLocation: 'North America',
      quality: '1080p / 720p',
      embedUrl: `https://2embed.cc/embed/${idStr}`,
    },
    {
      name: 'Server 4 - AutoEmbed HD',
      serverLocation: 'Asia / Africa Route',
      quality: '720p Low-Data Adaptive',
      embedUrl: `https://autoembed.to/movie/tmdb/${idStr}`,
    },
  ];
}

export function getDownloadOptions(title: string, year: number): DownloadOption[] {
  const cleanTitle = encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
  return [
    {
      quality: '360p Data Saver',
      resolution: '640x360',
      fileSize: '320 MB',
      format: 'MP4 (Mobile Optimized)',
      isVipOnly: false,
      downloadUrl: `https://download.cineworld.internal/get?file=${cleanTitle}-${year}-360p.mp4`,
      directSpeed: 'High Speed Mobile Friendly',
    },
    {
      quality: '720p HD',
      resolution: '1280x720',
      fileSize: '890 MB',
      format: 'MP4 (x264 / AAC)',
      isVipOnly: false,
      downloadUrl: `https://download.cineworld.internal/get?file=${cleanTitle}-${year}-720p.mp4`,
      directSpeed: 'Fast Mirror',
    },
    {
      quality: '1080p Full HD',
      resolution: '1920x1080',
      fileSize: '2.3 GB',
      format: 'MKV (HEVC / 5.1 Surround)',
      isVipOnly: true,
      downloadUrl: `https://download.cineworld.internal/vip?file=${cleanTitle}-${year}-1080p.mkv`,
      magnetUrl: `magnet:?xt=urn:btih:${cleanTitle}${year}1080p`,
      directSpeed: 'VIP 10Gbps Direct CDN',
    },
    {
      quality: '4K Ultra HDR',
      resolution: '3840x2160',
      fileSize: '6.4 GB',
      format: 'MKV (Dolby Vision / Atmos)',
      isVipOnly: true,
      downloadUrl: `https://download.cineworld.internal/vip?file=${cleanTitle}-${year}-4k.mkv`,
      magnetUrl: `magnet:?xt=urn:btih:${cleanTitle}${year}4kultra`,
      directSpeed: 'VIP Turbo Gigabit Line',
    },
  ];
}

const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10765: 'Sci-Fi & Fantasy',
};

export function formatTMDBItem(raw: any, explicitType?: 'movie' | 'series' | 'animation'): MovieItem {
  const isTV = explicitType ? (explicitType === 'series' || explicitType === 'animation') : !!raw.first_air_date || raw.media_type === 'tv';
  const type: 'movie' | 'series' | 'animation' = explicitType || (raw.genre_ids?.includes(16) ? 'animation' : isTV ? 'series' : 'movie');

  const title = raw.title || raw.name || 'Untitled';
  const releaseDate = raw.release_date || raw.first_air_date || '2024-01-01';
  const releaseYear = new Date(releaseDate).getFullYear() || 2024;
  const rating = Number((raw.vote_average || 7.5).toFixed(1));
  const voteCount = raw.vote_count ? `${Math.round(raw.vote_count / 1000)}K` : '12K';

  const genres = raw.genre_ids?.map((id: number) => GENRE_MAP[id]).filter(Boolean) || ['Action', 'Drama'];
  if (genres.length === 0) genres.push('Cinema');

  const posterUrl = raw.poster_path
    ? `${IMAGE_BASE_URL}/w500${raw.poster_path}`
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop';

  const backdropUrl = raw.backdrop_path
    ? `${IMAGE_BASE_URL}/original${raw.backdrop_path}`
    : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop';

  return {
    id: `tmdb-${type}-${raw.id}`,
    title,
    type,
    overview: raw.overview || 'Stream and download in high definition on CineWorld.',
    posterUrl,
    backdropUrl,
    rating,
    voteCount,
    releaseYear,
    duration: isTV ? 'Full Series' : '2h 10m',
    quality: rating >= 8.0 ? '4K' : '1080p',
    genres,
    cast: ['Hollywood Cast', 'International Stars'],
    trailerYoutubeId: 'Way9Dexny3w',
    embedServers: getEmbedServers(raw.id, type),
    downloadOptions: getDownloadOptions(title, releaseYear),
    trending: (raw.popularity || 0) > 80,
    topRated: rating >= 8.0,
    spotlightAfrica: genres.includes('African Cinema'),
  };
}

// 1. TVMaze API (100% Free TV Series database with millions of shows)
export async function searchTVMaze(query: string): Promise<MovieItem[]> {
  try {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any) => {
      const show = item.show;
      const releaseYear = show.premiered ? new Date(show.premiered).getFullYear() : 2023;
      const poster = show.image?.original || show.image?.medium || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop';
      const cleanSummary = show.summary ? show.summary.replace(/<[^>]*>?/gm, '') : 'Stream all episodes on CineWorld.';
      const rating = show.rating?.average ? Number(show.rating.average.toFixed(1)) : 8.1;

      return {
        id: `tvmaze-${show.id}`,
        title: show.name,
        type: 'series' as const,
        overview: cleanSummary,
        posterUrl: poster,
        backdropUrl: poster,
        rating: rating,
        voteCount: '45K',
        releaseYear: releaseYear,
        duration: show.runtime ? `${show.runtime}m / ep` : 'Series',
        quality: '4K',
        genres: show.genres?.length > 0 ? show.genres : ['Drama', 'Series'],
        cast: ['Series Cast'],
        trailerYoutubeId: 'Way9Dexny3w',
        embedServers: getEmbedServers(show.externals?.thetvdb || show.id, 'series'),
        downloadOptions: getDownloadOptions(show.name, releaseYear),
        trending: true,
        topRated: rating >= 8.0,
      };
    });
  } catch (e) {
    console.error('TVMaze error', e);
    return [];
  }
}

// 2. Jikan Anime API (100% Free MyAnimeList database for all anime series & movies)
export async function searchJikanAnime(query: string): Promise<MovieItem[]> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map((anime: any) => {
      const releaseYear = anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 2024);
      const poster = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop';
      const rating = anime.score ? Number(anime.score.toFixed(1)) : 8.4;

      return {
        id: `anime-${anime.mal_id}`,
        title: anime.title_english || anime.title,
        type: 'animation' as const,
        overview: anime.synopsis || 'Stream full Japanese anime with English Sub & Dub on CineWorld.',
        posterUrl: poster,
        backdropUrl: poster,
        rating: rating,
        voteCount: anime.scored_by ? `${Math.round(anime.scored_by / 1000)}K` : '80K',
        releaseYear: releaseYear,
        duration: anime.episodes ? `${anime.episodes} Episodes` : 'Anime Series',
        quality: '4K',
        genres: anime.genres?.map((g: any) => g.name) || ['Animation', 'Action', 'Anime'],
        cast: ['Japanese Voice Cast'],
        trailerYoutubeId: anime.trailer?.youtube_id || 'k1w3Qf0k_aU',
        embedServers: getEmbedServers(anime.mal_id, 'animation'),
        downloadOptions: getDownloadOptions(anime.title_english || anime.title, releaseYear),
        trending: true,
        topRated: rating >= 8.5,
      };
    });
  } catch (e) {
    console.error('Jikan anime error', e);
    return [];
  }
}

// Unified Multi-API Global Search (TMDB + TVMaze + Jikan)
export async function searchGlobalAPIs(query: string): Promise<MovieItem[]> {
  if (!query.trim()) return [];

  // Run in parallel
  const [tmdbResults, tvmazeResults, jikanResults] = await Promise.allSettled([
    (async () => {
      try {
        const res = await fetch(
          `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
        );
        if (!res.ok) return [];
        const data = await res.json();
        return (data.results || [])
          .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
          .map((item: any) => formatTMDBItem(item));
      } catch {
        return [];
      }
    })(),
    searchTVMaze(query),
    searchJikanAnime(query),
  ]);

  const combined: MovieItem[] = [];
  const seenTitles = new Set<string>();

  const addItems = (items: MovieItem[]) => {
    for (const item of items) {
      const key = item.title.toLowerCase().trim();
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        combined.push(item);
      }
    }
  };

  if (tmdbResults.status === 'fulfilled') addItems(tmdbResults.value);
  if (tvmazeResults.status === 'fulfilled') addItems(tvmazeResults.value);
  if (jikanResults.status === 'fulfilled') addItems(jikanResults.value);

  return combined;
}
