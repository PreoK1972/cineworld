'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Episode } from '@/types';
import { 
  X, 
  Play, 
  Server, 
  Tv, 
  Download, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  Maximize2,
  ExternalLink,
  Layers,
  Flame,
  Radio
} from 'lucide-react';

export default function StreamPlayerModal() {
  const { 
    streamingMovie, 
    closeStreamPlayer, 
    selectedEpisode, 
    openStreamPlayer, 
    subscription, 
    setShowPaymentModal,
    openDownloadModal 
  } = useApp();

  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const [adCountdown, setAdCountdown] = useState<number>(5);
  const [adFinished, setAdFinished] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (streamingMovie) {
      if (subscription.isVip) {
        setAdFinished(true);
        setAdCountdown(0);
      } else {
        setAdCountdown(5);
        setAdFinished(false);
      }
      setIsPlaying(false);
      setActiveServerIndex(0);
    }
  }, [streamingMovie, subscription.isVip]);

  useEffect(() => {
    if (!subscription.isVip && streamingMovie && adCountdown > 0) {
      const timer = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setAdFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [streamingMovie, subscription.isVip, adCountdown]);

  if (!streamingMovie) return null;

  const currentServer = streamingMovie.embedServers[activeServerIndex] || streamingMovie.embedServers[0];

  // Resolve embed URL based on movie or specific episode
  let embedSrc = currentServer?.embedUrl || '';
  if (selectedEpisode && selectedEpisode.embedUrl) {
    embedSrc = selectedEpisode.embedUrl;
  }

  // Backup embed fallback (Youtube trailer preview if external embed is blocked in local dev iframe)
  const youtubeFallback = `https://www.youtube-nocookie.com/embed/${streamingMovie.trailerYoutubeId}?autoplay=1&rel=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      
      <div className="relative w-full max-w-5xl bg-[#0b0d14] rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1 flex items-center gap-2">
                {streamingMovie.title}
                {selectedEpisode && (
                  <span className="text-xs text-neutral-400 font-normal">
                    (S{selectedEpisode.seasonNumber}:E{selectedEpisode.episodeNumber} - {selectedEpisode.title})
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="text-amber-400 font-semibold">IMDb {streamingMovie.rating}</span>
                <span>•</span>
                <span>{streamingMovie.releaseYear}</span>
                <span>•</span>
                <span>{streamingMovie.duration}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!subscription.isVip && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-all"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Remove Ads (MKW 2,000)</span>
              </button>
            )}

            <button
              onClick={() => openDownloadModal(streamingMovie)}
              className="p-2 text-neutral-300 hover:text-emerald-400 hover:bg-neutral-800 rounded-xl transition-all"
              title="Download Options"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={closeStreamPlayer}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          
          {/* Ad Simulation Layer (For Free Tier) */}
          {!subscription.isVip && !adFinished ? (
            <div className="absolute inset-0 z-30 bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
              
              <div className="max-w-md space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-medium">
                  <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Sponsor Video Ad (PropellerAds / AdSense Network)</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Experience Ultra Fast 4K Streaming
                </h3>

                <p className="text-xs text-neutral-400">
                  Ads generate revenue on free streams via CPM impressions. Get zero ads, instant downloads, and 4K quality with VIP.
                </p>

                {/* Countdown & Skip button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    disabled={adCountdown > 0}
                    onClick={() => setAdFinished(true)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      adCountdown > 0
                        ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-neutral-200 shadow-lg'
                    }`}
                  >
                    {adCountdown > 0 ? `Skip Sponsor Ad in ${adCountdown}s` : 'Skip to Video Stream ⏭️'}
                  </button>

                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                  >
                    <Crown className="w-3.5 h-3.5 text-yellow-200" />
                    <span>Skip All Ads Forever (MKW 2,000)</span>
                  </button>
                </div>
              </div>

              {/* Ad Banner placeholder below */}
              <div className="absolute bottom-3 left-4 right-4 bg-neutral-900/90 border border-white/5 rounded-lg py-1.5 px-4 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Ad: PropellerAds Video Unit #4812</span>
                <span className="text-emerald-400 font-mono">CPM Active: $4.20/1k</span>
              </div>

            </div>
          ) : (
            /* Real Embedded Player / High-Quality Iframe Stream */
            <div className="w-full h-full relative">
              <iframe
                src={embedSrc}
                title={streamingMovie.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              {/* Fallback Switcher Button if third-party embed is restricted */}
              <div className="absolute bottom-2 right-2 z-10 flex gap-1.5">
                <a
                  href={youtubeFallback}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-black/80 hover:bg-black text-[10px] text-neutral-300 hover:text-white rounded border border-white/10 backdrop-blur-md flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open HD Mirror</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Player Controls & Server Switcher */}
        <div className="p-4 sm:p-6 bg-neutral-950/90 border-t border-white/10 space-y-4 overflow-y-auto">
          
          {/* Server Switcher Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
              <Server className="w-4 h-4 text-red-500" />
              <span>Streaming Servers:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {streamingMovie.embedServers.map((srv, idx) => (
                <button
                  key={srv.name}
                  onClick={() => setActiveServerIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeServerIndex === idx
                      ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/30'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/5'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${activeServerIndex === idx ? 'bg-white' : 'bg-emerald-400'}`} />
                  <span>{srv.name}</span>
                  <span className="text-[10px] opacity-75">({srv.quality})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Episode Selector for Series and Anime */}
          {streamingMovie.seasons && streamingMovie.seasons.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Tv className="w-4 h-4 text-amber-400" />
                  Select Episodes & Seasons
                </span>
                <span className="text-xs text-neutral-400">
                  {streamingMovie.seasons.length} Season(s) available
                </span>
              </div>

              {streamingMovie.seasons.map((season) => (
                <div key={season.seasonNumber} className="space-y-2">
                  <h4 className="text-xs font-semibold text-neutral-400">
                    {season.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {season.episodes.map((ep) => {
                      const isCurrent = selectedEpisode?.id === ep.id;
                      return (
                        <button
                          key={ep.id}
                          onClick={() => openStreamPlayer(streamingMovie, ep)}
                          className={`p-2.5 rounded-xl text-left transition-all border flex items-center gap-3 ${
                            isCurrent
                              ? 'bg-red-600/20 border-red-500/50 text-white'
                              : 'bg-neutral-900/60 border-white/5 text-neutral-300 hover:bg-neutral-800 hover:border-white/20'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                            <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="overflow-hidden flex-1">
                            <p className="text-xs font-bold truncate">
                              E{ep.episodeNumber}: {ep.title}
                            </p>
                            <p className="text-[10px] text-neutral-400 truncate">
                              {ep.duration} • {ep.overview}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ad Banner for Free Users below player */}
          {!subscription.isVip && (
            <div className="p-3 bg-neutral-900/80 border border-dashed border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                  AD BANNER
                </span>
                <span className="text-neutral-300">
                  Upgrade to VIP for MKW 2,000 / 7 Days and stream in 4K with 0 ads!
                </span>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs shrink-0"
              >
                Go VIP
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
