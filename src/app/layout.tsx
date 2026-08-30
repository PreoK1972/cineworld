import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import AdNetworkScripts from "@/components/AdNetworkScripts";
import MobileBottomNav from "@/components/MobileBottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#08090d",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: "CineWorld — Free Movies, TV Series, Animations & Fast Downloads",
  description: "Stream and download free movies, series, and animations in HD & 4K. Zero buffers, multi-server streaming, and VIP ad-free pass for MKW 2,000 via Airtel Money & Mpamba.",
  keywords: ["movies", "streaming", "download movies", "free series", "4k streaming", "malawi movies", "cineworld", "moviebox"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CineWorld",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-touch">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#08090d" />
      </head>
      <body className="bg-[#08090d] text-neutral-100 min-h-screen-dvh antialiased selection:bg-red-500 selection:text-white pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <AppProvider>
          <AdNetworkScripts />
          {children}
          <MobileBottomNav />
        </AppProvider>
      </body>
    </html>
  );
}

