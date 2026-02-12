
export const ACADEMIC_LEVELS = ['UG', 'PG', 'Diploma', 'Certification', 'Professional', 'K-12 Extension'];
export const TEACHING_TYPES = ['Theory', 'Practical', 'Hybrid', 'Seminar-based', 'Lab-centric', 'Project-based'];
export const INDUSTRY_MODES = [
  { id: 'Startup', icon: 'fa-bolt', description: 'Fast-paced, high-risk, multi-disciplinary, practical results focus.' },
  { id: 'Corporate', icon: 'fa-building', description: 'Standardized, scalable, process-driven, certification-aligned.' },
  { id: 'Research', icon: 'fa-microscope', description: 'Theoretical depth, peer-review focused, rigorous experimentation.' }
];

export const COURSE_TITLES = [
  'Data Science & Machine Learning',
  'Full Stack Web Development',
  'Cloud Computing & DevOps',
  'Cybersecurity & Ethical Hacking',
  'Artificial Intelligence & Deep Learning',
  'Mobile App Development',
  'Blockchain & Cryptocurrency',
  'Internet of Things (IoT)',
  'Quantum Computing',
  'Digital Marketing & Analytics',
  'Product Management',
  'UI/UX Design',
  'Game Development',
  'Robotics & Automation',
  'Big Data & Analytics'
];

export const SUBJECT_AREAS = [
  'Computer Science & IT',
  'Engineering & Technology',
  'Business & Management',
  'Data Science & Analytics',
  'Design & Creative Arts',
  'Healthcare & Medicine',
  'Finance & Economics',
  'Marketing & Communications',
  'Mathematics & Statistics',
  'Physics & Applied Sciences',
  'Biotechnology & Life Sciences',
  'Environmental Science',
  'Education & Pedagogy',
  'Law & Legal Studies',
  'Social Sciences'
];

export const INDUSTRY_FOCUS_OPTIONS = [
  'Fintech & Banking',
  'Healthcare Technology',
  'E-commerce & Retail',
  'Automotive & Transportation',
  'Telecommunications',
  'Energy & Utilities',
  'Manufacturing & Industry 4.0',
  'Media & Entertainment',
  'Education Technology (EdTech)',
  'Agriculture Technology (AgriTech)',
  'Real Estate & PropTech',
  'Travel & Hospitality',
  'Gaming & Esports',
  'Cybersecurity',
  'Cloud Services & SaaS',
  'Artificial Intelligence & ML',
  'Blockchain & Web3',
  'Robotics & Automation',
  'Biotechnology & Pharmaceuticals',
  'Consulting & Professional Services'
];

export const SYSTEM_INSTRUCTION = `You are an elite Academic Intelligence Consultant and Curriculum Designer.
Your objective is to automate the creation of high-impact curricula that bridge the gap between education and current industry requirements.

MANDATORY RULES:
1. BLOOM'S TAXONOMY: Map exactly 6 distinct outcomes across Knowledge, Comprehension, Application, Analysis, Synthesis, and Evaluation.
2. INDUSTRY MODE: Strictly tailor modules based on the selected mode (Startup: rapid prototyping; Corporate: best practices/compliance; Research: foundational depth).
3. SKILL GAPS: Explicitly identify what traditional curricula lack in this subject and how YOUR version solves it.
4. JOB ROLES: List modern, high-paying roles relevant to the next 5 years.
5. CAPSTONES: Projects must be "Resume-Grade" with specific tech stacks.
6. FORMAT: Respond ONLY with a single valid JSON object following the provided schema. No conversational text.`;
