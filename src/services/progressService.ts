import { 
  LearningTrack, 
  TrackProgress, 
  UserProgress, 
  QuestionAttempt,
  Achievement,
  DifficultyLevel 
} from '../types';

// XP calculation constants
const XP_REWARDS = {
  CORRECT_ANSWER: 10,
  PERFECT_ACCURACY_BONUS: 5,
  STREAK_BONUS: 2,
  DIFFICULTY_MULTIPLIER: {
    beginner: 1,
    intermediate: 1.5,
    advanced: 2
  },
  TIME_BONUS_THRESHOLD: 30, // seconds
  TIME_BONUS_MULTIPLIER: 1.2
};

// Level progression thresholds
const LEVEL_THRESHOLDS = [
  0, 50, 120, 200, 300, 420, 560, 720, 900, 1100, // Levels 1-10
  1320, 1560, 1820, 2100, 2400, 2720, 3060, 3420, 3800, 4200, // Levels 11-20
  4620, 5060, 5520, 6000, 6500, 7020, 7560, 8120, 8700, 9300 // Levels 21-30
];

export class ProgressService {
  /**
   * Calculate XP earned for a question attempt
   */
  static calculateXP(
    isCorrect: boolean,
    timeSpent: number,
    difficulty: DifficultyLevel,
    currentStreak: number,
    accuracy: number
  ): number {
    if (!isCorrect) return 0;

    let xp = XP_REWARDS.CORRECT_ANSWER;

    // Apply difficulty multiplier
    xp *= XP_REWARDS.DIFFICULTY_MULTIPLIER[difficulty];

    // Time bonus for quick answers
    if (timeSpent <= XP_REWARDS.TIME_BONUS_THRESHOLD) {
      xp *= XP_REWARDS.TIME_BONUS_MULTIPLIER;
    }

    // Streak bonus
    if (currentStreak > 0 && currentStreak % 5 === 0) {
      xp += XP_REWARDS.STREAK_BONUS * Math.floor(currentStreak / 5);
    }

    // Perfect accuracy bonus
    if (accuracy >= 100) {
      xp += XP_REWARDS.PERFECT_ACCURACY_BONUS;
    }

    return Math.round(xp);
  }

