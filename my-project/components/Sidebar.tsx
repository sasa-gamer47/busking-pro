"use server";

import React from 'react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import UserIcon from '@/imgs/user-icon.png'
import SidebarSetlist from './SidebarSetlist'
import SidebarSong from './SidebarSong'

import { createClient } from "@/lib/utils/supabase/server" // Il client server per leggere i cookie
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getRecentSetlists, getRecentSongs } from '@/lib/utils/actions';
import { Setlist } from '@/lib/utils/supabase/types';


const Sidebar = async () => {

  const supabase = await createClient();


  const { data: { user } } = await supabase.auth.getUser();

  // Se l'utente è loggato, andiamo a prendere il suo profilo reale dal database
  let profile = null
  // console.log("USer: ", user)

  if (user) {
  // Modifica la query inserendo anche la variabile 'error'
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    // Questo ti dirà ESATTAMENTE perché il profilo è null nel terminale di VS Code
    console.error("❌ Errore durante il fetch del profilo:", error.message, error.details)
  } else {
    profile = data
    // console.log("✅ Profilo recuperato con successo:", profile)
  }
}

  const handleLogout = async () => {
    "use server" // Forza questa funzione a girare solo sul server quando clicchi il tasto
    console.log("logging gout")
    const supabase = await createClient()
    await supabase.auth.signOut() // Cancella la sessione e i cookie del browser
    redirect("/login") // Rimanda l'utente alla pagina di login
  }

   const recentSongs = await getRecentSongs(4)
   const recentSetlists = await getRecentSetlists(4)

  return (
    <div className="fixed bg-zinc-950 text-gray-400 w-1/5 h-full z-50 shadow-lg">
        <div className=" bg-zinc-800 absolute right-0 w-0.5 h-full"></div>

      <div className="w-full text-4xl font-bold flex justify-center items-center py-4 h-20  absolute top-0">
        <Link href="/" className='cursor-pointer'>
          BUSKING PRO
        </Link>
      </div>
      <div className="w-full flex justify-center items-start py-3  absolute top-20">
          <Input placeholder='Search your songs...' className='w-5/6 outline-none bg-zinc-900 px-6 py-6  border-none' />
      </div>
      <div className=" w-full flex justify-centre items-center flex-col absolute top-40 bottom-20">
        <div className="flex flex-col w-full max-h-fit px-4 h-1/2">
          <p className='text-gray-500 font-semibold text-lg'>Le mie scalette</p>
          <div className="w-full flex flex-col justify-center items-center overflow-y-auto overflow-x-hidden">
            {recentSetlists.map((setlist: Setlist, index: number) => (
              <SidebarSetlist key={index}  id={setlist.id} title={setlist.title} />
            ))}                   
          </div>
        </div>
        <div className="flex w-full max-h-fit flex-col justify-center  px-4 h-1/2">
          <p className='text-gray-500 font-semibold text-lg'>Le mie canzoni</p>
          <div className="flex flex-col items-center justify-center w-full  overflow-y-auto">
            {recentSongs.map((song, index) => (
              <SidebarSong key={index} id={song.id} title={song.title} artist={song.artist} />
            ))} 
          </div>
        </div>
      </div>
    <div className="absolute bottom-20 bg-zinc-800 h-0.5 w-full"></div>
      {/* 1. Il contenitore principale in fondo ha ora un'altezza definita (h-20) */}
      <div className="absolute bottom-0 w-full h-20 px-4 flex justify-start items-center border-t border-zinc-800">
        
        {/* 2. Questo div contiene l'avatar e i testi affiancati */}
        <div className="w-full h-full flex items-center">
          
          {/* 3. Il contenitore dell'immagine: relative + h-2/3 (proporzionato al padre) + aspect-square */}
          {user && profile ? (
            <>
              <div className="relative h-2/3 aspect-square">
                <Image 
                  src={UserIcon} 
                  alt="user icon" 
                  fill 
                  className="rounded-full object-cover" 
                />
              </div>
              <div className="pl-4 flex flex-col min-w-2/4 justify-center items-start">
                <p className="text-sm font-medium text-white leading-none mb-1">{profile.full_name}</p>
                <p className="text-xs text-zinc-400 leading-none">@{profile.username}</p>
              </div>
              <div className="h-full flex items-center justify-center pl-4">
                <Button onClick={handleLogout} className='bg-transparent p-2 cursor-pointer transition duration-300 hover:bg-zinc-900'>
                  <LogOut size={50} strokeWidth={3} /> 
                </Button>
              </div>
            </>
          )
          :
          (
            <>
              <Link href="/login">
                <Button className='p-4 ml-20 transition duration-300 hover:bg-orange-500 cursor-pointer bg-orange-600 text-xl font-bold w-2/3 h-2/3'>Login</Button>
              </Link>
            </>
          )
        }

        </div>
      </div>
    </div>
  )
}

export default Sidebar


