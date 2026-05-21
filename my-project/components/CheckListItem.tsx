// components/ChecklistItem.tsx
"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field" // adatta l'import in base a dove sono i tuoi componenti

// Definiamo cosa deve ricevere il componente dall'esterno
interface ChecklistItemProps {
  id: string;
  label: string;
}

export default function ChecklistItem({ id, label }: ChecklistItemProps) {
  return (
    /* Usiamo il Field direttamente come contenitore della riga, 
       aggiungendo le classi di allineamento che avevi prima */
    <Field 
      orientation="horizontal" 
      className="flex w-full justify-between items-center py-2"
    >
      <Checkbox 
        id={id} 
        name={id} 
        className="h-6 w-6 rounded-md border-zinc-800 bg-zinc-900/50 text-transparent hover:bg-orange-600 transition-all cursor-pointer data-[state=checked]:bg-orange-500 data-[state=checked]:border-none data-[state=checked]:text-zinc-950" 
      />
      
      <FieldLabel 
        htmlFor={id} 
        className="text-lg font-semibold text-zinc-300 cursor-pointer select-none flex-1 pl-4 text-left"
      >
        {label}
      </FieldLabel>
    </Field>
  );
}