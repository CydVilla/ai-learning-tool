import { UserProgress, LearningTrack, TrackProgress } from '../types';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakStartDate?: string;
  streakHistory: StreakHistoryEntry[];
}

export interface StreakHistoryEntry {
  date: string;
  xpEarned: number;
  questionsAnswered: number;
  tracks: LearningTrack[];
}

export interface StreakMilestone {
  days: number;
  name: string;
  description: string;
  icon: string;
  bonusMultiplier: number;
  unlocked: boolean;
}

export class StreakService {
  // Streak milestones with rewards
  private static readonly STREAK_MILESTONES: Omit<StreakMilestone, 'unlocked'>[] = [
    { days: 3, name: 'Getting Started', description: '3-day streak', icon: '🌱', bonusMultiplier: 1.1 },
    { days: 7, name: 'Week Warrior', description: '7-day streak', icon: '🔥', bonusMultiplier: 1.2 },
    { days: 14, name: 'Two Week Champion', description: '14-day streak', icon: '⚡', bonusMultiplier: 1.3 },
    { days: 30, name: 'Month Master', description: '30-day streak', icon: '🏆', bonusMultiplier: 1.5 },
    { days: 60, name: 'Two Month Legend', description: '60-day streak', icon: '👑', bonusMultiplier: 1.7 },
    { days: 100, name: 'Century Scholar', description: '100-day streak', icon: '💎', bonusMultiplier: 2.0 },
    { days: 365, name: 'Year of Learning', description: '365-day streak', icon: '🌟', bonusMultiplier: 3.0 }
  ];

  /**
   * Calculate streak bonus multiplier based on current streak
   */
  static getStreakBonusMultiplier(currentStreak: number): number {
    const milestone = this.STREAK_MILESTONES
      .filter(m => m.days <= currentStreak)
      .sort((a, b) => b.days - a.days)[0];
    
    return milestone ? milestone.bonusMultiplier : 1.0;
  }

  /**
   * Get available streak milestones
   */
  static getStreakMilestones(currentStreak: number): StreakMilestone[] {
    return this.STREAK_MILESTONES.map(milestone => ({
      ...milestone,
      unlocked: currentStreak >= milestone.days
    }));
  }

  /**
   * Get next streak milestone
   */
  static getNextStreakMilestone(currentStreak: number): StreakMilestone | null {
    const nextMilestone = this.STREAK_MILESTONES.find(m => m.days > currentStreak);
    if (!nextMilestone) return null;

    return {
      ...nextMilestone,
      unlocked: false
    };
  }

  /**
   * Calculate streak progress percentage
   */
  static getStreakProgress(currentStreak: number): number {
    const nextMilestone = this.getNextStreakMilestone(currentStreak);
    if (!nextMilestone) return 100; // All milestones reached

    const previousMilestone = this.STREAK_MILESTONES
      .filter(m => m.days < nextMilestone.days)
      .sort((a, b) => b.days - a.days)[0];

    const previousDays = previousMilestone ? previousMilestone.days : 0;
    const progress = ((currentStreak - previousDays) / (nextMilestone.days - previousDays)) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  }

  /**
   * Check if streak should be maintained or broken
   */
  static shouldMaintainStreak(lastActivityDate: string, currentDate: string = new Date().toISOString().split('T')[0]): boolean {
    const lastDate = new Date(lastActivityDate);
    const current = new Date(currentDate);
    const diffTime = current.getTime() - lastDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Streak is maintained if activity is within 1 day
    return diffDays <= 1;
  }

  /**
   * Calculate streak from activity history
   */
  static calculateStreakFromHistory(streakHistory: StreakHistoryEntry[]): StreakData {
    if (streakHistory.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date().toISOString().split('T')[0],
        streakHistory: []
      };
    }

    // Sort history by date (most recent first)
    const sortedHistory = [...streakHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const entry of sortedHistory) {
      const entryDate = new Date(entry.date);
      
      if (lastDate === null) {
        // First entry
        tempStreak = 1;
        currentStreak = 1;
        longestStreak = 1;
      } else {
        const daysDiff = Math.ceil((lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day
          tempStreak++;
          if (currentStreak === tempStreak - 1) {
            currentStreak = tempStreak;
          }
        } else if (daysDiff > 1) {
          // Streak broken
          longestStreak = Math.max(longestStreak, tempStreak);
          if (currentStreak === tempStreak) {
            currentStreak = 0; // Current streak is broken
          }
          tempStreak = 1;
        }
        // If daysDiff === 0, it's the same day, don't change streak
      }
      
      lastDate = entryDate;
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      lastActivityDate: sortedHistory[0]?.date || new Date().toISOString().split('T')[0],
      streakStartDate: currentStreak > 0 ? sortedHistory[currentStreak - 1]?.date : undefined,
      streakHistory: sortedHistory
    };
  }

