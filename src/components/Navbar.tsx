'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { 
  Film, 
  Search, 
  Sparkles, 
  Crown, 
  Heart, 
  X,
  Menu,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function Navbar() {
  const { 
    subscription, 
    setShowPaymentModal, 
    searchQuery, 
    setSearchQuery,
    watchlist,
    activeCategory,
    setActiveCategory,
    downgradeToFree
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#08090d]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl pt-[max(0.6rem,env(safe-area-inset-top,0.6rem))] pb-2.5 sm:py-3' 
          : 'bg-gradient-to-b from-[#08090d]/95 via-[#08090d]/70 to-transparent pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))] pb-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo */}
        <div 
          onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
          className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform duration-300">
            <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-white flex items-center">
              CINE<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">WORLD</span>
            </span>
            <span className="hidden md:block text-[10px] tracking-widest text-neutral-400 uppercase -mt-1 font-medium">
              Stream & Download HQ
            </span>
          </div>
        </div>

        {/* Navigation Items (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <button 
            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            className={`transition-colors hover:text-white ${activeCategory === 'All' && !searchQuery ? 'text-red-500 font-semibold' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => { setActiveCategory('Movies'); setSearchQuery(''); }}
            className={`transition-colors hover:text-white ${activeCategory === 'Movies' ? 'text-red-500 font-semibold' : ''}`}
          >
            Movies
          </button>
          <button 
            onClick={() => { setActiveCategory('TV Series'); setSearchQuery(''); }}
            className={`transition-colors hover:text-white ${activeCategory === 'TV Series' ? 'text-red-500 font-semibold' : ''}`}
          >
            TV Series
          </button>
          <button 
            onClick={() => { setActiveCategory('Animation & Anime'); setSearchQuery(''); }}
            className={`transition-colors hover:text-white ${activeCategory === 'Animation & Anime' ? 'text-red-500 font-semibold' : ''}`}
          >
            Animations
          </button>
          <button 
            onClick={() => { setActiveCategory('African Cinema'); setSearchQuery(''); }}
            className={`transition-colors hover:text-amber-400 flex items-center gap-1 ${activeCategory === 'African Cinema' ? 'text-amber-400 font-semibold' : ''}`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            African Gems
          </button>
        </nav>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-[180px] sm:max-w-xs md:max-w-sm">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 absolute left-2.5 sm:left-3 pointer-events-none" />
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 bg-neutral-900/90 border border-white/10 rounded-full text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 p-1 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Watchlist counter (Desktop / Tablet) */}
          <button
            onClick={() => setActiveCategory('Watchlist')}
            title="My Watchlist"
            className="hidden sm:flex relative p-2 text-neutral-300 hover:text-red-400 hover:bg-neutral-800/80 rounded-xl transition-all border border-white/5"
          >
            <Heart className={`w-5 h-5 ${watchlist.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full border border-neutral-950">
                {watchlist.length}
              </span>
            )}
          </button>

          {/* VIP Plan Status / Subscribe Button */}
          {subscription.isVip ? (
            <div className="relative group">
              <button 
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 border border-amber-500/50 rounded-xl text-amber-300 text-xs font-bold shadow-lg shadow-amber-500/10 hover:border-amber-400 transition-all"
              >
                <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs">VIP</span>
                <span className="text-[10px] text-amber-200/70 hidden md:inline">• 4K / 0 Ads</span>
              </button>
              {/* Dropdown to switch back to free for testing */}
              <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                <div className="p-2 border-b border-neutral-800 text-xs text-neutral-400">
                  Plan: <span className="text-amber-400 font-bold">MKW 2,000 / 7 Days</span>
                </div>
                <button
                  onClick={downgradeToFree}
                  className="w-full text-left mt-1 px-2.5 py-1.5 text-xs text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Switch to Free (Test Ads)
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="relative group overflow-hidden px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/20 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 group-hover:from-amber-400 group-hover:via-rose-500 group-hover:to-red-500"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/25 via-transparent to-transparent"></div>
              <div className="relative flex items-center gap-1 sm:gap-1.5">
                <Crown className="w-3.5 h-3.5 text-yellow-200" />
                <span className="text-[11px] sm:text-xs">VIP Pass</span>
              </div>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950/98 backdrop-blur-2xl border-b border-neutral-800 px-4 py-4 space-y-2 mt-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button 
              onClick={() => { setActiveCategory('All'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeCategory === 'All' ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/30' : 'text-neutral-300 bg-neutral-900/60'}`}
            >
              🎬 Home
            </button>
            <button 
              onClick={() => { setActiveCategory('Movies'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeCategory === 'Movies' ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/30' : 'text-neutral-300 bg-neutral-900/60'}`}
            >
              🍿 Movies
            </button>
            <button 
              onClick={() => { setActiveCategory('TV Series'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeCategory === 'TV Series' ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/30' : 'text-neutral-300 bg-neutral-900/60'}`}
            >
              📺 TV Series
            </button>
            <button 
              onClick={() => { setActiveCategory('Animation & Anime'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left transition-colors ${activeCategory === 'Animation & Anime' ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/30' : 'text-neutral-300 bg-neutral-900/60'}`}
            >
              ⚡ Animations
            </button>
            <button 
              onClick={() => { setActiveCategory('African Cinema'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left col-span-2 transition-colors ${activeCategory === 'African Cinema' ? 'bg-amber-600/20 text-amber-400 font-bold border border-amber-500/30' : 'text-amber-300 bg-neutral-900/60'}`}
            >
              🌍 African Cinema Spotlight
            </button>
            <button 
              onClick={() => { setActiveCategory('Watchlist'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left col-span-2 transition-colors ${activeCategory === 'Watchlist' ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/30' : 'text-neutral-300 bg-neutral-900/60'} flex items-center justify-between`}
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>My Saved Watchlist</span>
              </span>
              {watchlist.length > 0 && (
                <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                  {watchlist.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );

}
