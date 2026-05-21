import { Settings } from 'lucide-react'
import React from 'react'

const Topbar = () => {
  return (
    <div className='h-20 w-full flex justify-between items-center bg-zinc-950 shadow-lg'>
        <div className="w-1/6 h-full flex items-center justify-center text-xl text-gray-300 font-extrabold">
          Dashboard
        </div>
        <div className="w-4/6 h-full"></div>
        <div className="w-1/6 h-full">
          <div className="h-full p-2 flex justify-center items-center text-gray-300">
            
            <Settings className='cursor-pointer' />
          </div>
        </div>
    </div>
  )
}

export default Topbar