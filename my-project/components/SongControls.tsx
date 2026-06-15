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
    <footer className="col-start-1 col-end-2 row-start-3 row-end-4 border-t border-zinc-900 bg-zinc-950 px-8 flex items-center justify-between select-none">
      
      {/* SEZIONE PLAYER LIVE (PREV - SCROLL - NEXT) */}
      <div className="flex items-center gap-2">
        {showNavigation && (
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={!adjacentSongs.prev}
              onClick={() => adjacentSongs.prev && onNavigate?.(adjacentSongs.prev)}
              className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 group cursor-pointer"
            >
              <SkipBack size={22} className="fill-zinc-400 group-hover:fill-zinc-200 transition-colors" />
            </Button>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 font-bold uppercase">Prev</span>
          </div>
        )}

        <Button
          size="icon"
          onClick={() => setIsScrolling(!isScrolling)}
          className={`w-12 h-12 rounded-full transition-transform active:scale-95 shadow-none cursor-pointer ${
            isScrolling ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-zinc-300 hover:bg-zinc-100 text-zinc-950"
          }`}
        >
          {isScrolling ? <Pause size={22} className="fill-current" /> : <Play size={22} className="fill-current pl-0.5" />}
        </Button>

        {showNavigation && (
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={!adjacentSongs.next}
              onClick={() => adjacentSongs.next && onNavigate?.(adjacentSongs.next)}
              className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 group cursor-pointer"
            >
              <SkipForward size={22} className="fill-zinc-400 group-hover:fill-zinc-200 transition-colors" />
            </Button>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 font-bold uppercase">Next</span>
          </div>
        )}
      </div>

      {/* SEZIONE TRANSPOSE */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 cursor-pointer disabled:opacity-50"
          onClick={() => handlePrefChange(transpose - 1, simplify)}
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
          disabled={isPending}
          className="h-9 w-9 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 cursor-pointer disabled:opacity-50"
          onClick={() => handlePrefChange(transpose + 1, simplify)}
        >
          <PlusCircle size={20} />
        </Button>
      </div>

      {/* SEZIONE SIMPLIFY */}
      <div className="flex items-center gap-3 px-4">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">Simplify</span>
          <span className="text-[9px] text-zinc-600 leading-none">CHORDS</span>
        </div>
        <Switch
          checked={simplify}
          disabled={isPending}
          onCheckedChange={(checked) => handlePrefChange(transpose, checked)}
          className="data-[state=checked]:bg-orange-500 cursor-pointer"
        />
      </div>

      <div className="h-8 w-1 bg-zinc-900" />

      {/* SEZIONE SPEED AUTOSCROLL */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center min-w-12">
          <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">Scroll</span>
          <span className="text-base font-mono font-bold text-zinc-200">{scrollSpeed}</span>
        </div>
        <div className="flex flex-col -space-y-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScrollSpeed((prev) => Math.min(prev + 1, 20))}
            className="h-6 w-6 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 cursor-pointer"
          >
            <ChevronUp size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScrollSpeed((prev) => Math.max(prev - 1, 1))}
            className="h-6 w-6 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 cursor-pointer"
          >
            <ChevronDown size={16} />
          </Button>
        </div>
      </div>

    </footer>
  );
}