import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Configurazione del client con le tue chiavi
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Controlliamo l'utente in modo sicuro
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // SE L'UTENTE NON È LOGGATO
  // Se non c'è una sessione e l'utente sta provando ad accedere alla Home (/) 
  if (!user && url.pathname === '/') {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // SE L'UTENTE È GIÀ LOGGATO
  // Se l'utente ha già una sessione attiva ma prova a tornare su /login, lo rimandiamo alla Home (/)
  if (user && url.pathname === '/login') {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}