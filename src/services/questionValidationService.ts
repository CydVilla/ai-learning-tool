import { Question, CodeExercise, QuestionAttempt, LearningTrack, DifficultyLevel } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface FeedbackData {
  isCorrect: boolean;
  score: number;
  timeBonus: number;
  accuracyBonus: number;
  streakBonus: number;
  totalScore: number;
  feedback: string;
  explanation: string;
  hints: string[];
  nextSteps: string[];
}

export interface QuestionAnalysis {
  difficulty: DifficultyLevel;
  topic: string;
  concepts: string[];
  commonMistakes: string[];
  learningObjectives: string[];
}

export class QuestionValidationService {
  /**
   * Validate multiple choice question
   */
  static validateMultipleChoiceQuestion(question: Question): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Required fields validation
    if (!question.question || question.question.trim().length === 0) {
      errors.push('Question text is required');
    }

    if (!question.options || question.options.length < 2) {
      errors.push('At least 2 options are required');
    }

    if (!question.correctAnswer) {
      errors.push('Correct answer is required');
    }

    if (!question.difficulty) {
      errors.push('Difficulty level is required');
    }

    // Options validation
    if (question.options) {
      if (question.options.length > 6) {
        warnings.push('Too many options (more than 6) may confuse users');
      }

      if (question.options.length < 3) {
        suggestions.push('Consider adding more options for better challenge');
      }

      // Check for duplicate options
      const uniqueOptions = new Set(question.options);
      if (uniqueOptions.size !== question.options.length) {
        errors.push('Duplicate options found');
      }

      // Check if correct answer is in options
      if (question.correctAnswer && !question.options.includes(question.correctAnswer)) {
        errors.push('Correct answer must be one of the provided options');
      }

      // Check option lengths
      question.options.forEach((option, index) => {
        if (option.length > 200) {
          warnings.push(`Option ${index + 1} is very long (${option.length} characters)`);
        }
        if (option.length < 10) {
          suggestions.push(`Option ${index + 1} could be more descriptive`);
        }
      });
    }

    // Question text validation
    if (question.question) {
      if (question.question.length > 500) {
        warnings.push('Question text is very long (more than 500 characters)');
      }
      if (question.question.length < 20) {
        suggestions.push('Question could be more descriptive');
      }
    }

