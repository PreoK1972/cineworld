'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchTMDBSeriesDetails, fetchTMDBSeasonEpisodes } from '@/services/tmdb';
import { 
  X, 
  Download, 
  Crown, 
  HardDrive, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Zap, 
  Clock, 
  CheckCircle2,
  FileCode,
  Radio,
  Layers,
  Tv,
  Loader2
} from 'lucide-react';

export default function DownloadModal() {
  const { downloadingMovie, closeDownloadModal, subscription, setShowPaymentModal, showToast } = useApp();
  const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  // Series Season & Episode state for downloading in advance
  const [seriesSeasons, setSeriesSeasons] = useState<any[]>([]);
  const [activeSeason, setActiveSeason] = useState(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<any[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(false);

  const isTV = downloadingMovie?.type === 'series' || downloadingMovie?.type === 'animation';
  const tmdbId = downloadingMovie?.tmdbId || downloadingMovie?.id?.replace(/[^0-9]/g, '') || '';

  useEffect(() => {
    if (!downloadingMovie || !isTV || !tmdbId) {
      setSeriesSeasons([]);
      setSeasonEpisodes([]);
      return;
    }

    setIsLoadingSeasons(true);
    fetchTMDBSeriesDetails(tmdbId).then((res) => {
      if (res && res.seasons.length > 0) {
        setSeriesSeasons(res.seasons);
        setActiveSeason(res.seasons[0].seasonNumber);
      } else {
        setSeriesSeasons([
          { seasonNumber: 1, name: 'Season 1', episodeCount: 10, posterUrl: '' },
          { seasonNumber: 2, name: 'Season 2', episodeCount: 10, posterUrl: '' },
        ]);
        setActiveSeason(1);
      }
      setIsLoadingSeasons(false);
    });
  }, [downloadingMovie?.id, isTV, tmdbId]);

  useEffect(() => {
    if (!tmdbId || !isTV || seriesSeasons.length === 0) return;

    fetchTMDBSeasonEpisodes(tmdbId, activeSeason).then((eps) => {
      if (eps && eps.length > 0) {
        setSeasonEpisodes(eps);
      } else {
        const count = seriesSeasons.find(s => s.seasonNumber === activeSeason)?.episodeCount || 10;
        setSeasonEpisodes(Array.from({ length: count }, (_, i) => ({
          episodeNumber: i + 1,
          seasonNumber: activeSeason,
          title: `Episode ${i + 1}`,
          duration: '48m',
          thumbnail: downloadingMovie?.posterUrl || '',
        })));
      }
    });
  }, [tmdbId, activeSeason, isTV, seriesSeasons.length]);

  if (!downloadingMovie) return null;

  const triggerActualDownload = (option: any) => {
    const epSuffix = selectedEpisode ? ` S${activeSeason}E${selectedEpisode}` : '';
    if (option.magnetUrl) {
      window.location.href = option.magnetUrl;
      showToast(`🧲 Opening Magnet in 1DM / Torrent App: ${downloadingMovie.title}${epSuffix}`);
      return;
    }

    const cleanTitle = encodeURIComponent(
      `${downloadingMovie.title}${epSuffix}`.toLowerCase().replace(/[^a-z0-9]/g, '-')
    );
    const downloadTarget = option.downloadUrl && option.downloadUrl.startsWith('http') 
      ? option.downloadUrl 
      : `https://download.cineworld.internal/get?file=${cleanTitle}-${downloadingMovie.releaseYear}-${encodeURIComponent(option.quality)}.${option.format?.toLowerCase() || 'mp4'}`;

    // Create real browser download trigger
    const link = document.createElement('a');
    link.href = downloadTarget;
    link.download = `${downloadingMovie.title}${epSuffix} (${option.quality}).${option.format?.toLowerCase() || 'mp4'}`;
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      showToast(`🚀 Download initiated: ${downloadingMovie.title}${epSuffix} (${option.quality})!`);
    }, 50);
  };

  const handleDownloadClick = (option: any) => {
    if (option.isVipOnly && !subscription.isVip) {
      setShowPaymentModal(true);
      return;
    }

    if (!subscription.isVip) {
      setDownloadingQuality(option.quality);
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setDownloadingQuality(null);
            triggerActualDownload(option);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      triggerActualDownload(option);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/95 backdrop-blur-2xl overflow-y-auto">
      
      <div className="relative w-full max-w-2xl bg-[#0b0d14] rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-0 sm:my-auto flex flex-col max-h-[92dvh] sm:max-h-[88vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 pt-[max(1rem,env(safe-area-inset-top,1rem))] bg-gradient-to-b from-neutral-900 to-transparent border-b border-white/5 flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg bg-neutral-900">
              <img
                src={downloadingMovie.posterUrl}
                alt={downloadingMovie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="px-2 py-0.5 bg-red-600/90 text-white rounded text-[9px] sm:text-[10px] font-bold uppercase">
                  Download Center
                </span>
                <span className="text-[11px] sm:text-xs text-neutral-400">
                  {downloadingMovie.releaseYear} • {downloadingMovie.duration}
                </span>
              </div>
              <h2 className="text-sm sm:text-xl font-bold text-white mt-1 line-clamp-1">
                {downloadingMovie.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 line-clamp-2">
                Direct high-speed browser downloads and 1DM/Torrent magnet links. Resumable on mobile and PC.
              </p>
            </div>
          </div>

          <button
            onClick={closeDownloadModal}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all shrink-0 tap-target flex items-center justify-center"
            aria-label="Close download modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Advance TV Season & Episode Selector (For Series / Anime) ──── */}
        {isTV && seriesSeasons.length > 0 && (
          <div className="p-4 bg-neutral-900/90 border-b border-white/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Select Season & Episode to Download:</span>
              </div>
              <span className="text-[10px] text-neutral-400">
                {selectedEpisode ? `Selected: S${activeSeason}:E${selectedEpisode}` : `Entire Season ${activeSeason}`}
              </span>
            </div>

            {/* Season Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {seriesSeasons.map((s) => (
                <button
                  key={s.seasonNumber}
                  onClick={() => {
                    setActiveSeason(s.seasonNumber);
                    setSelectedEpisode(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    activeSeason === s.seasonNumber
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  Season {s.seasonNumber} ({s.episodeCount} eps)
                </button>
              ))}
            </div>

            {/* Episode Numbers Ribbon */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              <button
                onClick={() => setSelectedEpisode(null)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                  selectedEpisode === null
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                All S{activeSeason} Episodes
              </button>

              {seasonEpisodes.map((ep) => (
                <button
                  key={ep.episodeNumber}
                  onClick={() => setSelectedEpisode(ep.episodeNumber)}
                  className={`min-w-6 h-6 px-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                    selectedEpisode === ep.episodeNumber
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  E{ep.episodeNumber}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content & Options */}
        <div className="p-4 sm:p-6 space-y-3 overflow-y-auto scroll-touch flex-1">
          
          {/* VIP Upgrade Banner */}
          {!subscription.isVip && (
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-red-600/15 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Unlock 4K Ultra-Fast VIP Downloads
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400">
                    Pay <strong className="text-amber-400">MKW 2,000 for 7 Days</strong> via Airtel Money & Mpamba to skip wait times.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full sm:w-auto px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs shrink-0 shadow-lg shadow-amber-500/20 active:scale-95 text-center"
              >
                Go VIP (MKW 2k)
              </button>
            </div>
          )}

          {/* Download Options List */}
          <div className="space-y-2.5">
            {downloadingMovie.downloadOptions.map((opt) => {
              const isLocked = opt.isVipOnly && !subscription.isVip;
              const isCurrentlyDownloading = downloadingQuality === opt.quality;

              return (
                <div
                  key={opt.quality}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    isLocked
                      ? 'bg-neutral-900/40 border-white/5 opacity-85'
                      : 'bg-neutral-900/80 border-white/10 hover:border-red-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      opt.isVipOnly 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      <HardDrive className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {opt.quality}
                        </h4>
                        {opt.isVipOnly && (
                          <span className="px-1.5 py-0.2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold rounded">
                            VIP ONLY
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400 mt-0.5">
                        <span className="font-mono text-neutral-200 font-semibold">{opt.fileSize}</span>
                        <span>•</span>
                        <span>{opt.resolution}</span>
                        <span>•</span>
                        <span>{opt.format}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                    {opt.magnetUrl && !isLocked && (
                      <button
                        onClick={() => {
                          window.location.href = opt.magnetUrl!;
                          showToast(`🧲 Magnet Opened for ${downloadingMovie.title}`);
                        }}
                        className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1 border border-white/10 active:scale-95"
                        title="Open Magnet Link in 1DM / uTorrent"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                        <span>Magnet</span>
                      </button>
                    )}

                    {isCurrentlyDownloading ? (
                      <div className="w-full sm:w-auto px-4 py-2 bg-neutral-800 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Sponsor Ad: {countdown}s...</span>
                      </div>
                    ) : isLocked ? (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-neutral-800 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 tap-target"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Unlock (MKW 2,000)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDownloadClick(opt)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition-all active:scale-95 tap-target"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{subscription.isVip ? 'Instant VIP DL' : 'Free Download'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer info */}
        <div className="p-3.5 sm:p-4 bg-neutral-950 border-t border-white/5 text-[10px] sm:text-[11px] text-neutral-400 flex items-center justify-between pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>High-Speed SSL Direct CDN</span>
          </div>
          <span className="text-neutral-500">Supports 1DM, IDM & Mobile Browsers</span>
        </div>

      </div>

    </div>
  );
}
