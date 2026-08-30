import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '4f298a53e5522830c82ff1bb86537a52';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get('tmdbId');
  const season = searchParams.get('season') || '1';

  if (!tmdbId || !tmdbId.trim()) {
    return NextResponse.json({ success: false, error: 'Missing tmdbId' }, { status: 400 });
  }

  const cleanId = tmdbId.replace(/[^0-9]/g, '');
  const seasonNum = parseInt(season, 10) || 1;

  try {
    // 1. Fetch TV Series Details for All Seasons
    const showRes = await fetch(
      `${TMDB_BASE_URL}/tv/${cleanId}?api_key=${TMDB_API_KEY}&language=en-US`
    );

    let seasonsList: Array<{ seasonNumber: number; name: string; episodeCount: number; posterUrl: string }> = [];
    let showName = 'TV Series';
    let backdropUrl = '';

    if (showRes.ok) {
      const showData = await showRes.json();
      showName = showData.name || showData.original_name || 'TV Series';
      backdropUrl = showData.backdrop_path ? `${IMAGE_BASE_URL}/original${showData.backdrop_path}` : '';

      seasonsList = (showData.seasons || [])
        .filter((s: any) => s.season_number > 0) // exclude season 0 specials
        .map((s: any) => ({
          seasonNumber: s.season_number,
          name: s.name || `Season ${s.season_number}`,
          episodeCount: s.episode_count || 10,
          posterUrl: s.poster_path
            ? `${IMAGE_BASE_URL}/w300${s.poster_path}`
            : showData.poster_path
              ? `${IMAGE_BASE_URL}/w300${showData.poster_path}`
              : '',
        }));
    }

    // Default fallback seasons if empty
    if (seasonsList.length === 0) {
      seasonsList = [
        { seasonNumber: 1, name: 'Season 1', episodeCount: 10, posterUrl: '' },
      ];
    }

    // 2. Fetch all episodes for the requested season
    const seasonRes = await fetch(
      `${TMDB_BASE_URL}/tv/${cleanId}/season/${seasonNum}?api_key=${TMDB_API_KEY}&language=en-US`
    );

    let episodesList: Array<{
      episodeNumber: number;
      seasonNumber: number;
      title: string;
      overview: string;
      duration: string;
      thumbnail: string;
      airDate: string;
    }> = [];

    if (seasonRes.ok) {
      const seasonData = await seasonRes.json();
      episodesList = (seasonData.episodes || []).map((ep: any) => ({
        episodeNumber: ep.episode_number,
        seasonNumber: ep.season_number || seasonNum,
        title: ep.name || `Episode ${ep.episode_number}`,
        overview: ep.overview || `Watch Season ${seasonNum}, Episode ${ep.episode_number} in 4K on CineWorld.`,
        duration: ep.runtime ? `${ep.runtime}m` : '48m',
        thumbnail: ep.still_path
          ? `${IMAGE_BASE_URL}/w500${ep.still_path}`
          : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        airDate: ep.air_date || '',
      }));
    }

    // If episodes list is empty or API call had issues, synthesize all episodes from episodeCount
    if (episodesList.length === 0) {
      const targetSeason = seasonsList.find((s) => s.seasonNumber === seasonNum);
      const epCount = targetSeason ? targetSeason.episodeCount : 10;
      
      for (let i = 1; i <= epCount; i++) {
        episodesList.push({
          episodeNumber: i,
          seasonNumber: seasonNum,
          title: `Episode ${i}`,
          overview: `Stream Season ${seasonNum}, Episode ${i} in ultra-fast 4K on CineWorld.`,
          duration: '48m',
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
          airDate: '',
        });
      }
    }

    return NextResponse.json({
      success: true,
      tmdbId: cleanId,
      showName,
      backdropUrl,
      seasons: seasonsList,
      activeSeason: seasonNum,
      episodes: episodesList,
    });
  } catch (error) {
    console.error('Series episodes API error:', error);
    
    // Graceful fallback with 10 synthetic episodes
    const fallbackEpisodes = Array.from({ length: 10 }, (_, idx) => ({
      episodeNumber: idx + 1,
      seasonNumber: seasonNum,
      title: `Episode ${idx + 1}`,
      overview: `Stream Season ${seasonNum}, Episode ${idx + 1} in 4K on CineWorld.`,
      duration: '48m',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      airDate: '',
    }));

    return NextResponse.json({
      success: true,
      tmdbId: cleanId,
      showName: 'TV Series',
      seasons: [
        { seasonNumber: 1, name: 'Season 1', episodeCount: 10, posterUrl: '' },
      ],
      activeSeason: seasonNum,
      episodes: fallbackEpisodes,
    });
  }
}
