import { UserProgress, LearningTrack, QuestionAttempt, Achievement } from '../types';
import { DailyProgress } from './dailyGoalService';
import { StreakData } from './streakService';

export interface StoredData {
  userProgress: UserProgress;
  dailyProgress: DailyProgress;
  streakData: StreakData;
  questionAttempts: QuestionAttempt[];
  achievements: Achievement[];
  settings: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    dailyGoal: number;
    lastBackup: string;
  };
}

export interface StorageStats {
  totalSize: number;
  lastUpdated: string;
  dataIntegrity: boolean;
  backupCount: number;
}

export class StorageService {
  private static readonly STORAGE_KEYS = {
    USER_PROGRESS: 'ai-learning-user-progress',
    DAILY_PROGRESS: 'ai-learning-daily-progress',
    STREAK_DATA: 'ai-learning-streak-data',
    QUESTION_ATTEMPTS: 'ai-learning-question-attempts',
    ACHIEVEMENTS: 'ai-learning-achievements',
    SETTINGS: 'ai-learning-settings',
    BACKUP_PREFIX: 'ai-learning-backup-'
  };

  private static readonly MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
  private static readonly BACKUP_RETENTION_DAYS = 30;

  /**
   * Save user progress to localStorage
   */
  static saveUserProgress(userProgress: UserProgress): boolean {
    try {
      const serialized = JSON.stringify(userProgress);
      localStorage.setItem(this.STORAGE_KEYS.USER_PROGRESS, serialized);
      this.updateLastBackup();
      return true;
    } catch (error) {
      console.error('Failed to save user progress:', error);
      return false;
    }
  }

  /**
   * Load user progress from localStorage
   */
  static loadUserProgress(): UserProgress | null {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEYS.USER_PROGRESS);
      if (!serialized) return null;
      
      const userProgress = JSON.parse(serialized);
      
