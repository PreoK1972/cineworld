'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Crown, Check, Smartphone, Lock, ArrowRight, Loader2, AlertCircle, Sparkles, Zap, Calendar } from 'lucide-react';

interface PlanOption {
  id: 'daily' | 'weekly' | 'monthly';
  name: string;
  durationDays: number;
  amountMkw: number;
  badge?: string;
  description: string;
}

const PLANS: PlanOption[] = [
  {
    id: 'daily',
    name: '1-Day Pass',
    durationDays: 1,
    amountMkw: 500,
    badge: 'Quick Pass',
    description: '24 hours 4K access',
  },
  {
    id: 'weekly',
    name: '7-Day Pass',
    durationDays: 7,
    amountMkw: 2000,
    badge: '🔥 Most Popular',
    description: 'Full week zero ads',
  },
  {
    id: 'monthly',
    name: '30-Day VIP',
    durationDays: 30,
    amountMkw: 7000,
    badge: '💎 Best Value',
    description: 'Save MKW 1,500',
  },
];

export default function PaychanguModal() {
  const { showPaymentModal, setShowPaymentModal, showToast } = useApp();
  
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(PLANS[1]); // Default 7-day
  const [selectedMethod, setSelectedMethod] = useState<'airtel' | 'mpamba' | 'bank'>('airtel');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [txId, setTxId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<'plan' | 'payment' | 'success'>('plan');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!showPaymentModal) return null;

  const handleSubmitVerification = () => {
    if (!phoneNumber.trim() || !txId.trim()) {
      setErrorMessage('Please enter your phone number and the SMS Transaction ID.');
      return;
    }
    
    setIsProcessing(true);
    setErrorMessage(null);

    // Simulate network delay and store transaction
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('cineworld_pending_payments') || '[]');
        const newTx = {
          id: Math.random().toString(36).substring(7),
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          amountMkw: selectedPlan.amountMkw,
          days: selectedPlan.durationDays,
          method: selectedMethod,
          phone: phoneNumber,
          txId: txId,
          date: new Date().toISOString(),
          status: 'Pending Verification'
        };
        localStorage.setItem('cineworld_pending_payments', JSON.stringify([newTx, ...existing]));
      } catch (e) {
        console.error(e);
      }

      setIsProcessing(false);
      setStep('success');
    }, 1200);
  };

  const handleClose = () => {
    setShowPaymentModal(false);
    setStep('plan');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/95 backdrop-blur-2xl overflow-y-auto">
      
      <div className="relative w-full max-w-lg bg-[#0c0e17] rounded-t-3xl sm:rounded-3xl border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden my-0 sm:my-auto flex flex-col max-h-[94dvh] sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="relative p-4 sm:p-6 pt-[max(1rem,env(safe-area-inset-top,1rem))] bg-gradient-to-br from-amber-600/30 via-red-600/20 to-neutral-950 border-b border-white/10 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-[11px] sm:text-xs font-bold">
              <Crown className="w-3.5 h-3.5 fill-amber-400" />
              <span>CineWorld VIP Pass</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white pt-0.5">
              MKW {selectedPlan.amountMkw.toLocaleString()} <span className="text-xs sm:text-sm font-medium text-neutral-400">/ {selectedPlan.durationDays} Day{selectedPlan.durationDays > 1 ? 's' : ''}</span>
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all tap-target flex items-center justify-center"
            aria-label="Close payment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto scroll-touch flex-1 pb-[max(1rem,env(safe-area-inset-bottom,1rem))]">
          
          {step === 'plan' && (
            <div className="space-y-3.5">
              
              {/* Plan Tier Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose Your VIP Duration:</span>
                </label>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {PLANS.map((plan) => {
                    const isSelected = selectedPlan.id === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-2 sm:p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative active:scale-95 ${
                          isSelected
                            ? 'bg-gradient-to-b from-amber-500/20 to-red-600/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                            : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:bg-neutral-800'
                        }`}
                      >
                        {plan.badge && (
                          <span className={`text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.2 rounded-full mb-1 inline-block truncate max-w-full ${
                            isSelected ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {plan.badge}
                          </span>
                        )}
                        <div>
                          <div className="text-[11px] sm:text-xs font-black text-white">{plan.name}</div>
                          <div className="text-[11px] sm:text-xs font-bold text-amber-400 mt-0.5">
                            MKW {plan.amountMkw.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-neutral-400 mt-0.5 leading-tight line-clamp-1">
                          {plan.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VIP Benefits */}
              <div className="space-y-1 bg-neutral-900/60 p-2.5 sm:p-3 rounded-2xl border border-white/5 text-[10px] sm:text-[11px] text-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Zero Ads:</strong> No countdowns or popups</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Unlimited 4K Downloads:</strong> Direct high-speed mirrors</span>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send <strong>MKW {selectedPlan.amountMkw.toLocaleString()}</strong> to:</span>
                  </span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('airtel')}
                    className={`p-2.5 rounded-xl border text-left flex sm:flex-col justify-between items-center sm:items-start transition-all active:scale-95 ${
                      selectedMethod === 'airtel'
                        ? 'bg-red-600/20 border-red-500 text-white'
                        : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">Airtel Money</span>
                      <span className="text-[10px] text-neutral-400">Tamara Gausi</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-red-400">0999898896</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('mpamba')}
                    className={`p-2.5 rounded-xl border text-left flex sm:flex-col justify-between items-center sm:items-start transition-all active:scale-95 ${
                      selectedMethod === 'mpamba'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white'
                        : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">TNM Mpamba</span>
                      <span className="text-[10px] text-neutral-400">Prince Kasalika</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">0892727574</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bank')}
                    className={`p-2.5 rounded-xl border text-left flex sm:flex-col justify-between items-center sm:items-start transition-all active:scale-95 ${
                      selectedMethod === 'bank'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">Malawi Bank</span>
                      <span className="text-[10px] text-neutral-400">Prince Kasalika</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-400">1008434146</span>
                  </button>
                </div>
              </div>

              {/* Submit Reference Form */}
              <div className="space-y-2 pt-0.5">
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-neutral-300 font-medium">Your Mobile Number:</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 0991234567 or 0881234567"
                      className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-neutral-300 font-medium">SMS Transaction ID / Reference:</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      inputMode="text"
                      autoCapitalize="characters"
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                      placeholder="e.g. PP240827.1234 or Bank Ref"
                      className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-red-600/20 border border-red-500/40 rounded-xl text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmitVerification}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-400 hover:via-rose-500 hover:to-red-500 text-white font-bold rounded-xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-[0.98] tap-target"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Submit MKW {selectedPlan.amountMkw.toLocaleString()} for {selectedPlan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/40 shadow-lg shadow-amber-500/20">
                <Crown className="w-7 h-7 fill-amber-400" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Payment Submitted!
                </h3>
                <p className="text-xs text-neutral-300 max-w-xs mx-auto leading-relaxed">
                  We received your request for <strong>{selectedPlan.name} (MKW {selectedPlan.amountMkw.toLocaleString()})</strong>.
                  <br />Transaction ID: <strong className="text-amber-400 font-mono">{txId}</strong>
                  <br /><br />Admin will approve your VIP within moments!
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all mt-2 active:scale-95 tap-target"
              >
                Close & Continue Watching
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );

}
