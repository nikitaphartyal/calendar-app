import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuiz = async (topic:string) => {
  try {
    const prompt = `You are an AI assistant tasked with creating multiple quiz entries on topic: ${topic}. Please generate 10 quiz entries in json format with the following criteria, Dont send anything else in response:
    1. 4 tough questions
    2. 2 medium questions
    3. 4 easy questions
    
    For each quiz entry, provide the following fields:
    1. Question: A well-formed question appropriate for the difficulty level.
    2. Options: A JSON array of possible answers, including both correct and incorrect options.
    3. Correct Answer: The correct answer that corresponds to one of the options.
    7. Completed: A boolean indicating whether the quiz is completed.
    8. Send me only what I asked for
    9. data should be in this format {
      "quizcontent": [
        {
          "options": [
            "op1",
            "op2",
            "op3",
            "op4"
          ],
          "question": "What is the time complexity of an algorithm that performs a binary search on a sorted array?",
          "completed": true,
          "correct_answer": "O(log n)"
        },
      ]
    }`;

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);

    // Ensure response is valid
    if (!response || !response.response) {
      throw new Error("Invalid response from Gemini API");
    }

    const textResponse = response.response.text()?.trim();
    return textResponse
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
};