      // Validate the data structure
      if (this.validateUserProgress(userProgress)) {
        return userProgress;
      } else {
        console.warn('Invalid user progress data, using defaults');
        return null;
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
      return null;
    }
  }

  /**
   * Save daily progress to localStorage
   */
  static saveDailyProgress(dailyProgress: DailyProgress): boolean {
    try {
      const serialized = JSON.stringify(dailyProgress);
      localStorage.setItem(this.STORAGE_KEYS.DAILY_PROGRESS, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save daily progress:', error);
      return false;
    }
  }

  /**
   * Load daily progress from localStorage
   */
  static loadDailyProgress(): DailyProgress | null {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEYS.DAILY_PROGRESS);
      if (!serialized) return null;
      
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load daily progress:', error);
      return null;
    }
  }

  /**
   * Save streak data to localStorage
   */
  static saveStreakData(streakData: StreakData): boolean {
    try {
      const serialized = JSON.stringify(streakData);
      localStorage.setItem(this.STORAGE_KEYS.STREAK_DATA, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save streak data:', error);
      return false;
    }
  }

  /**
   * Load streak data from localStorage
   */
  static loadStreakData(): StreakData | null {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEYS.STREAK_DATA);
      if (!serialized) return null;
      
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load streak data:', error);
      return null;
    }
  }

  /**
   * Save question attempts to localStorage
   */
  static saveQuestionAttempts(attempts: QuestionAttempt[]): boolean {
    try {
      // Keep only last 1000 attempts to prevent storage bloat
      const limitedAttempts = attempts.slice(-1000);
      const serialized = JSON.stringify(limitedAttempts);
      localStorage.setItem(this.STORAGE_KEYS.QUESTION_ATTEMPTS, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save question attempts:', error);
      return false;
    }
  }

  /**
   * Load question attempts from localStorage
   */
  static loadQuestionAttempts(): QuestionAttempt[] {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEYS.QUESTION_ATTEMPTS);
      if (!serialized) return [];
      
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load question attempts:', error);
      return [];
    }
  }

  /**
   * Save achievements to localStorage
   */
  static saveAchievements(achievements: Achievement[]): boolean {
    try {
      const serialized = JSON.stringify(achievements);
      localStorage.setItem(this.STORAGE_KEYS.ACHIEVEMENTS, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save achievements:', error);
      return false;
    }
  }

  /**
   * Load achievements from localStorage
   */
  static loadAchievements(): Achievement[] {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEYS.ACHIEVEMENTS);
      if (!serialized) return [];
      
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load achievements:', error);
      return [];
    }
  }

  /**
   * Save all data to localStorage
   */
  static saveAllData(data: StoredData): boolean {
    try {
      const success = 
        this.saveUserProgress(data.userProgress) &&
        this.saveDailyProgress(data.dailyProgress) &&
        this.saveStreakData(data.streakData) &&
        this.saveQuestionAttempts(data.questionAttempts) &&
        this.saveAchievements(data.achievements) &&
        this.saveSettings(data.settings);
      
      if (success) {
        this.createBackup(data);
      }
      
      return success;
    } catch (error) {
      console.error('Failed to save all data:', error);
      return false;
    }
  }

  /**
   * Load all data from localStorage
   */
  static loadAllData(): StoredData | null {
    try {
      const userProgress = this.loadUserProgress();
      const dailyProgress = this.loadDailyProgress();
      const streakData = this.loadStreakData();
      const questionAttempts = this.loadQuestionAttempts();
      const achievements = this.loadAchievements();
      const settings = this.loadSettings();

      if (!userProgress) return null;

      return {
        userProgress,
        dailyProgress: dailyProgress || this.createDefaultDailyProgress(),
        streakData: streakData || this.createDefaultStreakData(),
        questionAttempts,
        achievements,
        settings
      };
    } catch (error) {
      console.error('Failed to load all data:', error);
      return null;
    }
  }

  /**
   * Create a backup of current data
   */
  static createBackup(data: StoredData): string | null {
    try {
      const timestamp = new Date().toISOString();
      const backupKey = `${this.STORAGE_KEYS.BACKUP_PREFIX}${timestamp}`;
      const serialized = JSON.stringify(data);
      
      localStorage.setItem(backupKey, serialized);
      this.cleanupOldBackups();
      
      return backupKey;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return null;
    }
  }

  /**
   * Restore data from backup
   */
  static restoreFromBackup(backupKey: string): boolean {
    try {
      const serialized = localStorage.getItem(backupKey);
      if (!serialized) return false;
      
      const data: StoredData = JSON.parse(serialized);
      return this.saveAllData(data);
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return false;
    }
  }

  /**
   * Get list of available backups
   */
  static getAvailableBackups(): string[] {
    const backups: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_KEYS.BACKUP_PREFIX)) {
        backups.push(key);
      }
    }
    
    return backups.sort().reverse(); // Most recent first
  }

  /**
   * Get storage statistics
   */
  static getStorageStats(): StorageStats {
    let totalSize = 0;
    let lastUpdated = '';
    let dataIntegrity = true;
    let backupCount = 0;

    try {
      // Calculate total size
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ai-learning-')) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
            
            if (key === this.STORAGE_KEYS.USER_PROGRESS) {
              lastUpdated = new Date().toISOString();
            }
            
            if (key.startsWith(this.STORAGE_KEYS.BACKUP_PREFIX)) {
              backupCount++;
            }
          }
        }
      }

      // Check data integrity
      const userProgress = this.loadUserProgress();
      dataIntegrity = userProgress !== null && this.validateUserProgress(userProgress);
    } catch (error) {
      console.error('Failed to calculate storage stats:', error);
      dataIntegrity = false;
    }

    return {
      totalSize,
      lastUpdated,
      dataIntegrity,
      backupCount
    };
  }

  /**
   * Clear all stored data
   */
  static clearAllData(): boolean {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ai-learning-')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  }

  /**
   * Export data as JSON string
   */
  static exportData(): string | null {
    try {
      const data = this.loadAllData();
      if (!data) return null;
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  /**
   * Import data from JSON string
   */
  static importData(jsonString: string): boolean {
    try {
      const data: StoredData = JSON.parse(jsonString);
      
      if (this.validateStoredData(data)) {
        return this.saveAllData(data);
      } else {
        console.error('Invalid data format');
        return false;
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Validate user progress data structure
   */
  private static validateUserProgress(userProgress: any): boolean {
    return (
      userProgress &&
      typeof userProgress.userId === 'string' &&
      typeof userProgress.totalXP === 'number' &&
      typeof userProgress.currentStreak === 'number' &&
      userProgress.tracks &&
      userProgress.tracks.html &&
      userProgress.tracks.css &&
      userProgress.tracks.javascript
    );
  }

  /**
   * Validate stored data structure
   */
  private static validateStoredData(data: any): boolean {
    return (
      data &&
      this.validateUserProgress(data.userProgress) &&
      Array.isArray(data.questionAttempts) &&
      Array.isArray(data.achievements)
    );
  }

  /**
   * Create default daily progress
   */
  private static createDefaultDailyProgress(): DailyProgress {
    return {
      date: new Date().toISOString().split('T')[0],
      totalXP: 0,
      questionsAnswered: 0,
      timeSpent: 0,
      tracks: {
        html: { xp: 0, questions: 0, timeSpent: 0 },
        css: { xp: 0, questions: 0, timeSpent: 0 },
        javascript: { xp: 0, questions: 0, timeSpent: 0 }
      },
      goals: [],
      streakMaintained: false,
      bonusXP: 0
    };
  }

  /**
   * Create default streak data
   */
  private static createDefaultStreakData(): StreakData {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date().toISOString().split('T')[0],
      streakHistory: []
    };
  }

  /**
   * Save settings to localStorage
   */
  private static saveSettings(settings: any): boolean {
    try {
      const serialized = JSON.stringify(settings);
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  /**
   * Load settings from localStorage
   */
  private static loadSettings(): any {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      if (!serialized) {
        return {
          theme: 'auto',
          notifications: true,
          dailyGoal: 50,
          lastBackup: new Date().toISOString()
        };
      }
      
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {
        theme: 'auto',
        notifications: true,
        dailyGoal: 50,
        lastBackup: new Date().toISOString()
      };
    }
  }

  /**
   * Update last backup timestamp
   */
  private static updateLastBackup(): void {
    try {
      const settings = this.loadSettings();
      settings.lastBackup = new Date().toISOString();
      this.saveSettings(settings);
    } catch (error) {
      console.error('Failed to update last backup:', error);
    }
  }

  /**
   * Clean up old backups
   */
  private static cleanupOldBackups(): void {
    try {
      const backups = this.getAvailableBackups();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.BACKUP_RETENTION_DAYS);
      
      backups.forEach(backupKey => {
        const timestamp = backupKey.replace(this.STORAGE_KEYS.BACKUP_PREFIX, '');
        const backupDate = new Date(timestamp);
        
        if (backupDate < cutoffDate) {
          localStorage.removeItem(backupKey);
        }
      });
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }
}

export default StorageService;
