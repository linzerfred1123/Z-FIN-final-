
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Language } from "../types";

export const analyzeFinancialData = async (
  fileData: string, 
  isImage: boolean, 
  language: Language = 'zh'
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const langMap: Record<Language, string> = {
    zh: 'Chinese (Simplified)',
    en: 'English',
    ja: 'Japanese',
    de: 'German'
  };

  const targetLang = langMap[language];

  const prompt = `You are an elite CFO and Business Intelligence Architect. 
  Analyze the provided financial data and generate a hyper-professional business dashboard in JSON format.
  
  IMPORTANT: All text in the response (summary, labels, titles, descriptions, recommendations, riskReason) MUST be in ${targetLang}.
  
  Requirements for the JSON:
  1. Summary: Clear, concise executive overview.
  2. Metrics: 4 key KPIs (e.g., EBITDA, Net Margin, Current Ratio) with trend labels.
  3. ChartData: At least 6 time-series data points (Revenue, Expenses, Profit).
  4. ExpenseBreakdown: An array of 5-7 categories for a pie chart. Ensure they cover the majority of OpEx to form a complete picture.
  5. ComparisonData: Key metrics (like Revenue, COGS, OpEx) comparing Current Period vs Previous Period.
  6. Insights: 3-4 strategic high-impact recommendations.
  7. RiskRating: Score 1-10.
  8. RiskReason: A detailed paragraph explaining why this risk rating was given based on specific data points (liabilities, cash flow, margins).
  9. Currency: The currency used in the document (e.g., "$", "¥", "€").

  Tone: Objective, authoritative, and data-driven.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: isImage 
      ? { parts: [{ inlineData: { data: fileData, mimeType: "image/png" } }, { text: prompt }] }
      : { parts: [{ text: prompt + "\n\nSource Content:\n" + fileData }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          currency: { type: Type.STRING },
          riskReason: { type: Type.STRING },
          metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
                trend: { type: Type.STRING, enum: ['up', 'down', 'neutral'] },
                change: { type: Type.STRING },
                color: { type: Type.STRING },
                details: { type: Type.STRING }
              },
              required: ['label', 'value', 'trend', 'change', 'color']
            }
          },
          chartData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                period: { type: Type.STRING },
                revenue: { type: Type.NUMBER },
                expenses: { type: Type.NUMBER },
                profit: { type: Type.NUMBER }
              },
              required: ['period', 'revenue', 'expenses', 'profit']
            }
          },
          expenseBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER },
                color: { type: Type.STRING }
              },
              required: ['name', 'value', 'color']
            }
          },
          comparisonData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                current: { type: Type.NUMBER },
                previous: { type: Type.NUMBER }
              },
              required: ['label', 'current', 'previous']
            }
          },
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
              },
              required: ['category', 'title', 'description', 'recommendation', 'severity']
            }
          },
          riskRating: { type: Type.NUMBER }
        },
        required: ['summary', 'metrics', 'chartData', 'expenseBreakdown', 'comparisonData', 'insights', 'riskRating', 'riskReason', 'currency']
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    throw new Error("Invalid response structure.");
  }
};
