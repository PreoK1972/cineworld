'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-neutral-900/95 border border-red-500/40 text-white px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-xl animate-bounce">
      <div className="p-1.5 bg-red-600/20 text-red-400 rounded-lg">
        <Sparkles className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-gray-100">{toastMessage}</p>
    </div>
  );
}
