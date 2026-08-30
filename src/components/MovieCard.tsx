'use client';

import React from 'react';
import { MovieItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { Play, Download, Star, Heart, Check, Tv, Film, Sparkles } from 'lucide-react';

interface MovieCardProps {
  movie: MovieItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { openStreamPlayer, openDownloadModal, toggleWatchlist, isInWatchlist, subscription } = useApp();
  const inWatchlist = isInWatchlist(movie.id);

  return (
    <div className="group relative flex flex-col bg-neutral-900/70 rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/20 hover:-translate-y-1 active:scale-[0.98]">
      
      {/* Poster Image Container */}
      <div 
        onClick={() => openStreamPlayer(movie)}
        className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950 cursor-pointer select-none"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Watchlist Quick Toggle Button (Always visible on mobile / touch) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(movie.id);
          }}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-md transition-all active:scale-90 tap-target flex items-center justify-center ${
            inWatchlist 
              ? 'bg-red-600 text-white shadow-md shadow-red-600/40' 
              : 'bg-black/60 text-white hover:bg-red-600 hover:text-white border border-white/10'
          }`}
          title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          aria-label={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quality Badge (Always visible top-left) */}
        <div className="absolute top-2 left-2 flex items-center gap-1 pointer-events-none z-10">
          <span className="px-1.5 py-0.5 bg-black/80 backdrop-blur-md border border-white/15 text-white font-mono text-[9px] sm:text-[10px] font-bold rounded">
            {movie.quality}
          </span>
          {movie.spotlightAfrica && (
            <span className="px-1.5 py-0.5 bg-amber-600/90 text-white text-[9px] sm:text-[10px] font-bold rounded">
              Africa
            </span>
          )}
        </div>

        {/* Rating Badge (Always visible bottom-right) */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-black/80 backdrop-blur-md rounded border border-white/10 text-amber-400 text-[10px] sm:text-xs font-bold pointer-events-none z-10">
          <Star className="w-3 h-3 fill-current" />
          <span>{movie.rating}</span>
        </div>

        {/* Desktop Hover Vignette Actions */}
        <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-end p-3 z-10">
          <div className="space-y-2">
            <button
              onClick={() => openStreamPlayer(movie)}
              className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/40 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Stream {subscription.isVip ? '4K VIP' : 'Free'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openDownloadModal(movie);
              }}
              className="w-full py-2 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-medium rounded-xl text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download</span>
            </button>
          </div>
        </div>

      </div>

      {/* Info Container */}
      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1">
        <div>
          <h3 
            onClick={() => openStreamPlayer(movie)}
            className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {movie.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400 mt-1">
            <span>{movie.releaseYear}</span>
            <span>•</span>
            <span className="line-clamp-1">{movie.genres.slice(0, 2).join(', ')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[9px] sm:text-[10px] text-neutral-400">
          <span>{movie.duration}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDownloadModal(movie);
            }}
            className="text-emerald-400 font-medium hover:underline flex items-center gap-0.5"
          >
            <Download className="w-2.5 h-2.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

    </div>
  );
}

