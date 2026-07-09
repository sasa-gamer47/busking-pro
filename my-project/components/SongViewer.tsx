"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Song } from "@/lib/utils/supabase/types";
import { transposeChord, simplifyChord, formatChordNotation } from "@/lib/utils";
import { createClient } from "@/lib/utils/supabase/client";
import SongHeader from "@/components/SongHeader";
import SongLyricsArea from "@/components/SongLyricsArea";
import SongControls from "@/components/SongControls";
import SongSidebar from "@/components/SongSidebar";

interface SongViewerProps {
  song: Song;
  setlistId?: string;
  initialTranspose?: number;
  initialSimplify?: boolean;
  backUrl: string;
  adjacentSongs?: { prev: string | null; next: string | null };
  onPreferenceChange?: (transpose: number, simplify: boolean) => void;
  onNavigate?: (targetSongId: string) => void;
  showNavigation?: boolean;
  settings?: {
    chord_notation: string;
    default_font_size: string;
    default_scroll_speed: number;
  };
}

export default function SongViewer({
  song,
  setlistId,
  initialTranspose = 0,
  initialSimplify = false,
  backUrl,
  adjacentSongs = { prev: null, next: null },
  onPreferenceChange,
  onNavigate,
  showNavigation = false,
  settings = {
    chord_notation: "english",
    default_font_size: "md",
    default_scroll_speed: 5,
  },
}: SongViewerProps) {
  const [prevSongId, setPrevSongId] = useState(song.id);
  const [transpose, setTranspose] = useState(initialTranspose);
  const [simplify, setSimplify] = useState(initialSimplify);
  const [scrollSpeed, setScrollSpeed] = useState(settings.default_scroll_speed);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (song.id !== prevSongId) {
    setPrevSongId(song.id);
    setTranspose(initialTranspose);
    setSimplify(initialSimplify);
    setScrollSpeed(settings.default_scroll_speed);
    setIsScrolling(false);
    setIsSidebarOpen(false);
  }
  
  const scrollContainerRef = useRef<HTMLElement>(null);

  const [liveBpm, setLiveBpm] = useState<number>(song.bpm ?? 120);
  const [liveKey, setLiveKey] = useState<string>(song.original_key ?? "C");
  const [liveCapo, setLiveCapo] = useState<number>(0);
  const [liveTuning, setLiveTuning] = useState<string>("Standard (E A D G B E)");

  useEffect(() => {
    const fetchLiveSetupData = async () => {
      const supabase = createClient();
      try {
        const { data: songData, error: songError } = await supabase
          .from("songs")
          .select("bpm, original_key, tuning")
          .eq("id", song.id)
          .single();

        if (songError) throw songError;

        if (songData) {
          setLiveBpm(songData.bpm ?? 120);
          setLiveKey(songData.original_key ?? "C");
          setLiveTuning(songData.tuning ?? "Standard (E A D G B E)");
        }

        const query = supabase
          .from("setlist_songs")
          .select("capo")
          .eq("song_id", song.id);
          
        if (setlistId) query.eq("setlist_id", setlistId);

        const { data: linkData, error: linkError } = await query.maybeSingle();

        if (!linkError && linkData) {
          setLiveCapo(linkData.capo ?? 0);
        } else {
          setLiveCapo(0); 
        }
      } catch (err) {
        console.error("Errore nel caricamento del Setup Live:", err);
      }
    };

    fetchLiveSetupData();
  }, [song.id, setlistId]);

  const handlePreferenceUpdate = (newTranspose: number, newSimplify: boolean) => {
    setTranspose(newTranspose);
    setSimplify(newSimplify);
    if (onPreferenceChange) onPreferenceChange(newTranspose, newSimplify);
  };

  const handleLiveSetupUpdate = async (updatedData: { bpm: number; currentKey: string; capo: number; tuning: string }) => {
    setLiveBpm(updatedData.bpm);
    setLiveKey(updatedData.currentKey);
    setLiveCapo(updatedData.capo);
    setLiveTuning(updatedData.tuning);

    const supabase = createClient();
    try {
      const { error: songError } = await supabase
        .from("songs")
        .update({
          bpm: updatedData.bpm,
          original_key: updatedData.currentKey,
          tuning: updatedData.tuning,
        })
        .eq("id", song.id);

      if (songError) throw new Error(`Errore Tabella Canzoni: ${songError.message}`);

      const linkQuery = supabase
        .from("setlist_songs")
        .update({ capo: updatedData.capo })
        .eq("song_id", song.id);

      if (setlistId) linkQuery.eq("setlist_id", setlistId);
      const { error: linkError } = await linkQuery;
      if (linkError) console.warn("Nessun record in setlist_songs trovato da aggiornare.");
    } catch (error: unknown) {
      console.error("Errore Database:", error instanceof Error ? error.message : error);
    }
  };

  const uniqueChords = useMemo(() => {
    if (!song.content) return [];
    return Array.from(
      new Set(
        song.content.flatMap((section) =>
          section.lines?.flatMap((line) =>
            line.segments
              ?.map((seg) => seg.chord)
              .filter((chord): chord is string => !!chord)
              .map((chord) => {
                const processed = simplify
                  ? simplifyChord(transposeChord(chord, transpose))
                  : transposeChord(chord, transpose);
                return formatChordNotation(processed, settings.chord_notation);
              })
          )
        )
      )
    );
  }, [song.content, transpose, simplify, settings.chord_notation]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isScrolling) {
      intervalId = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += 1;
        }
      }, Math.max(8, (11 - scrollSpeed) * 15)); 
    }
    return () => clearInterval(intervalId);
  }, [isScrolling, scrollSpeed]);

  return (
    /* FIX ALTEZZE RIGIDE:
       Definiamo esplicitamente le righe: Header (60px), Testo (1fr), Player (75px su mobile, 80px su tablet/PC).
       Il box principale occupa l'intera altezza senza sbordare e senza comprimersi.
    */
    <div className="grid h-screen fixed left-0 lg:left-[20%] right-0 grid-cols-1 lg:grid-cols-[1fr_270px] grid-rows-[60px_1fr_75px] sm:grid-rows-[60px_1fr_80px] bg-zinc-950 text-zinc-300 overflow-hidden w-full lg:w-auto">
      
      <SongHeader 
        backUrl={backUrl} 
        title={song.title} 
        artist={song.artist} 
        bpm={liveBpm}
        currentKey={liveKey}
        capo={liveCapo}
        tuning={liveTuning}
        onUpdate={handleLiveSetupUpdate}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* CENTRO SINISTRA: Area Testo */}
      <div className="col-start-1 col-end-2 row-start-2 row-end-3 overflow-hidden h-full w-full">
        <SongLyricsArea
          scrollContainerRef={scrollContainerRef}
          content={song.content || undefined}
          transpose={transpose}
          simplify={simplify}
          fontSize={settings.default_font_size}
          notation={settings.chord_notation}
        />
      </div>

      {/* CENTRO DESTRA: Sidebar PC */}
      <div className="hidden lg:block lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3 border-l border-zinc-900/80 h-full w-full overflow-hidden">
        <SongSidebar
          originalKey={formatChordNotation(liveKey || "N/A", settings.chord_notation)}
          bpm={liveBpm || 92}
          uniqueChords={uniqueChords}
          capo={liveCapo}
          tuning={liveTuning}
          isOpen={isSidebarOpen}
        />
      </div>

      {/* BOTTOM BAR: Controlli ancorati all'ultima riga */}
      <div className="col-start-1 col-end-2 lg:col-end-3 row-start-3 row-end-4 bg-zinc-950 w-full h-full border-t border-zinc-900/80 overflow-hidden flex">
        <SongControls
          isScrolling={isScrolling}
          setIsScrolling={setIsScrolling}
          scrollSpeed={scrollSpeed}
          setScrollSpeed={setScrollSpeed}
          transpose={transpose}
          simplify={simplify}
          adjacentSongs={adjacentSongs}
          songId={song.id}
          setlistId={setlistId}
          showNavigation={showNavigation}
          onPreferenceChange={handlePreferenceUpdate}
          onNavigate={onNavigate}
        />
      </div>

      {/* Sidebar Mobile/Tablet */}
      {isSidebarOpen && (
        <div className="lg:hidden">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <SongSidebar
            originalKey={formatChordNotation(liveKey || "N/A", settings.chord_notation)}
            bpm={liveBpm || 92}
            uniqueChords={uniqueChords}
            capo={liveCapo}
            tuning={liveTuning}
            isOpen={isSidebarOpen}
          />
        </div>
      )}

    </div>
  );
}