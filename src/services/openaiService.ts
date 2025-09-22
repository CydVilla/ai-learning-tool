import OpenAI from 'openai';
import { Question, CodeExercise, LearningTrack, DifficultyLevel, QuestionType } from '../types';

// For demo deployment, we'll use mock responses instead of real OpenAI API
// Users can add their own API key in a local .env file for full functionality
// Note: OpenAI integration is disabled in this public demo version
const openai = null; // Disabled for public demo to prevent API key exposure

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface QuestionGenerationRequest {
  track: LearningTrack;
  difficulty: DifficultyLevel;
  questionType: QuestionType;
  topic?: string;
  count?: number;
}

interface CodeFeedbackRequest {
  code: string;
  language: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  actualOutputs?: string[];
}

interface ExplanationRequest {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  track: LearningTrack;
}

class OpenAIService {
  private apiKey: string;

  constructor() {
    // For demo deployment, always use fallback responses
    this.apiKey = '';
    console.log('OpenAI service initialized in demo mode - using mock responses');
  }

  private async makeRequest(messages: any[], temperature: number = 0.7): Promise<OpenAIResponse> {
    // For demo deployment, always use fallback responses
    throw new Error('OpenAI API not available in demo mode - using fallback responses');
    
    /* Commented out for demo deployment
    if (!this.apiKey || !openai) {
      throw new Error('OpenAI API key not configured - using fallback responses');
    }

    try {
      const completion = await openai!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      // Convert OpenAI response to our expected format
      return {
        id: completion.id,
        object: completion.object,
        created: completion.created,
        model: completion.model,
        choices: completion.choices.map(choice => ({
          index: choice.index,
          message: {
            role: choice.message.role,
            content: choice.message.content || '',
          },
          finish_reason: choice.finish_reason || 'stop',
        })),
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API Error: ${error.message || 'Unknown error'}`);
    }
    */
  }

