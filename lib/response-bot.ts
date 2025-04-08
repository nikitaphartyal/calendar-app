import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateRoadmap(
  syllabus,
  learningObj,
  refResources,
  prerequisites,
  duration,
  difficulty
) {
  const prompt = `Generate a roadmap to learn the given subject, based on the information given below. The response should be structured into a JSON format with two keys: 'title' and 'data'. The 'title' key should have a value in the format "Duration - Course Title - Difficulty Level". The 'data' key should contain a JSON object where the key is the name of the main topic and the value is a single string of subtopics under that main topic. Do not use any punctuation or markdown. The roadmap should be in the correct order and generate a minimum of 12 key-value pairs for data.For a Diffiulty of the below level.
  
  Syllabus: ${syllabus || "N/A"}
  Learning Objectives: ${learningObj || "N/A"}
  Reference Resources: ${refResources || "N/A"}
  Prerequisites: ${prerequisites || "N/A"}
  Difficulty: ${difficulty || "N/A"}
  Duration: ${duration || "N/A"}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);
    let textResponse = response.response.text().trim();

    console.log("Raw Response Text:", textResponse); 

    // Extract JSON from Markdown
    const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      textResponse = jsonMatch[1].trim(); // Extract JSON content
    }

    // Parse the extracted JSON
    const jsonResponse = JSON.parse(textResponse);

    console.log("\nParsed JSON Object:");
    console.dir(jsonResponse);  

    console.log("\nAccessing Data:");
    console.log("Title:", jsonResponse.title);
    
    if (jsonResponse.data && Object.keys(jsonResponse.data).length > 0) { 
        const firstDay = Object.keys(jsonResponse.data)[0];
        console.log(`First Day Topics (${firstDay}):`, jsonResponse.data[firstDay]);

        console.log("\nIterating through Data:");
        for (const [day, topics] of Object.entries(jsonResponse.data)) {
            console.log(`${day}: ${topics}`);
        }
    } else {
        console.log("No 'data' field found in the response or it's empty.");
    }

    return jsonResponse;

  } catch (error) {
    console.error("Error generating roadmap:", error); 
    if (error instanceof Error) { 
      console.error("Error message:", error.message); 
    }
    throw new Error("Unable to generate roadmap. Please try again."); 
  }
}
