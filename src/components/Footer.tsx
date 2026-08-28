'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { Film, ShieldCheck, Heart, Crown, Globe, Lock } from 'lucide-react';

export default function Footer() {
  const { setActiveCategory, setShowPaymentModal } = useApp();

  return (
    <footer className="mt-20 bg-[#06070a] border-t border-white/10 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white">
                CINE<span className="text-red-500">WORLD</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The premier free streaming and download platform for movies, TV series, animations, and African cinema.
            </p>
            <div className="flex items-center gap-2 pt-1 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Free Streaming Supported by Ads</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Browse Categories
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => setActiveCategory('Movies')} className="hover:text-white transition-colors">
                  Popular Movies
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('TV Series')} className="hover:text-white transition-colors">
                  TV Series & Shows
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('Animation & Anime')} className="hover:text-white transition-colors">
                  Animations & Anime
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('African Cinema')} className="hover:text-amber-400 transition-colors">
                  African Cinema & Nollywood
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('Trending')} className="hover:text-red-400 transition-colors">
                  Trending Now 🔥
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: VIP & Payments */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              VIP Membership
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  onClick={() => setShowPaymentModal(true)} 
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <Crown className="w-3 h-3" />
                  <span>VIP Pass (MKW 2,000 / 7 Days)</span>
                </button>
              </li>
              <li>
                <span className="text-neutral-400">Accepted: Airtel Money, TNM Mpamba, Bank, Cards</span>
              </li>
              <li>
                <span className="text-neutral-400">Instant Automated Activation</span>
              </li>
              <li>
                <span className="text-neutral-400">Unlimited 4K HDR Downloads</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & DMCA */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Legal & Compliance
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              <strong>DMCA Disclaimer:</strong> CineWorld does not host or store any video files on its servers. All streams are embedded from non-affiliated third-party media hosting services (VidSrc, 2Embed, SuperEmbed).
            </p>
            <div className="flex gap-3 text-[11px] text-neutral-400 pt-1">
              <a href="#" className="hover:underline">DMCA Policy</a>
              <span>•</span>
              <a href="#" className="hover:underline">Terms of Use</a>
              <span>•</span>
              <a href="#" className="hover:underline">Privacy</a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} CineWorld. Built for global streaming & local payment flexibility.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link 
              href="/admin" 
              className="text-neutral-400 hover:text-neutral-400 flex items-center gap-1 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
