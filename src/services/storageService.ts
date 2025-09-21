import { UserProgress, Question, CodeExercise, LearningTrack, DifficultyLevel } from '../types';

// Storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: 'aiLearningTool_userProgress',
  USER_SETTINGS: 'aiLearningTool_userSettings',
  QUESTION_HISTORY: 'aiLearningTool_questionHistory',
  CODE_EXERCISE_HISTORY: 'aiLearningTool_codeExerciseHistory',
  CACHED_QUESTIONS: 'aiLearningTool_cachedQuestions',
  CACHED_EXERCISES: 'aiLearningTool_cachedExercises',
  LEARNING_SESSIONS: 'aiLearningTool_learningSessions',
  ACHIEVEMENTS: 'aiLearningTool_achievements',
  DAILY_GOALS: 'aiLearningTool_dailyGoals',
  STATISTICS: 'aiLearningTool_statistics',
  CUSTOM_QUESTIONS: 'aiLearningTool_customQuestions',
  CUSTOM_EXERCISES: 'aiLearningTool_customExercises',
  BOOKMARKS: 'aiLearningTool_bookmarks',
  NOTES: 'aiLearningTool_notes'
} as const;

// Storage configuration
const STORAGE_CONFIG = {
  MAX_CACHE_SIZE: 100, // Maximum number of items to cache
  CACHE_EXPIRY_MS: 24 * 60 * 60 * 1000, // 24 hours
  COMPRESSION_THRESHOLD: 1024, // Compress data larger than 1KB
  BACKUP_INTERVAL_MS: 60 * 60 * 1000, // Backup every hour
  MAX_BACKUPS: 5 // Maximum number of backups to keep
} as const;

interface StorageItem<T> {
  data: T;
  timestamp: number;
  version: string;
  compressed?: boolean;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
  accessCount: number;
  lastAccessed: number;
}

interface BackupItem {
  data: any;
  timestamp: number;
  version: string;
  size: number;
}

