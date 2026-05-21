import { Card } from '@/components/ui/card'
import { Mic } from 'lucide-react'
import React from 'react'

const QuickMemo = () => {
  return (
    <Card className='bg-zinc-900 border-2 border-zinc-800 w-full min-h-44 h-full p-2 text-zinc-300 flex flex-col justify-center items-center'>
        <div className="w-full h-4/5 flex items-center justify-center bg-red-400">
            <div className="w-1/2 h-full bg-green-400 flex justify-center items-center">
                <div className="w-2/3 h-2/3 bg-orange-600 rounded-full aspect-square outline-2 outline-orange-600 outline-offset-2 flex items-center justify-center cursor-pointer transition duration-300 hover:size-5/6">
                    <Mic size={50} />
                </div>
            </div>
            <div className="w-1/2 h-full bg-green-800 flex justify-center items-center">
                <p className='text-orange-500 font-semibold text-3xl'>00:00</p>
            </div>
        </div>
        <div className="w-full h-1/5 flex items-center justify-center bg-red-800">
        </div>
    </Card>
  )
}

export default QuickMemo