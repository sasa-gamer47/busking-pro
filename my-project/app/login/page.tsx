"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/utils/supabase/client" // Controlla se usi @/lib/supabase/client

// Import dei componenti ufficiali di Shadcn
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  // Stati del Form
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Stato per switchare tra Login e Registrazione
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    if (isSignUp) {
      // --- REGISTRAZIONE ---
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        setErrorMsg(error.message)
      } else {
        alert("Registrazione completata! Ora puoi effettuare l'accesso.")
        setIsSignUp(false)
      }
    } else {
      // --- LOGIN ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        // Successo: Spingiamo l'utente dentro la Dashboard reale
        router.push("/")
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      
      {/* Card di Shadcn strutturata con il tuo stile Dark */}
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900/40 backdrop-blur-md text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isSignUp ? "Crea un account" : "Bentornato"}
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            {isSignUp ? "Inserisci i tuoi dati per registrarti" : "Accedi a Busking Pro"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            
            {/* Box Errore */}
            {errorMsg && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tuo@esempio.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none bg-zinc-900 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-orange-500/70 focus-visible:ring-offset-0"
              />
            </div>

            {/* Campo Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none bg-zinc-900 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-orange-500/70 focus-visible:ring-offset-0"
              />
              {!isSignUp && (
                <Link href={"/login/reset-password"}>
                    <p className="mt-2 text-orange-500 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer">Password dimenticata?</p>
                </Link>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex bg-zinc-900 mt-5 flex-col gap-4">
            {/* Bottone principale di Shadcn con il tuo arancione iconico */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Elaborazione..." : isSignUp ? "Registrati" : "Accedi"}
            </Button>

            {/* Switcher in basso */}
            <div className="text-center text-xs text-zinc-500">
              {isSignUp ? "Hai già un account?" : "Non hai un account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setErrorMsg("")
                }}
                className="text-orange-500 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
              >
                {isSignUp ? "Accedi" : "Registrati qui"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>

    </div>
  )
}