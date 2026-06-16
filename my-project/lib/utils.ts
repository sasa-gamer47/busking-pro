import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function transposeChord(chord: string, semitones: number): string {
  if (!chord || semitones === 0) return chord;

  // 1. Definiamo le costanti per entrambe le notazioni
  const SCALE_ITA = ["DO", "DO#", "RE", "RE#", "MI", "FA", "FA#", "SOL", "SOL#", "LA", "LA#", "SI"];
  const FLAT_TO_SHARP_ITA: { [key: string]: string } = {
    "REb": "DO#", "MIb": "RE#", "SOLb": "FA#", "LAb": "SOL#", "SIb": "LA#"
  };

  const SCALE_ENG = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const FLAT_TO_SHARP_ENG: { [key: string]: string } = {
    "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#"
  };

  // 2. Gestione del basso (es. MI/SOL# o E/G#) via ricorsione
  if (chord.includes("/")) {
    return chord
      .split("/")
      .map((part) => transposeChord(part, semitones))
      .join("/");
  }

  let rootNote = "";
  let extension = "";
  let isEnglish = false;

  // 3. Generiamo la lista di tutte le note possibili per il check, ordinate dalla più lunga alla più corta
  // Includiamo sia italiane che inglesi (es. SOL#, Bb, FA, C...)
  const allPossibleNotes = [
    ...SCALE_ITA, ...Object.keys(FLAT_TO_SHARP_ITA),
    ...SCALE_ENG, ...Object.keys(FLAT_TO_SHARP_ENG)
  ].sort((a, b) => b.length - a.length);

  for (const note of allPossibleNotes) {
    if (chord.startsWith(note)) {
      rootNote = note;
      extension = chord.slice(note.length);
      break;
    }
  }

  // Se non trova una nota corrispondente, restituisce l'originale per sicurezza
  if (!rootNote) return chord;

  // 4. Capiamo se l'accordo è in notazione inglese o italiana
  // Se la nota fa parte della scala ENG o dei suoi bemolli (e non è sovrapponibile a quella ITA come FA o A/LA)
  // Nota: l'unico potenziale conflitto è 'A' (LA in inglese) e 'A' di l'inizio di qualcos'altro, 
  // ma SCALE_ENG contiene "A" e SCALE_ITA contiene "LA", quindi sono ben distinte.
  if (SCALE_ENG.includes(rootNote) || FLAT_TO_SHARP_ENG[rootNote]) {
    isEnglish = true;
  }

  // 5. Normalizziamo e calcoliamo l'indice in base alla lingua rilevata
  let normalizedNote = rootNote;
  const currentScale = isEnglish ? SCALE_ENG : SCALE_ITA;
  const currentFlatMap = isEnglish ? FLAT_TO_SHARP_ENG : FLAT_TO_SHARP_ITA;

  if (currentFlatMap[normalizedNote]) {
    normalizedNote = currentFlatMap[normalizedNote];
  }

  const currentIndex = currentScale.indexOf(normalizedNote);
  if (currentIndex === -1) return chord;

  let newIndex = (currentIndex + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  // 6. Ricomponiamo l'accordo usando la scala corretta
  return currentScale[newIndex] + extension;
}

export function simplifyChord(chord: string): string {
  if (!chord) return chord;

  const SCALE_ITA = ["DO", "DO#", "RE", "RE#", "MI", "FA", "FA#", "SOL", "SOL#", "LA", "LA#", "SI"];
  const FLAT_TO_SHARP_ITA: { [key: string]: string } = {
    "REb": "DO#", "MIb": "RE#", "SOLb": "FA#", "LAb": "SOL#", "SIb": "LA#"
  };

  const SCALE_ENG = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const FLAT_TO_SHARP_ENG: { [key: string]: string } = {
    "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#"
  };

  // 1. Se c'è un basso alterato (es. DO/MI o C/E), eliminiamo tutto ciò che sta dopo lo slash
  // perché per semplificare si suona solo la triade fondamentale dell'accordo
  if (chord.includes("/")) {
    chord = chord.split("/")[0];
  }

  // 2. Troviamo la nota fondamentale (rootNote) usando la stessa logica blindata di prima
  let rootNote = "";
  const allPossibleNotes = [
    ...SCALE_ITA, ...Object.keys(FLAT_TO_SHARP_ITA),
    ...SCALE_ENG, ...Object.keys(FLAT_TO_SHARP_ENG)
  ].sort((a, b) => b.length - a.length);

  for (const note of allPossibleNotes) {
    if (chord.startsWith(note)) {
      rootNote = note;
      break;
    }
  }

  // Se non viene riconosciuta nessuna nota iniziale, restituisce l'accordo originale intatto
  if (!rootNote) return chord;

  // 3. Estraiamo il resto dell'accordo dopo la nota fondamentale per verificare se è minore
  const rest = chord.slice(rootNote.length).toLowerCase();

  // 4. Regola di semplificazione:
  // Se nel resto dell'accordo c'è una "m" (ma NON "maj" o "max" che indicano la settima maggiore)
  // allora l'accordo è minore, quindi teniamo solo la nota + "m". Altrimenti diventa maggiore puro.
  if (rest.includes("m") && !rest.includes("maj") && !rest.includes("max")) {
    return rootNote + "m";
  }

  // Altrimenti restituisce semplicemente la nota fondamentale (accordo maggiore)
  return rootNote;
}


export function formatChordNotation(chord: string, notation: string): string {
  if (notation !== "italian" || !chord) return chord

  const notationMap: Record<string, string> = {
    C: "Do",
    D: "Re",
    E: "Mi",
    F: "Fa",
    G: "Sol",
    A: "La",
    B: "Si",
  }

  const root = chord.charAt(0).toUpperCase()
  const rest = chord.slice(1)

  if (notationMap[root]) {
    return notationMap[root] + rest
  }

  return chord
}