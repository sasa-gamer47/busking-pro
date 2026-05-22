import React from 'react'
import { Card } from './ui/card'
import { Button } from "@/components/ui/button"
import { Play } from 'lucide-react'

const SetlistCard = () => {
  return (
    
    <Card className='w-full p-4 text-zinc-300 flex flex-col justify-content items-content bg-zinc-950 border-2 border-zinc-800'>
        <div className="w-full h-1/2 flex justify-center items-center text-2xl text-zinc-300 font-extrabold">
            Subway station session
        </div>
        <div className="w-full h-1/2 flex justify-between items-center">
            <div className="w-1/2 h-full flex items-center justify-center text-sm text-zinc-400 p-2">
                12 canzoni | aggiornato 2 ore fa
            </div>
            <div className="w-1/2 h-full flex items-center justify-center p-2">
            <Button className='text-lg font-semibold w-full p-6 bg-orange-600 transition duration-200 hover:-translate-y-1 hover:bg-orange-700 cursor-pointer'>
                <Play />
                Avvia
            </Button>

            </div>
        </div>
    </Card>
  )
}

export default SetlistCard