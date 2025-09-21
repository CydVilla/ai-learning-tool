import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

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

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

const confetti = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

const CelebrationOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${props => props.show ? `${fadeIn} 0.3s ease-out` : 'none'};
`;

const CelebrationModal = styled.div<{ type: 'levelup' | 'achievement' | 'streak' | 'goal' }>`
  background: ${props => {
    switch (props.type) {
      case 'levelup': return 'linear-gradient(135deg, #ffd700, #ffed4e)';
      case 'achievement': return 'linear-gradient(135deg, #8e44ad, #9b59b6)';
      case 'streak': return 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
      case 'goal': return 'linear-gradient(135deg, #4ecdc4, #6dd5d0)';
      default: return 'linear-gradient(135deg, #667eea, #764ba2)';
    }
  }};
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${bounce} 0.6s ease-in-out;
  position: relative;
  overflow: hidden;
  max-width: 500px;
  width: 90%;
`;

const CelebrationIcon = styled.div<{ type: 'levelup' | 'achievement' | 'streak' | 'goal' }>`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: ${props => {
    switch (props.type) {
      case 'levelup': return `${rotate} 2s linear infinite`;
      case 'achievement': return `${pulse} 1s infinite`;
      case 'streak': return `${bounce} 0.6s ease-in-out`;
      case 'goal': return `${float} 2s ease-in-out infinite`;
      default: return 'none';
    }
  }};
`;

const CelebrationTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: ${pulse} 2s infinite;
`;

const CelebrationMessage = styled.p`
  font-size: 1.2rem;
  margin: 0 0 2rem 0;
  line-height: 1.5;
  opacity: 0.9;
`;

const CelebrationButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ConfettiContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;

const ConfettiPiece = styled.div<{ 
  left: number; 
  delay: number; 
  color: string;
  size: number;
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  left: ${props => props.left}%;
  top: -10px;
  animation: ${confetti} 3s ease-out ${props => props.delay}s infinite;
  border-radius: 2px;
`;

const SparkleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const Sparkle = styled.div<{ 
  left: number; 
  top: number; 
  delay: number;
  size: number;
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: #ffd700;
  border-radius: 50%;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  animation: ${sparkle} 2s ease-in-out ${props => props.delay}s infinite;
  box-shadow: 0 0 10px #ffd700;
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

interface CelebrationAnimationsProps {
  show: boolean;
  type: 'levelup' | 'achievement' | 'streak' | 'goal';
  title: string;
  message: string;
  onClose: () => void;
  showConfetti?: boolean;
  showSparkles?: boolean;
}

const CelebrationAnimations: React.FC<CelebrationAnimationsProps> = ({
  show,
  type,
  title,
  message,
  onClose,
  showConfetti = true,
  showSparkles = true
}) => {
  const [confettiPieces, setConfettiPieces] = useState<Array<{
    left: number;
    delay: number;
    color: string;
    size: number;
  }>>([]);

  const [sparkles, setSparkles] = useState<Array<{
    left: number;
    top: number;
    delay: number;
    size: number;
  }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12', '#9b59b6', '#ffd700'][Math.floor(Math.random() * 6)],
        size: Math.random() * 8 + 4
      }));
      setConfettiPieces(pieces);

      // Generate sparkles
      const sparkleArray = Array.from({ length: 20 }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
        size: Math.random() * 6 + 3
      }));
      setSparkles(sparkleArray);
    }
  }, [show]);

  const getIcon = (type: string): string => {
    switch (type) {
      case 'levelup': return '🎉';
      case 'achievement': return '🏆';
      case 'streak': return '🔥';
      case 'goal': return '🎯';
      default: return '✨';
    }
  };

  const getTitle = (type: string): string => {
    switch (type) {
      case 'levelup': return 'Level Up!';
      case 'achievement': return 'Achievement Unlocked!';
      case 'streak': return 'Streak Milestone!';
      case 'goal': return 'Goal Completed!';
      default: return 'Congratulations!';
    }
  };

  if (!show) return null;

  return (
    <CelebrationOverlay show={show}>
      <CelebrationModal type={type}>
        <BackgroundPattern />
        
        {showConfetti && (
          <ConfettiContainer>
            {confettiPieces.map((piece, index) => (
              <ConfettiPiece
                key={index}
                left={piece.left}
                delay={piece.delay}
                color={piece.color}
                size={piece.size}
              />
            ))}
          </ConfettiContainer>
        )}
        
        {showSparkles && (
          <SparkleContainer>
            {sparkles.map((sparkle, index) => (
              <Sparkle
                key={index}
                left={sparkle.left}
                top={sparkle.top}
                delay={sparkle.delay}
                size={sparkle.size}
              />
            ))}
          </SparkleContainer>
        )}
        
        <CelebrationIcon type={type}>
          {getIcon(type)}
        </CelebrationIcon>
        
        <CelebrationTitle>
          {title || getTitle(type)}
        </CelebrationTitle>
        
        <CelebrationMessage>
          {message}
        </CelebrationMessage>
        
        <CelebrationButton onClick={onClose}>
          Continue Learning! 🚀
        </CelebrationButton>
      </CelebrationModal>
    </CelebrationOverlay>
  );
};

export default CelebrationAnimations;
