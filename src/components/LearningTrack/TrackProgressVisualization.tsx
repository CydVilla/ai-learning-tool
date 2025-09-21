import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LearningTrack } from '../../types';
import { useProgressTracking } from '../../hooks/useProgressTracking';

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

const VisualizationContainer = styled.div`
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

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ProgressCard = styled.div<{ trackColor: string }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${props => props.trackColor}40;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CardIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  background: ${props => props.color};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
`;

const CardTitle = styled.h4`
  color: white;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
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
  font-size: 0.9rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
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

const StatChange = styled.div<{ positive: boolean }>`
  color: ${props => props.positive ? '#4ecdc4' : '#ff6b6b'};
  font-size: 0.8rem;
  margin-top: 0.25rem;
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
`;

const MilestoneProgress = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const ChartTitle = styled.h4`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const SimpleChart = styled.div`
  display: flex;
  align-items: end;
  gap: 0.5rem;
  height: 100px;
  padding: 1rem 0;
`;

const ChartBar = styled.div<{ height: number; color: string }>`
  flex: 1;
  height: ${props => props.height}%;
  background: ${props => props.color};
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  position: relative;
  
  &::after {
    content: attr(data-value);
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const ChartLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  text-align: center;
  margin-top: 0.5rem;
`;

interface TrackProgressVisualizationProps {
  track: LearningTrack;
}

