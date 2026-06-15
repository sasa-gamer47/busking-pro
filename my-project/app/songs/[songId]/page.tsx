"use client";

import { use, useState, useEffect } from "react";
import { getSongById } from "@/lib/utils/actions";
import { Song } from "@/lib/utils/supabase/types";
import SongViewer from "@/components/SongViewer";

interface PageProps {
  params: Promise<{ songId: string }>;
}

export default function GlobalSongPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSongById(resolvedParams.songId).then((songData) => {
      setSong(songData);
      setLoading(false);
    });
  }, [resolvedParams.songId]);

  if (loading) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Caricamento...</div>;
  if (!song) return <div>Canzone non trovata</div>;

  return (
    <SongViewer
      song={song}
      backUrl="/" // Ritorna alla dashboard globale
      showNavigation={false} // Nasconde Prev/Next
    />
  );
}