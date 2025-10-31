'use client'

export default function Transcript({ items = [] }) {
    const fmt = (s) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  }
  
  

    return<>
    {items ?
      <ol className="px-4 py-3 space-y-3 h-full overflow-y-auto">
        {items.map((it, i) => (
          <li
            key={i}
            className="group rounded-[12px] border border-transparent transition-colors duration-200 ease-out hover:border-border/70 hover:bg-muted/30"
          >
            <div className="flex items-start gap-3 p-3">
              {/* Time badge (link can be wired to seek later) */}
              <a
                // href={`?t=${Math.floor(it.startSec)}`}
                aria-label={`Jump to ${fmt(it.startSec)}`}
                data-start={it.startSec}
                className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium tabular-nums text-muted-foreground transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-foreground"
              >
                {fmt(it.startSec)}
              </a>

              {/* Line text */}
              <p className="text-sm leading-7 text-foreground/90">{it.text}</p>
            </div>
          </li>
        ))}
      </ol>
    :
    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-3xl">
      Oops! There was something wrong :/
    </div>
  }
    </>
}

export function TranscriptSkeleton() {
  return (
    <section
      aria-label="Transcript loading"
      className="relative overflow-hidden rounded-[16px] border border-border bg-card"
    >
      <header className="sticky top-0 z-10 -mx-4 border-b border-border/70 bg-card/80 px-4 py-3 backdrop-blur">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      </header>
      <div className="px-4 py-3 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-5 w-10 animate-pulse rounded bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
              <div className="h-3 w-9/12 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}