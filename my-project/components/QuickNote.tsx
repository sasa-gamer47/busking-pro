import React from 'react'
import { Textarea } from './ui/textarea'
import { Save } from 'lucide-react'

const QuickNote = () => {
  return (
    <div className='rounded-xl w-full min-h-44 h-full text-zinc-300 flex flex-col justify-center items-center'>
        <Textarea placeholder='Inserisci i tuoi appunti rapidi...' className='text-sm bg-zinc-900 w-full h-full border-2 border-zinc-800 resize-none outline-none focus-visible:border-orange-500 focus-visible:ring-0'   />
        <div className="w-full flex items-center justify-center text-sm mt-2 cursor-pointer">
            <Save className='text-orange-500' size={20} strokeWidth={2} />
            <p className='font-semibold ml-4'>Salva</p>
        </div>
    </div>
  )
}

export default QuickNote