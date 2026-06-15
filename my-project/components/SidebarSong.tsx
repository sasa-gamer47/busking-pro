import Link from 'next/link'
import React from 'react'

const SidebarSong = ({ id, title, artist } : { id: string, title: string, artist: string }) => {
  return (
     <Link href={`/songs/${id}`} className="hover:bg-zinc-900 cursor-pointer transition duration-150 w-full py-2 flex items-center justify-between text-sm font-semibold text-gray-400 px-2">
        <p className='truncate'>{title}</p>
        <p className='text-gray-500 truncate'>{artist}</p>
    </Link>
  )
}

export default SidebarSong