import React from 'react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import UserIcon from '@/imgs/user-icon.png'
import SidebarSetlist from './SidebarSetlist'
import SidebarSong from './SidebarSong'

const Sidebar = () => {
  return (
    <div className="fixed bg-zinc-950 text-gray-400 w-1/5 h-full z-50 shadow-lg">
        <div className=" bg-zinc-800 absolute right-0 w-0.5 h-full"></div>

      <div className="w-full text-4xl font-bold flex justify-center items-center py-4 h-20  absolute top-0">
        BUSKING PRO
      </div>
      <div className="w-full flex justify-center items-start py-3  absolute top-20">
          <Input placeholder='Search your soongs...' className='w-5/6 outline-none bg-zinc-900 px-6 py-6  border-none' />
      </div>
      <div className=" w-full flex justify-centre items-center flex-col  absolute top-40 bottom-20">
        <div className="flex flex-col w-full  px-4 h-1/2">
          <p className='text-gray-500 font-semibold text-lg'>Le mie scalette</p>
          <div className="w-full flex flex-col justify-center items-center overflow-y-auto overflow-x-hidden">
            <SidebarSetlist /> 
            <SidebarSetlist /> 
            <SidebarSetlist /> 
            <SidebarSetlist /> 
                      
          </div>
        </div>
        <div className="flex w-full  flex-col justify-center  px-4 h-1/2">
          <p className='text-gray-500 font-semibold text-lg'>Le mie canzoni</p>
          <div className="flex flex-col items-center justify-center w-full  overflow-y-auto">
            <SidebarSong />
            <SidebarSong />
            <SidebarSong />
            <SidebarSong />
          </div>
        </div>
      </div>
    <div className="absolute bottom-20 bg-zinc-800 h-0.5 w-full"></div>
      {/* 1. Il contenitore principale in fondo ha ora un'altezza definita (h-20) */}
      <div className="absolute bottom-0 w-full h-20 px-4 flex justify-start items-center border-t border-zinc-800">
        
        {/* 2. Questo div contiene l'avatar e i testi affiancati */}
        <div className="w-full h-full flex items-center">
          
          {/* 3. Il contenitore dell'immagine: relative + h-2/3 (proporzionato al padre) + aspect-square */}
          <div className="relative h-2/3 aspect-square">
            <Image 
              src={UserIcon} 
              alt="user icon" 
              fill 
              className="rounded-full object-cover" 
            />
          </div>
          
          {/* 4. I testi si allineano a sinistra (start) e non centrati, per una UI più pulita */}
          <div className="pl-4 flex flex-col justify-center items-start">
            <p className="text-lg font-medium text-white leading-none mb-1">Nome</p>
            <p className="text-sm text-zinc-400 leading-none">@nomeutente</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Sidebar


