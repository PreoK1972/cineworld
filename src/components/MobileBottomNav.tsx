'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Home, Film, Tv, Heart, Crown } from 'lucide-react';

export default function MobileBottomNav() {
  const { 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery, 
    watchlist, 
    subscription, 
    setShowPaymentModal 
  } = useApp();

  const handleNavClick = (cat: string) => {
    setActiveCategory(cat);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e17]/95 backdrop-blur-2xl border-t border-white/10 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))] shadow-2xl shadow-black select-none"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          onClick={() => handleNavClick('All')}
          aria-label="Home"
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all tap-target active:scale-95 ${
            activeCategory === 'All' && !searchQuery
              ? 'text-red-500 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeCategory === 'All' && !searchQuery ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Movies */}
        <button
          onClick={() => handleNavClick('Movies')}
          aria-label="Movies"
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all tap-target active:scale-95 ${
            activeCategory === 'Movies'
              ? 'text-red-500 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Film className={`w-5 h-5 mb-0.5 ${activeCategory === 'Movies' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight">Movies</span>
        </button>

        {/* TV Series */}
        <button
          onClick={() => handleNavClick('TV Series')}
          aria-label="TV Series"
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all tap-target active:scale-95 ${
            activeCategory === 'TV Series'
              ? 'text-red-500 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Tv className={`w-5 h-5 mb-0.5 ${activeCategory === 'TV Series' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] tracking-tight">Series</span>
        </button>

        {/* Saved / Watchlist */}
        <button
          onClick={() => handleNavClick('Watchlist')}
          aria-label="Saved Watchlist"
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all tap-target active:scale-95 ${
            activeCategory === 'Watchlist'
              ? 'text-red-500 font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 mb-0.5 ${activeCategory === 'Watchlist' || watchlist.length > 0 ? (activeCategory === 'Watchlist' ? 'fill-red-500 text-red-500' : 'text-red-400') : ''}`} />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black shadow-sm">
                {watchlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Saved</span>
        </button>

        {/* VIP Pass */}
        <button
          onClick={() => setShowPaymentModal(true)}
          aria-label="VIP Pass"
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all tap-target active:scale-95 ${
            subscription.isVip
              ? 'text-emerald-400 font-bold'
              : 'text-amber-400 font-bold animate-pulse'
          }`}
        >
          <div className="p-1 rounded-lg bg-amber-500/20 border border-amber-500/40 shadow-sm shadow-amber-500/20">
            <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">
            {subscription.isVip ? 'VIP Active' : 'Get VIP'}
          </span>
        </button>

      </div>
    </nav>
  );
}

