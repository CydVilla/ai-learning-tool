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

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const ProgressContainer = styled.div<{ trackColor: string; completed: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${props => props.trackColor}40;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  
  ${props => props.completed && `
    background: linear-gradient(135deg, ${props.trackColor}20, ${props.trackColor}40);
    border: 2px solid ${props.trackColor};
    animation: ${pulse} 2s infinite;
  `}
`;

const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`;

const ProgressIcon = styled.div<{ color: string; completed: boolean }>`
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
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: ${props => props.completed ? `${pulse} 1s infinite` : 'none'};
`;

const ProgressInfo = styled.div`
  flex: 1;
`;

const ProgressTitle = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ProgressSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div<{ percentage: number; color: string; completed: boolean }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.color};
  border-radius: 6px;
  transition: width 0.3s ease;
  position: relative;
  
  ${props => props.completed && `
    background: linear-gradient(90deg, ${props.color}, #ffd700);
    animation: ${glow} 1s infinite;
  `}
  
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

const ProgressStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
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

const MilestoneItem = styled.div<{ achieved: boolean; trackColor: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid ${props => props.achieved ? props.trackColor : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  
  ${props => props.achieved && `
    background: rgba(255, 255, 255, 0.1);
    animation: ${pulse} 0.6s ease-in-out;
  `}
`;

const MilestoneIcon = styled.div<{ achieved: boolean; trackColor: string }>`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  background: ${props => props.achieved ? props.trackColor : 'rgba(255, 255, 255, 0.2)'};
  color: white;
`;

const MilestoneText = styled.div`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

const CompletionBadge = styled.div<{ trackColor: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.trackColor};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: ${pulse} 2s infinite;
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

interface ProgressBarProps {
  track: LearningTrack;
  current: number;
  total: number;
  title: string;
  subtitle?: string;
  milestones?: Array<{
    threshold: number;
    title: string;
    icon: string;
  }>;
  showStats?: boolean;
  showMilestones?: boolean;
}

const ProgressBarComponent: React.FC<ProgressBarProps> = ({
  track,
  current,
  total,
  title,
  subtitle,
  milestones = [],
  showStats = true,
  showMilestones = true
}) => {
  const colors = getTrackColors(track);
  const percentage = Math.round((current / total) * 100);
  const completed = percentage >= 100;

  const getTrackIcon = (track: LearningTrack): string => {
    const icons = {
      html: 'H',
      css: 'C',
      javascript: 'J'
    };
    return icons[track];
  };

  const getTrackName = (track: LearningTrack): string => {
    const names = {
      html: 'HTML',
      css: 'CSS',
      javascript: 'JavaScript'
    };
    return names[track];
  };

  const defaultMilestones = [
    { threshold: 25, title: 'Quarter Complete', icon: '🌱' },
    { threshold: 50, title: 'Halfway There', icon: '🌿' },
    { threshold: 75, title: 'Almost Done', icon: '🌳' },
    { threshold: 100, title: 'Complete!', icon: '🏆' }
  ];

  const displayMilestones = milestones.length > 0 ? milestones : defaultMilestones;

  return (
    <ProgressContainer trackColor={colors.primary} completed={completed}>
      <BackgroundPattern />
      
      {completed && (
        <CompletionBadge trackColor={colors.primary}>
          🎉 Complete!
        </CompletionBadge>
      )}
      
      <ProgressHeader>
        <ProgressIcon color={colors.primary} completed={completed}>
          {getTrackIcon(track)}
        </ProgressIcon>
        <ProgressInfo>
          <ProgressTitle>{title}</ProgressTitle>
          <ProgressSubtitle>{subtitle || `${getTrackName(track)} Learning Progress`}</ProgressSubtitle>
        </ProgressInfo>
      </ProgressHeader>

      <ProgressBar>
        <ProgressFill 
          percentage={percentage} 
          color={colors.primary} 
          completed={completed}
        />
      </ProgressBar>

      {showStats && (
        <ProgressStats>
          <StatItem>
            <StatValue>{current}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{total}</StatValue>
            <StatLabel>Total</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{percentage}%</StatValue>
            <StatLabel>Progress</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{total - current}</StatValue>
            <StatLabel>Remaining</StatLabel>
          </StatItem>
        </ProgressStats>
      )}

      {showMilestones && (
        <MilestoneSection>
          <MilestoneTitle>
            🎯 Milestones
          </MilestoneTitle>
          <MilestoneList>
            {displayMilestones.map((milestone) => {
              const achieved = percentage >= milestone.threshold;
              return (
                <MilestoneItem
                  key={milestone.threshold}
                  achieved={achieved}
                  trackColor={colors.primary}
                >
                  <MilestoneIcon
                    achieved={achieved}
                    trackColor={colors.primary}
                  >
                    {achieved ? '✓' : milestone.icon}
                  </MilestoneIcon>
                  <MilestoneText>
                    {milestone.title} ({milestone.threshold}%)
                  </MilestoneText>
                </MilestoneItem>
              );
            })}
          </MilestoneList>
        </MilestoneSection>
      )}
    </ProgressContainer>
  );
};

export default ProgressBarComponent;
