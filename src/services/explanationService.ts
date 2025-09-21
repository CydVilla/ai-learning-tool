import { openaiService } from './openaiService';
import { Question, CodeExercise, LearningTrack, DifficultyLevel } from '../types';

export interface ExplanationRequest {
  question: Question | CodeExercise;
  userAnswer: string;
  correctAnswer: string;
  track: LearningTrack;
  difficulty: DifficultyLevel;
  attemptCount: number;
}

export interface ExplanationResponse {
  explanation: string;
  hints: string[];
  relatedConcepts: string[];
  examples: string[];
  nextSteps: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  personalized: boolean;
}

export interface ConceptExplanation {
  concept: string;
  definition: string;
  examples: string[];
  commonMistakes: string[];
  bestPractices: string[];
  relatedTopics: string[];
}

export interface LearningPath {
  currentLevel: DifficultyLevel;
  recommendedLevel: DifficultyLevel;
  suggestedTopics: string[];
  practiceExercises: string[];
  resources: string[];
}

class ExplanationService {
  /**
   * Generate comprehensive explanation for incorrect answers
   */
  async generateExplanation(request: ExplanationRequest): Promise<ExplanationResponse> {
    const { question, userAnswer, correctAnswer, track, difficulty, attemptCount } = request;

    try {
      // Generate AI explanation
      const aiExplanation = await openaiService.generateExplanation({
        question: this.getQuestionText(question),
        userAnswer,
        correctAnswer,
        track
      });

      // Generate additional educational content
      const hints = await this.generateProgressiveHints(question, attemptCount, track);
      const examples = await this.generateExamples(question, track, difficulty);
      const nextSteps = await this.generateNextSteps(question, track, difficulty);

      return {
        explanation: aiExplanation.explanation,
        hints: [...hints, ...aiExplanation.hints],
        relatedConcepts: aiExplanation.relatedConcepts,
        examples,
        nextSteps,
        difficulty,
        personalized: attemptCount > 1
      };
    } catch (error) {
      console.error('Error generating explanation:', error);
      return this.getFallbackExplanation(question, userAnswer, correctAnswer, track);
    }
  }

  /**
   * Generate concept-specific explanations
   */
  async generateConceptExplanation(
    concept: string,
    track: LearningTrack,
    difficulty: DifficultyLevel
  ): Promise<ConceptExplanation> {
    try {
      const systemPrompt = `You are an expert programming instructor explaining ${concept} in ${track.toUpperCase()}.

Provide a comprehensive explanation suitable for ${difficulty} level developers.

Return the response as JSON with this exact structure:
{
  "definition": "Clear definition of the concept",
  "examples": ["Example 1", "Example 2", "Example 3"],
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "bestPractices": ["Practice 1", "Practice 2"],
  "relatedTopics": ["Topic 1", "Topic 2"]
}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Explain ${concept} for ${difficulty} level ${track} developers.` }
      ];

      const response = await openaiService.generateExplanation({
        question: `Explain ${concept}`,
        userAnswer: '',
        correctAnswer: '',
        track: track
      });
      const data = response;

