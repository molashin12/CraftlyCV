// Core TypeScript definitions for CraftlyCV
// Following the strict data model rules from project guidelines

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// USER PROFILE TYPES
// ============================================================================

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: {
    city: string;
    country: string;
  };
  linkedinUrl: string;
  portfolioUrl: string;
}

export interface Summary {
  headline: string;
  description: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string; // YYYY-MM format
  endDate?: string; // YYYY-MM format, undefined for current
  description: string;
  achievements: string[];
  technologies?: string[];
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string; // YYYY-MM format
  endDate?: string; // YYYY-MM format
  gpa?: number;
  achievements?: string[];
  location?: string;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
}

export interface Language {
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface Skills {
  technical: Skill[];
  soft: Skill[];
  languages: Language[];
}

export interface UserProfileMetadata {
  completionPercentage: number;
  lastUpdated: Timestamp;
  version: number;
}

export interface UserProfile {
  id: string;
  personalInfo: PersonalInfo;
  summary: Summary;
  experience: WorkExperience[];
  education: Education[];
  skills: Skills;
  metadata: UserProfileMetadata;
}

// ============================================================================
// APPLICATION TYPES
// ============================================================================

export interface JobInfo {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location?: string;
  salary?: string;
  jobUrl?: string;
}

export interface GeneratedResume {
  content: string;
  templateId: string;
  generatedAt: Timestamp;
}

export interface GeneratedCoverLetter {
  content: string;
  tone: 'Professional' | 'Friendly' | 'Enthusiastic' | 'Formal';
  generatedAt: Timestamp;
}

export interface GeneratedContent {
  resume: GeneratedResume;
  coverLetter: GeneratedCoverLetter;
}

export interface SkillsMatch {
  matched: string[];
  missing: string[];
  score: number; // 0-100
}

export interface Improvement {
  category: 'Skills' | 'Experience' | 'Education' | 'Keywords' | 'Format';
  suggestion: string;
  impact: 'Low' | 'Medium' | 'High';
}

export interface MatchAnalysis {
  overallScore: number; // 0-100
  skillsMatch: SkillsMatch;
  improvements: Improvement[];
  keywordDensity?: number;
  atsCompatibility?: number;
}

export type ApplicationStatus = 
  | 'draft'
  | 'generated'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface ApplicationMetadata {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  viewCount?: number;
  downloadCount?: number;
}

export interface Application {
  id: string;
  userId: string;
  jobInfo: JobInfo;
  generatedContent: GeneratedContent;
  matchAnalysis: MatchAnalysis;
  status: ApplicationStatus;
  metadata: ApplicationMetadata;
  notes?: string;
}

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Modern' | 'Classic' | 'Creative' | 'ATS-Optimized';
  previewUrl: string;
  isActive: boolean;
  createdAt: Timestamp;
}

// ============================================================================
// AI SERVICE TYPES
// ============================================================================

export interface AIGenerationRequest {
  userProfile: UserProfile;
  jobInfo: JobInfo;
  templateId?: string;
  customInstructions?: string;
}

export interface AIGenerationResponse {
  content: string;
  tokensUsed: number;
  generationTime: number;
  model: string;
}

export type AIModel = 'gemini-pro';

export interface AIServiceConfig {
  model: AIModel;
  maxTokens: number;
  temperature: number;
  apiKey: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: 
    | 'user_signup'
    | 'profile_completed'
    | 'resume_generated'
    | 'cover_letter_generated'
    | 'pdf_downloaded'
    | 'application_created'
    | 'job_applied';
  metadata: Record<string, any>;
  timestamp: Timestamp;
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

// ============================================================================
// FIREBASE TYPES
// ============================================================================

export interface FirestoreDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collection names as const assertion for type safety
export const COLLECTIONS = {
  users: 'users',
  applications: 'applications',
  templates: 'templates',
  analytics: 'analytics'
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// ENVIRONMENT TYPES
// ============================================================================

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'staging' | 'production';
  GEMINI_API_KEY: string;
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL: string;
  AI_RATE_LIMIT_PER_MINUTE: number;
  AI_RATE_LIMIT_PER_HOUR: number;
}