// app/songs/page.tsx

import Topbar from "@/components/Topbar"
import AllSongsClient from "@/components/AllSongsClient"
import { getAllUserSongs } from "@/lib/utils/actions"

export default async function SongsPage() {
  // Recupera i dati in modo sicuro sul server
  const songs = await getAllUserSongs()

  return (
    <main className="absolute min-h-screen w-4/5 left-1/5 bg-zinc-900 text-zinc-300">
      <Topbar />
      <div className="bg-zinc-800 h-0.5 w-full"></div>
      
      {/* Passa i dati al client per la gestione interattiva del filtro */}
      <AllSongsClient 
        initialSongs={songs.map(song => ({
          id: song.id,
          title: song.title,
          artist: song.artist,
          original_key: song.original_key,
          duration: song.duration,
          bpm: song.bpm,
        }))} 
      />
    </main>
  )
}