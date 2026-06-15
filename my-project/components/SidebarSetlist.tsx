import { ListMusic } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const SidebarSetlist = ({ id, title } : { id: string, title: string}) => {
  return (
    <Link href={`/setlists/${id}`} className="flex py-2 w-full gap-x-2 px-4 cursor-pointer hover:bg-zinc-900 transition duration-150">
        <ListMusic className="text-gray-400 " />
        <p className="text-sm font-semibold truncate text-gray-400 pl-2">{title}</p>
    </Link>
  )
}

export default SidebarSetlist