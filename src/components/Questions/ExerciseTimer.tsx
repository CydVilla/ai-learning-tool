import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { LearningTrack } from '../../types';
import { getTrackColors } from '../../utils/trackColors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
`;

const TimerContainer = styled.div<{ trackColor: string; timeLeft: number; totalTime: number }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: ${props => {
    if (props.timeLeft < props.totalTime * 0.2) return '#ff6b6b';
    if (props.timeLeft < props.totalTime * 0.5) return '#f39c12';
    return props.trackColor;
  }};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  
  ${props => props.timeLeft < props.totalTime * 0.2 && `
    animation: ${pulse} 1s infinite, ${shake} 0.5s ease-in-out;
  `}
  
  ${props => props.timeLeft < props.totalTime * 0.1 && `
    animation: ${glow} 0.5s infinite;
  `}
`;

const TimerIcon = styled.div<{ timeLeft: number; totalTime: number }>`
  font-size: 1.5rem;
  animation: ${props => props.timeLeft < props.totalTime * 0.2 ? `${pulse} 1s infinite` : 'none'};
`;

const TimerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimerDisplay = styled.div<{ timeLeft: number; totalTime: number }>`
  font-size: 1.5rem;
  font-weight: bold;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: ${props => props.timeLeft < props.totalTime * 0.2 ? `${pulse} 1s infinite` : 'none'};
`;

const TimerLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  text-align: center;
`;

const TimerProgress = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const TimerProgressFill = styled.div<{ percentage: number; timeLeft: number; totalTime: number }>`
  height: 100%;
  width: ${props => Math.min(props.percentage, 100)}%;
  background: ${props => {
    if (props.timeLeft < props.totalTime * 0.2) return '#ffffff';
    if (props.timeLeft < props.totalTime * 0.5) return '#fff3cd';
    return 'rgba(255, 255, 255, 0.8)';
  }};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const TimerControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 0.5rem;
`;

const TimerButton = styled.button<{ trackColor: string; variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 30px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TimerNotification = styled.div<{ show: boolean; type: 'warning' | 'danger' }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.type === 'danger' ? '#ff6b6b' : '#f39c12'};
  color: white;
  padding: 2rem;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  z-index: 2000;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${props => props.show ? `${fadeIn} 0.3s ease-out` : 'none'};
  display: ${props => props.show ? 'block' : 'none'};
`;

const TimerStats = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  z-index: 1000;
  animation: ${fadeIn} 0.6s ease-out;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StatLabel = styled.span`
  color: rgba(255, 255, 255, 0.8);
`;

const StatValue = styled.span`
  color: white;
  font-weight: 600;
`;

interface ExerciseTimerProps {
  timeLimit: number;
  track: LearningTrack;
  onTimeUp: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  showControls?: boolean;
  showStats?: boolean;
  isPaused?: boolean;
  startTime?: number;
}

const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  timeLimit,
  track,
  onTimeUp,
  onPause,
  onResume,
  onReset,
  showControls = true,
  showStats = true,
  isPaused = false,
  startTime
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isRunning, setIsRunning] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [showDanger, setShowDanger] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(startTime || Date.now());

  const colors = getTrackColors(track);

  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft, onTimeUp]);

  // Warning notifications
  useEffect(() => {
    if (timeLeft <= timeLimit * 0.2 && timeLeft > 0) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
    
    if (timeLeft <= timeLimit * 0.1 && timeLeft > 0) {
      setShowDanger(true);
      setTimeout(() => setShowDanger(false), 2000);
    }
  }, [timeLeft, timeLimit]);

  // Calculate total time spent
  useEffect(() => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTotalTimeSpent(elapsed - pausedTime);
    }
  }, [startTime, pausedTime]);

  const handlePause = () => {
    setIsRunning(false);
    if (onPause) onPause();
  };

  const handleResume = () => {
    setIsRunning(true);
    if (onResume) onResume();
  };

  const handleReset = () => {
    setTimeLeft(timeLimit);
    setIsRunning(true);
    setPausedTime(0);
    setTotalTimeSpent(0);
    startTimeRef.current = Date.now();
    if (onReset) onReset();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerIcon = () => {
    if (timeLeft <= timeLimit * 0.1) return '🚨';
    if (timeLeft <= timeLimit * 0.2) return '⚠️';
    if (timeLeft <= timeLimit * 0.5) return '⏰';
    return '⏱️';
  };

  const getTimerLabel = () => {
    if (timeLeft <= timeLimit * 0.1) return 'Almost Up!';
    if (timeLeft <= timeLimit * 0.2) return 'Hurry Up!';
    if (timeLeft <= timeLimit * 0.5) return 'Time Left';
    return 'Time Remaining';
  };

  const progressPercentage = ((timeLimit - timeLeft) / timeLimit) * 100;

  return (
    <>
      <TimerContainer 
        trackColor={colors.primary} 
        timeLeft={timeLeft} 
        totalTime={timeLimit}
      >
        <TimerIcon timeLeft={timeLeft} totalTime={timeLimit}>
          {getTimerIcon()}
        </TimerIcon>
        
        <TimerContent>
          <TimerDisplay timeLeft={timeLeft} totalTime={timeLimit}>
            {formatTime(timeLeft)}
          </TimerDisplay>
          <TimerLabel>{getTimerLabel()}</TimerLabel>
          <TimerProgress>
            <TimerProgressFill 
              percentage={progressPercentage} 
              timeLeft={timeLeft} 
              totalTime={timeLimit} 
            />
          </TimerProgress>
        </TimerContent>

        {showControls && (
          <TimerControls>
            {isRunning && !isPaused ? (
              <TimerButton trackColor={colors.primary} onClick={handlePause}>
                ⏸️
              </TimerButton>
            ) : (
              <TimerButton trackColor={colors.primary} onClick={handleResume}>
                ▶️
              </TimerButton>
            )}
            <TimerButton trackColor={colors.primary} onClick={handleReset}>
              🔄
            </TimerButton>
          </TimerControls>
        )}
      </TimerContainer>

      {showWarning && (
        <TimerNotification show={showWarning} type="warning">
          ⚠️ Warning: Time is running out!
        </TimerNotification>
      )}

      {showDanger && (
        <TimerNotification show={showDanger} type="danger">
          🚨 Danger: Almost out of time!
        </TimerNotification>
      )}

      {showStats && (
        <TimerStats>
          <StatItem>
            <StatLabel>Time Limit:</StatLabel>
            <StatValue>{formatTime(timeLimit)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Time Left:</StatLabel>
            <StatValue>{formatTime(timeLeft)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Time Spent:</StatLabel>
            <StatValue>{formatTime(totalTimeSpent)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Progress:</StatLabel>
            <StatValue>{Math.round(progressPercentage)}%</StatValue>
          </StatItem>
        </TimerStats>
      )}
    </>
  );
};

export default ExerciseTimer;
