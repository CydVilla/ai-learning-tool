import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { LearningTrack, DifficultyLevel, Question, CodeExercise } from '../../types';
import { getTrackColors } from '../../utils/trackColors';
import LoadingStates from './LoadingStates';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GeneratorContainer = styled.div<{ color: string }>`
  background: linear-gradient(135deg, ${props => props.color} 0%, ${props => props.color}dd 100%);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  color: white;
  animation: ${fadeIn} 0.6s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const GeneratorHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const GeneratorTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: white;
`;

const GeneratorDescription = styled.p`
  opacity: 0.9;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const GeneratorForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  option {
    background: #2a2a2a;
    color: white;
  }
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const GenerateButton = styled.button<{ color: string }>`
  background: linear-gradient(135deg, ${props => props.color}, ${props => props.color}dd);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const ResultsTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: white;
`;

const QuestionCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const QuestionText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const OptionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OptionItem = styled.li<{ isCorrect?: boolean }>`
  padding: 0.5rem 0;
  font-size: 0.95rem;
  color: ${props => props.isCorrect ? '#4ecdc4' : 'rgba(255, 255, 255, 0.9)'};
  font-weight: ${props => props.isCorrect ? '600' : '400'};
  
  &:before {
    content: '${props => props.isCorrect ? '✓' : '•'}';
    margin-right: 0.5rem;
    color: ${props => props.isCorrect ? '#4ecdc4' : 'rgba(255, 255, 255, 0.6)'};
  }
`;

const Explanation = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.9;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.4);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  color: #ff6b6b;
  font-size: 0.9rem;
`;

interface QuestionGeneratorProps {
  track: LearningTrack;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({ track }) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  const colors = getTrackColors(track);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setGeneratedQuestions([]);

    try {
      // For now, we'll create mock AI-generated questions since we need to handle CORS and API key security
      const mockQuestions = await generateMockAIQuestions(track, difficulty, topic, count);
      setGeneratedQuestions(mockQuestions);
    } catch (err: any) {
      setError(err.message || 'Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockAIQuestions = async (
    track: LearningTrack, 
    difficulty: DifficultyLevel, 
    topic: string, 
    count: number
  ): Promise<Question[]> => {
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const questions: Question[] = [];
    
    for (let i = 0; i < count; i++) {
      const questionId = `ai_${track}_${difficulty}_${Date.now()}_${i}`;
      
      let questionData: Partial<Question> = {
        id: questionId,
        track,
        difficulty,
        type: 'multiple-choice',
        points: difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 15 : 20,
        tags: [topic || track, difficulty, 'ai-generated'],
      };

      // Generate track-specific questions
      if (track === 'html') {
        questionData = {
          ...questionData,
          content: topic 
            ? `What is the correct way to implement ${topic} in HTML?`
            : `Which HTML element is used for the largest heading?`,
          options: topic 
            ? [`<${topic}>`, `<div ${topic}>`, `<span ${topic}>`, `<p ${topic}>`]
            : ['<h1>', '<h6>', '<header>', '<title>'],
          correctAnswer: topic 
            ? `<${topic}>`
            : '<h1>',
          explanation: topic 
            ? `The <${topic}> element is the semantic way to implement ${topic} in HTML, providing better accessibility and SEO.`
            : 'The <h1> element represents the largest heading in HTML and should be used for the main heading of a page or section.',
        };
      } else if (track === 'css') {
        questionData = {
          ...questionData,
          content: topic 
            ? `How do you apply ${topic} in CSS?`
            : 'Which CSS property is used to change the text color?',
          options: topic 
            ? [`${topic}: value;`, `apply-${topic}: value;`, `set-${topic}: value;`, `${topic}-style: value;`]
            : ['color', 'text-color', 'font-color', 'text-style'],
          correctAnswer: topic 
            ? `${topic}: value;`
            : 'color',
          explanation: topic 
            ? `The ${topic} property is the standard CSS way to control ${topic} styling.`
            : 'The color property in CSS is used to set the color of text content.',
        };
      } else if (track === 'javascript') {
        questionData = {
          ...questionData,
          content: topic 
            ? `What is the correct syntax for ${topic} in JavaScript?`
            : 'How do you declare a variable in JavaScript?',
          options: topic 
            ? [`${topic}()`, `new ${topic}()`, `${topic}.method()`, `${topic}[]`]
            : ['var myVar;', 'variable myVar;', 'v myVar;', 'declare myVar;'],
          correctAnswer: topic 
            ? `${topic}()`
            : 'var myVar;',
          explanation: topic 
            ? `${topic}() is the standard syntax for ${topic} in JavaScript.`
            : 'The var keyword is used to declare variables in JavaScript (let and const are also modern alternatives).',
        };
      }

      questions.push(questionData as Question);
    }

    return questions;
  };

  return (
    <GeneratorContainer color={colors.primary}>
      <GeneratorHeader>
        <GeneratorTitle>🤖 AI Question Generator</GeneratorTitle>
        <GeneratorDescription>
          Generate personalized {track.toUpperCase()} questions using AI. Specify a topic for targeted practice!
        </GeneratorDescription>
      </GeneratorHeader>

      <GeneratorForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Difficulty Level</Label>
          <Select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Topic (Optional)</Label>
          <Input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={`e.g., ${track === 'html' ? 'forms, tables, semantic elements' : track === 'css' ? 'flexbox, grid, animations' : 'functions, arrays, promises'}`}
          />
        </FormGroup>

        <FormGroup>
          <Label>Number of Questions</Label>
          <Select 
            value={count} 
            onChange={(e) => setCount(parseInt(e.target.value))}
          >
            <option value={1}>1 Question</option>
            <option value={2}>2 Questions</option>
            <option value={3}>3 Questions</option>
            <option value={5}>5 Questions</option>
          </Select>
        </FormGroup>

        <GenerateButton 
          type="submit" 
          color={colors.secondary}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : `Generate ${count} Question${count > 1 ? 's' : ''}`}
        </GenerateButton>
      </GeneratorForm>

      {isGenerating && (
        <LoadingStates 
          type="ai-thinking" 
          message="AI is crafting your personalized questions..."
        />
      )}

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {generatedQuestions.length > 0 && (
        <ResultsContainer>
          <ResultsTitle>🎯 Generated Questions</ResultsTitle>
          {generatedQuestions.map((question, index) => (
            <QuestionCard key={question.id}>
              <QuestionText>
                {index + 1}. {question.content}
              </QuestionText>
              <OptionsList>
                {question.options?.map((option, optionIndex) => (
                  <OptionItem 
                    key={optionIndex}
                    isCorrect={option === question.correctAnswer}
                  >
                    {option}
                  </OptionItem>
                ))}
              </OptionsList>
              <Explanation>
                <strong>Explanation:</strong> {question.explanation}
              </Explanation>
            </QuestionCard>
          ))}
        </ResultsContainer>
      )}
    </GeneratorContainer>
  );
};

export default QuestionGenerator;
