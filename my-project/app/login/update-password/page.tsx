"use client"

import { useState } from "react"
import { createClient } from "@/lib/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createClient()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    // Aggiorna l'utente correntemente autenticato tramite il token temporaneo dell'email
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Password aggiornata con successo! Ora puoi effettuare l'accesso.");
      setTimeout(() => {
        router.push("/login")
      }, 2500)
    }
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-white p-4">
      <div className="w-full max-w-md space-y-6 border border-zinc-900 bg-zinc-900/50 p-8 rounded-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-orange-500">Nuova Password</h1>
          <p className="text-sm text-zinc-400">Scegli la tua nuova password d&apos;accesso</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <Input
            type="password"
            placeholder="Minimo 6 caratteri"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-zinc-900 border-zinc-800 text-zinc-200"
          />

          <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            {loading ? "Aggiornamento..." : "Conferma Nuova Password"}
          </Button>
        </form>

        {message && <p className="text-sm text-green-400 text-center">{message}</p>}
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
      </div>
    </div>
  )
}