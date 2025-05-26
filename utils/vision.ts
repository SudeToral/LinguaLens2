// utils/vision.ts
import * as FileSystem from "expo-file-system";

const ENDPOINT = "https://vision.googleapis.com/v1/images:annotate";
const API_KEY  = process.env.EXPO_PUBLIC_VISION_KEY;   // .env’de tanımlı

export async function detectObjects(uri: string) {
  if (!API_KEY) throw new Error("Missing EXPO_PUBLIC_VISION_KEY");

  // 1️⃣  Fotoğrafı Base64’e çevir
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // 2️⃣  Vision API isteği
  const body = {
    requests: [
      {
        image:    { content: base64 },
        features: [{ type: "LABEL_DETECTION", maxResults: 10 }],
      },
    ],
  };

  const res   = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify(body),
  });

  const json  = await res.json();
  return (json.responses?.[0]?.labelAnnotations || []).map(
    (l: any) => `${l.description} (${Math.round(l.score * 100)}%)`
  );
}
