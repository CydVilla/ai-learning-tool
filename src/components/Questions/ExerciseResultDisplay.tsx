import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LearningTrack } from '../../types';
import { getTrackColors } from '../../utils/trackColors';
// import { FeedbackData } from '../../services/questionValidationService';

interface FeedbackData {
  isCorrect: boolean;
  score: number;
  totalScore: number;
  timeBonus: number;
  accuracyBonus: number;
  streakBonus: number;
  message: string;
  feedback: string;
  explanation?: string;
  suggestions?: string[];
  hints: string[];
  nextSteps: string[];
}

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

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const ResultContainer = styled.div<{ trackColor: string; isCorrect: boolean }>`
  background: linear-gradient(135deg, ${props => props.isCorrect ? '#4ecdc4' : '#ff6b6b'}20, ${props => props.isCorrect ? '#4ecdc4' : '#ff6b6b'}40);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid ${props => props.isCorrect ? '#4ecdc4' : '#ff6b6b'}40;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
`;

const ResultIcon = styled.div<{ isCorrect: boolean }>`
  width: 60px;
  height: 60px;
  background: ${props => props.isCorrect ? '#4ecdc4' : '#ff6b6b'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: ${props => props.isCorrect ? `${bounce} 0.6s ease-in-out` : `${pulse} 0.6s ease-in-out`};
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultTitle = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ResultSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
`;

const ScoreSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ScoreCard = styled.div<{ isCorrect: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  border: 1px solid ${props => props.isCorrect ? '#4ecdc4' : '#ff6b6b'}40;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const ScoreValue = styled.div<{ isCorrect: boolean }>`
  color: ${props => props.isCorrect ? '#4ecdc4' : '#ff6b6b'};
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const ScoreLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const FeedbackSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #4ecdc4;
`;

const FeedbackTitle = styled.h4`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
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
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
`;

const HintsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const HintsTitle = styled.h4`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HintsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const HintItem = styled.li`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.4;
  border-left: 3px solid #f39c12;
  animation: ${slideIn} 0.3s ease-out;
`;

const NextStepsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const NextStepsTitle = styled.h4`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NextStepsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NextStepItem = styled.li`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.4;
  border-left: 3px solid #4ecdc4;
  animation: ${slideIn} 0.3s ease-out;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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

interface ExerciseResultDisplayProps {
  feedback: FeedbackData;
  track: LearningTrack;
  timeSpent: number;
  onNext: () => void;
  onRetry: () => void;
  onReview: () => void;
  onHome: () => void;
}

const ExerciseResultDisplay: React.FC<ExerciseResultDisplayProps> = ({
  feedback,
  track,
  timeSpent,
  onNext,
  onRetry,
  onReview,
  onHome
}) => {
  const colors = getTrackColors(track);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getResultIcon = () => {
    if (feedback.isCorrect) {
      return '🎉';
    } else {
      return '💪';
    }
  };

  const getResultTitle = () => {
    if (feedback.isCorrect) {
      return 'Excellent Work!';
    } else {
      return 'Keep Learning!';
    }
  };

  const getResultSubtitle = () => {
    if (feedback.isCorrect) {
      return 'You got it right! Your understanding is growing.';
    } else {
      return 'Don\'t worry, every mistake is a learning opportunity.';
    }
  };

  return (
    <ResultContainer trackColor={colors.primary} isCorrect={feedback.isCorrect}>
      <BackgroundPattern />
      
      <ResultHeader>
        <ResultIcon isCorrect={feedback.isCorrect}>
          {getResultIcon()}
        </ResultIcon>
        <ResultInfo>
          <ResultTitle>{getResultTitle()}</ResultTitle>
          <ResultSubtitle>{getResultSubtitle()}</ResultSubtitle>
        </ResultInfo>
      </ResultHeader>

      <ScoreSection>
        <ScoreCard isCorrect={feedback.isCorrect}>
          <ScoreValue isCorrect={feedback.isCorrect}>
            {feedback.totalScore}
          </ScoreValue>
          <ScoreLabel>Total XP</ScoreLabel>
        </ScoreCard>
        
        <ScoreCard isCorrect={feedback.isCorrect}>
          <ScoreValue isCorrect={feedback.isCorrect}>
            {feedback.score}
          </ScoreValue>
          <ScoreLabel>Base Score</ScoreLabel>
        </ScoreCard>
        
        {feedback.timeBonus > 0 && (
          <ScoreCard isCorrect={feedback.isCorrect}>
            <ScoreValue isCorrect={feedback.isCorrect}>
              +{feedback.timeBonus}
            </ScoreValue>
            <ScoreLabel>Time Bonus</ScoreLabel>
          </ScoreCard>
        )}
        
        {feedback.accuracyBonus > 0 && (
          <ScoreCard isCorrect={feedback.isCorrect}>
            <ScoreValue isCorrect={feedback.isCorrect}>
              +{feedback.accuracyBonus}
            </ScoreValue>
            <ScoreLabel>Accuracy Bonus</ScoreLabel>
          </ScoreCard>
        )}
        
        {feedback.streakBonus > 0 && (
          <ScoreCard isCorrect={feedback.isCorrect}>
            <ScoreValue isCorrect={feedback.isCorrect}>
              +{feedback.streakBonus}
            </ScoreValue>
            <ScoreLabel>Streak Bonus</ScoreLabel>
          </ScoreCard>
        )}
        
        <ScoreCard isCorrect={feedback.isCorrect}>
          <ScoreValue isCorrect={feedback.isCorrect}>
            {formatTime(timeSpent)}
          </ScoreValue>
          <ScoreLabel>Time Spent</ScoreLabel>
        </ScoreCard>
      </ScoreSection>

      <FeedbackSection>
        <FeedbackTitle>
          💬 Feedback
        </FeedbackTitle>
        <FeedbackText>
          {feedback.feedback}
        </FeedbackText>
        {feedback.explanation && (
          <ExplanationText>
            <strong>Explanation:</strong> {feedback.explanation}
          </ExplanationText>
        )}
      </FeedbackSection>

      {feedback.hints.length > 0 && (
        <HintsSection>
          <HintsTitle>
            💡 Hints
          </HintsTitle>
          <HintsList>
            {feedback.hints.map((hint, index) => (
              <HintItem key={index}>
                {hint}
              </HintItem>
            ))}
          </HintsList>
        </HintsSection>
      )}

      {feedback.nextSteps.length > 0 && (
        <NextStepsSection>
          <NextStepsTitle>
            🎯 Next Steps
          </NextStepsTitle>
          <NextStepsList>
            {feedback.nextSteps.map((step, index) => (
              <NextStepItem key={index}>
                {step}
              </NextStepItem>
            ))}
          </NextStepsList>
        </NextStepsSection>
      )}

      <ActionButtons>
        <ActionButton
          trackColor={colors.primary}
          onClick={onNext}
        >
          ➡️ Next Question
        </ActionButton>
        
        {!feedback.isCorrect && (
          <ActionButton
            trackColor={colors.primary}
            variant="secondary"
            onClick={onRetry}
          >
            🔄 Try Again
          </ActionButton>
        )}
        
        <ActionButton
          trackColor={colors.primary}
          variant="secondary"
          onClick={onReview}
        >
          📚 Review
        </ActionButton>
        
        <ActionButton
          trackColor={colors.primary}
          variant="secondary"
          onClick={onHome}
        >
          🏠 Home
        </ActionButton>
      </ActionButtons>
    </ResultContainer>
  );
};

export default ExerciseResultDisplay;
