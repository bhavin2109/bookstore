
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyGemini = async () => {
    console.log("Checking API Key...");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ Error: GEMINI_API_KEY is missing in .env file");
        return;
    }

    try {
        console.log("Initializing Gemini Client with gemini-2.0-flash...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log("Sending test prompt...");
        const result = await model.generateContent("Hello!");
        const response = await result.response;
        const text = response.text();

        console.log("✅ Success! Response:", text);
    } catch (error) {
        console.error("❌ Error Reproduced:");
        console.error(error);
    }
};

verifyGemini();
