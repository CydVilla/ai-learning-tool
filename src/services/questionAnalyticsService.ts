import { Question, CodeExercise, LearningTrack, DifficultyLevel, QuestionType } from '../types';

export interface QuestionAnalytics {
  questionId: string;
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  averageTimeSpent: number;
  averageHintsUsed: number;
  difficultyRating: number;
  lastAttempted: string;
  firstAttempted: string;
  streak: number;
  maxStreak: number;
  tags: string[];
  track: LearningTrack;
  difficulty: DifficultyLevel;
  type: QuestionType;
}

export interface TrackAnalytics {
  track: LearningTrack;
  totalQuestions: number;
  totalAttempts: number;
  correctAttempts: number;
  averageAccuracy: number;
  averageTimeSpent: number;
  averageHintsUsed: number;
  completionRate: number;
  difficultyBreakdown: {
    [key in DifficultyLevel]: {
      total: number;
      completed: number;
      accuracy: number;
    };
  };
  typeBreakdown: {
    [key in QuestionType]: {
      total: number;
      completed: number;
      accuracy: number;
    };
  };
  progress: {
    currentLevel: number;
    xpEarned: number;
    xpTotal: number;
    nextLevelXP: number;
  };
}

export interface UserAnalytics {
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  totalHintsUsed: number;
  averageHintsPerQuestion: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  trackProgress: TrackAnalytics[];
  recentActivity: {
    date: string;
    questionsAnswered: number;
    accuracy: number;
    timeSpent: number;
    xpEarned: number;
  }[];
  performanceByDifficulty: {
    [key in DifficultyLevel]: {
      questionsAnswered: number;
      accuracy: number;
      averageTime: number;
    };
  };
  performanceByType: {
    [key in QuestionType]: {
      questionsAnswered: number;
      accuracy: number;
      averageTime: number;
    };
  };
}

export interface AnalyticsEvent {
  id: string;
  type: 'question_attempt' | 'question_completed' | 'hint_used' | 'time_spent' | 'streak_updated';
  questionId: string;
  userId?: string;
  timestamp: string;
  data: any;
}

class QuestionAnalyticsService {
  private analytics: Map<string, QuestionAnalytics> = new Map();
  private events: AnalyticsEvent[] = [];
  private userAnalytics: UserAnalytics | null = null;

