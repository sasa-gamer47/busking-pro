"use client"

import { useState, useTransition } from "react"
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

  const [prevInitialSongs, setPrevInitialSongs] = useState(initialSongs)
  if (initialSongs !== prevInitialSongs) {
    setPrevInitialSongs(initialSongs)
    setSongs(initialSongs)
  }

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(songs)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedItems = items.map((song, index) => ({
      ...song,
      position: index + 1,
    }))

    setSongs(updatedItems)

    startTransition(async () => {
      try {
        const payload = updatedItems.map((s) => ({ song_id: s.id, position: s.position }))
        await updateSongsOrder(setlistId, payload)
        router.refresh()
      } catch (err) {
        alert(err instanceof Error ? err.message : "Errore durante l'aggiornamento dell'ordine")
        setSongs(initialSongs)
      }
    })
  }

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
            className="w-full h-fit gap-y-3 flex flex-col justify-center items-center"
          >
            {songs.map((song, index) => (
              <Draggable key={song.id} draggableId={song.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`w-full h-fit p-3 sm:p-4 flex items-center gap-x-2 sm:gap-x-3 bg-zinc-950 rounded-lg border-2 border-zinc-800 transition duration-200 select-none ${
                      snapshot.isDragging ? "border-orange-500 bg-zinc-900 shadow-2xl" : "hover:bg-zinc-900/60"
                    }`}
                  >
                    {/* Handle drag */}
                    <div
                      {...provided.dragHandleProps}
                      className="shrink-0 flex justify-center items-center cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 p-1"
                    >
                      <GripVertical size={18} />
                    </div>

                    {/* Numero posizione */}
                    <div className="shrink-0 text-lg sm:text-2xl font-bold border border-zinc-700 bg-zinc-900 w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center rounded-md text-orange-500">
                      {song.position}
                    </div>

                    {/* Titolo + Artista */}
                    <Link
                      href={`/setlists/${setlistId}/songs/${song.id}`}
                      className="flex-1 min-w-0 flex flex-col cursor-pointer pl-1"
                    >
                      <h3 className="text-base sm:text-xl font-semibold text-zinc-300 leading-tight truncate">
                        {song.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 truncate">{song.artist}</p>
                    </Link>

                    {/* Tonalità */}
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="px-2 py-1 sm:px-3 flex items-center justify-center bg-orange-600/10 text-orange-400 rounded-lg border border-orange-500/30 text-xs sm:text-sm font-mono font-bold">
                        {song.original_key}
                      </div>
                    </div>

                    {/* Durata — nascosta su mobile */}
                    <div className="hidden sm:flex shrink-0 items-center justify-center text-sm text-zinc-400 font-mono w-12">
                      {formatDuration(song.duration)}
                    </div>

                    {/* Elimina */}
                    <div className="shrink-0 flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(song.id)}
                        disabled={isPending}
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Trash2 size={16} />
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