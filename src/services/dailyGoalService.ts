import { UserProgress, LearningTrack } from '../types';

export interface DailyGoal {
  id: string;
  type: 'xp' | 'questions' | 'time' | 'streak';
  target: number;
  current: number;
  completed: boolean;
  bonus: number;
  description: string;
  icon: string;
}

export interface DailyProgress {
  date: string;
  totalXP: number;
  questionsAnswered: number;
  timeSpent: number; // in minutes
  tracks: {
    [key in LearningTrack]: {
      xp: number;
      questions: number;
      timeSpent: number;
    };
  };
  goals: DailyGoal[];
  streakMaintained: boolean;
  bonusXP: number;
}

export interface GoalRecommendation {
  type: 'increase' | 'decrease' | 'maintain';
  reason: string;
  suggestedTarget: number;
  confidence: number;
}

export class DailyGoalService {
  // Default goal templates
  private static readonly DEFAULT_GOALS = {
    xp: { target: 50, description: 'Earn XP points', icon: '⭐' },
    questions: { target: 5, description: 'Answer questions', icon: '❓' },
    time: { target: 15, description: 'Spend time learning', icon: '⏱️' },
    streak: { target: 1, description: 'Maintain streak', icon: '🔥' }
  };

  /**
   * Create daily goals for a user
   */
  static createDailyGoals(userProgress: UserProgress): DailyGoal[] {
    const goals: DailyGoal[] = [];
    const today = new Date().toISOString().split('T')[0];

    // XP Goal
    goals.push({
      id: 'daily-xp',
      type: 'xp',
      target: userProgress.dailyGoal,
      current: 0, // Will be calculated from daily progress
      completed: false,
      bonus: Math.round(userProgress.dailyGoal * 0.1), // 10% bonus
      description: this.DEFAULT_GOALS.xp.description,
      icon: this.DEFAULT_GOALS.xp.icon
    });

    // Questions Goal (based on user level)
    const questionsTarget = this.calculateQuestionsGoal(userProgress);
    goals.push({
      id: 'daily-questions',
      type: 'questions',
      target: questionsTarget,
      current: 0,
      completed: false,
      bonus: Math.round(questionsTarget * 2), // 2 XP per question bonus
      description: this.DEFAULT_GOALS.questions.description,
      icon: this.DEFAULT_GOALS.questions.icon
    });

    // Time Goal (based on user activity)
    const timeTarget = this.calculateTimeGoal(userProgress);
    goals.push({
      id: 'daily-time',
      type: 'time',
      target: timeTarget,
      current: 0,
      completed: false,
      bonus: Math.round(timeTarget * 0.5), // 0.5 XP per minute bonus
      description: this.DEFAULT_GOALS.time.description,
      icon: this.DEFAULT_GOALS.time.icon
    });

    // Streak Goal (always 1 for daily maintenance)
    goals.push({
      id: 'daily-streak',
      type: 'streak',
      target: 1,
      current: 0,
      completed: false,
      bonus: 5, // Fixed bonus for maintaining streak
      description: this.DEFAULT_GOALS.streak.description,
      icon: this.DEFAULT_GOALS.streak.icon
    });

    return goals;
  }

  /**
   * Calculate questions goal based on user level and activity
   */
  private static calculateQuestionsGoal(userProgress: UserProgress): number {
    const totalQuestions = userProgress.statistics.totalQuestionsAnswered;
    const averagePerDay = userProgress.statistics.questionsPerDay;
    
    // Base goal on user's average activity
    if (averagePerDay > 0) {
      return Math.max(3, Math.min(15, Math.round(averagePerDay * 1.2))); // 20% above average, capped
    }
    
    // Default goals based on experience level
    if (totalQuestions < 50) return 3; // Beginner
    if (totalQuestions < 200) return 5; // Intermediate
    if (totalQuestions < 500) return 8; // Advanced
    return 10; // Expert
  }

