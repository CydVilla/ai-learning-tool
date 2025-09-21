import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageLoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const LogoContainer = styled.div`
  animation: ${slideUp} 0.8s ease-out;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const AppName = styled.h1`
  color: white;
  font-size: 2rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const Dot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: ${fadeIn} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const LoadingText = styled.p`
  color: white;
  margin-top: 1rem;
  opacity: 0.8;
  font-size: 1.1rem;
`;

interface PageLoaderProps {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'Loading your learning experience...' 
}) => {
  return (
    <PageLoaderContainer>
      <LogoContainer>
        <LogoIcon>AI</LogoIcon>
        <AppName>Learning Tool</AppName>
      </LogoContainer>
      
      <LoadingDots>
        <Dot delay={0} />
        <Dot delay={0.2} />
        <Dot delay={0.4} />
      </LoadingDots>
      
      <LoadingText>{message}</LoadingText>
    </PageLoaderContainer>
  );
};

export default PageLoader;
