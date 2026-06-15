"use client"

import { useState, useEffect, useTransition } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { GripVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDuration } from "@/lib/utils/format"
import { removeSongFromSetlist, updateSongsOrder } from "@/lib/utils/actions"
import { Button } from "@/components/ui/button"

interface Song {
  id: string
  title: string
  artist: string
  original_key: string
  duration: number
  position: number
}

interface SortableSongListProps {
  setlistId: string
  initialSongs: Song[]
}

export default function SortableSongList({ setlistId, initialSongs }: SortableSongListProps) {
  const [songs, setSongs] = useState<Song[]>(initialSongs)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Sincronizza lo stato locale quando i props cambiano (es. aggiunta brano) 
  // usando il pattern "Adjusting state when a prop changes" invece di useEffect
  const [prevInitialSongs, setPrevInitialSongs] = useState(initialSongs)
  if (initialSongs !== prevInitialSongs) {
    setPrevInitialSongs(initialSongs)
    setSongs(initialSongs)
  }

  // Gestione del Drag and Drop
  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(songs)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Riassegna le posizioni sequenziali corrette (1, 2, 3...) basandoti sul nuovo indice dell'array
    const updatedItems = items.map((song, index) => ({
      ...song,
      position: index + 1,
    }))

    // Aggiorna subito la UI in modo ottimistico
    setSongs(updatedItems)

    // Salva il nuovo ordine sul database tramite Server Action
    startTransition(async () => {
      try {
        const payload = updatedItems.map((s) => ({ song_id: s.id, position: s.position }))
        await updateSongsOrder(setlistId, payload)
        router.refresh()
      } catch (err) {
        alert(err instanceof Error ? err.message : "Errore durante l'aggiornamento dell'ordine")
        setSongs(initialSongs) // Rollback in caso di errore
      }
    })
  }

  // Gestione dell'eliminazione
  const handleDelete = async (songId: string) => {
    if (!confirm("Vuoi davvero rimuovere questo brano dalla scaletta?")) return

    startTransition(async () => {
      try {
        await removeSongFromSetlist(setlistId, songId)
        router.refresh()
      } catch (err) {
        alert("Errore durante la rimozione: " + (err instanceof Error ? err.message : "Errore sconosciuto"))
      }
    })
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="songs-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="w-full h-fit gap-y-4 flex flex-col justify-center items-center"
          >
            {songs.map((song, index) => (
              <Draggable key={song.id} draggableId={song.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`w-full h-fit p-4 flex justify-between items-center bg-zinc-950 rounded-lg border-2 border-zinc-800 transition duration-200 select-none ${
                      snapshot.isDragging ? "border-orange-500 bg-zinc-900 shadow-2xl" : "hover:bg-zinc-900/60"
                    }`}
                  >
                    {/* Handle per il trascinamento */}
                    <div
                      {...provided.dragHandleProps}
                      className="w-10 h-full flex justify-center items-center cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 p-2"
                    >
                      <GripVertical size={20} />
                    </div>

                    {/* Numero di posizione */}
                    <div className="w-1/12 h-full flex justify-center items-center">
                      <div className="text-2xl font-bold border border-zinc-700 bg-zinc-900 w-12 h-12 flex items-center justify-center rounded-md text-orange-500">
                        {song.position}
                      </div>
                    </div>

                    {/* Link al dettaglio della canzone */}
                    <Link
                      href={`/setlists/${setlistId}/songs/${song.id}`}
                      className="pl-4 w-6/12 flex flex-col cursor-pointer"
                    >
                      <h3 className="text-xl font-semibold text-zinc-300 leading-tight">{song.title}</h3>
                      <p className="text-sm text-zinc-400 mt-0.5">{song.artist}</p>
                    </Link>

                    {/* Tonalità */}
                    <div className="w-2/12 flex items-center justify-center">
                      <div className="p-1.5 max-w-20 flex items-center justify-center h-fit px-3 w-full bg-orange-600/10 text-orange-400 rounded-lg border border-orange-500/30 text-sm font-mono font-bold">
                        {song.original_key}
                      </div>
                    </div>

                    {/* Durata */}
                    <div className="w-1/12 flex items-center justify-center text-sm text-zinc-400 font-mono">
                      {formatDuration(song.duration)}
                    </div>

                    {/* Bottone Elimina */}
                    <div className="w-1/12 flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(song.id)}
                        disabled={isPending}
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}