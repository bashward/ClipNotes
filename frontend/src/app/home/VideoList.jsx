'use client'
import { useState, useEffect } from "react"

import VideoCard from "./VideoCard"
import { useAuth } from "@/context/authProvider"

export default function VideoList() {
    const [data,setData] = useState([])
    const { getIdToken } = useAuth()

    const getList = async () =>{
        const endpoint= process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'list'
        const token= await getIdToken()
        
       
        try {
         const response = await fetch(endpoint, {
              method: 'GET',
              headers: {
                  'Authorization' : `Bearer ${token}`,
                  'Content-Type' : 'application/json'
              }
          })
          
          const data = await response.json()

              const videoArray = Object.entries(data).map(([videoId, videoData]) => ({
                _id: videoId,  // Add the ID to the video object
                ...videoData   // Spread the rest of the video data
            }))
            
            
            setData(videoArray)         
          
        } catch (error) {
          console.log(error)
        }    

    }

   useEffect(()=>{
        getList()
   },[])

    return <>
    {data.length > 0 ? (
      <div
        className="
          w-full p-8
          grid gap-2
          grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
          auto-rows-fr
        "
      >
        {data.map((videoData) => (
          <VideoCard key={videoData._id} videoDoc={videoData} />
        ))}
      </div>
    ) : (
      <div className="h-[70vh] w-full text-muted-foreground text-2xl flex items-center justify-center">
        No video notes yet.
      </div>
    )}
    </>
}