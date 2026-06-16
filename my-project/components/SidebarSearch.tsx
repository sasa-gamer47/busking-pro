"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SidebarSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    // Sposta l'utente sulla pagina dei brani iniettando il parametro di ricerca nell'URL
    router.push(`/songs?search=${encodeURIComponent(trimmed)}`)
    setQuery("")
  }

  return (
    <div className="w-full px-4 py-4 shrink-0">
      <form onSubmit={handleSubmit} className="relative w-full">
        <Search className="absolute left-3.5 text-zinc-500 h-4 w-4 top-1/2 -translate-y-1/2 z-10" />
        <Input
          type="text"
          placeholder="Cerca brano o artista..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-zinc-900/60 pl-10 pr-4 py-5 border border-zinc-800 focus-visible:ring-1 focus-visible:ring-orange-500 rounded-xl placeholder-zinc-600 text-zinc-200 text-sm"
        />
      </form>
    </div>
  )
}