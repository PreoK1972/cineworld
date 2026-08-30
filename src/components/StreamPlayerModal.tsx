'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { getEmbedServers, fetchTMDBIdByTitle, fetchTMDBSeriesDetails, fetchTMDBSeasonEpisodes } from '@/services/tmdb';
import {
  X,
  Play,
  Server,
  Tv,
  Download,
  Crown,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  RotateCcw,
  Radio,
  AlertTriangle,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Film,
  Sparkles,
  Layers,
  ArrowDownCircle
} from 'lucide-react';

// ─── Comprehensive Title to TMDB ID Mapping (Instant 0ms match) ───────────
const TITLE_TMDB_MAP: Record<string, string> = {
  'peaky blinders':               '60574',
  'breaking bad':                 '1396',
  'better call saul':             '60059',
  'game of thrones':              '1399',
  'house of the dragon':          '94997',
  'stranger things':              '66732',
  'the boys':                     '76479',
  'prison break':                 '2288',
  'vikings':                      '44217',
  'money heist':                  '71446',
  'squid game':                   '93405',
  'the last of us':               '100088',
  'the walking dead':             '1402',
  'suits':                        '37680',
  'friends':                      '1668',
  'the office':                   '2316',
  'narcos':                       '63351',
  'shogun':                       '126308',
  'arcane':                       '94605',
  'arcane league of legends':     '94605',
  'demon slayer':                 '85937',
  'demon slayer infinity castle': '85937',
  'attack on titan':              '1429',
  'jujutsu kaisen':               '95479',
  'one piece':                    '37854',
  'naruto':                       '46260',
  'naruto shippuden':             '31910',
  'death note':                   '13916',
  'dune':                         '438631',
  'dune part two':                '693134',
  'dune 2':                       '693134',
  'deadpool':                     '293660',
  'deadpool 2':                   '383498',
  'deadpool and wolverine':       '533535',
  'deadpool & wolverine':         '533535',
  'oppenheimer':                  '872585',
  'interstellar':                 '157336',
  'inception':                    '27205',
  'the dark knight':              '155',
  'dark knight':                  '155',
  'gladiator':                    '98',
  'gladiator 2':                  '558449',
  'gladiator ii':                 '558449',
  'inside out 2':                 '1022789',
  'john wick':                    '245891',
  'john wick 4':                  '603692',
  'john wick chapter 4':          '603692',
  'avatar':                       '19995',
  'avatar the way of water':      '76600',
  'titanic':                      '597',
  'the black book':               '1046032',
  'black book':                   '1046032',
  'lionheart':                    '539304',
  'blood and water':              '102927',
  'blood & water':                '102927',
  'shanty town':                  '218774',
  'jagun jagun':                  '1153724',
  'gangs of lagos':               '1022964',
  'brotherhood':                  '1022964',
};

