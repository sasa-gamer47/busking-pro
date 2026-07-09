import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lyric Syn - Busking Manager",
  description: "Chords and setlist manager for live performances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Pulito il body: rimosso flex-row e ripristinato lo sfondo zinc-950 lineare */}
      <body className="h-screen w-screen bg-zinc-950 text-zinc-100 overflow-x-hidden font-sans relative">
  
        <Sidebar />

        <main className="w-full h-full relative overflow-x-hidden overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}