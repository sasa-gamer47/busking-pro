import DetailsPanel from "@/components/DetailsPanel";
import HomeStatCard from "@/components/HomeStatCard";
import SetlistCard from "@/components/SetlistCard";
import Topbar from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import ChecklistItem from "@/components/CheckListItem";
import CheckListPanel from "@/components/CheckListPanel";

export default function Home() {

  


  return (
    <div className="fixed w-full left-1/5 h-full bg-zinc-900">
      <div className="flex h-full w-full relative justify-start items-center">
        <div className="w-3/5 h-full">
          <div className="flex flex-col w-full h-full relative">
            <Topbar />
            <div className=" bg-zinc-800 h-0.5 w-full"></div>

            <div className="relative w-full h-full flex flex-col text-gray-300">
              <div className="flex w-full h-auto gap-x-4 p-4 justify-around items-center">
                <HomeStatCard />
                <HomeStatCard />
                <HomeStatCard />
                <HomeStatCard />
              </div>         
            
              <div className="w-full h-full flex">
                <div className="w-1/2 h-full flex flex-col justify-center items-center p-4">
                  <div className="w-full flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Scalette recenti</h2>
                    <p className="text-orange-600 font-semibold text-lg transition duration-150 hover:text-orange-500 cursor-pointer">Vedi tutto</p>
                  </div>
                  <div className="w-full h-full flex flex-col gap-y-4 justify-start items-baseline mt-4">
                    <SetlistCard />
                    <SetlistCard />
                  </div>

                </div>
                <div className="w-1/2 h-full p-4">
                  <div className="w-full flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Live Checklist</h2>
                    <p className="text-orange-600 font-semibold text-lg transition duration-150 hover:text-orange-500 cursor-pointer">
                      <Plus size={35} strokeWidth={3} />
                    </p>
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
    </div>
  );
}
