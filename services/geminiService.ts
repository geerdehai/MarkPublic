import { GoogleGenAI, Type } from "@google/genai";
import { Idea } from "../types";

// Lazy initialization helper to prevent top-level crashes
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Generate a full description and tags based on a short title/concept
export const enhanceIdeaWithAI = async (concept: string): Promise<{ description: string; tags: string[] }> => {
  try {
    const ai = getAiClient();
    if (!ai) throw new Error("API Key missing");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `I have an idea for an app using Gemini 3. The concept is: "${concept}". 
      Please provide a 2-3 sentence professional description of what this app could do, emphasizing Gemini 3's multimodal or reasoning capabilities.
      Also provide 3-4 short, relevant tags (e.g., "Computer Vision", "Real-time", "Education").`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["description", "tags"]
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    return {
      description: json.description || "Could not generate description.",
      tags: json.tags || ["AI", "Gemini"]
    };
  } catch (error) {
    console.error("AI Enhance failed:", error);
    return {
      description: "AI enhancement currently unavailable. Please check your API key or internet connection.",
      tags: ["Draft"]
    };
  }
};

// Generate a list of sample ideas if the app is empty
export const generateSampleIdeas = async (): Promise<Partial<Idea>[]> => {
  try {
    const ai = getAiClient();
    if (!ai) throw new Error("API Key missing");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate 3 innovative app ideas that demonstrate the capabilities of Gemini 3 (e.g., long context, multimodal video analysis, advanced reasoning).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              author: { type: Type.STRING }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || "[]");
    return json;
  } catch (error) {
    console.error("AI Samples failed:", error);
    return [];
  }
};