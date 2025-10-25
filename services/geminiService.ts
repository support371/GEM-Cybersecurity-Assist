
import { GoogleGenAI } from "@google/genai";
import type { GeminiResponse, GroundingChunk } from '../types';

const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const runGenericTask = async (
    prompt: string, 
    model: 'gemini-2.5-pro' | 'gemini-2.5-flash' = 'gemini-2.5-flash'
): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error in runGenericTask:", error);
        return "An error occurred while processing your request. Please check the console for details.";
    }
};

export const runSearchQuery = async (query: string): Promise<GeminiResponse> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
        
        return {
            text: response.text,
            sources: sources,
        };
    } catch (error) {
        console.error("Error in runSearchQuery:", error);
        return {
            text: "An error occurred while fetching search results. Please check the console for details.",
            sources: [],
        };
    }
};


export const runMapsQuery = async (query: string, location: { latitude: number; longitude: number }): Promise<GeminiResponse> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: location
                    }
                }
            },
        });

        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

        return {
            text: response.text,
            sources: sources,
        };
    } catch (error) {
        console.error("Error in runMapsQuery:", error);
        return {
            text: "An error occurred while fetching map data. Please ensure location permissions are enabled and check the console.",
            sources: [],
        };
    }
};
