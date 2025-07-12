// src/app/layout.tsx
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cinephile - Movie Watchlist",
  description: "Track and favourite your movies easily",
  icons: {
    icon: "/cinephile-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Navbar />
        <main className="p-4 max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
