"use server" // Rende tutte le funzioni di questo file delle Server Actions esclusive del server

import { createClient } from "@/lib/utils/supabase/server"
import { Setlist } from "./supabase/types"

/**
 * Recupera i dati riassuntivi per le statistiche della Dashboard
 */
export async function getDashboardStats() {
  const supabase = await createClient()

  // 1. Contiamo quante canzoni totali ha l'utente loggato
  const { count: songsCount, error: songsError } = await supabase
    .from("songs")
    .select("*", { count: "exact", head: true })

  // 2. Contiamo quante scalette totali ha l'utente loggato
  const { count: setlistsCount, error: setlistsError } = await supabase
    .from("setlists")
    .select("*", { count: "exact", head: true })

  if (songsError || setlistsError) {
    console.error("Errore nel recupero delle statistiche:", songsError || setlistsError)
    return { songsCount: 0, setlistsCount: 0 }
  }

  return {
    songsCount: songsCount || 0,
    setlistsCount: setlistsCount || 0
  }
}

/**
 * Recupera le ultime canzoni inserite dall'utente
 */
export async function getRecentSongs(limit = 3) {
  const supabase = await createClient()

  const { data: songs, error } = await supabase
    .from("songs")
    .select("id, title, artist, original_key, created_at")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Errore nel recupero delle canzoni recenti:", error)
    return []
  }

  return songs
}

export async function getRecentSetlists(limit = 3): Promise<Setlist[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("setlists")
    .select(`
      id,
      user_id,
      title,
      description,
      created_at,
      setlist_songs (
        position,
        songs (
          id,
          user_id,
          title,
          artist,
          original_key,
          content,
          created_at
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Errore nel recupero delle scalette:", error)
    return []
  }

  // Trucco magico: diciamo a TypeScript di fidarsi perché la query select 
  // combacia perfettamente con l'interfaccia strutturata in types.ts
  return data as unknown as Setlist[]
}