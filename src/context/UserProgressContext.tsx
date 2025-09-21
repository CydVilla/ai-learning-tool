import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  UserProgress, 
  UserProgressContextType, 
  LearningTrack, 
  QuestionAttempt, 
  UserSettings,
  TrackProgress,
  Achievement,
  UserStatistics
} from '../types';
import { StreakService } from '../services/streakService';
import { storageService } from '../services/storageService';

// Initial state
const initialUserProgress: UserProgress = {
  userId: 'default-user',
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  dailyGoal: 50,
  lastActivityDate: new Date().toISOString().split('T')[0],
  tracks: {
    html: {
      track: 'html',
      currentLevel: 1,
      totalXP: 0,
      completedQuestions: [],
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date().toISOString().split('T')[0],
      accuracy: 0,
      timeSpent: 0
    },
    css: {
      track: 'css',
      currentLevel: 1,
      totalXP: 0,
      completedQuestions: [],
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date().toISOString().split('T')[0],
      accuracy: 0,
      timeSpent: 0
    },
    javascript: {
      track: 'javascript',
      currentLevel: 1,
      totalXP: 0,
      completedQuestions: [],
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date().toISOString().split('T')[0],
      accuracy: 0,
      timeSpent: 0
    }
  },
  achievements: [],
  statistics: {
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    averageAccuracy: 0,
    totalTimeSpent: 0,
    favoriteTrack: 'html',
    questionsPerDay: 0,
    averageSessionLength: 0
  }
};

// Action types
type UserProgressAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_PROGRESS'; payload: UserProgress }
  | { type: 'UPDATE_TRACK_PROGRESS'; payload: { track: LearningTrack; questionId: string; isCorrect: boolean; timeSpent: number; xpEarned: number } }
  | { type: 'UPDATE_STREAK' }
  | { type: 'RESET_PROGRESS' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement };

// State interface
interface UserProgressState {
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
}

// Reducer
const userProgressReducer = (state: UserProgressState, action: UserProgressAction): UserProgressState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'LOAD_PROGRESS':
      return { ...state, userProgress: action.payload, isLoading: false, error: null };
    
    case 'UPDATE_TRACK_PROGRESS': {
      if (!state.userProgress) return state;
      
      const { track, questionId, isCorrect, timeSpent, xpEarned } = action.payload;
      const trackProgress = state.userProgress.tracks[track];
      
      // Update track progress
      const updatedTrackProgress: TrackProgress = {
        ...trackProgress,
        totalXP: trackProgress.totalXP + xpEarned,
        completedQuestions: [...trackProgress.completedQuestions, questionId],
        currentStreak: isCorrect ? trackProgress.currentStreak + 1 : 0,
        longestStreak: Math.max(trackProgress.longestStreak, isCorrect ? trackProgress.currentStreak + 1 : trackProgress.currentStreak),
        lastActivityDate: new Date().toISOString().split('T')[0],
        timeSpent: trackProgress.timeSpent + timeSpent,
        accuracy: calculateAccuracy(trackProgress, isCorrect)
      };
      
      // Update overall progress
      const updatedProgress: UserProgress = {
        ...state.userProgress,
        totalXP: state.userProgress.totalXP + xpEarned,
        currentStreak: isCorrect ? state.userProgress.currentStreak + 1 : 0,
        longestStreak: Math.max(state.userProgress.longestStreak, isCorrect ? state.userProgress.currentStreak + 1 : state.userProgress.currentStreak),
        lastActivityDate: new Date().toISOString().split('T')[0],
        tracks: {
          ...state.userProgress.tracks,
          [track]: updatedTrackProgress
        },
        statistics: updateStatistics(state.userProgress.statistics, isCorrect, timeSpent)
      };
      
      return { ...state, userProgress: updatedProgress };
    }
    
    case 'UPDATE_STREAK': {
      if (!state.userProgress) return state;
      
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = state.userProgress.lastActivityDate;
      
      // Check if streak should be maintained
      const shouldMaintainStreak = isConsecutiveDay(lastActivity, today);
      
      if (!shouldMaintainStreak) {
        const updatedProgress: UserProgress = {
          ...state.userProgress,
          currentStreak: 0,
          tracks: {
            html: { ...state.userProgress.tracks.html, currentStreak: 0 },
            css: { ...state.userProgress.tracks.css, currentStreak: 0 },
            javascript: { ...state.userProgress.tracks.javascript, currentStreak: 0 }
          }
        };
        return { ...state, userProgress: updatedProgress };
      }
      
      return state;
    }
    
    case 'RESET_PROGRESS':
      return { ...state, userProgress: initialUserProgress };
    
    case 'UPDATE_SETTINGS': {
      if (!state.userProgress) return state;
      
      const updatedProgress: UserProgress = {
        ...state.userProgress,
        dailyGoal: action.payload.dailyGoal || state.userProgress.dailyGoal
      };
      
      return { ...state, userProgress: updatedProgress };
    }
    
    case 'UNLOCK_ACHIEVEMENT': {
      if (!state.userProgress) return state;
      
      const updatedProgress: UserProgress = {
        ...state.userProgress,
        achievements: [...state.userProgress.achievements, action.payload]
      };
      
      return { ...state, userProgress: updatedProgress };
    }
    
    default:
      return state;
  }
};

