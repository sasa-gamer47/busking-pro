"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MinusCircle, PlusCircle, ChevronUp, ChevronDown, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { updateSongPreferences } from "@/lib/utils/actions";

interface SongControlsProps {
  isScrolling: boolean;
  setIsScrolling: (scroll: boolean) => void;
  scrollSpeed: number;
  setScrollSpeed: (updater: (prev: number) => number) => void;
  transpose: number;
  simplify: boolean;
  adjacentSongs: { prev: string | null; next: string | null };
  songId: string;
  setlistId?: string;
  showNavigation: boolean;
  onPreferenceChange: (transpose: number, simplify: boolean) => void;
  onNavigate?: (songId: string) => void;
}

export default function SongControls({
  isScrolling,
  setIsScrolling,
  scrollSpeed,
  setScrollSpeed,
  transpose,
  simplify,
  adjacentSongs,
  songId,
  setlistId,
  showNavigation,
  onPreferenceChange,
  onNavigate,
}: SongControlsProps) {
  const [isPending, startTransition] = useTransition();

  const handlePrefChange = async (newTranspose: number, newSimplify: boolean) => {
    startTransition(async () => {
      if (setlistId) {
        await updateSongPreferences(setlistId, songId, newTranspose, newSimplify);
      }
      onPreferenceChange(newTranspose, newSimplify);
    });
  };

  return (
    /* FIX DEFINITIVO:
       - h-full: il footer ora riempie SEMPRE l'intera altezza della riga riservata
         (niente più "metà altezza" / spazio vuoto).
       - grid-cols-4: ognuno dei 4 gruppi occupa esattamente 1/4 della larghezza
         totale, sempre, indipendentemente dal contenuto o dal breakpoint.
       - Nessuna classe di posizionamento grid qui dentro: il posizionamento
         nella pagina è gestito SOLO da SongViewer.tsx, in un unico punto.
    */
    <footer className="h-full w-full grid grid-cols-4 items-center bg-zinc-950 px-2 sm:px-6 select-none overflow-hidden">

      {/* 1. GRUPPO PLAYER LIVE */}
      <div className="flex items-center justify-center gap-x-1 sm:gap-x-3">
        {showNavigation && (
          <Button
            variant="ghost"
            size="icon"
            disabled={!adjacentSongs.prev}
            onClick={() => adjacentSongs.prev && onNavigate?.(adjacentSongs.prev)}
            className="h-7 w-7 sm:h-9 sm:w-9 text-zinc-400 hover:bg-zinc-900 shrink-0"
          >
            <SkipBack size={15} className="sm:size-[18px] fill-zinc-400" />
          </Button>
        )}

        <Button
          size="icon"
          onClick={() => setIsScrolling(!isScrolling)}
          className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full transition-transform active:scale-95 shadow-none shrink-0 cursor-pointer ${
            isScrolling ? "bg-orange-500 text-white" : "bg-zinc-300 text-zinc-950"
          }`}
        >
          {isScrolling ? (
            <Pause size={14} className="sm:size-[16px] fill-current" />
          ) : (
            <Play size={14} className="sm:size-[16px] fill-current pl-0.5" />
          )}
        </Button>

        {showNavigation && (
          <Button
            variant="ghost"
            size="icon"
            disabled={!adjacentSongs.next}
            onClick={() => adjacentSongs.next && onNavigate?.(adjacentSongs.next)}
            className="h-7 w-7 sm:h-9 sm:w-9 text-zinc-400 hover:bg-zinc-900 shrink-0"
          >
            <SkipForward size={15} className="sm:size-[18px] fill-zinc-400" />
          </Button>
        )}
      </div>

      {/* 2. GRUPPO TRANSPOSE */}
      <div className="flex items-center justify-center gap-x-0.5 sm:gap-x-1 bg-zinc-900/40 sm:bg-transparent p-1 rounded-xl border border-zinc-800/50 sm:border-transparent">
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="h-7 w-7 text-zinc-400 hover:text-white rounded-lg transition-colors"
          onClick={() => handlePrefChange(transpose - 1, simplify)}
        >
          <MinusCircle size={16} />
        </Button>

        <div className="flex flex-col items-center justify-center min-w-[32px] sm:min-w-[55px]">
          <span className="text-[8px] font-mono font-bold tracking-wider text-zinc-500 uppercase hidden sm:block">Transpose</span>
          <span className="text-xs sm:text-sm font-mono font-bold text-orange-400">
            {transpose > 0 ? `+${transpose}` : transpose}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="h-7 w-7 text-zinc-400 hover:text-white rounded-lg transition-colors"
          onClick={() => handlePrefChange(transpose + 1, simplify)}
        >
          <PlusCircle size={16} />
        </Button>
      </div>

      {/* 3. GRUPPO SIMPLIFY */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
        <div className="flex flex-col text-right">
          <span className="text-[9px] font-mono font-bold tracking-wider text-zinc-400 uppercase sm:text-zinc-500">
            Simp<span className="hidden sm:inline">lify</span>
          </span>
          <span className="text-[7px] text-zinc-600 font-bold leading-none hidden sm:block">CHORDS</span>
        </div>
        <Switch
          checked={simplify}
          disabled={isPending}
          onCheckedChange={(checked) => handlePrefChange(transpose, checked)}
          className="data-[state=checked]:bg-orange-500 scale-75 sm:scale-90 origin-center"
        />
      </div>

      {/* 4. GRUPPO SPEED AUTOSCROLL */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 bg-zinc-900/40 sm:bg-transparent p-1 sm:p-0 rounded-xl border border-zinc-800/50 sm:border-transparent">
        <div className="flex flex-col items-center justify-center min-w-[20px] sm:min-w-[40px]">
          <span className="text-[8px] font-mono font-bold tracking-wider text-zinc-500 uppercase hidden sm:block">Scroll</span>
          <span className="text-xs sm:text-sm font-mono font-bold text-zinc-200">{scrollSpeed}</span>
        </div>

        <div className="flex flex-col -space-y-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScrollSpeed((prev) => Math.min(prev + 1, 20))}
            className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500 hover:text-zinc-200"
          >
            <ChevronUp size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScrollSpeed((prev) => Math.max(prev - 1, 1))}
            className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500 hover:text-zinc-200"
          >
            <ChevronDown size={14} />
          </Button>
        </div>
      </div>

    </footer>
  );
}