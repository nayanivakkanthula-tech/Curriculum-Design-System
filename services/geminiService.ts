
import { CurriculumData, FormInputs } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const generateCurriculum = async (
  inputs: FormInputs,
  feedback?: string,
  previousData?: CurriculumData
): Promise<CurriculumData> => {
  // Using the hardcoded key as an emergency fallback if env var fails, but preferring env var
  const apiKey = import.meta.env.VITE_API_KEY || "AIzaSyCsvKuz6CnxPtbEw04-l_ZoqPHReC_MWEA";

  if (!apiKey || apiKey === "AIzaSyCsvKuz6CnxPtbEw04-l_ZoqPHReC_MWEA") {
    console.warn("Using default/fallback API key. This may not work if the key is invalid or quota exceeded.");
  }

  // 1. Dynamic Model Discovery
  let selectedModel = "models/gemini-1.5-flash"; // Default fallback
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listResponse = await fetch(listUrl);
    if (listResponse.ok) {
      const listJson = await listResponse.json();
      const models = listJson.models || [];

      // Prefer flash models
      const flashModel = models.find((m: any) => m.name.includes("flash") && m.supportedGenerationMethods?.includes("generateContent"));
      if (flashModel) {
        selectedModel = flashModel.name;
      } else {
        // Fallback to any gemini model
        const geminiModel = models.find((m: any) => m.name.includes("gemini") && m.supportedGenerationMethods?.includes("generateContent"));
        if (geminiModel) selectedModel = geminiModel.name;
      }
      console.log("Selected Model for Generation:", selectedModel);
    }
  } catch (e) {
    console.warn("Failed to list models, using fallback:", selectedModel, e);
  }

  const prompt = `Generate a comprehensive academic curriculum and intelligence report for:
  Course Name: ${inputs.courseName}
  Subject Area: ${inputs.subjectArea}
  Academic Level: ${inputs.academicLevel}
  Duration: ${inputs.durationWeeks} weeks
  Credit Hours: ${inputs.creditHours}
  Industry Mode: ${inputs.mode}
  Industry Focus: ${inputs.industryFocus}
  Teaching Type: ${inputs.teachingType}

  ${feedback ? `\nUSER REFINEMENT REQUEST: "${feedback}"` : ''}
  ${previousData ? `\nBASED ON PREVIOUS DATA VERSION: ${previousData.id}` : ''}

  Please provide:
  1. Executive Summary & Objectives.
  2. Weekly Modules (Week, Topic, Deep-dive Content).
  3. Bloom's Taxonomy mapping: Generate 12-15 diverse learning outcomes spanning all levels.
  4. Assessment strategies & specific Industry Tools.
  5. 5 Detailed Capstone Projects with Tech Stacks.
  6. Intelligence Scores (0-100).
  7. Job Roles: List 5-7 modern roles this prepares for.
  8. Skill Gaps: Identify 3-4 potential skill gaps in traditional curricula that THIS curriculum fixes.
  9. Skill Mapping: Matrix of industry skills.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${apiKey}`;

  const schema = {
    type: "OBJECT",
    properties: {
      description: { type: "STRING" },
      objectives: { type: "ARRAY", items: { type: "STRING" } },
      modules: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            week: { type: "NUMBER" },
            topic: { type: "STRING" },
            content: { type: "STRING" }
          },
          required: ["week", "topic", "content"]
        }
      },
      learningOutcomes: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            level: { type: "STRING" },
            outcome: { type: "STRING" }
          },
          required: ["level", "outcome"]
        }
      },
      assessmentMethods: { type: "ARRAY", items: { type: "STRING" } },
      toolsAndTech: { type: "ARRAY", items: { type: "STRING" } },
      jobRoles: { type: "ARRAY", items: { type: "STRING" } },
      skillMapping: { type: "ARRAY", items: { type: "STRING" } },
      skillGaps: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            area: { type: "STRING" },
            gapDescription: { type: "STRING" },
            mitigationStrategy: { type: "STRING" }
          },
          required: ["area", "gapDescription", "mitigationStrategy"]
        }
      },
      capstoneProjects: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            description: { type: "STRING" },
            techStack: { type: "ARRAY", items: { type: "STRING" } },
            deliverables: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: ["title", "description", "techStack", "deliverables"]
        }
      },
      intelligenceScores: {
        type: "OBJECT",
        properties: {
          academicDepth: { type: "NUMBER" },
          industryRelevance: { type: "NUMBER" },
          bloomsCoverage: { type: "NUMBER" },
          practicalBalance: { type: "NUMBER" },
          innovationScore: { type: "NUMBER" }
        },
        required: ["academicDepth", "industryRelevance", "bloomsCoverage", "practicalBalance", "innovationScore"]
      }
    },
    required: ["description", "objectives", "modules", "learningOutcomes", "capstoneProjects", "intelligenceScores", "skillGaps", "jobRoles"]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          response_mime_type: "application/json",
          response_schema: schema,
          temperature: 0.7,
        },
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `API Error: ${response.status} ${response.statusText}`;
      console.error("Gemini API Error Detail:", errorData);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response text received from Gemini API.");
    }

    const parsed = JSON.parse(text);
    return {
      ...parsed,
      ...inputs,
      durationWeeks: parseInt(inputs.durationWeeks),
      creditHours: parseInt(inputs.creditHours),
      timestamp: Date.now(),
      id: previousData?.id || crypto.randomUUID()
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMessage = "Failed to generate curriculum.";

    if (error.message?.includes("404") || error.message?.includes("NOT_FOUND")) {
      errorMessage = `Model ${selectedModel} not found or API key invalid. Please check your API key.`;
    } else if (error.message?.includes("403")) {
      errorMessage = "Permission denied. Please check your API key quotas.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
