import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Spia di controllo nel terminale per vedere se Next.js sta leggendo il file
  console.log("👮 BUTTAFUORI: Sto controllando il percorso:", request.nextUrl.pathname)
  
  return await updateSession(request)
}

export const config = {
  /*
   * Il matcher ora deve ascoltare esplicitamente la Home e la pagina di login.
   * Usiamo questo array preciso per evitare che intercetti file di sistema o API interne.
   */
  matcher: [
    '/',
    '/login'
  ],
}