// Helper functions
const calculateAccuracy = (trackProgress: TrackProgress, isCorrect: boolean): number => {
  const totalQuestions = trackProgress.completedQuestions.length + 1;
  const correctAnswers = trackProgress.completedQuestions.length * (trackProgress.accuracy / 100) + (isCorrect ? 1 : 0);
  return Math.round((correctAnswers / totalQuestions) * 100);
};

const updateStatistics = (statistics: any, isCorrect: boolean, timeSpent: number) => {
  const totalAnswered = statistics.totalQuestionsAnswered + 1;
  const totalCorrect = statistics.totalCorrectAnswers + (isCorrect ? 1 : 0);
  
  return {
    ...statistics,
    totalQuestionsAnswered: totalAnswered,
    totalCorrectAnswers: totalCorrect,
    averageAccuracy: Math.round((totalCorrect / totalAnswered) * 100),
    totalTimeSpent: statistics.totalTimeSpent + timeSpent
  };
};

const isConsecutiveDay = (lastDate: string, currentDate: string): boolean => {
  const last = new Date(lastDate);
  const current = new Date(currentDate);
  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

// Context
const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

// Provider component
interface UserProgressProviderProps {
  children: ReactNode;
}

export const UserProgressProvider: React.FC<UserProgressProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userProgressReducer, {
    userProgress: null,
    isLoading: true,
    error: null
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = storageService.loadUserProgress();
        if (savedProgress) {
          dispatch({ type: 'LOAD_PROGRESS', payload: savedProgress });
        } else {
          dispatch({ type: 'LOAD_PROGRESS', payload: initialUserProgress });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load progress' });
      }
    };

    loadProgress();
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (state.userProgress) {
      try {
        storageService.saveUserProgress(state.userProgress);
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  }, [state.userProgress]);

  // Context value
  const contextValue: UserProgressContextType = {
    userProgress: state.userProgress,
    isLoading: state.isLoading,
    error: state.error,
    
    updateProgress: (track: LearningTrack, questionId: string, isCorrect: boolean, timeSpent: number) => {
      const xpEarned = isCorrect ? 10 : 0; // Base XP for correct answers
      dispatch({ 
        type: 'UPDATE_TRACK_PROGRESS', 
        payload: { track, questionId, isCorrect, timeSpent, xpEarned } 
      });
    },
    
    completeQuestion: (questionId: string, attempt: QuestionAttempt) => {
      // This would be called after AI feedback is received
      const track = getTrackFromQuestionId(questionId); // Helper function needed
      dispatch({ 
        type: 'UPDATE_TRACK_PROGRESS', 
        payload: { 
          track, 
          questionId, 
          isCorrect: attempt.isCorrect, 
          timeSpent: attempt.timeSpent / 60, // Convert to minutes
          xpEarned: attempt.isCorrect ? 10 : 0 
        } 
      });
    },
    
    startSession: (track: LearningTrack) => {
      // Generate session ID
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return sessionId;
    },
    
    endSession: (sessionId: string) => {
      // Session tracking logic would go here
      console.log('Session ended:', sessionId);
    },
    
    updateStreak: () => {
      // Check if streak should be maintained based on last activity
      if (state.userProgress) {
        const shouldMaintain = StreakService.shouldMaintainStreak(state.userProgress.lastActivityDate);
        if (!shouldMaintain) {
          dispatch({ type: 'UPDATE_STREAK' });
        }
      }
    },
    
    resetProgress: () => {
      dispatch({ type: 'RESET_PROGRESS' });
    },
    
    updateSettings: (settings: Partial<UserSettings>) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    },
    
    getTrackProgress: (track: LearningTrack) => {
      return state.userProgress?.tracks[track] || null;
    },
    
    getCurrentStreak: () => {
      return state.userProgress?.currentStreak || 0;
    },
    
    getTotalXP: () => {
      return state.userProgress?.totalXP || 0;
    },
    
    getDailyProgress: () => {
      if (!state.userProgress) return 0;
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = state.userProgress.lastActivityDate;
      
      if (lastActivity === today) {
        // Calculate XP earned today (simplified)
        return Math.min(state.userProgress.totalXP % 100, state.userProgress.dailyGoal);
      }
      
      return 0;
    },
    
    isDailyGoalMet: () => {
      if (!state.userProgress) return false;
      return contextValue.getDailyProgress() >= state.userProgress.dailyGoal;
    }
  };

  return (
    <UserProgressContext.Provider value={contextValue}>
      {children}
    </UserProgressContext.Provider>
  );
};

// Helper function to get track from question ID (simplified)
const getTrackFromQuestionId = (questionId: string): LearningTrack => {
  if (questionId.startsWith('html_')) return 'html';
  if (questionId.startsWith('css_')) return 'css';
  if (questionId.startsWith('javascript_') || questionId.startsWith('js_')) return 'javascript';
  return 'html'; // default
};

// Custom hook
export const useUserProgress = (): UserProgressContextType => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};

export default UserProgressContext;
