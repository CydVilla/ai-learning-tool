import { LearningTrack, DifficultyLevel, QuestionType } from '../types';

// Question Categories
export interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  track: LearningTrack;
  difficulty: DifficultyLevel;
  icon: string;
  color: string;
  tags: string[];
  prerequisites?: string[];
  estimatedTime: number; // in minutes
  xpReward: number;
  questionCount: number;
  isActive: boolean;
  order: number;
}

// HTML Categories
export const htmlCategories: QuestionCategory[] = [
  {
    id: 'html_basics',
    name: 'HTML Basics',
    description: 'Learn the fundamentals of HTML structure and elements',
    track: 'html',
    difficulty: 'beginner',
    icon: '🌐',
    color: '#ff6b6b',
    tags: ['structure', 'elements', 'tags', 'attributes'],
    estimatedTime: 30,
    xpReward: 100,
    questionCount: 5,
    isActive: true,
    order: 1
  },
  {
    id: 'html_forms',
    name: 'HTML Forms',
    description: 'Master form creation and input handling',
    track: 'html',
    difficulty: 'intermediate',
    icon: '📝',
    color: '#ff6b6b',
    tags: ['forms', 'inputs', 'validation', 'submission'],
    prerequisites: ['html_basics'],
    estimatedTime: 45,
    xpReward: 150,
    questionCount: 8,
    isActive: true,
    order: 2
  },
  {
    id: 'html_semantic',
    name: 'Semantic HTML',
    description: 'Learn semantic elements and accessibility',
    track: 'html',
    difficulty: 'intermediate',
    icon: '♿',
    color: '#ff6b6b',
    tags: ['semantic', 'accessibility', 'seo', 'structure'],
    prerequisites: ['html_basics'],
    estimatedTime: 40,
    xpReward: 140,
    questionCount: 7,
    isActive: true,
    order: 3
  },
  {
    id: 'html_media',
    name: 'HTML Media',
    description: 'Working with images, audio, and video elements',
    track: 'html',
    difficulty: 'advanced',
    icon: '🎥',
    color: '#ff6b6b',
    tags: ['images', 'audio', 'video', 'media'],
    prerequisites: ['html_basics', 'html_semantic'],
    estimatedTime: 35,
    xpReward: 120,
    questionCount: 6,
    isActive: true,
    order: 4
  },
  {
    id: 'html_advanced',
    name: 'Advanced HTML',
    description: 'Advanced HTML features and best practices',
    track: 'html',
    difficulty: 'advanced',
    icon: '⚡',
    color: '#ff6b6b',
    tags: ['advanced', 'performance', 'best-practices', 'optimization'],
    prerequisites: ['html_forms', 'html_semantic', 'html_media'],
    estimatedTime: 50,
    xpReward: 200,
    questionCount: 10,
    isActive: true,
    order: 5
  }
];

// CSS Categories
export const cssCategories: QuestionCategory[] = [
  {
    id: 'css_basics',
    name: 'CSS Basics',
    description: 'Learn CSS fundamentals and basic styling',
    track: 'css',
    difficulty: 'beginner',
    icon: '🎨',
    color: '#4ecdc4',
    tags: ['selectors', 'properties', 'values', 'styling'],
    estimatedTime: 35,
    xpReward: 120,
    questionCount: 6,
    isActive: true,
    order: 1
  },
  {
    id: 'css_layout',
    name: 'CSS Layout',
    description: 'Master CSS layout techniques and positioning',
    track: 'css',
    difficulty: 'intermediate',
    icon: '📐',
    color: '#4ecdc4',
    tags: ['layout', 'positioning', 'display', 'float'],
    prerequisites: ['css_basics'],
    estimatedTime: 50,
    xpReward: 180,
    questionCount: 9,
    isActive: true,
    order: 2
  },
  {
    id: 'css_flexbox',
    name: 'Flexbox',
    description: 'Learn CSS Flexbox for modern layouts',
    track: 'css',
    difficulty: 'intermediate',
    icon: '🔧',
    color: '#4ecdc4',
    tags: ['flexbox', 'flex', 'alignment', 'distribution'],
    prerequisites: ['css_basics'],
    estimatedTime: 45,
    xpReward: 160,
    questionCount: 8,
    isActive: true,
    order: 3
  },
  {
    id: 'css_grid',
    name: 'CSS Grid',
    description: 'Master CSS Grid for complex layouts',
    track: 'css',
    difficulty: 'advanced',
    icon: '🔲',
    color: '#4ecdc4',
    tags: ['grid', 'layout', 'templates', 'areas'],
    prerequisites: ['css_flexbox'],
    estimatedTime: 55,
    xpReward: 200,
    questionCount: 10,
    isActive: true,
    order: 4
  },
  {
    id: 'css_responsive',
    name: 'Responsive Design',
    description: 'Create responsive designs with media queries',
    track: 'css',
    difficulty: 'advanced',
    icon: '📱',
    color: '#4ecdc4',
    tags: ['responsive', 'media-queries', 'mobile', 'breakpoints'],
    prerequisites: ['css_flexbox', 'css_grid'],
    estimatedTime: 40,
    xpReward: 170,
    questionCount: 7,
    isActive: true,
    order: 5
  },
  {
    id: 'css_animations',
    name: 'CSS Animations',
    description: 'Create animations and transitions',
    track: 'css',
    difficulty: 'advanced',
    icon: '✨',
    color: '#4ecdc4',
    tags: ['animations', 'transitions', 'keyframes', 'effects'],
    prerequisites: ['css_basics'],
    estimatedTime: 35,
    xpReward: 150,
    questionCount: 6,
    isActive: true,
    order: 6
  }
];

