import React from 'react'

const SidebarSong = ({ title, artist } : { title: string, artist: string }) => {
  return (
     <div className="hover:bg-zinc-900 cursor-pointer transition duration-150 w-full py-2 flex items-center justify-between text-sm font-semibold text-gray-400 pl-2">
        <p className='truncate'>{title}</p>
        <p className='text-gray-500 truncate'>{artist}</p>
    </div>
  )
}

export default SidebarSong