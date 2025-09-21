import { DifficultyLevel, LearningTrack } from '../types';

export interface XPReward {
  baseXP: number;
  bonusXP: number;
  totalXP: number;
  bonuses: XPBonus[];
}

export interface XPBonus {
  type: 'difficulty' | 'time' | 'streak' | 'accuracy' | 'first_attempt' | 'perfect_score';
  multiplier: number;
  description: string;
  xp: number;
}

export interface LevelInfo {
  currentLevel: number;
  currentXP: number;
  xpToNext: number;
  xpForCurrent: number;
  progressPercentage: number;
  levelName: string;
  levelColor: string;
}

export interface XPMilestone {
  level: number;
  name: string;
  description: string;
  icon: string;
  reward: string;
  unlocked: boolean;
}

export class XPService {
  // Base XP values
  private static readonly BASE_XP = {
    CORRECT_ANSWER: 10,
    INCORRECT_ANSWER: 2, // Small consolation XP
    PERFECT_ACCURACY: 5,
    FIRST_ATTEMPT: 3
  };

  // Difficulty multipliers
  private static readonly DIFFICULTY_MULTIPLIERS = {
    beginner: 1.0,
    intermediate: 1.5,
    advanced: 2.0
  };

  // Time bonus thresholds (in seconds)
  private static readonly TIME_BONUSES = [
    { threshold: 10, multiplier: 1.5, name: 'Lightning Fast' },
    { threshold: 20, multiplier: 1.3, name: 'Quick Thinker' },
    { threshold: 30, multiplier: 1.2, name: 'Speedy' },
    { threshold: 60, multiplier: 1.1, name: 'Efficient' }
  ];

  // Streak bonus thresholds
  private static readonly STREAK_BONUSES = [
    { threshold: 5, multiplier: 1.1, name: 'Getting Hot' },
    { threshold: 10, multiplier: 1.2, name: 'On Fire' },
    { threshold: 20, multiplier: 1.3, name: 'Blazing' },
    { threshold: 50, multiplier: 1.5, name: 'Inferno' }
  ];

  // Level progression (XP required for each level)
  private static readonly LEVEL_THRESHOLDS = [
    0, 50, 120, 200, 300, 420, 560, 720, 900, 1100, // Levels 1-10
    1320, 1560, 1820, 2100, 2400, 2720, 3060, 3420, 3800, 4200, // Levels 11-20
    4620, 5060, 5520, 6000, 6500, 7020, 7560, 8120, 8700, 9300, // Levels 21-30
    10000, 10800, 11600, 12400, 13200, 14000, 14800, 15600, 16400, 17200, // Levels 31-40
    18000, 18900, 19800, 20700, 21600, 22500, 23400, 24300, 25200, 26100 // Levels 41-50
  ];

  // Level names and colors
  private static readonly LEVEL_INFO = [
    { name: 'Novice', color: '#95a5a6' },
    { name: 'Apprentice', color: '#3498db' },
    { name: 'Student', color: '#2ecc71' },
    { name: 'Learner', color: '#f39c12' },
    { name: 'Scholar', color: '#e74c3c' },
    { name: 'Expert', color: '#9b59b6' },
    { name: 'Master', color: '#1abc9c' },
    { name: 'Grandmaster', color: '#e67e22' },
    { name: 'Legend', color: '#34495e' },
    { name: 'Mythic', color: '#8e44ad' }
  ];

