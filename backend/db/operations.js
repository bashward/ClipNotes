import { user, videoListofUser, videoItem, videoData } from './schema-zod.js'


//object validator
function validateUser(input) {
 const result = user.safeParse(input)

 if(!result.success) {
  return result.error
 }
 else {
  return result.data
 }
}

function validateVideoList(input) {
 const result = videoListofUser.safeParse(input)

 if(!result.success) {
  return result.error
 }
 else {
  return result.data
 }
}

function validateVideoItem(input) {
 const result = videoItem.safeParse(input)

 if(!result.success) {
  return result.error
 }
 else {
  return result.data
 }
}

function validateVideoData(input) {
const result = videoData.safeParse(input)

 if(!result.success) {
  return result.error
 }
 else {
  return result.data
 }
}

//profile operations

export async function userExists(app,user) {
  const { uid } = user

  try {
    const doc= await app.mongo.db.collection('users').findOne({uid: uid})
  
    return !!doc
  } catch (error) {
    console.log("Error in checking if the user exists: " + error)
    throw error
  }
}

export async function addName(app,user,name) {

if(await userExists(app,user)) {
  const { uid } = user

  const update= {
    $set : { name: name }
  }

  try {
    const res = await app.mongo.db.collection('users').updateOne({uid: uid}, update, {upsert: false})

    if(!res.acknowledged) {
      throw new Error('database not responding')
    }
    
  } catch (error) {
    console.log("Error in updating name: " + error)
    throw error
  }


}  
 
 const { uid, email } = user   
 const userDoc = { uid: uid, name: name, email: email, profile_img: '' }
    
 try {
   const res= await app.mongo.db.collection('users').insertOne(userDoc)   
   
   if(!res.acknowledged) {
    throw new Error('database not responding')
   }

   return res 
 } catch (error) {
  console.log("Error in adding the user: " + error)
   throw error
 }
}


//videolist operations

export async function getVideoList(app,uid) {

   try {
     const doc = await app.mongo.db
     .collection('videoList')
     .findOne(
       { uid },
       { projection: { videoList: 1, _id: 0 } }
     );


   return doc?.videoList ?? {};
     
   } catch (error) {
    console.log("Error in getting the video: " + error)
    throw error
   }
}

export async function addVideotoList(app, user , {videoId, ...video}) {

const { uid } = user
const videoDoc= video

const update= {
    $setOnInsert: { uid: uid },
    $set: { [`videoList.${videoId}`] : videoDoc }
}

try {
  const res=await app.mongo.db.collection('videoList').updateOne({uid: uid}, update, {upsert: true})
  
  if(!res.acknowledged) {
    throw new Error('Database update failed')
  }

  return res
  
} catch (error) {
  console.log("Error in adding video to the list: " + error)
  throw error
}

}


export async function deleteVideofromList(app, uid, videoId) {

const update= { $unset: { [`videoList.${videoId}`] : {} }}

try { 
  const res= await app.mongo.db.collection('videoList').updateOne({uid: uid}, update)

  if(!res.acknowledged) {
    throw new Error('Database update failed')
  }

  return res
} catch (error) {
  console.log("Error in deleting video: " + error)
  throw error
}

  
}

export async function IsVideoInList(app, uid, videoId) {
  
  try {
    const doc = await getVideoList(app, uid)
    return videoId in doc
    
  } catch (error) {
    throw error
  }

}

//video page operations


export async function addVideo(app, videoDoc) {

      try {
        const res= await app.mongo.db.collection('videos').insertOne(videoDoc)

        if(!res.acknowledged) {
          throw new Error('Video insertion failed')
        }

        return res
        
      } catch (error) {
      
        console.log("Error in adding video: " + error)
        throw error
      }
      
      
    
}

export async function getVideo(app, videoId) {

  try {
    const doc= await app.mongo.db.collection('videos').findOne({videoId: videoId})
    return doc
    
  } catch (error) {
    console.log("Error in getting video: " + error)
    throw error
  }


}
