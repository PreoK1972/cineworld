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
    <div className="group relative flex flex-col bg-neutral-900/60 rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/20 hover:-translate-y-1.5">
      
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Gradient Vignette on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          
          {/* Top Row inside hover overlay */}
          <div className="flex justify-between items-center w-full">
            <span className="px-2 py-0.5 bg-red-600/90 text-white rounded text-[10px] font-bold uppercase tracking-wider">
              {movie.type}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(movie.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                inWatchlist 
                  ? 'bg-red-600 text-white' 
                  : 'bg-black/60 text-white hover:bg-red-600 hover:text-white'
              }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Hover Actions in center / bottom */}
          <div className="space-y-2">
            <button
              onClick={() => openStreamPlayer(movie)}
              className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/40 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Stream {subscription.isVip ? '4K VIP' : 'Free'}</span>
            </button>

            <button
              onClick={() => openDownloadModal(movie)}
              className="w-full py-2 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-medium rounded-xl text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Options</span>
            </button>
          </div>

        </div>

        {/* Quality Badge (Always visible top-left) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] font-bold rounded">
            {movie.quality}
          </span>
          {movie.spotlightAfrica && (
            <span className="px-1.5 py-0.5 bg-amber-600/90 text-white text-[10px] font-bold rounded">
              Africa
            </span>
          )}
        </div>

        {/* Rating Badge (Always visible bottom-right before hover) */}
        <div className="absolute bottom-2.5 right-2.5 group-hover:opacity-0 transition-opacity flex items-center gap-1 px-2 py-0.5 bg-black/75 backdrop-blur-md rounded border border-white/10 text-amber-400 text-xs font-bold pointer-events-none">
          <Star className="w-3 h-3 fill-current" />
          <span>{movie.rating}</span>
        </div>

      </div>

      {/* Info Container */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h3 
            onClick={() => openStreamPlayer(movie)}
            className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
            <span>{movie.releaseYear}</span>
            <span>•</span>
            <span className="line-clamp-1">{movie.genres.slice(0, 2).join(', ')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 text-[10px] text-neutral-400">
          <span>{movie.duration}</span>
          <span className="text-emerald-400 font-medium">Free DL + Stream</span>
        </div>
      </div>

    </div>
  );
}
