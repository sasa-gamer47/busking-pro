"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, X, Sliders, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TONALITIES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"
];

const TUNINGS = [
  "Standard (E A D G B E)", "Drop D (D A D G B E)", "Half-Step Down (D# G# C# F# A# D#)",
  "Whole-Step Down (D G C F A D)", "Open D (D A D F# A D)", "Open G (D G D G B D)", "Drop C (C G C F A D)"
];

interface SongHeaderProps {
  backUrl: string;
  title: string;
  artist: string | null;
  bpm: number | null | undefined;
  currentKey: string | null | undefined;
  capo: number | null | undefined;
  tuning: string | null | undefined;
  onUpdate?: (data: { bpm: number; currentKey: string; capo: number; tuning: string }) => void;
  onToggleSidebar?: () => void;
}

export default function SongHeader({
  backUrl,
  title,
  artist,
  bpm,
  currentKey,
  capo,
  tuning,
  onUpdate,
  onToggleSidebar,
}: SongHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [localBpm, setLocalBpm] = useState<number | "">(bpm ?? 120);
  const [localKey, setLocalKey] = useState<string>(currentKey ?? "C");
  const [localCapo, setLocalCapo] = useState<number>(capo ?? 0);
  const [localTuning, setLocalTuning] = useState<string>(tuning ?? "Standard (E A D G B E)");

  const handleOpenModal = () => {
    setLocalBpm(bpm ?? 120);
    setLocalKey(currentKey ?? "C");
    setLocalCapo(capo ?? 0);
    setLocalTuning(tuning ?? "Standard (E A D G B E)");
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (typeof onUpdate === "function") {
      onUpdate({
        bpm: localBpm === "" ? 120 : Number(localBpm),
        currentKey: localKey,
        capo: Number(localCapo),
        tuning: localTuning,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* FIX Z-INDEX HEADER: Messo a z-10 per non coprire i popup */}
      <header className="col-start-1 col-end-2 lg:col-end-3 row-start-1 row-end-2 border-b border-zinc-900 bg-zinc-950 px-4 sm:px-6 flex items-center justify-between h-20 z-10">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href={backUrl}
            className="p-2 -ml-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-zinc-200 shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
              PERFORMANCE_MODE
            </span>
            <h1 className="text-base sm:text-xl font-bold text-zinc-200 truncate max-w-[180px] sm:max-w-md">
              {title} {artist && <span className="text-zinc-500 text-xs sm:text-sm font-normal">/ {artist}</span>}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Button
            onClick={onToggleSidebar}
            variant="outline"
            className="flex lg:hidden border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-white h-10 w-10 p-0 rounded-xl justify-center items-center cursor-pointer transition"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <Button
            onClick={handleOpenModal}
            variant="outline"
            className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-white h-10 px-3 sm:px-3.5 rounded-xl gap-x-2 cursor-pointer transition"
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs hidden sm:inline">Setup Live</span>
          </Button>
        </div>
      </header>

      {/* MODALE DI CONFIGURAZIONE CON SUPER Z-INDEX (z-50) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative flex flex-col gap-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Sliders className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-bold text-zinc-100">Configurazione Brano</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-900">
                <X size={18} />
              </button>
            </div>
            <div className="bg-zinc-900 h-px w-full" />
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tempo (BPM)</label>
                <Input
                  type="number"
                  min={30}
                  max={300}
                  value={localBpm}
                  onChange={(e) => setLocalBpm(e.target.value === "" ? "" : Number(e.target.value))}
                  className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-orange-500 rounded-lg h-10"
                />
              </div>
              <div className="flex flex-col gap-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tonalità (Key)</label>
                <select value={localKey} onChange={(e) => setLocalKey(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-sm p-2.5 text-zinc-200 outline-none focus:border-orange-500 h-10">
                  {TONALITIES.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Capotasto (Capo)</label>
                <select value={localCapo} onChange={(e) => setLocalCapo(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-sm p-2.5 text-zinc-200 outline-none focus:border-orange-500 h-10">
                  {Array.from({ length: 13 }, (_, i) => <option key={i} value={i}>{i === 0 ? "Nessun Capo (0)" : `Tasto ${i}`}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Accordatura (Tuning)</label>
                <select value={localTuning} onChange={(e) => setLocalTuning(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-sm p-2.5 text-zinc-200 outline-none focus:border-orange-500 h-10">
                  {TUNINGS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="bg-zinc-900 h-px w-full mt-2" />
            <div className="flex items-center justify-end gap-x-2 mt-1">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-zinc-400 text-xs">Annulla</Button>
              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-4 h-9">Applica Modifiche</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}