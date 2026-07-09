import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Spia di controllo nel terminale per vedere se Next.js sta leggendo il file
  console.log("👮 BUTTAFUORI: Sto controllando il percorso:", request.nextUrl.pathname)
  
  return await updateSession(request)
}

export const config = {
  /*
   * Il matcher ora intercetta TUTTI i percorsi dell'applicazione,
   * garantendo che la sessione Supabase sia sempre aggiornata,
   * ma esclude intelligentemente i file statici e di sistema per non sprecare risorse.
   */
  matcher: [
    /*
     * Esclude i percorsi che iniziano con:
     * - _next/static (file CSS e JS compilati)
     * - _next/image (immagini ottimizzate da Next)
     * - favicon.ico (l'icona del sito)
     * Esclude anche tutti i file con estensioni statiche (immagini, vettori, ecc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}