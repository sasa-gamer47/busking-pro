"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSongById, updateSongPreferences, getSetlistSongPreferences, getSongsFromSetlist } from "@/lib/utils/actions";
import { Song } from "@/lib/utils/supabase/types";
import SongViewer from "@/components/SongViewer";

interface PageProps {
  params: Promise<{ setlistId: string; songId: string }>;
}

export default function SetlistPerformancePage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState({ transpose: 0, simplify: false });
  const [adjacentSongs, setAdjacentSongs] = useState<{ prev: string | null; next: string | null }>({ prev: null, next: null });

  useEffect(() => {
    Promise.all([
      getSongById(resolvedParams.songId),
      getSetlistSongPreferences(resolvedParams.setlistId, resolvedParams.songId),
      getSongsFromSetlist(resolvedParams.setlistId),
    ]).then(([songData, prefsData, setlistSongs]) => {
      setSong(songData);
      setPrefs({
        transpose: prefsData?.data?.transpose ?? 0,
        simplify: prefsData?.data?.is_simplified ?? false,
      });

      if (setlistSongs?.success && setlistSongs.data) {
        const sorted = setlistSongs.data;
        const idx = sorted.findIndex((s: { song_id: string }) => s.song_id === resolvedParams.songId);
        setAdjacentSongs({
          prev: idx > 0 ? sorted[idx - 1].song_id : null,
          next: idx < sorted.length - 1 ? sorted[idx + 1].song_id : null,
        });
      }
      setLoading(false);
    });
  }, [resolvedParams]);

  if (loading) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Caricamento...</div>;
  if (!song) return <div>Canzone non trovata</div>;

  return (
    <SongViewer
      song={song}
      initialTranspose={prefs.transpose}
      initialSimplify={prefs.simplify}
      backUrl={`/setlists/${resolvedParams.setlistId}`}
      showNavigation={true} // Abilita prev/next
      adjacentSongs={adjacentSongs}
      onNavigate={(id) => router.push(`/setlists/${resolvedParams.setlistId}/songs/${id}`)}
      onPreferenceChange={async (t, s) => {
        await updateSongPreferences(resolvedParams.setlistId, song.id, t, s);
      }}
    />
  );
}