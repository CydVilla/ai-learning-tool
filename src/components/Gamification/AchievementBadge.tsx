import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Achievement } from '../../types';

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

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const BadgeContainer = styled.div<{ 
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  isNew: boolean;
}>`
  background: ${props => {
    if (!props.unlocked) return 'rgba(255, 255, 255, 0.1)';
    switch (props.rarity) {
      case 'legendary': return 'linear-gradient(135deg, #ffd700, #ffed4e)';
      case 'epic': return 'linear-gradient(135deg, #8e44ad, #9b59b6)';
      case 'rare': return 'linear-gradient(135deg, #3498db, #2980b9)';
      default: return 'linear-gradient(135deg, #95a5a6, #bdc3c7)';
    }
  }};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 2px solid ${props => {
    if (!props.unlocked) return 'rgba(255, 255, 255, 0.2)';
    switch (props.rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#8e44ad';
      case 'rare': return '#3498db';
      default: return '#95a5a6';
    }
  }};
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${props => props.isNew ? `${bounce} 0.6s ease-in-out` : `${fadeIn} 0.6s ease-out`};
  
  &:hover {
    ${props => props.unlocked && `
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `}
  }
  
  ${props => props.unlocked && props.rarity === 'legendary' && `
    animation: ${glow} 2s infinite;
  `}
  
  ${props => props.unlocked && props.rarity === 'epic' && `
    animation: ${pulse} 2s infinite;
  `}
`;

const BadgeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`;

const BadgeIcon = styled.div<{ 
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  isNew: boolean;
}>`
  width: 60px;
  height: 60px;
  background: ${props => {
    if (!props.unlocked) return 'rgba(255, 255, 255, 0.2)';
    switch (props.rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#8e44ad';
      case 'rare': return '#3498db';
      default: return '#95a5a6';
    }
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: ${props => {
    if (!props.unlocked) return 'none';
    if (props.isNew) return `${bounce} 0.6s ease-in-out`;
    if (props.rarity === 'legendary') return `${rotate} 3s linear infinite`;
    if (props.rarity === 'epic') return `${pulse} 1s infinite`;
    return 'none';
  }};
`;

const BadgeInfo = styled.div`
  flex: 1;
`;

const BadgeTitle = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const BadgeSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const BadgeDescription = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
`;

const BadgeStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const RarityBadge = styled.div<{ rarity: 'common' | 'rare' | 'epic' | 'legendary' }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => {
    switch (props.rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#8e44ad';
      case 'rare': return '#3498db';
      default: return '#95a5a6';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const NewBadge = styled.div`
  position: absolute;
  top: -5px;
  left: -5px;
  background: #e74c3c;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  animation: ${pulse} 1s infinite;
  z-index: 3;
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
  z-index: 2;
`;

const ProgressSection = styled.div`
  margin-top: 1rem;
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

const ProgressFill = styled.div<{ percentage: number; rarity: 'common' | 'rare' | 'epic' | 'legendary' }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => {
    switch (props.rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#8e44ad';
      case 'rare': return '#3498db';
      default: return '#95a5a6';
    }
  }};
  border-radius: 4px;
  transition: width 0.3s ease;
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

interface AchievementBadgeProps {
  achievement: Achievement;
  isNew?: boolean;
  onUnlock?: (achievement: Achievement) => void;
  showProgress?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  isNew = false,
  onUnlock,
  showProgress = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isNew) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [isNew]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#8e44ad';
      case 'rare': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '👑';
      case 'epic': return '💎';
      case 'rare': return '⭐';
      default: return '🏆';
    }
  };

  const getRarityName = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'Legendary';
      case 'epic': return 'Epic';
      case 'rare': return 'Rare';
      default: return 'Common';
    }
  };

  const progressPercentage = achievement.progress ? 
    Math.round((achievement.progress.current / achievement.progress.target) * 100) : 100;

  return (
    <BadgeContainer 
      rarity={achievement.rarity || 'common'} 
      unlocked={achievement.unlocked || false}
      isNew={isNew}
    >
      <BackgroundPattern />
      
      {isNew && (
        <NewBadge>
          NEW!
        </NewBadge>
      )}
      
      <RarityBadge rarity={achievement.rarity || 'common'}>
        {getRarityName(achievement.rarity || 'common')}
      </RarityBadge>
      
      {!(achievement.unlocked || false) && (
        <LockedOverlay>
          🔒 Locked
        </LockedOverlay>
      )}
      
      <BadgeHeader>
        <BadgeIcon 
          rarity={achievement.rarity || 'common'} 
          unlocked={achievement.unlocked || false}
          isNew={isNew}
        >
          {achievement.icon}
        </BadgeIcon>
        <BadgeInfo>
          <BadgeTitle>{achievement.name}</BadgeTitle>
          <BadgeSubtitle>{achievement.description}</BadgeSubtitle>
        </BadgeInfo>
      </BadgeHeader>

      <BadgeDescription>
        {achievement.description}
      </BadgeDescription>

      <BadgeStats>
        <StatItem>
          <StatValue>{getRarityIcon(achievement.rarity || 'common')}</StatValue>
          <StatLabel>Rarity</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>50</StatValue>
          <StatLabel>XP Reward</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{(achievement.unlocked || false) ? '✓' : '○'}</StatValue>
          <StatLabel>Status</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{achievement.category}</StatValue>
          <StatLabel>Category</StatLabel>
        </StatItem>
      </BadgeStats>

      {showProgress && achievement.progress && !(achievement.unlocked || false) && (
        <ProgressSection>
          <ProgressHeader>
            <ProgressLabel>Progress</ProgressLabel>
            <ProgressValue>{achievement.progress.current}/{achievement.progress.target}</ProgressValue>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill 
              percentage={progressPercentage} 
              rarity={achievement.rarity || 'common'} 
            />
          </ProgressBar>
        </ProgressSection>
      )}
    </BadgeContainer>
  );
};

export default AchievementBadge;
