import { type NextRequest } from 'next/server'
// Importazione con percorso relativo esatto e isolato, senza usare la chiocciola @
import { updateSession } from './lib/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Spia di controllo nel terminale locale
  console.log("👮 BUTTAFUORI: Sto controllando il percorso:", request.nextUrl.pathname)
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Intercetta tutte le rotte per aggiornare la sessione di Supabase,
     * escludendo i file statici, immagini e icone per ottimizzare le performance.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}