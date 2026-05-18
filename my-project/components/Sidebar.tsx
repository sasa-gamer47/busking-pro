import React from 'react'

const Sidebar = () => {
  return (
    <div className="fixed bg-gray-950 text-gray-400 w-3/12 h-full z-50">
      <div className="w-full text-4xl font-bold flex justify-center items-center py-4 h-20  absolute top-0">
        BUSKING PRO
      </div>
      <div className="w-full flex justify-center items-center py-5  absolute top-20">
        <p>Placeholder input search bar</p>
      </div>
      <div className=" w-full flex justify-centre items-center flex-col  absolute top-40 bottom-20">
        <div className="flex flex-col w-full  px-4 h-1/2">
          <p className='text-gray-500'>Le mie scalette</p>
          <div className="w-full flex flex-col justify-center items-center ">
            <div className="flex ml-2 py-2 w-full gap-x-2">
              <p>ic</p>
              <p>Scaletta 1</p>
            </div>
            <div className="flex ml-2 py-2 w-full gap-x-2">
              <p>ic</p>
              <p>Scaletta 1</p>
            </div>
            <div className="flex ml-2 py-2 w-full gap-x-2">
              <p>ic</p>
              <p>Scaletta 1</p>
            </div>
            <div className="flex ml-2 py-2 w-full gap-x-2">
              <p>ic</p>
              <p>Scaletta 1</p>
            </div>
          </div>
        </div>
        <div className="flex w-full  flex-col justify-center  px-4 h-1/2">
          <p className='text-gray-500'>Le mie canzoni</p>
          <div className="flex flex-col items-center justify-center w-full  overflow-y-auto">
            <div className="w-full py-2 flex items-center justify-between">
              <p>Creep</p>
              <p>RADIOHEAD</p>
            </div>
            <div className="w-full py-2 flex items-center justify-between">
              <p>Creep</p>
              <p>RADIOHEAD</p>
            </div>
            <div className="w-full py-2 flex items-center justify-between">
              <p>Creep</p>
              <p>RADIOHEAD</p>
            </div>
            <div className="w-full py-2 flex items-center justify-between">
              <p>Creep</p>
              <p>RADIOHEAD</p>
            </div>
            <div className="w-full py-2 flex items-center justify-between">
              <p>Creep</p>
              <p>RADIOHEAD</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full py-5 flex justify-center items-center ">
        <div className="my-1/3 mx-1/3 gap-x-4  w-auto px-4 h-full flex justify-center items-center">
          <div className="w-1/5 h-full flex justify-centre items-center">
          pp
          </div>
          <div className="w-full h-full flex flex-col justify-center items-center">
            <p>nome</p>
            <p>nome utente</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar