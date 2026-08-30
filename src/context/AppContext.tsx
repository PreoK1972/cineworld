'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MovieItem, Episode, UserSubscription } from '@/types';
import { FEATURED_MOVIES } from '@/data/mockData';

export interface TransactionRecord {
  id: string;
  userPhoneOrEmail: string;
  channel: 'Airtel Money' | 'TNM Mpamba' | 'Bank Transfer' | 'Card' | 'Crypto';
  amountMkw: number;
  durationDays: number;
  status: 'Completed' | 'Pending' | 'Failed';
  timestamp: string;
}

export interface AdSettings {
  adsEnabled: boolean;
  preRollCountdownSeconds: number;
  propellerAdsZoneId: string;
  adsteraKey: string;
  bannerAdsEnabled: boolean;
  popUnderEnabled: boolean;
}

interface AppContextType {
  movies: MovieItem[];
  searchResults: MovieItem[];
  isSearching: boolean;
  categoryMovies: MovieItem[];
  isCategoryLoading: boolean;
  addMovie: (movie: MovieItem) => void;
  deleteMovie: (movieId: string) => void;
  toggleFeaturedMovie: (movieId: string) => void;

  watchlist: string[];
  toggleWatchlist: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;

  // Subscription state
  subscription: UserSubscription;
  upgradeToVip: (durationDays?: number, phoneOrEmail?: string, channel?: any, amountMkw?: number) => void;
  downgradeToFree: () => void;

  // Transactions & Admin stats
  transactions: TransactionRecord[];
  adSettings: AdSettings;
  updateAdSettings: (newSettings: Partial<AdSettings>) => void;

  // Modals & Navigation
  streamingMovie: MovieItem | null;
  selectedEpisode: Episode | null;
  openStreamPlayer: (movie: MovieItem, episode?: Episode) => void;
  closeStreamPlayer: () => void;

  downloadingMovie: MovieItem | null;
  openDownloadModal: (movie: MovieItem) => void;
  closeDownloadModal: () => void;

  showPaymentModal: boolean;
  setShowPaymentModal: (show: boolean) => void;

