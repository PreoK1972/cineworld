import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '4f298a53e5522830c82ff1bb86537a52';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const type = searchParams.get('type') || 'movie';

  if (!title || !title.trim()) {
    return NextResponse.json({ success: false, error: 'Missing title' }, { status: 400 });
  }

  try {
    const cleanTitle = title.replace(/\(.*?\)/g, '').trim();
    const isTV = type === 'series' || type === 'animation';
    const primaryEndpoint = isTV ? 'tv' : 'movie';

    // 1. Search primary endpoint (tv or movie)
    const res = await fetch(
      `${TMDB_BASE_URL}/search/${primaryEndpoint}?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(cleanTitle)}&page=1`
    );

    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Find best title match
        const exactMatch = data.results.find(
          (item: any) =>
            (item.title || item.name || '').toLowerCase() === cleanTitle.toLowerCase()
        );
        const bestItem = exactMatch || data.results[0];
        return NextResponse.json({
          success: true,
          tmdbId: String(bestItem.id),
          title: bestItem.title || bestItem.name,
          mediaType: primaryEndpoint,
        });
      }
    }

    // 2. Multi-search fallback if primary endpoint had 0 results
    const multiRes = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(cleanTitle)}&page=1`
    );

    if (multiRes.ok) {
      const multiData = await multiRes.json();
      const results = (multiData.results || []).filter(
        (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
      );

      if (results.length > 0) {
        const exactMatch = results.find(
          (item: any) =>
            (item.title || item.name || '').toLowerCase() === cleanTitle.toLowerCase()
        );
        const bestItem = exactMatch || results[0];
        return NextResponse.json({
          success: true,
          tmdbId: String(bestItem.id),
          title: bestItem.title || bestItem.name,
          mediaType: bestItem.media_type,
        });
      }
    }

    return NextResponse.json({ success: false, error: 'Not found in TMDB' }, { status: 404 });
  } catch (error) {
    console.error('TMDB resolve API error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
