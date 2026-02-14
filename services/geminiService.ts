import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from '../types';

export const analyzeSurveyFeedback = async (
  feedback: string,
  dealerName: string
): Promise<AIAnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Handle empty feedback case gracefully
  if (!feedback || feedback.trim().length < 5) {
    return {
      clarityScore: 100,
      suggestions: [],
      tone: "Neutral",
      missingInfo: []
    };
  }

  const prompt = `
    You are a customer experience manager at HiPixel A/S Center.
    Review the following customer feedback from a service satisfaction survey.
    
    Dealer Name/Context: ${dealerName}
    Customer Feedback: "${feedback}"

    Analyze the feedback for helpfulness and tone.
    Provide a JSON response with:
    1. clarityScore (0-100): How clear and actionable is this feedback?
    2. suggestions: If the feedback is vague (e.g., "It was bad"), suggest adding details (e.g., "Please specify what went wrong"). If it's good, say "Great feedback".
    3. tone: "Positive", "Negative", "Neutral", "Frustrated", "Appreciative", etc.
    4. missingInfo: Any critical details missing from their story (e.g., date of service, technician name) if they are describing an incident.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clarityScore: { type: Type.INTEGER },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tone: { type: Type.STRING },
            missingInfo: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["clarityScore", "suggestions", "tone", "missingInfo"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      clarityScore: 0,
      suggestions: ["AI service unavailable. Proceeding with submission."],
      tone: "Unknown",
      missingInfo: []
    };
  }
};