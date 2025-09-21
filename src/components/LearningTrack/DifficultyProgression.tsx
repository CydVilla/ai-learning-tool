import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LearningTrack, DifficultyLevel } from '../../types';
import { useProgressTracking } from '../../hooks/useProgressTracking';
import { DifficultyProgressionService, ProgressionMilestone } from '../../services/difficultyProgressionService';
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

const ProgressionContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: white;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LevelProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const LevelCard = styled.div<{ isActive: boolean; isUnlocked: boolean; levelColor: string }>`
  background: ${props => props.isActive ? props.levelColor : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.isActive ? props.levelColor : props.isUnlocked ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  padding: 1.5rem;
  flex: 1;
  min-width: 200px;
  transition: all 0.3s ease;
  position: relative;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    ${props => props.isUnlocked && `
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `}
  }
  
  ${props => props.isActive && `
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    animation: ${pulse} 2s infinite;
  `}
  
  ${props => !props.isUnlocked && `
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

const LevelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const LevelIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  background: ${props => props.color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const LevelInfo = styled.div`
  flex: 1;
`;

const LevelName = styled.h4`
  color: white;
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const LevelDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const LevelStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.color};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
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
  border-radius: 16px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
`;

const MilestoneSection = styled.div`
  margin-top: 2rem;
`;

const MilestoneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MilestoneItem = styled.div<{ completed: boolean; trackColor: string }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid ${props => props.completed ? props.trackColor : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  animation: ${slideIn} 0.3s ease-out;
  
  ${props => props.completed && `
    background: rgba(255, 255, 255, 0.1);
    animation: ${pulse} 0.6s ease-in-out;
  `}
`;

const MilestoneIcon = styled.div<{ completed: boolean; trackColor: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: ${props => props.completed ? props.trackColor : 'rgba(255, 255, 255, 0.2)'};
  color: white;
`;

const MilestoneInfo = styled.div`
  flex: 1;
`;

const MilestoneTitle = styled.div`
  color: white;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const MilestoneDescription = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const MilestoneProgress = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
`;

const RecommendationSection = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const RecommendationTitle = styled.h4`
  color: #667eea;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RecommendationText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

interface DifficultyProgressionProps {
  track: LearningTrack;
}

const DifficultyProgression: React.FC<DifficultyProgressionProps> = ({ track }) => {
  const { getTrackProgress } = useProgressTracking();
  const colors = getTrackColors(track);
  
  const progress = getTrackProgress(track);
  const questionsCompleted = progress?.questionsCompleted || 0;
  const accuracy = progress?.accuracy || 0;
  
  const difficultyProgression = DifficultyProgressionService.getDifficultyProgression(
    track,
    questionsCompleted,
    accuracy,
    0 // timeSpent not used in current calculation
  );
  
  const milestones = DifficultyProgressionService.getProgressionMilestones(
    track,
    questionsCompleted,
    accuracy
  );
  
  const recommendedNext = DifficultyProgressionService.getRecommendedNextLevel(
    track,
    questionsCompleted,
    accuracy
  );

  const levels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

  return (
    <ProgressionContainer>
      <SectionTitle>
        🎯 Difficulty Progression
      </SectionTitle>

      <LevelProgress>
        {levels.map((level) => {
          const isActive = difficultyProgression.currentLevel === level;
          const isUnlocked = difficultyProgression.unlockedLevels.includes(level);
          const levelColor = DifficultyProgressionService.getLevelColor(level);
          const levelIcon = DifficultyProgressionService.getLevelIcon(level);
          const levelDescription = DifficultyProgressionService.getLevelDescription(level);
          const requirements = DifficultyProgressionService.getLevelRequirements(track, level);
          const completionPercentage = DifficultyProgressionService.getLevelCompletionPercentage(
            track,
            level,
            questionsCompleted,
            accuracy
          );

          return (
            <LevelCard
              key={level}
              isActive={isActive}
              isUnlocked={isUnlocked}
              levelColor={levelColor}
            >
              {!isUnlocked && (
                <LockedOverlay>
                  🔒 Locked
                </LockedOverlay>
              )}
              
              <LevelHeader>
                <LevelIcon color={levelColor}>
                  {levelIcon}
                </LevelIcon>
                <LevelInfo>
                  <LevelName>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </LevelName>
                  <LevelDescription>{levelDescription}</LevelDescription>
                </LevelInfo>
              </LevelHeader>

              <LevelStats>
                <StatItem>
                  <StatValue>{requirements.questionsRequired}</StatValue>
                  <StatLabel>Questions</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{requirements.accuracyRequired}%</StatValue>
                  <StatLabel>Accuracy</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{requirements.rewards.xp}</StatValue>
                  <StatLabel>XP Reward</StatLabel>
                </StatItem>
              </LevelStats>

              <ProgressBar>
                <ProgressFill 
                  percentage={completionPercentage} 
                  color={levelColor} 
                />
              </ProgressBar>
              <ProgressText>
                <span>Progress</span>
                <span>{completionPercentage}%</span>
              </ProgressText>
            </LevelCard>
          );
        })}
      </LevelProgress>

      <MilestoneSection>
        <SectionTitle>
          🏆 Progression Milestones
        </SectionTitle>
        <MilestoneList>
          {milestones.map((milestone) => (
            <MilestoneItem
              key={milestone.id}
              completed={milestone.completed}
              trackColor={colors.primary}
            >
              <MilestoneIcon
                completed={milestone.completed}
                trackColor={colors.primary}
              >
                {milestone.completed ? '✓' : '○'}
              </MilestoneIcon>
              <MilestoneInfo>
                <MilestoneTitle>{milestone.title}</MilestoneTitle>
                <MilestoneDescription>{milestone.description}</MilestoneDescription>
                <MilestoneProgress>
                  {milestone.completed ? 'Completed' : `Progress: ${milestone.progress}%`}
                </MilestoneProgress>
              </MilestoneInfo>
            </MilestoneItem>
          ))}
        </MilestoneList>
      </MilestoneSection>

      {recommendedNext && (
        <RecommendationSection>
          <RecommendationTitle>
            💡 Recommendation
          </RecommendationTitle>
          <RecommendationText>
            You're close to unlocking the <strong>{recommendedNext}</strong> level! 
            Keep practicing to improve your accuracy and complete more questions.
          </RecommendationText>
        </RecommendationSection>
      )}
    </ProgressionContainer>
  );
};

export default DifficultyProgression;
