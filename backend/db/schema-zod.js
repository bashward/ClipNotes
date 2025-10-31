const z=require('zod')

//Main schema for the data to be stored at db
const user = z.object({
    uid: z.string().min(1),
    email: z.email().min(1),
    name: z.string().min(1),
    profile_img: z.url().optional()
})

const videoItem=z.object({
    title: z.string().min(1),
    shortSummary: z.string().min(1),
    thumbnail: z.url().min(5)
})

const videoListofUser= z.object({
    uid: z.string().min(1),
    videoList: z.record(z.string().min(4),videoItem)
})

const videoData= z.object({
    id: z.string().min(4),
    title: z.string().min(1),
    transcript: z.object(),
    highlights: z.object(),
    cheatSheet: z.object(),
    videoUrl: z.url().min(6)
})

module.exports= { user, videoListofUser, videoItem, videoData }