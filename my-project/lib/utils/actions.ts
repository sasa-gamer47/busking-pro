"use server" // Rende tutte le funzioni di questo file delle Server Actions esclusive del server

import { createClient } from "@/lib/utils/supabase/server"
import { Setlist, SetlistSongItem, SetlistSongPreferences, SetlistSongRow, Song } from "./supabase/types"
import { Todo } from "@/lib/utils/supabase/types"

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
    console.log(songsError)
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

/**
 * Recupera i dettagli di una singola scaletta tramite il suo ID
 */
export async function getSetlistById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("setlists")
    .select("*")
    .eq("id", id)
    .single() // Diciamo a Supabase che ci aspettiamo un solo oggetto, non un array

  if (error) {
    console.error(`Errore nel recupero della scaletta ${id}:`, error.message)
    return null
  }

  return data
}

/**
 * Recupera l'elenco piatto delle canzoni di una scaletta, ordinate per posizione
 */
export async function getSongsBySetlistId(setlistId: string): Promise<(Song & { position: number })[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("setlist_songs")
    .select(`
      position,
      songs (
        id,
        user_id,
        title,
        artist,
        original_key,
        content,
        duration,
        created_at
      )
    `)
    .eq("setlist_id", setlistId)
    .order("position", { ascending: true })

  if (error) {
    console.error("Errore nel recupero delle canzoni della scaletta:", error.message)
    return []
  }

  if (!data) return []

  // Castiamo esplicitamente 'data' per bypassare l'errore del parser dei tipi di Supabase
  const typedData = data as unknown as SetlistSongRow[]

  return typedData
    .filter((item) => item.songs !== null) // Rimuove eventuali record corrotti se una canzone è stata eliminata
    .map((item) => ({
      id: item.songs!.id,
      user_id: item.songs!.user_id,
      title: item.songs!.title,
      artist: item.songs!.artist,
      original_key: item.songs!.original_key,
      content: item.songs!.content,
      duration: item.songs!.duration, // Ora è un numero (secondi) che arriva dal DB
      created_at: item.songs!.created_at,
      position: item.position // Estraiamo la posizione dalla tabella ponte e la uniamo alla canzone
    }))
}

/**
 * Recupera tutti i todos dell'utente loggato
 */
export async function getTodos(limit: number = 3): Promise<Todo[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Errore nel recupero dei todos:", error)
    return []
  }

  return data as Todo[]
}

/**
 * Crea un nuovo todo
 */
export async function addTodo(text: string) {
  const supabase = await createClient()

  // 1. Recuperiamo l'utente attualmente loggato lato server
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("Tentativo di aggiunta todo senza utente autenticato")
    return { success: false, error: "Utente non autenticato" }
  }

  // 2. Inseriamo la riga includendo obbligatoriamente lo user_id
  const { data, error } = await supabase
    .from("todos")
    .insert([
      { 
        text: text,
        user_id: user.id // <-- QUESTO SBLOCCA LA POLICY RLS!
      }
    ])
    .select()

  if (error) {
    console.error("Errore nell'aggiunta del todo:", error)
    return { success: false, error }
  }

  return { success: true, data }
}

/**
 * Aggiorna lo stato is_done di un todo
 */
export async function toggleTodoStatus(id: string, isDone: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("todos")
    .update({ is_done: isDone })
    .eq("id", id)

  if (error) {
    console.error("Errore nell'aggiornamento del todo:", error)
    return { success: false, error }
  }

  return { success: true }
}

/**
 * Elimina un todo
 */
export async function deleteTodo(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Errore nell'eliminazione del todo:", error)
    return { success: false, error }
  }

  return { success: true }
}


/**
 * Recupera tutti i dettagli di una singola canzone tramite il suo ID
 */
export async function getSongById(id: string): Promise<Song | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("songs")
    .select(`
      id,
      user_id,
      title,
      artist,
      original_key,
      content,
      duration,
      created_at
    `)
    .eq("id", id)
    .single() // Ci aspettiamo un solo record

  if (error) {
    console.error(`Errore nel recupero della canzone ${id}:`, error.message)
    return null
  }

  // Castiamo il risultato per assicurare a TypeScript che rispetti l'interfaccia Song
  return data as unknown as Song
}


export async function updateSongPreferences(
  setlistId: string,
  songId: string, 
  transpose: number, 
  isSimplified: boolean
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('setlist_songs')
    .update({ 
      transpose: transpose, 
      is_simplified: isSimplified 
    })
    .eq('setlist_id', setlistId)
    .eq('song_id', songId);

  if (error) {
    console.error("Errore durante il salvataggio delle preferenze:", error.message);
    return { success: false, error };
  }

  return { success: true, data };
}




export async function getSetlistSongPreferences(
  setlistId: string,
  songId: string
): Promise<{ success: boolean; data?: SetlistSongPreferences; error?: string }> {
  const supabase = await createClient();

  // 1. Controllo di sicurezza: Recupera l'utente autenticato dalla sessione
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Non autorizzato. Effettua il login." };
  }

  // 2. Interroga setlist_songs verificando la proprietà della setlist tramite l'user_id dello user loggato
  const { data, error } = await supabase
    .from("setlist_songs")
    .select(`
      transpose,
      is_simplified,
      position,
      setlists!inner(user_id)
    `)
    .eq("setlist_id", setlistId)
    .eq("song_id", songId)
    .eq("setlists.user_id", user.id) // Protezione IDOR: la setlist deve appartenere all'utente corrente
    .maybeSingle(); // Ritorna un oggetto singolo o null se non trova nulla

  if (error) {
    console.error("Errore nel recupero delle preferenze:", error.message);
    return { success: false, error: "Errore interno del database." };
  }

  if (!data) {
    return { success: false, error: "Nessuna preferenza trovata per questa canzone in questa scaletta." };
  }

  // Rimuoviamo il nodo 'setlists' aggiunto dalla inner join per pulire l'output
  const { setlists, ...preferences } = data;

  return {
    success: true,
    data: preferences as SetlistSongPreferences,
  };
}

export async function getSongsFromSetlist(
  setlistId: string
): Promise<{ success: boolean; data?: SetlistSongItem[]; error?: string }> {
  const supabase = await createClient();

  // 1. Controllo di sicurezza: recupera l'utente autenticato
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Non autorizzato. Effettua il login." };
  }

  // 2. Recupera tutte le canzoni della scaletta ordinate per posizione
  const { data, error } = await supabase
    .from("setlist_songs")
    .select(`
      song_id,
      position,
      transpose,
      is_simplified,
      setlists!inner(user_id),
      songs(title, artist, duration)
    `)
    .eq("setlist_id", setlistId)
    .eq("setlists.user_id", user.id) // Sicurezza: verifica che la scaletta sia dell'utente loggato
    .order("position", { ascending: true }); // Ordina i brani per l'esecuzione live

  if (error) {
    console.error("Errore nel recupero dei brani della scaletta:", error.message);
    return { success: false, error: "Errore durante il recupero della scaletta." };
  }

  // Puliamo l'output rimuovendo l'oggetto di join 'setlists' che è servito solo per il controllo user_id
  const cleanedData = data.map(({ setlists, ...rest }) => rest) as unknown as SetlistSongItem[];

  return {
    success: true,
    data: cleanedData,
  };
}