const TrackProgressVisualization: React.FC<TrackProgressVisualizationProps> = ({ track }) => {
  const { getTrackProgress, getLevelInfo, getTrackCompletionPercentage, getNextMilestone } = useProgressTracking();

  const progress = getTrackProgress(track);
  const levelInfo = getLevelInfo(track);
  const nextMilestone = getNextMilestone(track);

  const trackInfo = {
    html: { name: 'HTML', color: '#ff6b6b', totalQuestions: 50 },
    css: { name: 'CSS', color: '#4ecdc4', totalQuestions: 60 },
    javascript: { name: 'JavaScript', color: '#45b7d1', totalQuestions: 80 }
  };

  const currentTrack = trackInfo[track];

  // Mock data for visualization (in a real app, this would come from actual progress data)
  const weeklyProgress = [
    { day: 'Mon', questions: 3, xp: 30 },
    { day: 'Tue', questions: 5, xp: 50 },
    { day: 'Wed', questions: 2, xp: 20 },
    { day: 'Thu', questions: 4, xp: 40 },
    { day: 'Fri', questions: 6, xp: 60 },
    { day: 'Sat', questions: 1, xp: 10 },
    { day: 'Sun', questions: 0, xp: 0 }
  ];

  const milestones = [
    { id: 1, title: 'First Steps', description: 'Complete your first question', target: 1, completed: (progress?.questionsCompleted || 0) >= 1 },
    { id: 2, title: 'Getting Started', description: 'Complete 5 questions', target: 5, completed: (progress?.questionsCompleted || 0) >= 5 },
    { id: 3, title: 'Building Momentum', description: 'Complete 10 questions', target: 10, completed: (progress?.questionsCompleted || 0) >= 10 },
    { id: 4, title: 'Halfway There', description: 'Complete 25 questions', target: 25, completed: (progress?.questionsCompleted || 0) >= 25 },
    { id: 5, title: 'Track Master', description: 'Complete all questions', target: currentTrack.totalQuestions, completed: (progress?.questionsCompleted || 0) >= currentTrack.totalQuestions }
  ];

  const maxQuestions = Math.max(...weeklyProgress.map(d => d.questions));

  return (
    <VisualizationContainer>
      <SectionTitle>
        📊 {currentTrack.name} Progress Overview
      </SectionTitle>

      <ProgressGrid>
        <ProgressCard trackColor={currentTrack.color}>
          <CardHeader>
            <CardIcon color={currentTrack.color}>📈</CardIcon>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <ProgressBar>
            <ProgressFill 
              percentage={getTrackCompletionPercentage(track, currentTrack.totalQuestions)} 
              color={currentTrack.color} 
            />
          </ProgressBar>
          <ProgressText>
            <span>{progress?.questionsCompleted || 0} / {currentTrack.totalQuestions}</span>
            <span>{getTrackCompletionPercentage(track, currentTrack.totalQuestions)}%</span>
          </ProgressText>
        </ProgressCard>

        <ProgressCard trackColor={currentTrack.color}>
          <CardHeader>
            <CardIcon color={currentTrack.color}>🎯</CardIcon>
            <CardTitle>Accuracy</CardTitle>
          </CardHeader>
          <ProgressBar>
            <ProgressFill 
              percentage={progress?.accuracy || 0} 
              color={currentTrack.color} 
            />
          </ProgressBar>
          <ProgressText>
            <span>Current Accuracy</span>
            <span>{progress?.accuracy || 0}%</span>
          </ProgressText>
        </ProgressCard>

        <ProgressCard trackColor={currentTrack.color}>
          <CardHeader>
            <CardIcon color={currentTrack.color}>🔥</CardIcon>
            <CardTitle>Streak</CardTitle>
          </CardHeader>
          <ProgressBar>
            <ProgressFill 
              percentage={Math.min((progress?.streak || 0) * 10, 100)} 
              color={currentTrack.color} 
            />
          </ProgressBar>
          <ProgressText>
            <span>Current Streak</span>
            <span>{progress?.streak || 0} days</span>
          </ProgressText>
        </ProgressCard>
      </ProgressGrid>

      <StatsContainer>
        <StatCard>
          <StatValue>{progress?.xp || 0}</StatValue>
          <StatLabel>Total XP</StatLabel>
          <StatChange positive={true}>+{Math.round((progress?.xp || 0) * 0.1)} this week</StatChange>
        </StatCard>
        <StatCard>
          <StatValue>{progress?.questionsCompleted || 0}</StatValue>
          <StatLabel>Questions Completed</StatLabel>
          <StatChange positive={true}>+{Math.round((progress?.questionsCompleted || 0) * 0.2)} this week</StatChange>
        </StatCard>
        <StatCard>
          <StatValue>{Math.round(progress?.timeSpent || 0)}m</StatValue>
          <StatLabel>Time Spent</StatLabel>
          <StatChange positive={true}>+{Math.round((progress?.timeSpent || 0) * 0.15)}m this week</StatChange>
        </StatCard>
        <StatCard>
          <StatValue>{levelInfo?.currentLevel || 1}</StatValue>
          <StatLabel>Current Level</StatLabel>
          <StatChange positive={true}>Level {levelInfo?.currentLevel || 1}</StatChange>
        </StatCard>
      </StatsContainer>

      <ChartContainer>
        <ChartTitle>Weekly Activity</ChartTitle>
        <SimpleChart>
          {weeklyProgress.map((day, index) => (
            <div key={day.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <ChartBar
                height={(day.questions / maxQuestions) * 100}
                color={currentTrack.color}
                data-value={day.questions}
              />
              <ChartLabel>{day.day}</ChartLabel>
            </div>
          ))}
        </SimpleChart>
      </ChartContainer>

      <MilestoneSection>
        <SectionTitle>
          🏆 Milestones
        </SectionTitle>
        <MilestoneList>
          {milestones.map((milestone) => (
            <MilestoneItem
              key={milestone.id}
              completed={milestone.completed}
              trackColor={currentTrack.color}
            >
              <MilestoneIcon
                completed={milestone.completed}
                trackColor={currentTrack.color}
              >
                {milestone.completed ? '✓' : '○'}
              </MilestoneIcon>
              <MilestoneInfo>
                <MilestoneTitle>{milestone.title}</MilestoneTitle>
                <MilestoneDescription>{milestone.description}</MilestoneDescription>
              </MilestoneInfo>
              <MilestoneProgress>
                {milestone.completed ? 'Completed' : `${progress?.questionsCompleted || 0}/${milestone.target}`}
              </MilestoneProgress>
            </MilestoneItem>
          ))}
        </MilestoneList>
      </MilestoneSection>
    </VisualizationContainer>
  );
};

export default TrackProgressVisualization;
