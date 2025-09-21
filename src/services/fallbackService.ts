import { Question, CodeExercise, LearningTrack, DifficultyLevel, QuestionType } from '../types';

export interface FallbackResponse {
  success: boolean;
  data: any;
  source: 'fallback' | 'cache' | 'api';
  timestamp: string;
  message?: string;
}

export interface OfflineQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: DifficultyLevel;
  track: LearningTrack;
  xp: number;
  type: QuestionType;
}

export interface OfflineCodeExercise {
  id: string;
  description: string;
  starterCode: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  explanation: string;
  difficulty: DifficultyLevel;
  track: LearningTrack;
  xp: number;
  type: QuestionType;
}

class FallbackService {
  private offlineQuestions: { [key: string]: OfflineQuestion[] } = {};
  private offlineCodeExercises: { [key: string]: OfflineCodeExercise[] } = {};
  private fallbackResponses: { [key: string]: any } = {};

  constructor() {
    this.initializeOfflineContent();
  }

  /**
   * Initialize offline content
   */
  private initializeOfflineContent(): void {
    // HTML Questions
    this.offlineQuestions.html = [
      {
        id: 'html_001',
        question: 'What does HTML stand for?',
        options: [
          'HyperText Markup Language',
          'High-level Text Markup Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language'
        ],
        correctAnswer: 'HyperText Markup Language',
        explanation: 'HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.',
        difficulty: 'beginner',
        track: 'html',
        xp: 10,
        type: 'multiple-choice'
      },
      {
        id: 'html_002',
        question: 'Which HTML tag is used to create a hyperlink?',
        options: ['<link>', '<a>', '<href>', '<url>'],
        correctAnswer: '<a>',
        explanation: 'The <a> tag is used to create hyperlinks in HTML. It requires an href attribute to specify the destination URL.',
        difficulty: 'beginner',
        track: 'html',
        xp: 10,
        type: 'multiple-choice'
      },
      {
        id: 'html_003',
        question: 'What is the correct HTML structure for a basic webpage?',
        options: [
          '<html><head><body></body></head></html>',
          '<html><body><head></head></body></html>',
          '<html><head></head><body></body></html>',
          '<head><html><body></body></html></head>'
        ],
        correctAnswer: '<html><head></head><body></body></html>',
        explanation: 'The correct HTML structure has the <html> tag as the root, containing <head> and <body> elements in that order.',
        difficulty: 'beginner',
        track: 'html',
        xp: 15,
        type: 'multiple-choice'
      }
    ];

    // CSS Questions
    this.offlineQuestions.css = [
      {
        id: 'css_001',
        question: 'What does CSS stand for?',
        options: [
          'Cascading Style Sheets',
          'Computer Style Sheets',
          'Creative Style Sheets',
          'Colorful Style Sheets'
        ],
        correctAnswer: 'Cascading Style Sheets',
        explanation: 'CSS stands for Cascading Style Sheets, which is used to style and layout web pages.',
        difficulty: 'beginner',
        track: 'css',
        xp: 10,
        type: 'multiple-choice'
      },
      {
        id: 'css_002',
        question: 'Which CSS property is used to change the text color?',
        options: ['text-color', 'color', 'font-color', 'text-style'],
        correctAnswer: 'color',
        explanation: 'The color property is used to set the color of text in CSS.',
        difficulty: 'beginner',
        track: 'css',
        xp: 10,
        type: 'multiple-choice'
      },
      {
        id: 'css_003',
        question: 'What is the correct way to apply CSS to an HTML element?',
        options: [
          'style="color: red;"',
          'css="color: red;"',
          'class="color: red;"',
          'id="color: red;"'
        ],
        correctAnswer: 'style="color: red;"',
        explanation: 'Inline CSS is applied using the style attribute with CSS properties and values.',
        difficulty: 'beginner',
        track: 'css',
        xp: 15,
        type: 'multiple-choice'
      }
    ];

    // JavaScript Questions
    this.offlineQuestions.javascript = [
      {
        id: 'js_001',
        question: 'Which keyword is used to declare a variable in JavaScript?',
        options: ['var', 'let', 'const', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'JavaScript supports three ways to declare variables: var, let, and const, each with different scoping rules.',
        difficulty: 'beginner',
        track: 'javascript',
        xp: 10,
        type: 'multiple-choice'
      },
      {
        id: 'js_002',
        question: 'What is the result of 5 + "5" in JavaScript?',
        options: ['10', '55', 'Error', 'undefined'],
        correctAnswer: '55',
        explanation: 'JavaScript performs type coercion, converting the number 5 to a string and concatenating it with "5" to result in "55".',
        difficulty: 'beginner',
        track: 'javascript',
        xp: 15,
        type: 'multiple-choice'
      },
      {
        id: 'js_003',
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 'push()',
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.',
        difficulty: 'beginner',
        track: 'javascript',
        xp: 15,
        type: 'multiple-choice'
      }
    ];

    // Code Exercises
    this.offlineCodeExercises.html = [
      {
        id: 'html_code_001',
        description: 'Create a basic HTML page with a title, heading, and paragraph.',
        starterCode: '<!DOCTYPE html>\n<html>\n<head>\n  <title></title>\n</head>\n<body>\n  \n</body>\n</html>',
        testCases: [
          { input: 'Page title', expectedOutput: 'Title element present' },
          { input: 'Main heading', expectedOutput: 'H1 element present' },
          { input: 'Paragraph text', expectedOutput: 'P element present' }
        ],
        explanation: 'A basic HTML page should include a DOCTYPE declaration, html, head, and body elements, with a title in the head and content in the body.',
        difficulty: 'beginner',
        track: 'html',
        xp: 25,
        type: 'code-exercise'
      }
    ];

    this.offlineCodeExercises.css = [
      {
        id: 'css_code_001',
        description: 'Style a button with blue background, white text, and rounded corners.',
        starterCode: '<button class="styled-button">Click me</button>',
        testCases: [
          { input: 'Background color', expectedOutput: 'Blue background' },
          { input: 'Text color', expectedOutput: 'White text' },
          { input: 'Border radius', expectedOutput: 'Rounded corners' }
        ],
        explanation: 'Use CSS properties like background-color, color, and border-radius to style the button.',
        difficulty: 'beginner',
        track: 'css',
        xp: 25,
        type: 'code-exercise'
      }
    ];

    this.offlineCodeExercises.javascript = [
      {
        id: 'js_code_001',
        description: 'Write a function that takes two numbers and returns their sum.',
        starterCode: 'function add(a, b) {\n  // Your code here\n}',
        testCases: [
          { input: 'add(2, 3)', expectedOutput: '5' },
          { input: 'add(10, 5)', expectedOutput: '15' },
          { input: 'add(-1, 1)', expectedOutput: '0' }
        ],
        explanation: 'Create a function that takes two parameters and returns their sum using the + operator.',
        difficulty: 'beginner',
        track: 'javascript',
        xp: 25,
        type: 'code-exercise'
      }
    ];
  }

  /**
   * Get fallback questions for a track and difficulty
   */
  getFallbackQuestions(track: LearningTrack, difficulty: DifficultyLevel, count: number = 1): FallbackResponse {
    const questions = this.offlineQuestions[track] || [];
    const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
    const selectedQuestions = filteredQuestions.slice(0, count);

    return {
      success: true,
      data: selectedQuestions,
      source: 'fallback',
      timestamp: new Date().toISOString(),
      message: 'Using offline questions'
    };
  }

  /**
   * Get fallback code exercises for a track and difficulty
   */
  getFallbackCodeExercises(track: LearningTrack, difficulty: DifficultyLevel, count: number = 1): FallbackResponse {
    const exercises = this.offlineCodeExercises[track] || [];
    const filteredExercises = exercises.filter(e => e.difficulty === difficulty);
    const selectedExercises = filteredExercises.slice(0, count);

    return {
      success: true,
      data: selectedExercises,
      source: 'fallback',
      timestamp: new Date().toISOString(),
      message: 'Using offline code exercises'
    };
  }

  /**
   * Get fallback code feedback
   */
  getFallbackCodeFeedback(code: string, language: string): FallbackResponse {
    const feedback = {
      isCorrect: Math.random() > 0.3, // 70% pass rate for demo
      feedback: 'Code submitted successfully. This is a fallback response.',
      suggestions: [
        'Check your syntax carefully',
        'Make sure all variables are declared',
        'Test your code with different inputs'
      ],
      explanation: 'This is a fallback explanation. In online mode, you would receive AI-generated feedback.'
    };

    return {
      success: true,
      data: feedback,
      source: 'fallback',
      timestamp: new Date().toISOString(),
      message: 'Using offline code feedback'
    };
  }

  /**
   * Get fallback explanation for incorrect answers
   */
  getFallbackExplanation(question: string, userAnswer: string, correctAnswer: string, track: LearningTrack): FallbackResponse {
    const explanation = {
      explanation: `The correct answer is "${correctAnswer}". Your answer "${userAnswer}" was not correct. Please review the concept and try again.`,
      hints: [
        'Read the question carefully',
        'Consider each option before selecting',
        'Review the related concepts'
      ],
      relatedConcepts: [track.toUpperCase(), 'Programming Fundamentals']
    };

    return {
      success: true,
      data: explanation,
      source: 'fallback',
      timestamp: new Date().toISOString(),
      message: 'Using offline explanation'
    };
  }

  /**
   * Get fallback learning recommendations
   */
  getFallbackLearningRecommendations(userProgress: any): FallbackResponse {
    const recommendations = {
      recommendations: [
        'Continue practicing with similar exercises',
        'Review the fundamentals of the topic',
        'Try exercises of different difficulty levels'
      ],
      nextTopics: ['Advanced Concepts', 'Best Practices', 'Real-world Applications'],
      difficultyAdjustment: 'maintain current level'
    };

    return {
      success: true,
      data: recommendations,
      source: 'fallback',
      timestamp: new Date().toISOString(),
      message: 'Using offline recommendations'
    };
  }

  /**
   * Check if offline content is available
   */
  isOfflineContentAvailable(track: LearningTrack, difficulty: DifficultyLevel): boolean {
    const questions = this.offlineQuestions[track] || [];
    const exercises = this.offlineCodeExercises[track] || [];
    
    return questions.some(q => q.difficulty === difficulty) || 
           exercises.some(e => e.difficulty === difficulty);
  }

  /**
   * Get offline content statistics
   */
  getOfflineContentStats(): { [key: string]: { questions: number; exercises: number } } {
    const stats: { [key: string]: { questions: number; exercises: number } } = {};

    Object.keys(this.offlineQuestions).forEach(track => {
      stats[track] = {
        questions: this.offlineQuestions[track].length,
        exercises: this.offlineCodeExercises[track]?.length || 0
      };
    });

    return stats;
  }

  /**
   * Add custom offline content
   */
  addOfflineQuestion(question: OfflineQuestion): void {
    if (!this.offlineQuestions[question.track]) {
      this.offlineQuestions[question.track] = [];
    }
    this.offlineQuestions[question.track].push(question);
  }

  /**
   * Add custom offline code exercise
   */
  addOfflineCodeExercise(exercise: OfflineCodeExercise): void {
    if (!this.offlineCodeExercises[exercise.track]) {
      this.offlineCodeExercises[exercise.track] = [];
    }
    this.offlineCodeExercises[exercise.track].push(exercise);
  }

  /**
   * Clear offline content
   */
  clearOfflineContent(track?: LearningTrack): void {
    if (track) {
      delete this.offlineQuestions[track];
      delete this.offlineCodeExercises[track];
    } else {
      this.offlineQuestions = {};
      this.offlineCodeExercises = {};
    }
  }

  /**
   * Get random fallback question
   */
  getRandomFallbackQuestion(track: LearningTrack, difficulty: DifficultyLevel): OfflineQuestion | null {
    const questions = this.offlineQuestions[track] || [];
    const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
    
    if (filteredQuestions.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  }

  /**
   * Get random fallback code exercise
   */
  getRandomFallbackCodeExercise(track: LearningTrack, difficulty: DifficultyLevel): OfflineCodeExercise | null {
    const exercises = this.offlineCodeExercises[track] || [];
    const filteredExercises = exercises.filter(e => e.difficulty === difficulty);
    
    if (filteredExercises.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredExercises.length);
    return filteredExercises[randomIndex];
  }

  /**
   * Check if we're in offline mode
   */
  isOfflineMode(): boolean {
    return !navigator.onLine;
  }

  /**
   * Get offline mode message
   */
  getOfflineModeMessage(): string {
    return 'You\'re currently offline. Using cached content and fallback responses.';
  }

  /**
   * Get fallback error message
   */
  getFallbackErrorMessage(operation: string): string {
    return `Unable to ${operation} while offline. Please check your internet connection and try again.`;
  }
}

// Export singleton instance
export const fallbackService = new FallbackService();
export default fallbackService;