      return {
        concept,
        definition: data.explanation || `Explanation of ${concept}`,
        examples: [],
        commonMistakes: [],
        bestPractices: [],
        relatedTopics: data.relatedConcepts || []
      };
    } catch (error) {
      console.error('Error generating concept explanation:', error);
      return this.getFallbackConceptExplanation(concept, track);
    }
  }

  /**
   * Generate learning path recommendations
   */
  async generateLearningPath(
    currentProgress: any,
    track: LearningTrack,
    difficulty: DifficultyLevel
  ): Promise<LearningPath> {
    try {
      const recommendations = await openaiService.generateLearningRecommendations(currentProgress);

      return {
        currentLevel: difficulty,
        recommendedLevel: this.determineRecommendedLevel(difficulty, currentProgress),
        suggestedTopics: recommendations.nextTopics,
        practiceExercises: this.generatePracticeExercises(track, difficulty),
        resources: this.generateResources(track, difficulty)
      };
    } catch (error) {
      console.error('Error generating learning path:', error);
      return this.getFallbackLearningPath(track, difficulty);
    }
  }

  /**
   * Generate progressive hints based on attempt count
   */
  private async generateProgressiveHints(
    question: Question | CodeExercise,
    attemptCount: number,
    track: LearningTrack
  ): Promise<string[]> {
    const baseHints = this.getBaseHints(question, track);
    
    // Return more specific hints based on attempt count
    if (attemptCount === 1) {
      return baseHints.slice(0, 1);
    } else if (attemptCount === 2) {
      return baseHints.slice(0, 2);
    } else {
      return baseHints;
    }
  }

  /**
   * Generate relevant examples
   */
  private async generateExamples(
    question: Question | CodeExercise,
    track: LearningTrack,
    difficulty: DifficultyLevel
  ): Promise<string[]> {
    const examples: string[] = [];

    if (track === 'html') {
      examples.push(
        '<div class="container">Content here</div>',
        '<h1>Main Heading</h1>',
        '<p>This is a paragraph with <strong>bold</strong> text.</p>'
      );
    } else if (track === 'css') {
      examples.push(
        '.button { background-color: blue; padding: 10px; }',
        'h1 { color: red; font-size: 24px; }',
        '@media (max-width: 768px) { .container { width: 100%; } }'
      );
    } else if (track === 'javascript') {
      examples.push(
        'function greet(name) { return `Hello, ${name}!`; }',
        'const numbers = [1, 2, 3]; const doubled = numbers.map(n => n * 2);',
        'if (age >= 18) { console.log("Adult"); } else { console.log("Minor"); }'
      );
    }

    return examples.slice(0, 3);
  }

  /**
   * Generate next steps for learning
   */
  private async generateNextSteps(
    question: Question | CodeExercise,
    track: LearningTrack,
    difficulty: DifficultyLevel
  ): Promise<string[]> {
    const nextSteps: string[] = [];

    if (difficulty === 'beginner') {
      nextSteps.push(
        'Review the basic concepts of this topic',
        'Try similar exercises to reinforce learning',
        'Practice with simple examples'
      );
    } else if (difficulty === 'intermediate') {
      nextSteps.push(
        'Explore advanced features of this concept',
        'Try more complex variations of this problem',
        'Study real-world applications'
      );
    } else {
      nextSteps.push(
        'Master advanced patterns and techniques',
        'Contribute to open source projects',
        'Teach others about this concept'
      );
    }

    return nextSteps;
  }

  /**
   * Get base hints for a question
   */
  private getBaseHints(question: Question | CodeExercise, track: LearningTrack): string[] {
    if (track === 'html') {
      return [
        'Remember to close all HTML tags properly',
        'Check if you\'re using the correct HTML element for the purpose',
        'Validate your HTML structure and nesting'
      ];
    } else if (track === 'css') {
      return [
        'Check your CSS selectors and specificity',
        'Make sure your properties are spelled correctly',
        'Consider using CSS Grid or Flexbox for layout'
      ];
    } else if (track === 'javascript') {
      return [
        'Check your variable declarations and scope',
        'Make sure your function calls are correct',
        'Debug with console.log to see what\'s happening'
      ];
    }

    return ['Read the question carefully', 'Check your syntax', 'Try a different approach'];
  }

  /**
   * Determine recommended difficulty level
   */
  private determineRecommendedLevel(
    currentLevel: DifficultyLevel,
    progress: any
  ): DifficultyLevel {
    const accuracy = progress.statistics?.averageAccuracy || 0;
    const questionsAnswered = progress.statistics?.totalQuestionsAnswered || 0;

    if (accuracy >= 90 && questionsAnswered >= 20) {
      // Move up in difficulty
      if (currentLevel === 'beginner') return 'intermediate';
      if (currentLevel === 'intermediate') return 'advanced';
    } else if (accuracy < 70 && questionsAnswered >= 10) {
      // Move down in difficulty
      if (currentLevel === 'advanced') return 'intermediate';
      if (currentLevel === 'intermediate') return 'beginner';
    }

    return currentLevel;
  }

  /**
   * Generate practice exercises
   */
  private generatePracticeExercises(track: LearningTrack, difficulty: DifficultyLevel): string[] {
    const exercises: { [key: string]: { [key: string]: string[] } } = {
      html: {
        beginner: ['Create a basic webpage structure', 'Add images and links', 'Create a simple form'],
        intermediate: ['Build a responsive navigation', 'Create a card layout', 'Add semantic HTML'],
        advanced: ['Build a complex form with validation', 'Create an accessible website', 'Optimize for SEO']
      },
      css: {
        beginner: ['Style basic elements', 'Create a simple layout', 'Add colors and fonts'],
        intermediate: ['Build a responsive grid', 'Create animations', 'Use CSS variables'],
        advanced: ['Build a complex layout system', 'Create advanced animations', 'Optimize performance']
      },
      javascript: {
        beginner: ['Write basic functions', 'Work with arrays', 'Handle user input'],
        intermediate: ['Build interactive features', 'Work with APIs', 'Handle errors'],
        advanced: ['Build complex applications', 'Optimize performance', 'Use advanced patterns']
      }
    };

    return exercises[track]?.[difficulty] || ['Practice with similar exercises'];
  }

  /**
   * Generate learning resources
   */
  private generateResources(track: LearningTrack, difficulty: DifficultyLevel): string[] {
    const resources: { [key: string]: string[] } = {
      html: [
        'MDN HTML Documentation',
        'HTML5 Semantic Elements Guide',
        'Web Accessibility Guidelines'
      ],
      css: [
        'MDN CSS Documentation',
        'CSS Grid Layout Guide',
        'Flexbox Complete Guide'
      ],
      javascript: [
        'MDN JavaScript Documentation',
        'JavaScript.info Tutorial',
        'Eloquent JavaScript Book'
      ]
    };

    return resources[track] || ['Official documentation', 'Online tutorials', 'Practice exercises'];
  }

  /**
   * Get question text for AI processing
   */
  private getQuestionText(question: Question | CodeExercise): string {
    return question.content || question.question || '';
  }

  /**
   * Get fallback explanation when AI fails
   */
  private getFallbackExplanation(
    question: Question | CodeExercise,
    userAnswer: string,
    correctAnswer: string,
    track: LearningTrack
  ): ExplanationResponse {
    return {
      explanation: `The correct answer is "${correctAnswer}". Your answer "${userAnswer}" was not correct. Please review the concept and try again.`,
      hints: this.getBaseHints(question, track),
      relatedConcepts: [track.toUpperCase(), 'Programming Fundamentals'],
      examples: [],
      nextSteps: ['Review the concept', 'Try similar exercises', 'Ask for help if needed'],
      difficulty: 'beginner',
      personalized: false
    };
  }

  /**
   * Get fallback concept explanation
   */
  private getFallbackConceptExplanation(concept: string, track: LearningTrack): ConceptExplanation {
    return {
      concept,
      definition: `${concept} is an important concept in ${track.toUpperCase()} programming.`,
      examples: [`Example of ${concept} in ${track}`],
      commonMistakes: [`Common mistake with ${concept}`],
      bestPractices: [`Best practice for ${concept}`],
      relatedTopics: [track.toUpperCase(), 'Programming Fundamentals']
    };
  }

  /**
   * Get fallback learning path
   */
  private getFallbackLearningPath(track: LearningTrack, difficulty: DifficultyLevel): LearningPath {
    return {
      currentLevel: difficulty,
      recommendedLevel: difficulty,
      suggestedTopics: [track.toUpperCase(), 'Programming Fundamentals'],
      practiceExercises: this.generatePracticeExercises(track, difficulty),
      resources: this.generateResources(track, difficulty)
    };
  }
}

// Export singleton instance
export const explanationService = new ExplanationService();
export default explanationService;
