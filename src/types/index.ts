// Learning Track Types
export type LearningTrack = 'html' | 'css' | 'javascript';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type QuestionType = 'multiple-choice' | 'code-exercise' | 'fill-in-the-blank';

// Question and Exercise Types
export interface Question {
  id: string;
  track: LearningTrack;
  type: QuestionType;
  difficulty: DifficultyLevel;
  title: string;
  content: string;
  options?: string[]; // For multiple choice questions
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  timeLimit?: number; // in seconds
  tags: string[];
}

export interface CodeExercise extends Question {
  type: 'code-exercise';
  starterCode: string;
  expectedOutput?: string;
  testCases?: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

// User Progress Types
export interface TrackProgress {
  track: LearningTrack;
  currentLevel: number;
  totalXP: number;
  completedQuestions: string[];
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  accuracy: number; // percentage
  timeSpent: number; // in minutes
}

export interface UserProgress {
  userId: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number; // XP goal per day
  lastActivityDate: string;
  tracks: {
    html: TrackProgress;
    css: TrackProgress;
    javascript: TrackProgress;
  };
  achievements: Achievement[];
  statistics: UserStatistics;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'streak' | 'xp' | 'accuracy' | 'completion' | 'special';
}

export interface UserStatistics {
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  averageAccuracy: number;
  totalTimeSpent: number; // in minutes
  favoriteTrack: LearningTrack;
  questionsPerDay: number;
  averageSessionLength: number; // in minutes
}

// Session and Activity Types
export interface LearningSession {
  id: string;
  userId: string;
  track: LearningTrack;
  startTime: string;
  endTime?: string;
  questionsAnswered: number;
  correctAnswers: number;
  xpEarned: number;
  streakMaintained: boolean;
}

export interface QuestionAttempt {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  timestamp: string;
  aiFeedback?: string;
}

// AI Feedback Types
export interface AIFeedback {
  isCorrect: boolean;
  score: number; // 0-100
  feedback: string;
  suggestions: string[];
  explanation: string;
  codeReview?: CodeReview;
}

export interface CodeReview {
  syntaxErrors: string[];
  logicIssues: string[];
  improvements: string[];
  bestPractices: string[];
  overallRating: number; // 1-5
}

// Settings and Preferences
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    dailyReminder: boolean;
    streakReminder: boolean;
    achievementUnlocked: boolean;
  };
  difficulty: DifficultyLevel;
  dailyGoal: number;
  sessionLength: number; // in minutes
  language: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Context Types
export interface UserProgressContextType {
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateProgress: (track: LearningTrack, questionId: string, isCorrect: boolean, timeSpent: number) => void;
  completeQuestion: (questionId: string, attempt: QuestionAttempt) => void;
  startSession: (track: LearningTrack) => string;
  endSession: (sessionId: string) => void;
  updateStreak: () => void;
  resetProgress: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Getters
  getTrackProgress: (track: LearningTrack) => TrackProgress | null;
  getCurrentStreak: () => number;
  getTotalXP: () => number;
  getDailyProgress: () => number;
  isDailyGoalMet: () => boolean;
}
