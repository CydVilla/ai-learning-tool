import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useUserProgress } from '../../context/UserProgressContext';
import { StreakService } from '../../services/streakService';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.5); }
`;

const StreakContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const StreakHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StreakIcon = styled.div<{ isActive: boolean }>`
  font-size: 2rem;
  animation: ${props => props.isActive ? `${pulse} 2s infinite` : 'none'};
  filter: ${props => props.isActive ? 'drop-shadow(0 0 10px rgba(255, 107, 107, 0.8))' : 'none'};
`;

const StreakNumber = styled.div<{ isActive: boolean }>`
  font-size: 3rem;
  font-weight: bold;
  color: ${props => props.isActive ? '#ff6b6b' : 'rgba(255, 255, 255, 0.7)'};
  text-shadow: ${props => props.isActive ? '0 0 20px rgba(255, 107, 107, 0.8)' : 'none'};
  animation: ${props => props.isActive ? `${glow} 2s infinite` : 'none'};
`;

const StreakLabel = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const StreakSubtext = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ProgressSection = styled.div`
  margin: 1rem 0;
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

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const MotivationText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid #ff6b6b;
`;

const RiskWarning = styled.div`
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid rgba(255, 193, 7, 0.5);
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 1rem;
  color: #ffc107;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MilestoneBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  animation: ${pulse} 1s infinite;
`;

const StreakDisplay: React.FC = () => {
  const { userProgress, getCurrentStreak, getStreakInfo } = useUserProgress();

  if (!userProgress) {
    return (
      <StreakContainer>
        <StreakHeader>
          <StreakIcon isActive={false}>🔥</StreakIcon>
          <StreakNumber isActive={false}>0</StreakNumber>
        </StreakHeader>
        <StreakLabel>Current Streak</StreakLabel>
        <StreakSubtext>Start learning to build your streak!</StreakSubtext>
      </StreakContainer>
    );
  }

  const currentStreak = getCurrentStreak();
  const streakInfo = getStreakInfo();
  const nextMilestone = StreakService.getNextStreakMilestone(currentStreak);
  const progress = StreakService.getStreakProgress(currentStreak);
  const motivation = StreakService.getStreakMotivation(currentStreak);
  const isAtRisk = StreakService.isStreakAtRisk(userProgress.lastActivityDate);
  const daysUntilLost = StreakService.getDaysUntilStreakLost(userProgress.lastActivityDate);

  // Check if user just reached a milestone
  const milestones = StreakService.getStreakMilestones(currentStreak);
  const justReachedMilestone = milestones.some(m => m.unlocked && m.days === currentStreak);

  return (
    <StreakContainer>
      {justReachedMilestone && <MilestoneBadge>🎉</MilestoneBadge>}
      
      <StreakHeader>
        <StreakIcon isActive={currentStreak > 0}>🔥</StreakIcon>
        <StreakNumber isActive={currentStreak > 0}>{currentStreak}</StreakNumber>
      </StreakHeader>
      
      <StreakLabel>Current Streak</StreakLabel>
      <StreakSubtext>
        Longest: {streakInfo?.longestStreak || 0} days
      </StreakSubtext>

      {nextMilestone && (
        <ProgressSection>
          <ProgressHeader>
            <ProgressLabel>Next Milestone</ProgressLabel>
            <ProgressValue>{nextMilestone.days} days</ProgressValue>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill percentage={progress} />
          </ProgressBar>
        </ProgressSection>
      )}

      {isAtRisk && daysUntilLost > 0 && (
        <RiskWarning>
          ⚠️ Your streak is at risk! {daysUntilLost} day{daysUntilLost !== 1 ? 's' : ''} left.
        </RiskWarning>
      )}

      <MotivationText>
        {motivation}
      </MotivationText>
    </StreakContainer>
  );
};

export default StreakDisplay;
