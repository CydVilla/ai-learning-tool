import React from 'react';
import styled from 'styled-components';
import { LearningTrack } from '../../types';
import { useProgressTracking } from '../../hooks/useProgressTracking';

const HeaderContainer = styled.div<{ trackColor: string }>`
  background: linear-gradient(135deg, ${props => props.trackColor}20, ${props => props.trackColor}40);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.trackColor}40;
  position: relative;
  overflow: hidden;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 2;
`;

const TrackIcon = styled.div<{ color: string }>`
  width: 80px;
  height: 80px;
  background: ${props => props.color};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackTitle = styled.h1`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const TrackDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const TrackStats = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  min-width: 80px;
`;

const StatValue = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  text-align: center;
`;

const ProgressSection = styled.div`
  margin-top: 1.5rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProgressLabel = styled.span`
  color: white;
  font-size: 1rem;
  font-weight: 500;
`;

const ProgressValue = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.color};
  border-radius: 6px;
  transition: width 0.3s ease;
`;

const LevelBadge = styled.div<{ color: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.color};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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

interface LearningTrackHeaderProps {
  track: LearningTrack;
  onBack: () => void;
}

const LearningTrackHeader: React.FC<LearningTrackHeaderProps> = ({ track, onBack }) => {
  const { getTrackProgress, getLevelInfo, getTrackCompletionPercentage } = useProgressTracking();

  const trackInfo = {
    html: {
      name: 'HTML',
      icon: 'H',
      color: '#ff6b6b',
      description: 'Master the foundation of web development with HTML. Learn about tags, structure, semantic markup, and accessibility.',
      totalQuestions: 50
    },
    css: {
      name: 'CSS',
      icon: 'C',
      color: '#4ecdc4',
      description: 'Style your websites beautifully with CSS. Learn layouts, animations, responsive design, and modern CSS features.',
      totalQuestions: 60
    },
    javascript: {
      name: 'JavaScript',
      icon: 'J',
      color: '#45b7d1',
      description: 'Add interactivity to your websites with JavaScript. Master functions, DOM manipulation, async programming, and modern ES6+ features.',
      totalQuestions: 80
    }
  };

  const currentTrack = trackInfo[track];
  const progress = getTrackProgress(track);
  const levelInfo = getLevelInfo(track);
  const completionPercentage = getTrackCompletionPercentage(track, currentTrack.totalQuestions);

  return (
    <HeaderContainer trackColor={currentTrack.color}>
      <BackgroundPattern />
      
      <LevelBadge color={currentTrack.color}>
        Level {levelInfo?.currentLevel || 1}
      </LevelBadge>

      <HeaderContent>
        <TrackIcon color={currentTrack.color}>
          {currentTrack.icon}
        </TrackIcon>
        
        <TrackInfo>
          <TrackTitle>{currentTrack.name}</TrackTitle>
          <TrackDescription>{currentTrack.description}</TrackDescription>
          
          <TrackStats>
            <StatItem>
              <StatValue>{progress?.xp || 0}</StatValue>
              <StatLabel>Total XP</StatLabel>
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
            <StatItem>
              <StatValue>{Math.round(progress?.timeSpent || 0)}m</StatValue>
              <StatLabel>Time Spent</StatLabel>
            </StatItem>
          </TrackStats>
        </TrackInfo>
      </HeaderContent>

      <ProgressSection>
        <ProgressHeader>
          <ProgressLabel>Track Progress</ProgressLabel>
          <ProgressValue>{completionPercentage}% Complete</ProgressValue>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill 
            percentage={completionPercentage} 
            color={currentTrack.color} 
          />
        </ProgressBar>
      </ProgressSection>
    </HeaderContainer>
  );
};

export default LearningTrackHeader;
