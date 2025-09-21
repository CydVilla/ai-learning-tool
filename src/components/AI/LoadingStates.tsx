import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 1rem 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

const LoadingIcon = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  width: ${props => {
    switch (props.size) {
      case 'small': return '30px';
      case 'large': return '80px';
      default: return '50px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '30px';
      case 'large': return '80px';
      default: return '50px';
    }
  }};
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #4ecdc4;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const LoadingSubtext = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.4;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #4ecdc4, #45b7d1);
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const SkeletonContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin: 1rem 0;
`;

const SkeletonLine = styled.div<{ width: string; height?: string }>`
  width: ${props => props.width};
  height: ${props => props.height || '16px'};
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 1rem;
`;

const TypingDot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  background: #4ecdc4;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite;
  animation-delay: ${props => props.delay}s;
`;

const AIThinkingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 16px;
  margin: 1rem 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

const AIAvatar = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4ecdc4, #45b7d1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  animation: ${pulse} 2s infinite;
`;

const AIThinkingText = styled.div`
  color: white;
  font-size: 1rem;
  font-weight: 500;
`;

const AIThinkingSubtext = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 16px;
  margin: 1rem 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ErrorIcon = styled.div`
  width: 50px;
  height: 50px;
  background: #ff6b6b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
`;

const ErrorText = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const ErrorSubtext = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.4;
`;

const RetryButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: #ff5252;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface LoadingStatesProps {
  type: 'spinner' | 'skeleton' | 'typing' | 'ai-thinking' | 'error';
  message?: string;
  submessage?: string;
  progress?: number;
  onRetry?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const LoadingStates: React.FC<LoadingStatesProps> = ({
  type,
  message,
  submessage,
  progress,
  onRetry,
  size = 'medium'
}) => {
  const renderLoadingState = () => {
    switch (type) {
      case 'spinner':
        return (
          <LoadingContainer>
            <LoadingIcon size={size} />
            {message && <LoadingText>{message}</LoadingText>}
            {submessage && <LoadingSubtext>{submessage}</LoadingSubtext>}
            {progress !== undefined && (
              <ProgressBar>
                <ProgressFill progress={progress} />
              </ProgressBar>
            )}
          </LoadingContainer>
        );

      case 'skeleton':
        return (
          <SkeletonContainer>
            <SkeletonLine width="100%" height="20px" />
            <SkeletonLine width="80%" height="16px" />
            <SkeletonLine width="60%" height="16px" />
            <SkeletonLine width="90%" height="16px" />
          </SkeletonContainer>
        );

      case 'typing':
        return (
          <LoadingContainer>
            <TypingIndicator>
              <span>{message || 'AI is typing'}</span>
              <TypingDot delay={0} />
              <TypingDot delay={0.2} />
              <TypingDot delay={0.4} />
            </TypingIndicator>
            {submessage && <LoadingSubtext>{submessage}</LoadingSubtext>}
          </LoadingContainer>
        );

      case 'ai-thinking':
        return (
          <AIThinkingContainer>
            <AIAvatar>🤖</AIAvatar>
            <div>
              <AIThinkingText>{message || 'AI is thinking...'}</AIThinkingText>
              {submessage && <AIThinkingSubtext>{submessage}</AIThinkingSubtext>}
            </div>
          </AIThinkingContainer>
        );

      case 'error':
        return (
          <ErrorContainer>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorText>{message || 'Something went wrong'}</ErrorText>
            {submessage && <ErrorSubtext>{submessage}</ErrorSubtext>}
            {onRetry && (
              <RetryButton onClick={onRetry}>
                Try Again
              </RetryButton>
            )}
          </ErrorContainer>
        );

      default:
        return (
          <LoadingContainer>
            <LoadingIcon size={size} />
            <LoadingText>Loading...</LoadingText>
          </LoadingContainer>
        );
    }
  };

  return renderLoadingState();
};

export default LoadingStates;
