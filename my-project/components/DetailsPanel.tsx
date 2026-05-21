import QuickMemo from '@/app/QuickMemo'
import React from 'react'

const DetailsPanel = () => {
  return (
    <div className='relative p-2 bg-zinc-950 shadow-lg w-full h-full flex flex-col justify-start items-center'>
      <div className=" bg-zinc-800 absolute left-0 w-0.5 h-full"></div>
      <div className="w-full p-2 flex justify-center items-center flex-col">
        <QuickMemo />
      </div>
    </div>
  )
}

export default DetailsPanel