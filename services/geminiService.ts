
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { GroundingMetadata } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please set your API key.");
    process.env.API_KEY = "YOUR_API_KEY";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const searchWithGoogle = async (prompt: string): Promise<{ text: string, metadata: GroundingMetadata | null }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const metadata = (response.candidates?.[0]?.groundingMetadata as GroundingMetadata) || null;
        
        return { text, metadata };
    } catch (error) {
        console.error("Error with Google Search grounding:", error);
        throw new Error("Failed to fetch search results from Gemini API.");
    }
};

export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in the response.");
    } catch (error) {
        console.error("Error editing image with Gemini:", error);
        throw new Error("Failed to edit image using Gemini API.");
    }
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove data:mime/type;base64, prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};
