/**
 * Trasforma una data (stringa ISO del DB o oggetto Date) in formato esteso italiano.
 * Esempio: "2026-05-22T16:42:23" --> "22 maggio 2026"
 */
export function formatLongDate(dateString: string | Date): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

/**
 * Trasforma una data nel classico formato numerico compatto.
 * Esempio: "2026-05-22T16:42:23" --> "22/05/2026"
 */
export function formatShortDate(dateString: string | Date): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

/**
 * Restituisce solo il mese e l'anno (utile per i riassunti delle scalette).
 * Esempio: "Maggio 2026"
 */
export function formatMonthYear(dateString: string | Date): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  
  const formatted = new Intl.DateTimeFormat("it-IT", {
    month: "long",
    year: "numeric",
  }).format(date)

  // Mette la prima lettera maiuscola (es. "Maggio 2026")
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

/**
 * Trasforma i secondi in formato MM:SS (es. 225 secondi -> 03:45)
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "00:00"
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  // padStart aggiunge lo zero iniziale se il numero è a una sola cifra
  const formattedMinutes = String(minutes).padStart(2, "0")
  const formattedSeconds = String(remainingSeconds).padStart(2, "0")
  
  return `${formattedMinutes}:${formattedSeconds}`
}