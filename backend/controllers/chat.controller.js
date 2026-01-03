
import { generateGeminiReply } from "../services/gemini.service.js";

/**
 * Handles chat requests.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const chatHandler = async (req, res) => {
    try {
        const { message } = req.body;

        // Validate input
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                error: "Invalid input. 'message' field is required and must be a non-empty string."
            });
        }

        // Call Gemini Service
        const reply = await generateGeminiReply(message);

        // Success response
        return res.status(200).json({ reply });

    } catch (error) {
        // Check for specific error status from service (e.g., 429)
        if (error.status === 429) {
            console.warn("⚠️ Rate/Quota Limit Hit:", error.message);
            return res.status(429).json({
                error: "Server is busy or quota exceeded. Please try again later."
            });
        }

        // General Server Error
        console.error("🔥 Chat Controller Error:", error);
        // Return 503 if it looks like an overload that didn't catch as 429
        if (error.message && (error.message.includes("503") || error.message.includes("Overloaded"))) {
            return res.status(503).json({
                error: "AI Service is temporarily overloaded. Please try again."
            });
        }

        return res.status(500).json({
            error: "An internal server error occurred."
        });
    }
};
