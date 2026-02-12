
import { GoogleGenAI, Type } from "@google/genai";
import { CurriculumData, FormInputs } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const generateCurriculum = async (
  inputs: FormInputs,
  feedback?: string,
  previousData?: CurriculumData
): Promise<CurriculumData> => {
  // Using the hardcoded key as an emergency fallback if env var fails, but preferring env var
  const apiKey = import.meta.env.VITE_API_KEY || "AIzaSyCsvKuz6CnxPtbEw04-l_ZoqPHReC_MWEA";
  const ai = new GoogleGenAI({ apiKey });

  let prompt = `Generate a comprehensive academic curriculum and intelligence report for:
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

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.NUMBER },
                topic: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["week", "topic", "content"]
            }
          },
          learningOutcomes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING },
                outcome: { type: Type.STRING }
              },
              required: ["level", "outcome"]
            }
          },
          assessmentMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
          toolsAndTech: { type: Type.ARRAY, items: { type: Type.STRING } },
          jobRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillMapping: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillGaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                area: { type: Type.STRING },
                gapDescription: { type: Type.STRING },
                mitigationStrategy: { type: Type.STRING }
              },
              required: ["area", "gapDescription", "mitigationStrategy"]
            }
          },
          capstoneProjects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                deliverables: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "description", "techStack", "deliverables"]
            }
          },
          intelligenceScores: {
            type: Type.OBJECT,
            properties: {
              academicDepth: { type: Type.NUMBER },
              industryRelevance: { type: Type.NUMBER },
              bloomsCoverage: { type: Type.NUMBER },
              practicalBalance: { type: Type.NUMBER },
              innovationScore: { type: Type.NUMBER }
            },
            required: ["academicDepth", "industryRelevance", "bloomsCoverage", "practicalBalance", "innovationScore"]
          }
        },
        required: ["description", "objectives", "modules", "learningOutcomes", "capstoneProjects", "intelligenceScores", "skillGaps", "jobRoles"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{}');
  return {
    ...parsed,
    ...inputs,
    durationWeeks: parseInt(inputs.durationWeeks),
    creditHours: parseInt(inputs.creditHours),
    timestamp: Date.now(),
    id: previousData?.id || crypto.randomUUID()
  };
};
