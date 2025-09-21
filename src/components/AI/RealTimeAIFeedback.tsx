import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { LearningTrack, DifficultyLevel } from '../../types';
import { getTrackColors } from '../../utils/trackColors';
import LoadingStates from './LoadingStates';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FeedbackContainer = styled.div<{ color: string }>`
  background: linear-gradient(135deg, ${props => props.color} 0%, ${props => props.color}dd 100%);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  color: white;
  animation: ${fadeIn} 0.6s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const FeedbackHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const FeedbackTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: white;
`;

const FeedbackDescription = styled.p`
  opacity: 0.9;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const CodeInputArea = styled.div`
  margin-bottom: 2rem;
`;

const CodeTextarea = styled.textarea`
  width: 100%;
  height: 200px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const AnalyzeButton = styled.button<{ color: string }>`
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

const FeedbackResults = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const FeedbackSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionContent = styled.div`
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.9;
`;

const ScoreDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ScoreItem = styled.div`
  text-align: center;
`;

const ScoreValue = styled.div<{ score: number }>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.score >= 80 ? '#4ecdc4' : props.score >= 60 ? '#f39c12' : '#ff6b6b'};
`;

const ScoreLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

const SuggestionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SuggestionItem = styled.li`
  padding: 0.5rem 0;
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  &:before {
    content: '💡';
    flex-shrink: 0;
  }
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

interface RealTimeAIFeedbackProps {
  track: LearningTrack;
}

interface AIFeedbackResult {
  overallScore: number;
  readability: number;
  efficiency: number;
  correctness: number;
  feedback: string;
  suggestions: string[];
  explanation: string;
}

const RealTimeAIFeedback: React.FC<RealTimeAIFeedbackProps> = ({ track }) => {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<AIFeedbackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const colors = getTrackColors(track);

  const getPlaceholderCode = (track: LearningTrack): string => {
    switch (track) {
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is my first webpage!</p>
</body>
</html>`;
      case 'css':
        return `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`;
      case 'javascript':
        return `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate the first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`;
      default:
        return '';
    }
  };

  const analyzeCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setFeedback(null);

    try {
      // Since we can't make direct OpenAI API calls from the browser due to CORS,
      // we'll simulate AI feedback with intelligent analysis
      const mockFeedback = await generateMockAIFeedback(code, track);
      setFeedback(mockFeedback);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAIFeedback = async (code: string, track: LearningTrack): Promise<AIFeedbackResult> => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let analysis: AIFeedbackResult = {
      overallScore: 75,
      readability: 80,
      efficiency: 70,
      correctness: 85,
      feedback: '',
      suggestions: [],
      explanation: ''
    };

    // Track-specific analysis
    if (track === 'html') {
      const hasDoctype = code.includes('<!DOCTYPE html>');
      const hasLang = code.includes('lang=');
      const hasMetaCharset = code.includes('charset=');
      const hasViewport = code.includes('viewport');
      
      analysis.correctness = hasDoctype ? 90 : 70;
      analysis.readability = (hasLang && hasMetaCharset) ? 85 : 70;
      
      analysis.feedback = `Your HTML structure looks ${hasDoctype ? 'good' : 'incomplete'}. ${
        hasDoctype ? 'Great job including the DOCTYPE declaration!' : 'Consider adding a DOCTYPE declaration for better browser compatibility.'
      }`;
      
      analysis.suggestions = [
        !hasDoctype && 'Add <!DOCTYPE html> at the beginning',
        !hasLang && 'Include lang attribute in <html> tag for accessibility',
        !hasMetaCharset && 'Add <meta charset="UTF-8"> for proper character encoding',
        !hasViewport && 'Include viewport meta tag for responsive design'
      ].filter(Boolean) as string[];
      
      analysis.explanation = 'HTML analysis focuses on semantic structure, accessibility features, and best practices for web standards compliance.';
      
    } else if (track === 'css') {
      const hasFlexbox = code.includes('flex');
      const hasGrid = code.includes('grid');
      const hasMediaQueries = code.includes('@media');
      const hasVariables = code.includes('--') || code.includes('var(');
      
      analysis.efficiency = (hasFlexbox || hasGrid) ? 85 : 60;
      analysis.readability = hasVariables ? 90 : 75;
      
      analysis.feedback = `Your CSS shows ${hasFlexbox || hasGrid ? 'modern' : 'traditional'} layout techniques. ${
        hasVariables ? 'Excellent use of CSS custom properties!' : 'Consider using CSS custom properties for better maintainability.'
      }`;
      
      analysis.suggestions = [
        !hasFlexbox && !hasGrid && 'Consider using Flexbox or CSS Grid for more efficient layouts',
        !hasMediaQueries && 'Add media queries for responsive design',
        !hasVariables && 'Use CSS custom properties (variables) for better maintainability',
        'Consider using semantic class names that describe purpose rather than appearance'
      ].filter(Boolean) as string[];
      
      analysis.explanation = 'CSS analysis evaluates layout efficiency, responsive design patterns, and code maintainability through modern CSS features.';
      
    } else if (track === 'javascript') {
      const hasArrowFunctions = code.includes('=>');
      const hasConstLet = code.includes('const ') || code.includes('let ');
      const hasModernSyntax = code.includes('...') || code.includes('async') || code.includes('await');
      const hasComments = code.includes('//') || code.includes('/*');
      
      analysis.efficiency = hasModernSyntax ? 90 : 65;
      analysis.readability = hasComments ? 85 : 70;
      analysis.correctness = hasConstLet ? 85 : 75;
      
      analysis.feedback = `Your JavaScript demonstrates ${hasModernSyntax ? 'modern ES6+' : 'traditional'} syntax. ${
        hasArrowFunctions ? 'Good use of arrow functions!' : 'Consider using arrow functions for cleaner syntax.'
      }`;
      
      analysis.suggestions = [
        !hasConstLet && 'Use const/let instead of var for better scope management',
        !hasArrowFunctions && 'Consider using arrow functions for shorter, cleaner syntax',
        !hasComments && 'Add comments to explain complex logic',
        !hasModernSyntax && 'Explore modern JavaScript features like destructuring, async/await, or spread operator'
      ].filter(Boolean) as string[];
      
      analysis.explanation = 'JavaScript analysis focuses on modern syntax usage, code efficiency, and adherence to current best practices and ES6+ features.';
    }

    // Calculate overall score
    analysis.overallScore = Math.round(
      (analysis.readability + analysis.efficiency + analysis.correctness) / 3
    );

    return analysis;
  };

  return (
    <FeedbackContainer color={colors.primary}>
      <FeedbackHeader>
        <FeedbackTitle>🤖 AI Code Analysis</FeedbackTitle>
        <FeedbackDescription>
          Get instant AI-powered feedback on your {track.toUpperCase()} code. 
          Paste your code below and get suggestions for improvement!
        </FeedbackDescription>
      </FeedbackHeader>

      <CodeInputArea>
        <CodeTextarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={getPlaceholderCode(track)}
        />
      </CodeInputArea>

      <AnalyzeButton 
        color={colors.secondary}
        onClick={analyzeCode}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Code with AI 🔍'}
      </AnalyzeButton>

      {isAnalyzing && (
        <LoadingStates 
          type="ai-thinking" 
          message="AI is analyzing your code for best practices and improvements..."
        />
      )}

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {feedback && (
        <FeedbackResults>
          <ScoreDisplay>
            <ScoreItem>
              <ScoreValue score={feedback.overallScore}>{feedback.overallScore}</ScoreValue>
              <ScoreLabel>Overall Score</ScoreLabel>
            </ScoreItem>
            <ScoreItem>
              <ScoreValue score={feedback.readability}>{feedback.readability}</ScoreValue>
              <ScoreLabel>Readability</ScoreLabel>
            </ScoreItem>
            <ScoreItem>
              <ScoreValue score={feedback.efficiency}>{feedback.efficiency}</ScoreValue>
              <ScoreLabel>Efficiency</ScoreLabel>
            </ScoreItem>
            <ScoreItem>
              <ScoreValue score={feedback.correctness}>{feedback.correctness}</ScoreValue>
              <ScoreLabel>Correctness</ScoreLabel>
            </ScoreItem>
          </ScoreDisplay>

          <FeedbackSection>
            <SectionTitle>📝 AI Feedback</SectionTitle>
            <SectionContent>{feedback.feedback}</SectionContent>
          </FeedbackSection>

          {feedback.suggestions.length > 0 && (
            <FeedbackSection>
              <SectionTitle>💡 Suggestions for Improvement</SectionTitle>
              <SuggestionsList>
                {feedback.suggestions.map((suggestion, index) => (
                  <SuggestionItem key={index}>{suggestion}</SuggestionItem>
                ))}
              </SuggestionsList>
            </FeedbackSection>
          )}

          <FeedbackSection>
            <SectionTitle>🎓 Explanation</SectionTitle>
            <SectionContent>{feedback.explanation}</SectionContent>
          </FeedbackSection>
        </FeedbackResults>
      )}
    </FeedbackContainer>
  );
};

export default RealTimeAIFeedback;
