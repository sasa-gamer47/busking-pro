"use client";

interface SongSidebarProps {
  originalKey: string;
  bpm: number;
  uniqueChords: string[];
  capo?: number;
  tuning?: string;
  isOpen?: boolean;
}

export default function SongSidebar({
  originalKey,
  bpm,
  uniqueChords,
  capo = 0,
  tuning = "E A D G B E",
  isOpen = false,
}: SongSidebarProps) {
  return (
    /* FIX ANCORAGGIO SIDEBAR:
       Aggiunto 'lg:row-start-2 lg:row-end-3 lg:col-start-2 lg:col-end-3' 
       per bloccarla perfettamente nello spazio centrale destro senza scendere nel player.
    */
    <aside className={`fixed top-0 right-0 h-full w-[260px] sm:w-[270px] z-50 bg-zinc-950 p-5 sm:p-6 space-y-6 overflow-y-auto border-l border-zinc-900 transition-transform duration-300 ease-in-out lg:static lg:h-full lg:w-full lg:z-10 lg:translate-x-0 lg:border-l lg:border-zinc-900/80 ${
  isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
}`}>
      
      {/* DETTAGLI BRANO */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Dettagli Brano</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-lg">
            <span className="text-[10px] text-zinc-500 block uppercase">Tonalità</span>
            <span className="text-sm font-bold text-orange-400">{originalKey}</span>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-lg">
            <span className="text-[10px] text-zinc-500 block uppercase">BPM</span>
            <span className="text-sm font-bold text-zinc-300">{bpm}</span>
          </div>
        </div>
      </div>

      {/* STRUMENTAZIONE */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Strumentazione</h3>
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl divide-y divide-zinc-800/60 text-sm">
          <div className="p-3 flex justify-between items-center">
            <span className="text-zinc-400">Capotasto</span>
            <span className={`font-medium transition-colors ${capo > 0 ? "text-orange-400 font-bold" : "text-zinc-200"}`}>
              {capo === 0 ? "Nessuno" : `Tasto ${capo}`}
            </span>
          </div>
          <div className="p-3 flex justify-between items-center gap-4">
            <span className="text-zinc-400">Accordatura</span>
            <span className="text-zinc-200 font-mono text-xs max-w-[130px] truncate text-right" title={tuning}>
              {tuning}
            </span>
          </div>
        </div>
      </div>

      {/* PROGRESSIONE ACCORDI */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Progressione Accordi</h3>
        {uniqueChords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {uniqueChords.map((chord, idx) => (
              <span 
                key={idx} 
                className="bg-zinc-900 border border-zinc-800 text-orange-400 px-2.5 py-1.5 rounded-lg font-mono text-xs sm:text-sm select-none"
              >
                {chord}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-xs italic text-zinc-600 pl-1">
            Nessun accordo rilevato nel testo
          </div>
        )}
      </div>

    </aside>
  );
}