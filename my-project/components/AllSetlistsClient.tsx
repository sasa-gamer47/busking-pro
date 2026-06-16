"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Calendar, FolderHeart, Plus, SlidersHorizontal, Trash2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatLongDate } from "@/lib/utils/format"
import { createClient } from "@/lib/utils/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Setlist {
  id: string
  title: string
  description: string
  created_at: string
}

interface AllSetlistsClientProps {
  initialSetlists: Setlist[]
}

type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc"

export default function AllSetlistsClient({ initialSetlists }: AllSetlistsClientProps) {
  const searchParams = useSearchParams()

  // Stato locale delle scalette per gestire l'eliminazione istantanea
  const [setlists, setSetlists] = useState<Setlist[]>(initialSetlists)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")

  // --- FUNZIONE PER ELIMINARE UNA SCALETTA ---
  const handleDelete = async (e: React.MouseEvent, setlistId: string, setlistTitle: string) => {
    // Evita che il click apra la pagina di dettaglio della scaletta
    e.preventDefault()
    e.stopPropagation()

    const confirmDelete = window.confirm(`Sei sicuro di voler eliminare definitivamente la scaletta "${setlistTitle}"?`)
    if (!confirmDelete) return

    const supabase = createClient()
    
    // Rimozione della riga dalla tabella "setlists"
    const { error } = await supabase
      .from("setlists")
      .delete()
      .eq("id", setlistId)

    if (error) {
      console.error("Errore durante l'eliminazione:", error)
      alert("Impossibile eliminare la scaletta: " + error.message)
    } else {
      // Escludi la scaletta eliminata dallo stato locale
      setSetlists(setlists.filter(s => s.id !== setlistId))
    }
  }

  // 1. Filtro in tempo reale sul client per titolo o descrizione
  const filteredSetlists = setlists.filter(
    (setlist) =>
      setlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      setlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 2. Ordinamento in tempo reale e sicuro delle scalette filtrate
  const sortedSetlists = [...filteredSetlists].sort((a, b) => {
    switch (sortBy) {
      case "date-desc": {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
        return timeB - timeA // Più recenti prima
      }
      case "date-asc": {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
        return timeA - timeB // Meno recenti prima
      }
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  return (
    <div className="w-full h-full p-10 flex flex-col gap-y-6">
      {/* Header della sezione */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-4 w-full">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Le Mie Scalette</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Organizza i tuoi brani in scalette per i tuoi live o sessioni di prova ({setlists.length} scalette).
          </p>
        </div>
        
        <Link href="/setlists/create">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-5 rounded-xl transition duration-200 hover:-translate-y-0.5 cursor-pointer">
            <Plus className="mr-2 h-5 w-5" />
            Nuova Scaletta
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
            placeholder="Cerca scaletta per titolo o descrizione..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <DropdownMenuItem 
              onClick={() => setSortBy("date-desc")}
              className={`rounded-lg px-2 py-2 text-sm cursor-pointer focus:bg-zinc-900 focus:text-white ${sortBy === "date-desc" ? "text-orange-500 font-bold" : ""}`}
            >
              Più recenti
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortBy("date-asc")}
              className={`rounded-lg px-2 py-2 text-sm cursor-pointer focus:bg-zinc-900 focus:text-white ${sortBy === "date-asc" ? "text-orange-500 font-bold" : ""}`}
            >
              Meno recenti
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid delle Scalette Ordinate */}
      {sortedSetlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
          {sortedSetlists.map((setlist) => (
            <Link
              href={`/setlists/${setlist.id}`}
              key={setlist.id}
              className="group relative bg-zinc-950 rounded-xl border-2 border-zinc-800/80 p-6 flex flex-col justify-between min-h-[160px] transition duration-200 hover:border-orange-500/50 hover:bg-zinc-900/40 cursor-pointer shadow-lg layout-fixed"
            >
              <div className="flex flex-col text-left">
                {/* Titolo Setlist */}
                <h3 className="text-xl font-bold text-zinc-200 group-hover:text-orange-400 transition truncate w-full">
                  {setlist.title}
                </h3>
                
                {/* Descrizione */}
                <p className="text-sm text-zinc-400 mt-2 line-clamp-2 h-10 overflow-hidden text-ellipsis">
                  {setlist.description || "Nessuna descrizione fornita."}
                </p>
              </div>

              {/* Footer della card con info e azioni */}
              <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-4 text-xs text-zinc-500 font-medium">
                <div className="flex items-center gap-x-2">
                  <Calendar size={14} className="text-orange-500/70" />
                  <span>
                    Creata il {formatLongDate(setlist.created_at)}
                  </span>
                </div>

                {/* Bottone Elimina */}
                <button
                  onClick={(e) => handleDelete(e, setlist.id, setlist.title)}
                  title="Elimina scaletta"
                  className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition border border-transparent hover:border-zinc-800 cursor-pointer shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-zinc-500 py-24 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <FolderHeart className="h-10 w-10 text-zinc-600 stroke-[1.5]" />
          <p className="text-base font-semibold mt-4">Nessuna scaletta trovata</p>
          <p className="text-xs text-zinc-600 mt-1">Non ci sono scalette corrispondenti ai criteri di ricerca.</p>
        </div>
      )}
    </div>
  )
}