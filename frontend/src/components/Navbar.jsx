"use client"

import ThemeToggle from "./theme/ThemeToggle"
import Link from "next/link"
import { Button } from "./ui/button"
import { useAuth } from "@/context/authProvider"
import Image from "next/image"
import icon from "../../public/icon.png"

export default function Navbar() {
    
    const { authUser, signOut } = useAuth()

     const handleSignOut = async () => {
     await signOut();
  };

  
    return <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur shadow-2xl">
      <nav className="mx-auto flex h-[10vh] max-w-6xl items-center justify-between p-2">
        {/* Left: brand */}
        <Link href={authUser ? '/home' : '/'} className="inline-flex items-center gap-2 text-foreground">
          {/* Optional logo slot could go here */}
          <span className="text-3xl font-semibold font-sans flex flex-row">
            <Image src={icon} alt='icon' height={32} width={32} />
            ClipNotes</span>
        </Link>

        {/* Right: theme + login */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {authUser ? 
           <button onClick={handleSignOut} className="font-sans text-md hover:scale-105  p-2 bg-primary text-foreground hover:opacity-90 focus:outline-none rounded-[var(--radius)] focus:ring-2 focus:ring-primary cursor-pointer">
           Sign Out
          </button> :
           <button className="font-sans text-md hover:scale-105  p-2 bg-primary text-foreground hover:opacity-90 focus:outline-none rounded-[var(--radius)] focus:ring-2 focus:ring-primary cursor-pointer">
           <Link href='/login'>Login</Link>
          </button>
          }
        </div>
      </nav>
    </header>
    </>
}