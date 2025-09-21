import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useXPSystem } from '../../hooks/useXPSystem';

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

const xpGain = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 1; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
  100% { transform: translateY(-40px) scale(0.8); opacity: 0; }
`;

const levelUp = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  50% { transform: scale(1.2) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const XPContainer = styled.div<{ level: number }>`
  background: ${props => {
    if (props.level >= 30) return 'linear-gradient(135deg, #8e44ad, #9b59b6)';
    if (props.level >= 20) return 'linear-gradient(135deg, #e74c3c, #c0392b)';
    if (props.level >= 15) return 'linear-gradient(135deg, #f39c12, #e67e22)';
    if (props.level >= 10) return 'linear-gradient(135deg, #27ae60, #2ecc71)';
    if (props.level >= 5) return 'linear-gradient(135deg, #3498db, #2980b9)';
    return 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
  }};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 2px solid ${props => {
    if (props.level >= 30) return '#8e44ad';
    if (props.level >= 20) return '#e74c3c';
    if (props.level >= 15) return '#f39c12';
    if (props.level >= 10) return '#27ae60';
    if (props.level >= 5) return '#3498db';
    return '#95a5a6';
  }};
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  
  ${props => props.level >= 5 && `
    animation: ${pulse} 2s infinite;
  `}
  
  ${props => props.level >= 20 && `
    animation: ${glow} 1s infinite;
  `}
`;

const XPHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`;

const XPIcon = styled.div<{ level: number; isAnimating: boolean }>`
  width: 60px;
  height: 60px;
  background: ${props => {
    if (props.level >= 30) return '#8e44ad';
    if (props.level >= 20) return '#e74c3c';
    if (props.level >= 15) return '#f39c12';
    if (props.level >= 10) return '#27ae60';
    if (props.level >= 5) return '#3498db';
    return '#95a5a6';
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: ${props => props.isAnimating ? `${bounce} 0.6s ease-in-out` : 'none'};
`;

const XPInfo = styled.div`
  flex: 1;
`;

const XPTitle = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const XPSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const XPNumber = styled.div<{ level: number; isAnimating: boolean }>`
  color: white;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
  margin-bottom: 0.5rem;
  animation: ${props => props.isAnimating ? `${pulse} 1s infinite` : 'none'};
`;

const XPLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const LevelSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const LevelBadge = styled.div<{ level: number }>`
  background: ${props => {
    if (props.level >= 30) return '#8e44ad';
    if (props.level >= 20) return '#e74c3c';
    if (props.level >= 15) return '#f39c12';
    if (props.level >= 10) return '#27ae60';
    if (props.level >= 5) return '#3498db';
    return '#95a5a6';
  }};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const LevelName = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  flex: 1;
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
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div<{ percentage: number; level: number }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => {
    if (props.level >= 30) return '#8e44ad';
    if (props.level >= 20) return '#e74c3c';
    if (props.level >= 15) return '#f39c12';
    if (props.level >= 10) return '#27ae60';
    if (props.level >= 5) return '#3498db';
    return '#95a5a6';
  }};
  border-radius: 5px;
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
    animation: ${pulse} 2s infinite;
  }
`;

