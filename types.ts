
export type IndustryMode = 'Startup' | 'Corporate' | 'Research';

export interface Module {
  week: number;
  topic: string;
  content: string;
}

export interface LearningOutcome {
  level: 'Knowledge' | 'Comprehension' | 'Application' | 'Analysis' | 'Synthesis' | 'Evaluation';
  outcome: string;
}

export interface IntelligenceScores {
  academicDepth: number;
  industryRelevance: number;
  bloomsCoverage: number;
  practicalBalance: number;
  innovationScore: number;
}

export interface CapstoneProject {
  title: string;
  description: string;
  techStack: string[];
  deliverables: string[];
}

export interface SkillGap {
  area: string;
  gapDescription: string;
  mitigationStrategy: string;
}

export interface CurriculumData {
  id?: string;
  timestamp?: number;
  courseName: string;
  subjectArea: string;
  academicLevel: string;
  durationWeeks: number;
  creditHours: number;
  industryFocus: string;
  teachingType: string;
  mode: IndustryMode;
  description: string;
  objectives: string[];
  modules: Module[];
  learningOutcomes: LearningOutcome[];
  assessmentMethods: string[];
  toolsAndTech: string[];
  jobRoles: string[];
  skillMapping: string[];
  skillGaps: SkillGap[];
  intelligenceScores: IntelligenceScores;
  capstoneProjects: CapstoneProject[];
}

export interface FormInputs {
  courseName: string;
  subjectArea: string;
  academicLevel: string;
  durationWeeks: string;
  creditHours: string;
  industryFocus: string;
  teachingType: string;
  mode: IndustryMode;
}
