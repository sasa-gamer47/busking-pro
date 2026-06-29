import DetailsPanel from "@/components/DetailsPanel";
import HomeStatCard from "@/components/HomeStatCard";
import SetlistCard from "@/components/SetlistCard";
import Topbar from "@/components/Topbar";
import CheckListPanel from "@/components/CheckListPanel";
import { getDashboardStats, getRecentSetlists } from "@/lib/utils/actions"
import { Setlist } from "@/lib/utils/supabase/types";
import AddChecklistForm from "@/components/AddChecklistForm";

export default async function Home() {
  const stats = await getDashboardStats()
  const recentSetlists = await getRecentSetlists(2)

  return (
    // Responsive root: 100% di larghezza su mobile, si sposta a sinistra (lg:left-[20%]) e si restringe solo su schermi grandi
    <div className="fixed inset-y-0 left-0 lg:left-[20%] w-full lg:w-[80%] h-full bg-zinc-900 text-gray-300">
      <div className="flex h-full w-full relative justify-start items-stretch">
        
        {/* SEZIONE CENTRALE: Prende tutto lo spazio su mobile, lascia 1/4 al DetailsPanel su desktop */}
        <div className="w-full lg:w-3/4 h-full flex flex-col relative border-zinc-800 lg:border-r">
          <Topbar />
          <div className="bg-zinc-800 h-0.5 w-full shrink-0"></div>

          {/* Area interna scrollabile per le card e le liste */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* STATS CARD: 1 colonna su mobile, 2 colonne da tablet in su */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <HomeStatCard title={"Canzoni totali"} value={stats.songsCount.toString()} />
              <HomeStatCard title={"Scalette totali"} value={stats.setlistsCount.toString()} />
            </div>         
          
            {/* CONTENUTI OPERATIVI: Incolonnati su mobile, affiancati da tablet (md:) in su */}
            <div className="w-full flex flex-col md:flex-row gap-6 items-start">
              
              {/* Scalette Recenti */}
              <div className="w-full md:w-1/2 flex flex-col space-y-4">
                <div className="w-full flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold">Scalette recenti</h2>
                  <p className="text-orange-600 font-semibold text-sm transition duration-150 hover:text-orange-500 cursor-pointer">Vedi tutto</p>
                </div>
                <div className="w-full flex flex-col gap-y-4">
                  {recentSetlists.map((setlist: Setlist, index: number) => (
                    <SetlistCard key={index} setlist={setlist} />
                  ))}
                </div>
              </div>

              {/* Live Checklist */}
              <div className="w-full md:w-1/2 flex flex-col space-y-4">
                <div className="w-full flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold">Live Checklist</h2>
                  <AddChecklistForm />
                </div>
                <div className="w-full flex flex-col gap-y-4">
                  <CheckListPanel />
                </div>
              </div>

            </div>
          
          </div>
        </div>

        {/* PANNELLO DETTAGLI DESTRO: Completamente nascosto su mobile, riappare su desktop */}
        <div className="hidden lg:block lg:w-1/4 h-full bg-zinc-950/20">
          <DetailsPanel />
        </div>

      </div>
    </div>
  );
}