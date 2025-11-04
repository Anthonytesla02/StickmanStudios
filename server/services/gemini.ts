import { GoogleGenAI } from "@google/genai";

export async function generateStickmanPrompt(scriptLine: string): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

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
    throw new Error(`Gemini API error: ${error.message || "Failed to generate image description"}`);
  }
}
