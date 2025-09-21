import React from 'react';
import styled from 'styled-components';

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

const ComingSoon = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HTMLTrack: React.FC = () => {
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
      
      <ComingSoon>
        <h2>Coming Soon!</h2>
        <p>Interactive HTML lessons with AI-powered feedback are being developed.</p>
      </ComingSoon>
    </TrackContainer>
  );
};

export default HTMLTrack;