// JavaScript Categories
export const javascriptCategories: QuestionCategory[] = [
  {
    id: 'js_basics',
    name: 'JavaScript Basics',
    description: 'Learn JavaScript fundamentals and syntax',
    track: 'javascript',
    difficulty: 'beginner',
    icon: '💻',
    color: '#45b7d1',
    tags: ['variables', 'functions', 'syntax', 'basics'],
    estimatedTime: 40,
    xpReward: 140,
    questionCount: 7,
    isActive: true,
    order: 1
  },
  {
    id: 'js_arrays',
    name: 'Arrays & Objects',
    description: 'Working with arrays and objects in JavaScript',
    track: 'javascript',
    difficulty: 'beginner',
    icon: '📊',
    color: '#45b7d1',
    tags: ['arrays', 'objects', 'methods', 'manipulation'],
    prerequisites: ['js_basics'],
    estimatedTime: 45,
    xpReward: 160,
    questionCount: 8,
    isActive: true,
    order: 2
  },
  {
    id: 'js_functions',
    name: 'Functions & Scope',
    description: 'Master functions, closures, and scope in JavaScript',
    track: 'javascript',
    difficulty: 'intermediate',
    icon: '🔧',
    color: '#45b7d1',
    tags: ['functions', 'closures', 'scope', 'hoisting'],
    prerequisites: ['js_basics'],
    estimatedTime: 50,
    xpReward: 180,
    questionCount: 9,
    isActive: true,
    order: 3
  },
  {
    id: 'js_dom',
    name: 'DOM Manipulation',
    description: 'Interact with the Document Object Model',
    track: 'javascript',
    difficulty: 'intermediate',
    icon: '🌳',
    color: '#45b7d1',
    tags: ['dom', 'elements', 'events', 'manipulation'],
    prerequisites: ['js_arrays'],
    estimatedTime: 55,
    xpReward: 200,
    questionCount: 10,
    isActive: true,
    order: 4
  },
  {
    id: 'js_async',
    name: 'Asynchronous JavaScript',
    description: 'Learn promises, async/await, and asynchronous programming',
    track: 'javascript',
    difficulty: 'advanced',
    icon: '⏰',
    color: '#45b7d1',
    tags: ['promises', 'async', 'await', 'callbacks'],
    prerequisites: ['js_functions'],
    estimatedTime: 60,
    xpReward: 220,
    questionCount: 12,
    isActive: true,
    order: 5
  },
  {
    id: 'js_es6',
    name: 'ES6+ Features',
    description: 'Modern JavaScript features and syntax',
    track: 'javascript',
    difficulty: 'advanced',
    icon: '🚀',
    color: '#45b7d1',
    tags: ['es6', 'modules', 'destructuring', 'arrow-functions'],
    prerequisites: ['js_async'],
    estimatedTime: 50,
    xpReward: 200,
    questionCount: 10,
    isActive: true,
    order: 6
  },
  {
    id: 'js_algorithms',
    name: 'Algorithms & Data Structures',
    description: 'Problem-solving with JavaScript algorithms',
    track: 'javascript',
    difficulty: 'advanced',
    icon: '🧮',
    color: '#45b7d1',
    tags: ['algorithms', 'data-structures', 'problem-solving', 'optimization'],
    prerequisites: ['js_es6'],
    estimatedTime: 70,
    xpReward: 250,
    questionCount: 15,
    isActive: true,
    order: 7
  }
];