  /**
   * Calculate XP reward for a question attempt
   */
  static calculateXPReward(
    isCorrect: boolean,
    timeSpent: number,
    difficulty: DifficultyLevel,
    currentStreak: number,
    accuracy: number,
    isFirstAttempt: boolean = true,
    track: LearningTrack
  ): XPReward {
    const bonuses: XPBonus[] = [];
    let baseXP = isCorrect ? this.BASE_XP.CORRECT_ANSWER : this.BASE_XP.INCORRECT_ANSWER;
    let totalMultiplier = 1.0;

    // Difficulty bonus
    const difficultyMultiplier = this.DIFFICULTY_MULTIPLIERS[difficulty];
    if (difficultyMultiplier > 1.0) {
      bonuses.push({
        type: 'difficulty',
        multiplier: difficultyMultiplier,
        description: `${difficulty} difficulty`,
        xp: baseXP * (difficultyMultiplier - 1)
      });
      totalMultiplier *= difficultyMultiplier;
    }

    // Time bonus
    const timeBonus = this.TIME_BONUSES.find(bonus => timeSpent <= bonus.threshold);
    if (timeBonus && isCorrect) {
      bonuses.push({
        type: 'time',
        multiplier: timeBonus.multiplier,
        description: timeBonus.name,
        xp: baseXP * (timeBonus.multiplier - 1)
      });
      totalMultiplier *= timeBonus.multiplier;
    }

    // Streak bonus
    const streakBonus = this.STREAK_BONUSES.find(bonus => currentStreak >= bonus.threshold);
    if (streakBonus && isCorrect) {
      bonuses.push({
        type: 'streak',
        multiplier: streakBonus.multiplier,
        description: streakBonus.name,
        xp: baseXP * (streakBonus.multiplier - 1)
      });
      totalMultiplier *= streakBonus.multiplier;
    }

    // Accuracy bonus
    if (accuracy >= 100 && isCorrect) {
      bonuses.push({
        type: 'accuracy',
        multiplier: 1.0,
        description: 'Perfect accuracy',
        xp: this.BASE_XP.PERFECT_ACCURACY
      });
    }

    // First attempt bonus
    if (isFirstAttempt && isCorrect) {
      bonuses.push({
        type: 'first_attempt',
        multiplier: 1.0,
        description: 'First try',
        xp: this.BASE_XP.FIRST_ATTEMPT
      });
    }

    // Perfect score bonus (100% accuracy for the session)
    if (accuracy === 100 && isCorrect) {
      bonuses.push({
        type: 'perfect_score',
        multiplier: 1.0,
        description: 'Perfect score',
        xp: this.BASE_XP.PERFECT_ACCURACY
      });
    }

    const totalXP = Math.round(baseXP * totalMultiplier) + bonuses.reduce((sum, bonus) => sum + bonus.xp, 0);
    const bonusXP = totalXP - baseXP;

    return {
      baseXP,
      bonusXP,
      totalXP,
      bonuses
    };
  }

  /**
   * Calculate level information from total XP
   */
  static calculateLevelInfo(totalXP: number): LevelInfo {
    let currentLevel = 1;
    let xpForCurrent = 0;
    let xpToNext = 0;

    // Find current level
    for (let i = 0; i < this.LEVEL_THRESHOLDS.length; i++) {
      if (totalXP >= this.LEVEL_THRESHOLDS[i]) {
        currentLevel = i + 1;
        xpForCurrent = this.LEVEL_THRESHOLDS[i];
      } else {
        break;
      }
    }

    // Calculate XP to next level
    if (currentLevel < this.LEVEL_THRESHOLDS.length) {
      xpToNext = this.LEVEL_THRESHOLDS[currentLevel] - totalXP;
    } else {
      xpToNext = 0; // Max level reached
    }

    // Calculate progress percentage
    const currentLevelXP = this.LEVEL_THRESHOLDS[currentLevel - 1];
    const nextLevelXP = this.LEVEL_THRESHOLDS[currentLevel] || this.LEVEL_THRESHOLDS[this.LEVEL_THRESHOLDS.length - 1];
    const progressPercentage = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    // Get level name and color
    const levelInfoIndex = Math.min(Math.floor((currentLevel - 1) / 5), this.LEVEL_INFO.length - 1);
    const levelInfo = this.LEVEL_INFO[levelInfoIndex];

    return {
      currentLevel,
      currentXP: totalXP,
      xpToNext,
      xpForCurrent,
      progressPercentage: Math.min(Math.max(progressPercentage, 0), 100),
      levelName: levelInfo.name,
      levelColor: levelInfo.color
    };
  }

  /**
   * Get XP milestones
   */
  static getXPMilestones(currentXP: number): XPMilestone[] {
    const milestones: XPMilestone[] = [
      { level: 5, name: 'Rising Star', description: 'Reach level 5', icon: '⭐', reward: 'Unlock intermediate questions', unlocked: currentXP >= this.LEVEL_THRESHOLDS[4] },
      { level: 10, name: 'Knowledge Seeker', description: 'Reach level 10', icon: '🔍', reward: 'Unlock advanced questions', unlocked: currentXP >= this.LEVEL_THRESHOLDS[9] },
      { level: 15, name: 'Dedicated Learner', description: 'Reach level 15', icon: '📚', reward: 'Unlock expert mode', unlocked: currentXP >= this.LEVEL_THRESHOLDS[14] },
      { level: 20, name: 'Skillful Coder', description: 'Reach level 20', icon: '💻', reward: 'Unlock code challenges', unlocked: currentXP >= this.LEVEL_THRESHOLDS[19] },
      { level: 25, name: 'Code Master', description: 'Reach level 25', icon: '🏆', reward: 'Unlock all features', unlocked: currentXP >= this.LEVEL_THRESHOLDS[24] },
      { level: 30, name: 'Programming Legend', description: 'Reach level 30', icon: '👑', reward: 'Legendary status', unlocked: currentXP >= this.LEVEL_THRESHOLDS[29] },
      { level: 40, name: 'Coding Deity', description: 'Reach level 40', icon: '🌟', reward: 'Mythical status', unlocked: currentXP >= this.LEVEL_THRESHOLDS[39] },
      { level: 50, name: 'Ultimate Coder', description: 'Reach level 50', icon: '💎', reward: 'Ultimate achievement', unlocked: currentXP >= this.LEVEL_THRESHOLDS[49] }
    ];

    return milestones;
  }

