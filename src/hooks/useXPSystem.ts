import { useCallback, useState, useEffect } from 'react';
import { useUserProgress } from '../context/UserProgressContext';
import { XPService, XPReward, LevelInfo, XPMilestone } from '../services/xpService';
import { DifficultyLevel, LearningTrack } from '../types';

export const useXPSystem = () => {
  const { userProgress, getTotalXP } = useUserProgress();
  const [recentXPGain, setRecentXPGain] = useState<XPReward | null>(null);
  const [levelUpNotification, setLevelUpNotification] = useState(false);

  /**
   * Calculate XP reward for a question attempt
   */
  const calculateXPReward = useCallback((
    isCorrect: boolean,
    timeSpent: number,
    difficulty: DifficultyLevel,
    currentStreak: number,
    accuracy: number,
    isFirstAttempt: boolean = true,
    track: LearningTrack
  ): XPReward => {
    return XPService.calculateXPReward(
      isCorrect,
      timeSpent,
      difficulty,
      currentStreak,
      accuracy,
      isFirstAttempt,
      track
    );
  }, []);

  /**
   * Get current level information
   */
  const getLevelInfo = useCallback((): LevelInfo => {
    const totalXP = getTotalXP();
    return XPService.calculateLevelInfo(totalXP);
  }, [getTotalXP]);

  /**
   * Get XP milestones
   */
  const getXPMilestones = useCallback((): XPMilestone[] => {
    const totalXP = getTotalXP();
    return XPService.getXPMilestones(totalXP);
  }, [getTotalXP]);

  /**
   * Get next XP milestone
   */
  const getNextXPMilestone = useCallback((): XPMilestone | null => {
    const totalXP = getTotalXP();
    return XPService.getNextXPMilestone(totalXP);
  }, [getTotalXP]);

  /**
   * Get XP statistics
   */
  const getXPStatistics = useCallback(() => {
    if (!userProgress) return null;
    
    const totalXP = getTotalXP();
    const trackXP = {
      html: userProgress.tracks.html.totalXP,
      css: userProgress.tracks.css.totalXP,
      javascript: userProgress.tracks.javascript.totalXP
    };
    
    return XPService.getXPStatistics(totalXP, trackXP);
  }, [userProgress, getTotalXP]);

  /**
   * Get daily XP progress
   */
  const getDailyXPProgress = useCallback(() => {
    if (!userProgress) return null;
    
    const totalXP = getTotalXP();
    return XPService.calculateDailyXPProgress(
      totalXP,
      userProgress.dailyGoal,
      userProgress.lastActivityDate
    );
  }, [userProgress, getTotalXP]);

  /**
   * Get XP breakdown for a reward
   */
  const getXPBreadown = useCallback((xpReward: XPReward): string[] => {
    return XPService.getXPBreadown(xpReward);
  }, []);

  /**
   * Simulate XP gain (for testing/demonstration)
   */
  const simulateXPGain = useCallback((
    isCorrect: boolean,
    timeSpent: number,
    difficulty: DifficultyLevel,
    track: LearningTrack
  ) => {
    if (!userProgress) return;

    const currentStreak = userProgress.currentStreak;
    const accuracy = userProgress.statistics.averageAccuracy;
    
    const xpReward = calculateXPReward(
      isCorrect,
      timeSpent,
      difficulty,
      currentStreak,
      accuracy,
      true,
      track
    );

    setRecentXPGain(xpReward);
    
    // Check for level up
    const currentLevel = getLevelInfo().currentLevel;
    setTimeout(() => {
      const newLevel = getLevelInfo().currentLevel;
      if (newLevel > currentLevel) {
        setLevelUpNotification(true);
        setTimeout(() => setLevelUpNotification(false), 3000);
      }
    }, 100);
  }, [userProgress, calculateXPReward, getLevelInfo]);

  /**
   * Get XP recommendations
   */
  const getXPRecommendations = useCallback(() => {
    if (!userProgress) return [];

    const recommendations = [];
    const levelInfo = getLevelInfo();
    const dailyProgress = getDailyXPProgress();

    // Daily goal recommendations
    if (dailyProgress && !dailyProgress.isGoalMet) {
      recommendations.push({
        type: 'daily_goal',
        message: `You need ${dailyProgress.remaining} more XP to reach your daily goal!`,
        action: 'Complete more questions',
        priority: 'high'
      });
    }

    // Level up recommendations
    if (levelInfo.xpToNext <= 50) {
      recommendations.push({
        type: 'level_up',
        message: `You're only ${levelInfo.xpToNext} XP away from level ${levelInfo.currentLevel + 1}!`,
        action: 'Keep going!',
        priority: 'medium'
      });
    }

    // Difficulty recommendations
    const trackStats = getXPStatistics()?.trackDistribution;
    if (trackStats) {
      const weakestTrack = trackStats.reduce((min, track) => 
        track.xp < min.xp ? track : min
      );
      
      if (weakestTrack.xp < 100) {
        recommendations.push({
          type: 'track_improvement',
          message: `Focus on ${weakestTrack.track.toUpperCase()} to balance your skills!`,
          action: `Practice ${weakestTrack.track}`,
          priority: 'low'
        });
      }
    }

    return recommendations;
  }, [userProgress, getLevelInfo, getDailyXPProgress, getXPStatistics]);

  /**
   * Get XP achievements
   */
  const getXPAchievements = useCallback(() => {
    const milestones = getXPMilestones();
    return milestones.filter(milestone => milestone.unlocked);
  }, [getXPMilestones]);

  /**
   * Get XP rank
   */
  const getXPRank = useCallback(() => {
    const totalXP = getTotalXP();
    if (totalXP < 100) return 'Beginner';
    if (totalXP < 500) return 'Novice';
    if (totalXP < 1000) return 'Apprentice';
    if (totalXP < 2000) return 'Student';
    if (totalXP < 5000) return 'Scholar';
    if (totalXP < 10000) return 'Expert';
    if (totalXP < 20000) return 'Master';
    if (totalXP < 50000) return 'Grandmaster';
    return 'Legend';
  }, [getTotalXP]);

  /**
   * Get XP motivation message
   */
  const getXPMotivation = useCallback(() => {
    const levelInfo = getLevelInfo();
    const rank = getXPRank();
    const nextMilestone = getNextXPMilestone();

    if (levelInfo.currentLevel === 1) {
      return "Start your coding journey and earn your first XP! 🌟";
    } else if (nextMilestone && nextMilestone.level - levelInfo.currentLevel <= 2) {
      return `You're close to "${nextMilestone.name}"! Keep pushing! 💪`;
    } else if (levelInfo.currentLevel >= 20) {
      return `Amazing progress, ${rank}! You're a coding legend! 🏆`;
    } else {
      return `Great work, ${rank}! Every question makes you stronger! ⚡`;
    }
  }, [getLevelInfo, getXPRank, getNextXPMilestone]);

  /**
   * Get XP summary
   */
  const getXPSummary = useCallback(() => {
    if (!userProgress) return null;

    const levelInfo = getLevelInfo();
    const dailyProgress = getDailyXPProgress();
    const statistics = getXPStatistics();
    const rank = getXPRank();
    const motivation = getXPMotivation();

    return {
      totalXP: getTotalXP(),
      level: levelInfo.currentLevel,
      levelName: levelInfo.levelName,
      levelColor: levelInfo.levelColor,
      xpToNext: levelInfo.xpToNext,
      progressPercentage: levelInfo.progressPercentage,
      rank,
      dailyProgress,
      statistics,
      motivation,
      achievements: getXPAchievements(),
      recommendations: getXPRecommendations()
    };
  }, [
    userProgress,
    getLevelInfo,
    getDailyXPProgress,
    getXPStatistics,
    getTotalXP,
    getXPRank,
    getXPMotivation,
    getXPAchievements,
    getXPRecommendations
  ]);

  return {
    recentXPGain,
    levelUpNotification,
    calculateXPReward,
    getLevelInfo,
    getXPMilestones,
    getNextXPMilestone,
    getXPStatistics,
    getDailyXPProgress,
    getXPBreadown,
    simulateXPGain,
    getXPRecommendations,
    getXPAchievements,
    getXPRank,
    getXPMotivation,
    getXPSummary,
    isLoading: !userProgress
  };
};

export default useXPSystem;
