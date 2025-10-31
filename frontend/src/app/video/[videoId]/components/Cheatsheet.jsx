'use client'


export default function Cheatsheet({ items = [] }) {
    

    return <>
    {items?
     <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
        {items.map((text, i) => (
          <article
            key={i}
            className="rounded-[12px] border border-border/70 bg-muted/20 p-3 transition-colors duration-200 ease-out hover:bg-muted/30"
          >
            <header className="mb-1 flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[11px] font-semibold tabular-nums">
                {i + 1}
              </span>
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground">Pointer</h4>
            </header>
            <p className="text-sm leading-7 text-foreground/90">{text}</p>
          </article>
        ))}
      </div>
    :
    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-3xl">
      Oops! Something went wrong :/
    </div>
  }
    </>
}

export function CheatsheetSkeleton() {
  return (
    <section
      aria-label="Cheatsheet loading"
      className="relative overflow-hidden rounded-[16px] border border-border bg-card"
    >
      <header className="sticky top-0 z-10 -mx-4 border-b border-border/70 bg-card/80 px-4 py-3 backdrop-blur">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </header>
      <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-[12px] border border-border/70 bg-muted/20 p-3">
            <div className="mb-2 h-3 w-10 animate-pulse rounded bg-muted" />
            <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-8/12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}