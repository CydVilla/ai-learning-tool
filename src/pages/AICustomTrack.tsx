import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LearningTrack, DifficultyLevel, Question } from '../types';
import LoadingStates from '../components/AI/LoadingStates';
import MultipleChoiceQuestion from '../components/Questions/MultipleChoiceQuestion';
import { useUserProgress } from '../context/UserProgressContext';
import { useXPSystem } from '../hooks/useXPSystem';
import { useStreakManagement } from '../hooks/useStreakManagement';
import { useDailyGoalManagement } from '../hooks/useDailyGoalManagement';
import { openaiService } from '../services/openaiService';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(155, 89, 182, 0.3); }
  50% { box-shadow: 0 0 30px rgba(155, 89, 182, 0.6); }
`;

const TrackContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 50%, #732d91 100%);
  padding: 2rem;
  color: white;
`;

const TrackHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.8s ease-out;
`;

const TrackIcon = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 1.5rem;
  color: white;
  animation: ${glow} 3s infinite;
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

const TrackTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #fff, #f39c12);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ApiStatusBadge = styled.div<{ $status: 'checking' | 'connected' | 'mock' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  ${props => props.$status === 'connected' && `
    background: rgba(46, 204, 113, 0.2);
    color: #2ecc71;
    border: 1px solid rgba(46, 204, 113, 0.3);
  `}
  
  ${props => props.$status === 'mock' && `
    background: rgba(241, 196, 15, 0.2);
    color: #f1c40f;
    border: 1px solid rgba(241, 196, 15, 0.3);
  `}
  
  ${props => props.$status === 'checking' && `
    background: rgba(52, 152, 219, 0.2);
    color: #3498db;
    border: 1px solid rgba(52, 152, 219, 0.3);
  `}
`;

const TrackDescription = styled.p`
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 90%;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const SetupContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 3rem;
  margin: 2rem auto;
  max-width: 800px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 15px;
  }
`;

const SetupTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: white;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1.1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #f39c12;
    box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.2);
  }

  option {
    background: #2a2a2a;
    color: white;
    padding: 0.5rem;
  }
`;

const TopicInput = styled.input`
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #f39c12;
    box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const TopicSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SuggestionChip = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const GenerateButton = styled.button`
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 25px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 2rem auto;
  display: block;
  min-width: 250px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(243, 156, 18, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuizContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const QuizHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const QuizTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
`;

const QuizMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const MetaValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #f39c12;
`;

const MetaLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ProgressSection = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProgressTitle = styled.h3`
  color: white;
  margin: 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #f39c12, #e67e22);
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`;

const CompletionScreen = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const CompletionIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 2rem;
  animation: ${glow} 2s infinite;
`;

const CompletionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #f39c12;
`;

const CompletionStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  min-width: 120px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #f39c12;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'secondary' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'linear-gradient(135deg, #f39c12, #e67e22)'};
  color: white;
  border: ${props => props.$variant === 'secondary' 
    ? '2px solid rgba(255, 255, 255, 0.3)' 
    : 'none'};
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid rgba(255, 107, 107, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  color: #ff6b6b;
  text-align: center;
  font-size: 1.1rem;
`;

interface AICustomTrackProps {}

interface CustomQuiz {
  id: string;
  topic: string;
  track: LearningTrack;
  difficulty: DifficultyLevel;
  questionCount: number;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  startTime: number;
  completed: boolean;
}

