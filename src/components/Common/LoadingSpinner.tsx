import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  ${css`
    animation: ${spin} 1s linear infinite;
  `}
`;

const LoadingText = styled.p`
  color: white;
  margin-top: 1rem;
  opacity: 0.8;
  text-align: center;
`;

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...', 
  size = 'medium' 
}) => {
  const spinnerSize = size === 'small' ? '20px' : size === 'large' ? '60px' : '40px';
  
  return (
    <SpinnerContainer>
      <div>
        <Spinner style={{ width: spinnerSize, height: spinnerSize }} />
        <LoadingText>{text}</LoadingText>
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
