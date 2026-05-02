import { GoogleGenAI } from '@google/genai';

/**
 * AI Service for handling chat interactions.
 * If VITE_GEMINI_API_KEY is available in the environment, it uses the Google Gemini API.
 * Otherwise, it falls back to a mock implementation for demonstration.
 */

const getApiKey = () => {
    try {
        return import.meta.env.VITE_GEMINI_API_KEY;
    } catch (e) {
        return null;
    }
};

const apiKey = getApiKey();
let ai = null;

if (apiKey) {
    // Initialize the Gemini API client
    ai = new GoogleGenAI({ apiKey: apiKey });
}

export const getAiResponse = async (prompt, chatHistory = []) => {
    if (ai) {
        try {
            // Build the conversation history for context
            let historyText = chatHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
            const fullPrompt = `You are a specialized AI assistant for the LandslideWatch platform. You help analyze landslide risks, interpret data, and provide safety recommendations.\n\nConversation History:\n${historyText}\n\nUser: ${prompt}\nAssistant:`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
            });
            
            return response.text;
        } catch (error) {
            console.error('Error fetching response from Gemini API:', error);
            return "I'm having trouble connecting to the prediction models right now. Please check your API key configuration or try again later.";
        }
    } else {
        // Mock Implementation Fallback
        return getMockResponse(prompt);
    }
};

const getMockResponse = async (prompt) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('risk') && lowerPrompt.includes('sector 4')) {
        return "Based on the latest sensor data, Sector 4 currently has a HIGH landslide risk due to recent heavy rainfall (85mm in 24h) and high soil moisture content. I recommend issuing a localized alert.";
    } else if (lowerPrompt.includes('rainfall') || lowerPrompt.includes('weather')) {
        return "The current forecast predicts another 40mm of rain over the next 12 hours across the northern ridges. This will likely elevate the risk levels in Sectors 2, 4, and 7.";
    } else if (lowerPrompt.includes('safe') || lowerPrompt.includes('clear')) {
        return "Sectors 1, 3, and 5 are currently showing stable soil conditions and normal risk levels. However, continuous monitoring is advised.";
    } else if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
        return "Hello! I'm your LandslideWatch AI assistant. How can I help you analyze the current risk data today?";
    } else {
        return "I've analyzed the current metrics. Soil moisture is at 62%, and slope instability indicators have risen slightly by 2% since yesterday. Would you like a detailed breakdown by sector?";
    }
};
