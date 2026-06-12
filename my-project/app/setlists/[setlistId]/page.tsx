// app/setlists/[setlistId]/page.tsx

import Topbar from "@/components/Topbar"
import { Button } from "@/components/ui/button"
import { getSetlistById, getSongsBySetlistId } from "@/lib/utils/actions"
import { formatDuration, formatLongDate } from "@/lib/utils/format"
import { Calendar, Play, Plus } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    setlistId: string
  }>
}

export default async function SetlistDetailPage({ params }: PageProps) {
    const { setlistId } = await params

    const setlist = await getSetlistById(setlistId);
    const songs = await getSongsBySetlistId(setlistId);

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
                <div className="flex-items-center justify-between w-full mt-5">
                    <h3 className="text-left text-xl font-semibold">Brani in scaletta ({songs.length})</h3>
                </div>
                <div className=" bg-zinc-800 h-0.5 w-full"></div>
                <div className="w-full h-fit overflow-y-auto gap-y-4 flex flex-col justify-center items-center">
                    {songs.map((song, index) => (
                        <Link href={`/songs/${song.id}`} key={index} className="w-full h-fit p-4 flex justify-between items-center bg-zinc-950 rounded-lg border-2 border-zinc-800 transition duration-200 hover:bg-zinc-800 hover:cursor-pointer">
                            <div className="w-1/12 h-full flex justify-center items-center">
                                <div className="text-3xl font-semibold border border-zinc-700 bg-zinc-900 w-14 h-14 flex items-center justify-center">
                                    {song.position}
                                </div>
                            </div>
                            <div className="pl-4 w-8/12 flex flex-col">
                                <h3 className="text-2xl font-semibold text-zinc-300">{song.title}</h3>
                                <p className="texl-xl text-zinc-400">{song.artist}</p>
                            </div>
                            <div className="w-2/12 flex items-center justify-center">
                                <div className="p-2 max-w-24 flex items-center justify-center h-fit px-4 w-full bg-orange-600/20 rounded-lg border border-orange-500/50">
                                    {song.original_key}
                                </div>
                            </div>
                            <div className="w-1/12 flex items-center justify-center">
                                {formatDuration(song.duration)}
                            </div>
                        </Link>

                    ))}
                </div>
                <div className="w-full h-fit flex items-center justify-center p-4">
                    <Button className='text-lg font-semibold w-full max-w-80 p-6 bg-orange-600 transition duration-200 hover:-translate-y-1 hover:bg-orange-700 cursor-pointer'>
                        <Plus />
                        Aggiuna una canzone
                    </Button>
                </div>
            </div>
        </main>
    )
}