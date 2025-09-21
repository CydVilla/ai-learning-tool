import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useStreakManagement } from '../../hooks/useStreakManagement';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const StreakContainer = styled.div<{ streakLevel: number }>`
  background: ${props => {
    if (props.streakLevel >= 50) return 'linear-gradient(135deg, #ffd700, #ffed4e)';
    if (props.streakLevel >= 20) return 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
    if (props.streakLevel >= 10) return 'linear-gradient(135deg, #f39c12, #f7b731)';
    if (props.streakLevel >= 5) return 'linear-gradient(135deg, #4ecdc4, #6dd5d0)';
    return 'linear-gradient(135deg, #95a5a6, #bdc3c7)';
  }};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 2px solid ${props => {
    if (props.streakLevel >= 50) return '#ffd700';
    if (props.streakLevel >= 20) return '#ff6b6b';
    if (props.streakLevel >= 10) return '#f39c12';
    if (props.streakLevel >= 5) return '#4ecdc4';
    return '#95a5a6';
  }};
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  
  ${props => props.streakLevel >= 5 && `
    animation: ${pulse} 2s infinite;
  `}
  
  ${props => props.streakLevel >= 20 && `
    animation: ${glow} 1s infinite;
  `}
`;

const StreakHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`;

const StreakIcon = styled.div<{ streakLevel: number }>`
  width: 60px;
  height: 60px;
  background: ${props => {
    if (props.streakLevel >= 50) return '#ffd700';
    if (props.streakLevel >= 20) return '#ff6b6b';
    if (props.streakLevel >= 10) return '#f39c12';
    if (props.streakLevel >= 5) return '#4ecdc4';
    return '#95a5a6';
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: ${props => props.streakLevel >= 5 ? `${bounce} 0.6s ease-in-out` : 'none'};
`;

const StreakInfo = styled.div`
  flex: 1;
`;

const StreakTitle = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const StreakSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const StreakNumber = styled.div<{ streakLevel: number }>`
  color: white;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
  margin-bottom: 0.5rem;
  animation: ${props => props.streakLevel >= 5 ? `${pulse} 1s infinite` : 'none'};
`;

const StreakLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
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
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number; streakLevel: number }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => {
    if (props.streakLevel >= 50) return '#ffd700';
    if (props.streakLevel >= 20) return '#ff6b6b';
    if (props.streakLevel >= 10) return '#f39c12';
    if (props.streakLevel >= 5) return '#4ecdc4';
    return '#95a5a6';
  }};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const MilestoneSection = styled.div`
  margin-top: 1rem;
`;

const MilestoneTitle = styled.h4`
  color: white;
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MilestoneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MilestoneItem = styled.div<{ achieved: boolean; streakLevel: number }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border-left: 3px solid ${props => props.achieved ? '#4ecdc4' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  
  ${props => props.achieved && `
    background: rgba(255, 255, 255, 0.2);
    animation: ${pulse} 0.6s ease-in-out;
  `}
`;

const MilestoneIcon = styled.div<{ achieved: boolean; streakLevel: number }>`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  background: ${props => props.achieved ? '#4ecdc4' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
`;

const MilestoneText = styled.div`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

const MotivationSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  border-left: 4px solid #4ecdc4;
`;

const MotivationTitle = styled.h4`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MotivationText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  font-style: italic;
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

const StreakCounter: React.FC = () => {
  const { getStreakStatistics, getStreakMotivation, getNextStreakMilestone } = useStreakManagement();
  const [isAnimating, setIsAnimating] = useState(false);

  const streakInfo = getStreakStatistics();
  const motivation = getStreakMotivation();
  const nextMilestone = getNextStreakMilestone();

  // Trigger animation when streak changes
  useEffect(() => {
    if (streakInfo?.currentStreak && streakInfo.currentStreak > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [streakInfo?.currentStreak]);

  const getStreakLevel = (streak: number): number => {
    if (streak >= 50) return 50;
    if (streak >= 20) return 20;
    if (streak >= 10) return 10;
    if (streak >= 5) return 5;
    return 0;
  };

  const getStreakIcon = (streak: number): string => {
    if (streak >= 50) return '👑';
    if (streak >= 20) return '🔥';
    if (streak >= 10) return '⚡';
    if (streak >= 5) return '🌟';
    return '🌱';
  };

  const getStreakTitle = (streak: number): string => {
    if (streak >= 50) return 'Legendary Streak!';
    if (streak >= 20) return 'On Fire!';
    if (streak >= 10) return 'Getting Hot!';
    if (streak >= 5) return 'Building Momentum!';
    return 'Start Your Streak!';
  };

  const getStreakSubtitle = (streak: number): string => {
    if (streak >= 50) return 'You\'re a learning legend!';
    if (streak >= 20) return 'Incredible dedication!';
    if (streak >= 10) return 'Great consistency!';
    if (streak >= 5) return 'Keep it up!';
    return 'Complete a question to start your streak!';
  };

  const streakLevel = getStreakLevel(streakInfo?.currentStreak || 0);
  const progressPercentage = nextMilestone ? 
    ((streakInfo?.currentStreak || 0) / nextMilestone.days) * 100 : 100;

  const milestones = [
    { days: 3, title: 'Getting Started', icon: '🌱' },
    { days: 7, title: 'Weekly Warrior', icon: '⚡' },
    { days: 14, title: 'Two Week Champion', icon: '🌟' },
    { days: 30, title: 'Monthly Master', icon: '🔥' },
    { days: 100, title: 'Century Streak', icon: '👑' }
  ];

  return (
    <StreakContainer streakLevel={streakLevel}>
      <BackgroundPattern />
      
      <StreakHeader>
        <StreakIcon streakLevel={streakLevel}>
          {getStreakIcon(streakInfo?.currentStreak || 0)}
        </StreakIcon>
        <StreakInfo>
          <StreakTitle>{getStreakTitle(streakInfo?.currentStreak || 0)}</StreakTitle>
          <StreakSubtitle>{getStreakSubtitle(streakInfo?.currentStreak || 0)}</StreakSubtitle>
        </StreakInfo>
      </StreakHeader>

      <StreakNumber streakLevel={streakLevel}>
        {streakInfo?.currentStreak || 0}
      </StreakNumber>
      <StreakLabel>Day Streak</StreakLabel>

      {nextMilestone && (
        <ProgressSection>
          <ProgressHeader>
            <ProgressLabel>Next Milestone</ProgressLabel>
            <ProgressValue>{nextMilestone.days} days</ProgressValue>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill 
              percentage={progressPercentage} 
              streakLevel={streakLevel} 
            />
          </ProgressBar>
        </ProgressSection>
      )}

      <MilestoneSection>
        <MilestoneTitle>
          🏆 Milestones
        </MilestoneTitle>
        <MilestoneList>
          {milestones.map((milestone) => {
            const achieved = (streakInfo?.currentStreak || 0) >= milestone.days;
            return (
              <MilestoneItem
                key={milestone.days}
                achieved={achieved}
                streakLevel={streakLevel}
              >
                <MilestoneIcon
                  achieved={achieved}
                  streakLevel={streakLevel}
                >
                  {achieved ? '✓' : milestone.icon}
                </MilestoneIcon>
                <MilestoneText>
                  {milestone.title} ({milestone.days} days)
                </MilestoneText>
              </MilestoneItem>
            );
          })}
        </MilestoneList>
      </MilestoneSection>

      {motivation && (
        <MotivationSection>
          <MotivationTitle>
            💪 Motivation
          </MotivationTitle>
          <MotivationText>
            {motivation}
          </MotivationText>
        </MotivationSection>
      )}
    </StreakContainer>
  );
};

export default StreakCounter;
