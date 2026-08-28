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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md">
      
      <div className="relative w-full max-w-2xl bg-[#090b12] border-l border-white/10 h-full overflow-y-auto flex flex-col p-6 space-y-6 shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Monetization & CPM Dashboard
              </h2>
              <p className="text-xs text-neutral-400">
                Live Earnings Simulator for CineWorld
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMonetizationDrawer(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Projected Monthly Revenue Card */}
        <div className="p-5 bg-gradient-to-br from-emerald-600/20 via-neutral-900 to-neutral-950 border border-emerald-500/30 rounded-3xl space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Projected Total Monthly Earnings
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full">Active Formula</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                ${grandTotalUsd.toLocaleString()} <span className="text-sm font-normal text-neutral-400">USD / mo</span>
              </div>
              <div className="text-sm font-semibold text-emerald-400 mt-1">
                ≈ MKW {grandTotalMkw.toLocaleString()} / month
              </div>
            </div>

            <div className="text-xs text-neutral-400 sm:text-right">
              <div>Ad CPM: <strong className="text-white">${totalAdRevenueUsd.toLocaleString()}</strong></div>
              <div>Subs (MKW 2k): <strong className="text-white">${totalSubRevenueUsd.toLocaleString()}</strong></div>
            </div>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-4 bg-neutral-900/60 p-5 rounded-2xl border border-white/5">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            Adjust Traffic & Subscriber Metrics
          </h3>

          {/* Monthly Visitors Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Monthly Visitors:</span>
              <span className="font-bold text-white font-mono">{monthlyVisitors.toLocaleString()} users</span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={monthlyVisitors}
              onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          {/* Page Views Per User */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Page Views & Video Plays / User:</span>
              <span className="font-bold text-white font-mono">{pageviewsPerUser} impressions</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={pageviewsPerUser}
              onChange={(e) => setPageviewsPerUser(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          {/* Global Tier 1 Percentage (US/UK/EU) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">High CPM Global Traffic (US/UK/EU):</span>
              <span className="font-bold text-amber-400 font-mono">{tier1Percent}% ($8.50 CPM)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={tier1Percent}
              onChange={(e) => setTier1Percent(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-neutral-400">
              Going global gives you high CPMs ($8–$12) compared to regional-only traffic.
            </p>
          </div>

          {/* Subscriptions Sold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Subscribers Paying MKW 2,000 / 7 Days:</span>
              <span className="font-bold text-emerald-400 font-mono">{payingSubscribers} members</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={payingSubscribers}
              onChange={(e) => setPayingSubscribers(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* How CPM and Payouts Work Explained */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            How You Get Paid in Malawi & Globally
          </h3>

          <div className="space-y-2.5 text-xs text-neutral-300">
            
            {/* Step 1: Ad Networks */}
            <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-[10px]">1</span>
                <span>Ad Networks (PropellerAds / AdSterra / AdSense)</span>
              </div>
              <p className="text-neutral-400 text-[11px] pl-7">
                You create a free publisher account. Paste the script tag into CineWorld. Every 1,000 video pre-roll or banner views accumulates CPM revenue in your dashboard.
              </p>
            </div>

            {/* Step 2: Receiving USD via Payoneer */}
            <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center text-[10px]">2</span>
                <span>Receiving USD via Payoneer (Free)</span>
              </div>
              <p className="text-neutral-400 text-[11px] pl-7">
                Open a free account at <strong>Payoneer.com</strong>. You get a US virtual routing and account number. Ad networks wire money to your Payoneer in USD, and you withdraw straight to your local Malawi bank (NBS, National Bank, FDH) or Airtel Money in MKW.
              </p>
            </div>

            {/* Step 3: Paychangu Subscriptions */}
            <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-[10px]">3</span>
                <span>Direct MKW 2,000 VIP Subscriptions via Paychangu</span>
              </div>
              <p className="text-neutral-400 text-[11px] pl-7">
                Local users pay directly via <strong>Airtel Money</strong>, <strong>TNM Mpamba</strong>, or local bank apps. Paychangu handles the instant settlement and deposits your earnings directly into your registered bank or mobile wallet.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
