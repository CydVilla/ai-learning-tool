import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LearningTrack } from '../../types';
import { useProgressTracking } from '../../hooks/useProgressTracking';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const SelectorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const TrackCard = styled.div<{ isSelected: boolean; trackColor: string }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid ${props => props.isSelected ? props.trackColor : 'rgba(255, 255, 255, 0.2)'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: ${props => props.trackColor};
  }
  
  ${props => props.isSelected && `
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    animation: ${pulse} 2s infinite;
  `}
`;

const TrackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TrackIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  background: ${props => props.color};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackTitle = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: bold;
`;

const TrackLevel = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
`;

const ProgressSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProgressLabel = styled.span`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ProgressValue = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.color};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const StatValue = styled.div`
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const ActionButton = styled.button<{ trackColor: string; disabled?: boolean }>`
  width: 100%;
  background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.1)' : props.trackColor};
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    ${props => !props.disabled && `
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    `}
  }
  
  &:active {
    ${props => !props.disabled && 'transform: translateY(0);'}
  }
`;

const DifficultyBadge = styled.div<{ difficulty: 'beginner' | 'intermediate' | 'advanced' }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  background: ${props => {
    switch (props.difficulty) {
      case 'beginner': return '#4ecdc4';
      case 'intermediate': return '#f39c12';
      case 'advanced': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
`;

interface LearningTrackSelectorProps {
  selectedTrack: LearningTrack | null;
  onTrackSelect: (track: LearningTrack) => void;
  onStartLearning: (track: LearningTrack) => void;
}

const LearningTrackSelector: React.FC<LearningTrackSelectorProps> = ({
  selectedTrack,
  onTrackSelect,
  onStartLearning
}) => {
  const { getTrackProgress, getLevelInfo, getTrackCompletionPercentage } = useProgressTracking();

  const tracks = [
    {
      id: 'html' as LearningTrack,
      name: 'HTML',
      icon: 'H',
      color: '#ff6b6b',
      description: 'Master the foundation of web development',
      difficulty: 'beginner' as const,
      totalQuestions: 50
    },
    {
      id: 'css' as LearningTrack,
      name: 'CSS',
      icon: 'C',
      color: '#4ecdc4',
      description: 'Style your websites beautifully',
      difficulty: 'beginner' as const,
      totalQuestions: 60
    },
    {
      id: 'javascript' as LearningTrack,
      name: 'JavaScript',
      icon: 'J',
      color: '#45b7d1',
      description: 'Add interactivity to your websites',
      difficulty: 'intermediate' as const,
      totalQuestions: 80
    }
  ];

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return 'Unknown';
    }
  };

  const isTrackLocked = (track: LearningTrack): boolean => {
    // Simple locking logic - in a real app, this would be more sophisticated
    if (track === 'html') return false; // HTML is always unlocked
    if (track === 'css') {
      const htmlProgress = getTrackProgress('html');
      return !htmlProgress || htmlProgress.questionsCompleted < 10;
    }
    if (track === 'javascript') {
      const cssProgress = getTrackProgress('css');
      return !cssProgress || cssProgress.questionsCompleted < 15;
    }
    return false;
  };

  return (
    <SelectorContainer>
      {tracks.map((track) => {
        const progress = getTrackProgress(track.id);
        const levelInfo = getLevelInfo(track.id);
        const completionPercentage = getTrackCompletionPercentage(track.id, track.totalQuestions);
        const isSelected = selectedTrack === track.id;
        const isLocked = isTrackLocked(track.id);

        return (
          <TrackCard
            key={track.id}
            isSelected={isSelected}
            trackColor={track.color}
            onClick={() => !isLocked && onTrackSelect(track.id)}
          >
            {isLocked && (
              <LockedOverlay>
                🔒 Locked
              </LockedOverlay>
            )}
            
            <DifficultyBadge difficulty={track.difficulty}>
              {getDifficultyLabel(track.difficulty)}
            </DifficultyBadge>

            <TrackHeader>
              <TrackIcon color={track.color}>
                {track.icon}
              </TrackIcon>
              <TrackInfo>
                <TrackTitle>{track.name}</TrackTitle>
                <TrackLevel>
                  {isLocked ? 'Locked' : `Level ${levelInfo?.currentLevel || 1}`}
                </TrackLevel>
              </TrackInfo>
            </TrackHeader>

            <ProgressSection>
              <ProgressHeader>
                <ProgressLabel>Progress</ProgressLabel>
                <ProgressValue>{completionPercentage}%</ProgressValue>
              </ProgressHeader>
              <ProgressBar>
                <ProgressFill 
                  percentage={completionPercentage} 
                  color={track.color} 
                />
              </ProgressBar>
            </ProgressSection>

            <StatsGrid>
              <StatItem>
                <StatValue>{progress?.xp || 0}</StatValue>
                <StatLabel>XP</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{progress?.questionsCompleted || 0}</StatValue>
                <StatLabel>Questions</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{progress?.accuracy || 0}%</StatValue>
                <StatLabel>Accuracy</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{progress?.streak || 0}</StatValue>
                <StatLabel>Streak</StatLabel>
              </StatItem>
            </StatsGrid>

            <ActionButton
              trackColor={track.color}
              disabled={isLocked}
              onClick={(e) => {
                e.stopPropagation();
                if (!isLocked) {
                  onStartLearning(track.id);
                }
              }}
            >
              {isLocked ? 'Complete Prerequisites' : 'Start Learning'}
            </ActionButton>
          </TrackCard>
        );
      })}
    </SelectorContainer>
  );
};

export default LearningTrackSelector;
