
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askMathAssistant(query: string, currentExpression: string, language: 'pt' | 'en'): Promise<string> {
  try {
    const systemInstruction = language === 'pt' 
      ? "Você é um professor de matemática amigável e conciso. Explique conceitos matemáticos, ajude com fórmulas e resolva problemas passo a passo. Seja direto e use markdown para formatar fórmulas."
      : "You are a friendly and concise math teacher. Explain math concepts, help with formulas, and solve problems step-by-step. Be direct and use markdown for formatting formulas.";

    const prompt = `Context: Current calculation is ${currentExpression}. User Question: ${query}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || (language === 'pt' ? "Desculpe, não consegui processar sua pergunta." : "Sorry, I couldn't process your question.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'pt' ? "Erro ao conectar com o assistente de IA." : "Error connecting to AI assistant.";
  }
}
