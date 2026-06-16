"use client";

import { useState, useEffect, useRef } from "react";
import { Song } from "@/lib/utils/supabase/types";
import { transposeChord, simplifyChord, formatChordNotation } from "@/lib/utils";
import { createClient } from "@/lib/utils/supabase/client";
import SongHeader from "@/components/SongHeader";
import SongLyricsArea from "@/components/SongLyricsArea";
import SongControls from "@/components/SongControls";
import SongSidebar from "@/components/SongSidebar";

interface SongViewerProps {
  song: Song;
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
  // Stati di controllo della visualizzazione (Transposizione, scorrimento, ecc.)
  const [prevSongId, setPrevSongId] = useState(song.id);
  const [transpose, setTranspose] = useState(initialTranspose);
  const [simplify, setSimplify] = useState(initialSimplify);
  const [scrollSpeed, setScrollSpeed] = useState(settings.default_scroll_speed);
  const [isScrolling, setIsScrolling] = useState(false);

  // Reset degli stati di navigazione al cambio di brano
  if (song.id !== prevSongId) {
    setPrevSongId(song.id);
    setTranspose(initialTranspose);
    setSimplify(initialSimplify);
    setScrollSpeed(settings.default_scroll_speed);
    setIsScrolling(false);
  }
  
  const scrollContainerRef = useRef<HTMLElement>(null);

  // --- STATI LOCALI DEL SETUP LIVE ---
  const [liveBpm, setLiveBpm] = useState<number>(song.bpm ?? 120);
  const [liveKey, setLiveKey] = useState<string>(song.original_key ?? "C");
  const [liveCapo, setLiveCapo] = useState<number>(0);
  const [liveTuning, setLiveTuning] = useState<string>("Standard (E A D G B E)");

  // --- REPERIMENTO DATI DAL DB ONLOAD / CAMBIO BRANO ---
  useEffect(() => {
    const fetchLiveSetupData = async () => {
      const supabase = createClient();

      try {
        // 1. Legge le info principali del brano
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

        // 2. Legge il capotasto dalla tabella pivot di collegamento
        const { data: linkData, error: linkError } = await supabase
          .from("setlist_songs")
          .select("capo")
          .eq("song_id", song.id)
          .maybeSingle();

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
  }, [song.id]);

  const handlePreferenceUpdate = (newTranspose: number, newSimplify: boolean) => {
    setTranspose(newTranspose);
    setSimplify(newSimplify);
    if (onPreferenceChange) {
      onPreferenceChange(newTranspose, newSimplify);
    }
  };

  // --- SALVATAGGIO ASINCRONO SU SUPABASE ---
  const handleLiveSetupUpdate = async (updatedData: { bpm: number; currentKey: string; capo: number; tuning: string }) => {
    // Aggiornamento ottimista UI per azzerare la latenza visiva
    setLiveBpm(updatedData.bpm);
    setLiveKey(updatedData.currentKey);
    setLiveCapo(updatedData.capo);
    setLiveTuning(updatedData.tuning);

    const supabase = createClient();

    try {
      // 1. Aggiorna i metadati globali del brano
      const { error: songError } = await supabase
        .from("songs")
        .update({
          bpm: updatedData.bpm,
          original_key: updatedData.currentKey,
          tuning: updatedData.tuning,
        })
        .eq("id", song.id);

      if (songError) {
        throw new Error(`Errore Tabella Canzoni: ${songError.message}`);
      }

      // 2. Aggiorna il valore locale del capotasto nella scaletta
      const { error: linkError } = await supabase
        .from("setlist_songs")
        .update({ capo: updatedData.capo })
        .eq("song_id", song.id);
      
      if (linkError) {
        console.warn("Nessun record setlist_songs trovato da aggiornare per questa song_id.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Errore sconosciuto";
      console.error("Errore Database:", errorMessage);
      alert("Impossibile salvare i dati: " + errorMessage);
    }
  };

  // Estrazione e mappatura degli accordi unici della traccia
  const uniqueChords = Array.from(
    new Set(
      song.content?.flatMap((section) =>
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

  // Motore di Autoscroll
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
    <div className="grid h-screen fixed left-[20%] right-0 grid-cols-[1fr_270px] grid-rows-[60px_1fr_80px] bg-zinc-900 text-zinc-300 overflow-hidden">
      
      <SongHeader 
        backUrl={backUrl} 
        title={song.title} 
        artist={song.artist} 
        bpm={liveBpm}
        currentKey={liveKey}
        capo={liveCapo}
        tuning={liveTuning}
        onUpdate={handleLiveSetupUpdate}
      />

      <SongLyricsArea
        scrollContainerRef={scrollContainerRef}
        content={song.content}
        transpose={transpose}
        simplify={simplify}
        fontSize={settings.default_font_size}
        notation={settings.chord_notation}
      />

      <SongControls
        isScrolling={isScrolling}
        setIsScrolling={setIsScrolling}
        scrollSpeed={scrollSpeed}
        setScrollSpeed={setScrollSpeed}
        transpose={transpose}
        simplify={simplify}
        adjacentSongs={adjacentSongs}
        songId={song.id}
        showNavigation={showNavigation}
        onPreferenceChange={handlePreferenceUpdate}
        onNavigate={onNavigate}
      />

      <SongSidebar
        originalKey={formatChordNotation(liveKey || "N/A", settings.chord_notation)}
        bpm={liveBpm || 92}
        uniqueChords={uniqueChords}
        capo={liveCapo}
        tuning={liveTuning}
      />

    </div>
  );
}