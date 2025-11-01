import fastifyPlugin from 'fastify-plugin'
import { getTranscript } from '../lib/getTranscript.js';
import { getMetadata, getYouTubeId } from '../lib/getMetadata.js';
import { getHighlightsAndCheatSheet } from '../lib/getHighlightsAndCheatsheet.js';
import { getVideoList, getVideo, addVideotoList, deleteVideofromList, addVideo, addName, IsVideoInList } from '../db/operations.js';

async function Routes (app) {

app.decorate('verifyFirebaseToken',async (req,rep,done)=>{
    const token= req.headers.authorization || ''
    const m = token.match(/^Bearer\s+(.+)$/i);
    if(!m) {
        return rep.code(401).send({ error: 'Missing or malformed Authorization header' });
    }

    const idToken= m[1]
    try {
        const checkRevoked=false
        const decoded= await app.firebase.auth().verifyIdToken(idToken,checkRevoked)
        req.user={
            uid: decoded.uid,
            email: decoded.email,
            email_verified: decoded.email_verified,
            ...decoded
        }

    } catch (error) {
        return rep.code(401).send({ error: 'Invalid or expired token' });
    }
})

app.get('/list',{ preHandler: app.verifyFirebaseToken }, async (req,rep,done)=>{
    const user=req.user

    try {
    const list= await getVideoList(app, user.uid)
        
    return rep.send(list)
    } catch (error) {
      return rep.code(500).send({ error: 'cannot reach database'})    
    }
    

})

app.post('/get_data',{ preHandler: app.verifyFirebaseToken },async (req,rep)=>{
const user=req.user
const url = req.body.url


const videoId= getYouTubeId(url)
let videoDoc
//check if the video already exists
try {
 videoDoc= await getVideo(app, videoId)
    
} catch (error) {
    rep.code(500).send({ error: 'cannot reach the database'})
}

if(!videoDoc) {
    
    try{
        //get all the required video data
        const { title, description, thumbnail} = await getMetadata(url, null)
        const transcript= await getTranscript(url)
        const { highlights, cheatsheet } = await getHighlightsAndCheatSheet(transcript)
        
        //database operations before sending the data
        await addVideotoList(app, user, {videoId, title, description, thumbnail})
        await addVideo(app, {videoId, title, transcript, highlights, cheatsheet, url})
    
    }catch(error) {
        console.log(error)
        return rep.code(500).send({ error: error.message });
    }
    
    return rep.send({
        message: 'success'
    })

} 

else {
  
    try {
        await addVideotoList(app,user,{videoId, title, description, thumbnail})
    } catch (error) {
        console.log(error)
        return rep.code(500).send({ error: 'cannot add video to list'})
    }

   return rep.send({
        message: 'success'
    })

}

})

app.post('/get_video',{preHandler: app.verifyFirebaseToken}, async (req,rep) =>{
    const user = req.user
    const videoId= req.body.videoId
    
    let IsInList, videoDoc

    try {
        IsInList = await IsVideoInList(app, user.uid, videoId)
        videoDoc= await getVideo(app, videoId)     
        
    } catch (error) {
      return rep.code(500).send({ error: 'database error'}) 
    }
    
    
    if(videoDoc && IsInList) {
        return rep.send(videoDoc)
    }
    else if(videoDoc && !IsInList) {
        
        try {
            const { title, description, thumbnail} = await getMetadata(null, videoId)
            await addVideotoList(app, user, {videoId, title, description, thumbnail})
            return rep.send(videoDoc)
        } catch (error) {
            return rep.code(500).send({
                error: 'cannot add video to list'
            })
        }

    }

    return rep.code(500).send({ error: 'video not found'})
})

app.post('/add_name',{preHandler: app.verifyFirebaseToken}, async(req,rep) =>{
   const { name }= req.body
   const user = req.user

   try {
     await addName(app, user, name)
   } catch (error) {
    console.log(error)
    return rep.code(500).send({ error: 'cannot add name'})
   }

   return rep.send("Name added successfully")
})

}

export default fastifyPlugin(Routes)