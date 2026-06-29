"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import Topbar from "@/components/Topbar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createSetlist } from "@/lib/utils/actions"

export default function CreateSetlistPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Il titolo della scaletta è obbligatorio!")
      return
    }

    startTransition(async () => {
      try {
        const newSetlist = await createSetlist({ title, description })
        router.push(`/setlists/${newSetlist.id}`)
        router.refresh()
      } catch (err) {
        alert("Errore durante il salvataggio: " + (err instanceof Error ? err.message : "Errore sconosciuto"))
      }
    })
  }

  return (
    // FIX SCROLL: Sostituito min-h-screen con h-full + overflow-y-auto per sbloccare lo scorrimento all'interno del layout
    <div className="absolute inset-y-0 left-0 lg:left-1/5 w-full lg:w-4/5 bg-zinc-900 text-zinc-300 h-full overflow-y-auto">
      {/* Topbar comune */}
      <Topbar />
      <div className="bg-zinc-800 h-0.5 w-full"></div>

      {/* FIX LARGHEZZA: Sostituito p-10 fisso con px-4 py-6 per i telefoni, ripristinando sm:p-10 su schermi grandi */}
      <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:p-10 flex flex-col gap-y-6">
        
        {/* Pulsante Torna Indietro */}
        <div className="flex items-center w-full">
          <Link href="/setlists" className="text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-x-2 transition">
            <ArrowLeft size={16} />
            Torna alle scalette
          </Link>
        </div>

        {/* Intestazione */}
        <div className="text-left w-full">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">Crea Nuova Scaletta</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Inserisci un titolo e una descrizione. Potrai aggiungere e ordinare i brani subito dopo averla creata.
          </p>
        </div>

        <div className="bg-zinc-800 h-0.5 w-full"></div>

        {/* Form di Inserimento - Ottimizzato il padding interno per mobile (p-5) */}
        <form onSubmit={handleSubmit} className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-5 sm:p-8 flex flex-col gap-y-6 shadow-xl mt-2">
          
          {/* Campo Titolo */}
          <div className="flex flex-col gap-y-2 text-left">
            <label htmlFor="title" className="text-zinc-300 font-semibold text-sm tracking-wide">
              Titolo della Scaletta <span className="text-orange-500">*</span>
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Es. Live Festival di Primavera, Prove Scaletta Acustica..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className="w-full bg-zinc-900 border-zinc-800 focus-visible:ring-orange-500 text-white rounded-xl py-6 placeholder-zinc-600 text-base"
              maxLength={100}
            />
          </div>

          {/* Campo Descrizione */}
          <div className="flex flex-col gap-y-2 text-left">
            <label htmlFor="description" className="text-zinc-300 font-semibold text-sm tracking-wide">
              Descrizione o Note <span className="text-zinc-500 font-normal">(Opzionale)</span>
            </label>
            <Textarea
              id="description"
              placeholder="Aggiungi dettagli sul locale, la data dell'evento o la formazione della band..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className="w-full bg-zinc-900 border-zinc-800 focus-visible:ring-orange-500 text-white rounded-xl min-h-[120px] p-4 placeholder-zinc-600 text-base resize-none"
              maxLength={500}
            />
          </div>

          <div className="bg-zinc-900 h-px w-full my-2"></div>

          {/* Pulsanti di Azione */}
          <div className="flex items-center justify-end gap-x-2 lg:gap-x-4 w-full">
            <Link href="/setlists">
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                className="text-zinc-400 hover:text-white hover:bg-zinc-900 px-5 py-5 rounded-xl text-base"
              >
                Annulla
              </Button>
            </Link>
            
            <Button
              type="submit"
              disabled={isPending}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 lg:px-6 py-2 lg:py-5  rounded-xl transition duration-200 hover:-translate-y-0.5 cursor-pointer text-base shadow-lg shadow-orange-600/10"
            >
              <Save className="mr-2 h-5 w-5" />
              {isPending ? "Salvataggio..." : "Crea Scaletta"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}