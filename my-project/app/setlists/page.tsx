// app/setlists/page.tsx

import Topbar from "@/components/Topbar"
import AllSetlistsClient from "@/components/AllSetlistsClient"
import { getAllUserSetlists } from "@/lib/utils/actions"

export default async function SetlistsPage() {
  // Esecuzione e recupero sicuro dei dati lato server
  const setlists = await getAllUserSetlists()

  return (
    <main className="absolute min-h-screen w-full lg:w-4/5 left-0 lg:left-1/5 bg-zinc-900 text-zinc-300">
      {/* Topbar comune */}
      <Topbar />
      <div className="bg-zinc-800 h-0.5 w-full"></div>
      
      {/* Passaggio dati al client component */}
      <AllSetlistsClient initialSetlists={setlists} />
    </main>
  )
}