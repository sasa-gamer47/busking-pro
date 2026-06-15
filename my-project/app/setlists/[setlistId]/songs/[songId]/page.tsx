// app/songs/[songId]/page.tsx
"use client"
import { Button } from "@/components/ui/button"
// import { Slider } from "@/components/ui/slider"
import { getSongById, updateSongPreferences, getSetlistSongPreferences, getSongsFromSetlist } from "@/lib/utils/actions"
import { Song, SongLine, SongSection, SongSegment } from "@/lib/utils/supabase/types"
import { 
  Play, 
  SkipBack, 
  SkipForward, 
  MinusCircle, 
  PlusCircle, 
  ChevronUp, 
  ChevronDown,
  ArrowLeft,
  Pause
} from "lucide-react"
import { notFound, useRouter } from "next/navigation"
import { transposeChord, simplifyChord } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
// import { useSearchParams } from "next/navigation"

interface PageProps {
  params: Promise<{ 
    setlistId: string;
    songId: string; 
  }>
}

export default function SongPerformancePage({ params }: PageProps) {
  const router = useRouter()
  const [song, setSong] = useState<Song | null>(null)
  const [transpose, setTranspose] = useState(0)
  const [loading, setLoading] = useState(true)
  const [simplify, setSimplify] = useState(false)
  const [setlistId, setSetlistId] = useState<string | null>(null)
  const [adjacentSongs, setAdjacentSongs] = useState<{ prev: string | null; next: string | null }>({ prev: null, next: null })
  
  const scrollContainerRef = useRef<HTMLElement>(null)
  // Autoscroll states
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(10)

  useEffect(() => {
    params.then(p => {
      setSetlistId(p.setlistId);
      Promise.all([
        getSongById(p.songId),
        getSetlistSongPreferences(p.setlistId, p.songId),
        getSongsFromSetlist(p.setlistId)
      ]).then(([songData, prefs, setlistSongs]) => {
        setSong(songData);
        setTranspose(prefs?.data?.transpose ?? 0);
        setSimplify(prefs?.data?.is_simplified ?? false);
        
        if (setlistSongs?.success && setlistSongs.data) {
          const sortedSongs = setlistSongs.data;
          const currentIndex = sortedSongs.findIndex((s: { song_id: string }) => s.song_id === p.songId);
          console.log(sortedSongs, currentIndex);
          setAdjacentSongs({
            prev: currentIndex > 0 ? sortedSongs[currentIndex - 1].song_id : null,
            next: currentIndex < sortedSongs.length - 1 ? sortedSongs[currentIndex + 1].song_id : null
          });
        }
        
        setLoading(false);
      });
    })
  }, [params])

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isScrolling) {
      intervalId = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollBy({
            top: 0.5,
            behavior: 'auto'
          });
        }
      }, Math.max(1, 60 - scrollSpeed * 2.5)); // Adjust speed logic
    }
    return () => clearInterval(intervalId);
  }, [isScrolling, scrollSpeed]);

  if (loading)
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
        Caricamento...
      </div>
    );
  if (!song) return notFound();

  const handlePreferenceChange = async (newTranspose: number, newSimplify: boolean) => {
    setTranspose(newTranspose);
    setSimplify(newSimplify);
    // Opzionale: salva le preferenze nel DB tramite la server action
    if (setlistId) {
      await updateSongPreferences(setlistId, song.id, newTranspose, newSimplify);
    }
  };
  
  const uniqueChords = Array.from(
    new Set(
      song?.content?.flatMap((section) =>
        section.lines?.flatMap((line) =>
          line.segments
            ?.map((seg) => seg.chord)
            .filter((chord): chord is string => !!chord)
            .map((chord) =>
              simplify
                ? simplifyChord(transposeChord(chord, transpose))
                : transposeChord(chord, transpose)
            )
        )
      )
    )
  );

  return (
    // CONTENITORE GRID PRINCIPALE (Prende tutto lo spazio rimasto a destra della sidebar principale)
    <div className="grid h-screen fixed left-[20%] right-0 grid-cols-[1fr_270px] grid-rows-[60px_1fr_80px] bg-zinc-900 text-zinc-300 overflow-hidden">
      
      {/* TOPBAR (Area centrale in alto) */}
      <header className="col-start-1 col-end-2 row-start-1 row-end-2 border-b border-zinc-900 bg-zinc-950 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/setlists/${setlistId}`} className="p-2 -ml-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-zinc-200">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">PERFORMANCE_MODE</span>
            <h1 className="text-xl font-bold text-zinc-200">{song.title} <span className="text-zinc-500 text-sm font-normal">/ {song.artist}</span></h1>
          </div>
        </div>
        {/* Icone di controllo/impostazioni sulla destra della topbar */}
        <div className="flex items-center gap-4 text-zinc-400">
          {/* Inserisci qui le tue icone (es. Lucide Icons) */}
        </div>
      </header>

      {/* AREA CENTRALE DEL TESTO (Scrollabile, occupa il centro) */}
      <main 
        ref={scrollContainerRef}
        className="col-start-1 col-end-2 row-start-2 row-end-3 overflow-y-auto p-8 bg-zinc-950/40 scroll-smooth"
      >
        <div className="max-w-2xl mx-auto space-y-8 font-mono text-lg">
            {song.content?.map((section: SongSection, sectionIdx: number) => (
                <div key={sectionIdx} className="space-y-6">
                    
                    {/* Intestazione Sezione (es. STROFA 1, RITORNELLO) */}
                    <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-500/5 px-2.5 py-1 rounded border border-orange-500/10">
                        {section.label || section.type}
                    </span>
                    <div className="h-1 flex-1 bg-zinc-900" />
                    </div>
                    
                    {/* Contenitore delle Righe della Sezione */}
                    <div className="space-y-4"> {/* Ridotto lo spazio tra i versi per renderlo compatto come la reference */}
                    {section.lines?.map((line: SongLine, lineIdx: number) => (
                        
                        <div key={lineIdx} className="flex flex-wrap items-end pb-2 leading-none">
                        {line.segments?.map((segment: SongSegment, segmentIdx: number) => (
                            
                            <div key={segmentIdx} className="flex flex-col items-start min-w-fit">
                            
                            {/* Spazio Accordi */}
                            <span className="h-6 font-mono text-base font-bold text-orange-400 tracking-wide pr-1 select-none">
                                {segment.chord ? (
                                  simplify 
                                    ? simplifyChord(transposeChord(segment.chord, transpose))
                                    : transposeChord(segment.chord, transpose)
                                ) : (
                                  "\u00A0"
                                )}
                            </span>
                            
                            {/* Testo della sillaba/parola (whitespace-pre mantiene gli spazi finali stabili per agganciare il segmento successivo) */}
                            <span className="font-sans text-xl text-zinc-200 tracking-normal whitespace-pre">
                                {segment.text}
                            </span>
                            
                            </div>
                        ))}
                        </div>
                        
                    ))}
                    </div>

                </div>
                ))}
        </div>
      </main>

      {/* BOTTOMBAR (Controlli Player in basso a sinistra) */}
      <footer className="col-start-1 col-end-2 row-start-3 row-end-4 border-t border-zinc-900 bg-zinc-950 px-8 flex items-center justify-between select-none">
            
            {/* CONTAINER 1: CONTROLLI PLAYER */}
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={!adjacentSongs.prev}
                    onClick={() => adjacentSongs.prev && router.push(`/setlists/${setlistId}/songs/${adjacentSongs.prev}`)}
                    className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 group cursor-pointer"
                >
                    <SkipBack size={22} className="fill-zinc-400 group-hover:fill-zinc-200 transition-colors" />
                </Button>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 font-bold uppercase">Prev</span>
                </div>

                <Button 
                  size="icon" 
                  onClick={() => setIsScrolling(!isScrolling)}
                  className={`w-12 h-12 rounded-full transition-transform active:scale-95 shadow-none cursor-pointer ${isScrolling ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-zinc-300 hover:bg-zinc-100 text-zinc-950'}`}
                >
                  {isScrolling ? <Pause size={22} className="fill-current" /> : <Play size={22} className="fill-current pl-0.5" />}
                </Button>
                {/* <span className="text-[10px] font-mono tracking-widest text-zinc-500 font-bold uppercase">{isScrolling ? 'Stop' : 'Play'}</span> */}

                <div className="flex flex-col items-center gap-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={!adjacentSongs.next}
                    onClick={() => adjacentSongs.next && router.push(`/setlists/${setlistId}/songs/${adjacentSongs.next}`)}
                    className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 group cursor-pointer"
                >
                    <SkipForward size={22} className="fill-zinc-400 group-hover:fill-zinc-200 transition-colors" />
                </Button>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 font-bold uppercase">Next</span>
                </div>
            </div>

            {/* CONTAINER 2: TIMER & PROGRESS BAR */}
            {/* <div className="flex flex-col gap-2 w-72">
                <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                <span>01:42</span>
                <div className="text-[11px] text-zinc-500">
                    SPEED <span className="text-zinc-200 font-bold">1.0x</span>
                </div>
                <span>03:59</span>
                </div>
                <Slider 
                  defaultValue={[42]} 
                  min={0}
                  max={100} 
                  step={1} 
                  className="w-full cursor-pointer **:data-[slot=slider-range]:bg-orange-500"
                />
            </div> */}

            {/* CONTAINER 3: TRANSPOSE */}
            <div className="flex items-center gap-2">
                <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 cursor-pointer"
                onClick={() => handlePreferenceChange(transpose - 1, simplify)}
                >
                <MinusCircle size={20} />
                </Button>
                <div className="flex flex-col items-center min-w-16">
                <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">Transpose</span>
                <span className="text-base font-mono font-bold text-orange-400">{transpose > 0 ? `+${transpose}` : transpose}</span>
                </div>
                <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 cursor-pointer"
                onClick={() => handlePreferenceChange(transpose + 1, simplify)}
                >
                <PlusCircle size={20} />
                </Button>
            </div>

            {/* CONTAINER 3.5: SIMPLIFY CHORDS */}
            <div className="flex items-center gap-3 px-4">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">Simplify</span>
                    <span className="text-[9px] text-zinc-600 leading-none">CHORDS</span>
                </div>
                <Switch 
                  checked={simplify} 
                  onCheckedChange={(checked) => handlePreferenceChange(transpose, checked)} 
                  className="data-[state=checked]:bg-orange-500 cursor-pointer" 
                />
            </div>

            {/* SEPARATORE VERTICALE */}
            <div className="h-8 w-1 bg-zinc-900" />

            {/* CONTAINER 4: AUTOSCROLL SPEED */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-center min-w-12">
                <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">Scroll</span>
                <span className="text-base font-mono font-bold text-zinc-200">{scrollSpeed}</span>
                </div>
                <div className="flex flex-col -space-y-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setScrollSpeed(prev => Math.min(prev + 1, 20))}
                    className="h-6 w-6 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 cursor-pointer"
                >
                    <ChevronUp size={16} />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setScrollSpeed(prev => Math.max(prev - 1, 1))}
                    className="h-6 w-6 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 cursor-pointer"
                >
                    <ChevronDown size={16} />
                </Button>
                </div>
            </div>

        </footer>

      {/* SIDEBAR DETTAGLI BRANO (Occupa tutta l'altezza a destra, unendo le 3 righe) */}
      <aside className="col-start-2 col-end-3 row-start-1 row-end-4 border-l border-zinc-900 bg-zinc-950 p-6 space-y-6 overflow-y-auto">
        
        {/* Box Dettagli Brano */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Dettagli Brano</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-lg">
              <span className="text-[10px] text-zinc-500 block uppercase">Tonalità</span>
              <span className="text-sm font-bold text-orange-400">{song.original_key}</span>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-lg">
              <span className="text-[10px] text-zinc-500 block uppercase">BPM</span>
              <span className="text-sm font-bold text-zinc-300">92</span> {/* Puoi aggiungere il campo BPM in futuro */}
            </div>
          </div>
        </div>

        {/* Box Strumentazione */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Strumentazione</h3>
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl divide-y divide-zinc-800/60 text-sm">
            <div className="p-3 flex justify-between"><span className="text-zinc-400">Capotasto</span><span className="text-zinc-200 font-medium">Nessuno</span></div>
            <div className="p-3 flex justify-between"><span className="text-zinc-400">Accordatura</span><span className="text-zinc-200 font-mono">E A D G B E</span></div>
          </div>
        </div>

        {/* Box Progressione Accordi */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Progressione Accordi</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueChords.map((chord, idx) => (
              <span key={idx} className="bg-zinc-900 border border-zinc-800 text-orange-400 px-3 py-1.5 rounded-lg font-mono text-sm">
                {chord}
              </span>
            ))}
          </div>
        </div>

      </aside>

    </div>
  )
}