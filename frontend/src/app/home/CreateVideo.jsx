'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState, useEffect } from "react"
import { useAuth } from "@/context/authProvider"
import { useRouter } from 'next/navigation'


function isYouTubeUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return !!u.pathname.split('/').filter(Boolean)[0];
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return true;
      const p = u.pathname.split('/').filter(Boolean);
      return p.length >= 2 && ['shorts','embed','live'].includes(p[0]);
    }
  } catch {}
  return false;
}



function getYouTubeId(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
   
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;

      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2 && ["shorts", "embed", "live"].includes(parts[0])) {
        return parts[1] || null;
      }
    }
  } catch (_) {
   
  }
  return null;
}

export function CreateVideo() {

  const router = useRouter()
  
  const { getIdToken } = useAuth()
  let videoId = null
  
  
  const handleVideoProcess = async (prevState, formData) => {
    
    
    const url = formData.get('url')

    if(!isYouTubeUrl(url)) {
      return { ok: false, error: 'Please enter a valid url' , videoId: null}
    }

    videoId = getYouTubeId(url)
    const token = await getIdToken()
    const endpoint = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'get_data'
    
    try {
      
      const response = await fetch(endpoint,{
        method: 'POST',
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          url: url
        })
      })
      
      if(!response.ok) {
        return { ok: false , error: 'This video is not available.' , videoId: null }
      }
      
      
      return { ok: true, error: null, videoId: videoId };
      
    } catch (error) {
      console.log(error)
      return { ok: true, error: error, videoId: null }
    }
    
    
  }
  
  const [state, handleSubmit, isPending] = useActionState(handleVideoProcess, {ok: false, error: null })
  
  useEffect(()=>{
       if(state.ok && state.videoId) {
          router.push(`/video/${state.videoId}`)
        }   
    },[router,state])
    

  return (
    <Dialog>
  <DialogTrigger asChild>
    <Button variant="default">+ New Note</Button>
  </DialogTrigger>

  <DialogContent
  className="
    grid gap-4 p-6
    bg-card text-card-foreground
    border border-border rounded-[var(--radius)]
    shadow-lg sm:max-w-[520px]
  "
>
  <form action={handleSubmit} className="grid gap-4">
    <DialogHeader>
      <DialogTitle>Create ClipNote</DialogTitle>
      <DialogDescription className="text-muted-foreground">
        Paste the YouTube URL below.
      </DialogDescription>
    </DialogHeader>

    <div className="grid gap-2">
      <Label htmlFor="url">URL</Label>
      <Input
        id="url"
        name="url"
        type="url"
        placeholder="https://youtu.be/…"
        className="w-full bg-background border-border focus-visible:ring-primary"
        required
      />
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </div>

    <DialogFooter className="mt-2">
      <DialogClose asChild>
        <Button variant="outline" type="button" disabled={isPending}>
          Cancel
        </Button>
      </DialogClose>
      <Button type="submit" className="bg-primary text-primary-foreground" disabled={isPending}>
        {isPending ? "Creating…" : "Create"}
      </Button>
    </DialogFooter>
  </form>
</DialogContent>
    </Dialog>
  )
}
