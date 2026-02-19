export enum QuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  PRIVACY_CONTACT = 'PRIVACY_CONTACT'
}

export interface Option {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  placeholder?: string;
  options?: Option[]; // For select, radio, checkbox
  required?: boolean;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface SurveyData {
  [key: string]: string | string[] | number;
}

export interface AIAnalysisResult {
  clarityScore: number;
  suggestions: string[];
  tone: string;
  missingInfo: string[];
}
