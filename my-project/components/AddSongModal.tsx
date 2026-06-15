"use client"

import { useState, useTransition } from "react"
import { Search, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { addSongToSetlist } from "@/lib/utils/actions"

// Componenti di shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Song {
  id: string;
  title: string;
  artist: string;
  original_key: string;
}

interface AddSongModalProps {
  setlistId: string;
  availableSongs: Song[];
  nextPosition: number;
}

export default function AddSongModal({ setlistId, availableSongs, nextPosition }: AddSongModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Filtro client dei brani tramite la barra di ricerca
  const filteredSongs = availableSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddSong = (songId: string) => {
    startTransition(async () => {
      try {
        // Esecuzione della Server Action
        await addSongToSetlist({
          setlistId,
          songId,
          position: nextPosition,
        })
        
        // Refresh immediato dei dati della pagina senza ricaricare l'intera route
        router.refresh()
      } catch (err) {
        alert("Impossibile aggiungere il brano: " + (err instanceof Error ? err.message : "Errore sconosciuto"))
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) setSearchQuery("") // Resetta la ricerca alla chiusura
    }}>
      {/* Trigger basato sul tuo vecchio bottone */}
      <DialogTrigger asChild>
        <Button className="text-lg font-semibold w-full max-w-80 p-6 bg-orange-600 transition duration-200 hover:-translate-y-1 hover:bg-orange-700 cursor-pointer text-white rounded-xl">
          <Plus className="mr-2 h-5 w-5" />
          Aggiungi una canzone
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl bg-zinc-900 border-zinc-800 text-zinc-100 p-0 overflow-hidden shadow-2xl gap-0">
        <DialogHeader className="p-6 bg-zinc-950/50 border-b border-zinc-800">
          <DialogTitle className="text-xl font-bold text-white">Aggiungi Brano alla Scaletta</DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs mt-1">
            Seleziona una delle tue canzoni create nel database per inserirla in questa scaletta.
          </DialogDescription>
        </DialogHeader>

        {/* Barra di ricerca custom con Input di shadcn */}
        <div className="p-4 border-b border-zinc-800/60 bg-zinc-900">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-zinc-500 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cerca per titolo o artista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border-zinc-800 focus-visible:ring-orange-500 pl-11 py-5 text-white rounded-xl placeholder-zinc-600"
            />
          </div>
        </div>

        {/* Lista brani scrollabile */}
        <div className="max-h-[350px] overflow-y-auto p-4 space-y-2 bg-zinc-900/40">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <div
                key={song.id}
                className="w-full p-3.5 flex justify-between items-center bg-zinc-950/60 rounded-xl border border-zinc-800/60 hover:border-zinc-700/80 transition"
              >
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-zinc-200 text-base leading-tight">{song.title}</span>
                  <span className="text-zinc-500 text-sm mt-0.5">{song.artist}</span>
                </div>

                <div className="flex items-center gap-x-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                    {song.original_key}
                  </span>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleAddSong(song.id)}
                    disabled={isPending}
                    className="bg-zinc-800 hover:bg-orange-600 text-zinc-300 hover:text-black h-9 w-9 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-500 py-12">
              <p className="text-sm font-medium">Nessun brano trovato</p>
              <p className="text-xs text-zinc-600 mt-0.5">Prova a digitare un nome diverso.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}