"use client"

import { Settings } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Topbar = () => {
  const pathname = usePathname()

  // Determina dinamicamente il titolo in base alla route in cui si trova l'utente
  const getTitle = () => {
    if (pathname === "/settings") return "Impostazioni"
    if (pathname.startsWith("/songs")) return "Brani"
    if (pathname.startsWith("/setlists")) return "Scalette"
    return "Dashboard"
  }

  return (
    <div className='h-20 w-full flex justify-between items-center bg-zinc-950 shadow-lg px-8 select-none shrink-0'>
      {/* Titolo Dinamico */}
      <div className="text-xl text-gray-300 font-extrabold tracking-tight">
        {getTitle()}
      </div>
      
      {/* Centro vuoto per respiro layout */}
      <div className="flex-1 h-full"></div>
      
      {/* Azioni di destra */}
      <div className="flex items-center h-full">
        <Link 
          href="/settings" 
          className={`p-2.5 rounded-xl transition cursor-pointer ${
            pathname === "/settings" 
              ? "text-orange-500 bg-orange-500/10 border border-orange-500/20" 
              : "text-gray-400 hover:text-white hover:bg-zinc-900"
          }`}
        >
          <Settings className='h-5 w-5' />
        </Link>
      </div>
    </div>
  )
}

export default Topbar