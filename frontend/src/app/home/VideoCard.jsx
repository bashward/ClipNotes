'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function videoCard({videoDoc}) {
  
  const { title, description, thumbnail, _id } = videoDoc
  
  const router = useRouter()

  function handleClick() {   
    router.push(`/video/${_id}`)
  }
  
  return <>
    <div

    onClick={handleClick}
  className="
    group relative w-full max-w-sm overflow-hidden
    rounded-[var(--radius)] border border-border/70 bg-card text-card-foreground
    shadow-sm transition-all duration-300
    hover:-translate-y-0.5 hover:shadow-md
    focus-within:ring-2 focus-within:ring-primary/30 hover:cursor-pointer
  "
>
  {/* Image */}
  <div className="relative aspect-[16/9] overflow-hidden">
    <Image
      src={thumbnail}
      alt='text'
      fill
      sizes="(max-width: 640px) 100vw, 384px"
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      priority={false}
    />
    {/* subtle top/bottom fade so white text never fights edges */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/5" />
  </div>

  {/* Content */}
  <div className="p-4 space-y-2">
    <h3 className="text-base md:text-lg font-semibold tracking-tight line-clamp-2">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
      {description}
    </p>
  </div>
</div>

  </>
}