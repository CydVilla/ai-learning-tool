import React from 'react';
import styled from 'styled-components';
import { LearningTrack } from '../../types';
import { useProgressTracking } from '../../hooks/useProgressTracking';

const Card = styled.div<{ trackColor: string }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const TrackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TrackIcon = styled.div<{ color: string }>`
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
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackTitle = styled.h3`
  color: white;
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
`;

const TrackLevel = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
`;

const ProgressSection = styled.div`
  margin-bottom: 1rem;
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
`;

const StatItem = styled.div`
  text-align: center;
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

const StreakIndicator = styled.div<{ hasStreak: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.hasStreak ? '#ff6b6b' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

interface TrackProgressCardProps {
  track: LearningTrack;
  totalQuestions?: number;
}

const TrackProgressCard: React.FC<TrackProgressCardProps> = ({ track, totalQuestions = 100 }) => {
  const { getTrackProgress, getLevelInfo, getTrackCompletionPercentage } = useProgressTracking();
  
  const trackProgress = getTrackProgress(track);
  const levelInfo = getLevelInfo(track);
  const completionPercentage = getTrackCompletionPercentage(track, totalQuestions);

  if (!trackProgress || !levelInfo) {
    return (
      <Card trackColor="#667eea">
        <TrackHeader>
          <TrackIcon color="#667eea">{track.charAt(0).toUpperCase()}</TrackIcon>
          <TrackInfo>
            <TrackTitle>{track.toUpperCase()}</TrackTitle>
            <TrackLevel>Loading...</TrackLevel>
          </TrackInfo>
        </TrackHeader>
      </Card>
    );
  }

  const trackColors = {
    html: '#ff6b6b',
    css: '#4ecdc4',
    javascript: '#45b7d1'
  };

  const trackIcons = {
    html: 'H',
    css: 'C',
    javascript: 'J'
  };

  return (
    <Card trackColor={trackColors[track]}>
      <TrackHeader>
        <TrackIcon color={trackColors[track]}>
          {trackIcons[track]}
        </TrackIcon>
        <TrackInfo>
          <TrackTitle>{track.toUpperCase()}</TrackTitle>
          <TrackLevel>Level {levelInfo.currentLevel}</TrackLevel>
        </TrackInfo>
      </TrackHeader>

      <ProgressSection>
        <ProgressHeader>
          <ProgressLabel>Level Progress</ProgressLabel>
          <ProgressValue>{levelInfo.xpToNext} XP to next level</ProgressValue>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill 
            percentage={levelInfo.progressPercentage} 
            color={trackColors[track]} 
          />
        </ProgressBar>
      </ProgressSection>

      <ProgressSection>
        <ProgressHeader>
          <ProgressLabel>Track Completion</ProgressLabel>
          <ProgressValue>{completionPercentage}%</ProgressValue>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill 
            percentage={completionPercentage} 
            color={trackColors[track]} 
          />
        </ProgressBar>
      </ProgressSection>

      <StatsGrid>
        <StatItem>
          <StatValue>{trackProgress.xp}</StatValue>
          <StatLabel>Total XP</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{trackProgress.questionsCompleted}</StatValue>
          <StatLabel>Questions</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{trackProgress.accuracy}%</StatValue>
          <StatLabel>Accuracy</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{Math.round(trackProgress.timeSpent)}m</StatValue>
          <StatLabel>Time Spent</StatLabel>
        </StatItem>
      </StatsGrid>

      <StreakIndicator hasStreak={trackProgress.streak > 0}>
        🔥 {trackProgress.streak} day streak
      </StreakIndicator>
    </Card>
  );
};

export default TrackProgressCard;
