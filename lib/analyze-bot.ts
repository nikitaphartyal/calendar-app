import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function calculatePoints(expected: string, current: string): number {
  // Remove spaces and convert to lowercase for comparison
  expected = expected.toLowerCase().replace(/\s/g, '');
  current = current.toLowerCase().replace(/\s/g, '');

  // Basic complexity hierarchy
  const complexityRank = {
    'o(1)': 1,
    'o(logn)': 2,
    'o(n)': 3,
    'o(nlogn)': 4,
    'o(n^2)': 5,
    'o(n^3)': 6,
    'o(2^n)': 7,
    'o(n!)': 8
  };

  const expectedRank = complexityRank[expected] || 999;
  const currentRank = complexityRank[current] || 999;

  if (currentRank === expectedRank) return 100;
  if (currentRank === expectedRank + 1) return 70;
  return 40;
}

export async function analyzeCode(problem: string, userCode: string): Promise<any> {
  const prompt = `
  ${problem}
  Analyze the following code and provide its time complexity, best optimization strategies, 
  and any alternative efficient solutions for the above problem statement. Make sure you
  analyze the code line by line and check all possible errors and issues.
  
  Code:
  \n\n"""
  ${userCode}
  """
  Provide the analysis in the format that is specified in below sample output format. Dont send anything else in response, just the analysis in the above format. 
  Do not include any markdown syntax in response. Provide the output in JSON formatting without triple backticks and make sure you provide all the fields.
  Data should be in this format 
  {
    "analysis": {
      "timeAndSpaceComplexity": {
        "expectedTimeComplexity": "O(...)",
        "currentTimeComplexity": "O(...)",
        "spaceComplexity": "O(...)",
        "optimizations": [
          {
            "suggestion": "string",
            "affectedLines": [numbers]
          }
        ]
      },
      "edgeCases": {
        "missingCases": [
          {
            "type": "Negative Numbers",
            "description": "Your code does not handle negative numbers correctly.",
            "severity": "high",
            "exampleInput": "[-5, -3, -1]",
            "expectedOutput": "Sorted order of negatives",
            "actualOutput": "Runtime Error"
          },
          {
            "type": "Large Inputs",
            "description": "Code may exceed time limits for large inputs (n > 10^5).",
            "severity": "critical",
            "exampleInput": "[100000, 99999, 99998, 1]",
            "expectedOutput": "Sorted output in O(n log n)",
            "actualOutput": "TLE (Time Limit Exceeded)"
          }
        ]
      },
      "logicalErrors": {
        "issues": [
          {
            "type": "Off-by-One Error",
            "description": "Loop runs one extra time, leading to incorrect indexing.",
            "severity": "medium",
            "line": 18
          },
          {
            "type": "Wrong Base Condition",
            "description": "Recursive function does not properly return base case, causing infinite recursion.",
            "severity": "critical",
            "line": 30
          }
        ]
      },
      "algorithmChoice": {
        "currentApproach": "Bubble Sort",
        "betterApproach": "Merge Sort",
        "benefit": "Improves time complexity from O(n^2) to O(n log n)",
        "affectedLines": [5, 20]
      },
      "codeEfficiency": {
        "inefficientOperations": [
          {
            "description": "Using a nested loop for duplicate removal. Consider using a HashSet.",
            "severity": "high",
            "affectedLines": [12, 24],
            "alternative": "Use HashSet to reduce time complexity from O(n^2) to O(n)."
          },
          {
            "description": "Unnecessary recomputation of factorial in loop. Store results in an array for memoization.",
            "severity": "medium",
            "affectedLines": [8, 14],
            "alternative": "Use DP to store previously computed values and avoid redundant calculations."
          }
        ]
      },
      "debuggingHints": {
        "suggestions": [
          {
            "issue": "Infinite Loop Detected",
            "description": "Your while loop does not update the loop variable, leading to an infinite loop.",
            "line": 22,
            "fix": "Ensure the loop variable is modified inside the loop."
          },
          {
            "issue": "Incorrect Modulo Operation",
            "description": "Use (a % MOD + MOD) % MOD to handle negative numbers correctly in modular arithmetic.",
            "line": 35,
            "fix": "Update modulo operation to prevent negative results."
          }
        ]
      }
    }
  }
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const data = JSON.parse(response.text()?.trim());
  // Calculate points based on complexity comparison
  const points = calculatePoints(
    data.analysis.timeAndSpaceComplexity.expectedTimeComplexity,
    data.analysis.timeAndSpaceComplexity.currentTimeComplexity
  );
  return {
    ...data.analysis,
    points,
    expectedComplexity: data.analysis.timeAndSpaceComplexity.expectedTimeComplexity,
    currentComplexity: data.analysis.timeAndSpaceComplexity.currentTimeComplexity
  };
}