  /**
   * Update streak data after activity
   */
  static updateStreakData(
    currentStreakData: StreakData,
    xpEarned: number,
    questionsAnswered: number,
    tracks: LearningTrack[]
  ): StreakData {
    const today = new Date().toISOString().split('T')[0];
    const shouldMaintain = this.shouldMaintainStreak(currentStreakData.lastActivityDate, today);

    let newCurrentStreak = currentStreakData.currentStreak;
    let newLongestStreak = currentStreakData.longestStreak;
    let newStreakStartDate = currentStreakData.streakStartDate;

    if (shouldMaintain) {
      // Maintain or extend streak
      if (currentStreakData.lastActivityDate !== today) {
        // New day, extend streak
        newCurrentStreak = currentStreakData.currentStreak + 1;
        newLongestStreak = Math.max(currentStreakData.longestStreak, newCurrentStreak);
        newStreakStartDate = currentStreakData.streakStartDate || currentStreakData.lastActivityDate;
      }
    } else {
      // Streak broken
      newCurrentStreak = 1;
      newStreakStartDate = today;
    }

    // Add today's activity to history
    const newHistoryEntry: StreakHistoryEntry = {
      date: today,
      xpEarned,
      questionsAnswered,
      tracks
    };

    const updatedHistory = currentStreakData.streakHistory.filter(entry => entry.date !== today);
    updatedHistory.unshift(newHistoryEntry);

    return {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: today,
      streakStartDate: newStreakStartDate,
      streakHistory: updatedHistory
    };
  }

  /**
   * Get streak statistics
   */
  static getStreakStatistics(streakData: StreakData) {
    const totalDays = streakData.streakHistory.length;
    const totalXP = streakData.streakHistory.reduce((sum, entry) => sum + entry.xpEarned, 0);
    const totalQuestions = streakData.streakHistory.reduce((sum, entry) => sum + entry.questionsAnswered, 0);
    const averageXPPerDay = totalDays > 0 ? Math.round(totalXP / totalDays) : 0;
    const averageQuestionsPerDay = totalDays > 0 ? Math.round(totalQuestions / totalDays) : 0;

    // Calculate streak consistency (percentage of days with activity)
    const uniqueDays = new Set(streakData.streakHistory.map(entry => entry.date)).size;
    const consistency = totalDays > 0 ? Math.round((uniqueDays / totalDays) * 100) : 0;

    return {
      totalDays,
      totalXP,
      totalQuestions,
      averageXPPerDay,
      averageQuestionsPerDay,
      consistency,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak
    };
  }

  /**
   * Get streak motivation message
   */
  static getStreakMotivation(currentStreak: number): string {
    if (currentStreak === 0) {
      return "Start your learning journey today! 🌟";
    } else if (currentStreak < 3) {
      return "Great start! Keep the momentum going! 💪";
    } else if (currentStreak < 7) {
      return "You're building a great habit! 🔥";
    } else if (currentStreak < 14) {
      return "Amazing consistency! You're on fire! ⚡";
    } else if (currentStreak < 30) {
      return "Incredible dedication! You're unstoppable! 🏆";
    } else if (currentStreak < 60) {
      return "Legendary commitment! You're a learning champion! 👑";
    } else if (currentStreak < 100) {
      return "Outstanding perseverance! You're a true scholar! 💎";
    } else {
      return "Absolutely phenomenal! You're a learning legend! 🌟";
    }
  }

  /**
   * Check if streak is at risk (no activity for 1 day)
   */
  static isStreakAtRisk(lastActivityDate: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = new Date(lastActivityDate);
    const current = new Date(today);
    const diffTime = current.getTime() - lastDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1; // At risk if it's been exactly 1 day
  }

  /**
   * Get days until streak is lost
   */
  static getDaysUntilStreakLost(lastActivityDate: string): number {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = new Date(lastActivityDate);
    const current = new Date(today);
    const diffTime = current.getTime() - lastDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, 2 - diffDays); // 2 days total before streak is lost
  }
}

export default StreakService;
