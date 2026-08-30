'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  CreditCard, 
  Layers, 
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  Calculator
} from 'lucide-react';

export default function MonetizationDrawer() {
  const { showMonetizationDrawer, setShowMonetizationDrawer } = useApp();

  // Simulator state
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(50000);
  const [pageviewsPerUser, setPageviewsPerUser] = useState<number>(4);
  const [tier1Percent, setTier1Percent] = useState<number>(40); // 40% US/UK/EU
  const [payingSubscribers, setPayingSubscribers] = useState<number>(250);

  if (!showMonetizationDrawer) return null;

  // Calculation logic
  const totalImpressions = monthlyVisitors * pageviewsPerUser;
  
  // Tier 1 CPM average ($8.50) vs Tier 3 ($2.00)
  const tier1Impressions = totalImpressions * (tier1Percent / 100);
  const tier3Impressions = totalImpressions * ((100 - tier1Percent) / 100);
  
  const adRevenueTier1 = (tier1Impressions / 1000) * 8.50;
  const adRevenueTier3 = (tier3Impressions / 1000) * 2.00;
  const totalAdRevenueUsd = Math.round(adRevenueTier1 + adRevenueTier3);

  // Subscription revenue (MKW 2,000 / 7 days = ~MKW 8,000 / month per user = ~$4.40 USD)
  const mkwPerMonthPerSub = 8000;
  const totalSubRevenueMkw = payingSubscribers * mkwPerMonthPerSub;
  const totalSubRevenueUsd = Math.round(totalSubRevenueMkw / 1800); // 1 USD = ~1,800 MKW

  const grandTotalUsd = totalAdRevenueUsd + totalSubRevenueUsd;
  const grandTotalMkw = Math.round(grandTotalUsd * 1800);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-md">
      
      <div className="relative w-full max-w-2xl bg-[#090b12] border-l border-white/10 h-full overflow-y-auto scroll-touch flex flex-col p-4 sm:p-6 pt-[max(1rem,env(safe-area-inset-top,1rem))] pb-[max(1rem,env(safe-area-inset-bottom,1rem))] space-y-4 sm:space-y-6 shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Monetization Dashboard
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-400">
                Live Earnings Simulator for CineWorld
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMonetizationDrawer(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl tap-target flex items-center justify-center"
            aria-label="Close monetization dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Projected Monthly Revenue Card */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-600/20 via-neutral-900 to-neutral-950 border border-emerald-500/30 rounded-2xl sm:rounded-3xl space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-emerald-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Projected Monthly Earnings
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full text-[10px]">Active Formula</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-4xl font-black text-white">
                ${grandTotalUsd.toLocaleString()} <span className="text-xs sm:text-sm font-normal text-neutral-400">USD / mo</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-400 mt-0.5">
                ≈ MKW {grandTotalMkw.toLocaleString()} / month
              </div>
            </div>

            <div className="text-[11px] sm:text-xs text-neutral-400 sm:text-right">
              <div>Ad CPM: <strong className="text-white">${totalAdRevenueUsd.toLocaleString()}</strong></div>
              <div>Subs (MKW 2k): <strong className="text-white">${totalSubRevenueUsd.toLocaleString()}</strong></div>
            </div>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-3.5 bg-neutral-900/60 p-4 sm:p-5 rounded-2xl border border-white/5">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            Adjust Traffic & Subscriber Metrics
          </h3>

          {/* Monthly Visitors Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Monthly Visitors:</span>
              <span className="font-bold text-white font-mono">{monthlyVisitors.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={monthlyVisitors}
              onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-5 sm:h-2"
            />
          </div>

          {/* Page Views Per User */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Page Views & Video Plays / User:</span>
              <span className="font-bold text-white font-mono">{pageviewsPerUser}</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={pageviewsPerUser}
              onChange={(e) => setPageviewsPerUser(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-5 sm:h-2"
            />
          </div>

          {/* Global Tier 1 Percentage (US/UK/EU) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">High CPM Traffic (US/UK/EU):</span>
              <span className="font-bold text-amber-400 font-mono">{tier1Percent}% ($8.50 CPM)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={tier1Percent}
              onChange={(e) => setTier1Percent(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-5 sm:h-2"
            />
          </div>

          {/* Subscriptions Sold */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">VIP Subscribers (MKW 2k):</span>
              <span className="font-bold text-emerald-400 font-mono">{payingSubscribers} members</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={payingSubscribers}
              onChange={(e) => setPayingSubscribers(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-5 sm:h-2"
            />
          </div>
        </div>

        {/* How CPM and Payouts Work Explained */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            How You Get Paid in Malawi & Globally
          </h3>

          <div className="space-y-2 text-xs text-neutral-300">
            
            {/* Step 1: Ad Networks */}
            <div className="p-3 bg-neutral-900/60 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-4 h-4 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-[10px]">1</span>
                <span>Ad Networks (PropellerAds / AdSterra / AdSense)</span>
              </div>
              <p className="text-neutral-400 text-[11px] pl-6">
                Paste the script tag into CineWorld. Every 1,000 video pre-roll or banner views accumulates CPM revenue.
              </p>
            </div>

            {/* Step 2: Receiving USD via Payoneer */}
            <div className="p-3 bg-neutral-900/60 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-4 h-4 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center text-[10px]">2</span>
                <span>Receiving USD via Payoneer / Crypto (Free)</span>
              </div>
              <p className="text-neutral-400 text-[11px] pl-6">
                Ad networks wire USD to your Payoneer or USDT TRC-20 wallet. Withdraw directly to Malawi Bank, Airtel Money, or Mpamba.
              </p>
            </div>

            {/* Step 3: Paychangu Subscriptions */}
            <div className="p-3 bg-neutral-900/60 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-4 h-4 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-[10px]">3</span>
                <span>Direct MKW 2,000 VIP Subscriptions</span>
              </div>
              <p className="text-neutral-400 text-[11px] pl-6">
                Users pay via <strong>Airtel Money</strong>, <strong>TNM Mpamba</strong>, or local bank apps directly to your registered accounts.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );

}
