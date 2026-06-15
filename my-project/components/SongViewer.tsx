"use client";

import { useState, useEffect, useRef } from "react";
import { Song } from "@/lib/utils/supabase/types";
import { transposeChord, simplifyChord } from "@/lib/utils";
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
}: SongViewerProps) {
  // Use the song.id as a key to reset local state when the song changes
  // This avoids the "cascading renders" warning from useEffect
  const [transpose, setTranspose] = useState(initialTranspose);
  const [simplify, setSimplify] = useState(initialSimplify);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(10);
  
  const scrollContainerRef = useRef<HTMLElement>(null);

  // Reset local state when song changes or initial props change
  const [prevSongId, setPrevSongId] = useState(song.id);
  if (song.id !== prevSongId) {
    setPrevSongId(song.id);
    setTranspose(initialTranspose);
    setSimplify(initialSimplify);
    setIsScrolling(false);
  }

  // Motore di Autoscroll
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isScrolling) {
      intervalId = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollBy({
            top: 0.5,
            behavior: "auto",
          });
        }
      }, Math.max(1, 60 - scrollSpeed * 2.5));
    }
    return () => clearInterval(intervalId);
  }, [isScrolling, scrollSpeed]);

  const handlePreferenceUpdate = (newTranspose: number, newSimplify: boolean) => {
    setTranspose(newTranspose);
    setSimplify(newSimplify);
    if (onPreferenceChange) {
      onPreferenceChange(newTranspose, newSimplify);
    }
  };

  // Estrazione unica degli accordi trasposti/semplificati per la sidebar
  const uniqueChords = Array.from(
    new Set(
      song.content?.flatMap((section) =>
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
    <div className="grid h-screen fixed left-[20%] right-0 grid-cols-[1fr_270px] grid-rows-[60px_1fr_80px] bg-zinc-900 text-zinc-300 overflow-hidden">
      
      <SongHeader backUrl={backUrl} title={song.title} artist={song.artist} />

      <SongLyricsArea
        scrollContainerRef={scrollContainerRef}
        content={song.content}
        transpose={transpose}
        simplify={simplify}
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
        originalKey={song.original_key || "N/A"}
        bpm={song.bpm || 92}
        uniqueChords={uniqueChords}
      />

    </div>
  );
}