  /**
   * Get next XP milestone
   */
  static getNextXPMilestone(currentXP: number): XPMilestone | null {
    const milestones = this.getXPMilestones(currentXP);
    return milestones.find(milestone => !milestone.unlocked) || null;
  }

  /**
   * Calculate XP needed for a specific level
   */
  static getXPForLevel(level: number): number {
    if (level < 1 || level > this.LEVEL_THRESHOLDS.length) {
      return 0;
    }
    return this.LEVEL_THRESHOLDS[level - 1];
  }

  /**
   * Get XP statistics
   */
  static getXPStatistics(totalXP: number, trackXP: { [key in LearningTrack]: number }) {
    const levelInfo = this.calculateLevelInfo(totalXP);
    const milestones = this.getXPMilestones(totalXP);
    const unlockedMilestones = milestones.filter(m => m.unlocked);
    const nextMilestone = this.getNextXPMilestone(totalXP);

    // Calculate track distribution
    const totalTrackXP = Object.values(trackXP).reduce((sum, xp) => sum + xp, 0);
    const trackDistribution = Object.entries(trackXP).map(([track, xp]) => ({
      track: track as LearningTrack,
      xp,
      percentage: totalTrackXP > 0 ? Math.round((xp / totalTrackXP) * 100) : 0
    }));

    return {
      levelInfo,
      milestones: unlockedMilestones,
      nextMilestone,
      trackDistribution,
      totalXP,
      averageXPPerDay: Math.round(totalXP / Math.max(1, 30)), // Assuming 30 days of activity
      xpRank: this.calculateXPRank(totalXP)
    };
  }

  /**
   * Calculate XP rank based on total XP
   */
  private static calculateXPRank(totalXP: number): string {
    if (totalXP < 100) return 'Beginner';
    if (totalXP < 500) return 'Novice';
    if (totalXP < 1000) return 'Apprentice';
    if (totalXP < 2000) return 'Student';
    if (totalXP < 5000) return 'Scholar';
    if (totalXP < 10000) return 'Expert';
    if (totalXP < 20000) return 'Master';
    if (totalXP < 50000) return 'Grandmaster';
    return 'Legend';
  }

  /**
   * Get XP breakdown for a question attempt
   */
  static getXPBreadown(xpReward: XPReward): string[] {
    const breakdown: string[] = [];
    
    breakdown.push(`Base XP: ${xpReward.baseXP}`);
    
    if (xpReward.bonuses.length > 0) {
      breakdown.push('Bonuses:');
      xpReward.bonuses.forEach(bonus => {
        if (bonus.xp > 0) {
          breakdown.push(`  • ${bonus.description}: +${bonus.xp} XP`);
        }
      });
    }
    
    breakdown.push(`Total: ${xpReward.totalXP} XP`);
    
    return breakdown;
  }

  /**
   * Calculate daily XP goal progress
   */
  static calculateDailyXPProgress(currentXP: number, dailyGoal: number, lastActivityDate: string): {
    progress: number;
    remaining: number;
    isGoalMet: boolean;
    streakBonus: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const isToday = lastActivityDate === today;
    
    // Simplified daily XP calculation (in real app, this would track daily XP separately)
    const todayXP = isToday ? currentXP % 100 : 0; // Mock calculation
    const progress = Math.min(todayXP, dailyGoal);
    const remaining = Math.max(0, dailyGoal - todayXP);
    const isGoalMet = todayXP >= dailyGoal;
    const streakBonus = isGoalMet ? Math.round(dailyGoal * 0.1) : 0; // 10% bonus for meeting daily goal
    
    return {
      progress,
      remaining,
      isGoalMet,
      streakBonus
    };
  }
}

export default XPService;
