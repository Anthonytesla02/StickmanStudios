import { GoogleGenAI } from "@google/genai";

// Rate limiting: Gemini free tier allows 10 requests per minute
// We'll space requests at least 6.5 seconds apart to stay under the limit (60s / 10 = 6s, adding buffer)
const RATE_LIMIT_DELAY_MS = 6500;
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
    // If we still hit a rate limit, extract the retry delay from the error
    if (error.message?.includes("RESOURCE_EXHAUSTED") || error.message?.includes("Quota exceeded")) {
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
      }
    }
    throw new Error(`Gemini API error: ${error.message || "Failed to generate image description"}`);
  }
}
