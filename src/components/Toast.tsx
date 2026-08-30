'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center gap-3 bg-neutral-900/95 border border-red-500/40 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl animate-fade-in max-w-md mx-auto sm:mx-0">
      <div className="p-1.5 bg-red-600/20 text-red-400 rounded-xl shrink-0">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-100 line-clamp-2">{toastMessage}</p>
    </div>
  );
}