  /**
   * Calculate current level based on total XP
   */
  static calculateLevel(totalXP: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  /**
   * Calculate XP needed for next level
   */
  static getXPToNextLevel(currentLevel: number, totalXP: number): number {
    const nextLevelThreshold = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    return Math.max(0, nextLevelThreshold - totalXP);
  }

  /**
   * Update track progress after completing a question
   */
  static updateTrackProgress(
    trackProgress: TrackProgress,
    questionId: string,
    attempt: QuestionAttempt,
    difficulty: DifficultyLevel
  ): TrackProgress {
    const isCorrect = attempt.isCorrect;
    const timeSpentMinutes = attempt.timeSpent / 60;
    const xpEarned = this.calculateXP(
      isCorrect,
      attempt.timeSpent,
      difficulty,
      trackProgress.currentStreak,
      trackProgress.accuracy
    );

    // Update completed questions
    const updatedCompletedQuestions = [...trackProgress.completedQuestions];
    if (!updatedCompletedQuestions.includes(questionId)) {
      updatedCompletedQuestions.push(questionId);
    }

    // Update streak
    const newStreak = isCorrect ? trackProgress.currentStreak + 1 : 0;
    const newLongestStreak = Math.max(trackProgress.longestStreak, newStreak);

    // Update accuracy
    const totalQuestions = updatedCompletedQuestions.length;
    const correctAnswers = updatedCompletedQuestions.length * (trackProgress.accuracy / 100) + (isCorrect ? 1 : 0);
    const newAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Update level
    const newTotalXP = trackProgress.totalXP + xpEarned;
    const newLevel = this.calculateLevel(newTotalXP);

    return {
      ...trackProgress,
      currentLevel: newLevel,
      totalXP: newTotalXP,
      completedQuestions: updatedCompletedQuestions,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: new Date().toISOString().split('T')[0],
      accuracy: newAccuracy,
      timeSpent: trackProgress.timeSpent + timeSpentMinutes
    };
  }

  /**
   * Update overall user progress
   */
  static updateUserProgress(
    userProgress: UserProgress,
    track: LearningTrack,
    questionId: string,
    attempt: QuestionAttempt,
    difficulty: DifficultyLevel
  ): UserProgress {
    const trackProgress = userProgress.tracks[track];
    const updatedTrackProgress = this.updateTrackProgress(trackProgress, questionId, attempt, difficulty);

    // Update overall statistics
    const newTotalQuestions = userProgress.statistics.totalQuestionsAnswered + 1;
    const newCorrectAnswers = userProgress.statistics.totalCorrectAnswers + (attempt.isCorrect ? 1 : 0);
    const newTotalTime = userProgress.statistics.totalTimeSpent + (attempt.timeSpent / 60);

    // Update overall streak
    const newOverallStreak = attempt.isCorrect ? userProgress.currentStreak + 1 : 0;
    const newLongestStreak = Math.max(userProgress.longestStreak, newOverallStreak);

    // Calculate total XP
    const newTotalXP = Object.values(userProgress.tracks).reduce((sum, track) => sum + track.totalXP, 0) + 
                      (updatedTrackProgress.totalXP - trackProgress.totalXP);

    return {
      ...userProgress,
      totalXP: newTotalXP,
      currentStreak: newOverallStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: new Date().toISOString().split('T')[0],
      tracks: {
        ...userProgress.tracks,
        [track]: updatedTrackProgress
      },
      statistics: {
        ...userProgress.statistics,
        totalQuestionsAnswered: newTotalQuestions,
        totalCorrectAnswers: newCorrectAnswers,
        averageAccuracy: newTotalQuestions > 0 ? Math.round((newCorrectAnswers / newTotalQuestions) * 100) : 0,
        totalTimeSpent: newTotalTime,
        favoriteTrack: this.calculateFavoriteTrack(userProgress.tracks),
        questionsPerDay: this.calculateQuestionsPerDay(userProgress),
        averageSessionLength: this.calculateAverageSessionLength(userProgress)
      }
    };
  }

  /**
   * Check for achievement unlocks
   */
  static checkAchievements(userProgress: UserProgress): Achievement[] {
    const newAchievements: Achievement[] = [];
    const existingAchievementIds = userProgress.achievements.map(a => a.id);

    // Streak achievements
    if (userProgress.currentStreak >= 7 && !existingAchievementIds.includes('streak-7')) {
      newAchievements.push({
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        unlockedAt: new Date().toISOString(),
        category: 'streak'
      });
    }

    if (userProgress.currentStreak >= 30 && !existingAchievementIds.includes('streak-30')) {
      newAchievements.push({
        id: 'streak-30',
        name: 'Month Master',
        description: 'Maintain a 30-day learning streak',
        icon: '🏆',
        unlockedAt: new Date().toISOString(),
        category: 'streak'
      });
    }

    // XP achievements
    if (userProgress.totalXP >= 1000 && !existingAchievementIds.includes('xp-1000')) {
      newAchievements.push({
        id: 'xp-1000',
        name: 'Knowledge Seeker',
        description: 'Earn 1,000 XP points',
        icon: '⭐',
        unlockedAt: new Date().toISOString(),
        category: 'xp'
      });
    }

    // Accuracy achievements
    if (userProgress.statistics.averageAccuracy >= 90 && !existingAchievementIds.includes('accuracy-90')) {
      newAchievements.push({
        id: 'accuracy-90',
        name: 'Precision Master',
        description: 'Maintain 90% accuracy',
        icon: '🎯',
        unlockedAt: new Date().toISOString(),
        category: 'accuracy'
      });
    }

    // Track completion achievements
    Object.values(userProgress.tracks).forEach(track => {
      if (track.completedQuestions.length >= 50 && !existingAchievementIds.includes(`complete-${track.track}-50`)) {
        newAchievements.push({
          id: `complete-${track.track}-50`,
          name: `${track.track.toUpperCase()} Expert`,
          description: `Complete 50 ${track.track.toUpperCase()} questions`,
          icon: '💎',
          unlockedAt: new Date().toISOString(),
          category: 'completion'
        });
      }
    });

    return newAchievements;
  }

  /**
   * Calculate favorite track based on time spent
   */
  private static calculateFavoriteTrack(tracks: UserProgress['tracks']): LearningTrack {
    let favoriteTrack: LearningTrack = 'html';
    let maxTime = 0;

    Object.entries(tracks).forEach(([track, progress]) => {
      if (progress.timeSpent > maxTime) {
        maxTime = progress.timeSpent;
        favoriteTrack = track as LearningTrack;
      }
    });

    return favoriteTrack;
  }

  /**
   * Calculate questions per day
   */
  private static calculateQuestionsPerDay(userProgress: UserProgress): number {
    const totalQuestions = userProgress.statistics.totalQuestionsAnswered;
    const startDate = new Date(userProgress.lastActivityDate);
    const daysSinceStart = Math.max(1, Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    return Math.round(totalQuestions / daysSinceStart);
  }

  /**
   * Calculate average session length
   */
  private static calculateAverageSessionLength(userProgress: UserProgress): number {
    const totalTime = userProgress.statistics.totalTimeSpent;
    const totalSessions = Math.max(1, userProgress.statistics.totalQuestionsAnswered / 5); // Assume 5 questions per session
    return Math.round(totalTime / totalSessions);
  }

  /**
   * Get progress summary for a track
   */
  static getTrackProgressSummary(trackProgress: TrackProgress) {
    const xpToNext = this.getXPToNextLevel(trackProgress.currentLevel, trackProgress.totalXP);
    const progressPercentage = trackProgress.totalXP > 0 ? 
      ((trackProgress.totalXP - LEVEL_THRESHOLDS[trackProgress.currentLevel - 1]) / 
       (LEVEL_THRESHOLDS[trackProgress.currentLevel] - LEVEL_THRESHOLDS[trackProgress.currentLevel - 1])) * 100 : 0;

    return {
      level: trackProgress.currentLevel,
      xp: trackProgress.totalXP,
      xpToNext,
      progressPercentage: Math.round(progressPercentage),
      streak: trackProgress.currentStreak,
      accuracy: trackProgress.accuracy,
      questionsCompleted: trackProgress.completedQuestions.length,
      timeSpent: trackProgress.timeSpent
    };
  }

  /**
   * Get daily progress summary
   */
  static getDailyProgressSummary(userProgress: UserProgress) {
    const today = new Date().toISOString().split('T')[0];
    const isToday = userProgress.lastActivityDate === today;
    
    return {
      dailyGoal: userProgress.dailyGoal,
      progressToday: isToday ? userProgress.totalXP % 100 : 0, // Simplified daily XP calculation
      isGoalMet: isToday && (userProgress.totalXP % 100) >= userProgress.dailyGoal,
      streak: userProgress.currentStreak,
      lastActivity: userProgress.lastActivityDate
    };
  }
}

export default ProgressService;