const AICustomTrack: React.FC<AICustomTrackProps> = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'setup' | 'generating' | 'quiz' | 'completed'>('setup');
  const [topic, setTopic] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<LearningTrack>('javascript');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [questionCount, setQuestionCount] = useState(5);
  const [customQuiz, setCustomQuiz] = useState<CustomQuiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'mock'>('checking');

  const { updateProgress } = useUserProgress();
  const { getLevelInfo } = useXPSystem();
  const { updateStreakAfterActivity } = useStreakManagement();
  const { updateDailyProgress } = useDailyGoalManagement();

  // Check OpenAI API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const isConfigured = openaiService.isConfigured();
        if (isConfigured) {
          setApiStatus('connected');
          console.log('✅ OpenAI API: Connected with API key');
        } else {
          setApiStatus('mock');
          console.log('⚠️ OpenAI API: Using mock responses (no API key)');
        }
      } catch (error) {
        setApiStatus('mock');
        console.log('❌ OpenAI API: Error checking status, using mock responses');
      }
    };

    checkApiStatus();
  }, []);

  const topicSuggestions = {
    html: ['Semantic Elements', 'Forms & Validation', 'Accessibility', 'HTML5 APIs', 'Meta Tags', 'Tables', 'Media Elements'],
    css: ['Flexbox', 'CSS Grid', 'Animations', 'Responsive Design', 'CSS Variables', 'Selectors', 'Box Model', 'Transforms'],
    javascript: ['Functions', 'Arrays', 'Objects', 'Promises', 'Async/Await', 'DOM Manipulation', 'ES6 Features', 'Error Handling']
  };

  const generateCustomQuiz = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your custom quiz!');
      return;
    }

    setCurrentStep('generating');
    setError(null);

    try {
      let questions: Question[];
      
      // Try to use OpenAI API if configured, otherwise fallback to mock questions
      if (openaiService.isConfigured()) {
        console.log('🤖 Using OpenAI to generate questions...');
        questions = await generateAIQuestions(topic, selectedTrack, difficulty, questionCount);
      } else {
        console.log('⚠️ Using mock questions (OpenAI not configured)...');
        questions = await generateAdvancedMockQuestions(topic, selectedTrack, difficulty, questionCount);
      }
      
      const quiz: CustomQuiz = {
        id: `custom_${Date.now()}`,
        topic,
        track: selectedTrack,
        difficulty,
        questionCount,
        questions,
        currentQuestionIndex: 0,
        score: 0,
        correctAnswers: 0,
        startTime: Date.now(),
        completed: false
      };

      setCustomQuiz(quiz);
      setCurrentStep('quiz');
    } catch (err: any) {
      console.error('❌ Quiz generation failed:', err);
      setError(err.message || 'Failed to generate custom quiz. Please try again.');
      setCurrentStep('setup');
    }
  };

  const generateAdvancedMockQuestions = async (
    topic: string, 
    track: LearningTrack, 
    difficulty: DifficultyLevel, 
    count: number
  ): Promise<Question[]> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const questions: Question[] = [];
    const baseXP = difficulty === 'beginner' ? 15 : difficulty === 'intermediate' ? 25 : 35;

    for (let i = 0; i < count; i++) {
      const questionId = `ai_custom_${track}_${Date.now()}_${i}`;
      
      let questionData: Question;

      if (track === 'html') {
        questionData = generateHTMLQuestion(questionId, topic, difficulty, baseXP, i);
      } else if (track === 'css') {
        questionData = generateCSSQuestion(questionId, topic, difficulty, baseXP, i);
      } else {
        questionData = generateJavaScriptQuestion(questionId, topic, difficulty, baseXP, i);
      }

      questions.push(questionData);
    }

    return questions;
  };

  const generateAIQuestions = async (
    topic: string, 
    track: LearningTrack, 
    difficulty: DifficultyLevel, 
    count: number
  ): Promise<Question[]> => {
    console.log(`🤖 Generating ${count} ${difficulty} ${track.toUpperCase()} questions about "${topic}" using OpenAI...`);
    
    try {
      // Use OpenAI to generate questions
      const response = await openaiService.generateQuestions({
        topic,
        language: track,
        difficulty,
        count,
        questionType: 'multiple-choice'
      });

      const questions: Question[] = response.questions.map((q, index) => ({
        id: `ai_custom_${track}_${Date.now()}_${index}`,
        track,
        type: 'multiple-choice',
        difficulty,
        content: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: difficulty === 'beginner' ? 15 : difficulty === 'intermediate' ? 25 : 35,
        tags: [topic, difficulty, 'ai-generated', 'custom']
      }));

      console.log(`✅ Successfully generated ${questions.length} AI questions`);
      return questions;
    } catch (error) {
      console.error('❌ OpenAI question generation failed:', error);
      // Fallback to mock questions if OpenAI fails
      console.log('🔄 Falling back to mock questions...');
      return generateAdvancedMockQuestions(topic, track, difficulty, count);
    }
  };

  const generateHTMLQuestion = (id: string, topic: string, difficulty: DifficultyLevel, xp: number, index: number): Question => {
    const questions = {
      'semantic elements': [
        {
          content: 'Which HTML element represents the main content of a document?',
          options: ['<main>', '<content>', '<primary>', '<body>'],
          correctAnswer: '<main>',
          explanation: 'The <main> element represents the dominant content of the <body> of a document, excluding headers, footers, and navigation.'
        },
        {
          content: 'What is the purpose of the <article> element?',
          options: ['To style content', 'To represent standalone content', 'To create links', 'To add images'],
          correctAnswer: 'To represent standalone content',
          explanation: 'The <article> element represents a standalone piece of content that could be distributed independently.'
        },
        {
          content: 'Which element should be used for navigation links?',
          options: ['<nav>', '<menu>', '<links>', '<navigation>'],
          correctAnswer: '<nav>',
          explanation: 'The <nav> element represents a section of navigation links.'
        }
      ],
      'forms': [
        {
          content: 'Which input type is best for email addresses?',
          options: ['type="text"', 'type="email"', 'type="mail"', 'type="address"'],
          correctAnswer: 'type="email"',
          explanation: 'The email input type provides built-in validation and mobile keyboard optimization for email addresses.'
        },
        {
          content: 'What attribute makes a form field required?',
          options: ['required', 'mandatory', 'needed', 'must-fill'],
          correctAnswer: 'required',
          explanation: 'The required attribute specifies that an input field must be filled out before submitting the form.'
        }
      ],
      'default': [
        {
          content: `What is a key concept in ${topic}?`,
          options: ['Structure', 'Semantics', 'Accessibility', 'All of the above'],
          correctAnswer: 'All of the above',
          explanation: `${topic} involves multiple important concepts in HTML development.`
        }
      ]
    };

    const topicKey = topic.toLowerCase().replace(/\s+/g, ' ');
    const topicQuestions = questions[topicKey as keyof typeof questions] || questions['default'];
    const questionTemplate = topicQuestions[index % topicQuestions.length];

    return {
      id,
      track: 'html',
      type: 'multiple-choice',
      difficulty,
      content: questionTemplate.content,
      options: questionTemplate.options,
      correctAnswer: questionTemplate.correctAnswer,
      explanation: questionTemplate.explanation,
      points: xp,
      tags: [topic, difficulty, 'ai-generated', 'custom']
    };
  };

  const generateCSSQuestion = (id: string, topic: string, difficulty: DifficultyLevel, xp: number, index: number): Question => {
    const questions = {
      'flexbox': [
        {
          content: 'Which CSS property is used to create a flex container?',
          options: ['display: flex', 'flex: container', 'layout: flex', 'container: flex'],
          correctAnswer: 'display: flex',
          explanation: 'The display: flex property creates a flex container, enabling flexbox layout for its children.'
        },
        {
          content: 'What does justify-content: center do in flexbox?',
          options: ['Centers items vertically', 'Centers items horizontally', 'Centers the container', 'Creates space between items'],
          correctAnswer: 'Centers items horizontally',
          explanation: 'justify-content: center centers flex items along the main axis (horizontally by default).'
        }
      ],
      'css grid': [
        {
          content: 'How do you create a CSS Grid container?',
          options: ['display: grid', 'layout: grid', 'grid: container', 'container: grid'],
          correctAnswer: 'display: grid',
          explanation: 'The display: grid property creates a grid container, enabling CSS Grid layout.'
        },
        {
          content: 'Which property defines the columns in a grid?',
          options: ['grid-template-columns', 'grid-columns', 'columns', 'grid-column-template'],
          correctAnswer: 'grid-template-columns',
          explanation: 'The grid-template-columns property defines the line names and track sizing functions of the grid columns.'
        }
      ],
      'animations': [
        {
          content: 'Which CSS property is used to create animations?',
          options: ['animation', 'animate', 'motion', 'transition'],
          correctAnswer: 'animation',
          explanation: 'The animation property is a shorthand for animation-* properties to create CSS animations.'
        }
      ],
      'default': [
        {
          content: `What is an important aspect of ${topic} in CSS?`,
          options: ['Styling', 'Layout', 'Responsiveness', 'All of the above'],
          correctAnswer: 'All of the above',
          explanation: `${topic} involves multiple important aspects of CSS development.`
        }
      ]
    };

    const topicKey = topic.toLowerCase().replace(/\s+/g, ' ');
    const topicQuestions = questions[topicKey as keyof typeof questions] || questions['default'];
    const questionTemplate = topicQuestions[index % topicQuestions.length];

    return {
      id,
      track: 'css',
      type: 'multiple-choice',
      difficulty,
      content: questionTemplate.content,
      options: questionTemplate.options,
      correctAnswer: questionTemplate.correctAnswer,
      explanation: questionTemplate.explanation,
      points: xp,
      tags: [topic, difficulty, 'ai-generated', 'custom']
    };
  };

  const generateJavaScriptQuestion = (id: string, topic: string, difficulty: DifficultyLevel, xp: number, index: number): Question => {
    const questions = {
      'functions': [
        {
          content: 'What is the correct syntax for declaring a function in JavaScript?',
          options: ['function myFunc() {}', 'func myFunc() {}', 'def myFunc() {}', 'function: myFunc() {}'],
          correctAnswer: 'function myFunc() {}',
          explanation: 'The function keyword followed by the function name and parentheses is the standard function declaration syntax.'
        },
        {
          content: 'What does a return statement do in a function?',
          options: ['Stops the function and returns a value', 'Restarts the function', 'Declares a variable', 'Creates a loop'],
          correctAnswer: 'Stops the function and returns a value',
          explanation: 'The return statement stops function execution and returns a specified value to the function caller.'
        },
        {
          content: 'What is an arrow function?',
          options: ['() => {}', '-> () {}', '=>() {}', 'func => {}'],
          correctAnswer: '() => {}',
          explanation: 'Arrow functions provide a shorter syntax for writing functions using the => operator.'
        }
      ],
      'arrays': [
        {
          content: 'How do you add an element to the end of an array?',
          options: ['array.push(element)', 'array.add(element)', 'array.append(element)', 'array.insert(element)'],
          correctAnswer: 'array.push(element)',
          explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.'
        },
        {
          content: 'How do you remove the last element from an array?',
          options: ['array.pop()', 'array.remove()', 'array.delete()', 'array.removeLast()'],
          correctAnswer: 'array.pop()',
          explanation: 'The pop() method removes the last element from an array and returns that element.'
        }
      ],
      'objects': [
        {
          content: 'How do you access a property of an object?',
          options: ['object.property', 'object->property', 'object::property', 'object[property]'],
          correctAnswer: 'object.property',
          explanation: 'You can access object properties using dot notation (object.property) or bracket notation (object["property"]).'
        }
      ],
      'default': [
        {
          content: `What is a fundamental concept in ${topic}?`,
          options: ['Variables', 'Functions', 'Logic', 'All of the above'],
          correctAnswer: 'All of the above',
          explanation: `${topic} involves multiple fundamental concepts in JavaScript development.`
        }
      ]
    };

    const topicKey = topic.toLowerCase().replace(/\s+/g, ' ');
    const topicQuestions = questions[topicKey as keyof typeof questions] || questions['default'];
    const questionTemplate = topicQuestions[index % topicQuestions.length];

    return {
      id,
      track: 'javascript',
      type: 'multiple-choice',
      difficulty,
      content: questionTemplate.content,
      options: questionTemplate.options,
      correctAnswer: questionTemplate.correctAnswer,
      explanation: questionTemplate.explanation,
      points: xp,
      tags: [topic, difficulty, 'ai-generated', 'custom']
    };
  };

  const handleAnswer = (selectedAnswer: string, isCorrect: boolean, timeSpent: number) => {
    if (!customQuiz) return;

    const currentQuestion = customQuiz.questions[customQuiz.currentQuestionIndex];
    const xpEarned = isCorrect ? currentQuestion.points : 0;

    // Update progress
    updateProgress(customQuiz.track, currentQuestion.id, isCorrect, timeSpent);

    // Update quiz state
    const updatedQuiz = {
      ...customQuiz,
      score: customQuiz.score + xpEarned,
      correctAnswers: customQuiz.correctAnswers + (isCorrect ? 1 : 0),
      currentQuestionIndex: customQuiz.currentQuestionIndex + 1
    };

    if (updatedQuiz.currentQuestionIndex >= customQuiz.questions.length) {
      updatedQuiz.completed = true;
      setCurrentStep('completed');
    }

    setCustomQuiz(updatedQuiz);

    // Update streaks and daily progress
    try {
      updateStreakAfterActivity(xpEarned, 1, [customQuiz.track]);
      updateDailyProgress('questions', 1);
      updateDailyProgress('xp', xpEarned);
    } catch (error) {
      console.log('Non-critical update error:', error);
    }
  };

  const resetQuiz = () => {
    setCustomQuiz(null);
    setCurrentStep('setup');
    setTopic('');
    setError(null);
  };

  const currentQuestion = customQuiz?.questions[customQuiz.currentQuestionIndex];
  const progress = customQuiz ? ((customQuiz.currentQuestionIndex) / customQuiz.questions.length) * 100 : 0;

  if (currentStep === 'setup') {
    return (
      <TrackContainer>
        <TrackHeader>
          <TrackIcon>🤖</TrackIcon>
          <TrackTitle>AI Custom Track</TrackTitle>
          <ApiStatusBadge $status={apiStatus}>
            {apiStatus === 'checking' && '🔄 Checking API...'}
            {apiStatus === 'connected' && '✅ AI Powered'}
            {apiStatus === 'mock' && '⚠️ Demo Mode'}
          </ApiStatusBadge>
          <TrackDescription>
            Create personalized coding quizzes on any topic using AI. 
            Choose your subject, difficulty, and question count for a tailored learning experience!
          </TrackDescription>
        </TrackHeader>

        <SetupContainer>
          <SetupTitle>🎯 Create Your Custom Quiz</SetupTitle>
          
          <FormGrid>
            <FormGroup>
              <Label>📚 Programming Language</Label>
              <Select 
                value={selectedTrack} 
                onChange={(e) => setSelectedTrack(e.target.value as LearningTrack)}
              >
                <option value="html">HTML - Structure & Markup</option>
                <option value="css">CSS - Styling & Layout</option>
                <option value="javascript">JavaScript - Logic & Interactivity</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>⚡ Difficulty Level</Label>
              <Select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              >
                <option value="beginner">Beginner - Learn the basics</option>
                <option value="intermediate">Intermediate - Build skills</option>
                <option value="advanced">Advanced - Master concepts</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>🎯 Topic Focus</Label>
              <TopicInput
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={`e.g., ${selectedTrack === 'html' ? 'semantic elements, forms' : selectedTrack === 'css' ? 'flexbox, animations' : 'functions, arrays'}`}
              />
              <TopicSuggestions>
                {topicSuggestions[selectedTrack].map(suggestion => (
                  <SuggestionChip
                    key={suggestion}
                    onClick={() => setTopic(suggestion)}
                  >
                    {suggestion}
                  </SuggestionChip>
                ))}
              </TopicSuggestions>
            </FormGroup>

            <FormGroup>
              <Label>📊 Number of Questions</Label>
              <Select 
                value={questionCount} 
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              >
                <option value={3}>3 Questions - Quick Practice</option>
                <option value={5}>5 Questions - Standard Quiz</option>
                <option value={10}>10 Questions - Deep Dive</option>
                <option value={15}>15 Questions - Comprehensive</option>
                <option value={20}>20 Questions - Challenge Mode</option>
              </Select>
            </FormGroup>
          </FormGrid>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <GenerateButton onClick={generateCustomQuiz}>
            🚀 Generate AI Quiz
          </GenerateButton>
        </SetupContainer>
      </TrackContainer>
    );
  }

  if (currentStep === 'generating') {
    return (
      <TrackContainer>
        <TrackHeader>
          <TrackIcon>🤖</TrackIcon>
          <TrackTitle>AI Custom Track</TrackTitle>
          <TrackDescription>
            AI is crafting your personalized {selectedTrack.toUpperCase()} quiz about "{topic}"...
          </TrackDescription>
        </TrackHeader>

        <LoadingStates 
          type="ai-thinking" 
          message={`Creating ${questionCount} ${difficulty} level questions about ${topic}...`}
          submessage="This may take a few seconds"
        />
      </TrackContainer>
    );
  }

  if (currentStep === 'quiz' && customQuiz && currentQuestion) {
    return (
      <TrackContainer>
        <QuizContainer>
          <QuizHeader>
            <QuizTitle>🎯 {customQuiz.topic} Quiz</QuizTitle>
            <QuizMeta>
              <MetaItem>
                <MetaValue>{customQuiz.track.toUpperCase()}</MetaValue>
                <MetaLabel>Language</MetaLabel>
              </MetaItem>
              <MetaItem>
                <MetaValue>{customQuiz.difficulty}</MetaValue>
                <MetaLabel>Difficulty</MetaLabel>
              </MetaItem>
              <MetaItem>
                <MetaValue>{customQuiz.currentQuestionIndex + 1}/{customQuiz.questionCount}</MetaValue>
                <MetaLabel>Progress</MetaLabel>
              </MetaItem>
              <MetaItem>
                <MetaValue>{customQuiz.score}</MetaValue>
                <MetaLabel>Score</MetaLabel>
              </MetaItem>
            </QuizMeta>
          </QuizHeader>

          <ProgressSection>
            <ProgressHeader>
              <ProgressTitle>Quiz Progress</ProgressTitle>
              <div>{Math.round(progress)}% Complete</div>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill $percentage={progress} />
            </ProgressBar>
          </ProgressSection>

          <MultipleChoiceQuestion
            question={currentQuestion}
            track={customQuiz.track}
            onAnswer={handleAnswer}
            onNext={() => {}}
            onSkip={() => handleAnswer('', false, 0)}
            timeLimit={difficulty === 'beginner' ? 60 : difficulty === 'intermediate' ? 45 : 30}
            showFeedback={true}
          />
        </QuizContainer>
      </TrackContainer>
    );
  }

  if (currentStep === 'completed' && customQuiz) {
    const accuracy = Math.round((customQuiz.correctAnswers / customQuiz.questionCount) * 100);
    const timeSpent = Math.round((Date.now() - customQuiz.startTime) / 1000 / 60);
    const levelInfo = getLevelInfo();

    return (
      <TrackContainer>
        <CompletionScreen>
          <CompletionIcon>🎉</CompletionIcon>
          <CompletionTitle>Quiz Complete!</CompletionTitle>
          
          <CompletionStats>
            <StatCard>
              <StatValue>{customQuiz.correctAnswers}/{customQuiz.questionCount}</StatValue>
              <StatLabel>Correct Answers</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{accuracy}%</StatValue>
              <StatLabel>Accuracy</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{customQuiz.score}</StatValue>
              <StatLabel>XP Earned</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{timeSpent}m</StatValue>
              <StatLabel>Time Spent</StatLabel>
            </StatCard>
          </CompletionStats>

          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            Great work on your {customQuiz.topic} quiz! You're now level {levelInfo.currentLevel} with {levelInfo.currentXP} XP.
          </p>

          <ActionButtons>
            <ActionButton onClick={resetQuiz}>
              🔄 Create New Quiz
            </ActionButton>
            <ActionButton $variant="secondary" onClick={() => navigate('/')}>
              🏠 Go Home
            </ActionButton>
          </ActionButtons>
        </CompletionScreen>
      </TrackContainer>
    );
  }

  return null;
};

export default AICustomTrack;
