import { NextResponse } from 'next/server';
import { searchGlobalAPIs, searchTVMaze, searchJikanAnime, formatTMDBItem } from '@/services/tmdb';
import { FEATURED_MOVIES } from '@/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const category = searchParams.get('category');

  try {
    // 1. Live Global Multi-API Search (TMDB + TVMaze + Jikan Anime)
    if (query && query.trim()) {
      const results = await searchGlobalAPIs(query);
      if (results.length > 0) {
        return NextResponse.json({ results, source: 'multi_api_live' });
      }

      // Local fallback
      const q = query.toLowerCase();
      const localMatches = FEATURED_MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.cast.some((c) => c.toLowerCase().includes(q))
      );
      return NextResponse.json({ results: localMatches, source: 'local' });
    }

    return NextResponse.json({ results: FEATURED_MOVIES, source: 'curated' });
  } catch (error) {
    console.error('Movies API error:', error);
    return NextResponse.json({ results: FEATURED_MOVIES, source: 'fallback' });
  }
}
