// app/setlists/[setlistId]/page.tsx

import Topbar from "@/components/Topbar"
import { Button } from "@/components/ui/button"
import AddSongModal from "@/components/AddSongModal"
import SortableSongList from "@/components/SortableSongList"
import { getSetlistById, getSongsBySetlistId, getAvailableSongsForSetlist } from "@/lib/utils/actions"
import { formatLongDate } from "@/lib/utils/format"
import { Calendar, Play } from "lucide-react"

interface PageProps {
    params: Promise<{
        setlistId: string
    }>
}

export default async function SetlistDetailPage({ params }: PageProps) {
    const { setlistId } = await params

    const setlist = await getSetlistById(setlistId);
    const rawSongs = await getSongsBySetlistId(setlistId);

    const songs = rawSongs.map(s => ({
        ...s,
        artist: s.artist ?? "Unknown Artist",
        original_key: s.original_key ?? "N/A"
    }));

    const availableSongs = await getAvailableSongsForSetlist(setlistId);
    const nextPosition = songs.length + 1;

    return (
        <main className="absolute h-screen overflow-y-auto w-full left-0 lg:w-4/5 lg:left-1/5 bg-zinc-900 text-zinc-300">
            <Topbar />
            <div className="bg-zinc-800 h-0.5 w-full" />

            <div className="w-full p-4 sm:p-6 lg:p-10 flex flex-col gap-y-5">

                {/* Data creazione */}
                <div className="flex items-center w-full">
                    <div className="text-sm text-zinc-400 bg-zinc-950 border-2 border-zinc-800 py-2 px-4 flex items-center gap-x-3 rounded-lg">
                        <Calendar size={16} className="text-orange-500 shrink-0" />
                        Creata il {formatLongDate(setlist.created_at)}
                    </div>
                </div>

                {/* Titolo + bottone Avvia */}
                <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 flex flex-col gap-y-2">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-300">
                            {setlist.title}
                        </h2>
                        <p className="text-base sm:text-lg text-zinc-400">
                            {setlist.description}
                        </p>
                    </div>
                    <div className="w-full sm:w-auto shrink-0">
                        <Button className="text-lg font-semibold w-full sm:w-auto sm:min-w-40 p-6 bg-orange-600 transition duration-200 hover:-translate-y-1 hover:bg-orange-700 cursor-pointer">
                            <Play />
                            Avvia
                        </Button>
                    </div>
                </div>

                {/* Header lista brani */}
                <div className="flex items-center justify-between w-full mt-2">
                    <h3 className="text-lg sm:text-xl font-semibold">Brani in scaletta ({songs.length})</h3>
                </div>
                <div className="bg-zinc-800 h-0.5 w-full" />

                {/* Lista drag & drop */}
                <SortableSongList setlistId={setlistId} initialSongs={songs} />

                {/* Aggiungi brano */}
                <div className="w-full flex items-center justify-center p-4">
                    <AddSongModal
                        setlistId={setlistId}
                        availableSongs={availableSongs}
                        nextPosition={nextPosition}
                    />
                </div>

            </div>
        </main>
    )
}