import herodemo from '../../public/herodemo.png'
import  Image  from 'next/image'

 export default function Hero() {


    return (
        <>
        <section className="relative">
  {/* subtle background glow */}
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl
                    bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />
  </div>

  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="grid min-h-[80vh] grid-cols-1 items-center gap-10 md:grid-cols-2">
      {/* Left: copy */}
      <div className="flex flex-col justify-center">
        {/* <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          
        </span> */}

        <h1 className="mt-4 text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          Turn youtube videos into{" "}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            clip notes
          </span>
          .
        </h1>

        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Generate highlights, cheatsheets, transcripts, and more - fast.
        </p>

        {/* CTAs */}
        {/* <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/auth/sign"
            className="inline-flex items-center justify-center rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Get started
          </a>
          <a
            href="#demo"
            className="inline-flex items-center justify-center rounded-[var(--radius)] border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
          >
            Watch demo
          </a>
        </div> */}

        {/* tiny trust row (optional) */}
        {/* <div className="mt-4 text-xs text-muted-foreground">
          No install needed · Works with YouTube links
        </div> */}
      </div>

      {/* Right: visual */}
      <div className="flex items-center justify-center">
        <figure className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="aspect-video w-full">
            <Image
              src={herodemo}
              alt="ClipNotes demo"
              className="h-full w-full object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
            />
          </div>
          <figcaption className="p-3 text-center text-xs text-muted-foreground">
            Paste a link → get notes in seconds
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</section>

        </>
    )
 }