import { writeFile } from "fs/promises";
import { GoogleGenAI, Modality } from "@google/genai";

const RATE_LIMIT_DELAY_MS = 15000;
let lastImageRequestTime = 0;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateStickmanImage(
  scenePrompt: string,
  outputPath: string
): Promise<void> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  const now = Date.now();
  const timeSinceLastRequest = now - lastImageRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY_MS && lastImageRequestTime > 0) {
    const waitTime = RATE_LIMIT_DELAY_MS - timeSinceLastRequest;
    await delay(waitTime);
  }
  
  lastImageRequestTime = Date.now();

  const genAI = new GoogleGenAI({ 
    vertexai: false,
    apiKey 
  });

  const imagePrompt = `Create a clean, high-quality stickman comic panel illustration.

Style requirements:
- White or light background
- Minimalist, thin black outlines
- Simple stickman figure (circle head, stick body, arms, legs)
- Subtle colors only for key elements (e.g., brown/blue/green for eyes)
- Include short text labels if relevant (e.g., "BROWN EYES", "DNA")
- NO long captions or bottom text blocks
- Style: educational infographic / simple comic panel
- Professional and clean appearance

Scene to illustrate: ${scenePrompt}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        {
          role: "user",
          parts: [{ text: imagePrompt }]
        }
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("Gemini API returned no candidates");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("Gemini API returned no content parts");
    }

    let imageSaved = false;
    for (const part of content.parts) {
      if (part.text) {
        console.log(`Gemini description: ${part.text}`);
      } else if (part.inlineData && part.inlineData.data) {
        const imageData = Buffer.from(part.inlineData.data, "base64");
        await writeFile(outputPath, imageData);
        console.log(`Image saved: ${outputPath}`);
        imageSaved = true;
        break;
      }
    }

    if (!imageSaved) {
      throw new Error("Gemini API did not return an image");
    }
  } catch (error: any) {
    if (error.message?.includes("RESOURCE_EXHAUSTED") || error.message?.includes("Quota exceeded") || error.message?.includes("429")) {
      throw new Error("Gemini API quota exceeded. You may have reached your daily or per-minute request limit. Please wait a few minutes and try again, or check your quota at https://aistudio.google.com/app/apikey");
    }
    throw new Error(`Gemini image generation error: ${error.message || "Failed to generate image"}`);
  }
}
