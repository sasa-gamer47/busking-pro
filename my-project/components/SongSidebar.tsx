"use client";

interface SongSidebarProps {
  originalKey: string;
  bpm: number;
  uniqueChords: string[];
  capo?: number;     // Ricevuto dinamicamente dal database
  tuning?: string;   // Ricevuto dinamicamente dal database
}

export default function SongSidebar({
  originalKey,
  bpm,
  uniqueChords,
  capo = 0,
  tuning = "E A D G B E",
}: SongSidebarProps) {
  return (
    <aside className="col-start-2 col-end-3 row-start-1 row-end-4 border-l border-zinc-900 bg-zinc-950 p-6 space-y-6 overflow-y-auto">
      
      {/* DETTAGLI BRANO (TONALITÀ & BPM) */}
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

      {/* STRUMENTAZIONE DINAMICA */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Strumentazione</h3>
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl divide-y divide-zinc-800/60 text-sm">
          
          {/* Riga Capotasto */}
          <div className="p-3 flex justify-between items-center">
            <span className="text-zinc-400">Capotasto</span>
            <span className={`font-medium transition-colors ${capo > 0 ? "text-orange-400 font-bold" : "text-zinc-200"}`}>
              {capo === 0 ? "Nessuno" : `Tasto ${capo}`}
            </span>
          </div>
          
          {/* Riga Accordatura */}
          <div className="p-3 flex justify-between items-center gap-4">
            <span className="text-zinc-400">Accordatura</span>
            <span 
              className="text-zinc-200 font-mono text-xs max-w-[130px] truncate text-right" 
              title={tuning}
            >
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
                className="bg-zinc-900 border border-zinc-800 text-orange-400 px-3 py-1.5 rounded-lg font-mono text-sm select-none"
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