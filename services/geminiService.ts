import { GoogleGenAI } from "@google/genai";
import { MatchupAdvice } from "../types";
import { getCachedAdvice, saveAdviceToCache } from "./dbService";
import { getCurrentPatch } from "./riotService";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We define the structure here for the prompt, as we cannot use responseSchema with googleSearch tools.
const JSON_STRUCTURE_PROMPT = `
{
  "summary": "One sentence summary of who has the advantage and why.",
  "firstClearPath": "Optimal starting path for the player (Red/Blue start).",
  "invadeDecision": "invade" | "defend" | "farm",
  "invadeExplanation": "Brief reason for the invade decision.",
  "earlyGame": "General Strategy for Early Game (Levels 1-4).",
  "earlyGameAdvantage": "me" | "enemy" | "even",
  "objectiveControl": "me" | "enemy" | "even",
  "objectiveExplanation": "Who controls Dragons/Grubs and why.",
  "powerSpikes": "When do you hit power spikes compared to the enemy.",
  "midLateGame": "Strategy for Mid-Late Game.",
  "midLateGameAdvantage": "me" | "enemy" | "even",
  "teamfightRole": "Player's role (e.g., Engage, Peel).",
  "specificInteraction": "A specific 1v1 ability interaction tip.",
  "keyMechanic": "One specific general tip or mechanic.",
  "counterItems": [
    { "name": "Item Name", "explanation": "Why it is good" }
  ]
}
`;

export const getMatchupAdvice = async (
  myChamp: string,
  enemyChamp: string
): Promise<MatchupAdvice> => {
  // 0. Get Current Patch Version
  const currentPatch = await getCurrentPatch();
  console.log(`Checking advice for patch ${currentPatch}`);

  // 1. Check Cache First with Patch Version
  const cachedText = await getCachedAdvice(myChamp, enemyChamp, currentPatch);
  if (cachedText) {
    try {
      const parsedAdvice = JSON.parse(cachedText);
      if (
        parsedAdvice.summary && 
        parsedAdvice.firstClearPath &&
        parsedAdvice.invadeDecision &&
        Array.isArray(parsedAdvice.counterItems)
      ) {
        return parsedAdvice as MatchupAdvice;
      } else {
        console.warn("Cache outdated or malformed. Fetching fresh advice.");
      }
    } catch (e) {
      console.warn("Cached data was invalid, fetching fresh advice.");
    }
  }

  // 2. If not in cache, call API
  // Use gemini-2.5-flash for search tool support
  const model = "gemini-2.5-flash";

  const prompt = `
    I am playing ${myChamp} in the Jungle in League of Legends.
    The enemy jungler is ${enemyChamp}.
    
    The current patch is ${currentPatch}.
    Use Google Search to find the latest Season 15 data, current patch ${currentPatch} winrates, and high-elo strategies for this specific matchup.
    Ensure the advice is up-to-date with the most recent meta changes.

    Provide a comprehensive strategic guide.
    
    IMPORTANT: Return the response as a valid, parseable JSON string ONLY. 
    Do not include markdown code blocks (like \`\`\`json). 
    Do not include any introductory text.
    
    The JSON must strictly follow this structure:
    ${JSON_STRUCTURE_PROMPT}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseSchema and responseMimeType are NOT allowed when using tools like googleSearch
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response text received");

    // Clean up potential markdown formatting if the model ignores instructions
    text = text.replace(/```json\n?|```/g, '').trim();

    let parsedAdvice: MatchupAdvice;
    try {
      parsedAdvice = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error", parseError);
      throw new Error("Failed to parse AI response.");
    }

    // Extract Grounding Metadata (Sources)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: { title: string; uri: string }[] = [];

    if (Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    // Remove duplicates based on URI
    const uniqueSources = Array.from(
      new Map<string, { title: string; uri: string }>(
        sources.map(s => [s.uri, s])
      ).values()
    );
    
    parsedAdvice.sources = uniqueSources;

    // 3. Save result to cache with current patch version
    await saveAdviceToCache(myChamp, enemyChamp, JSON.stringify(parsedAdvice), currentPatch);

    return parsedAdvice;
  } catch (error) {
    console.error("Error fetching matchup advice:", error);
    throw new Error("Failed to get advice from the Oracle.");
  }
};
