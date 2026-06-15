// app/setlists/[setlistId]/page.tsx

import Topbar from "@/components/Topbar"
import { Button } from "@/components/ui/button"
import AddSongModal from "@/components/AddSongModal"
import SortableSongList from "@/components/SortableSongList" // Importa la lista interattiva
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
        // Assicura che artist non sia null per compatibilità con l'interfaccia Song di SortableSongList
        artist: s.artist ?? "Unknown Artist",
        original_key: s.original_key ?? "N/A"
    }));

    // Recupera i brani dell'utente non ancora inseriti in questa scaletta
    const availableSongs = await getAvailableSongsForSetlist(setlistId);

    // Calcola il progressivo numerico per il campo position della riga successiva
    const nextPosition = songs.length + 1;

    console.log("found: ", songs);

    return (
        <main className="absolute min-h-screen w-4/5 left-1/5 bg-zinc-900 text-zinc-300">
            <Topbar />
            <div className=" bg-zinc-800 h-0.5 w-full"></div>
            <div className="w-full h-full relative p-10 flex items-center justify-center flex-col gap-y-5">
                <div className="flex flex-start items-center w-full h-fit">
                    <div className="text-sm  text-zinc-400 bg-zinc-950 border-2 border-zinc-800 py-2 px-4 flex items-center justify-center gap-x-4 rounded-lg">
                        <Calendar size={16} className="text-orange-500" />
                        Creata il {formatLongDate(setlist.created_at)}
                    </div>
                </div>
                <div className="w-full h-fit flex items-center justify-center">
                    <div className="w-9/12 gap-y-4 h-full flex flex-col items-start justify-center">
                        <h2 className="text-left text-4xl font-extrabold text-zinc-300">
                            {setlist.title}
                        </h2>
                        <p className="text-left text-lg text-zinc-400">
                            {setlist.description}
                        </p>
                    </div>
                    <div className="w-4/12 h-full flex items-center justify-center">
                        <Button className='text-lg font-semibold w-full max-w-60 p-6 bg-orange-600 transition duration-200 hover:-translate-y-1 hover:bg-orange-700 cursor-pointer'>
                            <Play />
                            Avvia
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full mt-5">
                    <h3 className="text-left text-xl font-semibold">Brani in scaletta ({songs.length})</h3>
                </div>
                <div className=" bg-zinc-800 h-0.5 w-full"></div>

                {/* LISTA INTERATTIVA: Gestisce Drag&Drop ed Eliminazione */}
                <SortableSongList setlistId={setlistId} initialSongs={songs} />

                {/* Modale Interattivo per aggiungere nuove canzoni */}
                <div className="w-full h-fit flex items-center justify-center p-4">
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