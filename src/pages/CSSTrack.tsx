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
  background: #4ecdc4;
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

const CSSTrack: React.FC = () => {
  return (
    <TrackContainer>
      <TrackHeader>
        <TrackIcon>C</TrackIcon>
        <TrackTitle>CSS Learning Track</TrackTitle>
        <TrackDescription>
          Style your websites beautifully with CSS. 
          Learn layouts, animations, responsive design, and modern CSS features.
        </TrackDescription>
      </TrackHeader>
      
      <ComingSoon>
        <h2>Coming Soon!</h2>
        <p>Interactive CSS lessons with AI-powered feedback are being developed.</p>
      </ComingSoon>
    </TrackContainer>
  );
};

export default CSSTrack;