  showMonetizationDrawer: boolean;
  setShowMonetizationDrawer: (show: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;

  // Toast system
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-9481',
    userPhoneOrEmail: '0999 12 34 56',
    channel: 'Airtel Money',
    amountMkw: 2000,
    durationDays: 7,
    status: 'Completed',
    timestamp: '10 mins ago',
  },
  {
    id: 'tx-9480',
    userPhoneOrEmail: '0888 76 54 32',
    channel: 'TNM Mpamba',
    amountMkw: 2000,
    durationDays: 7,
    status: 'Completed',
    timestamp: '42 mins ago',
  },
  {
    id: 'tx-9479',
    userPhoneOrEmail: 'alex.m@gmail.com',
    channel: 'Card',
    amountMkw: 2000,
    durationDays: 7,
    status: 'Completed',
    timestamp: '2 hours ago',
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [movies, setMovies] = useState<MovieItem[]>(FEATURED_MOVIES);
  const [searchResults, setSearchResults] = useState<MovieItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [categoryMovies, setCategoryMovies] = useState<MovieItem[]>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  // Subscription state
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    activeUntil: null,
    isVip: false,
    downloadLimitPerDay: 3,
    adsEnabled: true,
  });

  // Admin and transaction states - starts clean, populated by real user payments
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [adSettings, setAdSettings] = useState<AdSettings>({
    adsEnabled: true,
    preRollCountdownSeconds: 5,
    propellerAdsZoneId: '',
    adsteraKey: '',
    bannerAdsEnabled: true,
    popUnderEnabled: false,
  });

  // Modal states
  const [streamingMovie, setStreamingMovie] = useState<MovieItem | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [downloadingMovie, setDownloadingMovie] = useState<MovieItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showMonetizationDrawer, setShowMonetizationDrawer] = useState<boolean>(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Search with Multi-APIs (TMDB + TVMaze + Jikan + Kitsu)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/movies?query=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (e) {
        console.error('Search fetch error', e);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Live Category Discovery with Multi-APIs (MovieBox Style)
  useEffect(() => {
    if (activeCategory === 'All' || activeCategory === 'Watchlist' || searchQuery.trim()) {
      setCategoryMovies([]);
      setIsCategoryLoading(false);
      return;
    }

    let isMounted = true;
    setIsCategoryLoading(true);

    fetch(`/api/movies?category=${encodeURIComponent(activeCategory)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setCategoryMovies(data.results || []);
        }
      })
      .catch((err) => console.error('Category fetch error', err))
      .finally(() => {
        if (isMounted) setIsCategoryLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory, searchQuery]);

  // Load from local storage
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('cineworld_watchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
      const savedSub = localStorage.getItem('cineworld_subscription');
      if (savedSub) {
        const parsed = JSON.parse(savedSub);
        if (parsed.activeUntil && new Date(parsed.activeUntil) > new Date()) {
          setSubscription(parsed);
        }
      }
      const savedMovies = localStorage.getItem('cineworld_custom_movies');
      if (savedMovies) {
        setMovies(JSON.parse(savedMovies));
      }
      const savedTxs = localStorage.getItem('cineworld_transactions');
      if (savedTxs) {
        setTransactions(JSON.parse(savedTxs));
      }
    } catch (e) {
      console.error('Failed to parse localStorage', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addMovie = (newMovie: MovieItem) => {
    setMovies((prev) => {
      const next = [newMovie, ...prev];
      try {
        localStorage.setItem('cineworld_custom_movies', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast(`Added "${newMovie.title}" to CineWorld Catalog!`);
  };

  const deleteMovie = (movieId: string) => {
    setMovies((prev) => {
      const next = prev.filter((m) => m.id !== movieId);
      try {
        localStorage.setItem('cineworld_custom_movies', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast('Movie deleted from catalog');
  };

  const toggleFeaturedMovie = (movieId: string) => {
    setMovies((prev) => {
      const next = prev.map((m) => (m.id === movieId ? { ...m, featured: !m.featured } : m));
      try {
        localStorage.setItem('cineworld_custom_movies', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const updateAdSettings = (newSettings: Partial<AdSettings>) => {
    setAdSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Ad network settings saved successfully');
  };

  const toggleWatchlist = (movieId: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(movieId);
      const next = exists ? prev.filter((id) => id !== movieId) : [...prev, movieId];
      try {
        localStorage.setItem('cineworld_watchlist', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      showToast(exists ? 'Removed from Watchlist' : 'Added to My Watchlist ❤️');
      return next;
    });
  };

  const isInWatchlist = (movieId: string) => watchlist.includes(movieId);

  const upgradeToVip = (
    durationDays: number = 7, 
    phoneOrEmail: string = '0999 12 34 56',
    channel: any = 'Airtel Money',
    amountMkw: number = 2000
  ) => {
    const until = new Date();
    until.setDate(until.getDate() + durationDays);

    const newSub: UserSubscription = {
      plan: durationDays === 1 ? 'vip_daily' : durationDays === 30 ? 'vip_monthly' : 'vip_weekly',
      activeUntil: until.toISOString(),
      isVip: true,
      downloadLimitPerDay: 9999,
      adsEnabled: false,
    };

    setSubscription(newSub);

    const newTx: TransactionRecord = {
      id: `tx-${Math.floor(1000 + Math.random() * 9000)}`,
      userPhoneOrEmail: phoneOrEmail,
      channel: channel || 'Airtel Money',
      amountMkw: amountMkw,
      durationDays: durationDays,
      status: 'Completed',
      timestamp: 'Just now',
    };
    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      try {
        localStorage.setItem('cineworld_transactions', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    try {
      localStorage.setItem('cineworld_subscription', JSON.stringify(newSub));
    } catch (e) {
      console.error(e);
    }
    showToast(`🎉 VIP Activated! Unlimited 4K Streaming & Downloads for ${durationDays} Days.`);
  };

  const downgradeToFree = () => {
    const freeSub: UserSubscription = {
      plan: 'free',
      activeUntil: null,
      isVip: false,
      downloadLimitPerDay: 3,
      adsEnabled: true,
    };
    setSubscription(freeSub);
    try {
      localStorage.removeItem('cineworld_subscription');
    } catch (e) {
      console.error(e);
    }
    showToast('Switched to Free Tier (Ad-Supported)');
  };

  const openStreamPlayer = (movie: MovieItem, episode?: Episode) => {
    setStreamingMovie(movie);
    if (episode) {
      setSelectedEpisode(episode);
    } else if (movie.seasons && movie.seasons[0]?.episodes[0]) {
      setSelectedEpisode(movie.seasons[0].episodes[0]);
    } else {
      setSelectedEpisode(null);
    }
  };

  const closeStreamPlayer = () => {
    setStreamingMovie(null);
    setSelectedEpisode(null);
  };

  const openDownloadModal = (movie: MovieItem) => {
    setDownloadingMovie(movie);
  };

  const closeDownloadModal = () => {
    setDownloadingMovie(null);
  };

  return (
    <AppContext.Provider
      value={{
        movies,
        searchResults,
        isSearching,
        categoryMovies,
        isCategoryLoading,
        addMovie,
        deleteMovie,
        toggleFeaturedMovie,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        subscription,
        upgradeToVip,
        downgradeToFree,
        transactions,
        adSettings,
        updateAdSettings,
        streamingMovie,
        selectedEpisode,
        openStreamPlayer,
        closeStreamPlayer,
        downloadingMovie,
        openDownloadModal,
        closeDownloadModal,
        showPaymentModal,
        setShowPaymentModal,
        showMonetizationDrawer,
        setShowMonetizationDrawer,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
