import Navbar from "@/components/Navbar";
import VideoList from "./VideoList";
import  Protected  from '@/components/Protected'
import { CreateVideo } from "./CreateVideo";

export default function Home() {
    return <>
   <Protected>
    <Navbar/>
    <div className="w-full h-[10vh] flex items-center justify-end px-6">
     {/* <button className="font-sans text-md hover:scale-105 p-2 bg-primary text-foreground hover:opacity-90 focus:outline-none rounded-[var(--radius)] focus:ring-2 focus:ring-primary cursor-pointer">
           + New Note
          </button> */}
    <CreateVideo/>
    </div>
    <VideoList/>        
   </Protected>
    
    </>
}