  /**
   * Calculate time goal based on user activity
   */
  private static calculateTimeGoal(userProgress: UserProgress): number {
    const totalTime = userProgress.statistics.totalTimeSpent;
    const averageSessionLength = userProgress.statistics.averageSessionLength;
    
    // Base goal on user's average session length
    if (averageSessionLength > 0) {
      return Math.max(10, Math.min(60, Math.round(averageSessionLength * 1.5))); // 50% above average, capped
    }
    
    // Default goals based on experience level
    if (totalTime < 100) return 10; // Beginner (10 minutes)
    if (totalTime < 500) return 15; // Intermediate (15 minutes)
    if (totalTime < 1000) return 20; // Advanced (20 minutes)
    return 30; // Expert (30 minutes)
  }

  /**
   * Update daily progress
   */
  static updateDailyProgress(
    currentProgress: DailyProgress,
    xpEarned: number,
    questionsAnswered: number,
    timeSpent: number,
    track: LearningTrack
  ): DailyProgress {
    const updatedProgress = { ...currentProgress };
    
    // Update totals
    updatedProgress.totalXP += xpEarned;
    updatedProgress.questionsAnswered += questionsAnswered;
    updatedProgress.timeSpent += timeSpent;
    
    // Update track-specific progress
    updatedProgress.tracks[track].xp += xpEarned;
    updatedProgress.tracks[track].questions += questionsAnswered;
    updatedProgress.tracks[track].timeSpent += timeSpent;
    
    // Update goals
    updatedProgress.goals = updatedProgress.goals.map(goal => {
      let current = goal.current;
      
      switch (goal.type) {
        case 'xp':
          current = updatedProgress.totalXP;
          break;
        case 'questions':
          current = updatedProgress.questionsAnswered;
          break;
        case 'time':
          current = updatedProgress.timeSpent;
          break;
        case 'streak':
          current = 1; // Streak is maintained if any activity occurs
          break;
      }
      
      return {
        ...goal,
        current,
        completed: current >= goal.target
      };
    });
    
    // Calculate bonus XP
    const completedGoals = updatedProgress.goals.filter(goal => goal.completed);
    updatedProgress.bonusXP = completedGoals.reduce((sum, goal) => sum + goal.bonus, 0);
    
    return updatedProgress;
  }

  /**
   * Get daily progress summary
   */
  static getDailyProgressSummary(progress: DailyProgress) {
    const completedGoals = progress.goals.filter(goal => goal.completed);
    const totalGoals = progress.goals.length;
    const completionRate = Math.round((completedGoals.length / totalGoals) * 100);
    
    const totalPossibleBonus = progress.goals.reduce((sum, goal) => sum + goal.bonus, 0);
    const bonusEarned = progress.bonusXP;
    const bonusRate = totalPossibleBonus > 0 ? Math.round((bonusEarned / totalPossibleBonus) * 100) : 0;
    
    return {
      totalXP: progress.totalXP,
      questionsAnswered: progress.questionsAnswered,
      timeSpent: progress.timeSpent,
      goalsCompleted: completedGoals.length,
      totalGoals,
      completionRate,
      bonusXP: bonusEarned,
      totalPossibleBonus,
      bonusRate,
      streakMaintained: progress.streakMaintained,
      isAllGoalsMet: completedGoals.length === totalGoals
    };
  }

  /**
   * Get goal recommendations
   */
  static getGoalRecommendations(userProgress: UserProgress): GoalRecommendation[] {
    const recommendations: GoalRecommendation[] = [];
    
    // Analyze user's recent performance
    const averageXPPerDay = userProgress.statistics.totalTimeSpent > 0 ? 
      Math.round(userProgress.totalXP / Math.max(1, 30)) : 0; // Assuming 30 days
    
    const currentDailyGoal = userProgress.dailyGoal;
    
    // XP Goal recommendations
    if (averageXPPerDay > currentDailyGoal * 1.5) {
      recommendations.push({
        type: 'increase',
        reason: 'You consistently exceed your daily XP goal',
        suggestedTarget: Math.round(currentDailyGoal * 1.3),
        confidence: 0.8
      });
    } else if (averageXPPerDay < currentDailyGoal * 0.7) {
      recommendations.push({
        type: 'decrease',
        reason: 'Your current goal might be too ambitious',
        suggestedTarget: Math.round(currentDailyGoal * 0.8),
        confidence: 0.7
      });
    } else {
      recommendations.push({
        type: 'maintain',
        reason: 'Your current goal is well-balanced',
        suggestedTarget: currentDailyGoal,
        confidence: 0.9
      });
    }
    
    return recommendations;
  }

