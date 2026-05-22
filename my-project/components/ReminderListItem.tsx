import { ClipboardClock } from 'lucide-react'
import React from 'react'

const ReminderListItem = () => {
  return (
    <div className='text-zinc-300 text-sm w-full p-2 flex justify-start items-center'>
      <ClipboardClock size={25} strokeWidth={2.5} className='text-orange-500 w-14' />
      <p className='ml-2'>Creare il nuovo tono per la chitarra elettrica visto su youtube</p>
    </div>
  )
}

export default ReminderListItem