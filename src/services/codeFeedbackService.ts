import { openaiService } from './openaiService';
import { CodeExercise, TestCase, LearningTrack } from '../types';

export interface CodeExecutionResult {
  passed: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

export interface CodeFeedback {
  isCorrect: boolean;
  score: number;
  feedback: string;
  suggestions: string[];
  explanation: string;
  testResults: Array<{
    testCase: TestCase;
    passed: boolean;
    output: string;
    error?: string;
  }>;
  codeAnalysis: {
    style: string;
    performance: string;
    bestPractices: string[];
    improvements: string[];
  };
}

export interface CodeReview {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  codeQuality: {
    readability: number;
    efficiency: number;
    maintainability: number;
    correctness: number;
  };
}

class CodeFeedbackService {
  /**
   * Execute code and run test cases (mock implementation)
   * In a real application, this would use a code execution service
   */
  private async executeCode(
    code: string, 
    language: string, 
    testCases: TestCase[]
  ): Promise<CodeExecutionResult[]> {
    // Mock implementation - in reality, this would call a code execution service
    return testCases.map((testCase, index) => {
      // Simulate code execution with random results
      const passed = Math.random() > 0.3; // 70% pass rate for demo
      const executionTime = Math.random() * 100 + 50; // 50-150ms
      
      return {
        passed,
        output: passed ? testCase.expectedOutput : `Incorrect output for test ${index + 1}`,
        error: passed ? undefined : 'Logic error in implementation',
        executionTime
      };
    });
  }

  /**
   * Analyze code quality and provide feedback
   */
  private async analyzeCodeQuality(
    code: string,
    language: string,
    testResults: CodeExecutionResult[]
  ): Promise<{
    style: string;
    performance: string;
    bestPractices: string[];
    improvements: string[];
  }> {
    try {
      const feedback = await openaiService.generateCodeFeedback({
        code,
        language,
        testCases: testResults.map((result, index) => ({
          input: `Test case ${index + 1}`,
          expectedOutput: result.passed ? 'Passed' : 'Failed'
        })),
        actualOutputs: testResults.map(result => result.output)
      });

      return {
        style: feedback.suggestions.find(s => s.toLowerCase().includes('style')) || 'Code style looks good!',
        performance: feedback.suggestions.find(s => s.toLowerCase().includes('performance')) || 'Performance is acceptable.',
        bestPractices: feedback.suggestions.filter(s => 
          s.toLowerCase().includes('best practice') || 
          s.toLowerCase().includes('convention') ||
          s.toLowerCase().includes('standard')
        ),
        improvements: feedback.suggestions.filter(s => 
          s.toLowerCase().includes('improve') || 
          s.toLowerCase().includes('better') ||
          s.toLowerCase().includes('optimize')
        )
      };
    } catch (error) {
      console.error('Error analyzing code quality:', error);
      return {
        style: 'Unable to analyze code style.',
        performance: 'Unable to analyze performance.',
        bestPractices: [],
        improvements: []
      };
    }
  }

  /**
   * Generate comprehensive code feedback
   */
  async generateCodeFeedback(
    exercise: CodeExercise,
    userCode: string,
    track: LearningTrack
  ): Promise<CodeFeedback> {
    try {
      // Execute the code and run test cases
      const testResults = await this.executeCode(
        userCode,
        track,
        exercise.testCases
      );

      // Calculate score based on test results
      const passedTests = testResults.filter(result => result.passed).length;
      const totalTests = testResults.length;
      const score = Math.round((passedTests / totalTests) * 100);

      // Generate AI feedback
      const aiFeedback = await openaiService.generateCodeFeedback({
        code: userCode,
        language: track,
        testCases: exercise.testCases,
        actualOutputs: testResults.map(result => result.output)
      });

      // Analyze code quality
      const codeAnalysis = await this.analyzeCodeQuality(
        userCode,
        track,
        testResults
      );

      // Combine test results with test cases
      const combinedTestResults = testResults.map((result, index) => ({
        testCase: exercise.testCases[index],
        passed: result.passed,
        output: result.output,
        error: result.error
      }));

      return {
        isCorrect: score === 100,
        score,
        feedback: aiFeedback.feedback,
        suggestions: aiFeedback.suggestions,
        explanation: aiFeedback.explanation,
        testResults: combinedTestResults,
        codeAnalysis
      };
    } catch (error) {
      console.error('Error generating code feedback:', error);
      throw new Error('Failed to generate code feedback');
    }
  }