  /**
   * Get daily motivation message
   */
  static getDailyMotivation(progress: DailyProgress, userProgress: UserProgress): string {
    const summary = this.getDailyProgressSummary(progress);
    const currentStreak = userProgress.currentStreak;
    
    if (summary.isAllGoalsMet) {
      return "🎉 Amazing! You've completed all your daily goals! You're unstoppable! 🚀";
    }
    
    if (summary.completionRate >= 75) {
      return "🔥 Great progress! You're almost there! Keep pushing to complete all goals! 💪";
    }
    
    if (summary.completionRate >= 50) {
      return "⚡ Good start! You're halfway through your daily goals! Keep going! 🌟";
    }
    
    if (summary.completionRate >= 25) {
      return "🌱 You're getting started! Every step counts toward your goals! 📈";
    }
    
    if (currentStreak > 0) {
      return `🔥 Your ${currentStreak}-day streak is at risk! Complete a goal to maintain it! ⚠️`;
    }
    
    return "🌟 Start your learning journey today! Set your goals and achieve them! 🎯";
  }

  /**
   * Get goal progress visualization data
   */
  static getGoalProgressData(progress: DailyProgress) {
    return progress.goals.map(goal => ({
      id: goal.id,
      type: goal.type,
      label: goal.description,
      icon: goal.icon,
      current: goal.current,
      target: goal.target,
      percentage: Math.min(Math.round((goal.current / goal.target) * 100), 100),
      completed: goal.completed,
      bonus: goal.bonus
    }));
  }

  /**
   * Calculate optimal daily goal based on user patterns
   */
  static calculateOptimalDailyGoal(userProgress: UserProgress): number {
    const totalXP = userProgress.totalXP;
    const totalTime = userProgress.statistics.totalTimeSpent;
    const questionsAnswered = userProgress.statistics.totalQuestionsAnswered;
    
    // Calculate average XP per session
    const averageSessionsPerDay = Math.max(1, Math.round(questionsAnswered / 30)); // Assuming 30 days
    const averageXPPerSession = totalXP / Math.max(1, questionsAnswered / 5); // Assuming 5 questions per session
    
    // Calculate optimal daily goal
    const optimalGoal = Math.round(averageXPPerSession * averageSessionsPerDay);
    
    // Ensure goal is within reasonable bounds
    return Math.max(20, Math.min(200, optimalGoal));
  }

  /**
   * Get daily goal achievements
   */
  static getDailyGoalAchievements(progress: DailyProgress): string[] {
    const achievements: string[] = [];
    const summary = this.getDailyProgressSummary(progress);
    
    if (summary.isAllGoalsMet) {
      achievements.push('🎯 Goal Master - Completed all daily goals!');
    }
    
    if (summary.completionRate >= 100) {
      achievements.push('💯 Perfect Day - 100% goal completion!');
    }
    
    if (summary.bonusRate >= 100) {
      achievements.push('🎁 Bonus Collector - Earned all bonus XP!');
    }
    
    if (progress.streakMaintained) {
      achievements.push('🔥 Streak Keeper - Maintained your learning streak!');
    }
    
    if (summary.timeSpent >= 60) {
      achievements.push('⏰ Time Master - Spent over an hour learning!');
    }
    
    return achievements;
  }
}

export default DailyGoalService;
