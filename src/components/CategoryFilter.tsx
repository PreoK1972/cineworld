'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { GENRE_LIST } from '@/data/mockData';
import { Sparkles, Film, Tv, Flame, Compass } from 'lucide-react';

export default function CategoryFilter() {
  const { activeCategory, setActiveCategory, setSearchQuery } = useApp();

  return (
    <div className="relative z-20 -mt-3 sm:-mt-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-2xl p-2 sm:p-3.5 shadow-2xl flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-touch snap-x">
        {GENRE_LIST.map((genre) => {
          const isActive = activeCategory === genre;
          return (
            <button
              key={genre}
              onClick={() => {
                setActiveCategory(genre);
                setSearchQuery('');
              }}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 snap-start active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              {genre === 'Trending' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
              {genre === 'African Cinema' && <span className="text-sm">🌍</span>}
              {genre === 'Animation & Anime' && <span className="text-sm">⚡</span>}
              {genre === 'Top IMDb' && <span className="text-amber-400">★</span>}
              <span>{genre}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

