'use client'

import dynamic from "next/dynamic";
import Interview from "./components/Interview";
import { TranscriptSkeleton } from "./components/Transcript";
import { HighlightsSkeleton } from "./components/Highlights";
import { CheatsheetSkeleton } from "./components/Cheatsheet";
import { useState } from "react";

const Transcript = dynamic(() => {
  return  import('./components/Transcript')
},
{
    loading: () => <TranscriptSkeleton/>,
    ssr: false
})

const Highlights = dynamic(() => {
  return  import('./components/Highlights')
},
{
    loading: () => <HighlightsSkeleton/>,
    ssr: false
})

const Cheatsheet = dynamic(() => {
  return  import('./components/Cheatsheet')
},
{
    loading: () => <CheatsheetSkeleton/>,
    ssr: false
})

export default function Main({videoDoc}) {
    const [tab, setTab] = useState('transcript')
    const { transcript, highlights, cheatsheet} = videoDoc
    
    const pill = (key, label) =>
    (
      <button
        type="button"
        onClick={() => setTab(key)}
        className={[
          "rounded-[16px] border px-3 py-2 text-sm font-medium transition-all duration-200",
          tab === key
            ? "bg-primary text-primary-foreground border-transparent shadow"
            : "bg-background/70 text-foreground border-border hover:-translate-y-0.5 hover:shadow",
        ].join(' ')}
      >
        {label}
      </button>
    )
    return<>
     <div className="h-full rounded-[24px] border border-border bg-card text-card-foreground shadow-lg flex flex-col">
      
      <div className="p-3">
        <div className="flex gap-3">
          {pill('transcript', 'Transcript')}
          {pill('highlights', 'Highlights')}
          {pill('cheatsheet', 'Cheatsheet')}
          {pill('interview', 'Interview')}
        </div>
      </div>

      
      <div className="relative flex-1 min-h-0 p-3">
        {tab === 'transcript' && (
          <div className="absolute inset-0 overflow-y-auto">
            <Transcript items={transcript} />
          </div>
        )}
        {tab === 'highlights' && (
          <div className="absolute inset-0 overflow-y-auto">
            <Highlights items={highlights} />
          </div>
        )}
        {tab === 'cheatsheet' && (
          <div className="absolute inset-0 overflow-y-auto">
            <Cheatsheet items={cheatsheet} />
          </div>
        )}
        {tab === 'interview' && (
          <div className="absolute inset-0 overflow-y-auto">
            <Interview />
          </div>
        )}
      </div>
    </div>
    </>
}