import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import TrackProgressCard from '../components/Progress/TrackProgressCard';
import StreakDisplay from '../components/Gamification/StreakDisplay';
import { useUserProgress } from '../context/UserProgressContext';

const HomeContainer = styled.div`
  text-align: center;
  color: white;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.9;
`;

const TrackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TrackCard = styled(Link)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const TrackIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  background: ${props => props.color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
  color: white;
`;

const TrackTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const TrackDescription = styled.p`
  opacity: 0.8;
  line-height: 1.6;
`;

const ProgressSection = styled.div`
  margin: 3rem 0;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StreakSection = styled.div`
  margin: 3rem 0;
  display: flex;
  justify-content: center;
`;

const StreakWrapper = styled.div`
  max-width: 400px;
  width: 100%;
`;

const Home: React.FC = () => {
  const { userProgress, isLoading } = useUserProgress();

  if (isLoading) {
    return (
      <HomeContainer>
        <Title>Welcome to AI Learning Tool</Title>
        <Subtitle>Loading your progress...</Subtitle>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Title>Welcome to AI Learning Tool</Title>
      <Subtitle>Master web development with AI-powered feedback</Subtitle>
      
      {userProgress && (
        <>
          <StreakSection>
            <StreakWrapper>
              <StreakDisplay />
            </StreakWrapper>
          </StreakSection>
          
          <ProgressSection>
            <SectionTitle>Your Progress</SectionTitle>
            <ProgressGrid>
              <TrackProgressCard track="html" />
              <TrackProgressCard track="css" />
              <TrackProgressCard track="javascript" />
            </ProgressGrid>
          </ProgressSection>
        </>
      )}
      
      <TrackGrid>
        <TrackCard to="/html">
          <TrackIcon color="#ff6b6b">H</TrackIcon>
          <TrackTitle>HTML</TrackTitle>
          <TrackDescription>
            Learn the foundation of web development with HTML. 
            Master tags, structure, and semantic markup.
          </TrackDescription>
        </TrackCard>
        
        <TrackCard to="/css">
          <TrackIcon color="#4ecdc4">C</TrackIcon>
          <TrackTitle>CSS</TrackTitle>
          <TrackDescription>
            Style your websites beautifully with CSS. 
            Learn layouts, animations, and responsive design.
          </TrackDescription>
        </TrackCard>
        
        <TrackCard to="/javascript">
          <TrackIcon color="#45b7d1">J</TrackIcon>
          <TrackTitle>JavaScript</TrackTitle>
          <TrackDescription>
            Add interactivity to your websites with JavaScript. 
            Master functions, DOM manipulation, and more.
          </TrackDescription>
        </TrackCard>
      </TrackGrid>
    </HomeContainer>
  );
};

export default Home;
