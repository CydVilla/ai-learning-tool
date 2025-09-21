import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useUserProgress } from '../../context/UserProgressContext';
import { DailyGoalService, DailyProgress, DailyGoal } from '../../services/dailyGoalService';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const GoalContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1rem;
`;

const GoalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const GoalTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GoalIcon = styled.span`
  font-size: 1.5rem;
`;

const GoalProgress = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
`;

const ProgressFill = styled.div<{ percentage: number; completed: boolean }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => props.completed ? 
    'linear-gradient(90deg, #4ecdc4, #44a08d)' : 
    'linear-gradient(90deg, #667eea, #764ba2)'};
  border-radius: 4px;
  transition: width 0.3s ease;
  animation: ${props => props.completed ? `${pulse} 0.6s ease-in-out` : 'none'};
`;

const CompletedBadge = styled.div`
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  animation: ${pulse} 1s infinite;
`;

const DailySummary = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SummaryItem = styled.div`
  text-align: center;
`;

const SummaryValue = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const SummaryLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const MotivationText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-style: italic;
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid #4ecdc4;
`;

const AchievementList = styled.div`
  margin-top: 1rem;
`;

const AchievementItem = styled.div`
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  color: #ffd700;
  font-size: 0.9rem;
  animation: ${slideIn} 0.3s ease-out;
`;

const GoalRecommendation = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 1rem;
  color: #667eea;
  font-size: 0.9rem;
`;

const DailyGoalTracker: React.FC = () => {
  const { userProgress } = useUserProgress();
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (userProgress) {
      // Create daily goals
      const goals = DailyGoalService.createDailyGoals(userProgress);
      
      // Create daily progress (in a real app, this would be loaded from storage)
      const progress: DailyProgress = {
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
      
      // Get achievements
      const dailyAchievements = DailyGoalService.getDailyGoalAchievements(progress);
      setAchievements(dailyAchievements);
    }
  }, [userProgress]);

  if (!dailyProgress || !userProgress) {
    return (
      <GoalContainer>
        <GoalTitle>Daily Goals</GoalTitle>
        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading...</div>
      </GoalContainer>
    );
  }

  const summary = DailyGoalService.getDailyProgressSummary(dailyProgress);
  const motivation = DailyGoalService.getDailyMotivation(dailyProgress, userProgress);
  const recommendations = DailyGoalService.getGoalRecommendations(userProgress);
  const progressData = DailyGoalService.getGoalProgressData(dailyProgress);

  return (
    <div>
      <GoalContainer>
        <GoalHeader>
          <GoalTitle>
            <GoalIcon>🎯</GoalIcon>
            Daily Goals
          </GoalTitle>
          <GoalProgress>
            {summary.goalsCompleted}/{summary.totalGoals} completed
          </GoalProgress>
        </GoalHeader>

        <DailySummary>
          <SummaryGrid>
            <SummaryItem>
              <SummaryValue>{summary.totalXP}</SummaryValue>
              <SummaryLabel>XP Earned</SummaryLabel>
            </SummaryItem>
            <SummaryItem>
              <SummaryValue>{summary.questionsAnswered}</SummaryValue>
              <SummaryLabel>Questions</SummaryLabel>
            </SummaryItem>
            <SummaryItem>
              <SummaryValue>{summary.timeSpent}m</SummaryValue>
              <SummaryLabel>Time Spent</SummaryLabel>
            </SummaryItem>
            <SummaryItem>
              <SummaryValue>{summary.bonusXP}</SummaryValue>
              <SummaryLabel>Bonus XP</SummaryLabel>
            </SummaryItem>
          </SummaryGrid>

          <MotivationText>{motivation}</MotivationText>
        </DailySummary>

        {progressData.map((goal) => (
          <div key={goal.id} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{goal.icon}</span>
                <span style={{ color: 'white', fontSize: '0.9rem' }}>{goal.label}</span>
              </div>
              {goal.completed ? (
                <CompletedBadge>✓ Completed</CompletedBadge>
              ) : (
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                  {goal.current}/{goal.target}
                </span>
              )}
            </div>
            <ProgressBar>
              <ProgressFill 
                percentage={goal.percentage} 
                completed={goal.completed}
              />
            </ProgressBar>
          </div>
        ))}

        {recommendations.length > 0 && (
          <GoalRecommendation>
            <strong>💡 Recommendation:</strong> {recommendations[0].reason}
            {recommendations[0].type === 'increase' && (
              <div style={{ marginTop: '0.5rem' }}>
                Consider increasing your daily XP goal to {recommendations[0].suggestedTarget} points.
              </div>
            )}
            {recommendations[0].type === 'decrease' && (
              <div style={{ marginTop: '0.5rem' }}>
                Consider reducing your daily XP goal to {recommendations[0].suggestedTarget} points.
              </div>
            )}
          </GoalRecommendation>
        )}
      </GoalContainer>

      {achievements.length > 0 && (
        <GoalContainer>
          <GoalTitle>
            <GoalIcon>🏆</GoalIcon>
            Today's Achievements
          </GoalTitle>
          <AchievementList>
            {achievements.map((achievement, index) => (
              <AchievementItem key={index}>
                {achievement}
              </AchievementItem>
            ))}
          </AchievementList>
        </GoalContainer>
      )}
    </div>
  );
};

export default DailyGoalTracker;
