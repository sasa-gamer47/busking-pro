// app/songs/[songId]/page.tsx
import { Button } from "@/components/ui/button"
import { getSongById } from "@/lib/utils/actions"
import { SongLine, SongSection, SongSegment } from "@/lib/utils/supabase/types"
import { 
  Play, 
  SkipBack, 
  SkipForward, 
  MinusCircle, 
  PlusCircle, 
  ChevronUp, 
  ChevronDown 
} from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ songId: string }>
}

export default async function SongPerformancePage({ params }: PageProps) {
  const { songId } = await params
  const song = await getSongById(songId)

  console.log(song)

  if (!song) notFound()

  return (
    // CONTENITORE GRID PRINCIPALE (Prende tutto lo spazio rimasto a destra della sidebar principale)
    <div className="grid h-screen absolute left-1/5 w-4/5 grid-cols-[1fr_270px] grid-rows-[60px_1fr_80px] bg-zinc-900 text-zinc-300">
      
      {/* TOPBAR (Area centrale in alto) */}
      <header className="col-start-1 col-end-2 row-start-1 row-end-2 border-b border-zinc-900 bg-zinc-950 px-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">PERFORMANCE_MODE</span>
          <h1 className="text-xl font-bold text-zinc-200">{song.title} <span className="text-zinc-500 text-sm font-normal">/ {song.artist}</span></h1>
        </div>
        {/* Icone di controllo/impostazioni sulla destra della topbar */}
        <div className="flex items-center gap-4 text-zinc-400">
          {/* Inserisci qui le tue icone (es. Lucide Icons) */}
        </div>
      </header>

      {/* AREA CENTRALE DEL TESTO (Scrollabile, occupa il centro) */}
      <main className="col-start-1 col-end-2 row-start-2 row-end-3 overflow-y-auto p-8 bg-zinc-950/40">
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
                    <div className="space-y-8">
                    {section.lines?.map((line: SongLine, lineIdx: number) => (
                        
                        <div key={lineIdx} className="flex flex-wrap items-end row-gap-5 leading-none">
                        {line.segments?.map((segment: SongSegment, segmentIdx: number) => (
                            
                            <div key={segmentIdx} className="flex flex-col items-start min-w-fit">
                            
                            {/* Spazio Accordi: manteniamo un'altezza fissa (h-6) così se un segmento non ha l'accordo, la riga non salta in alto */}
                            <span className="h-6 font-mono text-base font-bold text-orange-400 tracking-wide pr-1 select-all">
                                {segment.chord ? segment.chord : "\u00A0"} 
                                {/* \u00A0 è uno spazio vuoto non interrompibile per tenere su l'altezza del tag */}
                            </span>
                            
                            {/* Testo della sillaba/parola */}
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
                    className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 group"
                >
                    <SkipBack size={22} className="fill-zinc-400 group-hover:fill-zinc-200 transition-colors" />
                </Button>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 font-bold uppercase">Prev</span>
                </div>

                <Button 
                size="icon" 
                className="w-12 h-12 rounded-full bg-zinc-200 hover:bg-zinc-100 text-zinc-950 transition-transform active:scale-95 pl-0.5 shadow-none"
                >
                <Play size={22} className="fill-zinc-950" />
                </Button>

                <div className="flex flex-col items-center gap-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 group"
                >
                    <SkipForward size={22} className="fill-zinc-400 group-hover:fill-zinc-200 transition-colors" />
                </Button>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 font-bold uppercase">Next</span>
                </div>
            </div>

            {/* CONTAINER 2: TIMER & PROGRESS BAR */}
            <div className="flex flex-col gap-2 w-72">
                <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                <span>01:42</span>
                <div className="text-[11px] text-zinc-500">
                    SPEED <span className="text-zinc-200 font-bold">1.0x</span>
                </div>
                <span>03:59</span>
                </div>
                {/* Se hai installato il componente Slider di shadcn puoi usare quello, altrimenti la barra custom */}
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden cursor-pointer group">
                <div className="h-full w-[42%] bg-zinc-400 group-hover:bg-orange-500 transition-colors rounded-full" />
                </div>
            </div>

            {/* CONTAINER 3: TRANSPOSE */}
            <div className="flex items-center gap-2">
                <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                >
                <MinusCircle size={20} />
                </Button>
                <div className="flex flex-col items-center min-w-16">
                <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">Transpose</span>
                <span className="text-base font-mono font-bold text-orange-400">0</span>
                </div>
                <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                >
                <PlusCircle size={20} />
                </Button>
            </div>

            {/* SEPARATORE VERTICALE */}
            <div className="h-8 w-1 bg-zinc-900" />

            {/* CONTAINER 4: AUTOSCROLL SPEED */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-center min-w-12">
                <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">Scroll</span>
                <span className="text-base font-mono font-bold text-zinc-200">12</span>
                </div>
                <div className="flex flex-col -space-y-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                >
                    <ChevronUp size={16} />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
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
            {/* Genera i badge degli accordi unici del brano */}
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg font-mono text-sm">G</span>
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg font-mono text-sm">B</span>
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg font-mono text-sm">C</span>
          </div>
        </div>

      </aside>

    </div>
  )
}