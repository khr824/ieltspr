export type Section = 'writing1' | 'writing2' | 'reading' | 'speaking';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  passage?: string;
  questions?: Question[];
  wordLimit?: number;
  type: Section;
}

export interface Question {
  id: string;
  text: string;
  answer: string; // For reading
}

export interface Feedback {
  score: number;
  suggestions: string[];
  wordCount?: number;
}
