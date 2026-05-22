import React from 'react'
import { Textarea } from './ui/textarea'

const QuickNote = () => {
  return (
    <div className='rounded-xl w-full min-h-44 h-full text-zinc-300 flex flex-col justify-center items-center'>
        <Textarea placeholder='Inserisci i tuoi appunti rapidi...' className='text-sm bg-zinc-900 w-full h-full border-2 border-zinc-800 resize-none outline-none focus-visible:border-orange-500 focus-visible:ring-0'   />
    </div>
  )
}

export default QuickNote