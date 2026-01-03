
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

let model;

// Initialize Gemini Model
if (apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-1.5-flash for better speed/quota on free tier
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

        // Check for common rate limit / quota patterns in error response
        const errorMsg = error.message || "";
        if (errorMsg.includes("429") || errorMsg.includes("Quota") || errorMsg.includes("Too Many Requests")) {
            const rateLimitError = new Error("Too many requests (Gemini Quota Exceeded).");
            rateLimitError.status = 429;
            throw rateLimitError;
        }

        // Rethrow other errors to be handled as 500
        throw error;
    }
};
