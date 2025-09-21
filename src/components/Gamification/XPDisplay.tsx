import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useUserProgress } from '../../context/UserProgressContext';
import { XPService, XPReward } from '../../services/xpService';

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

const XPContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const XPHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const XPIcon = styled.div<{ isAnimating: boolean }>`
  font-size: 2rem;
  animation: ${props => props.isAnimating ? `${bounce} 0.6s ease-in-out` : 'none'};
  filter: ${props => props.isAnimating ? 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))' : 'none'};
`;

const XPNumber = styled.div<{ isAnimating: boolean }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: ${props => props.isAnimating ? '0 0 20px rgba(255, 215, 0, 0.8)' : 'none'};
  animation: ${props => props.isAnimating ? `${glow} 0.6s ease-in-out` : 'none'};
`;

const XPLabel = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const LevelInfo = styled.div`
  color: rgba(255, 255, 255, 0.8);
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
  background: linear-gradient(90deg, #ffd700, #ffed4e);
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const LevelBadge = styled.div<{ color: string }>`
  position: absolute;
  top: -5px;
  right: -5px;
  background: ${props => props.color};
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  animation: ${bounce} 1s infinite;
`;

const MilestoneNotification = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 215, 0, 0.95);
  color: #000;
  padding: 1rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.1rem;
  z-index: 10;
  animation: ${bounce} 0.6s ease-in-out;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const XPBreakdown = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
`;

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  
  &:last-child {
    margin-bottom: 0;
    font-weight: bold;
    color: #ffd700;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 0.25rem;
  }
`;

interface XPDisplayProps {
  showBreakdown?: boolean;
  xpReward?: XPReward;
}

const XPDisplay: React.FC<XPDisplayProps> = ({ showBreakdown = false, xpReward }) => {
  const { userProgress, getTotalXP } = useUserProgress();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);

  const totalXP = getTotalXP();
  const levelInfo = XPService.calculateLevelInfo(totalXP);
  const nextMilestone = XPService.getNextXPMilestone(totalXP);

  // Check for level up
  useEffect(() => {
    if (levelInfo.currentLevel > previousLevel) {
      setShowMilestone(true);
      setIsAnimating(true);
      setPreviousLevel(levelInfo.currentLevel);
      
      // Hide milestone notification after 3 seconds
      setTimeout(() => {
        setShowMilestone(false);
        setIsAnimating(false);
      }, 3000);
    }
  }, [levelInfo.currentLevel, previousLevel]);

  // Animate XP gain
  useEffect(() => {
    if (xpReward && xpReward.totalXP > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [xpReward]);

  if (!userProgress) {
    return (
      <XPContainer>
        <XPHeader>
          <XPIcon isAnimating={false}>⭐</XPIcon>
          <XPNumber isAnimating={false}>0</XPNumber>
        </XPHeader>
        <XPLabel>Total XP</XPLabel>
        <LevelInfo>Level 1 - Novice</LevelInfo>
      </XPContainer>
    );
  }

  return (
    <XPContainer>
      {showMilestone && (
        <MilestoneNotification>
          🎉 Level Up! {levelInfo.levelName} 🎉
        </MilestoneNotification>
      )}
      
      <LevelBadge color={levelInfo.levelColor}>
        {levelInfo.currentLevel}
      </LevelBadge>
      
      <XPHeader>
        <XPIcon isAnimating={isAnimating}>⭐</XPIcon>
        <XPNumber isAnimating={isAnimating}>{totalXP.toLocaleString()}</XPNumber>
      </XPHeader>
      
      <XPLabel>Total XP</XPLabel>
      <LevelInfo>
        Level {levelInfo.currentLevel} - {levelInfo.levelName}
      </LevelInfo>

      {nextMilestone && (
        <ProgressSection>
          <ProgressHeader>
            <ProgressLabel>Next Level</ProgressLabel>
            <ProgressValue>{levelInfo.xpToNext} XP to go</ProgressValue>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill percentage={levelInfo.progressPercentage} />
          </ProgressBar>
        </ProgressSection>
      )}

      {showBreakdown && xpReward && (
        <XPBreakdown>
          <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#ffd700' }}>
            XP Breakdown:
          </div>
          {XPService.getXPBreadown(xpReward).map((line, index) => (
            <BreakdownItem key={index}>
              {line.includes(':') ? (
                <>
                  <span>{line.split(':')[0]}:</span>
                  <span>{line.split(':')[1]}</span>
                </>
              ) : (
                <span>{line}</span>
              )}
            </BreakdownItem>
          ))}
        </XPBreakdown>
      )}
    </XPContainer>
  );
};

export default XPDisplay;
