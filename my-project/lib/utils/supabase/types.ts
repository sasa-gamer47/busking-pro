// app/types.ts

// 1. Definiamo il singolo pezzetto di testo con il suo accordo
export interface SongSegment {
  chord: string | null
  text: string
}

// 2. Definiamo la linea/verso che contiene i segmenti
export interface SongLine {
  segments: SongSegment[]
}

// 3. Definiamo la sezione (Strofa, Ritornello, ecc.)
export interface SongSection {
  type: "strofa" | "ritornello" | "ponte" | "intro" | "outro" // Rotte fisse per evitare errori
  label: string // Es. "Strofa 1"
  lines: SongLine[]
}

// 4. Modifichiamo l'interfaccia della Canzone sostituendo 'any' con il tipo reale
export interface Song {
  id: string
  user_id: string
  title: string
  artist: string | null
  original_key: string
  content: SongSection[] // <-- ORA È IL TUO JSONB REALE E RIGIDO!
  duration: number
  created_at: string
}

export interface SetlistSongJoin {
  position: number
  songs: Song | null
}

export interface Setlist {
  id: string
  user_id: string
  title: string
  description: string | null
  created_at: string
  setlist_songs: SetlistSongJoin[]
}

export interface Todo {
  id: string
  user_id: string
  text: string
  is_done: boolean
  created_at: string
}

export interface SetlistSongRow {
  position: number
  songs: Song | null
}

export interface SongSegment {
  text: string
  chord: string | null
}

export interface SongLine {
  segments: SongSegment[]
}

export interface SongSection {
  verseType: string
  label: string
  lines: SongLine[]
}