  /**
   * Track a question attempt
   */
  trackQuestionAttempt(
    questionId: string,
    isCorrect: boolean,
    timeSpent: number,
    hintsUsed: number = 0,
    question: Question | CodeExercise
  ): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type: 'question_attempt',
      questionId,
      timestamp: new Date().toISOString(),
      data: {
        isCorrect,
        timeSpent,
        hintsUsed,
        track: question.track,
        difficulty: question.difficulty,
        type: question.type
      }
    };

    this.events.push(event);
    this.updateQuestionAnalytics(questionId, isCorrect, timeSpent, hintsUsed, question);
    this.updateUserAnalytics();
  }

  /**
   * Track hint usage
   */
  trackHintUsage(questionId: string, hintIndex: number): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type: 'hint_used',
      questionId,
      timestamp: new Date().toISOString(),
      data: {
        hintIndex
      }
    };

    this.events.push(event);
  }

  /**
   * Track time spent on question
   */
  trackTimeSpent(questionId: string, timeSpent: number): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type: 'time_spent',
      questionId,
      timestamp: new Date().toISOString(),
      data: {
        timeSpent
      }
    };

    this.events.push(event);
  }

  /**
   * Get analytics for a specific question
   */
  getQuestionAnalytics(questionId: string): QuestionAnalytics | null {
    return this.analytics.get(questionId) || null;
  }

  /**
   * Get analytics for a specific track
   */
  getTrackAnalytics(track: LearningTrack, questions: Question[], exercises: CodeExercise[]): TrackAnalytics {
    const trackQuestions = [...questions, ...exercises].filter(q => q.track === track);
    const trackAnalytics = this.analytics;
    
    let totalAttempts = 0;
    let correctAttempts = 0;
    let totalTimeSpent = 0;
    let totalHintsUsed = 0;
    let completedQuestions = 0;

    const difficultyBreakdown = {
      beginner: { total: 0, completed: 0, accuracy: 0 },
      intermediate: { total: 0, completed: 0, accuracy: 0 },
      advanced: { total: 0, completed: 0, accuracy: 0 }
    };

    const typeBreakdown = {
      'multiple-choice': { total: 0, completed: 0, accuracy: 0 },
      'fill-in-the-blank': { total: 0, completed: 0, accuracy: 0 },
      'code-exercise': { total: 0, completed: 0, accuracy: 0 }
    };

    // Count total questions by difficulty and type
    trackQuestions.forEach(question => {
      difficultyBreakdown[question.difficulty as DifficultyLevel].total++;
      typeBreakdown[question.type as QuestionType].total++;
    });

    // Calculate analytics from events
    this.events.forEach(event => {
      if (event.type === 'question_attempt' && event.data.track === track) {
        totalAttempts++;
        if (event.data.isCorrect) {
          correctAttempts++;
        }
        totalTimeSpent += event.data.timeSpent || 0;
        totalHintsUsed += event.data.hintsUsed || 0;
        
        if (event.data.isCorrect) {
          completedQuestions++;
          difficultyBreakdown[event.data.difficulty as DifficultyLevel].completed++;
          typeBreakdown[event.data.type as QuestionType].completed++;
        }
      }
    });

    // Calculate accuracy for each difficulty and type
    Object.keys(difficultyBreakdown).forEach(difficulty => {
      const diff = difficultyBreakdown[difficulty as DifficultyLevel];
      if (diff.total > 0) {
        diff.accuracy = (diff.completed / diff.total) * 100;
      }
    });

    Object.keys(typeBreakdown).forEach(type => {
      const typ = typeBreakdown[type as QuestionType];
      if (typ.total > 0) {
        typ.accuracy = (typ.completed / typ.total) * 100;
      }
    });

    const averageAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    const averageTimeSpent = totalAttempts > 0 ? totalTimeSpent / totalAttempts : 0;
    const averageHintsUsed = totalAttempts > 0 ? totalHintsUsed / totalAttempts : 0;
    const completionRate = trackQuestions.length > 0 ? (completedQuestions / trackQuestions.length) * 100 : 0;

    // Calculate progress
    const xpEarned = this.calculateXPEarned(track);
    const xpTotal = trackQuestions.reduce((sum, q) => sum + (q.xp || q.points || 0), 0);
    const currentLevel = this.calculateLevel(xpEarned);
    const nextLevelXP = this.calculateNextLevelXP(currentLevel);

    return {
      track,
      totalQuestions: trackQuestions.length,
      totalAttempts,
      correctAttempts,
      averageAccuracy,
      averageTimeSpent,
      averageHintsUsed,
      completionRate,
      difficultyBreakdown,
      typeBreakdown,
      progress: {
        currentLevel,
        xpEarned,
        xpTotal,
        nextLevelXP
      }
    };
  }

  /**
   * Get overall user analytics
   */
  getUserAnalytics(): UserAnalytics {
    if (this.userAnalytics) {
      return this.userAnalytics;
    }

    let totalQuestionsAnswered = 0;
    let totalCorrectAnswers = 0;
    let totalTimeSpent = 0;
    let totalHintsUsed = 0;
    let totalXP = 0;
    let currentStreak = 0;
    let longestStreak = 0;

    const performanceByDifficulty = {
      beginner: { questionsAnswered: 0, accuracy: 0, averageTime: 0 },
      intermediate: { questionsAnswered: 0, accuracy: 0, averageTime: 0 },
      advanced: { questionsAnswered: 0, accuracy: 0, averageTime: 0 }
    };

    const performanceByType = {
      'multiple-choice': { questionsAnswered: 0, accuracy: 0, averageTime: 0 },
      'fill-in-the-blank': { questionsAnswered: 0, accuracy: 0, averageTime: 0 },
      'code-exercise': { questionsAnswered: 0, accuracy: 0, averageTime: 0 }
    };

    const trackProgress: TrackAnalytics[] = [];
    const recentActivity: any[] = [];

    // Calculate analytics from events
    this.events.forEach(event => {
      if (event.type === 'question_attempt') {
        totalQuestionsAnswered++;
        if (event.data.isCorrect) {
          totalCorrectAnswers++;
          totalXP += event.data.xp || 10;
        }
        totalTimeSpent += event.data.timeSpent || 0;
        totalHintsUsed += event.data.hintsUsed || 0;

        // Update performance by difficulty
        const diff = performanceByDifficulty[event.data.difficulty as DifficultyLevel];
        diff.questionsAnswered++;
        if (event.data.isCorrect) {
          diff.accuracy = (diff.accuracy * (diff.questionsAnswered - 1) + 100) / diff.questionsAnswered;
        } else {
          diff.accuracy = (diff.accuracy * (diff.questionsAnswered - 1)) / diff.questionsAnswered;
        }
        diff.averageTime = (diff.averageTime * (diff.questionsAnswered - 1) + event.data.timeSpent) / diff.questionsAnswered;

        // Update performance by type
        const typ = performanceByType[event.data.type as QuestionType];
        typ.questionsAnswered++;
        if (event.data.isCorrect) {
          typ.accuracy = (typ.accuracy * (typ.questionsAnswered - 1) + 100) / typ.questionsAnswered;
        } else {
          typ.accuracy = (typ.accuracy * (typ.questionsAnswered - 1)) / typ.questionsAnswered;
        }
        typ.averageTime = (typ.averageTime * (typ.questionsAnswered - 1) + event.data.timeSpent) / typ.questionsAnswered;
      }
    });

    const overallAccuracy = totalQuestionsAnswered > 0 ? (totalCorrectAnswers / totalQuestionsAnswered) * 100 : 0;
    const averageTimePerQuestion = totalQuestionsAnswered > 0 ? totalTimeSpent / totalQuestionsAnswered : 0;
    const averageHintsPerQuestion = totalQuestionsAnswered > 0 ? totalHintsUsed / totalQuestionsAnswered : 0;
    const level = this.calculateLevel(totalXP);

    this.userAnalytics = {
      totalQuestionsAnswered,
      totalCorrectAnswers,
      overallAccuracy,
      totalTimeSpent,
      averageTimePerQuestion,
      totalHintsUsed,
      averageHintsPerQuestion,
      currentStreak,
      longestStreak,
      totalXP,
      level,
      trackProgress,
      recentActivity,
      performanceByDifficulty,
      performanceByType
    };

    return this.userAnalytics;
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    totalQuestions: number;
    totalAttempts: number;
    overallAccuracy: number;
    totalTimeSpent: number;
    totalXP: number;
    currentLevel: number;
    topPerformingTrack: LearningTrack | null;
    topPerformingDifficulty: DifficultyLevel | null;
    improvementAreas: string[];
  } {
    const userAnalytics = this.getUserAnalytics();
    
    // Find top performing track
    let topPerformingTrack: LearningTrack | null = null;
    let bestTrackAccuracy = 0;
    
    const tracks: LearningTrack[] = ['html', 'css', 'javascript'];
    tracks.forEach(track => {
      const trackAnalytics = this.getTrackAnalytics(track, [], []);
      if (trackAnalytics.averageAccuracy > bestTrackAccuracy) {
        bestTrackAccuracy = trackAnalytics.averageAccuracy;
        topPerformingTrack = track;
      }
    });

    // Find top performing difficulty
    let topPerformingDifficulty: DifficultyLevel | null = null;
    let bestDifficultyAccuracy = 0;
    
    const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
    difficulties.forEach(difficulty => {
      const perf = userAnalytics.performanceByDifficulty[difficulty];
      if (perf.questionsAnswered > 0 && perf.accuracy > bestDifficultyAccuracy) {
        bestDifficultyAccuracy = perf.accuracy;
        topPerformingDifficulty = difficulty;
      }
    });

    // Identify improvement areas
    const improvementAreas: string[] = [];
    if (userAnalytics.overallAccuracy < 70) {
      improvementAreas.push('Overall accuracy needs improvement');
    }
    if (userAnalytics.averageTimePerQuestion > 300) {
      improvementAreas.push('Consider spending less time per question');
    }
    if (userAnalytics.averageHintsPerQuestion > 2) {
      improvementAreas.push('Try to use fewer hints');
    }

    return {
      totalQuestions: this.analytics.size,
      totalAttempts: userAnalytics.totalQuestionsAnswered,
      overallAccuracy: userAnalytics.overallAccuracy,
      totalTimeSpent: userAnalytics.totalTimeSpent,
      totalXP: userAnalytics.totalXP,
      currentLevel: userAnalytics.level,
      topPerformingTrack,
      topPerformingDifficulty,
      improvementAreas
    };
  }

  /**
   * Update question analytics
   */
  private updateQuestionAnalytics(
    questionId: string,
    isCorrect: boolean,
    timeSpent: number,
    hintsUsed: number,
    question: Question | CodeExercise
  ): void {
    let analytics = this.analytics.get(questionId);
    
    if (!analytics) {
      analytics = {
        questionId,
        totalAttempts: 0,
        correctAttempts: 0,
        incorrectAttempts: 0,
        averageTimeSpent: 0,
        averageHintsUsed: 0,
        difficultyRating: 0,
        lastAttempted: new Date().toISOString(),
        firstAttempted: new Date().toISOString(),
        streak: 0,
        maxStreak: 0,
        tags: [],
        track: question.track,
        difficulty: question.difficulty,
        type: question.type
      };
    }

    analytics.totalAttempts++;
    if (isCorrect) {
      analytics.correctAttempts++;
      analytics.streak++;
      if (analytics.streak > analytics.maxStreak) {
        analytics.maxStreak = analytics.streak;
      }
    } else {
      analytics.incorrectAttempts++;
      analytics.streak = 0;
    }

    analytics.averageTimeSpent = (analytics.averageTimeSpent * (analytics.totalAttempts - 1) + timeSpent) / analytics.totalAttempts;
    analytics.averageHintsUsed = (analytics.averageHintsUsed * (analytics.totalAttempts - 1) + hintsUsed) / analytics.totalAttempts;
    analytics.lastAttempted = new Date().toISOString();

    this.analytics.set(questionId, analytics);
  }

  /**
   * Update user analytics
   */
  private updateUserAnalytics(): void {
    this.userAnalytics = null; // Force recalculation
  }

  /**
   * Calculate XP earned for a track
   */
  private calculateXPEarned(track: LearningTrack): number {
    let xp = 0;
    this.events.forEach(event => {
      if (event.type === 'question_attempt' && event.data.track === track && event.data.isCorrect) {
        xp += event.data.xp || 10;
      }
    });
    return xp;
  }

  /**
   * Calculate level from XP
   */
  private calculateLevel(xp: number): number {
    return Math.floor(xp / 100) + 1;
  }

  /**
   * Calculate XP needed for next level
   */
  private calculateNextLevelXP(currentLevel: number): number {
    return currentLevel * 100;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all analytics
   */
  clearAnalytics(): void {
    this.analytics.clear();
    this.events = [];
    this.userAnalytics = null;
  }

  /**
   * Export analytics data
   */
  exportAnalytics(): string {
    const data = {
      analytics: Array.from(this.analytics.entries()),
      events: this.events,
      userAnalytics: this.userAnalytics,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import analytics data
   */
  importAnalytics(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      this.analytics = new Map(parsed.analytics || []);
      this.events = parsed.events || [];
      this.userAnalytics = parsed.userAnalytics || null;
      return true;
    } catch (error) {
      console.error('Error importing analytics:', error);
      return false;
    }
  }
}

// Export singleton instance
export const questionAnalyticsService = new QuestionAnalyticsService();
export default questionAnalyticsService;
