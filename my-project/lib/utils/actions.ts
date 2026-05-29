"use server" // Rende tutte le funzioni di questo file delle Server Actions esclusive del server

import { createClient } from "@/lib/utils/supabase/server"
import { Setlist } from "./supabase/types"
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