import type { Metadata } from "next";
// 1. Importa i font da next/font/google
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

// 2. Inizializzali configurando i sottoinsiemi (subsets) e le variabili CSS
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
      <body className="min-h-full flex flex-col">
        <Sidebar />
        <main className="">
          {children}
        </main>
       </body>
    </html>
  );
}


// MLRFmaZmKeUGEq8W