/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import React from 'react'
import Image from 'next/image'
import UserIcon from '@/imgs/user-icon.png'
import SidebarSetlist from './SidebarSetlist'
import SidebarSong from './SidebarSong'
import SidebarSearch from './SidebarSearch'

import { createClient } from "@/lib/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { LogOut, Music, ListMusic } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getRecentSetlists, getRecentSongs } from '@/lib/utils/actions';

const Sidebar = async () => {
  const supabase = await createClient()
  const response = await (supabase.auth as any).getUser()
  const user = response.data?.user

  let profile = null
  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    if (!error) profile = data
  }

  const handleLogout = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/login")
  }

  const recentSongs = await getRecentSongs(10)
  const recentSetlists = await getRecentSetlists(10)

  return (
    <>
      {/* 1. INTERRUTTORE DI STATO NASCOSTO (Checkbox Hack) */}
      <input type="checkbox" id="sidebar-toggle" className="hidden peer" />

      {/* 2. PULSANTE HAMBURGER: Visibile solo su Mobile/Tablet (lg:hidden) */}
      <label 
        htmlFor="sidebar-toggle" 
        className="lg:hidden fixed top-3 left-4 z-40 flex items-center justify-center p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 active:scale-95 transition-all cursor-pointer shadow-md shadow-black/40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </label>

      {/* 3. BACKDROP SFOCATO: Oscura lo sfondo su mobile quando la sidebar è aperta. Cliccandoci sopra, si chiude */}
      <label 
        htmlFor="sidebar-toggle" 
        className="hidden peer-checked:max-lg:block fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 cursor-pointer"
      />

      {/* 4. CONTENITORE SIDEBAR: Adattivo e fluido */}
      {/* Su Mobile/Tablet diventa un overlay a schermo intero nascosto a sinistra (-translate-x-full), che slitta in avanti quando attivato (peer-checked:translate-x-0) */}
      {/* Su PC Desktop (lg:) si reimposta esattamente come prima (w-1/5 fissa, bloccata a schermo e sempre visibile) */}
      <div className="fixed left-0 top-0 h-screen bg-zinc-950 text-gray-400 flex flex-col z-50 shadow-lg border-r border-zinc-800 select-none transition-transform duration-300 ease-in-out
        w-full -translate-x-full peer-checked:translate-x-0
        lg:w-1/5 lg:translate-x-0"
      >
        
        {/* Intestazione Applicazione (Incluso pulsante di chiusura su mobile) */}
        <div className="w-full h-20 px-6 flex justify-between lg:justify-center items-center shrink-0 border-b border-zinc-900">
          <Link href="/" className="text-3xl font-black tracking-wider text-white hover:text-orange-500 transition cursor-pointer">
            BUSKING PRO
          </Link>

          {/* Tasto Chiudi X: compare solo dentro l'overlay mobile ad altezza pollice */}
          <label 
            htmlFor="sidebar-toggle" 
            className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </label>
        </div>

        {/* Input di Ricerca Dedicato */}
        <SidebarSearch />

        {/* Contenitore Dinamico Principale */}
        <div className="flex-1 w-full flex flex-col overflow-hidden px-4 pb-4 gap-y-2">
          
          {/* Sezione Scalette */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between py-2 shrink-0">
              <p className="text-zinc-500 font-bold text-xs tracking-wider uppercase">Le mie scalette</p>
              <Link href="/setlists" className="text-xs text-orange-500 font-semibold hover:underline flex items-center gap-x-1 cursor-pointer">
                <ListMusic size={14} />
                Vedi tutte
              </Link>
            </div>
            <div className="w-full flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
              {recentSetlists && recentSetlists.length > 0 ? (
                recentSetlists.map((setlist: any, index: number) => (
                  <SidebarSetlist key={index} id={setlist.id} title={setlist.title} />
                ))
              ) : (
                <p className="text-xs text-zinc-600 italic py-2">Nessuna scaletta creata</p>
              )}
            </div>
          </div>

          {/* Sezione Canzoni */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between py-2 shrink-0">
              <p className="text-zinc-500 font-bold text-xs tracking-wider uppercase">Le mie canzoni</p>
              <Link href="/songs" className="text-xs text-orange-500 font-semibold hover:underline flex items-center gap-x-1 cursor-pointer">
                <Music size={14} />
                Vedi tutte
              </Link>
            </div>
            <div className="w-full flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
              {recentSongs && recentSongs.length > 0 ? (
                recentSongs.map((song: any, index: number) => (
                  <SidebarSong key={index} id={song.id} title={song.title} artist={song.artist || ""} />
                ))
              ) : (
                <p className="text-xs text-zinc-600 italic py-2">Nessun brano salvato</p>
              )}
            </div>
          </div>

        </div>

        {/* Footer Utente o Tasto Login */}
        <div className="w-full h-20 px-4 flex items-center border-t border-zinc-900 bg-zinc-950 shrink-0">
          <div className="w-full flex items-center justify-between">
            {user && profile ? (
              <>
                <div className="flex items-center gap-x-3 overflow-hidden flex-1">
                  <div className="relative h-10 w-10 shrink-0">
                    <Image src={UserIcon} alt="user icon" fill className="rounded-full object-cover border border-zinc-800" />
                  </div>
                  <div className="flex flex-col overflow-hidden text-left">
                    <p className="text-sm font-semibold text-zinc-200 leading-tight truncate">{profile.full_name}</p>
                    <p className="text-xs text-zinc-500 truncate">@{profile.username}</p>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="ghost" size="icon" className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer h-9 w-9 rounded-lg shrink-0 transition ml-2">
                  <LogOut size={18} /> 
                </Button>
              </>
            ) : (
              <Link href="/login" className="w-full">
                <Button className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition">
                  Accedi / Login
                </Button>
              </Link>
            )}
          </div>
        </div>

      </div>
    </>
  )
}

export default Sidebar