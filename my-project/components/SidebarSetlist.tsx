import { ListMusic } from 'lucide-react'
import React from 'react'

const SidebarSetlist = () => {
  return (
    <div className="flex py-2 w-full gap-x-2 px-4 cursor-pointer hover:bg-zinc-900 transition duration-150">
        <ListMusic className="text-gray-400 " />
        <p className="text-sm font-semibold  text-gray-400 pl-2">Scaletta 1</p>
    </div>
  )
}

export default SidebarSetlist