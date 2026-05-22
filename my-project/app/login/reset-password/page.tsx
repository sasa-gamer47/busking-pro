"use client"

import { useState } from "react"
import { createClient } from "@/lib/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    // Invia l'email tramite Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Diciamo a Supabase di rispedire l'utente alla rotta speciale /update-password dopo il clic
      redirectTo: `${window.location.origin}/login/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Controlla la tua casella di posta! Ti abbiamo inviato il link.")
    }
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-white p-4">
      <div className="w-full max-w-md space-y-6 border border-zinc-900 bg-zinc-900/50 p-8 rounded-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-orange-500">Recupera Password</h1>
          <p className="text-sm text-zinc-400">Inserisci l&apos;email per ricevere il link di ripristino</p>
        </div>

        <form onSubmit={handleResetRequest} className="space-y-4">
          <Input
            type="email"
            placeholder="nome@esempio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-zinc-900 border-zinc-800 text-zinc-200"
          />

          <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            {loading ? "Invio in corso..." : "Invia link"}
          </Button>
        </form>

        {message && <p className="text-sm text-green-400 text-center">{message}</p>}
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <div className="text-center pt-2">
          <Link href="/login" className="text-xs text-zinc-500 hover:text-zinc-300 underline">
            Torna al login
          </Link>
        </div>
      </div>
    </div>
  )
}