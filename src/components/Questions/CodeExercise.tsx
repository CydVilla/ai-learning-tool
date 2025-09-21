import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { CodeExercise as CodeExerciseType, LearningTrack } from '../../types';
import { getTrackColors } from '../../utils/trackColors';

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

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const ExerciseContainer = styled.div<{ trackColor: string }>`
  background: linear-gradient(135deg, ${props => props.trackColor}20, ${props => props.trackColor}40);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid ${props => props.trackColor}40;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
`;

const ExerciseIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  background: ${props => props.color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const ExerciseInfo = styled.div`
  flex: 1;
`;

const ExerciseTitle = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ExerciseMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaBadge = styled.div<{ color: string }>`
  background: ${props => props.color};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ExerciseContent = styled.div`
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
`;

const ExerciseDescription = styled.div`
  color: white;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid rgba(255, 255, 255, 0.3);
`;

const CodeEditorContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
`;

const CodeEditor = styled.textarea`
  width: 100%;
  min-height: 200px;
  background: transparent;
  color: #f8f8f2;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  border: none;
  outline: none;
  resize: vertical;
  padding: 0;
  margin: 0;
  
  &::placeholder {
    color: rgba(248, 248, 242, 0.5);
  }
`;

const CodeEditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const EditorTitle = styled.div`
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
`;

const EditorActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditorButton = styled.button<{ trackColor: string; variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' : props.trackColor};
  color: white;
  border: 1px solid ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : props.trackColor};
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : props.trackColor};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TestCasesContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const TestCasesTitle = styled.h4`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TestCase = styled.div<{ passed: boolean; failed: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid ${props => {
    if (props.passed) return '#4ecdc4';
    if (props.failed) return '#ff6b6b';
    return 'rgba(255, 255, 255, 0.3)';
  }};
  transition: all 0.3s ease;
  
  ${props => props.failed && `
    animation: ${shake} 0.5s ease-in-out;
  `}
`;

const TestCaseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const TestCaseStatus = styled.div<{ passed: boolean; failed: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  background: ${props => {
    if (props.passed) return '#4ecdc4';
    if (props.failed) return '#ff6b6b';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  color: white;
`;

const TestCaseTitle = styled.div`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const TestCaseContent = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0.5rem 0;
`;

const TestCaseResult = styled.div<{ passed: boolean; failed: boolean }>`
  color: ${props => {
    if (props.passed) return '#4ecdc4';
    if (props.failed) return '#ff6b6b';
    return 'rgba(255, 255, 255, 0.8)';
  }};
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const FeedbackSection = styled.div<{ show: boolean }>`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border-left: 4px solid #4ecdc4;
  animation: ${props => props.show ? `${slideIn} 0.3s ease-out` : 'none'};
  display: ${props => props.show ? 'block' : 'none'};
`;

const FeedbackTitle = styled.h4`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FeedbackText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const ExplanationText = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
  font-style: italic;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ trackColor: string; variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' : props.trackColor};
  color: white;
  border: 1px solid ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : props.trackColor};
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : props.trackColor};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Timer = styled.div<{ trackColor: string; timeLeft: number; totalTime: number }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.trackColor};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  ${props => props.timeLeft < props.totalTime * 0.2 && `
    animation: ${pulse} 1s infinite;
    background: #ff6b6b;
  `}
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

interface CodeExerciseProps {
  exercise: CodeExerciseType;
  track: LearningTrack;
  onComplete: (code: string, passedTests: number, totalTests: number, timeSpent: number) => void;
  onNext: () => void;
  onSkip: () => void;
  timeLimit?: number;
  showFeedback?: boolean;
}

const CodeExercise: React.FC<CodeExerciseProps> = ({
  exercise,
  track,
  onComplete,
  onNext,
  onSkip,
  timeLimit = 300, // 5 minutes for code exercises
  showFeedback = true
}) => {
  const [code, setCode] = useState(exercise.starterCode || '');
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; output: string; error?: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [startTime, setStartTime] = useState(Date.now());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const colors = getTrackColors(track);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      // Auto-submit when time runs out
      handleSubmit();
    }
  }, [timeLeft, isCompleted]);

  // Reset state when exercise changes
  useEffect(() => {
    setCode(exercise.starterCode || '');
    setTestResults([]);
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(timeLimit);
    setStartTime(Date.now());
  }, [exercise.id, timeLimit]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const runTests = async () => {
    setIsRunning(true);
    
    // Simulate test execution (in a real app, this would call a code execution service)
    const results = exercise.testCases.map((testCase, index) => {
      // Mock test execution - in reality, this would execute the code
      const passed = Math.random() > 0.3; // 70% pass rate for demo
      return {
        passed,
        output: passed ? `Test ${index + 1} passed` : `Test ${index + 1} failed: Expected ${testCase.expectedOutput}, got ${testCase.expectedOutput}`,
        error: passed ? undefined : 'AssertionError'
      };
    });
    
    setTestResults(results);
    setIsRunning(false);
  };

  const handleSubmit = () => {
    if (isCompleted) return;
    
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const passedTests = testResults.filter(result => result.passed).length;
    const totalTests = exercise.testCases.length;
    
    setIsCompleted(true);
    onComplete(code, passedTests, totalTests, timeSpent);
  };

  const handleNext = () => {
    onNext();
  };

  const handleSkip = () => {
    onSkip();
  };

  const handleReset = () => {
    setCode(exercise.starterCode || '');
    setTestResults([]);
    setIsCompleted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4ecdc4';
      case 'intermediate': return '#f39c12';
      case 'advanced': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(result => result.passed);

  return (
    <ExerciseContainer trackColor={colors.primary}>
      <BackgroundPattern />
      
      {timeLimit > 0 && (
        <Timer trackColor={colors.primary} timeLeft={timeLeft} totalTime={timeLimit}>
          ⏱️ {formatTime(timeLeft)}
        </Timer>
      )}

      <ExerciseHeader>
        <ExerciseIcon color={colors.primary}>
          💻
        </ExerciseIcon>
        <ExerciseInfo>
          <ExerciseTitle>Code Exercise</ExerciseTitle>
          <ExerciseMeta>
            <MetaBadge color={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </MetaBadge>
            <MetaBadge color={colors.secondary}>
              {exercise.xp} XP
            </MetaBadge>
            <MetaBadge color={colors.accent}>
              {exercise.testCases.length} Tests
            </MetaBadge>
          </ExerciseMeta>
        </ExerciseInfo>
      </ExerciseHeader>

      <ExerciseContent>
        <ExerciseDescription>
          {exercise.description}
        </ExerciseDescription>

        <CodeEditorContainer>
          <CodeEditorHeader>
            <EditorTitle>Code Editor</EditorTitle>
            <EditorActions>
              <EditorButton
                trackColor={colors.primary}
                variant="secondary"
                onClick={handleReset}
                disabled={isCompleted}
              >
                🔄 Reset
              </EditorButton>
              <EditorButton
                trackColor={colors.primary}
                onClick={runTests}
                disabled={isRunning || isCompleted}
              >
                {isRunning ? '⏳ Running...' : '▶️ Run Tests'}
              </EditorButton>
            </EditorActions>
          </CodeEditorHeader>
          <CodeEditor
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            placeholder="Write your code here..."
            disabled={isCompleted}
          />
        </CodeEditorContainer>

        <TestCasesContainer>
          <TestCasesTitle>
            🧪 Test Cases
          </TestCasesTitle>
          {exercise.testCases.map((testCase, index) => {
            const result = testResults[index];
            const passed = result?.passed || false;
            const failed = result && !result.passed;

            return (
              <TestCase key={index} passed={passed} failed={failed}>
                <TestCaseHeader>
                  <TestCaseStatus passed={passed} failed={failed}>
                    {passed ? '✓' : failed ? '✗' : '○'}
                  </TestCaseStatus>
                  <TestCaseTitle>Test Case {index + 1}</TestCaseTitle>
                </TestCaseHeader>
                <TestCaseContent>
                  <div><strong>Input:</strong> {testCase.input}</div>
                  <div><strong>Expected:</strong> {testCase.expectedOutput}</div>
                  {result && (
                    <div><strong>Output:</strong> {result.output}</div>
                  )}
                </TestCaseContent>
                {result && (
                  <TestCaseResult passed={passed} failed={failed}>
                    {passed ? '✅ Passed' : '❌ Failed'}
                  </TestCaseResult>
                )}
              </TestCase>
            );
          })}
        </TestCasesContainer>

        {showFeedback && isCompleted && (
          <FeedbackSection show={isCompleted}>
            <FeedbackTitle>
              {allTestsPassed ? '🎉 All Tests Passed!' : '⚠️ Some Tests Failed'}
            </FeedbackTitle>
            <FeedbackText>
              {allTestsPassed 
                ? `Great job! You passed all ${exercise.testCases.length} test cases.`
                : `You passed ${testResults.filter(r => r.passed).length} out of ${exercise.testCases.length} test cases.`
              }
            </FeedbackText>
            {exercise.explanation && (
              <ExplanationText>
                <strong>Explanation:</strong> {exercise.explanation}
              </ExplanationText>
            )}
          </FeedbackSection>
        )}

        <ActionButtons>
          {!isCompleted ? (
            <>
              <ActionButton
                trackColor={colors.primary}
                variant="secondary"
                onClick={handleSkip}
              >
                ⏭️ Skip
              </ActionButton>
              <ActionButton
                trackColor={colors.primary}
                onClick={handleSubmit}
                disabled={testResults.length === 0}
              >
                ✅ Submit Solution
              </ActionButton>
            </>
          ) : (
            <ActionButton
              trackColor={colors.primary}
              onClick={handleNext}
            >
              ➡️ Next Exercise
            </ActionButton>
          )}
        </ActionButtons>
      </ExerciseContent>
    </ExerciseContainer>
  );
};

export default CodeExercise;
