import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LearningTrack } from '../../types';
import { useProgressTracking } from '../../hooks/useProgressTracking';
import { getTrackTheme, getTrackColors } from '../../utils/trackColors';

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

const OverviewContainer = styled.div<{ trackColor: string }>`
  background: linear-gradient(135deg, ${props => props.trackColor}20, ${props => props.trackColor}40);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid ${props => props.trackColor}40;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
`;

const OverviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
`;

const TrackIcon = styled.div<{ color: string }>`
  width: 70px;
  height: 70px;
  background: ${props => props.color};
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const TrackTitle = styled.h2`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const TrackDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  font-size: 1rem;
  line-height: 1.6;
`;

const TrackMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaBadge = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ trackColor: string }>`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${props => props.trackColor}40;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 35px;
  height: 35px;
  background: ${props => props.color};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: white;
`;

const StatTitle = styled.h4`
  color: white;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const StatValue = styled.div`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const StatProgress = styled.div`
  margin-top: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.color};
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const AchievementSection = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  color: white;
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const AchievementCard = styled.div<{ completed: boolean; trackColor: string }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid ${props => props.completed ? props.trackColor : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
  animation: ${slideIn} 0.3s ease-out;
  
  ${props => props.completed && `
    background: rgba(255, 255, 255, 0.1);
    animation: ${pulse} 0.6s ease-in-out;
  `}
`;

const AchievementHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const AchievementIcon = styled.div<{ completed: boolean; trackColor: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: ${props => props.completed ? props.trackColor : 'rgba(255, 255, 255, 0.2)'};
  color: white;
`;

const AchievementTitle = styled.div`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const AchievementDescription = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const AchievementProgress = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  font-weight: 500;
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

interface TrackOverviewProps {
  track: LearningTrack;
}

const TrackOverview: React.FC<TrackOverviewProps> = ({ track }) => {
  const { getTrackProgress, getLevelInfo, getTrackCompletionPercentage } = useProgressTracking();
  
  const trackTheme = getTrackTheme(track);
  const colors = getTrackColors(track);
  const progress = getTrackProgress(track);
  const levelInfo = getLevelInfo(track);
  const completionPercentage = getTrackCompletionPercentage(track, trackTheme.totalQuestions);

  // Mock achievements data (in a real app, this would come from the progress system)
  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first question',
      icon: '🎯',
      target: 1,
      completed: (progress?.questionsCompleted || 0) >= 1
    },
    {
      id: 2,
      title: 'Getting Started',
      description: 'Complete 5 questions',
      icon: '🚀',
      target: 5,
      completed: (progress?.questionsCompleted || 0) >= 5
    },
    {
      id: 3,
      title: 'Building Momentum',
      description: 'Complete 10 questions',
      icon: '⚡',
      target: 10,
      completed: (progress?.questionsCompleted || 0) >= 10
    },
    {
      id: 4,
      title: 'Halfway There',
      description: 'Complete 25 questions',
      icon: '🎖️',
      target: 25,
      completed: (progress?.questionsCompleted || 0) >= 25
    },
    {
      id: 5,
      title: 'Track Master',
      description: 'Complete all questions',
      icon: '👑',
      target: trackTheme.totalQuestions,
      completed: (progress?.questionsCompleted || 0) >= trackTheme.totalQuestions
    },
    {
      id: 6,
      title: 'Accuracy Expert',
      description: 'Achieve 90% accuracy',
      icon: '🎯',
      target: 90,
      completed: (progress?.accuracy || 0) >= 90
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4ecdc4';
      case 'intermediate': return '#f39c12';
      case 'advanced': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <OverviewContainer trackColor={colors.primary}>
      <BackgroundPattern />
      
      <OverviewHeader>
        <TrackIcon color={colors.primary}>
          {trackTheme.icon}
        </TrackIcon>
        
        <TrackInfo>
          <TrackTitle>{trackTheme.name}</TrackTitle>
          <TrackDescription>{trackTheme.description}</TrackDescription>
          
          <TrackMeta>
            <MetaBadge color={getDifficultyColor(trackTheme.difficulty)}>
              {trackTheme.difficulty.charAt(0).toUpperCase() + trackTheme.difficulty.slice(1)}
            </MetaBadge>
            <MetaBadge color={colors.secondary}>
              {trackTheme.totalQuestions} Questions
            </MetaBadge>
            <MetaBadge color={colors.accent}>
              Level {levelInfo?.currentLevel || 1}
            </MetaBadge>
          </TrackMeta>
        </TrackInfo>
      </OverviewHeader>

      <StatsGrid>
        <StatCard trackColor={colors.primary}>
          <StatHeader>
            <StatIcon color={colors.primary}>📊</StatIcon>
            <StatTitle>Overall Progress</StatTitle>
          </StatHeader>
          <StatValue>{completionPercentage}%</StatValue>
          <StatLabel>Track Completion</StatLabel>
          <StatProgress>
            <ProgressBar>
              <ProgressFill 
                percentage={completionPercentage} 
                color={colors.primary} 
              />
            </ProgressBar>
            <ProgressText>
              <span>{progress?.questionsCompleted || 0} / {trackTheme.totalQuestions}</span>
              <span>{completionPercentage}%</span>
            </ProgressText>
          </StatProgress>
        </StatCard>

        <StatCard trackColor={colors.primary}>
          <StatHeader>
            <StatIcon color={colors.primary}>⭐</StatIcon>
            <StatTitle>Total XP</StatTitle>
          </StatHeader>
          <StatValue>{progress?.xp || 0}</StatValue>
          <StatLabel>Experience Points</StatLabel>
          <StatProgress>
            <ProgressBar>
              <ProgressFill 
                percentage={Math.min((progress?.xp || 0) / 100, 100)} 
                color={colors.primary} 
              />
            </ProgressBar>
            <ProgressText>
              <span>Current Level</span>
              <span>{levelInfo?.currentLevel || 1}</span>
            </ProgressText>
          </StatProgress>
        </StatCard>

        <StatCard trackColor={colors.primary}>
          <StatHeader>
            <StatIcon color={colors.primary}>🎯</StatIcon>
            <StatTitle>Accuracy</StatTitle>
          </StatHeader>
          <StatValue>{progress?.accuracy || 0}%</StatValue>
          <StatLabel>Correct Answers</StatLabel>
          <StatProgress>
            <ProgressBar>
              <ProgressFill 
                percentage={progress?.accuracy || 0} 
                color={colors.primary} 
              />
            </ProgressBar>
            <ProgressText>
              <span>Current Accuracy</span>
              <span>{progress?.accuracy || 0}%</span>
            </ProgressText>
          </StatProgress>
        </StatCard>

        <StatCard trackColor={colors.primary}>
          <StatHeader>
            <StatIcon color={colors.primary}>🔥</StatIcon>
            <StatTitle>Streak</StatTitle>
          </StatHeader>
          <StatValue>{progress?.streak || 0}</StatValue>
          <StatLabel>Days in a Row</StatLabel>
          <StatProgress>
            <ProgressBar>
              <ProgressFill 
                percentage={Math.min((progress?.streak || 0) * 10, 100)} 
                color={colors.primary} 
              />
            </ProgressBar>
            <ProgressText>
              <span>Current Streak</span>
              <span>{progress?.streak || 0} days</span>
            </ProgressText>
          </StatProgress>
        </StatCard>

        <StatCard trackColor={colors.primary}>
          <StatHeader>
            <StatIcon color={colors.primary}>⏱️</StatIcon>
            <StatTitle>Time Spent</StatTitle>
          </StatHeader>
          <StatValue>{Math.round(progress?.timeSpent || 0)}m</StatValue>
          <StatLabel>Learning Time</StatLabel>
          <StatProgress>
            <ProgressBar>
              <ProgressFill 
                percentage={Math.min((progress?.timeSpent || 0) / 10, 100)} 
                color={colors.primary} 
              />
            </ProgressBar>
            <ProgressText>
              <span>Total Time</span>
              <span>{Math.round(progress?.timeSpent || 0)} minutes</span>
            </ProgressText>
          </StatProgress>
        </StatCard>

        <StatCard trackColor={colors.primary}>
          <StatHeader>
            <StatIcon color={colors.primary}>🏆</StatIcon>
            <StatTitle>Achievements</StatTitle>
          </StatHeader>
          <StatValue>{achievements.filter(a => a.completed).length}</StatValue>
          <StatLabel>Unlocked</StatLabel>
          <StatProgress>
            <ProgressBar>
              <ProgressFill 
                percentage={(achievements.filter(a => a.completed).length / achievements.length) * 100} 
                color={colors.primary} 
              />
            </ProgressBar>
            <ProgressText>
              <span>Progress</span>
              <span>{achievements.filter(a => a.completed).length}/{achievements.length}</span>
            </ProgressText>
          </StatProgress>
        </StatCard>
      </StatsGrid>

      <AchievementSection>
        <SectionTitle>
          🏆 Achievements
        </SectionTitle>
        <AchievementGrid>
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              completed={achievement.completed}
              trackColor={colors.primary}
            >
              <AchievementHeader>
                <AchievementIcon
                  completed={achievement.completed}
                  trackColor={colors.primary}
                >
                  {achievement.completed ? '✓' : achievement.icon}
                </AchievementIcon>
                <AchievementTitle>{achievement.title}</AchievementTitle>
              </AchievementHeader>
              <AchievementDescription>{achievement.description}</AchievementDescription>
              <AchievementProgress>
                {achievement.completed ? 'Completed' : `Progress: ${Math.min(progress?.questionsCompleted || 0, achievement.target)}/${achievement.target}`}
              </AchievementProgress>
            </AchievementCard>
          ))}
        </AchievementGrid>
      </AchievementSection>
    </OverviewContainer>
  );
};

export default TrackOverview;
