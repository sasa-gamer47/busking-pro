// components/ChecklistItem.tsx
"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field" // adatta l'import in base a dove sono i tuoi componenti
import { toggleTodoStatus } from "@/lib/utils/actions";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

// Definiamo cosa deve ricevere il componente dall'esterno
interface ChecklistItemProps {
  id: string;
  label: string;
  value: boolean;
}

export default function ChecklistItem({ id, label, value }: ChecklistItemProps) {
  const [isPending, startTransition] = useTransition()

  // 1. Inizializziamo useForm passando l'oggetto di configurazione con i valori di default
  const form = useForm({
    defaultValues: {
      is_done: value,
    },
  })

  // Per rendere il componente reattivo ai cambi senza ricaricare la pagina, 
  // leggiamo il valore aggiornato dello stato tramite watch()
  const isChecked = form.watch("is_done")

  return (
    <Field 
      orientation="horizontal" 
      className="flex w-full justify-between items-center py-2"
    >
      <Checkbox 
        id={id} 
        name="is_done"
        disabled={isPending}
        // 2. Colleghiamo il valore booleano dello stato del form alla Checkbox
        checked={isChecked}
        // 3. Intercettiamo il cambio di valore (true/false)
        onCheckedChange={(checked: boolean) => {
          // Aggiorna istantaneamente lo stato locale nel form
          form.setValue("is_done", checked)

          // Avvia la Server Action in background per aggiornare Supabase
          startTransition(async () => {
            const result = await toggleTodoStatus(id, checked)
            if (!result.success) {
              // Se il database fallisce, facciamo il rollback al valore precedente
              form.setValue("is_done", !checked)
              alert("Impossibile salvare lo stato del promemoria.")
            }
          })
        }}
        className="h-6 w-6 rounded-md border-zinc-800 bg-zinc-900/50 text-transparent hover:bg-orange-600 transition-all cursor-pointer data-[state=checked]:bg-orange-500 data-[state=checked]:border-none data-[state=checked]:text-zinc-950" 
      />
      
      <FieldLabel 
        htmlFor={id} 
        // Aggiungiamo un effetto grafico: se è completato, sbiadisce e si barra il testo
        className={`text-lg font-semibold cursor-pointer select-none flex-1 pl-4 text-left transition-all ${
          isChecked ? "line-through text-zinc-500" : "text-zinc-300"
        }`}
      >
        {label}
      </FieldLabel>
    </Field>
  )
}