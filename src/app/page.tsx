'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import CategoryFilter from '@/components/CategoryFilter';
import MovieRow from '@/components/MovieRow';
import MovieCard from '@/components/MovieCard';
import StreamPlayerModal from '@/components/StreamPlayerModal';
import DownloadModal from '@/components/DownloadModal';
import PaychanguModal from '@/components/PaychanguModal';
import MonetizationDrawer from '@/components/MonetizationDrawer';
import Toast from '@/components/Toast';
import Footer from '@/components/Footer';
import { 
  Flame, 
  Sparkles, 
  Crown, 
  Tv, 
  Film, 
  Zap, 
  Star, 
  Globe, 
  Search,
  Heart,
  TrendingUp,
  Download,
  Loader2
} from 'lucide-react';

export default function HomePage() {
  const { 
    movies, 
    searchQuery, 
    searchResults,
    isSearching,
    categoryMovies,
    isCategoryLoading,
    activeCategory, 
    watchlist, 
    subscription, 
    setShowPaymentModal, 
    setShowMonetizationDrawer 
  } = useApp();

  // Filter logic for category view or fallback
  const filteredCategoryMovies = movies.filter((movie) => {
    if (activeCategory === 'Watchlist') {
      return watchlist.includes(movie.id);
    }
    if (activeCategory === 'Movies') {
      return movie.type === 'movie';
    }
    if (activeCategory === 'TV Series') {
      return movie.type === 'series';
    }
    if (activeCategory === 'Animation & Anime') {
      return movie.type === 'animation';
    }
    if (activeCategory === 'African Cinema') {
      return movie.spotlightAfrica === true || movie.genres.includes('African Cinema');
    }
    if (activeCategory === 'Trending') {
      return movie.trending === true;
    }
    if (activeCategory === 'Top IMDb') {
      return movie.rating >= 8.5;
    }
    if (activeCategory === 'Action') {
      return movie.genres.includes('Action');
    }
    if (activeCategory === 'Sci-Fi') {
      return movie.genres.includes('Sci-Fi');
    }
    return true; // 'All'
  });

  const displayedList = searchQuery 
    ? (searchResults || []) 
    : activeCategory === 'Watchlist' 
      ? movies.filter((m) => (watchlist || []).includes(m.id))
      : (categoryMovies && categoryMovies.length > 0) 
        ? categoryMovies 
        : filteredCategoryMovies;

  const trendingMovies = movies.filter((m) => m.trending);
  const africanMovies = movies.filter((m) => m.spotlightAfrica || m.genres.includes('African Cinema'));
  const blockbusterMovies = movies.filter((m) => m.type === 'movie');
  const tvSeries = movies.filter((m) => m.type === 'series');
  const animationMovies = movies.filter((m) => m.type === 'animation');
  const topRatedMovies = movies.filter((m) => m.rating >= 8.5);

  const isBrowsingAll = activeCategory === 'All' && !searchQuery;
  const isLoading = isSearching || (isCategoryLoading && activeCategory !== 'All' && activeCategory !== 'Watchlist');


  return (
    <div className="min-h-screen bg-[#08090d] text-neutral-100 flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1">
        
        {/* If browsing home view (All category, no search): Show rich Hero + Carousels */}
        {isBrowsingAll ? (
          <>
            {/* Cinematic Hero Spotlight */}
            <HeroBanner items={movies} />

            {/* Category Navigation Pills */}
            <CategoryFilter />

            {/* Monetization / VIP Highlight Strip */}
            {!subscription.isVip && (
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6">
                <div className="relative overflow-hidden p-3.5 sm:p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-xl">
                  <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20">
                      <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-base font-bold text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span>VIP Pass: MKW 2,000 / 7 Days</span>
                        <span className="text-[9px] sm:text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.2 rounded-full border border-amber-500/30">
                          Airtel Money & Mpamba
                        </span>
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">
                        Stream with 0 ads, unlock 4K Ultra HDR, and download unlimited movies.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 text-center tap-target flex items-center justify-center"
                    >
                      Subscribe (MKW 2,000)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rows of Content */}
            <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-4">
              
              {/* Row 1: Trending Now */}
              <MovieRow
                title="Trending Right Now"
                subtitle="Most watched movies and series today"
                icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />}
                movies={trendingMovies}
                badge="HOT"
              />

              {/* Row 2: African Cinema Spotlight */}
              <MovieRow
                title="African Cinema & Nollywood"
                subtitle="Top Nollywood thrillers, dramas and regional hits"
                icon={<span className="text-base sm:text-lg">🌍</span>}
                movies={africanMovies}
                badge="SPOTLIGHT"
              />

              {/* Row 3: Blockbuster Movies */}
              <MovieRow
                title="Blockbuster Movies"
                subtitle="Hollywood hits in 4K Ultra HD"
                icon={<Film className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />}
                movies={blockbusterMovies}
              />

              {/* Row 4: TV Series */}
              <MovieRow
                title="Popular TV Series & Seasons"
                subtitle="Full episodes with season navigator"
                icon={<Tv className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />}
                movies={tvSeries}
              />

              {/* Row 5: Animations & Anime */}
              <MovieRow
                title="Animations & Anime"
                subtitle="Demon Slayer, Arcane, Disney & Pixar favorites"
                icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />}
                movies={animationMovies}
                badge="POPULAR"
              />

              {/* Row 6: Top IMDb */}
              <MovieRow
                title="Top IMDb Rated (8.5+)"
                subtitle="Critically acclaimed cinema masterpieces"
                icon={<Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />}
                movies={topRatedMovies}
              />

            </div>
          </>
        ) : (
          /* Filtered or Search View Grid */
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12">
            
            {/* Header for Filter / Search */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-3 sm:pb-4">
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2">
                  {searchQuery ? (
                    <>
                      <Search className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                      <span>Results for &ldquo;{searchQuery}&rdquo;</span>
                      {isSearching && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin" />}
                    </>
                  ) : activeCategory === 'Watchlist' ? (
                    <>
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 fill-red-500" />
                      <span>My Saved Watchlist</span>
                    </>
                  ) : (
                    <span>{activeCategory}</span>
                  )}
                </h1>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                  {isSearching
                    ? 'Searching global databases in real time...'
                    : `Found ${displayedList.length} title(s) available for streaming & download`}
                </p>
              </div>

              <CategoryFilter />
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                <p className="text-xs text-neutral-400">Loading multi-API streaming catalog...</p>
              </div>
            ) : displayedList.length > 0 ? (
              <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
                {displayedList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20 bg-neutral-900/40 rounded-3xl border border-white/5 space-y-3 sm:space-y-4 p-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-neutral-800 text-neutral-500 flex items-center justify-center mx-auto">
                  {activeCategory === 'Watchlist' ? <Heart className="w-7 h-7 sm:w-8 sm:h-8" /> : <Film className="w-7 h-7 sm:w-8 sm:h-8" />}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {activeCategory === 'Watchlist' ? 'Your Watchlist is Empty' : 'No Movies Found'}
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  {activeCategory === 'Watchlist'
                    ? 'Click the heart icon on any movie or series to save it here for quick access later.'
                    : `We couldn't find any results matching "${searchQuery}". Try searching for another movie title, actor, or genre.`}
                </p>
              </div>
            )}

          </div>
        )}


      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <StreamPlayerModal />
      <DownloadModal />
      <PaychanguModal />
      <MonetizationDrawer />
      <Toast />

    </div>
  );
}
