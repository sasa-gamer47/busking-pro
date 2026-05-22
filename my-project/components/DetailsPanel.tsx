import QuickMemo from '@/components/QuickMemo'
import React from 'react'
import QuickNote from './QuickNote'
import { Plus } from 'lucide-react'
import ReminderListItem from './ReminderListItem'

const DetailsPanel = () => {
  return (
    <div className='relative p-2 bg-zinc-950 shadow-lg w-full h-full flex flex-col justify-start items-center'>
      <div className=" bg-zinc-800 absolute left-0 w-0.5 h-full"></div>
      <div className="w-full p-2 flex justify-center items-center flex-col gap-y-4">
        <div className="w-full flex flex-col justify-center items-center">
          <h2 className='text-zinc-300 text-left text-xl font-bold mb-4 w-full'>Quick Memo</h2>
          <QuickMemo />
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <h2 className='text-zinc-300 text-left text-xl font-bold mb-4 w-full'>Sketchpad</h2>
          <QuickNote />
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <div className='text-zinc-300 text-left text-xl font-bold mb-4 w-full flex justify-between items-center px-1'>
            <h2>Reminders</h2>
             <p className="text-orange-600 font-semibold text-lg transition duration-150 hover:text-orange-500 cursor-pointer">
              <Plus size={25} strokeWidth={3} />
            </p>
          </div>
          <ReminderListItem />
        </div>
      </div>
    </div>
  )
}

export default DetailsPanel