// ─── Static TMDB ID map for mock content ─────────────────────────────────────
const TMDB_MAP: Record<string, string> = {
  'dune-2':                     '693134',
  'deadpool-wolverine':         '533535',
  'house-of-dragon':            '94997',
  'demon-slayer-infinity-castle': '85937',
  'demon-slayer':               '85937',
  'the-black-book':             '1046032',
  'black-book':                 '1046032',
  'oppenheimer':                '872585',
  'arcane-league-of-legends':   '94605',
  'arcane':                     '94605',
  'shogun':                     '126308',
  'blood-and-water':            '102927',
  'inside-out-2':               '1022789',
  'john-wick-4':                '603692',
  'stranger-things':            '66732',
  'spider-verse':               '569094',
  'gladiator-2':                '558449',
  'interstellar':               '157336',
  'dark-knight':                '155',
  'inception':                  '27205',
  'lionheart':                  '539304',
  'brotherhood':                '1022964',
  'shanty-town':                '218774',
  'jagun-jagun':                '1153724',
  'peaky-blinders':              '60574',
  'breaking-bad':               '1396',
  'gangs-of-lagos':             '1022964',
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface LiveEpisode {
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  overview: string;
  duration: string;
  thumbnail: string;
  airDate: string;
}
interface LiveSeason {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  posterUrl: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function StreamPlayerModal() {
  const {
    streamingMovie,
    closeStreamPlayer,
    subscription,
    setShowPaymentModal,
    openDownloadModal,
    showToast
  } = useApp();

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen]           = useState(false);

  // ─── Core state ─────────────────────────────────────────────────────────
  const [resolvedTmdbId, setResolvedTmdbId]       = useState<string | null>(null);
  const [isResolvingId, setIsResolvingId]          = useState(true);

  // ─── Series state (Only for TV Shows & Anime) ──────────────────────────
  const [seriesSeasons, setSeriesSeasons]          = useState<LiveSeason[]>([]);
  const [isLoadingSeasons, setIsLoadingSeasons]    = useState(false);
  const [activeSeason, setActiveSeason]            = useState(1);
  const [seasonEpisodes, setSeasonEpisodes]        = useState<LiveEpisode[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes]  = useState(false);
  const [activeEpisode, setActiveEpisode]          = useState<LiveEpisode | null>(null);

  // ─── Player state ────────────────────────────────────────────────────────
  const [activeServerIndex, setActiveServerIndex]  = useState(0);
  const [adCountdown, setAdCountdown]              = useState(5);
  const [adFinished, setAdFinished]                = useState(false);
  const [playerKey, setPlayerKey]                  = useState(0);

  const isTV = streamingMovie?.type === 'series' || streamingMovie?.type === 'animation';

  // ─── Step 1: Resolve TMDB ID on movie change ─────────────────────────────
  useEffect(() => {
    if (!streamingMovie) return;

    setResolvedTmdbId(null);
    setIsResolvingId(true);
    setSeriesSeasons([]);
    setSeasonEpisodes([]);
    setActiveEpisode(null);
    setActiveSeason(1);
    setActiveServerIndex(0);
    setAdFinished(subscription.isVip);
    setAdCountdown(subscription.isVip ? 0 : 5);

    const rawId = streamingMovie.id;
    const cleanTitle = (streamingMovie.title || '')
      .toLowerCase()
      .replace(/\(.*?\)/g, '')
      .replace(/season\s*\d+/gi, '')
      .trim();

    let cancelled = false;

    const resolve = async () => {
      // 0. Explicit tmdbId property on item
      if (streamingMovie.tmdbId && streamingMovie.tmdbId.trim()) {
        if (!cancelled) {
          setResolvedTmdbId(streamingMovie.tmdbId);
          setIsResolvingId(false);
        }
        return;
      }

      // 1. Direct Title Normalizer Match (Instant 0ms lookup)
      if (TITLE_TMDB_MAP[cleanTitle]) {
        if (!cancelled) {
          setResolvedTmdbId(TITLE_TMDB_MAP[cleanTitle]);
          setIsResolvingId(false);
        }
        return;
      }

      // 2. Static mock ID check
      if (TMDB_MAP[rawId]) {
        if (!cancelled) {
          setResolvedTmdbId(TMDB_MAP[rawId]);
          setIsResolvingId(false);
        }
        return;
      }

      // 3. ID prefixed with tmdb-
      if (rawId.startsWith('tmdb-')) {
        const num = rawId.replace(/[^0-9]/g, '');
        if (num) {
          if (!cancelled) {
            setResolvedTmdbId(num);
            setIsResolvingId(false);
          }
          return;
        }
      }

      // 4. Server-side title resolution via /api/tmdb-resolve
      const resolved = await fetchTMDBIdByTitle(streamingMovie.title, streamingMovie.type);
      if (!cancelled) {
        if (resolved) {
          setResolvedTmdbId(resolved);
        }
        setIsResolvingId(false);
      }
    };

    resolve();
    return () => { cancelled = true; };
  }, [streamingMovie?.id, subscription.isVip]);

  // ─── Step 2: Fetch season list once TMDB ID is resolved (series only) ─────
  useEffect(() => {
    if (!resolvedTmdbId || !isTV) {
      setIsLoadingSeasons(false);
      return;
    }

    let cancelled = false;
    setIsLoadingSeasons(true);

    fetchTMDBSeriesDetails(resolvedTmdbId).then((details) => {
      if (cancelled) return;
      if (details && details.seasons.length > 0) {
        setSeriesSeasons(details.seasons);
        setActiveSeason(details.seasons[0].seasonNumber);
      } else {
        // Fallback seasons
        setSeriesSeasons([
          { seasonNumber: 1, name: 'Season 1', episodeCount: 10, posterUrl: '' },
          { seasonNumber: 2, name: 'Season 2', episodeCount: 10, posterUrl: '' },
        ]);
        setActiveSeason(1);
      }
      setIsLoadingSeasons(false);
    });

    return () => { cancelled = true; };
  }, [resolvedTmdbId, isTV]);

  // ─── Step 3: Fetch episodes for active season ─────────────────────────────
  useEffect(() => {
    if (!resolvedTmdbId || !isTV || seriesSeasons.length === 0) return;

    let cancelled = false;
    setIsLoadingEpisodes(true);

    fetchTMDBSeasonEpisodes(resolvedTmdbId, activeSeason).then((eps) => {
      if (cancelled) return;
      if (eps && eps.length > 0) {
        setSeasonEpisodes(eps);
        setActiveEpisode((prev) => {
          if (!prev || prev.seasonNumber !== activeSeason) {
            return eps[0];
          }
          return prev;
        });
      } else {
        // Synthesize episodes based on season episode count
        const targetSeason = seriesSeasons.find(s => s.seasonNumber === activeSeason);
        const count = targetSeason ? targetSeason.episodeCount : 10;
        const fallbackList: LiveEpisode[] = Array.from({ length: count }, (_, idx) => ({
          episodeNumber: idx + 1,
          seasonNumber: activeSeason,
          title: `Episode ${idx + 1}`,
          overview: `Stream Season ${activeSeason}, Episode ${idx + 1} in 4K on CineWorld.`,
          duration: '48m',
          thumbnail: streamingMovie?.posterUrl || '',
          airDate: '',
        }));
        setSeasonEpisodes(fallbackList);
        setActiveEpisode(fallbackList[0]);
      }
      setIsLoadingEpisodes(false);
    });

    return () => { cancelled = true; };
  }, [resolvedTmdbId, activeSeason, isTV, seriesSeasons.length]);

  // ─── Ad countdown ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!subscription.isVip && streamingMovie && adCountdown > 0) {
      const t = setInterval(() => {
        setAdCountdown((p) => {
          if (p <= 1) { clearInterval(t); setAdFinished(true); return 0; }
          return p - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [streamingMovie, subscription.isVip, adCountdown]);

  // ─── Fullscreen Handler ──────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // ─── Navigation helpers ──────────────────────────────────────────────────
  const currentEpIndex = seasonEpisodes.findIndex(
    (e) => e.episodeNumber === activeEpisode?.episodeNumber && e.seasonNumber === activeEpisode?.seasonNumber
  );

  const currentSeasonIndex = seriesSeasons.findIndex((s) => s.seasonNumber === activeSeason);
  const hasNextEpisode = currentEpIndex >= 0 && currentEpIndex < seasonEpisodes.length - 1;
  const hasNextSeason = currentSeasonIndex >= 0 && currentSeasonIndex < seriesSeasons.length - 1;
  const canGoNext = hasNextEpisode || hasNextSeason;

  const hasPrevEpisode = currentEpIndex > 0;
  const hasPrevSeason = currentSeasonIndex > 0;
  const canGoPrev = hasPrevEpisode || hasPrevSeason;

  const goToNextEpisode = () => {
    if (hasNextEpisode) {
      setActiveEpisode(seasonEpisodes[currentEpIndex + 1]);
      setPlayerKey((k) => k + 1);
    } else if (hasNextSeason) {
      const nextSeason = seriesSeasons[currentSeasonIndex + 1];
      setActiveSeason(nextSeason.seasonNumber);
      setPlayerKey((k) => k + 1);
      showToast(`▶ Loading ${nextSeason.name}...`);
    }
  };

  const goToPrevEpisode = () => {
    if (hasPrevEpisode) {
      setActiveEpisode(seasonEpisodes[currentEpIndex - 1]);
      setPlayerKey((k) => k + 1);
    } else if (hasPrevSeason) {
      const prevSeason = seriesSeasons[currentSeasonIndex - 1];
      setActiveSeason(prevSeason.seasonNumber);
      setPlayerKey((k) => k + 1);
      showToast(`◀ Loading ${prevSeason.name}...`);
    }
  };

  const handleDownloadEpisode = (ep: LiveEpisode) => {
    showToast(`⬇ Starting download: ${streamingMovie.title} S${ep.seasonNumber}:E${ep.episodeNumber}`);
    openDownloadModal({
      ...streamingMovie,
      title: `${streamingMovie.title} (S${ep.seasonNumber}:E${ep.episodeNumber})`
    });
  };

  if (!streamingMovie) return null;

  // ─── Build embed URL ─────────────────────────────────────────────────────
  const tmdbId    = resolvedTmdbId || '';
  const seasonNum = activeEpisode?.seasonNumber ?? 1;
  const epNum     = activeEpisode?.episodeNumber ?? 1;

  const servers       = tmdbId ? getEmbedServers(tmdbId, streamingMovie.type, seasonNum, epNum) : [];
  const currentServer = servers[activeServerIndex] || servers[0];
  const embedSrc      = currentServer?.embedUrl || '';

  // ─── Strict Stream Ready Guard ──────────────────────────────────────────
  const isStreamReady = Boolean(
    resolvedTmdbId &&
    !isResolvingId &&
    (!isTV || (!isLoadingSeasons && !isLoadingEpisodes && activeEpisode !== null))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0b0d14] rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-0 sm:my-auto flex flex-col max-h-[96dvh] sm:max-h-[94vh]">

        {/* ── Modal Top Bar ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))] pb-3 border-b border-white/10 bg-neutral-900/95 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
              {isTV ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-2">
                <span>{streamingMovie.title}</span>
                {isTV && activeEpisode && (
                  <span className="px-2 py-0.5 bg-neutral-800 text-amber-300 rounded text-[10px] font-semibold border border-amber-500/20">
                    S{activeEpisode.seasonNumber} : E{activeEpisode.episodeNumber}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                <span className="text-amber-400 font-semibold">IMDb {streamingMovie.rating}</span>
                <span>·</span>
                <span>{streamingMovie.releaseYear}</span>
                <span>·</span>
                <span className="capitalize">{streamingMovie.type}</span>
                {isResolvingId ? (
                  <>
                    <span>·</span>
                    <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                    <span className="text-blue-400 font-medium">Resolving stream…</span>
                  </>
                ) : resolvedTmdbId ? (
                  <>
                    <span>·</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-mono text-[9px]">Stream Ready</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!subscription.isVip && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-xl text-[11px] font-bold shadow-md shadow-amber-500/20"
              >
                <Crown className="w-3 h-3" />
                <span>Go VIP</span>
              </button>
            )}
            <button
              onClick={() => openDownloadModal(streamingMovie)}
              className="p-2 text-neutral-300 hover:text-emerald-400 hover:bg-neutral-800 rounded-xl transition-all"
              title="Download Options"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={closeStreamPlayer}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── TOP ALL-SEASONS & QUICK EPISODE JUMP BAR (Series & Anime ONLY) ── */}
        {isTV && (
          <div className="px-3.5 sm:px-5 py-2.5 bg-gradient-to-r from-[#11131c] via-[#0d1017] to-[#11131c] border-b border-white/10 shrink-0 space-y-2">
            
            {/* Top Season Selector Pills (S1, S2, S3, S4, S5...) */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1.5 shrink-0">
                <Layers className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] sm:text-[11px] font-bold text-neutral-300">Seasons:</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {seriesSeasons.map((s) => (
                  <button
                    key={s.seasonNumber}
                    onClick={() => setActiveSeason(s.seasonNumber)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all flex items-center gap-1 active:scale-95 ${
                      activeSeason === s.seasonNumber
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-white/30'
                        : 'bg-neutral-800/90 text-neutral-300 hover:text-white hover:bg-neutral-700'
                    }`}
                  >
                    <span>S{s.seasonNumber}</span>
                    <span className="text-[9px] opacity-75 font-normal">({s.episodeCount} eps)</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => openDownloadModal(streamingMovie)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold shrink-0 active:scale-95"
                title="Download Season in Advance"
              >
                <Download className="w-3 h-3" />
                <span>Download S{activeSeason}</span>
              </button>
            </div>

            {/* Quick Episode Jump Numbers Ribbon (1, 2, 3, 4, 5, 6, 7...) */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5">
              <span className="text-[10px] font-bold text-neutral-400 shrink-0 mr-1">Episodes:</span>
              {isLoadingEpisodes ? (
                <div className="flex items-center gap-1 text-[10px] text-neutral-400 py-1">
                  <Loader2 className="w-3 h-3 animate-spin text-red-500" />
                  <span>Loading S{activeSeason} episodes...</span>
                </div>
              ) : (
                seasonEpisodes.map((ep) => {
                  const isCurrent =
                    activeEpisode?.episodeNumber === ep.episodeNumber &&
                    activeEpisode?.seasonNumber === ep.seasonNumber;

                  return (
                    <button
                      key={`top-s${ep.seasonNumber}e${ep.episodeNumber}`}
                      onClick={() => {
                        setActiveEpisode(ep);
                        setPlayerKey((k) => k + 1);
                      }}
                      className={`min-w-7 h-7 px-2 rounded-lg text-[11px] font-bold shrink-0 transition-all flex items-center justify-center active:scale-95 ${
                        isCurrent
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 ring-1 ring-white'
                          : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                      }`}
                      title={`Play Episode ${ep.episodeNumber}: ${ep.title}`}
                    >
                      {ep.episodeNumber}
                    </button>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* ── Streaming Controls Bar ────────────────────────────────────────── */}
        <div className="px-3 sm:px-5 py-2 bg-neutral-900 border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Line {activeServerIndex + 1} · 4K Active</span>
            </div>

            <button
              onClick={() => {
                setActiveServerIndex((prev) => (prev + 1) % servers.length);
                setPlayerKey((k) => k + 1);
              }}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-[11px] font-semibold border border-white/10 flex items-center gap-1.5 active:scale-95 transition-all"
              title="Switch to backup streaming line"
            >
              <RefreshCw className="w-3 h-3 text-amber-400" />
              <span>Switch Line (Line {(activeServerIndex + 1) % servers.length + 1})</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setPlayerKey((k) => k + 1)}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-[11px] font-semibold border border-white/10 flex items-center gap-1 active:scale-95 transition-all"
              title="Reload video stream"
            >
              <RotateCcw className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Reload</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-[11px] font-bold border border-white/10 flex items-center gap-1.5 active:scale-95 transition-all"
              title="Enter Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-3 h-3 text-amber-400" /> : <Maximize className="w-3 h-3 text-amber-400" />}
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
          </div>
        </div>

        {/* ── Video Player Area ───────────────────────────────────────── */}
        <div
          ref={playerContainerRef}
          className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden shrink-0 group"
        >
          {!isStreamReady ? (
            /* High-Tech Resolving Spinner */
            <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center gap-3 p-6">
              <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-white">
                  {isResolvingId
                    ? 'Connecting to verified streaming mirrors...'
                    : isTV && isLoadingEpisodes
                      ? `Loading Season ${activeSeason} episodes...`
                      : 'Preparing high-speed 4K stream...'}
                </p>
                <p className="text-xs text-neutral-400">
                  {streamingMovie.title} {isTV && activeSeason ? `· Season ${activeSeason}` : ''}
                </p>
              </div>
            </div>
          ) : !adFinished ? (
            /* Ad simulation layer for free users */
            <div className="absolute inset-0 z-30 bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-md space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Sponsor Ad</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Ultra Fast 4K Streaming</h3>
                <p className="text-xs text-neutral-400">Ads keep CineWorld free. Skip for MKW 2,000/week.</p>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    disabled={adCountdown > 0}
                    onClick={() => setAdFinished(true)}
                    className={`flex-1 px-5 py-2.5 rounded-xl text-xs font-bold ${
                      adCountdown > 0
                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                  >
                    {adCountdown > 0 ? `Skip Ad in ${adCountdown}s` : 'Skip to Video ⏭️'}
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold rounded-xl text-xs"
                  >
                    <Crown className="w-3.5 h-3.5 inline mr-1" />
                    Go VIP — No Ads
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Live Verified Iframe Player */
            <div className="w-full h-full relative">
              <iframe
                key={`${embedSrc}-${playerKey}-${seasonNum}-${epNum}`}
                src={embedSrc}
                title={streamingMovie.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />

              {/* Floating Quick Episode Controls Overlay (Bottom Right on Hover) */}
              {isTV && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                  <button
                    disabled={!canGoPrev}
                    onClick={goToPrevEpisode}
                    className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      canGoPrev
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-white active:scale-95'
                        : 'text-neutral-600 cursor-not-allowed'
                    }`}
                    title="Previous Episode"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[10px] font-bold text-amber-300 px-1">
                    S{seasonNum}:E{epNum}
                  </span>

                  <button
                    disabled={!canGoNext}
                    onClick={goToNextEpisode}
                    className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      canGoNext
                        ? 'bg-red-600 hover:bg-red-500 text-white active:scale-95'
                        : 'text-neutral-600 cursor-not-allowed'
                    }`}
                    title="Next Episode"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Bottom Panel (MovieBox-Style Episode & Season Details) ──── */}
        <div className="flex-1 overflow-y-auto scroll-touch p-3 sm:p-5 space-y-4 pb-[max(1rem,env(safe-area-inset-bottom,1rem))]">

          {/* Episode Quick Switcher Bar */}
          {isTV && seasonEpisodes.length > 0 && (
            <div className="flex items-center justify-between bg-neutral-900/90 p-2.5 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-white font-bold text-xs sm:text-sm">
                  Season {activeEpisode?.seasonNumber || activeSeason} : Episode {activeEpisode?.episodeNumber || 1}
                </span>
                <span className="text-[10px] text-neutral-400 hidden sm:inline">
                  — {activeEpisode?.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={!canGoPrev}
                  onClick={goToPrevEpisode}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    canGoPrev
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700 active:scale-95'
                      : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  <SkipBack className="w-3.5 h-3.5" />
                  <span>Prev Ep</span>
                </button>

                <button
                  disabled={!canGoNext}
                  onClick={goToNextEpisode}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    canGoNext
                      ? 'bg-red-600 text-white hover:bg-red-500 active:scale-95 shadow-md shadow-red-600/30'
                      : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  <span>Next Ep</span>
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ── MovieBox Season Episodes Grid with Direct Download Option ── */}
          {isTV && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">All Season {activeSeason} Episodes</h3>
                </div>
                <span className="text-[11px] text-neutral-400 font-medium">
                  {seasonEpisodes.length} Episodes Available
                </span>
              </div>

              {isLoadingEpisodes ? (
                <div className="flex items-center justify-center py-10 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  <span className="text-xs text-neutral-400">Loading episodes for Season {activeSeason}…</span>
                </div>
              ) : seasonEpisodes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto scroll-touch pr-1">
                  {seasonEpisodes.map((ep) => {
                    const isCurrent =
                      activeEpisode?.episodeNumber === ep.episodeNumber &&
                      activeEpisode?.seasonNumber === ep.seasonNumber;

                    return (
                      <div
                        key={`bottom-s${ep.seasonNumber}e${ep.episodeNumber}`}
                        className={`flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all border group relative ${
                          isCurrent
                            ? 'bg-red-600/20 border-red-500/60 text-white ring-1 ring-red-500/40 shadow-lg shadow-red-600/10'
                            : 'bg-neutral-900/80 border-white/5 text-neutral-300 hover:bg-neutral-800 hover:border-white/20'
                        }`}
                      >
                        {/* Thumbnail with overlay Play button */}
                        <div 
                          onClick={() => {
                            setActiveEpisode(ep);
                            setPlayerKey((k) => k + 1);
                          }}
                          className="w-20 h-13 rounded-xl overflow-hidden shrink-0 bg-neutral-800 relative aspect-video cursor-pointer"
                        >
                          <img
                            src={ep.thumbnail}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = streamingMovie.posterUrl;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            {isCurrent ? (
                              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-lg animate-pulse">
                                <Play className="w-3 h-3 fill-white text-white translate-x-0.5" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-black/60 group-hover:bg-white/80 group-hover:text-black flex items-center justify-center transition-colors">
                                <Play className="w-2.5 h-2.5 fill-current translate-x-0.2" />
                              </div>
                            )}
                          </div>
                          {ep.duration && (
                            <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 rounded text-[8px] font-bold text-neutral-300">
                              {ep.duration}
                            </span>
                          )}
                        </div>

                        {/* Episode Info */}
                        <div 
                          onClick={() => {
                            setActiveEpisode(ep);
                            setPlayerKey((k) => k + 1);
                          }}
                          className="flex-1 overflow-hidden min-w-0 cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-extrabold text-amber-400">
                              EPISODE {ep.episodeNumber}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                Playing
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold truncate text-white">
                            {ep.title}
                          </p>
                          <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                            {ep.overview}
                          </p>
                        </div>

                        {/* Download in Advance Action */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadEpisode(ep);
                          }}
                          className="p-2 text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 rounded-xl transition-all shrink-0 active:scale-95"
                          title={`Download Episode ${ep.episodeNumber} in Advance`}
                        >
                          <ArrowDownCircle className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}

          {/* VIP Upgrade Banner */}
          {!subscription.isVip && (
            <div className="flex items-center justify-between p-3 bg-neutral-900/80 border border-dashed border-amber-500/30 rounded-2xl text-xs gap-2">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">VIP PASS</span>
                <span className="text-neutral-300">MKW 2,000 / week for 4K streaming with 0 ads</span>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs shrink-0 active:scale-95 shadow-md shadow-amber-500/20"
              >
                Upgrade
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
