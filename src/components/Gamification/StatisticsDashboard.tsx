import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useUserProgress } from '../../context/UserProgressContext';
import { useProgressTracking } from '../../hooks/useProgressTracking';
import { useXPSystem } from '../../hooks/useXPSystem';
import { useStreakManagement } from '../../hooks/useStreakManagement';

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

const DashboardContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
`;

const DashboardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const DashboardInfo = styled.div`
  flex: 1;
`;

const DashboardTitle = styled.h2`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const DashboardSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ color: string }>`
  background: linear-gradient(135deg, ${props => props.color}20, ${props => props.color}40);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid ${props => props.color}40;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div<{ color: string }>`
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
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatTitle = styled.h3`
  color: white;
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const StatSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
`;

const StatValue = styled.div`
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  text-align: center;
`;

const ChartSection = styled.div`
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  color: white;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SimpleChart = styled.div`
  display: flex;
  align-items: end;
  gap: 0.5rem;
  height: 120px;
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
    top: -25px;
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

const LeaderboardSection = styled.div`
  margin-bottom: 2rem;
`;

const LeaderboardTitle = styled.h3`
  color: white;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LeaderboardItem = styled.div<{ isCurrentUser: boolean; rank: number }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.isCurrentUser ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 12px;
  border: 1px solid ${props => props.isCurrentUser ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.3s ease;
  animation: ${slideIn} 0.3s ease-out;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  ${props => props.isCurrentUser && `
    border: 2px solid #4ecdc4;
    animation: ${pulse} 2s infinite;
  `}
`;

const RankBadge = styled.div<{ rank: number }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background: ${props => {
    if (props.rank === 1) return '#ffd700';
    if (props.rank === 2) return '#c0c0c0';
    if (props.rank === 3) return '#cd7f32';
    return '#667eea';
  }};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  color: white;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const UserStats = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const UserScore = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: right;
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

const StatisticsDashboard: React.FC = () => {
  const { userProgress } = useUserProgress();
  const { getTotalXP, getTrackProgress } = useProgressTracking();
  const { getLevelInfo, getXPRank } = useXPSystem();
  const { getStreakInfo } = useStreakManagement();

  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', questions: 3, xp: 30 },
    { day: 'Tue', questions: 5, xp: 50 },
    { day: 'Wed', questions: 2, xp: 20 },
    { day: 'Thu', questions: 4, xp: 40 },
    { day: 'Fri', questions: 6, xp: 60 },
    { day: 'Sat', questions: 1, xp: 10 },
    { day: 'Sun', questions: 0, xp: 0 }
  ]);

  const [leaderboardData, setLeaderboardData] = useState([
    { id: 1, name: 'You', xp: getTotalXP(), questions: 45, streak: 7 },
    { id: 2, name: 'Alex Chen', xp: 1250, questions: 38, streak: 5 },
    { id: 3, name: 'Sarah Kim', xp: 980, questions: 32, streak: 3 },
    { id: 4, name: 'Mike Johnson', xp: 750, questions: 28, streak: 2 },
    { id: 5, name: 'Emma Wilson', xp: 620, questions: 25, streak: 1 }
  ]);

  const levelInfo = getLevelInfo();
  const streakInfo = getStreakInfo();
  const totalXP = getTotalXP();
  const rank = getXPRank();

  const maxQuestions = Math.max(...weeklyData.map(d => d.questions));
  const maxXP = Math.max(...weeklyData.map(d => d.xp));

  const stats = [
    {
      title: 'Total XP',
      subtitle: 'Experience Points',
      value: totalXP.toLocaleString(),
      label: 'Points',
      icon: '⭐',
      color: '#ffd700'
    },
    {
      title: 'Current Level',
      subtitle: levelInfo.levelName,
      value: levelInfo.currentLevel,
      label: 'Level',
      icon: '🏆',
      color: '#4ecdc4'
    },
    {
      title: 'Current Streak',
      subtitle: 'Days in a row',
      value: streakInfo.currentStreak,
      label: 'Days',
      icon: '🔥',
      color: '#ff6b6b'
    },
    {
      title: 'Questions Answered',
      subtitle: 'Total questions',
      value: userProgress?.statistics.totalQuestionsAnswered || 0,
      label: 'Questions',
      icon: '❓',
      color: '#3498db'
    },
    {
      title: 'Accuracy',
      subtitle: 'Correct answers',
      value: `${userProgress?.statistics.averageAccuracy || 0}%`,
      label: 'Accuracy',
      icon: '🎯',
      color: '#9b59b6'
    },
    {
      title: 'Time Spent',
      subtitle: 'Learning time',
      value: `${Math.round((userProgress?.statistics.totalTimeSpent || 0) / 60)}h`,
      label: 'Hours',
      icon: '⏱️',
      color: '#f39c12'
    }
  ];

  return (
    <DashboardContainer>
      <BackgroundPattern />
      
      <DashboardHeader>
        <DashboardIcon>
          📊
        </DashboardIcon>
        <DashboardInfo>
          <DashboardTitle>Statistics Dashboard</DashboardTitle>
          <DashboardSubtitle>
            Track your learning progress and compare with others
          </DashboardSubtitle>
        </DashboardInfo>
      </DashboardHeader>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} color={stat.color}>
            <StatHeader>
              <StatIcon color={stat.color}>
                {stat.icon}
              </StatIcon>
              <StatInfo>
                <StatTitle>{stat.title}</StatTitle>
                <StatSubtitle>{stat.subtitle}</StatSubtitle>
              </StatInfo>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <ChartSection>
        <ChartTitle>
          📈 Weekly Activity
        </ChartTitle>
        <ChartContainer>
          <SimpleChart>
            {weeklyData.map((day, index) => (
              <div key={day.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <ChartBar
                  height={(day.questions / maxQuestions) * 100}
                  color="#4ecdc4"
                  data-value={day.questions}
                />
                <ChartLabel>{day.day}</ChartLabel>
              </div>
            ))}
          </SimpleChart>
        </ChartContainer>
      </ChartSection>

      <LeaderboardSection>
        <LeaderboardTitle>
          🏆 Leaderboard
        </LeaderboardTitle>
        <LeaderboardList>
          {leaderboardData.map((user, index) => (
            <LeaderboardItem
              key={user.id}
              isCurrentUser={user.name === 'You'}
              rank={index + 1}
            >
              <RankBadge rank={index + 1}>
                {index + 1}
              </RankBadge>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserStats>
                  {user.questions} questions • {user.streak} day streak
                </UserStats>
              </UserInfo>
              <UserScore>{user.xp.toLocaleString()} XP</UserScore>
            </LeaderboardItem>
          ))}
        </LeaderboardList>
      </LeaderboardSection>
    </DashboardContainer>
  );
};

export default StatisticsDashboard;