class StorageService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private compressionEnabled: boolean = true;
  private version: string = '1.0.0';

  constructor() {
    this.initializeStorage();
    this.setupPeriodicBackup();
    this.cleanupExpiredCache();
  }

  /**
   * Initialize storage and perform cleanup
   */
  private initializeStorage(): void {
    try {
      // Check if localStorage is available
      if (!this.isLocalStorageAvailable()) {
        console.warn('localStorage is not available. Some features may not work.');
        return;
      }

      // Clean up expired cache
      this.cleanupExpiredCache();
      
      // Migrate old data if needed
      this.migrateOldData();
      
      // Initialize default values
      this.initializeDefaultValues();
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Save user progress to localStorage
   */
  saveUserProgress(progress: UserProgress): boolean {
    try {
      const storageItem: StorageItem<UserProgress> = {
        data: progress,
        timestamp: Date.now(),
        version: this.version
      };

      const serialized = this.serializeData(storageItem);
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, serialized);
      
      // Update cache
      this.updateCache(STORAGE_KEYS.USER_PROGRESS, progress);
      
      return true;
    } catch (error) {
      console.error('Error saving user progress:', error);
      return false;
    }
  }

  /**
   * Load user progress from localStorage
   */
  loadUserProgress(): UserProgress | null {
    try {
      // Check cache first
      const cached = this.getFromCache<UserProgress>(STORAGE_KEYS.USER_PROGRESS);
      if (cached) {
        return cached;
      }

      const serialized = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (!serialized) {
        return null;
      }

      const storageItem = this.deserializeData<StorageItem<UserProgress>>(serialized);
      
      // Update cache
      this.updateCache(STORAGE_KEYS.USER_PROGRESS, storageItem.data);
      
      return storageItem.data;
    } catch (error) {
      console.error('Error loading user progress:', error);
      return null;
    }
  }

  /**
   * Save question history
   */
  saveQuestionHistory(questionId: string, result: any): boolean {
    try {
      const history = this.loadQuestionHistory();
      const newEntry = {
        questionId,
        result,
        timestamp: Date.now()
      };

      history.push(newEntry);
      
      // Keep only last 1000 entries
      if (history.length > 1000) {
        history.splice(0, history.length - 1000);
      }

      const storageItem: StorageItem<any[]> = {
        data: history,
        timestamp: Date.now(),
        version: this.version
      };

      const serialized = this.serializeData(storageItem);
      localStorage.setItem(STORAGE_KEYS.QUESTION_HISTORY, serialized);
      
      return true;
    } catch (error) {
      console.error('Error saving question history:', error);
      return false;
    }
  }

  /**
   * Load question history
   */
  loadQuestionHistory(): any[] {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.QUESTION_HISTORY);
      if (!serialized) {
        return [];
      }

      const storageItem = this.deserializeData<StorageItem<any[]>>(serialized);
      return storageItem.data || [];
    } catch (error) {
      console.error('Error loading question history:', error);
      return [];
    }
  }

  /**
   * Save code exercise history
   */
  saveCodeExerciseHistory(exerciseId: string, result: any): boolean {
    try {
      const history = this.loadCodeExerciseHistory();
      const newEntry = {
        exerciseId,
        result,
        timestamp: Date.now()
      };

      history.push(newEntry);
      
      // Keep only last 500 entries
      if (history.length > 500) {
        history.splice(0, history.length - 500);
      }

      const storageItem: StorageItem<any[]> = {
        data: history,
        timestamp: Date.now(),
        version: this.version
      };

      const serialized = this.serializeData(storageItem);
      localStorage.setItem(STORAGE_KEYS.CODE_EXERCISE_HISTORY, serialized);
      
      return true;
    } catch (error) {
      console.error('Error saving code exercise history:', error);
      return false;
    }
  }

  /**
   * Load code exercise history
   */
  loadCodeExerciseHistory(): any[] {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.CODE_EXERCISE_HISTORY);
      if (!serialized) {
        return [];
      }

      const storageItem = this.deserializeData<StorageItem<any[]>>(serialized);
      return storageItem.data || [];
    } catch (error) {
      console.error('Error loading code exercise history:', error);
      return [];
    }
  }

  /**
   * Cache questions for offline use
   */
  cacheQuestions(questions: Question[]): boolean {
    try {
      const storageItem: StorageItem<Question[]> = {
        data: questions,
        timestamp: Date.now(),
        version: this.version
      };

      const serialized = this.serializeData(storageItem);
      localStorage.setItem(STORAGE_KEYS.CACHED_QUESTIONS, serialized);
      
      // Update cache
      this.updateCache(STORAGE_KEYS.CACHED_QUESTIONS, questions);
      
      return true;
    } catch (error) {
      console.error('Error caching questions:', error);
      return false;
    }
  }

  /**
   * Load cached questions
   */
  loadCachedQuestions(): Question[] {
    try {
      // Check cache first
      const cached = this.getFromCache<Question[]>(STORAGE_KEYS.CACHED_QUESTIONS);
      if (cached) {
        return cached;
      }

      const serialized = localStorage.getItem(STORAGE_KEYS.CACHED_QUESTIONS);
      if (!serialized) {
        return [];
      }

      const storageItem = this.deserializeData<StorageItem<Question[]>>(serialized);
      
      // Update cache
      this.updateCache(STORAGE_KEYS.CACHED_QUESTIONS, storageItem.data);
      
      return storageItem.data || [];
    } catch (error) {
      console.error('Error loading cached questions:', error);
      return [];
    }
  }

  /**
   * Cache code exercises for offline use
   */
  cacheCodeExercises(exercises: CodeExercise[]): boolean {
    try {
      const storageItem: StorageItem<CodeExercise[]> = {
        data: exercises,
        timestamp: Date.now(),
        version: this.version
      };

      const serialized = this.serializeData(storageItem);
      localStorage.setItem(STORAGE_KEYS.CACHED_EXERCISES, serialized);
      
      // Update cache
      this.updateCache(STORAGE_KEYS.CACHED_EXERCISES, exercises);
      
      return true;
    } catch (error) {
      console.error('Error caching code exercises:', error);
      return false;
    }
  }

  /**
   * Load cached code exercises
   */
  loadCachedCodeExercises(): CodeExercise[] {
    try {
      // Check cache first
      const cached = this.getFromCache<CodeExercise[]>(STORAGE_KEYS.CACHED_EXERCISES);
      if (cached) {
        return cached;
      }

      const serialized = localStorage.getItem(STORAGE_KEYS.CACHED_EXERCISES);
      if (!serialized) {
        return [];
      }

      const storageItem = this.deserializeData<StorageItem<CodeExercise[]>>(serialized);
      
      // Update cache
      this.updateCache(STORAGE_KEYS.CACHED_EXERCISES, storageItem.data);
      
      return storageItem.data || [];
    } catch (error) {
      console.error('Error loading cached code exercises:', error);
      return [];
    }
  }

  /**
   * Save user settings
   */
  saveUserSettings(settings: any): boolean {
    try {
      const storageItem: StorageItem<any> = {
        data: settings,
        timestamp: Date.now(),
        version: this.version
      };

      const serialized = this.serializeData(storageItem);
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, serialized);
      
      return true;
    } catch (error) {
      console.error('Error saving user settings:', error);
      return false;
    }
  }

  /**
   * Load user settings
   */
  loadUserSettings(): any {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (!serialized) {
        return this.getDefaultSettings();
      }

      const storageItem = this.deserializeData<StorageItem<any>>(serialized);
      return storageItem.data || this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading user settings:', error);
      return this.getDefaultSettings();
    }
  }

  /**
   * Get default settings
   */
  private getDefaultSettings(): any {
    return {
      theme: 'dark',
      language: 'en',
      notifications: true,
      soundEnabled: true,
      autoSave: true,
      difficulty: 'beginner',
      track: 'html',
      dailyGoal: {
        questions: 5,
        time: 15,
        xp: 50
      }
    };
  }

  /**
   * Save learning sessions
   */
  saveLearningSession(session: any): boolean {
    try {
      const sessions = this.loadLearningSessions();
      sessions.push(session);
      
      // Keep only last 100 sessions
      if (sessions.length > 100) {
        sessions.splice(0, sessions.length - 100);
      }

      const storageItem: StorageItem<any[]> = {
        data: sessions,
        timestamp: Date.now(),
        version: this.version
      };

      const serialized = this.serializeData(storageItem);
      localStorage.setItem(STORAGE_KEYS.LEARNING_SESSIONS, serialized);
      
      return true;
    } catch (error) {
      console.error('Error saving learning session:', error);
      return false;
    }
  }

  /**
   * Load learning sessions
   */
  loadLearningSessions(): any[] {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.LEARNING_SESSIONS);
      if (!serialized) {
        return [];
      }

      const storageItem = this.deserializeData<StorageItem<any[]>>(serialized);
      return storageItem.data || [];
    } catch (error) {
      console.error('Error loading learning sessions:', error);
      return [];
    }
  }

  /**
   * Save bookmarks
   */
  saveBookmarks(bookmarks: any[]): boolean {
    try {
      const storageItem: StorageItem<any[]> = {
        data: bookmarks,
        timestamp: Date.now(),
        version: this.version
      };

      const serialized = this.serializeData(storageItem);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, serialized);
      
      return true;
    } catch (error) {
      console.error('Error saving bookmarks:', error);
      return false;
    }
  }

  /**
   * Load bookmarks
   */
  loadBookmarks(): any[] {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (!serialized) {
        return [];
      }

      const storageItem = this.deserializeData<StorageItem<any[]>>(serialized);
      return storageItem.data || [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  /**
   * Save notes
   */
  saveNotes(notes: any[]): boolean {
    try {
      const storageItem: StorageItem<any[]> = {
        data: notes,
        timestamp: Date.now(),
        version: this.version
      };

      const serialized = this.serializeData(storageItem);
      localStorage.setItem(STORAGE_KEYS.NOTES, serialized);
      
      return true;
    } catch (error) {
      console.error('Error saving notes:', error);
      return false;
    }
  }

  /**
   * Load notes
   */
  loadNotes(): any[] {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (!serialized) {
        return [];
      }

      const storageItem = this.deserializeData<StorageItem<any[]>>(serialized);
      return storageItem.data || [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  /**
   * Clear all data
   */
  clearAllData(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Clear cache
      this.cache.clear();
      
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }

  /**
   * Clear specific data type
   */
  clearData(type: keyof typeof STORAGE_KEYS): boolean {
    try {
      localStorage.removeItem(STORAGE_KEYS[type]);
      this.cache.delete(STORAGE_KEYS[type]);
      return true;
    } catch (error) {
      console.error(`Error clearing ${type} data:`, error);
      return false;
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): {
    totalSize: number;
    itemCount: number;
    items: Array<{ key: string; size: number; lastModified: number }>;
  } {
    const items: Array<{ key: string; size: number; lastModified: number }> = [];
    let totalSize = 0;
    let itemCount = 0;

    try {
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        const value = localStorage.getItem(key);
        if (value) {
          const size = new Blob([value]).size;
          items.push({
            key: name,
            size,
            lastModified: Date.now() // We don't have access to actual modification time
          });
          totalSize += size;
          itemCount++;
        }
      });
    } catch (error) {
      console.error('Error getting storage stats:', error);
    }

    return {
      totalSize,
      itemCount,
      items: items.sort((a, b) => b.size - a.size)
    };
  }

  /**
   * Export all data
   */
  exportAllData(): string {
    try {
      const exportData: any = {};
      
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        const value = localStorage.getItem(key);
        if (value) {
          exportData[name] = value;
        }
      });

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '{}';
    }
  }

  /**
   * Import data
   */
  importData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      
      Object.entries(importData).forEach(([name, value]) => {
        const key = STORAGE_KEYS[name as keyof typeof STORAGE_KEYS];
        if (key && typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      });

      // Clear cache to force reload
      this.cache.clear();
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Serialize data with optional compression
   */
  private serializeData<T>(data: T): string {
    try {
      const json = JSON.stringify(data);
      
      if (this.compressionEnabled && json.length > STORAGE_CONFIG.COMPRESSION_THRESHOLD) {
        // Simple compression (in a real app, you'd use a proper compression library)
        return btoa(json);
      }
      
      return json;
    } catch (error) {
      console.error('Error serializing data:', error);
      return JSON.stringify(data);
    }
  }

  /**
   * Deserialize data with optional decompression
   */
  private deserializeData<T>(data: string): T {
    try {
      // Try to parse as JSON first
      return JSON.parse(data);
    } catch (error) {
      try {
        // Try to decompress
        return JSON.parse(atob(data));
      } catch (decompressError) {
        console.error('Error deserializing data:', error);
        throw error;
      }
    }
  }

  /**
   * Update cache
   */
  private updateCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + STORAGE_CONFIG.CACHE_EXPIRY_MS,
      accessCount: (this.cache.get(key)?.accessCount || 0) + 1,
      lastAccessed: Date.now()
    });
  }

  /**
   * Get from cache
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    cached.accessCount++;
    cached.lastAccessed = Date.now();
    return cached.data as T;
  }

  /**
   * Clean up expired cache
   */
  private cleanupExpiredCache(): void {
    const now = Date.now();
    for (const [key, item] of Array.from(this.cache.entries())) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Setup periodic backup
   */
  private setupPeriodicBackup(): void {
    setInterval(() => {
      this.createBackup();
    }, STORAGE_CONFIG.BACKUP_INTERVAL_MS);
  }

  /**
   * Create backup
   */
  private createBackup(): void {
    try {
      const backupData = this.exportAllData();
      const backup: BackupItem = {
        data: backupData,
        timestamp: Date.now(),
        version: this.version,
        size: new Blob([backupData]).size
      };

      const backups = this.loadBackups();
      backups.push(backup);
      
      // Keep only last N backups
      if (backups.length > STORAGE_CONFIG.MAX_BACKUPS) {
        backups.splice(0, backups.length - STORAGE_CONFIG.MAX_BACKUPS);
      }

      localStorage.setItem('aiLearningTool_backups', JSON.stringify(backups));
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }

  /**
   * Load backups
   */
  private loadBackups(): BackupItem[] {
    try {
      const backups = localStorage.getItem('aiLearningTool_backups');
      return backups ? JSON.parse(backups) : [];
    } catch (error) {
      console.error('Error loading backups:', error);
      return [];
    }
  }

  /**
   * Migrate old data
   */
  private migrateOldData(): void {
    // Add migration logic here for future versions
    // For now, just ensure we have the current version
  }

  /**
   * Initialize default values
   */
  private initializeDefaultValues(): void {
    // Initialize default settings if they don't exist
    if (!localStorage.getItem(STORAGE_KEYS.USER_SETTINGS)) {
      this.saveUserSettings(this.getDefaultSettings());
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService;