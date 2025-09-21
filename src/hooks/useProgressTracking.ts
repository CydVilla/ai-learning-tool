import { useCallback } from 'react';
import { useUserProgress } from '../context/UserProgressContext';
import { ProgressService } from '../services/progressService';
import { LearningTrack, QuestionAttempt, DifficultyLevel } from '../types';

export const useProgressTracking = () => {
  const { userProgress, updateProgress, completeQuestion } = useUserProgress();

  /**
   * Track a question attempt and update progress
   */
  const trackQuestionAttempt = useCallback((
    track: LearningTrack,
    questionId: string,
    attempt: QuestionAttempt,
    difficulty: DifficultyLevel = 'beginner'
  ) => {
    if (!userProgress) return;

    // Update progress using the service
    const updatedProgress = ProgressService.updateUserProgress(
      userProgress,
      track,
      questionId,
      attempt,
      difficulty
    );

    // Check for new achievements
    const newAchievements = ProgressService.checkAchievements(updatedProgress);

    // Update context with new progress
    updateProgress(track, questionId, attempt.isCorrect, attempt.timeSpent / 60);

    // Return achievement notifications if any
    return newAchievements;
  }, [userProgress, updateProgress]);

  /**
   * Get progress summary for a specific track
   */
  const getTrackProgress = useCallback((track: LearningTrack) => {
    if (!userProgress) return null;
    
    const trackProgress = userProgress.tracks[track];
    return ProgressService.getTrackProgressSummary(trackProgress);
  }, [userProgress]);

  /**
   * Get daily progress summary
   */
  const getDailyProgress = useCallback(() => {
    if (!userProgress) return null;
    
    return ProgressService.getDailyProgressSummary(userProgress);
  }, [userProgress]);

  /**
   * Calculate XP for a potential answer
   */
  const calculatePotentialXP = useCallback((
    isCorrect: boolean,
    timeSpent: number,
    difficulty: DifficultyLevel,
    currentStreak: number,
    accuracy: number
  ) => {
    return ProgressService.calculateXP(isCorrect, timeSpent, difficulty, currentStreak, accuracy);
  }, []);

  /**
   * Get level information
   */
  const getLevelInfo = useCallback((track: LearningTrack) => {
    if (!userProgress) return null;
    
    const trackProgress = userProgress.tracks[track];
    const level = trackProgress.currentLevel;
    const xpToNext = ProgressService.getXPToNextLevel(level, trackProgress.totalXP);
    
    return {
      currentLevel: level,
      xpToNext,
      totalXP: trackProgress.totalXP,
      progressPercentage: trackProgress.totalXP > 0 ? 
        ((trackProgress.totalXP - ProgressService['LEVEL_THRESHOLDS'][level - 1]) / 
         (ProgressService['LEVEL_THRESHOLDS'][level] - ProgressService['LEVEL_THRESHOLDS'][level - 1])) * 100 : 0
    };
  }, [userProgress]);

  /**
   * Get streak information
   */
  const getStreakInfo = useCallback(() => {
    if (!userProgress) return null;
    
    return {
      currentStreak: userProgress.currentStreak,
      longestStreak: userProgress.longestStreak,
      lastActivity: userProgress.lastActivityDate
    };
  }, [userProgress]);

  /**
   * Get statistics summary
   */
  const getStatistics = useCallback(() => {
    if (!userProgress) return null;
    
    return {
      totalXP: userProgress.totalXP,
      totalQuestions: userProgress.statistics.totalQuestionsAnswered,
      accuracy: userProgress.statistics.averageAccuracy,
      timeSpent: userProgress.statistics.totalTimeSpent,
      favoriteTrack: userProgress.statistics.favoriteTrack,
      questionsPerDay: userProgress.statistics.questionsPerDay,
      averageSessionLength: userProgress.statistics.averageSessionLength
    };
  }, [userProgress]);

  /**
   * Check if user has completed a specific question
   */
  const hasCompletedQuestion = useCallback((track: LearningTrack, questionId: string) => {
    if (!userProgress) return false;
    
    return userProgress.tracks[track].completedQuestions.includes(questionId);
  }, [userProgress]);

  /**
   * Get completion percentage for a track
   */
  const getTrackCompletionPercentage = useCallback((track: LearningTrack, totalQuestions: number) => {
    if (!userProgress || totalQuestions === 0) return 0;
    
    const completed = userProgress.tracks[track].completedQuestions.length;
    return Math.round((completed / totalQuestions) * 100);
  }, [userProgress]);

  /**
   * Get next milestone information
   */
  const getNextMilestone = useCallback((track: LearningTrack) => {
    if (!userProgress) return null;
    
    const trackProgress = userProgress.tracks[track];
    const milestones = [10, 25, 50, 100, 200, 500];
    
    for (const milestone of milestones) {
      if (trackProgress.completedQuestions.length < milestone) {
        return {
          target: milestone,
          current: trackProgress.completedQuestions.length,
          remaining: milestone - trackProgress.completedQuestions.length,
          percentage: Math.round((trackProgress.completedQuestions.length / milestone) * 100)
        };
      }
    }
    
    return null; // All milestones reached
  }, [userProgress]);

  return {
    trackQuestionAttempt,
    getTrackProgress,
    getDailyProgress,
    calculatePotentialXP,
    getLevelInfo,
    getStreakInfo,
    getStatistics,
    hasCompletedQuestion,
    getTrackCompletionPercentage,
    getNextMilestone,
    isLoading: !userProgress
  };
};

export default useProgressTracking;
