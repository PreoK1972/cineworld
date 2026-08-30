import { NextResponse } from 'next/server';
import { 
  searchGlobalAPIs, 
  searchTVMaze, 
  searchJikanAnime, 
  searchKitsuAnime, 
  fetchTMDBDiscover 
} from '@/services/tmdb';
import { FEATURED_MOVIES } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const category = searchParams.get('category');

  try {
    // 1. Live Global Multi-API Search across 4 engines (TMDB + TVMaze + Jikan + Kitsu) + Curated Catalog
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      const localMatches = FEATURED_MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.cast.some((c) => c.toLowerCase().includes(q))
      );

      const liveResults = await searchGlobalAPIs(query);

      // Merge local matches first + live results, deduplicated
      const seen = new Set<string>();
      const combined: any[] = [];

      for (const item of [...localMatches, ...liveResults]) {
        const key = item.tmdbId ? `tmdb-${item.tmdbId}` : `${item.title.toLowerCase().trim()}-${item.type}`;
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(item);
        }
      }

      return NextResponse.json({ results: combined, source: 'merged_search' });
    }

    // 2. Category Live Feeds (MovieBox-Style Discovery)
    if (category) {
      if (category === 'Trending') {
        const liveTrending = await fetchTMDBDiscover('/trending/all/day');
        return NextResponse.json({ results: liveTrending.length > 0 ? liveTrending : FEATURED_MOVIES, source: 'trending_feed' });
      }
      if (category === 'Movies') {
        const liveMovies = await fetchTMDBDiscover('/movie/popular', 'movie');
        return NextResponse.json({ results: liveMovies.length > 0 ? liveMovies : FEATURED_MOVIES.filter(m => m.type === 'movie'), source: 'movies_feed' });
      }
      if (category === 'TV Series') {
        const liveTV = await fetchTMDBDiscover('/tv/popular', 'series');
        return NextResponse.json({ results: liveTV.length > 0 ? liveTV : FEATURED_MOVIES.filter(m => m.type === 'series'), source: 'tv_feed' });
      }
      if (category === 'Animation & Anime') {
        const liveAnime = await searchJikanAnime('action');
        const liveTMDBAnime = await fetchTMDBDiscover('/discover/movie?with_genres=16', 'animation');
        const combined = [...liveAnime, ...liveTMDBAnime];
        return NextResponse.json({ results: combined.length > 0 ? combined : FEATURED_MOVIES.filter(m => m.type === 'animation'), source: 'anime_feed' });
      }
      if (category === 'African Cinema') {
        const liveAfrica = await fetchTMDBDiscover('/discover/movie?with_origin_country=NG|ZA|GH');
        const localAfrica = FEATURED_MOVIES.filter(m => m.spotlightAfrica || m.genres.includes('African Cinema'));
        return NextResponse.json({ results: [...localAfrica, ...liveAfrica], source: 'african_feed' });
      }
      if (category === 'Top IMDb') {
        const topRated = await fetchTMDBDiscover('/movie/top_rated');
        return NextResponse.json({ results: topRated.length > 0 ? topRated : FEATURED_MOVIES.filter(m => m.rating >= 8.5), source: 'top_rated_feed' });
      }
      if (category === 'Action') {
        const actionMovies = await fetchTMDBDiscover('/discover/movie?with_genres=28');
        return NextResponse.json({ results: actionMovies.length > 0 ? actionMovies : FEATURED_MOVIES, source: 'action_feed' });
      }
      if (category === 'Sci-Fi') {
        const sciFiMovies = await fetchTMDBDiscover('/discover/movie?with_genres=878');
        return NextResponse.json({ results: sciFiMovies.length > 0 ? sciFiMovies : FEATURED_MOVIES, source: 'scifi_feed' });
      }
    }

    // 3. Initial Home Feed (Merge curated + live trending)
    return NextResponse.json({ results: FEATURED_MOVIES, source: 'curated' });
  } catch (error) {
    console.error('Movies API error:', error);
    return NextResponse.json({ results: FEATURED_MOVIES, source: 'fallback' });
  }
}

