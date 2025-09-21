import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useUserProgress } from '../../context/UserProgressContext';
import { DailyGoalService } from '../../services/dailyGoalService';

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

const GoalContainer = styled.div<{ allGoalsMet: boolean }>`
  background: ${props => props.allGoalsMet ? 
    'linear-gradient(135deg, #4ecdc4, #6dd5d0)' : 
    'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 2px solid ${props => props.allGoalsMet ? '#4ecdc4' : 'rgba(255, 255, 255, 0.2)'};
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  
  ${props => props.allGoalsMet && `
    animation: ${pulse} 2s infinite;
  `}
`;

const GoalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`;

const GoalIcon = styled.div<{ allGoalsMet: boolean }>`
  width: 50px;
  height: 50px;
  background: ${props => props.allGoalsMet ? '#4ecdc4' : '#f39c12'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: ${props => props.allGoalsMet ? `${bounce} 0.6s ease-in-out` : 'none'};
`;

const GoalInfo = styled.div`
  flex: 1;
`;

const GoalTitle = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const GoalSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const GoalStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div<{ completed: boolean }>`
  text-align: center;
  padding: 1rem;
  background: ${props => props.completed ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  border: 1px solid ${props => props.completed ? '#4ecdc4' : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.completed ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }
  
  ${props => props.completed && `
    animation: ${pulse} 0.6s ease-in-out;
  `}
`;

const StatValue = styled.div<{ completed: boolean }>`
  color: ${props => props.completed ? '#4ecdc4' : 'white'};
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const GoalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const GoalItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.completed ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 12px;
  border-left: 4px solid ${props => props.completed ? '#4ecdc4' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  animation: ${slideIn} 0.3s ease-out;
  
  ${props => props.completed && `
    background: rgba(255, 255, 255, 0.15);
    animation: ${pulse} 0.6s ease-in-out;
  `}
`;

const GoalIcon = styled.div<{ completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: ${props => props.completed ? '#4ecdc4' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
`;

const GoalDetails = styled.div`
  flex: 1;
`;

const GoalName = styled.div`
  color: white;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const GoalDescription = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const GoalProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number; completed: boolean }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.completed ? '#4ecdc4' : '#f39c12'};
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div<{ completed: boolean }>`
  color: ${props => props.completed ? '#4ecdc4' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 60px;
  text-align: right;
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

const CompletionBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #4ecdc4;
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

const DailyGoalTracker: React.FC = () => {
  const { userProgress } = useUserProgress();
  const [dailyProgress, setDailyProgress] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (userProgress) {
      // Create daily goals
      const goals = DailyGoalService.createDailyGoals(userProgress);
      
      // Create daily progress (in a real app, this would be loaded from storage)
      const progress = {
        date: new Date().toISOString().split('T')[0],
        totalXP: 0,
        questionsAnswered: 0,
        timeSpent: 0,
        tracks: {
          html: { xp: 0, questions: 0, timeSpent: 0 },
          css: { xp: 0, questions: 0, timeSpent: 0 },
          javascript: { xp: 0, questions: 0, timeSpent: 0 }
        },
        goals,
        streakMaintained: false,
        bonusXP: 0
      };
      
      setDailyProgress(progress);
    }
  }, [userProgress]);

  if (!dailyProgress || !userProgress) {
    return (
      <GoalContainer allGoalsMet={false}>
        <GoalHeader>
          <GoalIcon allGoalsMet={false}>🎯</GoalIcon>
          <GoalInfo>
            <GoalTitle>Daily Goals</GoalTitle>
            <GoalSubtitle>Loading your daily goals...</GoalSubtitle>
          </GoalInfo>
        </GoalHeader>
      </GoalContainer>
    );
  }

  const summary = DailyGoalService.getDailyProgressSummary(dailyProgress);
  const motivation = DailyGoalService.getDailyMotivation(dailyProgress, userProgress);
  const allGoalsMet = summary.isAllGoalsMet;

  const getGoalIcon = (type: string): string => {
    switch (type) {
      case 'xp': return '⭐';
      case 'questions': return '❓';
      case 'time': return '⏱️';
      case 'streak': return '🔥';
      default: return '🎯';
    }
  };

  const getGoalName = (type: string): string => {
    switch (type) {
      case 'xp': return 'XP Goal';
      case 'questions': return 'Questions Goal';
      case 'time': return 'Time Goal';
      case 'streak': return 'Streak Goal';
      default: return 'Goal';
    }
  };

  const getGoalDescription = (type: string, target: number): string => {
    switch (type) {
      case 'xp': return `Earn ${target} XP points`;
      case 'questions': return `Answer ${target} questions`;
      case 'time': return `Spend ${target} minutes learning`;
      case 'streak': return `Maintain your streak`;
      default: return 'Complete this goal';
    }
  };

  return (
    <GoalContainer allGoalsMet={allGoalsMet}>
      <BackgroundPattern />
      
      {allGoalsMet && (
        <CompletionBadge>
          🎉 All Goals Met!
        </CompletionBadge>
      )}
      
      <GoalHeader>
        <GoalIcon allGoalsMet={allGoalsMet}>
          {allGoalsMet ? '🎉' : '🎯'}
        </GoalIcon>
        <GoalInfo>
          <GoalTitle>Daily Goals</GoalTitle>
          <GoalSubtitle>
            {allGoalsMet ? 'Amazing! You\'ve completed all your daily goals!' : 'Complete your daily goals to maintain your streak!'}
          </GoalSubtitle>
        </GoalInfo>
      </GoalHeader>

      <GoalStats>
        <StatItem completed={summary.goalsCompleted > 0}>
          <StatValue completed={summary.goalsCompleted > 0}>
            {summary.goalsCompleted}
          </StatValue>
          <StatLabel>Goals Completed</StatLabel>
        </StatItem>
        <StatItem completed={summary.totalXP > 0}>
          <StatValue completed={summary.totalXP > 0}>
            {summary.totalXP}
          </StatValue>
          <StatLabel>XP Earned</StatLabel>
        </StatItem>
        <StatItem completed={summary.questionsAnswered > 0}>
          <StatValue completed={summary.questionsAnswered > 0}>
            {summary.questionsAnswered}
          </StatValue>
          <StatLabel>Questions</StatLabel>
        </StatItem>
        <StatItem completed={summary.timeSpent > 0}>
          <StatValue completed={summary.timeSpent > 0}>
            {summary.timeSpent}m
          </StatValue>
          <StatLabel>Time Spent</StatLabel>
        </StatItem>
      </GoalStats>

      <GoalList>
        {dailyProgress.goals.map((goal: any, index: number) => {
          const completed = goal.completed;
          const progressPercentage = Math.round((goal.current / goal.target) * 100);
          
          return (
            <GoalItem key={index} completed={completed}>
              <GoalIcon completed={completed}>
                {completed ? '✓' : getGoalIcon(goal.type)}
              </GoalIcon>
              <GoalDetails>
                <GoalName>{getGoalName(goal.type)}</GoalName>
                <GoalDescription>{getGoalDescription(goal.type, goal.target)}</GoalDescription>
              </GoalDetails>
              <GoalProgress>
                <ProgressBar>
                  <ProgressFill 
                    percentage={progressPercentage} 
                    completed={completed}
                  />
                </ProgressBar>
                <ProgressText completed={completed}>
                  {completed ? 'Complete' : `${goal.current}/${goal.target}`}
                </ProgressText>
              </GoalProgress>
            </GoalItem>
          );
        })}
      </GoalList>

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
    </GoalContainer>
  );
};

export default DailyGoalTracker;