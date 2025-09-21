import React, { useState } from 'react';
import styled from 'styled-components';
import LessonContainer from '../components/LearningTrack/LessonContainer';
import { DifficultyLevel } from '../types';

const TrackContainer = styled.div`
  color: white;
  padding: 2rem;
`;

const TrackHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const TrackIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #ff6b6b;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
  color: white;
`;

const TrackTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const TrackDescription = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const DifficultySelector = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const DifficultyTitle = styled.h2`
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const DifficultyButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const DifficultyButton = styled.button<{ isSelected: boolean }>`
  background: ${props => props.isSelected ? '#4ecdc4' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;

  &:hover {
    background: ${props => props.isSelected ? '#4ecdc4' : 'rgba(255, 255, 255, 0.3)'};
    transform: translateY(-2px);
  }
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(78, 205, 196, 0.3);
  }
`;

const HTMLTrack: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('beginner');
  const [startLesson, setStartLesson] = useState(false);

  const difficulties: { level: DifficultyLevel; label: string; description: string }[] = [
    { level: 'beginner', label: 'Beginner', description: 'Learn the basics' },
    { level: 'intermediate', label: 'Intermediate', description: 'Build on fundamentals' },
    { level: 'advanced', label: 'Advanced', description: 'Master complex concepts' }
  ];

  if (startLesson) {
    return <LessonContainer track="html" difficulty={selectedDifficulty} />;
  }

  return (
    <TrackContainer>
      <TrackHeader>
        <TrackIcon>H</TrackIcon>
        <TrackTitle>HTML Learning Track</TrackTitle>
        <TrackDescription>
          Master the foundation of web development with HTML. 
          Learn about tags, structure, semantic markup, and accessibility.
        </TrackDescription>
      </TrackHeader>
      
      <DifficultySelector>
        <DifficultyTitle>Choose Your Difficulty Level</DifficultyTitle>
        <DifficultyButtons>
          {difficulties.map(({ level, label, description }) => (
            <DifficultyButton
              key={level}
              isSelected={selectedDifficulty === level}
              onClick={() => setSelectedDifficulty(level)}
            >
              <div>{label}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
                {description}
              </div>
            </DifficultyButton>
          ))}
        </DifficultyButtons>
        <StartButton onClick={() => setStartLesson(true)}>
          Start {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Lessons
        </StartButton>
      </DifficultySelector>
    </TrackContainer>
  );
};

export default HTMLTrack;