    // Difficulty validation
    if (question.difficulty) {
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];
      if (!validDifficulties.includes(question.difficulty)) {
        errors.push('Invalid difficulty level');
      }
    }

    // XP validation
    if (question.xp && (question.xp < 5 || question.xp > 50)) {
      warnings.push('XP value should be between 5 and 50');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Validate code exercise
   */
  static validateCodeExercise(exercise: CodeExercise): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Required fields validation
    if (!exercise.description || exercise.description.trim().length === 0) {
      errors.push('Exercise description is required');
    }

    if (!exercise.testCases || exercise.testCases.length === 0) {
      errors.push('At least one test case is required');
    }

    if (!exercise.difficulty) {
      errors.push('Difficulty level is required');
    }

    // Test cases validation
    if (exercise.testCases) {
      if (exercise.testCases.length > 10) {
        warnings.push('Too many test cases (more than 10) may overwhelm users');
      }

      exercise.testCases.forEach((testCase, index) => {
        if (!testCase.input) {
          errors.push(`Test case ${index + 1}: Input is required`);
        }
        if (!testCase.expectedOutput) {
          errors.push(`Test case ${index + 1}: Expected output is required`);
        }
      });
    }

    // Description validation
    if (exercise.description) {
      if (exercise.description.length > 1000) {
        warnings.push('Description is very long (more than 1000 characters)');
      }
      if (exercise.description.length < 50) {
        suggestions.push('Description could be more detailed');
      }
    }

    // Difficulty validation
    if (exercise.difficulty) {
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];
      if (!validDifficulties.includes(exercise.difficulty)) {
        errors.push('Invalid difficulty level');
      }
    }

    // XP validation
    if (exercise.xp && (exercise.xp < 10 || exercise.xp > 100)) {
      warnings.push('XP value should be between 10 and 100 for code exercises');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Generate feedback for question attempt
   */
  static generateFeedback(
    question: Question | CodeExercise,
    attempt: QuestionAttempt,
    track: LearningTrack
  ): FeedbackData {
    const isCorrect = attempt.isCorrect;
    const timeSpent = attempt.timeSpent;
    const difficulty = question.difficulty;

    // Base score calculation
    let baseScore = isCorrect ? question.xp : Math.round(question.xp * 0.1);
    
    // Time bonus (faster answers get more points)
    let timeBonus = 0;
    if (isCorrect) {
      const timeLimit = difficulty === 'beginner' ? 60 : difficulty === 'intermediate' ? 45 : 30;
      if (timeSpent < timeLimit * 0.5) {
        timeBonus = Math.round(question.xp * 0.2); // 20% bonus for very fast
      } else if (timeSpent < timeLimit * 0.8) {
        timeBonus = Math.round(question.xp * 0.1); // 10% bonus for fast
      }
    }

    // Accuracy bonus (based on user's overall accuracy)
    let accuracyBonus = 0;
    if (isCorrect && attempt.accuracy >= 90) {
      accuracyBonus = Math.round(question.xp * 0.15); // 15% bonus for high accuracy
    } else if (isCorrect && attempt.accuracy >= 80) {
      accuracyBonus = Math.round(question.xp * 0.1); // 10% bonus for good accuracy
    }

    // Streak bonus
    let streakBonus = 0;
    if (isCorrect && attempt.streak >= 5) {
      streakBonus = Math.round(question.xp * 0.1); // 10% bonus for good streak
    }

    const totalScore = baseScore + timeBonus + accuracyBonus + streakBonus;

    // Generate feedback message
    let feedback = '';
    let explanation = '';
    const hints: string[] = [];
    const nextSteps: string[] = [];

    if (isCorrect) {
      if (timeSpent < 10) {
        feedback = 'Lightning fast! ⚡ You answered correctly in record time!';
      } else if (timeSpent < 30) {
        feedback = 'Great job! 🎉 You got it right quickly!';
      } else {
        feedback = 'Correct! ✅ You got the right answer!';
      }
      
      if (timeBonus > 0) {
        feedback += ` You earned a time bonus of ${timeBonus} XP!`;
      }
      if (accuracyBonus > 0) {
        feedback += ` You earned an accuracy bonus of ${accuracyBonus} XP!`;
      }
      if (streakBonus > 0) {
        feedback += ` You earned a streak bonus of ${streakBonus} XP!`;
      }
    } else {
      feedback = 'Not quite right. ❌ Let\'s learn from this!';
      
      // Provide hints based on the question type
      if ('options' in question) {
        hints.push('Read the question carefully and consider each option');
        hints.push('Look for keywords that might give you clues');
        hints.push('Eliminate obviously wrong answers first');
      } else {
        hints.push('Check your code for syntax errors');
        hints.push('Make sure you\'re handling edge cases');
        hints.push('Test your solution with the provided test cases');
      }
    }

    // Generate explanation
    if (question.explanation) {
      explanation = question.explanation;
    } else if (isCorrect) {
      explanation = 'You correctly identified the answer. Keep up the great work!';
    } else {
      explanation = 'Take your time to understand the concept and try again.';
    }

    // Generate next steps
    if (isCorrect) {
      nextSteps.push('Continue to the next question');
      nextSteps.push('Try a more challenging difficulty level');
      nextSteps.push('Review related concepts to reinforce learning');
    } else {
      nextSteps.push('Review the explanation carefully');
      nextSteps.push('Try similar questions to practice');
      nextSteps.push('Consider reviewing the fundamentals');
    }

    return {
      isCorrect,
      score: baseScore,
      timeBonus,
      accuracyBonus,
      streakBonus,
      totalScore,
      feedback,
      explanation,
      hints,
      nextSteps
    };
  }

  /**
   * Analyze question for learning insights
   */
  static analyzeQuestion(question: Question | CodeExercise, track: LearningTrack): QuestionAnalysis {
    const difficulty = question.difficulty;
    
    // Extract concepts based on track and question content
    let concepts: string[] = [];
    let topic = '';
    let commonMistakes: string[] = [];
    let learningObjectives: string[] = [];

    if (track === 'html') {
      topic = 'HTML Fundamentals';
      concepts = ['tags', 'attributes', 'structure', 'semantic markup'];
      commonMistakes = [
        'Forgetting to close tags',
        'Using deprecated HTML elements',
        'Missing alt attributes on images',
        'Incorrect nesting of elements'
      ];
      learningObjectives = [
        'Understand HTML document structure',
        'Learn semantic HTML elements',
        'Master form elements and validation',
        'Apply accessibility best practices'
      ];
    } else if (track === 'css') {
      topic = 'CSS Styling';
      concepts = ['selectors', 'properties', 'layout', 'responsive design'];
      commonMistakes = [
        'Not understanding CSS specificity',
        'Overusing !important',
        'Not considering responsive design',
        'Poor use of flexbox and grid'
      ];
      learningObjectives = [
        'Master CSS selectors and specificity',
        'Learn layout techniques (flexbox, grid)',
        'Understand responsive design principles',
        'Apply modern CSS features'
      ];
    } else if (track === 'javascript') {
      topic = 'JavaScript Programming';
      concepts = ['variables', 'functions', 'DOM manipulation', 'async programming'];
      commonMistakes = [
        'Confusing == and === operators',
        'Not understanding hoisting',
        'Poor error handling',
        'Memory leaks with event listeners'
      ];
      learningObjectives = [
        'Master JavaScript fundamentals',
        'Learn DOM manipulation',
        'Understand asynchronous programming',
        'Apply modern ES6+ features'
      ];
    }

    // Adjust based on difficulty
    if (difficulty === 'beginner') {
      concepts = concepts.slice(0, 2);
      learningObjectives = learningObjectives.slice(0, 2);
    } else if (difficulty === 'intermediate') {
      concepts = concepts.slice(0, 3);
      learningObjectives = learningObjectives.slice(0, 3);
    }

    return {
      difficulty,
      topic,
      concepts,
      commonMistakes,
      learningObjectives
    };
  }

  /**
   * Get question difficulty rating
   */
  static getDifficultyRating(question: Question | CodeExercise): number {
    const difficulty = question.difficulty;
    const baseRating = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3;
    
    // Adjust based on question characteristics
    let adjustment = 0;
    
    if ('options' in question) {
      // Multiple choice adjustments
      if (question.options.length > 4) adjustment += 0.2;
      if (question.question.length > 200) adjustment += 0.1;
      if (question.codeExample) adjustment += 0.3;
    } else {
      // Code exercise adjustments
      if (exercise.testCases.length > 5) adjustment += 0.2;
      if (exercise.description.length > 300) adjustment += 0.1;
      if (exercise.starterCode) adjustment -= 0.1;
    }
    
    return Math.min(Math.max(baseRating + adjustment, 1), 5);
  }

  /**
   * Validate question attempt
   */
  static validateAttempt(attempt: QuestionAttempt): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!attempt.questionId) {
      errors.push('Question ID is required');
    }

    if (!attempt.userAnswer) {
      errors.push('User answer is required');
    }

    if (attempt.timeSpent < 0) {
      errors.push('Time spent cannot be negative');
    }

    if (attempt.timeSpent > 600) { // 10 minutes
      warnings.push('Time spent seems unusually long');
    }

    if (attempt.accuracy < 0 || attempt.accuracy > 100) {
      errors.push('Accuracy must be between 0 and 100');
    }

    if (attempt.streak < 0) {
      errors.push('Streak cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Get question statistics
   */
  static getQuestionStats(attempts: QuestionAttempt[]): {
    totalAttempts: number;
    correctAttempts: number;
    averageTime: number;
    averageAccuracy: number;
    difficulty: string;
  } {
    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        correctAttempts: 0,
        averageTime: 0,
        averageAccuracy: 0,
        difficulty: 'unknown'
      };
    }

    const correctAttempts = attempts.filter(attempt => attempt.isCorrect).length;
    const averageTime = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0) / attempts.length;
    const averageAccuracy = attempts.reduce((sum, attempt) => sum + attempt.accuracy, 0) / attempts.length;

    return {
      totalAttempts: attempts.length,
      correctAttempts,
      averageTime: Math.round(averageTime),
      averageAccuracy: Math.round(averageAccuracy),
      difficulty: attempts[0].difficulty
    };
  }
}

export default QuestionValidationService;
