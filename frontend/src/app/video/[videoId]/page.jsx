'use client'

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/authProvider"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Sidebar from "./Sidebar"
import Main from "./Main"
import Protected from "@/components/Protected"

export default function videoId() {
   
    const router = useRouter()
    const { videoId } = useParams()
    
    const [videoData,setVideoData] = useState({})
    const [failedFetch, setFailedFetch] = useState(false)
    const { getIdToken } = useAuth()
    
    async function getVideoData() {
        const endpoint = 'http://127.0.0.1:3001/get_video'
        const token = await getIdToken()
        if(!token) {
           console.log('No token found')
           setFailedFetch(true)
              setTimeout(()=>{
              router.replace('/home')
              },2000)     
        }
        try {
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    videoId: videoId 
                })
            })

            if(!response.ok) {
              setFailedFetch(true)
              setTimeout(()=>{
              router.replace('/home')
              },2000)
            }
            
            const videoDoc= await response.json()
            
            setVideoData(videoDoc)
            
            
          } catch (error) {
            console.log(error)
            setFailedFetch(true)
            setTimeout(()=>{
              router.replace('/home')
            },2000)
            
        }

       
    }


    useEffect(()=>{
        getVideoData()
    },[])

    return <>
    <Protected>
      <Navbar />
        {failedFetch ?
        <div className="text-4xl h-[90vh] w-full flex justify-center items-center text-muted-foreground">
          <div className="text-muted-foreground text-4xl">
          Error fetching data. Please try again later or a different video.
          </div>
          </div>
        : 
      <div className="h-[90vh] w-full p-4">
        <div className="h-full w-full flex gap-4">
          <aside className="w-full md:w-[30%]">
            <Sidebar videoDoc={videoData || {}} />
          </aside>
          <main className="hidden md:block flex-1">
            <Main videoDoc={videoData || {}} />
          </main>
        </div>
      </div>
        }
    </Protected>
    </>
}