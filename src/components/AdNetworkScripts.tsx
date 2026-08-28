'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export default function AdNetworkScripts() {
  const { subscription, adSettings } = useApp();

  useEffect(() => {
    // Only load publisher ads for non-VIP users when ads are globally enabled
    if (subscription.isVip || !adSettings.adsEnabled) {
      return;
    }

    // 1. PropellerAds Publisher Script Injector
    const propellerZone = adSettings.propellerAdsZoneId || process.env.NEXT_PUBLIC_PROPELLER_ZONE_ID;
    if (propellerZone && propellerZone !== 'your-propeller-zone-id') {
      const script = document.createElement('script');
      script.src = `https://alwingulla.com/88/tag.min.js?zone=${propellerZone}`;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      document.head.appendChild(script);
    }

    // 2. AdSterra Publisher Script Injector
    const adsteraKey = adSettings.adsteraKey || process.env.NEXT_PUBLIC_ADSTERRA_KEY;
    if (adsteraKey && adsteraKey !== 'your-adsterra-key') {
      const script = document.createElement('script');
      script.src = `//pl189201.gigascript.com/${adsteraKey}/invoke.js`;
      script.async = true;
      document.head.appendChild(script);
    }

    // 3. HilltopAds Video VAST Pre-Roll Injector (Top Paying for Streaming)
    const hilltopZone = process.env.NEXT_PUBLIC_HILLTOP_ZONE_ID;
    if (hilltopZone && hilltopZone !== 'your-hilltopads-zone-id') {
      const script = document.createElement('script');
      script.src = `//cdn.hilltopads.net/vast/player.js?zone=${hilltopZone}`;
      script.async = true;
      document.head.appendChild(script);
    }

    // 4. ExoClick Pre-Roll & Banner Tag Injector
    const exoclickZone = process.env.NEXT_PUBLIC_EXOCLICK_ZONE_ID;
    if (exoclickZone && exoclickZone !== 'your-exoclick-zone-id') {
      const script = document.createElement('script');
      script.src = `https://a.exoclick.com/tag_publishers.js`;
      script.async = true;
      document.head.appendChild(script);
    }

  }, [subscription.isVip, adSettings]);

  return null; // Silent injector
}
