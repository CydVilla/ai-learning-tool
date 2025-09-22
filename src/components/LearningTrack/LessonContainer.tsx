import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Question, CodeExercise, LearningTrack, DifficultyLevel } from '../../types';
import { getQuestionsByTrackAndDifficulty, getCodeExercisesByTrackAndDifficulty } from '../../data/questions';
import { getTrackColors } from '../../utils/trackColors';
import MultipleChoiceQuestion from '../Questions/MultipleChoiceQuestion';
import CodeExerciseComponent from '../Questions/CodeExercise';
import QuestionNavigation from '../Questions/QuestionNavigation';
import ExerciseTimer from '../Questions/ExerciseTimer';
import { useUserProgress } from '../../context/UserProgressContext';
import { useXPSystem } from '../../hooks/useXPSystem';
import { useStreakManagement } from '../../hooks/useStreakManagement';
import { useDailyGoalManagement } from '../../hooks/useDailyGoalManagement';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const Container = styled.div<{ $color: string; $darkColor: string }>`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.$color} 0%, ${props => props.$darkColor} 100%);
  padding: 2rem;
  ${css`
    animation: ${fadeIn} 0.6s ease-out;
  `}
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const TrackIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Description = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const ProgressSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProgressTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.5rem;
`;

const ProgressStats = styled.div`
  display: flex;
  gap: 2rem;
  color: white;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4ecdc4;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`;

const LessonContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  ${css`
    animation: ${slideIn} 0.4s ease-out;
  `}
`;

const LessonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const LessonTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.8rem;
`;

const LessonMeta = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const MetaBadge = styled.div`
  background: ${props => props.color};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const CompletionMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: white;
`;

const CompletionIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const CompletionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #4ecdc4;
`;

const CompletionText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(78, 205, 196, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface LessonContainerProps {
  track: LearningTrack;
  difficulty?: DifficultyLevel;
}

const LessonContainer: React.FC<LessonContainerProps> = ({ track, difficulty = 'beginner' }) => {
  const { userProgress, updateProgress } = useUserProgress();
  const { getLevelInfo } = useXPSystem();
  const { updateStreakAfterActivity } = useStreakManagement();
  const { updateDailyProgress } = useDailyGoalManagement();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<(Question | CodeExercise)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const colors = getTrackColors(track);

  // Filter questions by track and difficulty
  useEffect(() => {
    const trackQuestions = getQuestionsByTrackAndDifficulty(track, difficulty);
    const trackExercises = getCodeExercisesByTrackAndDifficulty(track, difficulty);
    
    // Combine and shuffle questions and exercises
    const allItems = [...trackQuestions, ...trackExercises].sort(() => Math.random() - 0.5);
    setQuestions(allItems);
    setIsLoading(false);
    setStartTime(Date.now());
  }, [track, difficulty]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (isCorrect: boolean, xpEarned: number, timeTaken: number) => {
    try {
      console.log('handleAnswer called:', { isCorrect, xpEarned, timeTaken, currentQuestion: currentQuestion?.id });
      
      if (!currentQuestion) {
        console.error('No current question available');
        return;
      }

      // Start with just basic progress update
      console.log('Calling updateProgress...');
      try {
        updateProgress(track, currentQuestion.id, isCorrect, timeTaken);
        console.log('updateProgress completed successfully');
      } catch (error) {
        console.error('Error in updateProgress:', error);
        throw error;
      }
      
      // Try streak update (but don't let it break the flow)
      console.log('Calling updateStreakAfterActivity...');
      try {
        updateStreakAfterActivity(xpEarned, 1, [track]);
        console.log('updateStreakAfterActivity completed successfully');
      } catch (error) {
        console.error('Error in updateStreakAfterActivity (non-critical):', error);
        // Don't throw - this is non-critical
      }
      
      // Try daily progress update (but don't let it break the flow)
      console.log('Calling updateDailyProgress...');
      try {
        updateDailyProgress('questions', 1);
        updateDailyProgress('xp', xpEarned);
        console.log('updateDailyProgress completed successfully');
      } catch (error) {
        console.error('Error in updateDailyProgress (non-critical):', error);
        // Don't throw - this is non-critical
      }

      // Move to next question or complete
      console.log('Moving to next question or completing...');
      if (isLastQuestion) {
        setIsCompleted(true);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
      
      console.log('handleAnswer completed successfully');
    } catch (error) {
      console.error('Error in handleAnswer:', error);
      throw error; // Re-throw to trigger error boundary
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setIsCompleted(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleFinishTrack = () => {
    setIsCompleted(true);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setStartTime(Date.now());
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const getTrackIcon = (track: LearningTrack) => {
    switch (track) {
      case 'html': return 'H';
      case 'css': return 'C';
      case 'javascript': return 'J';
      default: return '?';
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner': return '#4ecdc4';
      case 'intermediate': return '#f39c12';
      case 'advanced': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (isLoading) {
    return (
      <Container $color={colors.primary} $darkColor={colors.secondary}>
        <Header>
          <TrackIcon>
            <div>⏳</div>
          </TrackIcon>
          <Title>Loading {track.toUpperCase()} Lessons...</Title>
          <Description>Preparing your learning experience</Description>
        </Header>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container $color={colors.primary} $darkColor={colors.secondary}>
        <Header>
          <TrackIcon>{getTrackIcon(track)}</TrackIcon>
          <Title>{track.toUpperCase()} Learning Track</Title>
          <Description>No lessons available for this difficulty level yet.</Description>
        </Header>
      </Container>
    );
  }

  if (isCompleted) {
    const totalTime = Math.round((Date.now() - startTime) / 1000 / 60); // minutes
    const levelInfo = getLevelInfo();
    
    return (
      <Container $color={colors.primary} $darkColor={colors.secondary}>
        <Header>
          <TrackIcon>{getTrackIcon(track)}</TrackIcon>
          <Title>{track.toUpperCase()} Track Complete!</Title>
          <Description>Congratulations on completing this lesson!</Description>
        </Header>
        
        <CompletionMessage>
          <CompletionIcon>🎉</CompletionIcon>
          <CompletionTitle>Well Done!</CompletionTitle>
          <CompletionText>
            You've completed {questions.length} questions in {totalTime} minutes.
            <br />
            You're now at level {levelInfo.currentLevel} with {levelInfo.currentXP} XP!
          </CompletionText>
          <div>
            <ActionButton onClick={handleRetry}>
              Try Again
            </ActionButton>
            <ActionButton onClick={handleGoHome}>
              Go Home
            </ActionButton>
          </div>
        </CompletionMessage>
      </Container>
    );
  }

  return (
    <Container $color={colors.primary} $darkColor={colors.secondary}>
      <Header>
        <TrackIcon>{getTrackIcon(track)}</TrackIcon>
        <Title>{track.toUpperCase()} Learning Track</Title>
        <Description>Master {track.toUpperCase()} with interactive lessons and AI-powered feedback</Description>
      </Header>

      <ProgressSection>
        <ProgressHeader>
          <ProgressTitle>Lesson Progress</ProgressTitle>
          <ProgressStats>
            <StatItem>
              <StatValue>{currentQuestionIndex + 1}</StatValue>
              <StatLabel>Current</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{questions.length}</StatValue>
              <StatLabel>Total</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{Math.round(progress)}%</StatValue>
              <StatLabel>Complete</StatLabel>
            </StatItem>
          </ProgressStats>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill $percentage={progress} />
        </ProgressBar>
      </ProgressSection>

      <LessonContent>
        <LessonHeader>
          <LessonTitle>
            {currentQuestion?.type === 'code-exercise' ? 'Code Exercise' : 'Question'} {currentQuestionIndex + 1}
          </LessonTitle>
          <LessonMeta>
            <MetaBadge color={getDifficultyColor(difficulty)}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </MetaBadge>
            <MetaBadge color={colors.accent}>
              {currentQuestion?.points || 0} XP
            </MetaBadge>
            <ExerciseTimer 
              timeLimit={currentQuestion?.timeLimit || 300}
              track={track}
              onTimeUp={() => {
                // Handle time up - could auto-submit or show warning
                console.log('Time is up!');
              }}
            />
          </LessonMeta>
        </LessonHeader>

        {currentQuestion && (
          <>
            {currentQuestion.type === 'code-exercise' ? (
              <CodeExerciseComponent
                exercise={currentQuestion as CodeExercise}
                track={track}
                onComplete={(code, passedTests, totalTests, timeTaken) => {
                  const xpEarned = Math.round((passedTests / totalTests) * (currentQuestion.points || 0));
                  handleAnswer(passedTests === totalTests, xpEarned, timeTaken);
                }}
                onNext={handleNextQuestion}
                onSkip={handleNextQuestion}
                timeLimit={currentQuestion.timeLimit || 300}
                showFeedback={true}
              />
            ) : (
              <MultipleChoiceQuestion
                question={currentQuestion as Question}
                track={track}
                onAnswer={(selectedAnswer: string, isCorrect: boolean, timeSpent: number) => {
                  const xpEarned = isCorrect ? (currentQuestion.points || 10) : 0;
                  handleAnswer(isCorrect, xpEarned, timeSpent);
                }}
                onNext={handleNextQuestion}
                onSkip={handleNextQuestion}
                timeLimit={currentQuestion.timeLimit || 60}
                showFeedback={true}
              />
            )}
          </>
        )}

        <QuestionNavigation
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
          track={track}
          onPrevious={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          onNext={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
          onSkip={handleNextQuestion}
          onGoToQuestion={(questionNumber: number) => setCurrentQuestionIndex(questionNumber)}
          canGoPrevious={currentQuestionIndex > 0}
          canGoNext={currentQuestionIndex < questions.length - 1}
          canSkip={true}
          completedQuestions={[]} // We'll need to track this
          currentQuestionId={currentQuestion?.id || ''}
        />
      </LessonContent>
    </Container>
  );
};

export default LessonContainer;
