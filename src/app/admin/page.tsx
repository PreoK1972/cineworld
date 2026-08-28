'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { 
  Film, 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Unlock,
  Key, 
  Plus, 
  Trash2, 
  Star, 
  Flame, 
  Radio, 
  Smartphone, 
  CreditCard, 
  Building, 
  Users, 
  Play, 
  Download, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { MovieItem } from '@/types';

export default function AdminPage() {
  const { 
    movies, 
    addMovie, 
    deleteMovie, 
    toggleFeaturedMovie, 
    transactions, 
    adSettings, 
    updateAdSettings,
    upgradeToVip,
    showToast 
  } = useApp();

  // Admin authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'content' | 'ads' | 'subscriptions'>('analytics');

  // Form state for adding new movie
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'movie' | 'series' | 'animation'>('movie');
  const [newYear, setNewYear] = useState(2024);
  const [newRating, setNewRating] = useState(8.2);
  const [newDuration, setNewDuration] = useState('2h 15m');
  const [newGenres, setNewGenres] = useState('Action, Sci-Fi, Thriller');
  const [newPoster, setNewPoster] = useState('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop');
  const [newBackdrop, setNewBackdrop] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop');
  const [newEmbedUrl, setNewEmbedUrl] = useState('https://vidsrc.me/embed/movie?imdb=tt1375666');
  const [newOverview, setNewOverview] = useState('An exciting blockbuster with intense action and visual storytelling.');
  const [newIsAfrican, setNewIsAfrican] = useState(false);

  // Manual VIP granting form
  const [manualUser, setManualUser] = useState('0999 55 44 33');
  const [manualChannel, setManualChannel] = useState<'Airtel Money' | 'TNM Mpamba' | 'Bank Transfer'>('Airtel Money');
  const [manualDays, setManualDays] = useState(7);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput || isLocked) return;

    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        showToast('Admin Authenticated Successfully ✅');
      } else if (data.locked) {
        setIsLocked(true);
        setAuthError(data.message);
      } else {
        setAuthError(data.message || 'Incorrect PIN.');
        setPinInput('');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const movieObj: MovieItem = {
      id: newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4),
      title: newTitle,
      type: newType,
      overview: newOverview,
      posterUrl: newPoster,
      backdropUrl: newBackdrop,
      rating: Number(newRating),
      voteCount: '12K',
      releaseYear: Number(newYear),
      duration: newDuration,
      quality: '4K',
      genres: newGenres.split(',').map((g) => g.trim()),
      cast: ['Lead Actor', 'Co-Star'],
      trailerYoutubeId: 'Way9Dexny3w',
      spotlightAfrica: newIsAfrican,
      trending: true,
      embedServers: [
        {
          name: 'Server 1 - Main Stream',
          serverLocation: 'Global Edge',
          quality: '4K / 1080p',
          embedUrl: newEmbedUrl,
        },
      ],
      downloadOptions: [
        {
          quality: '360p Data Saver',
          resolution: '640x360',
          fileSize: '320 MB',
          format: 'MP4',
          isVipOnly: false,
          downloadUrl: '#download-custom-360p',
          directSpeed: 'Mobile Light',
        },
        {
          quality: '720p HD',
          resolution: '1280x720',
          fileSize: '850 MB',
          format: 'MP4',
          isVipOnly: false,
          downloadUrl: '#download-custom-720p',
          directSpeed: 'Fast Mirror',
        },
        {
          quality: '1080p Full HD',
          resolution: '1920x1080',
          fileSize: '2.2 GB',
          format: 'MKV',
          isVipOnly: true,
          downloadUrl: '#download-custom-1080p',
          directSpeed: 'VIP Direct',
        },
      ],
    };

    addMovie(movieObj);
    setNewTitle('');
  };

  const handleManualGrantVip = (e: React.FormEvent) => {
    e.preventDefault();
    upgradeToVip(manualDays, manualUser, manualChannel);
  };

  // Calculations for KPI cards
  const totalSubscribersRevenueMkw = transactions.reduce((acc, curr) => acc + curr.amountMkw, 0);
  const totalSubscribersRevenueUsd = Math.round(totalSubscribersRevenueMkw / 1800);
  const estimatedAdRevenueUsd = 480; // monthly pacing
  const totalMonthlyEarningsUsd = totalSubscribersRevenueUsd + estimatedAdRevenueUsd;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06070a] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0c0e17] rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto shadow-lg shadow-red-600/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight">
              CineWorld Admin Portal
            </h1>
            <p className="text-xs text-neutral-400">
              Restricted management area for publisher metrics, ad networks & content catalog.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-neutral-300">
                Enter Master Admin PIN:
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  placeholder={isLocked ? 'Access locked — try later' : 'Enter PIN'}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  disabled={isLocked || isAuthLoading}
                  className="w-full pl-9 pr-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 font-mono tracking-widest text-center disabled:opacity-50"
                  autoFocus
                />
              </div>
            </div>

            {authError && (
              <div className={`p-3 rounded-xl text-xs font-medium text-center ${
                isLocked 
                  ? 'bg-red-900/40 border border-red-500/40 text-red-300' 
                  : 'bg-amber-900/40 border border-amber-500/40 text-amber-300'
              }`}>
                {isLocked ? '🔒 ' : '⚠️ '}{authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLocked || isAuthLoading || !pinInput}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAuthLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : isLocked ? (
                '🔒 Access Locked'
              ) : (
                'Unlock Dashboard 🔓'
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
            <span className="text-neutral-600">PIN secured server-side</span>
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-neutral-100 flex flex-col">
      
      {/* Admin Top Header Bar */}
      <header className="bg-[#0b0d14] border-b border-white/10 sticky top-0 z-40 py-3.5 px-4 sm:px-8 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-bold text-white shadow-md shadow-red-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-white flex items-center gap-1.5">
                CINE<span className="text-red-500">WORLD</span>
                <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.2 rounded-full uppercase tracking-wider font-bold">
                  ADMIN CONSOLE
                </span>
              </span>
              <p className="text-[10px] text-neutral-400 hidden sm:block">
                Publisher CPM Engine • Paychangu Gateway • Content CMS
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live System Active</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg"
            title="Lock Admin"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Revenue & CPM Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'content'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Content Manager ({movies.length} Movies)</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'subscriptions'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>VIP Subscriptions ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'ads'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Ad Networks Control</span>
          </button>
        </div>

        {/* TAB 1: REVENUE & CPM ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Monthly Earnings */}
              <div className="p-5 bg-gradient-to-br from-emerald-600/20 via-neutral-900 to-neutral-950 border border-emerald-500/30 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Total VIP Revenue</span>
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  MKW {totalSubscribersRevenueMkw.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-400 font-medium">
                  ≈ ${totalSubscribersRevenueUsd} USD earned
                </p>
              </div>

              {/* Active Subscribers */}
              <div className="p-5 bg-gradient-to-br from-amber-600/20 via-neutral-900 to-neutral-950 border border-amber-500/30 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>Active VIP Passes</span>
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {transactions.length}
                </div>
                <p className="text-[11px] text-neutral-400">
                  MKW 2,000 / 7-Day subscribers
                </p>
              </div>

              {/* Ad Payout Network */}
              <div className="p-5 bg-gradient-to-br from-blue-600/20 via-neutral-900 to-neutral-950 border border-blue-500/30 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
                  <span>Ad Revenue Channel</span>
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  USDT TRC-20
                </div>
                <p className="text-[11px] text-blue-300">
                  Target CPM: $10.00 / 1k views
                </p>
              </div>

              {/* Total Catalog Items */}
              <div className="p-5 bg-gradient-to-br from-rose-600/20 via-neutral-900 to-neutral-950 border border-rose-500/30 rounded-2xl space-y-1">
                <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
                  <span>Catalog Size</span>
                  <Play className="w-4 h-4" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {movies.length} Titles
                </div>
                <p className="text-[11px] text-rose-300">
                  Live streaming & downloads
                </p>
              </div>

            </div>

            {/* Payout & Settlement Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* TronLink USDT TRC-20 Wallet */}
              <div className="p-6 bg-neutral-900/60 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      TronLink USDT TRC-20 (Ad Networks Payout)
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Receives USD ad earnings from HilltopAds & AdSterra
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950 rounded-2xl border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Network:</span>
                    <span className="text-white font-mono">Tron (TRC-20)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Wallet Address:</span>
                    <span className="text-amber-400 font-mono text-[10px] break-all">THDb19sodpKVy4Q7csqSkNpyuLNayAJs5x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Settlement Currency:</span>
                    <span className="text-white">USDT (Crypto Dollar)</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/5">
                    <span className="text-neutral-400">Cashout Method:</span>
                    <span className="text-emerald-400 font-semibold">P2P to Airtel Money / Mpamba</span>
                  </div>
                </div>
              </div>

              {/* Local Mobile & Bank Collection */}
              <div className="p-6 bg-neutral-900/60 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Direct Mobile & Bank Accounts (MKW Subscriptions)
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Direct MKW 2,000 payments from subscribers
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-950 rounded-2xl border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Airtel Money:</span>
                    <span className="text-white font-mono">0999898896 (Tamara Gausi)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">TNM Mpamba:</span>
                    <span className="text-white font-mono">0892727574 (Prince Kasalika)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Malawi Bank:</span>
                    <span className="text-white font-mono">1008434146 (Prince Kasalika)</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/5">
                    <span className="text-neutral-400">Verification Mode:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Manual SMS Verification Active
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CONTENT & MOVIES MANAGER */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            
            {/* Add New Movie Form */}
            <div className="p-6 bg-neutral-900/60 rounded-3xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Plus className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-bold text-white">
                    Add New Movie, Series or Animation
                  </h3>
                </div>
                <span className="text-xs text-neutral-400">Auto-Generates Fast Streaming & Download Links</span>
              </div>

              <form onSubmit={handleCreateMovie} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gladiator II"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Content Type:</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">TV Series</option>
                    <option value="animation">Animation & Anime</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Release Year & Duration:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={newYear}
                      onChange={(e) => setNewYear(Number(e.target.value))}
                      className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white"
                    />
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="2h 10m"
                      className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">Genres (comma separated):</label>
                  <input
                    type="text"
                    value={newGenres}
                    onChange={(e) => setNewGenres(e.target.value)}
                    className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">IMDb Rating (e.g. 8.4):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1 flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-amber-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={newIsAfrican}
                      onChange={(e) => setNewIsAfrican(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span>🌍 African Spotlight (Nollywood/Local)</span>
                  </label>
                </div>

                <div className="space-y-1 sm:col-span-2 md:col-span-3">
                  <label className="text-neutral-300 font-semibold">Embed Streaming Server URL (VidSrc / 2Embed / SuperEmbed):</label>
                  <input
                    type="text"
                    value={newEmbedUrl}
                    onChange={(e) => setNewEmbedUrl(e.target.value)}
                    className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2 md:col-span-3">
                  <label className="text-neutral-300 font-semibold">Overview / Synopsis:</label>
                  <textarea
                    rows={2}
                    value={newOverview}
                    onChange={(e) => setNewOverview(e.target.value)}
                    className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish to CineWorld Catalog</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Catalog Table */}
            <div className="bg-neutral-900/60 rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Active Movies & Series Catalog ({movies.length})
                </h3>
                <span className="text-xs text-neutral-400">Real-Time Sync with Public App</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-white/5">
                    <tr>
                      <th className="p-3.5">Poster & Title</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Rating</th>
                      <th className="p-3.5">Spotlight / Featured</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-300">
                    {movies.map((m) => (
                      <tr key={m.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img src={m.posterUrl} alt={m.title} className="w-8 h-12 object-cover rounded-md border border-white/10" />
                          <div>
                            <span className="font-bold text-white block">{m.title}</span>
                            <span className="text-[11px] text-neutral-400">{m.releaseYear} • {m.duration}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-neutral-800 rounded font-medium capitalize text-neutral-200">
                            {m.type}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-amber-400 font-bold">★ {m.rating}</span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => toggleFeaturedMovie(m.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                              m.featured
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-neutral-800 border-white/10 text-neutral-500 hover:text-white'
                            }`}
                          >
                            {m.featured ? '★ Spotlight Hero' : '+ Feature'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => deleteMovie(m.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete movie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PAYCHANGU SUBSCRIPTIONS & MANUAL PAYMENTS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            
            {/* Pending Manual Verifications */}
            <div className="p-6 bg-neutral-900/60 rounded-3xl border border-blue-500/30 space-y-4">
              <div className="flex items-center gap-2.5 text-blue-400">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">
                  Pending Manual Verifications
                </h3>
              </div>
              <p className="text-xs text-neutral-400">
                Users who submitted a manual payment. Check your phone for the Transaction ID, then click Approve.
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-white/5">
                    <tr>
                      <th className="p-3.5">Method</th>
                      <th className="p-3.5">User Phone</th>
                      <th className="p-3.5">Transaction ID</th>
                      <th className="p-3.5">Time</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-300">
                    {(() => {
                      try {
                        const pending = JSON.parse(localStorage.getItem('cineworld_pending_payments') || '[]');
                        if (pending.length === 0) {
                          return (
                            <tr>
                              <td colSpan={5} className="p-5 text-center text-neutral-500">No pending payments.</td>
                            </tr>
                          );
                        }
                        return pending.map((p: any) => (
                          <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                            <td className="p-3.5 capitalize font-bold text-white">{p.method}</td>
                            <td className="p-3.5 text-blue-400">{p.phone}</td>
                            <td className="p-3.5 font-mono text-amber-400">{p.txId}</td>
                            <td className="p-3.5 text-neutral-500">{new Date(p.date).toLocaleTimeString()}</td>
                            <td className="p-3.5 flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  upgradeToVip(7, p.phone, p.method);
                                  const updated = pending.filter((item: any) => item.id !== p.id);
                                  localStorage.setItem('cineworld_pending_payments', JSON.stringify(updated));
                                  showToast(`Approved VIP for ${p.phone}`);
                                  // Force re-render hack by updating state somewhere (transactions will trigger it)
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
                              >
                                Approve VIP
                              </button>
                              <button
                                onClick={() => {
                                  const updated = pending.filter((item: any) => item.id !== p.id);
                                  localStorage.setItem('cineworld_pending_payments', JSON.stringify(updated));
                                  showToast(`Rejected payment ${p.txId}`);
                                }}
                                className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white font-bold rounded-lg transition-colors"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ));
                      } catch(e) {
                        return null;
                      }
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manual Grant VIP Card */}
            <div className="p-6 bg-neutral-900/60 rounded-3xl border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-2.5 text-amber-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">
                  Manual VIP Grant & Subscriber Activation
                </h3>
              </div>
              <p className="text-xs text-neutral-400">
                Instantly grant or renew VIP ad-free streaming for a customer phone number or email address.
              </p>

              <form onSubmit={handleManualGrantVip} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Phone or Email (e.g. 0999 123 456)"
                  value={manualUser}
                  onChange={(e) => setManualUser(e.target.value)}
                  className="p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white sm:col-span-2"
                />

                <select
                  value={manualChannel}
                  onChange={(e: any) => setManualChannel(e.target.value)}
                  className="p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white"
                >
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="TNM Mpamba">TNM Mpamba</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>

                <button
                  type="submit"
                  className="py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Grant 7-Day VIP ⚡
                </button>
              </form>
            </div>

            {/* Transactions Log Table */}
            <div className="bg-neutral-900/60 rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Approved VIP Passes & Transactions ({transactions.length})
                </h3>
                <span className="text-xs text-emerald-400 font-mono">Live VIP Sync ✅</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-white/5">
                    <tr>
                      <th className="p-3.5">Transaction ID</th>
                      <th className="p-3.5">Customer Number / Email</th>
                      <th className="p-3.5">Payment Method</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-300">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-neutral-400">{tx.id}</td>
                        <td className="p-3.5 font-semibold text-white">{tx.userPhoneOrEmail}</td>
                        <td className="p-3.5 flex items-center gap-1.5">
                          {tx.channel.includes('Airtel') && <span className="text-red-400">🟢 Airtel Money</span>}
                          {tx.channel.includes('Mpamba') && <span className="text-emerald-400">🔴 TNM Mpamba</span>}
                          {tx.channel.includes('Bank') && <span className="text-blue-400">🏦 Malawi Bank</span>}
                          {tx.channel.includes('Card') && <span className="text-amber-400">💳 Card</span>}
                        </td>
                        <td className="p-3.5 font-bold text-white">MKW {tx.amountMkw.toLocaleString()}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right text-neutral-400">{tx.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: AD NETWORKS CONTROL */}
        {activeTab === 'ads' && (
          <div className="p-6 bg-neutral-900/60 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">
                Ad Networks & CPM Settings
              </h3>
              <p className="text-xs text-neutral-400">
                Configure your publisher tags for PropellerAds, AdSterra, and Google AdSense
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold">Enable Display & Video Ads (Global):</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateAdSettings({ adsEnabled: !adSettings.adsEnabled })}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      adSettings.adsEnabled 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {adSettings.adsEnabled ? 'Ads: ENABLED 🟢' : 'Ads: PAUSED ⏸️'}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold">Free Video Pre-Roll Skip Countdown (Seconds):</label>
                <input
                  type="number"
                  min="3"
                  max="15"
                  value={adSettings.preRollCountdownSeconds}
                  onChange={(e) => updateAdSettings({ preRollCountdownSeconds: Number(e.target.value) })}
                  className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold">PropellerAds Zone ID:</label>
                <input
                  type="text"
                  value={adSettings.propellerAdsZoneId}
                  onChange={(e) => updateAdSettings({ propellerAdsZoneId: e.target.value })}
                  className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold">AdSterra Publisher Key:</label>
                <input
                  type="text"
                  value={adSettings.adsteraKey}
                  onChange={(e) => updateAdSettings({ adsteraKey: e.target.value })}
                  className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-white/5 space-y-2 text-xs">
              <h4 className="font-bold text-white">Publisher Script Tag Placement</h4>
              <p className="text-neutral-400 text-[11px]">
                Ad networks give you a JavaScript tag after approving your domain. CineWorld automatically loads the tags inside the video player and download countdown container to maximize your impressions.
              </p>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
