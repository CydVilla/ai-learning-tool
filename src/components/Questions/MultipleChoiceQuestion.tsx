import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Question, QuestionType, LearningTrack } from '../../types';
import { getTrackColors } from '../../utils/trackColors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const QuestionContainer = styled.div<{ trackColor: string }>`
  background: linear-gradient(135deg, ${props => props.trackColor}20, ${props => props.trackColor}40);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid ${props => props.trackColor}40;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
`;

const QuestionIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  background: ${props => props.color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const QuestionInfo = styled.div`
  flex: 1;
`;

const QuestionTitle = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaBadge = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const QuestionContent = styled.div`
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
`;

const QuestionText = styled.div`
  color: white;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid rgba(255, 255, 255, 0.3);
`;

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.3);
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled.button<{ 
  isSelected: boolean; 
  isCorrect: boolean; 
  isIncorrect: boolean; 
  trackColor: string;
  disabled: boolean;
}>`
  background: ${props => {
    if (props.disabled) return 'rgba(255, 255, 255, 0.1)';
    if (props.isCorrect) return '#4ecdc4';
    if (props.isIncorrect) return '#ff6b6b';
    if (props.isSelected) return props.trackColor;
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: white;
  border: 2px solid ${props => {
    if (props.disabled) return 'rgba(255, 255, 255, 0.2)';
    if (props.isCorrect) return '#4ecdc4';
    if (props.isIncorrect) return '#ff6b6b';
    if (props.isSelected) return props.trackColor;
    return 'rgba(255, 255, 255, 0.2)';
  }};
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  animation: ${props => props.isIncorrect ? `${shake} 0.5s ease-in-out` : 'none'};
  
  &:hover {
    ${props => !props.disabled && `
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    `}
  }
  
  &:active {
    ${props => !props.disabled && 'transform: translateY(0);'}
  }
  
  ${props => props.isSelected && !props.disabled && `
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  `}
`;

const OptionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OptionLetter = styled.div<{ isSelected: boolean; isCorrect: boolean; isIncorrect: boolean; trackColor: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  background: ${props => {
    if (props.isCorrect) return '#4ecdc4';
    if (props.isIncorrect) return '#ff6b6b';
    if (props.isSelected) return props.trackColor;
    return 'rgba(255, 255, 255, 0.2)';
  }};
  color: white;
  border: 2px solid ${props => {
    if (props.isCorrect) return '#4ecdc4';
    if (props.isIncorrect) return '#ff6b6b';
    if (props.isSelected) return props.trackColor;
    return 'rgba(255, 255, 255, 0.3)';
  }};
`;

const OptionText = styled.div`
  flex: 1;
  line-height: 1.4;
`;

const FeedbackSection = styled.div<{ show: boolean }>`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border-left: 4px solid #4ecdc4;
  animation: ${props => props.show ? `${slideIn} 0.3s ease-out` : 'none'};
  display: ${props => props.show ? 'block' : 'none'};
`;

const FeedbackTitle = styled.h4`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FeedbackText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const ExplanationText = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
  font-style: italic;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ trackColor: string; variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' : props.trackColor};
  color: white;
  border: 1px solid ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : props.trackColor};
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : props.trackColor};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Timer = styled.div<{ trackColor: string; timeLeft: number; totalTime: number }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.trackColor};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  ${props => props.timeLeft < props.totalTime * 0.2 && `
    animation: ${pulse} 1s infinite;
    background: #ff6b6b;
  `}
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  z-index: 1;
`;

interface MultipleChoiceQuestionProps {
  question: Question;
  track: LearningTrack;
  onAnswer: (selectedAnswer: string, isCorrect: boolean, timeSpent: number) => void;
  onNext: () => void;
  onSkip: () => void;
  timeLimit?: number;
  showFeedback?: boolean;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  track,
  onAnswer,
  onNext,
  onSkip,
  timeLimit = 60,
  showFeedback = true
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [startTime, setStartTime] = useState(Date.now());

  const colors = getTrackColors(track);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      // Auto-submit when time runs out
      handleSubmit(null);
    }
  }, [timeLeft, isAnswered]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTimeLeft(timeLimit);
    setStartTime(Date.now());
  }, [question.id, timeLimit]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = (answer: string | null) => {
    if (isAnswered) return;
    
    const finalAnswer = answer || selectedAnswer;
    if (!finalAnswer) return;

    const correct = finalAnswer === question.correctAnswer;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    
    setIsAnswered(true);
    setIsCorrect(correct);
    
    onAnswer(finalAnswer, correct, timeSpent);
  };

  const handleNext = () => {
    onNext();
  };

  const handleSkip = () => {
    onSkip();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4ecdc4';
      case 'intermediate': return '#f39c12';
      case 'advanced': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <QuestionContainer trackColor={colors.primary}>
      <BackgroundPattern />
      
      {timeLimit > 0 && (
        <Timer trackColor={colors.primary} timeLeft={timeLeft} totalTime={timeLimit}>
          ⏱️ {formatTime(timeLeft)}
        </Timer>
      )}

      <QuestionHeader>
        <QuestionIcon color={colors.primary}>
          ❓
        </QuestionIcon>
        <QuestionInfo>
          <QuestionTitle>Multiple Choice Question</QuestionTitle>
          <QuestionMeta>
            <MetaBadge color={getDifficultyColor(question.difficulty)}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </MetaBadge>
            <MetaBadge color={colors.secondary}>
              {question.xp} XP
            </MetaBadge>
            <MetaBadge color={colors.accent}>
              Question {question.id}
            </MetaBadge>
          </QuestionMeta>
        </QuestionInfo>
      </QuestionHeader>

      <QuestionContent>
        <QuestionText>
          {question.question}
        </QuestionText>

        {question.codeExample && (
          <CodeBlock>
            {question.codeExample}
          </CodeBlock>
        )}

        <OptionsContainer>
          {question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedAnswer === option;
            const isCorrect = isAnswered && option === question.correctAnswer;
            const isIncorrect = isAnswered && isSelected && !isCorrect;

            return (
              <OptionButton
                key={index}
                isSelected={isSelected}
                isCorrect={isCorrect}
                isIncorrect={isIncorrect}
                trackColor={colors.primary}
                disabled={isAnswered}
                onClick={() => handleAnswerSelect(option)}
              >
                <OptionLabel>
                  <OptionLetter
                    isSelected={isSelected}
                    isCorrect={isCorrect}
                    isIncorrect={isIncorrect}
                    trackColor={colors.primary}
                  >
                    {letter}
                  </OptionLetter>
                  <OptionText>{option}</OptionText>
                </OptionLabel>
              </OptionButton>
            );
          })}
        </OptionsContainer>

        {showFeedback && isAnswered && (
          <FeedbackSection show={isAnswered}>
            <FeedbackTitle>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </FeedbackTitle>
            <FeedbackText>
              {isCorrect ? question.feedback?.correct : question.feedback?.incorrect}
            </FeedbackText>
            {question.explanation && (
              <ExplanationText>
                <strong>Explanation:</strong> {question.explanation}
              </ExplanationText>
            )}
          </FeedbackSection>
        )}

        <ActionButtons>
          {!isAnswered ? (
            <>
              <ActionButton
                trackColor={colors.primary}
                variant="secondary"
                onClick={handleSkip}
              >
                ⏭️ Skip
              </ActionButton>
              <ActionButton
                trackColor={colors.primary}
                onClick={() => handleSubmit(null)}
                disabled={!selectedAnswer}
              >
                ✅ Submit Answer
              </ActionButton>
            </>
          ) : (
            <ActionButton
              trackColor={colors.primary}
              onClick={handleNext}
            >
              ➡️ Next Question
            </ActionButton>
          )}
        </ActionButtons>
      </QuestionContent>
    </QuestionContainer>
  );
};

export default MultipleChoiceQuestion;