  /**
   * Generate multiple choice questions for a specific track and difficulty
   */
  async generateMultipleChoiceQuestions(request: QuestionGenerationRequest): Promise<Question[]> {
    const { track, difficulty, topic, count = 1 } = request;

    const systemPrompt = `You are an expert programming instructor creating educational content for ${track.toUpperCase()} learning.

Create ${count} multiple choice question${count > 1 ? 's' : ''} for ${difficulty} level ${track} developers${topic ? ` focusing on ${topic}` : ''}.

Each question should:
- Be clear and concise
- Test practical knowledge
- Have exactly 4 options (A, B, C, D)
- Include a code example if relevant
- Provide detailed explanations
- Be appropriate for ${difficulty} level

Return the response as a JSON array with this exact structure:
[
  {
    "id": "unique_id",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Detailed explanation of why this is correct",
    "codeExample": "Optional code example",
    "difficulty": "${difficulty}",
    "track": "${track}",
    "xp": 10,
    "feedback": {
      "correct": "Great job!",
      "incorrect": "Not quite right. Here's why..."
    }
  }
]`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate ${count} ${difficulty} level ${track} multiple choice question${count > 1 ? 's' : ''}${topic ? ` about ${topic}` : ''}.` }
    ];

    try {
      const response = await this.makeRequest(messages, 0.8);
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const questions = JSON.parse(content);
      
      // Validate and format questions
      return questions.map((q: any, index: number) => ({
        id: q.id || `mc_${track}_${difficulty}_${Date.now()}_${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        codeExample: q.codeExample || null,
        difficulty: q.difficulty || difficulty,
        track: q.track || track,
        xp: q.xp || 10,
        feedback: q.feedback || {
          correct: 'Great job!',
          incorrect: 'Not quite right. Here\'s why...'
        },
        type: 'multiple-choice' as QuestionType
      }));
    } catch (error) {
      console.error('Error generating multiple choice questions:', error);
      throw error;
    }
  }

  /**
   * Generate code exercises for a specific track and difficulty
   */
  async generateCodeExercises(request: QuestionGenerationRequest): Promise<CodeExercise[]> {
    const { track, difficulty, topic, count = 1 } = request;

    const systemPrompt = `You are an expert programming instructor creating code exercises for ${track.toUpperCase()} learning.

Create ${count} code exercise${count > 1 ? 's' : ''} for ${difficulty} level ${track} developers${topic ? ` focusing on ${topic}` : ''}.

Each exercise should:
- Have a clear problem statement
- Include starter code if appropriate
- Provide 3-5 test cases with inputs and expected outputs
- Be solvable in 10-30 lines of code
- Include detailed explanations
- Be appropriate for ${difficulty} level

Return the response as a JSON array with this exact structure:
[
  {
    "id": "unique_id",
    "description": "Problem description here",
    "starterCode": "Optional starter code",
    "testCases": [
      {
        "input": "input_value",
        "expectedOutput": "expected_output"
      }
    ],
    "explanation": "Detailed explanation of the solution",
    "difficulty": "${difficulty}",
    "track": "${track}",
    "xp": 25,
    "hints": ["Hint 1", "Hint 2"]
  }
]`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate ${count} ${difficulty} level ${track} code exercise${count > 1 ? 's' : ''}${topic ? ` about ${topic}` : ''}.` }
    ];

    try {
      const response = await this.makeRequest(messages, 0.8);
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const exercises = JSON.parse(content);
      
      // Validate and format exercises
      return exercises.map((ex: any, index: number) => ({
        id: ex.id || `code_${track}_${difficulty}_${Date.now()}_${index}`,
        description: ex.description,
        starterCode: ex.starterCode || '',
        testCases: ex.testCases,
        explanation: ex.explanation,
        difficulty: ex.difficulty || difficulty,
        track: ex.track || track,
        xp: ex.xp || 25,
        hints: ex.hints || [],
        type: 'code-exercise' as QuestionType
      }));
    } catch (error) {
      console.error('Error generating code exercises:', error);
      throw error;
    }
  }

  /**
   * Generate feedback for code submissions
   */
  async generateCodeFeedback(request: CodeFeedbackRequest): Promise<{
    isCorrect: boolean;
    feedback: string;
    suggestions: string[];
    explanation: string;
  }> {
    const { code, language, testCases, actualOutputs = [] } = request;

    const systemPrompt = `You are an expert programming instructor providing feedback on ${language} code.

Analyze the provided code and test results to give constructive feedback.

Consider:
- Code correctness and logic
- Code style and best practices
- Performance considerations
- Edge cases and error handling
- Test case results

Provide feedback that is:
- Constructive and encouraging
- Specific and actionable
- Educational and helpful
- Appropriate for the skill level

Return the response as JSON with this exact structure:
{
  "isCorrect": true/false,
  "feedback": "Overall feedback message",
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "explanation": "Detailed explanation of the solution"
}`;

    const testResults = testCases.map((testCase, index) => {
      const actualOutput = actualOutputs[index] || 'No output';
      return `Test ${index + 1}: Input="${testCase.input}", Expected="${testCase.expectedOutput}", Actual="${actualOutput}"`;
    }).join('\n');

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nTest Results:\n${testResults}` }
    ];

    try {
      const response = await this.makeRequest(messages, 0.7);
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const feedback = JSON.parse(content);
      
      return {
        isCorrect: feedback.isCorrect || false,
        feedback: feedback.feedback || 'Code submitted successfully.',
        suggestions: feedback.suggestions || [],
        explanation: feedback.explanation || 'No explanation provided.'
      };
    } catch (error) {
      console.error('Error generating code feedback:', error);
      throw error;
    }
  }

  /**
   * Generate explanations for incorrect answers
   */
  async generateExplanation(request: ExplanationRequest): Promise<{
    explanation: string;
    hints: string[];
    relatedConcepts: string[];
  }> {
    const { question, userAnswer, correctAnswer, track } = request;

    const systemPrompt = `You are an expert programming instructor explaining concepts in ${track.toUpperCase()}.

Provide a clear, educational explanation for why the user's answer is incorrect and what the correct answer is.

The explanation should:
- Be clear and easy to understand
- Explain the concept behind the correct answer
- Address common misconceptions
- Provide helpful hints for similar questions
- Be encouraging and supportive

Return the response as JSON with this exact structure:
{
  "explanation": "Detailed explanation of the concept",
  "hints": ["Hint 1", "Hint 2", "Hint 3"],
  "relatedConcepts": ["Concept 1", "Concept 2"]
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Question: ${question}\n\nUser's Answer: ${userAnswer}\n\nCorrect Answer: ${correctAnswer}\n\nPlease explain why the user's answer is incorrect and provide educational guidance.` }
    ];

    try {
      const response = await this.makeRequest(messages, 0.7);
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const explanation = JSON.parse(content);
      
      return {
        explanation: explanation.explanation || 'No explanation provided.',
        hints: explanation.hints || [],
        relatedConcepts: explanation.relatedConcepts || []
      };
    } catch (error) {
      console.error('Error generating explanation:', error);
      throw error;
    }
  }

  /**
   * Generate learning recommendations based on user progress
   */
  async generateLearningRecommendations(userProgress: any): Promise<{
    recommendations: string[];
    nextTopics: string[];
    difficultyAdjustment: string;
  }> {
    const systemPrompt = `You are an expert programming instructor providing personalized learning recommendations.

Analyze the user's progress and provide tailored recommendations for their continued learning journey.

Consider:
- Current skill level and progress
- Areas of strength and weakness
- Learning pace and consistency
- Track-specific recommendations

Return the response as JSON with this exact structure:
{
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "nextTopics": ["Topic 1", "Topic 2"],
  "difficultyAdjustment": "suggestion for difficulty level"
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `User Progress: ${JSON.stringify(userProgress, null, 2)}\n\nProvide personalized learning recommendations.` }
    ];

    try {
      const response = await this.makeRequest(messages, 0.8);
      const content = response.choices[0].message.content;
      
      // Parse JSON response
      const recommendations = JSON.parse(content);
      
      return {
        recommendations: recommendations.recommendations || [],
        nextTopics: recommendations.nextTopics || [],
        difficultyAdjustment: recommendations.difficultyAdjustment || 'maintain current level'
      };
    } catch (error) {
      console.error('Error generating learning recommendations:', error);
      throw error;
    }
  }

  /**
   * Check if the API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get API usage statistics
   */
  getUsageStats(): { configured: boolean; apiKey: string } {
    return {
      configured: this.isConfigured(),
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'Not configured'
    };
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();
export default openaiService;
