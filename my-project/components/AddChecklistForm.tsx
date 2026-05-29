"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation" // Per aggiornare la pagina dopo il salvataggio
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { addTodo } from "@/lib/utils/actions"
import { Plus } from "lucide-react"

export default function CreateTodoTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState("") // Hook per catturare il testo dell'input
  const [isPending, startTransition] = useTransition() // Hook per gestire il caricamento asincrono
  const router = useRouter()

  // Funzione di Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Evita il ricaricamento nativo della pagina

    if (!text.trim()) return // Blocca l'invio se l'input è vuoto

    startTransition(async () => {
      const result = await addTodo(text)
      
      if (result.success) {
        setText("") // Svuota l'input
        setIsOpen(false) // Chiude il modale
        router.refresh() // Dice a Next.js di rinfrescare i Server Component (aggiorna la lista dei todo)
      } else {
        alert("Si è verificato un errore durante la creazione del promemoria.")
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <p className='text-orange-600 font-semibold text-lg transition duration-150 hover:text-orange-500 cursor-pointer'>
            <Plus size={35} strokeWidth={3} />
        </p>
      </DialogTrigger>
      
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-100">
            Nuovo Promemoria
          </DialogTitle>
        </DialogHeader>
        
        {/* Avvolgiamo tutto in un tag form nativo per gestire il tasto Invio sulla tastiera */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="py-2">
            <Field>
              <Input 
                id="checklist-text" 
                type="text" 
                placeholder="Es. Controllare i cavi jack..." 
                value={text}
                onChange={(e) => setText(e.target.value)} // Aggiorna lo stato a ogni lettera digitata
                disabled={isPending}
                className="w-full bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-1 focus-visible:ring-orange-500 rounded-lg placeholder:text-zinc-500"
              />
            </Field>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 cursor-pointer hover:text-zinc-200 hover:bg-zinc-900"
            >
              Annulla
            </Button>
            
            <Button 
              type="submit" 
              disabled={isPending || !text.trim()}
              className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-zinc-300 font-bold px-5 rounded-lg disabled:opacity-50"
            >
              {isPending ? "Creazione..." : "Crea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}