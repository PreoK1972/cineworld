'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Crown, Check, Smartphone, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function PaychanguModal() {
  const { showPaymentModal, setShowPaymentModal, showToast } = useApp();
  
  const [selectedMethod, setSelectedMethod] = useState<'airtel' | 'mpamba' | 'bank'>('airtel');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [txId, setTxId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<'plan' | 'payment' | 'success'>('plan');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!showPaymentModal) return null;

  const handleSubmitVerification = () => {
    if (!phoneNumber || !txId) {
      setErrorMessage('Please enter your phone number and the SMS Transaction ID.');
      return;
    }
    
    setIsProcessing(true);
    setErrorMessage(null);

    // Simulate network delay
    setTimeout(() => {
      // Save to localStorage for Admin to verify later
      try {
        const existing = JSON.parse(localStorage.getItem('cineworld_pending_payments') || '[]');
        const newTx = {
          id: Math.random().toString(36).substring(7),
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
    }, 1500);
  };

  const handleClose = () => {
    setShowPaymentModal(false);
    setStep('plan');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      
      <div className="relative w-full max-w-lg bg-[#0c0e17] rounded-3xl border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden my-auto flex flex-col mt-10">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-amber-600/30 via-red-600/20 to-neutral-950 border-b border-white/10 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-xs font-bold">
              <Crown className="w-3.5 h-3.5 fill-amber-400" />
              <span>CineWorld VIP Pass</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
              MKW 2,000 <span className="text-sm font-medium text-neutral-400">/ 7 Days</span>
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content steps */}
        <div className="p-6 space-y-5">
          
          {step === 'plan' && (
            <div className="space-y-5">
              
              <div className="space-y-2.5 bg-neutral-900/60 p-4 rounded-2xl border border-white/5 text-xs text-neutral-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>100% Zero Ads</strong> (Stream movies and series with 0 interruptions)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span><strong>Unlimited 4K HDR & 1080p Downloads</strong></span>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> 
                  Step 1: Send MKW 2,000
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedMethod('airtel')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'airtel'
                        ? 'bg-red-600/20 border-red-500 text-white'
                        : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="font-bold text-sm">Airtel Money</span>
                    <span className="text-xs font-mono mt-1 text-red-400">0999898896</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">Tamara Gausi</span>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('mpamba')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'mpamba'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white'
                        : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="font-bold text-sm">TNM Mpamba</span>
                    <span className="text-xs font-mono mt-1 text-emerald-400">0892727574</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">Prince Kasalika</span>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('bank')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'bank'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-neutral-900/60 border-white/10 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="font-bold text-sm">Malawi Bank</span>
                    <span className="text-xs font-mono mt-1 text-blue-400">1008434146</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">Prince Kasalika</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-neutral-200">
                  Step 2: Submit Verification
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Your Phone Number</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 0991234567"
                      className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">SMS Transaction ID / Reference</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                      placeholder="e.g. PP240827.1234 or Bank Ref"
                      className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-xl text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitVerification}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-400 hover:via-rose-500 hover:to-red-500 text-white font-bold rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 text-sm transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Submit for VIP Activation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/40 shadow-lg shadow-amber-500/20">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">
                  Payment Submitted!
                </h3>
                <p className="text-xs text-neutral-300 max-w-xs mx-auto">
                  We have received your request. Admin is verifying your Transaction ID: <strong className="text-amber-400">{txId}</strong>. 
                  <br/><br/>Your VIP will be activated shortly!
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-sm transition-all mt-4"
              >
                Close & Wait
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
