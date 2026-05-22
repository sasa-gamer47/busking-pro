import React from 'react'
import { Card } from '@/components/ui/card'

const HomeStatCard = ({ title, value } : { title: string, value: string }) => {
  return (
    <Card className="bg-zinc-950 shadow-lg border-2 border-zinc-800 min-w-40 flex flex-col justify-center items-center text-gray-300">
        <h2 className="text-xl font-bold px-4">{title}:</h2>
        <p className="text-4xl font-extrabold">{value}</p>
    </Card>
  )
}

export default HomeStatCard