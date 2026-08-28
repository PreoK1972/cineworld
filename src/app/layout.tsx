import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import AdNetworkScripts from "@/components/AdNetworkScripts";

export const metadata: Metadata = {
  title: "CineWorld — Free Movies, TV Series, Animations & Fast Downloads",
  description: "Stream and download free movies, series, and animations in HD & 4K. Zero buffers, multi-server streaming, and VIP ad-free pass for MKW 2,000 via Airtel Money & Mpamba.",
  keywords: ["movies", "streaming", "download movies", "free series", "4k streaming", "malawi movies", "cineworld", "moviebox"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08090d] text-neutral-100 min-h-screen antialiased">
        <AppProvider>
          <AdNetworkScripts />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
