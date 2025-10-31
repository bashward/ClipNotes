require('dotenv').config()


function getYouTubeId(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    // youtu.be/<id>
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    // youtube.com/watch?v=<id> or /shorts/<id> or /embed/<id>
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;

      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2 && ["shorts", "embed", "live"].includes(parts[0])) {
        return parts[1] || null;
      }
    }
  } catch (_) {
    // invalid URL string
  }
  return null;
}

async function getMetadata(url,Id) {

let videoId

if(url && !Id) {
  videoId= getYouTubeId(url)
}
else {
  videoId = Id
}

try {
  const res= await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YT_API_KEY}`)
  const data= await res.json()
 
  const { title, description, thumbnails } = data.items[0].snippet
  
  return {
     title: title,
     description: description.slice(0,120),
     thumbnail: thumbnails.standard?.url || thumbnails.default?.url
  }
  
} catch (error) {
console.log("Error fetching metadata: " + error)
throw error
}

}

module.exports= { getMetadata, getYouTubeId }