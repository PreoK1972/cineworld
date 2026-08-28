'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
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
  Radio
} from 'lucide-react';

export default function DownloadModal() {
  const { downloadingMovie, closeDownloadModal, subscription, setShowPaymentModal, showToast } = useApp();
  const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  if (!downloadingMovie) return null;

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
            showToast(`🚀 Download started for ${downloadingMovie.title} (${option.quality})!`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      showToast(`⚡ VIP Ultra-Fast Download started: ${downloadingMovie.title} (${option.quality})`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      
      <div className="relative w-full max-w-2xl bg-[#0b0d14] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-neutral-900 to-transparent border-b border-white/5 flex items-start justify-between gap-4">
          <div className="flex gap-3.5">
            <div className="w-16 h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
              <img
                src={downloadingMovie.posterUrl}
                alt={downloadingMovie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-600/90 text-white rounded text-[10px] font-bold uppercase">
                  Download Center
                </span>
                <span className="text-xs text-neutral-400">
                  {downloadingMovie.releaseYear} • {downloadingMovie.duration}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white mt-1">
                {downloadingMovie.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                Select your preferred quality and file size. Low-bandwidth data saver options available for mobile users.
              </p>
            </div>
          </div>

          <button
            onClick={closeDownloadModal}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Options */}
        <div className="p-5 sm:p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
          
          {/* VIP Upgrade Banner */}
          {!subscription.isVip && (
            <div className="p-4 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-red-600/15 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Unlock 4K & 1080p Ultra-Fast VIP Downloads
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Pay <strong className="text-amber-400">MKW 2,000 for 7 Days</strong> via Airtel Money, Mpamba or Card to skip wait times & unlock 10Gbps direct links.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs shrink-0 shadow-lg shadow-amber-500/20"
              >
                Go VIP
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
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isLocked
                      ? 'bg-neutral-900/40 border-white/5 opacity-80'
                      : 'bg-neutral-900/80 border-white/10 hover:border-red-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      opt.isVipOnly 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      <HardDrive className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {opt.quality}
                        </h4>
                        {opt.isVipOnly && (
                          <span className="px-1.5 py-0.2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold rounded">
                            VIP ONLY
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span className="font-mono text-neutral-200 font-semibold">{opt.fileSize}</span>
                        <span>•</span>
                        <span>{opt.resolution}</span>
                        <span>•</span>
                        <span>{opt.format}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center gap-2">
                    {isCurrentlyDownloading ? (
                      <div className="px-4 py-2 bg-neutral-800 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Sponsor Ad: {countdown}s...</span>
                      </div>
                    ) : isLocked ? (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-neutral-800 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Unlock (MKW 2,000)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDownloadClick(opt)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition-all hover:scale-105"
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
        <div className="p-4 bg-neutral-950 border-t border-white/5 text-[11px] text-neutral-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>High-Speed SSL Encrypted Downloads</span>
          </div>
          <span className="text-neutral-400">Resumable in IDM / Mobile Browsers</span>
        </div>

      </div>

    </div>
  );
}
