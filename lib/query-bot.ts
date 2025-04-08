import { GoogleGenerativeAI } from "@google/generative-ai";
import redisClient from './redis/redis';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Session timeout in seconds (e.g., 24 hours)
const SESSION_TIMEOUT = 24 * 60 * 60;

export const answerQuery = async (prompt: string, userId: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Get existing chat history
    let history = await redisClient.getChatHistory(userId);
    console.log(history);

    // Normalize existing history to ensure correct format
    history = history.map(msg => ({
      role: msg.role,
      parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.parts }]
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const response = await chat.sendMessage([{ text: prompt }]);
    console.log(response);
    
    if (!response || !response.response) {
      throw new Error("Invalid response from Gemini API");
    }

    const textResponse = response.response.text()?.trim();

    // Update chat history with the correct format
    const updatedHistory = [
      ...history,
      { 
        role: 'user', 
        parts: [{ text: prompt }]
      },
      { 
        role: 'model', 
        parts: [{ text: textResponse }]
      }
    ];
    console.log(updatedHistory);
    await redisClient.setChatHistory(userId, updatedHistory);

    return textResponse;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
};

// Clean up function to remove chat history
export const cleanupUserChat = async (userId: string) => {
  const key = `chat:${userId}`;
  await redisClient.del(key);
};