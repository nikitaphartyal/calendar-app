import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  completed: boolean;
}

interface WrongAnswer {
  question: QuizQuestion;
  selectedOption: string;
}

export const generateAISummaries = async (wrongAnswers: WrongAnswer[]) => {
    console.log("HALLLOO" , process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Generate summaries for each wrong answer
    const summaryPromises = wrongAnswers.map(async (wrongAnswer) => {
      const prompt = `
        You are an educational AI assistant. A student answered a question incorrectly.
        
        Question: "${wrongAnswer.question.question}"
        
        Available options: ${wrongAnswer.question.options.join(", ")}
        
        Correct answer: "${wrongAnswer.question.correct_answer}"
        
        Student's answer: "${wrongAnswer.selectedOption}"
        
        Please provide a concise, helpful explanation (2-3 sentences) of why the correct answer is right and why the student's answer is wrong. Focus on the key concepts that would help the student understand this topic better.
      `;
      
      const response = await model.generateContent(prompt);
      
      if (!response || !response.response) {
        return "The AI couldn't generate a summary for this question. Please review the topic material.";
      }
      
      return response.response.text()?.trim() || "No summary available.";
    });
    
    // Wait for all summaries to be generated
    const summaries = await Promise.all(summaryPromises);
    console.log(summaries)
    return summaries;
  } catch (error) {
    console.error("Error generating AI summaries:", error);
    return wrongAnswers.map(() => "Failed to generate AI summary. Please review the topic material.");
  }
};