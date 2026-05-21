import React from 'react'
import { Card } from '@/components/ui/card'

const HomeStatCard = () => {
  return (
    <Card className="bg-zinc-950 shadow-lg border-2 border-zinc-800 min-w-40 flex flex-col justify-center items-center text-gray-300">
        <h2 className="text-xl font-bold">Canzoni totali</h2>
        <p className="text-4xl font-extrabold">42</p>
    </Card>
  )
}

export default HomeStatCard