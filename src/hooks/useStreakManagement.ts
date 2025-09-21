import { useCallback, useEffect, useState } from 'react';
import { useUserProgress } from '../context/UserProgressContext';
import { StreakService, StreakData, StreakMilestone } from '../services/streakService';
import { LearningTrack } from '../types';

export const useStreakManagement = () => {
  const { userProgress, updateStreak } = useUserProgress();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isAtRisk, setIsAtRisk] = useState(false);
  const [daysUntilLost, setDaysUntilLost] = useState(0);

  // Initialize streak data
  useEffect(() => {
    if (userProgress) {
      // For now, create basic streak data from user progress
      // In a real app, this would come from a more sophisticated storage system
      const basicStreakData: StreakData = {
        currentStreak: userProgress.currentStreak,
        longestStreak: userProgress.longestStreak,
        lastActivityDate: userProgress.lastActivityDate,
        streakHistory: [] // This would be populated from actual activity history
      };
      
      setStreakData(basicStreakData);
      setIsAtRisk(StreakService.isStreakAtRisk(userProgress.lastActivityDate));
      setDaysUntilLost(StreakService.getDaysUntilStreakLost(userProgress.lastActivityDate));
    }
  }, [userProgress]);

  /**
   * Update streak after completing activities
   */
  const updateStreakAfterActivity = useCallback((
    xpEarned: number,
    questionsAnswered: number,
    tracks: LearningTrack[]
  ) => {
    if (!streakData) return;

    const updatedStreakData = StreakService.updateStreakData(
      streakData,
      xpEarned,
      questionsAnswered,
      tracks
    );

    setStreakData(updatedStreakData);
    setIsAtRisk(StreakService.isStreakAtRisk(updatedStreakData.lastActivityDate));
    setDaysUntilLost(StreakService.getDaysUntilStreakLost(updatedStreakData.lastActivityDate));

    // Update the context
    updateStreak();
  }, [streakData, updateStreak]);

  /**
   * Get streak milestones
   */
  const getStreakMilestones = useCallback((): StreakMilestone[] => {
    if (!streakData) return [];
    return StreakService.getStreakMilestones(streakData.currentStreak);
  }, [streakData]);

  /**
   * Get next streak milestone
   */
  const getNextStreakMilestone = useCallback((): StreakMilestone | null => {
    if (!streakData) return null;
    return StreakService.getNextStreakMilestone(streakData.currentStreak);
  }, [streakData]);

  /**
   * Get streak progress percentage
   */
  const getStreakProgress = useCallback((): number => {
    if (!streakData) return 0;
    return StreakService.getStreakProgress(streakData.currentStreak);
  }, [streakData]);

  /**
   * Get streak bonus multiplier
   */
  const getStreakBonusMultiplier = useCallback((): number => {
    if (!streakData) return 1.0;
    return StreakService.getStreakBonusMultiplier(streakData.currentStreak);
  }, [streakData]);

  /**
   * Get streak statistics
   */
  const getStreakStatistics = useCallback(() => {
    if (!streakData) return null;
    return StreakService.getStreakStatistics(streakData);
  }, [streakData]);

  /**
   * Get streak motivation message
   */
  const getStreakMotivation = useCallback((): string => {
    if (!streakData) return "Start your learning journey today! 🌟";
    return StreakService.getStreakMotivation(streakData.currentStreak);
  }, [streakData]);

  /**
   * Check if streak is at risk
   */
  const checkStreakRisk = useCallback((): boolean => {
    if (!streakData) return false;
    return StreakService.isStreakAtRisk(streakData.lastActivityDate);
  }, [streakData]);

  /**
   * Get days until streak is lost
   */
  const getDaysUntilStreakLost = useCallback((): number => {
    if (!streakData) return 0;
    return StreakService.getDaysUntilStreakLost(streakData.lastActivityDate);
  }, [streakData]);

  /**
   * Get streak status summary
   */
  const getStreakStatus = useCallback(() => {
    if (!streakData) return null;

    return {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      lastActivityDate: streakData.lastActivityDate,
      isAtRisk,
      daysUntilLost,
      bonusMultiplier: getStreakBonusMultiplier(),
      progress: getStreakProgress(),
      nextMilestone: getNextStreakMilestone(),
      motivation: getStreakMotivation()
    };
  }, [streakData, isAtRisk, daysUntilLost, getStreakBonusMultiplier, getStreakProgress, getNextStreakMilestone, getStreakMotivation]);

  /**
   * Calculate streak bonus XP
   */
  const calculateStreakBonusXP = useCallback((baseXP: number): number => {
    const multiplier = getStreakBonusMultiplier();
    return Math.round(baseXP * multiplier) - baseXP;
  }, [getStreakBonusMultiplier]);

  /**
   * Get streak achievements
   */
  const getStreakAchievements = useCallback(() => {
    if (!streakData) return [];
    
    const milestones = getStreakMilestones();
    return milestones.filter(milestone => milestone.unlocked);
  }, [streakData, getStreakMilestones]);

  /**
   * Get streak recommendations
   */
  const getStreakRecommendations = useCallback(() => {
    if (!streakData) return [];

    const recommendations = [];

    if (isAtRisk) {
      recommendations.push({
        type: 'warning',
        message: 'Your streak is at risk! Complete a lesson today to maintain it.',
        action: 'Start Learning'
      });
    }

    if (streakData.currentStreak === 0) {
      recommendations.push({
        type: 'motivation',
        message: 'Start your learning journey today to begin building a streak!',
        action: 'Begin Learning'
      });
    }

    const nextMilestone = getNextStreakMilestone();
    if (nextMilestone && nextMilestone.days - streakData.currentStreak <= 3) {
      recommendations.push({
        type: 'milestone',
        message: `You're ${nextMilestone.days - streakData.currentStreak} days away from "${nextMilestone.name}"!`,
        action: 'Keep Going'
      });
    }

    return recommendations;
  }, [streakData, isAtRisk, getNextStreakMilestone]);

  return {
    streakData,
    isAtRisk,
    daysUntilLost,
    updateStreakAfterActivity,
    getStreakMilestones,
    getNextStreakMilestone,
    getStreakProgress,
    getStreakBonusMultiplier,
    getStreakStatistics,
    getStreakMotivation,
    checkStreakRisk,
    getDaysUntilStreakLost,
    getStreakStatus,
    calculateStreakBonusXP,
    getStreakAchievements,
    getStreakRecommendations
  };
};

export default useStreakManagement;
