'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MovieItem } from '@/types';
import { 
  Play, 
  Download, 
  Plus, 
  Check, 
  Star, 
  Flame, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Tv
} from 'lucide-react';

interface HeroBannerProps {
  items: MovieItem[];
}

export default function HeroBanner({ items }: HeroBannerProps) {
  const { openStreamPlayer, openDownloadModal, toggleWatchlist, isInWatchlist, subscription } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const featuredList = items.filter((m) => m.featured || m.trending).slice(0, 5);
  const current = featuredList[currentIndex] || items[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredList.length]);

  if (!current) return null;

  const inWatchlist = isInWatchlist(current.id);

  return (
    <div className="relative w-full min-h-[600px] sm:min-h-[680px] lg:min-h-[780px] flex items-end pb-16 pt-28 overflow-hidden">
      
      {/* Background Backdrop with Parallax/Fade */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.backdropUrl}
          alt={current.title}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        />
        {/* Cinematic Vignettes and Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-[#08090d]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#08090d]/30 to-[#08090d]"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl space-y-4">
          
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/90 text-white rounded-full font-bold uppercase tracking-wider shadow-lg shadow-red-600/30">
              <Flame className="w-3.5 h-3.5 fill-current" />
              Spotlight #{currentIndex + 1}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              IMDb {current.rating} ({current.voteCount})
            </span>

            <span className="px-2 py-0.5 bg-neutral-900/80 border border-white/10 text-neutral-300 rounded font-mono text-[11px]">
              {current.quality}
            </span>

            <span className="text-neutral-400 text-xs font-medium">
              {current.releaseYear} • {current.duration}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
            {current.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 pt-1">
            {current.genres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 bg-neutral-900/60 backdrop-blur-md border border-white/10 text-neutral-300 rounded-md text-xs font-medium"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="text-sm sm:text-base text-neutral-300 line-clamp-3 leading-relaxed drop-shadow-md">
            {current.overview}
          </p>

          {/* Cast */}
          {current.cast && current.cast.length > 0 && (
            <p className="text-xs text-neutral-400 hidden sm:block">
              <strong className="text-neutral-300">Starring:</strong> {current.cast.slice(0, 3).join(', ')}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            
            {/* Stream Now */}
            <button
              onClick={() => openStreamPlayer(current)}
              className="flex items-center gap-2 px-6 sm:px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Stream Now {subscription.isVip ? '(4K VIP)' : '(Free HD)'}</span>
            </button>

            {/* Download */}
            <button
              onClick={() => openDownloadModal(current)}
              className="flex items-center gap-2 px-5 sm:px-6 py-3.5 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold rounded-xl border border-white/15 backdrop-blur-lg hover:border-white/30 transition-all shadow-lg"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download</span>
            </button>

            {/* Watchlist */}
            <button
              onClick={() => toggleWatchlist(current.id)}
              className={`p-3.5 rounded-xl border transition-all ${
                inWatchlist
                  ? 'bg-red-600/20 border-red-500/50 text-red-400'
                  : 'bg-neutral-900/80 border-white/15 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Carousel Controls (Dots & Arrows) */}
      <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-3">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length)}
          className="p-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-full border border-white/10 backdrop-blur-md transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1.5">
          {featuredList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-red-600' : 'w-2 bg-neutral-600 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredList.length)}
          className="p-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-full border border-white/10 backdrop-blur-md transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
