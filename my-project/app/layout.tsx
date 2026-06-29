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
      <body className="h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans relative">
        
        {/* La Sidebar si autogestisce al 100%: fixed su PC (20%) e overlay a scorrimento su mobile */}
        <Sidebar />

        {/* Il main torna a occupare tutto lo schermo (w-full). 
            In questo modo, i distanziatori che hai già dentro le pagine riempiranno perfettamente quel vuoto */}
        <main className="w-full h-full relative overflow-hidden">
          {children}
        </main>

      </body>
    </html>
  );
}