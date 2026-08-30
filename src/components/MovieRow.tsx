'use client';

import React, { useRef } from 'react';
import { MovieItem } from '@/types';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieRowProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  movies: MovieItem[];
  badge?: string;
}

export default function MovieRow({ title, subtitle, icon, movies, badge }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-4 sm:py-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {icon}
            <h2 className="text-base sm:text-2xl font-bold text-white tracking-tight">
              {title}
            </h2>
            {badge && (
              <span className="px-2 py-0.5 bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-semibold rounded-full">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-sm text-neutral-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl border border-white/10 transition-all hover:scale-105 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl border border-white/10 transition-all hover:scale-105 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Movie Carousel / Row */}
      <div
        ref={rowRef}
        className="flex gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 snap-x snap-mandatory scroll-touch"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="w-[125px] min-[400px]:w-[140px] sm:w-[180px] md:w-[210px] shrink-0 snap-start"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}

