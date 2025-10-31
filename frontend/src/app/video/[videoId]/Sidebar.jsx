export default function Sidebar({videoDoc}) {
  
  const { title, videoId, description } = videoDoc
  
  return <>
    {videoDoc?
<div className="flex h-full flex-col">
      <div className="p-2 text-xl font-bold text-foreground">{title}</div>
      <div className="p-2">
        <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={videoId ? `https://www.youtube.com/embed/${videoId}` : undefined}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            />
        </div>
      </div>
      {description ? (
        <div className="p-2 rounded-[24px] border border-border bg-card text-card-foreground shadow-lg">
          <div className="p-2">
           Summary
          </div>
          {description}</div>
      ) : null}
    </div>
:
<div className="h-full w-full flex items-center justify-center text-muted-foreground text-xl">
      Oops! There was something wrong :/
    </div>
}
  
  </>
}