const XPGainAnimation = styled.div<{ show: boolean; xp: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffd700;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
  animation: ${props => props.show ? `${xpGain} 1s ease-out` : 'none'};
  display: ${props => props.show ? 'block' : 'none'};
`;

const LevelUpAnimation = styled.div<{ show: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffd700;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
  animation: ${props => props.show ? `${levelUp} 1s ease-in-out` : 'none'};
  display: ${props => props.show ? 'block' : 'none'};
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

const MilestoneItem = styled.div<{ achieved: boolean; level: number }>`
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

const MilestoneIcon = styled.div<{ achieved: boolean; level: number }>`
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

const XPDisplay: React.FC = () => {
  const { getLevelInfo, getXPMilestones, getXPMotivation } = useXPSystem();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showXPGain, setShowXPGain] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [xpGain, setXPGain] = useState(0);
  const [previousLevel, setPreviousLevel] = useState(1);

  const levelInfo = getLevelInfo();
  const milestones = getXPMilestones();
  const motivation = getXPMotivation();

  // Trigger animations when XP or level changes
  useEffect(() => {
    if (levelInfo.currentLevel > previousLevel) {
      setShowLevelUp(true);
      setPreviousLevel(levelInfo.currentLevel);
      setTimeout(() => setShowLevelUp(false), 1000);
    }
  }, [levelInfo.currentLevel, previousLevel]);

  const getLevelIcon = (level: number): string => {
    if (level >= 30) return '👑';
    if (level >= 20) return '🏆';
    if (level >= 15) return '⭐';
    if (level >= 10) return '🌟';
    if (level >= 5) return '💎';
    return '🌱';
  };

  const getLevelTitle = (level: number): string => {
    if (level >= 30) return 'Legendary!';
    if (level >= 20) return 'Master!';
    if (level >= 15) return 'Expert!';
    if (level >= 10) return 'Advanced!';
    if (level >= 5) return 'Intermediate!';
    return 'Beginner!';
  };

  const getLevelSubtitle = (level: number): string => {
    if (level >= 30) return 'You\'re a coding legend!';
    if (level >= 20) return 'Incredible mastery!';
    if (level >= 15) return 'Expert level achieved!';
    if (level >= 10) return 'Advanced skills unlocked!';
    if (level >= 5) return 'Intermediate progress!';
    return 'Start your coding journey!';
  };

  const getLevelColor = (level: number): string => {
    if (level >= 30) return '#8e44ad';
    if (level >= 20) return '#e74c3c';
    if (level >= 15) return '#f39c12';
    if (level >= 10) return '#27ae60';
    if (level >= 5) return '#3498db';
    return '#95a5a6';
  };

  const xpMilestones = [
    { level: 5, title: 'Rising Star', icon: '⭐' },
    { level: 10, title: 'Knowledge Seeker', icon: '🔍' },
    { level: 15, title: 'Dedicated Learner', icon: '📚' },
    { level: 20, title: 'Skillful Coder', icon: '💻' },
    { level: 25, title: 'Code Master', icon: '🏆' },
    { level: 30, title: 'Programming Legend', icon: '👑' }
  ];

  return (
    <XPContainer level={levelInfo.currentLevel}>
      <BackgroundPattern />
      
      <XPGainAnimation show={showXPGain} xp={xpGain}>
        +{xpGain} XP
      </XPGainAnimation>
      
      <LevelUpAnimation show={showLevelUp}>
        🎉 Level Up! 🎉
      </LevelUpAnimation>
      
      <XPHeader>
        <XPIcon level={levelInfo.currentLevel} isAnimating={isAnimating}>
          {getLevelIcon(levelInfo.currentLevel)}
        </XPIcon>
        <XPInfo>
          <XPTitle>{getLevelTitle(levelInfo.currentLevel)}</XPTitle>
          <XPSubtitle>{getLevelSubtitle(levelInfo.currentLevel)}</XPSubtitle>
        </XPInfo>
      </XPHeader>

      <XPNumber level={levelInfo.currentLevel} isAnimating={isAnimating}>
        {levelInfo.currentXP.toLocaleString()}
      </XPNumber>
      <XPLabel>Total XP</XPLabel>

      <LevelSection>
        <LevelBadge level={levelInfo.currentLevel}>
          {getLevelIcon(levelInfo.currentLevel)}
          Level {levelInfo.currentLevel}
        </LevelBadge>
        <LevelName>{levelInfo.levelName}</LevelName>
      </LevelSection>

      {levelInfo.xpToNext > 0 && (
        <ProgressSection>
          <ProgressHeader>
            <ProgressLabel>Next Level</ProgressLabel>
            <ProgressValue>{levelInfo.xpToNext} XP to go</ProgressValue>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill 
              percentage={levelInfo.progressPercentage} 
              level={levelInfo.currentLevel} 
            />
          </ProgressBar>
        </ProgressSection>
      )}

      <MilestoneSection>
        <MilestoneTitle>
          🏆 Milestones
        </MilestoneTitle>
        <MilestoneList>
          {xpMilestones.map((milestone) => {
            const achieved = levelInfo.currentLevel >= milestone.level;
            return (
              <MilestoneItem
                key={milestone.level}
                achieved={achieved}
                level={levelInfo.currentLevel}
              >
                <MilestoneIcon
                  achieved={achieved}
                  level={levelInfo.currentLevel}
                >
                  {achieved ? '✓' : milestone.icon}
                </MilestoneIcon>
                <MilestoneText>
                  {milestone.title} (Level {milestone.level})
                </MilestoneText>
              </MilestoneItem>
            );
          })}
        </MilestoneList>
      </MilestoneSection>
    </XPContainer>
  );
};

export default XPDisplay;