import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LearningTrack } from '../../types';
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

const NavigationContainer = styled.div<{ trackColor: string }>`
  background: linear-gradient(135deg, ${props => props.trackColor}20, ${props => props.trackColor}40);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${props => props.trackColor}40;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
`;

const NavigationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`;

const NavigationIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  background: ${props => props.color};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const NavigationTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const NavigationContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 2;
`;

const ProgressSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProgressInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
`;

const ProgressNumber = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const ProgressLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  text-align: center;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.color};
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${slideIn} 2s infinite;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button<{ 
  trackColor: string; 
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
}>`
  background: ${props => {
    if (props.disabled) return 'rgba(255, 255, 255, 0.1)';
    if (props.variant === 'primary') return props.trackColor;
    if (props.variant === 'secondary') return 'rgba(255, 255, 255, 0.1)';
    return 'rgba(255, 255, 255, 0.05)';
  }};
  color: white;
  border: 1px solid ${props => {
    if (props.disabled) return 'rgba(255, 255, 255, 0.2)';
    if (props.variant === 'primary') return props.trackColor;
    if (props.variant === 'secondary') return 'rgba(255, 255, 255, 0.2)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    ${props => !props.disabled && `
      background: ${props.variant === 'primary' ? props.trackColor : 'rgba(255, 255, 255, 0.2)'};
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `}
  }
  
  &:active {
    ${props => !props.disabled && 'transform: translateY(0);'}
  }
`;

const QuickNavSection = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const QuickNavButton = styled.button<{ 
  trackColor: string; 
  isActive: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
}>`
  background: ${props => {
    if (props.isCurrent) return props.trackColor;
    if (props.isCompleted) return '#4ecdc4';
    if (props.isActive) return 'rgba(255, 255, 255, 0.2)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: white;
  border: 1px solid ${props => {
    if (props.isCurrent) return props.trackColor;
    if (props.isCompleted) return '#4ecdc4';
    if (props.isActive) return 'rgba(255, 255, 255, 0.3)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 40px;
  justify-content: center;
  
  &:hover {
    background: ${props => {
      if (props.isCurrent) return props.trackColor;
      if (props.isCompleted) return '#4ecdc4';
      return 'rgba(255, 255, 255, 0.3)';
    }};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${props => props.isCurrent && `
    animation: ${pulse} 2s infinite;
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

interface QuestionNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  track: LearningTrack;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onGoToQuestion: (questionNumber: number) => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  canSkip: boolean;
  completedQuestions: number[];
  currentQuestionId: string;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  track,
  onPrevious,
  onNext,
  onSkip,
  onGoToQuestion,
  canGoPrevious,
  canGoNext,
  canSkip,
  completedQuestions,
  currentQuestionId
}) => {
  const colors = getTrackColors(track);
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  const getQuestionStatus = (questionNumber: number) => {
    if (questionNumber === currentQuestion) {
      return { isCurrent: true, isCompleted: false, isActive: false };
    } else if (completedQuestions.includes(questionNumber)) {
      return { isCurrent: false, isCompleted: true, isActive: false };
    } else if (questionNumber === currentQuestion + 1) {
      return { isCurrent: false, isCompleted: false, isActive: true };
    } else {
      return { isCurrent: false, isCompleted: false, isActive: false };
    }
  };

  const getQuickNavButtons = () => {
    const buttons = [];
    const maxVisible = 10;
    const start = Math.max(1, currentQuestion - Math.floor(maxVisible / 2));
    const end = Math.min(totalQuestions, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      const status = getQuestionStatus(i);
      buttons.push(
        <QuickNavButton
          key={i}
          trackColor={colors.primary}
          isActive={status.isActive}
          isCompleted={status.isCompleted}
          isCurrent={status.isCurrent}
          onClick={() => onGoToQuestion(i)}
        >
          {status.isCompleted ? '✓' : i}
        </QuickNavButton>
      );
    }

    return buttons;
  };

  return (
    <NavigationContainer trackColor={colors.primary}>
      <BackgroundPattern />
      
      <NavigationHeader>
        <NavigationIcon color={colors.primary}>
          🧭
        </NavigationIcon>
        <NavigationTitle>Question Navigation</NavigationTitle>
      </NavigationHeader>

      <NavigationContent>
        <ProgressSection>
          <ProgressInfo>
            <ProgressNumber>{currentQuestion}</ProgressNumber>
            <ProgressLabel>Current</ProgressLabel>
          </ProgressInfo>
          
          <ProgressBar>
            <ProgressFill 
              percentage={progressPercentage} 
              color={colors.primary} 
            />
          </ProgressBar>
          
          <ProgressInfo>
            <ProgressNumber>{totalQuestions}</ProgressNumber>
            <ProgressLabel>Total</ProgressLabel>
          </ProgressInfo>
        </ProgressSection>

        <NavigationButtons>
          <NavButton
            trackColor={colors.primary}
            variant="secondary"
            disabled={!canGoPrevious}
            onClick={onPrevious}
          >
            ⬅️ Previous
          </NavButton>
          
          <NavButton
            trackColor={colors.primary}
            variant="secondary"
            disabled={!canSkip}
            onClick={onSkip}
          >
            ⏭️ Skip
          </NavButton>
          
          <NavButton
            trackColor={colors.primary}
            variant="primary"
            disabled={!canGoNext}
            onClick={onNext}
          >
            Next ➡️
          </NavButton>
        </NavigationButtons>
      </NavigationContent>

      {totalQuestions <= 20 && (
        <QuickNavSection>
          {getQuickNavButtons()}
        </QuickNavSection>
      )}
    </NavigationContainer>
  );
};

export default QuestionNavigation;
