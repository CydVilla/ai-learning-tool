import { Question, CodeExercise, LearningTrack, DifficultyLevel, QuestionType } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface SanitizationResult {
  sanitized: any;
  changes: string[];
  warnings: string[];
}

class QuestionValidationService {
  /**
   * Validate a question object
   */
  validateQuestion(question: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check required fields
    const requiredFields = ['id', 'question', 'options', 'correctAnswer', 'explanation', 'difficulty', 'track', 'xp', 'type'];
    requiredFields.forEach(field => {
      if (!question[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    if (errors.length > 0) {
      return { isValid: false, errors, warnings, suggestions };
    }

    // Validate question text
    if (!question.question || typeof question.question !== 'string') {
      errors.push('Question text is required and must be a string');
    } else if (question.question.length < 10) {
      errors.push('Question text must be at least 10 characters long');
    } else if (question.question.length > 500) {
      errors.push('Question text must not exceed 500 characters');
    }

    // Validate options
    if (!Array.isArray(question.options)) {
      errors.push('Options must be an array');
    } else if (question.options.length < 2) {
      errors.push('At least 2 options are required');
    } else if (question.options.length > 6) {
      errors.push('Maximum 6 options allowed');
    }

    // Validate correct answer
    if (!question.correctAnswer || typeof question.correctAnswer !== 'string') {
      errors.push('Correct answer is required and must be a string');
    } else if (!question.options.includes(question.correctAnswer)) {
      errors.push('Correct answer must be one of the provided options');
    }

    // Validate difficulty
    const validDifficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(question.difficulty)) {
      errors.push(`Difficulty must be one of: ${validDifficulties.join(', ')}`);
    }

    // Validate track
    const validTracks: LearningTrack[] = ['html', 'css', 'javascript'];
    if (!validTracks.includes(question.track)) {
      errors.push(`Track must be one of: ${validTracks.join(', ')}`);
    }

    // Validate XP
    if (typeof question.xp !== 'number' || isNaN(question.xp) || question.xp < 0) {
      errors.push('XP must be a positive number');
    }

    // Validate type
    const validTypes: QuestionType[] = ['multiple-choice', 'fill-in-the-blank', 'code-exercise'];
    if (!validTypes.includes(question.type)) {
      errors.push(`Question type must be one of: ${validTypes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Validate a code exercise object
   */
  validateCodeExercise(exercise: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check required fields
    const requiredFields = ['id', 'description', 'testCases', 'explanation', 'difficulty', 'track', 'xp', 'type'];
    requiredFields.forEach(field => {
      if (!exercise[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    if (errors.length > 0) {
      return { isValid: false, errors, warnings, suggestions };
    }

    // Validate description
    if (!exercise.description || typeof exercise.description !== 'string') {
      errors.push('Description is required and must be a string');
    } else if (exercise.description.length < 20) {
      errors.push('Description must be at least 20 characters long');
    }

    // Validate test cases
    if (!Array.isArray(exercise.testCases)) {
      errors.push('Test cases must be an array');
    } else if (exercise.testCases.length < 1) {
      errors.push('At least 1 test case is required');
    } else if (exercise.testCases.length > 10) {
      errors.push('Maximum 10 test cases allowed');
    }

    // Validate difficulty
    const validDifficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(exercise.difficulty)) {
      errors.push(`Difficulty must be one of: ${validDifficulties.join(', ')}`);
    }

    // Validate track
    const validTracks: LearningTrack[] = ['html', 'css', 'javascript'];
    if (!validTracks.includes(exercise.track)) {
      errors.push(`Track must be one of: ${validTracks.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Sanitize a question object
   */
  sanitizeQuestion(question: any): SanitizationResult {
    const changes: string[] = [];
    const warnings: string[] = [];
    const sanitized = { ...question };

    // Sanitize question text
    if (sanitized.question) {
      const original = sanitized.question;
      sanitized.question = this.sanitizeText(sanitized.question);
      if (original !== sanitized.question) {
        changes.push('Question text was sanitized');
      }
    }

    // Sanitize options
    if (sanitized.options && Array.isArray(sanitized.options)) {
      sanitized.options = sanitized.options.map((option: string, index: number) => {
        const original = option;
        const sanitized = this.sanitizeText(option);
        if (original !== sanitized) {
          changes.push(`Option ${index + 1} was sanitized`);
        }
        return sanitized;
      });
    }

    // Sanitize correct answer
    if (sanitized.correctAnswer) {
      const original = sanitized.correctAnswer;
      sanitized.correctAnswer = this.sanitizeText(sanitized.correctAnswer);
      if (original !== sanitized.correctAnswer) {
        changes.push('Correct answer was sanitized');
      }
    }

    // Sanitize explanation
    if (sanitized.explanation) {
      const original = sanitized.explanation;
      sanitized.explanation = this.sanitizeText(sanitized.explanation);
      if (original !== sanitized.explanation) {
        changes.push('Explanation was sanitized');
      }
    }

    return {
      sanitized,
      changes,
      warnings
    };
  }

  /**
   * Sanitize a code exercise object
   */
  sanitizeCodeExercise(exercise: any): SanitizationResult {
    const changes: string[] = [];
    const warnings: string[] = [];
    const sanitized = { ...exercise };

    // Sanitize description
    if (sanitized.description) {
      const original = sanitized.description;
      sanitized.description = this.sanitizeText(sanitized.description);
      if (original !== sanitized.description) {
        changes.push('Description was sanitized');
      }
    }

    // Sanitize test cases
    if (sanitized.testCases && Array.isArray(sanitized.testCases)) {
      sanitized.testCases = sanitized.testCases.map((testCase: any, index: number) => {
        const original = testCase;
        const sanitized = { ...testCase };
        
        if (sanitized.input) {
          const originalInput = sanitized.input;
          sanitized.input = this.sanitizeText(sanitized.input);
          if (originalInput !== sanitized.input) {
            changes.push(`Test case ${index + 1} input was sanitized`);
          }
        }
        
        if (sanitized.expectedOutput) {
          const originalOutput = sanitized.expectedOutput;
          sanitized.expectedOutput = this.sanitizeText(sanitized.expectedOutput);
          if (originalOutput !== sanitized.expectedOutput) {
            changes.push(`Test case ${index + 1} output was sanitized`);
          }
        }
        
        return sanitized;
      });
    }

    return {
      sanitized,
      changes,
      warnings
    };
  }

  /**
   * Sanitize text content
   */
  private sanitizeText(text: string): string {
    if (!text || typeof text !== 'string') {
      return '';
    }

    return text
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }
}

// Export singleton instance
export const questionValidationService = new QuestionValidationService();
export default questionValidationService;