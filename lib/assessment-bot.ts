import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateMegaQuestionsPrompt(content: string): Promise<string> {
  const prompt = `You are an AI assistant tasked with creating a set of mega long questions for content: "${content}". 
  Please generate questions based on the following criteria and format:
  1. Key Concepts: Important concepts that this content covers in detail.
  2. Hints: Provide clues or hints for each question.
  3. Correct Answers: Include correct answers for each question in detail (100 words).
  4. Common Mistakes: List common mistakes students might make in detail (100 words).
  5. The JSON format should be as follows:
  {
    "megaAssessment": [
      {
        "question": "What is the time complexity of an algorithm that performs a binary search on a sorted array?",
        "keyConcepts": ["Binary Search", "Time Complexity", "Logarithmic Time"],
        "hints": ["Remember the logarithmic nature of the operation."],
        "correctAnswers": ["O(log n)"],
        "commonMistakes": ["Confusing with O(n log n)"],
        "completed": true
      }
    ]
  }`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}
