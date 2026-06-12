// app/songs/[songId]/page.tsx
import { getSongById } from "@/lib/utils/actions"
import { SongLine, SongSection, SongSegment } from "@/lib/utils/supabase/types"
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
    <div className="grid h-screen absolute left-1/5 w-4/5 grid-cols-[1fr_320px] grid-rows-[60px_1fr_80px] bg-zinc-900 text-zinc-300">
      
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
      <footer className="col-start-1 col-end-2 row-start-3 row-end-4 border-t border-zinc-900 bg-zinc-950 px-6 flex items-center justify-between">
        {/* Pulsanti PREV, PLAY, NEXT, TRANSPOSE e SCROLL come nella reference */}
        <div className="flex items-center gap-6 w-full">
          <button className="text-zinc-400 hover:text-zinc-100">Prev</button>
          <button className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold">▶</button>
          <button className="text-zinc-400 hover:text-zinc-100">Next</button>
          {/* Slider o controlli di velocità */}
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