  /**
   * Generate detailed code review
   */
  async generateCodeReview(
    code: string,
    language: string,
    exercise: CodeExercise
  ): Promise<CodeReview> {
    try {
      const feedback = await openaiService.generateCodeFeedback({
        code,
        language,
        testCases: exercise.testCases
      });

      // Analyze code quality metrics
      const codeQuality = {
        readability: Math.round(Math.random() * 40 + 60), // 60-100
        efficiency: Math.round(Math.random() * 40 + 60), // 60-100
        maintainability: Math.round(Math.random() * 40 + 60), // 60-100
        correctness: Math.round(Math.random() * 40 + 60) // 60-100
      };

      const overallScore = Math.round(
        (codeQuality.readability + 
         codeQuality.efficiency + 
         codeQuality.maintainability + 
         codeQuality.correctness) / 4
      );

      return {
        overallScore,
        strengths: feedback.suggestions.filter(s => 
          s.toLowerCase().includes('good') || 
          s.toLowerCase().includes('well') ||
          s.toLowerCase().includes('correct')
        ),
        weaknesses: feedback.suggestions.filter(s => 
          s.toLowerCase().includes('improve') || 
          s.toLowerCase().includes('better') ||
          s.toLowerCase().includes('fix')
        ),
        recommendations: feedback.suggestions,
        codeQuality
      };
    } catch (error) {
      console.error('Error generating code review:', error);
      throw new Error('Failed to generate code review');
    }
  }

  /**
   * Generate hints for stuck users
   */
  async generateHints(
    exercise: CodeExercise,
    userCode: string,
    track: LearningTrack,
    attemptCount: number
  ): Promise<string[]> {
    try {
      const feedback = await openaiService.generateCodeFeedback({
        code: userCode,
        language: track,
        testCases: exercise.testCases
      });

      // Generate progressive hints based on attempt count
      const hints = feedback.suggestions.slice(0, Math.min(attemptCount + 1, 3));
      
      // Add exercise-specific hints if available
      if (exercise.hints && exercise.hints.length > 0) {
        hints.push(...exercise.hints.slice(0, 2));
      }

      return hints;
    } catch (error) {
      console.error('Error generating hints:', error);
      return exercise.hints || ['Try breaking down the problem into smaller steps.'];
    }
  }

  /**
   * Validate code syntax
   */
  validateCodeSyntax(code: string, language: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic syntax validation (mock implementation)
    if (language === 'javascript') {
      // Check for common JavaScript syntax errors
      if (code.includes('function(') && !code.includes(')')) {
        errors.push('Missing closing parenthesis in function declaration');
      }
      if (code.includes('{') && !code.includes('}')) {
        errors.push('Missing closing brace');
      }
      if (code.includes('[') && !code.includes(']')) {
        errors.push('Missing closing bracket');
      }
      if (code.includes('(') && !code.includes(')')) {
        errors.push('Missing closing parenthesis');
      }
    } else if (language === 'html') {
      // Check for common HTML syntax errors
      if (code.includes('<') && !code.includes('>')) {
        errors.push('Missing closing angle bracket');
      }
      if (code.includes('<div') && !code.includes('</div>')) {
        warnings.push('Consider closing your div tags');
      }
    } else if (language === 'css') {
      // Check for common CSS syntax errors
      if (code.includes('{') && !code.includes('}')) {
        errors.push('Missing closing brace in CSS rule');
      }
      if (code.includes(':') && !code.includes(';')) {
        warnings.push('Consider adding semicolons after CSS properties');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get code complexity score
   */
  getCodeComplexity(code: string): {
    score: number;
    factors: string[];
  } {
    const factors: string[] = [];
    let score = 0;

    // Count lines of code
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 50) {
      score += 2;
      factors.push('High line count');
    } else if (lines.length > 20) {
      score += 1;
      factors.push('Medium line count');
    }

    // Count nested structures
    const nestedLevels = this.countNestedLevels(code);
    if (nestedLevels > 3) {
      score += 2;
      factors.push('High nesting level');
    } else if (nestedLevels > 2) {
      score += 1;
      factors.push('Medium nesting level');
    }

    // Count function calls
    const functionCalls = (code.match(/\(/g) || []).length;
    if (functionCalls > 10) {
      score += 1;
      factors.push('Many function calls');
    }

    // Count variables
    const variables = (code.match(/\b(let|const|var)\s+\w+/g) || []).length;
    if (variables > 15) {
      score += 1;
      factors.push('Many variables');
    }

    return {
      score: Math.min(score, 10), // Cap at 10
      factors
    };
  }

  /**
   * Count nested levels in code
   */
  private countNestedLevels(code: string): number {
    let maxLevel = 0;
    let currentLevel = 0;

    for (const char of code) {
      if (char === '{' || char === '(' || char === '[') {
        currentLevel++;
        maxLevel = Math.max(maxLevel, currentLevel);
      } else if (char === '}' || char === ')' || char === ']') {
        currentLevel--;
      }
    }

    return maxLevel;
  }

  /**
   * Generate code improvement suggestions
   */
  async generateImprovementSuggestions(
    code: string,
    language: string,
    exercise: CodeExercise
  ): Promise<{
    suggestions: string[];
    refactoredCode?: string;
    explanation: string;
  }> {
    try {
      const feedback = await openaiService.generateCodeFeedback({
        code,
        language,
        testCases: exercise.testCases
      });

      return {
        suggestions: feedback.suggestions,
        explanation: feedback.explanation
      };
    } catch (error) {
      console.error('Error generating improvement suggestions:', error);
      return {
        suggestions: ['Consider breaking down complex logic into smaller functions.'],
        explanation: 'Unable to generate detailed suggestions at this time.'
      };
    }
  }
}

// Export singleton instance
export const codeFeedbackService = new CodeFeedbackService();
export default codeFeedbackService;
