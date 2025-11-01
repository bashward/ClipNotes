import { fetchTranscript } from 'youtube-transcript-plus'
import { decodeHTML } from 'entities'

export async function getTranscript(url) {

try {
  const response= await fetchTranscript(url,{
      lang: "en",
      userAgent:  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  })
  
  const cleanedResponse= cleanTranscript(response)
  
  return cleanedResponse
  
} catch (error) {
  throw error
} 

}

function cleanTranscript(segments, opts = {}) {
  const {
    removePromos = true,
    promoPadSec = 2.0,
    mergeGapSec = 0.5,
    maxMergedChars = 180,
    collapseWhitespace = true,
  } = opts;

  if (!Array.isArray(segments)) return [];

  // --- helpers ---
  const hasEntities = (s) => /&(?:#\d+|#x[a-f0-9]+|[a-z]+);/i.test(s);
  const decodeEntitiesFully = (s) => {
    // decode repeatedly until stable (or safety cap)
    let prev, cur = String(s);
    let guard = 0;
    do {
      prev = cur;
      cur = decodeHTML(prev);
      guard += 1;
    } while (cur !== prev && hasEntities(cur) && guard < 5);
    return cur;
  };

  // Common sponsor words, CTAs, and brands often used in ad reads
  const PROMO_RE = new RegExp(
    [
      // generic sponsor phrasing
      "\\b(sponsor|sponsored by|brought to you by|thanks to|in partnership with)\\b",
      "\\b(promo code|use code|discount|limited time offer|deal|sale)\\b",
      "\\b(link(?:ed)? in (?:the )?(?:description|pinned comment|below))\\b",
      "\\b(sign up|subscribe (?:now|today)|join (?:now|today)|check (?:it )?out)\\b",
      // urls/domains
      "(https?:\\/\\/|www\\.|[a-z0-9-]+\\.[a-z]{2,})(\\/\\S*)?",
      // common mid-roll sponsors (extend as needed)
      "\\b(nordvpn|raid shadow legends|skillshare|audible|squarespace|betterhelp|expressvpn|honey)\\b"
    ].join("|"),
    "i"
  );

  const RESUME_RE = /\b(now,?\s+let['’]s (?:get (?:back )?into|jump (?:back )?into)|back to (?:the )?video|anyway,?\s+back to)\b/i;

  // 1) Normalize + decode + basic cleanup
  const normalized = segments
    .map((s, i) => {
      let text = decodeEntitiesFully((s && s.text) || "");
      if (collapseWhitespace) {
        text = text.replace(/\s+/g, " ").trim();
      } else {
        text = text.trim();
      }
      return {
        text,
        startSec: Number((s && s.offset) || 0),
        durSec: Number((s && s.duration) || 0),
        lang: s && s.lang,
        _i: i,
      };
    })
    .filter((s) => s.text && s.text.length && s.durSec > 0);

  // 2) Sort by start time for deterministic processing
  normalized.sort((a, b) =>
    a.startSec === b.startSec ? a._i - b._i : a.startSec - b.startSec
  );

  // 3) Optionally mark promos and filter them out (with padding window)
  let filtered = normalized;
  if (removePromos) {
    // First pass: mark potential promo indices
    const promoFlags = new Array(normalized.length).fill(false);
    for (let idx = 0; idx < normalized.length; idx++) {
      const t = normalized[idx].text;
      if (PROMO_RE.test(t)) promoFlags[idx] = true;
    }

    // Expand promo regions by time padding
    if (promoFlags.some(Boolean)) {
      const toDrop = new Array(normalized.length).fill(false);
      const starts = normalized.map((s) => s.startSec);
      const ends = normalized.map((s) => s.startSec + s.durSec);

      for (let i = 0; i < normalized.length; i++) {
        if (!promoFlags[i]) continue;
        const left = Math.max(0, normalized[i].startSec - promoPadSec);
        const right = ends[i] + promoPadSec;

        for (let j = 0; j < normalized.length; j++) {
          const overlap =
            Math.max(0, Math.min(right, ends[j]) - Math.max(left, starts[j]));
          if (overlap > 0) toDrop[j] = true;
        }
      }

      // If there's a clear "resume" phrase, keep everything after the first resume we hit
      let resumeIdx = -1;
      for (let i = 0; i < normalized.length; i++) {
        if (RESUME_RE.test(normalized[i].text)) {
          resumeIdx = i;
          break;
        }
      }

      filtered = normalized.filter((_, i) => {
        if (!toDrop[i]) return true;
        // If post-resume, allow keeping (helps when brands are mentioned later as examples)
        if (resumeIdx !== -1 && i > resumeIdx) return true;
        return false;
      });
    }
  }

  // 4) Merge overlapping / tiny-gap segments
  const merged = [];
  for (const curr of filtered) {
    if (merged.length === 0) {
      merged.push({ ...curr });
      continue;
    }
    const prev = merged[merged.length - 1];
    const prevEnd = prev.startSec + prev.durSec;
    const currEnd = curr.startSec + curr.durSec;
    const gap = curr.startSec - prevEnd; // can be negative (overlap)

    const canMerge =
      gap <= mergeGapSec && // includes overlaps (gap <= 0)
      (prev.text.length + 1 + curr.text.length) <= maxMergedChars &&
      // avoid merging across obvious sentence boundaries if the previous already ends strongly
      !/[\.\?!]["’”)]?$/.test(prev.text);

    if (canMerge) {
      // Add space if needed
      prev.text = prev.text + (/\s$/.test(prev.text) ? "" : " ") + curr.text;
      // Extend duration to cover union
      prev.durSec = Math.max(prevEnd, currEnd) - prev.startSec;
    } else {
      merged.push({ ...curr });
    }
  }

  // 5) Final tiny cleanup: collapse stray spaces created by merges
  for (const m of merged) {
    m.text = m.text.replace(/\s+/g, " ").trim();
  }

  return merged.map(({ _i, ...rest }) => rest);
}




