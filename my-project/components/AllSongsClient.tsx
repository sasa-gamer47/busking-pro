"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Music, Plus, SlidersHorizontal, ArrowUpDown, Clock, Hash, Trash2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/utils/format"
import { createClient } from "@/lib/utils/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Song {
  id: string
  title: string
  artist: string
  original_key: string
  duration: number
  bpm: number
  created_at?: string
}

interface AllSongsClientProps {
  initialSongs: Song[]
}

type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc" | "bpm-desc" | "bpm-asc" | "duration-desc" | "duration-asc"

export default function AllSongsClient({ initialSongs }: AllSongsClientProps) {
  const searchParams = useSearchParams()
  
  // Stato locale dei brani per gestire l'eliminazione reattiva
  const [songs, setSongs] = useState<Song[]>(initialSongs)
  const [localSearchQuery, setLocalSearchQuery] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")
  const [keyFilter, setKeyFilter] = useState<string>("all")

  // Genera l'elenco delle chiavi uniche basandosi sui brani correnti
  const uniqueKeys = Array.from(new Set(songs.map(s => s.original_key))).sort()

  const urlQuery = searchParams.get("search") || ""
  const searchQuery = localSearchQuery !== null ? localSearchQuery : urlQuery

  // --- FUNZIONE PER ELIMINARE UN BRANO ---
  const handleDelete = async (e: React.MouseEvent, songId: string, songTitle: string) => {
    // Blocca la propagazione per evitare che il click apra il Link della card
    e.preventDefault()
    e.stopPropagation()

    const confirmDelete = window.confirm(`Sei sicuro di voler eliminare definitivamente "${songTitle}"?`)
    if (!confirmDelete) return

    const supabase = createClient()
    
    // Rimozione dal database Supabase
    const { error } = await supabase
      .from("songs")
      .delete()
      .eq("id", songId)

    if (error) {
      console.error("Errore durante l'eliminazione:", error)
      alert("Impossibile eliminare il brano: " + error.message)
    } else {
      // Aggiorna lo stato locale escludendo il brano eliminato
      setSongs(songs.filter(song => song.id !== songId))
    }
  }

  // 1. Filtro in tempo reale
  const filteredSongs = songs.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesKey = keyFilter === "all" || song.original_key === keyFilter
    return matchesSearch && matchesKey
  })

  // 2. Ordinamento accurato (Date, Titoli, BPM e Durate)
  const sortedSongs = [...filteredSongs].sort((a, b) => {
    switch (sortBy) {
      case "date-desc": {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
        return timeB - timeA
      }
      case "date-asc": {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
        return timeA - timeB
      }
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      case "bpm-desc":
        return b.bpm - a.bpm
      case "bpm-asc":
        return a.bpm - b.bpm
      case "duration-desc":
        return b.duration - a.duration
      case "duration-asc":
        return a.duration - b.duration
      default:
        return 0
    }
  })

  return (
    <div className="w-full h-full p-10 flex flex-col gap-y-6">
      {/* Header della sezione */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-4 w-full">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">I Miei Brani</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Gestisci, visualizza e cerca all&apos;interno del tuo catalogo musicale ({songs.length} brani).
          </p>
        </div>
        
        <Link href="/songs/create">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-5 rounded-xl transition duration-200 hover:-translate-y-0.5 cursor-pointer">
            <Plus className="mr-2 h-5 w-5" />
            Nuovo Brano
          </Button>
        </Link>
      </div>

      <div className="bg-zinc-800 h-0.5 w-full"></div>

      {/* Controlli di ricerca e ordinamento */}
      <div className="w-full flex items-center gap-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 text-zinc-500 h-4 w-4 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Cerca per titolo, artista..."
            value={searchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border-zinc-800 focus-visible:ring-orange-500 pl-11 py-6 text-white text-base rounded-xl placeholder-zinc-600"
          />
        </div>

        {/* Menu di Ordinamento shadcn/ui */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-white h-12 px-4 rounded-xl gap-x-2 cursor-pointer shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Ordina</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300 rounded-xl p-1.5">
            <DropdownMenuLabel className="text-zinc-500 text-xs font-bold uppercase tracking-wider px-2 py-1.5">Ordina per</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800/60" />
            
            {/* Filtro Tonalità */}
            <div className="px-2 py-2">
              <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2 flex items-center gap-1">
                <Hash size={10} /> Filtra Tonalità
              </p>
              <select 
                value={keyFilter} 
                onChange={(e) => setKeyFilter(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md text-xs p-1.5 outline-none focus:border-orange-500"
              >
                <option value="all">Tutte le chiavi</option>
                {uniqueKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>

            <DropdownMenuSeparator className="bg-zinc-800/60" />

            <DropdownMenuItem 
              onClick={() => setSortBy("date-desc")}
              className={`rounded-lg px-2 py-2 text-sm cursor-pointer focus:bg-zinc-900 focus:text-white ${sortBy === "date-desc" ? "text-orange-500 font-bold" : ""}`}
            >
              Più recenti (Ultimi aggiunti)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortBy("date-asc")}
              className={`rounded-lg px-2 py-2 text-sm cursor-pointer focus:bg-zinc-900 focus:text-white ${sortBy === "date-asc" ? "text-orange-500 font-bold" : ""}`}
            >
              Meno recenti (Primi aggiunti)
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-zinc-800/60" />
            
            <DropdownMenuItem 
              onClick={() => setSortBy("title-asc")}
              className={`rounded-lg px-2 py-2 text-sm cursor-pointer focus:bg-zinc-900 focus:text-white ${sortBy === "title-asc" ? "text-orange-500 font-bold" : ""}`}
            >
              Titolo (A - Z)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortBy("title-desc")}
              className={`rounded-lg px-2 py-2 text-sm cursor-pointer focus:bg-zinc-900 focus:text-white ${sortBy === "title-desc" ? "text-orange-500 font-bold" : ""}`}
            >
              Titolo (Z - A)
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-zinc-800/60" />
            
            <DropdownMenuItem 
              onClick={() => setSortBy("bpm-desc")}
              className={`rounded-lg px-2 py-2 text-sm cursor-pointer focus:bg-zinc-900 focus:text-white ${sortBy === "bpm-desc" ? "text-orange-500 font-bold" : ""}`}
            >
              BPM (Più veloci)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortBy("bpm-asc")}
              className={`rounded-lg px-2 py-2 text-sm cursor-pointer focus:bg-zinc-900 focus:text-white ${sortBy === "bpm-asc" ? "text-orange-500 font-bold" : ""}`}
            >
              BPM (Più lenti)
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-zinc-800/60" />
            
            <DropdownMenuItem 
              onClick={() => setSortBy("duration-desc")}
              className={`rounded-lg px-2 py-2 text-sm cursor-pointer focus:bg-zinc-900 focus:text-white ${sortBy === "duration-desc" ? "text-orange-500 font-bold" : ""}`}
            >
              Durata (Più lunghi)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortBy("duration-asc")}
              className={`rounded-lg px-2 py-2 text-sm cursor-pointer focus:bg-zinc-900 focus:text-white ${sortBy === "duration-asc" ? "text-orange-500 font-bold" : ""}`}
            >
              Durata (Più brevi)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid delle Canzoni Ordinate */}
      {sortedSongs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {sortedSongs.map((song) => (
            <Link
              href={`/songs/${song.id}`}
              key={song.id}
              className="group relative bg-zinc-950 rounded-xl border-2 border-zinc-800/80 p-5 flex flex-col justify-between min-h-[140px] transition duration-200 hover:border-orange-500/50 hover:bg-zinc-900/40 cursor-pointer shadow-lg"
            >
              <div className="flex items-start justify-between gap-x-2">
                <div className="flex flex-col text-left">
                  <h3 className="text-xl font-bold text-zinc-200 group-hover:text-orange-400 transition truncate max-w-[200px]">
                    {song.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-0.5 truncate max-w-[180px]">{song.artist}</p>
                </div>
                
                {/* Badge Tonalità */}
                <span className="text-xs font-mono font-bold uppercase text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20 shrink-0">
                  {song.original_key}
                </span>
              </div>

              {/* Informazioni tecniche e azioni sul fondo della card */}
              <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-4 text-xs text-zinc-500 font-medium">
                <div className="flex items-center gap-x-2">
                  {song.bpm > 0 && (
                    <span className="bg-zinc-900 px-2 py-1 rounded border border-zinc-800 flex items-center gap-x-1 select-none">
                      <ArrowUpDown size={10} className="text-zinc-600" />
                      {song.bpm} <span className="text-[10px] text-zinc-600">BPM</span>
                    </span>
                  )}
                  
                  {/* Bottone Elimina */}
                  <button
                    onClick={(e) => handleDelete(e, song.id, song.title)}
                    title="Elimina brano"
                    className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition border border-transparent hover:border-zinc-800 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <span className="font-mono text-zinc-400">
                  {formatDuration(song.duration)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-zinc-500 py-24 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <Music className="h-10 w-10 text-zinc-600 stroke-[1.5]" />
          <p className="text-base font-semibold mt-4">Nessun brano trovato</p>
          <p className="text-xs text-zinc-600 mt-1">Non abbiamo trovato canzoni corrispondenti ai filtri impostati.</p>
        </div>
      )}
    </div>
  )
}