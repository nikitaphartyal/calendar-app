import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate subtopics
export const generateSubtopics = async (main: string): Promise<string[]> => {
  try {
    const prompt = `Generate 15 subtopics in sequential order that cover all knowledge about the topic '${main}', ensuring a complete understanding. 

    **Response Format (Strict JSON, No Markdown, No Extra Text):**
    {
      "subtopics": [
        "Subtopic 1",
        "Subtopic 2",
        "Subtopic 3",
        ...
        "Subtopic 15"
      ]
    }`;

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);

    // Ensure response is valid
    if (!response || !response.response) {
      throw new Error("Invalid response from Gemini API");
    }

    let textResponse = response.response.text().trim();

    console.log("Raw Response Text:", textResponse);

    // Extract JSON from response
    const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      textResponse = jsonMatch[1].trim(); // Extract JSON content
    }

    // Parse the JSON response
    const jsonResponse = JSON.parse(textResponse);

    console.log("\nParsed JSON Object:", jsonResponse);

    if (!jsonResponse.subtopics || !Array.isArray(jsonResponse.subtopics)) {
      throw new Error("Invalid JSON format: Missing 'subtopics' array");
    }

    return jsonResponse.subtopics;
  } catch (error) {
    console.error("Error generating subtopics:", error);
    throw new Error("Failed to generate subtopics. Please try again.");
  }
};
