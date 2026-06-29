"use client";

import { useState } from "react";
import Link from "next/link";

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full h-15 px-4 flex items-center justify-between bg-zinc-900/30 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          
          {/* TASTO HAMBURGER: Visibile solo sotto il breakpoint desktop (lg:hidden) */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-zinc-200 active:scale-95 transition-all"
            aria-label="Apri menu navigazione"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          
          {/* Titolo della pagina attuale */}
          <h1 className="text-lg font-bold text-zinc-100">Dashboard</h1>
        </div>

        {/* Zona destra della Topbar (Profilo, notifiche o altro se presenti) */}
        <div className="text-sm text-zinc-400">
          {/* Inserisci qui eventuali elementi già presenti nella tua vecchia Topbar */}
        </div>
      </header>

      {/* MENU MOBILE OVERLAY A SCHERMO INTERO */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-zinc-950 z-50 flex flex-col p-6 animate-in fade-in slide-in-from-bottom duration-200">
          
          {/* Header del Menu Mobile */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <span className="text-lg font-bold text-orange-500 tracking-wider">LOGIC LOOM</span>
            
            {/* Pulsante per Chiudere il Menu */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* NAVIGAZIONE INTERNA (Adatta i Link con le tue rotte reali) */}
          <nav className="flex flex-col gap-3 mt-8 text-lg font-medium text-zinc-300">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)} 
              className="hover:text-orange-400 p-3 rounded-xl hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-800/40"
            >
              Home Dashboard
            </Link>
            <Link 
              href="/songs" 
              onClick={() => setIsMenuOpen(false)} 
              className="hover:text-orange-400 p-3 rounded-xl hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-800/40"
            >
              Canzoni & Testi
            </Link>
            <Link 
              href="/setlists" 
              onClick={() => setIsMenuOpen(false)} 
              className="hover:text-orange-400 p-3 rounded-xl hover:bg-zinc-900/60 transition-all border border-transparent hover:border-zinc-800/40"
            >
              Scalette Live
            </Link>
          </nav>

          {/* Footer del menu mobile */}
          <div className="mt-auto text-center text-xs text-zinc-600 border-t border-zinc-900 pt-4">
            Logic Loom Devlog
          </div>

        </div>
      )}
    </>
  );
}