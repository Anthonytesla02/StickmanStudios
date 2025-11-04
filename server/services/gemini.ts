import { GoogleGenAI } from "@google/genai";

// Rate limiting: Gemini free tier has strict quotas
// We'll space requests at least 15 seconds apart to stay well under the limit and avoid quota errors
const RATE_LIMIT_DELAY_MS = 15000;
let lastRequestTime = 0;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateStickmanPrompt(
  scriptLine: string, 
  onProgress?: (message: string) => void
): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  // Rate limiting: wait if needed to avoid quota errors
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY_MS && lastRequestTime > 0) {
    const waitTime = RATE_LIMIT_DELAY_MS - timeSinceLastRequest;
    if (onProgress) {
      onProgress(`Rate limiting: waiting ${Math.ceil(waitTime / 1000)}s before next Gemini API call...`);
    }
    await delay(waitTime);
  }
  
  lastRequestTime = Date.now();

  const genAI = new GoogleGenAI({ 
    vertexai: false,
    apiKey 
  });

  const prompt = `Convert this script line into a detailed visual description for a stickman animation scene:
"${scriptLine}"

Respond with only a concise visual description (1-2 sentences) that describes what the stickman should be doing in this scene. Focus on action, pose, and simple props if needed.`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
    });
    
    // Access the text from the response
    const text = result.text;
    
    if (!text) {
      throw new Error("Gemini API returned empty response");
    }
    
    return text.trim();
  } catch (error: any) {
    // If we hit a rate limit or quota error
    if (error.message?.includes("RESOURCE_EXHAUSTED") || error.message?.includes("Quota exceeded") || error.message?.includes("429")) {
      // Try to extract retry delay from error message
      const retryMatch = error.message.match(/retry in ([\d.]+)s/);
      if (retryMatch) {
        const retryDelay = Math.ceil(parseFloat(retryMatch[1]) * 1000);
        if (onProgress) {
          onProgress(`Hit rate limit. Waiting ${Math.ceil(retryDelay / 1000)}s before retry...`);
        }
        await delay(retryDelay);
        lastRequestTime = Date.now();
        // Retry once
        const retryResult = await genAI.models.generateContent({
          model: "gemini-2.0-flash-exp",
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
        });
        const retryText = retryResult.text;
        if (!retryText) {
          throw new Error("Gemini API returned empty response on retry");
        }
        return retryText.trim();
      } else {
        // No retry time specified - likely hit daily quota limit
        throw new Error("Gemini API quota exceeded. You may have reached your daily or per-minute request limit. Please wait a few minutes and try again, or check your quota at https://aistudio.google.com/app/apikey");
      }
    }
    throw new Error(`Gemini API error: ${error.message || "Failed to generate image description"}`);
  }
}
