
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

let model;

// Initialize Gemini Model
if (apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-1.5-pro as requested
    model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
} else {
    console.warn("⚠️ GEMINI_API_KEY is missing in environment variables.");
}

/**
 * Generates a reply from Gemini.
 * NOTE: No retries are implemented to respect quota limits.
 * @param {string} message - The user's input message.
 * @returns {Promise<string>} - The chatbot's reply.
 */
export const generateGeminiReply = async (message) => {
    if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
    }

    if (!message) {
        throw new Error("Message content cannot be empty.");
    }

    try {
        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        // Log the raw error for debugging purposes
        console.error("❌ Gemini Service Error:", error);

        // If it's a rate limit/quota error, rethrow it so the controller can handle it (429)
        if (error.message && error.message.includes("429")) {
            const rateLimitError = new Error("Too many requests (Gemini Quota Exceeded).");
            rateLimitError.status = 429;
            throw rateLimitError;
        }

        // Rethrow other errors to be handled as 500
        throw error;
    }
};
