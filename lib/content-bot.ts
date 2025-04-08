import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateContent = async (subtopicTitle: string) => {
  try {
    const prompt = `You are an expert on ${subtopicTitle}. Your job is to teach the given sub-topic: ${subtopicTitle} in extreme detail.
    1. Use an explanation that is elaborate and detailed but easy to understand.
    2. Use examples to explain the concept.
    3. If it is related to code, then include a code snippet to explain the concept.
    4. Start with an introduction paragraph, then go ahead with the explanation and end with a conclusion paragraph.`;

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);

    // Ensure response is valid
    if (!response || !response.response) {
      throw new Error("Invalid response from Gemini API");
    }

    let textResponse = response.response.text()?.trim();
    return textResponse
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
};