import DetailsPanel from "@/components/DetailsPanel";
import HomeStatCard from "@/components/HomeStatCard";
import SetlistCard from "@/components/SetlistCard";
import Topbar from "@/components/Topbar";
import { Plus } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox"
// import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
// import ChecklistItem from "@/components/CheckListItem";
import CheckListPanel from "@/components/CheckListPanel";
import { getDashboardStats, getRecentSetlists, getRecentSongs } from "@/lib/utils/actions"
import { Setlist } from "@/lib/utils/supabase/types";
import AddChecklistForm from "@/components/AddChecklistForm";

export default async function Home() {

  const stats = await getDashboardStats()
  // const recentSongs = await getRecentSongs(3)
  const recentSetlists = await getRecentSetlists(2)

  console.log(recentSetlists)


  return (
    <div className="fixed w-full left-1/5 h-full bg-zinc-900">
      <div className="flex h-full w-full relative justify-start items-center">
        <div className="w-3/5 h-full">
          <div className="flex flex-col w-full h-full relative">
            <Topbar />
            <div className=" bg-zinc-800 h-0.5 w-full"></div>

            <div className="relative w-full h-full flex flex-col text-gray-300">
              <div className="flex w-full h-auto gap-x-4 p-4 justify-start items-center">
                <HomeStatCard title={"Canzoni totali"} value={stats.songsCount.toString()} />
                <HomeStatCard title={"Scalette totali"} value={stats.setlistsCount.toString()} />
              </div>         
            
              <div className="w-full h-full flex">
                <div className="w-1/2 h-full flex flex-col justify-center items-center p-4">
                  <div className="w-full flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Scalette recenti</h2>
                    <p className="text-orange-600 font-semibold text-lg transition duration-150 hover:text-orange-500 cursor-pointer">Vedi tutto</p>
                  </div>
                  <div className="w-full h-full flex flex-col gap-y-4 justify-start items-baseline mt-4">
                    {recentSetlists.map((setlist: Setlist, index: number) => (
                      <SetlistCard key={index} setlist={setlist} />
                    ))}
                  </div>

                </div>
                <div className="w-1/2 h-full p-4">
                  <div className="w-full flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Live Checklist</h2>
                    <AddChecklistForm />
                    {/* <p className="text-orange-600 font-semibold text-lg transition duration-150 hover:text-orange-500 cursor-pointer">
                      <Plus size={35} strokeWidth={3} />
                    </p> */}
                  </div>
                  <div className="w-full h-full flex flex-col gap-y-4 justify-start items-baseline mt-4">
                    <CheckListPanel />
                  </div>
                </div>
              </div>
            
            </div>
          </div>
        
        </div>
        <div className="w-1/5 h-full">
          <DetailsPanel />
        </div>


      </div>
      {/* fixed voerlay modals */}


    </div>
  );
}
