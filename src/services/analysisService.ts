import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface AnalysisResult {
  verdict: 'Real' | 'Fake' | 'Suspicious' | 'Inconclusive';
  confidenceScore: number;
  analysis: string;
  summaryPoints: string[];
  suspiciousWords: string[];
  metadata: {
    source?: string;
    author?: string;
    publishedDate?: string;
  };
}

export async function analyzeContent(content: string, type: 'text' | 'url' | 'social'): Promise<AnalysisResult> {
  const prompt = `
    Analyze the following ${type === 'url' ? 'URL/Article' : 'content'} for fake news, misinformation, or coordinated inauthentic behavior.
    Content: ${content}

    Context: If this is social media content, look for sensationalism, lack of citations, and bot patterns.

    Return a JSON object ONLY:
    {
      "verdict": "Real" | "Fake" | "Suspicious" | "Inconclusive",
      "confidenceScore": number (0-100),
      "analysis": "A concise explanation.",
      "summaryPoints": ["Key reason 1", "Key reason 2", "Key reason 3"],
      "suspiciousWords": ["word1", "word2"],
      "metadata": {
        "source": "Estimated source",
        "author": "Estimated author",
        "publishedDate": "Estimated date"
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  const responseText = response.text;
  if (!responseText) throw new Error('No response from AI');
  
  // Robust JSON extraction
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
  
  return JSON.parse(jsonStr.trim());
}
