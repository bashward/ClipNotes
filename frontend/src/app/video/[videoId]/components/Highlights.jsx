'use client'


export default function Highlights({items = []}) {
   

    return <>
    { items ?
    <ul className="px-4 py-3 space-y-3 max-h-[60vh] overflow-y-auto">
        {items.map((text, i) => (
          <li
            key={i}
            className="group rounded-[12px] border border-transparent transition-colors duration-200 ease-out hover:border-border/70 hover:bg-muted/30"
          >
            <div className="flex items-start gap-3 p-3">
              {/* bullet badge */}
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-foreground tabular-nums">
                {i + 1}
              </span>
              <p className="text-sm leading-7 text-foreground/90">{text}</p>
            </div>
          </li>
        ))}
      </ul>
       :
       <div className="h-full w-full flex items-center justify-center text-muted-foreground text-3xl">
      Oops! There was something wrong :/
    </div>
    }
    </>
}

export function HighlightsSkeleton() {
  return (
    <section
      aria-label="Highlights loading"
      className="relative overflow-hidden rounded-[16px] border border-border bg-card"
    >
      <header className="sticky top-0 z-10 -mx-4 border-b border-border/70 bg-card/80 px-4 py-3 backdrop-blur">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </header>
      <div className="px-4 py-3 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 h-5 w-5 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
              <div className="h-3 w-8/12 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}