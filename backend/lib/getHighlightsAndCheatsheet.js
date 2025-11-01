import 'dotenv/config'


function extractJsonBlock(text) {
  if (!text) return null;
  // strip ```json ... ``` or ``` ... ```
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const raw = fenced ? fenced[1] : text;

  // normalize a few common "almost JSON" issues
  const normalized = raw
    .replace(/[\u201C\u201D]/g, '"')      // smart quotes → "
    .replace(/[\u2018\u2019]/g, "'")      // smart single quotes → '
    .replace(/,\s*([}\]])/g, "$1");       // trailing commas

  try {
    return JSON.parse(normalized);
  } catch {
    return null;
  }
}

function parseHighlightsCheatsheet(apiResponse) {
  const content = apiResponse?.choices[0]?.message?.content;
  const parsed = extractJsonBlock(content);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("LLM did not return valid JSON.");
  }

  const highlights = Array.isArray(parsed.highlights) ? parsed.highlights : [];
  const cheatsheet = Array.isArray(parsed.cheatsheet) ? parsed.cheatsheet : [];
  return { highlights, cheatsheet };
}


export async function getHighlightsAndCheatSheet(transcript) {

const SYSTEM_PROMPT= `

You are a function that converts a YouTube transcript into two lists.
Return **strict JSON** only (no prose, no Markdown), with this exact shape:

{
  "highlights": ["string", "..."],
  "cheatsheet": ["string", "..."]
}


Rules:

 Read the transcript (user message) and extract:

  * **highlights**: 5–15 punchy, one-sentence takeaways (≤140 chars each).
  * **cheatsheet**: 5–15 actionable, step-style tips or facts (≤120 chars each), phrased so they make sense out of context.
* Do **not** include keys other than highlights and cheatsheet.
* No nested objects, no numbering, no quotes inside items beyond normal punctuation.
* If content is insufficient, return empty arrays.
* Output must be valid JSON and parseable with JSON.parse.

Example output format (structure only):

json
{"highlights":["..."],"cheatsheet":["..."]}
`

const url = "https://openrouter.ai/api/v1/chat/completions";
const headers = {
  "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json"
};
const payload = {
  "model" : "mistralai/mistral-small-3.2-24b-instruct:free",
  "messages": [
    {
      "role": "system",
      "content": SYSTEM_PROMPT
    },
    {
      "role": "user",
      "content": JSON.stringify(transcript)
    }
  ]
}

try{
  
  const response= await fetch(url,{
      method: "POST",
      headers,
      body: JSON.stringify(payload)
  })
  
  const data=await response.json()
  
  const { highlights, cheatsheet } = parseHighlightsCheatsheet(data)
  
  return {
      highlights: highlights,
      cheatsheet: cheatsheet
  }
}catch(err) {
  return err

}


}