// Combined categories
export const allCategories: QuestionCategory[] = [
  ...htmlCategories,
  ...cssCategories,
  ...javascriptCategories
];

// Categories by track
export const categoriesByTrack: { [key in LearningTrack]: QuestionCategory[] } = {
  html: htmlCategories,
  css: cssCategories,
  javascript: javascriptCategories
};

// Categories by difficulty
export const categoriesByDifficulty: { [key in DifficultyLevel]: QuestionCategory[] } = {
  beginner: allCategories.filter(c => c.difficulty === 'beginner'),
  intermediate: allCategories.filter(c => c.difficulty === 'intermediate'),
  advanced: allCategories.filter(c => c.difficulty === 'advanced')
};

// Difficulty Level Configuration
export interface DifficultyConfig {
  level: DifficultyLevel;
  name: string;
  description: string;
  color: string;
  icon: string;
  minXP: number;
  maxXP: number;
  questionCount: number;
  timeLimit: number; // in minutes
  hintsAllowed: number;
  attemptsAllowed: number;
  passingScore: number; // percentage
}

export const difficultyConfigs: { [key in DifficultyLevel]: DifficultyConfig } = {
  beginner: {
    level: 'beginner',
    name: 'Beginner',
    description: 'Perfect for those new to programming',
    color: '#4caf50',
    icon: '🌱',
    minXP: 0,
    maxXP: 100,
    questionCount: 5,
    timeLimit: 30,
    hintsAllowed: 3,
    attemptsAllowed: 3,
    passingScore: 60
  },
  intermediate: {
    level: 'intermediate',
    name: 'Intermediate',
    description: 'For those with some programming experience',
    color: '#ff9800',
    icon: '🌿',
    minXP: 100,
    maxXP: 300,
    questionCount: 8,
    timeLimit: 45,
    hintsAllowed: 2,
    attemptsAllowed: 2,
    passingScore: 70
  },
  advanced: {
    level: 'advanced',
    name: 'Advanced',
    description: 'Challenging content for experienced developers',
    color: '#f44336',
    icon: '🌳',
    minXP: 300,
    maxXP: 1000,
    questionCount: 12,
    timeLimit: 60,
    hintsAllowed: 1,
    attemptsAllowed: 1,
    passingScore: 80
  }
};

// Question Type Configuration
export interface QuestionTypeConfig {
  type: QuestionType;
  name: string;
  description: string;
  icon: string;
  color: string;
  baseXP: number;
  timeLimit: number; // in seconds
  hintsAllowed: number;
  attemptsAllowed: number;
}

export const questionTypeConfigs: { [key in QuestionType]: QuestionTypeConfig } = {
  'multiple-choice': {
    type: 'multiple-choice',
    name: 'Multiple Choice',
    description: 'Choose the correct answer from multiple options',
    icon: '📝',
    color: '#2196f3',
    baseXP: 10,
    timeLimit: 60,
    hintsAllowed: 2,
    attemptsAllowed: 2
  },
  'fill-in-the-blank': {
    type: 'fill-in-the-blank',
    name: 'Fill in the Blank',
    description: 'Complete the missing parts of code or text',
    icon: '✏️',
    color: '#ff9800',
    baseXP: 15,
    timeLimit: 90,
    hintsAllowed: 2,
    attemptsAllowed: 2
  },
  'code-exercise': {
    type: 'code-exercise',
    name: 'Code Exercise',
    description: 'Write code to solve a programming problem',
    icon: '💻',
    color: '#9c27b0',
    baseXP: 25,
    timeLimit: 300,
    hintsAllowed: 3,
    attemptsAllowed: 3
  }
};

// Utility functions
export const getCategoryById = (id: string): QuestionCategory | undefined => {
  return allCategories.find(c => c.id === id);
};

export const getCategoriesByTrack = (track: LearningTrack): QuestionCategory[] => {
  return categoriesByTrack[track];
};

export const getCategoriesByDifficulty = (difficulty: DifficultyLevel): QuestionCategory[] => {
  return categoriesByDifficulty[difficulty];
};

export const getCategoriesByTrackAndDifficulty = (
  track: LearningTrack,
  difficulty: DifficultyLevel
): QuestionCategory[] => {
  return categoriesByTrack[track].filter(c => c.difficulty === difficulty);
};

export const getActiveCategories = (): QuestionCategory[] => {
  return allCategories.filter(c => c.isActive);
};

export const getActiveCategoriesByTrack = (track: LearningTrack): QuestionCategory[] => {
  return categoriesByTrack[track].filter(c => c.isActive);
};

export const getDifficultyConfig = (difficulty: DifficultyLevel): DifficultyConfig => {
  return difficultyConfigs[difficulty];
};

export const getQuestionTypeConfig = (type: QuestionType): QuestionTypeConfig => {
  return questionTypeConfigs[type];
};

export const getNextCategory = (currentCategoryId: string): QuestionCategory | null => {
  const currentCategory = getCategoryById(currentCategoryId);
  if (!currentCategory) return null;

  const trackCategories = getActiveCategoriesByTrack(currentCategory.track);
  const currentIndex = trackCategories.findIndex(c => c.id === currentCategoryId);
  
  if (currentIndex < trackCategories.length - 1) {
    return trackCategories[currentIndex + 1];
  }
  
  return null;
};

export const getPreviousCategory = (currentCategoryId: string): QuestionCategory | null => {
  const currentCategory = getCategoryById(currentCategoryId);
  if (!currentCategory) return null;

  const trackCategories = getActiveCategoriesByTrack(currentCategory.track);
  const currentIndex = trackCategories.findIndex(c => c.id === currentCategoryId);
  
  if (currentIndex > 0) {
    return trackCategories[currentIndex - 1];
  }
  
  return null;
};

export const getCategoryProgress = (categoryId: string, userProgress: any): {
  completed: number;
  total: number;
  percentage: number;
  xpEarned: number;
  xpTotal: number;
} => {
  const category = getCategoryById(categoryId);
  if (!category) {
    return { completed: 0, total: 0, percentage: 0, xpEarned: 0, xpTotal: 0 };
  }

  // This would be calculated based on actual user progress
  const completed = 0; // Placeholder
  const total = category.questionCount;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const xpEarned = 0; // Placeholder
  const xpTotal = category.xpReward;

  return {
    completed,
    total,
    percentage,
    xpEarned,
    xpTotal
  };
};

export const getTrackProgress = (track: LearningTrack, userProgress: any): {
  categoriesCompleted: number;
  totalCategories: number;
  percentage: number;
  xpEarned: number;
  xpTotal: number;
} => {
  const trackCategories = getActiveCategoriesByTrack(track);
  const categoriesCompleted = 0; // Placeholder
  const totalCategories = trackCategories.length;
  const percentage = totalCategories > 0 ? (categoriesCompleted / totalCategories) * 100 : 0;
  const xpEarned = 0; // Placeholder
  const xpTotal = trackCategories.reduce((sum, cat) => sum + cat.xpReward, 0);

  return {
    categoriesCompleted,
    totalCategories,
    percentage,
    xpEarned,
    xpTotal
  };
};

export const getRecommendedCategory = (
  track: LearningTrack,
  userProgress: any
): QuestionCategory | null => {
  const trackCategories = getActiveCategoriesByTrack(track);
  
  // Find the first incomplete category
  for (const category of trackCategories) {
    const progress = getCategoryProgress(category.id, userProgress);
    if (progress.percentage < 100) {
      return category;
    }
  }
  
  return null;
};

export const getCategoryStats = (): {
  totalCategories: number;
  categoriesByTrack: { [key in LearningTrack]: number };
  categoriesByDifficulty: { [key in DifficultyLevel]: number };
  totalXP: number;
  totalQuestions: number;
} => {
  const totalCategories = allCategories.length;
  const categoriesByTrack = {
    html: htmlCategories.length,
    css: cssCategories.length,
    javascript: javascriptCategories.length
  };
  const categoriesByDifficultyCount = {
    beginner: categoriesByDifficulty.beginner.length,
    intermediate: categoriesByDifficulty.intermediate.length,
    advanced: categoriesByDifficulty.advanced.length
  };
  const totalXP = allCategories.reduce((sum, cat) => sum + cat.xpReward, 0);
  const totalQuestions = allCategories.reduce((sum, cat) => sum + cat.questionCount, 0);

  return {
    totalCategories,
    categoriesByTrack,
    categoriesByDifficulty: categoriesByDifficultyCount,
    totalXP,
    totalQuestions
  };
};
