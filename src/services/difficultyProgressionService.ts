import { LearningTrack, DifficultyLevel, Question } from '../types';

export interface DifficultyProgression {
  track: LearningTrack;
  currentLevel: DifficultyLevel;
  nextLevel: DifficultyLevel | null;
  progressToNext: number;
  questionsCompleted: number;
  questionsRequired: number;
  unlockedLevels: DifficultyLevel[];
  lockedLevels: DifficultyLevel[];
}

export interface LevelRequirement {
  level: DifficultyLevel;
  questionsRequired: number;
  accuracyRequired: number;
  timeLimit?: number;
  description: string;
  rewards: {
    xp: number;
    unlocks: string[];
  };
}

export interface ProgressionMilestone {
  id: string;
  title: string;
  description: string;
  requirement: {
    level: DifficultyLevel;
    questions: number;
    accuracy: number;
  };
  reward: {
    xp: number;
    title: string;
    description: string;
  };
  completed: boolean;
  progress: number;
}

export class DifficultyProgressionService {
  // Level requirements for each track
  private static readonly LEVEL_REQUIREMENTS: Record<LearningTrack, Record<DifficultyLevel, LevelRequirement>> = {
    html: {
      beginner: {
        level: 'beginner',
        questionsRequired: 0,
        accuracyRequired: 0,
        description: 'Start your HTML journey with basic concepts',
        rewards: { xp: 10, unlocks: ['HTML Basics', 'Tag Structure'] }
      },
      intermediate: {
        level: 'intermediate',
        questionsRequired: 15,
        accuracyRequired: 70,
        timeLimit: 30,
        description: 'Master HTML structure and semantic elements',
        rewards: { xp: 25, unlocks: ['Forms', 'Tables', 'Semantic HTML'] }
      },
      advanced: {
        level: 'advanced',
        questionsRequired: 35,
        accuracyRequired: 85,
        timeLimit: 20,
        description: 'Advanced HTML features and accessibility',
        rewards: { xp: 50, unlocks: ['Accessibility', 'SEO', 'Advanced Forms'] }
      }
    },
    css: {
      beginner: {
        level: 'beginner',
        questionsRequired: 0,
        accuracyRequired: 0,
        description: 'Learn CSS fundamentals and styling',
        rewards: { xp: 10, unlocks: ['CSS Basics', 'Selectors', 'Properties'] }
      },
      intermediate: {
        level: 'intermediate',
        questionsRequired: 20,
        accuracyRequired: 75,
        timeLimit: 25,
        description: 'Layout systems and responsive design',
        rewards: { xp: 30, unlocks: ['Flexbox', 'Grid', 'Responsive Design'] }
      },
      advanced: {
        level: 'advanced',
        questionsRequired: 45,
        accuracyRequired: 90,
        timeLimit: 15,
        description: 'Advanced CSS techniques and animations',
        rewards: { xp: 60, unlocks: ['Animations', 'Transforms', 'Advanced Selectors'] }
      }
    },
    javascript: {
      beginner: {
        level: 'beginner',
        questionsRequired: 0,
        accuracyRequired: 0,
        description: 'JavaScript fundamentals and syntax',
        rewards: { xp: 15, unlocks: ['Variables', 'Functions', 'Control Flow'] }
      },
      intermediate: {
        level: 'intermediate',
        questionsRequired: 25,
        accuracyRequired: 80,
        timeLimit: 20,
        description: 'DOM manipulation and event handling',
        rewards: { xp: 40, unlocks: ['DOM API', 'Events', 'Async Programming'] }
      },
      advanced: {
        level: 'advanced',
        questionsRequired: 55,
        accuracyRequired: 90,
        timeLimit: 15,
        description: 'Advanced JavaScript concepts and modern features',
        rewards: { xp: 75, unlocks: ['ES6+', 'Modules', 'Advanced Patterns'] }
      }
    }
  };

  // Track prerequisites
  private static readonly TRACK_PREREQUISITES: Record<LearningTrack, LearningTrack[]> = {
    html: [],
    css: ['html'],
    javascript: ['html', 'css']
  };

  // Level progression order
  private static readonly LEVEL_ORDER: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

  /**
   * Get current difficulty progression for a track
   */
  static getDifficultyProgression(
    track: LearningTrack,
    questionsCompleted: number,
    accuracy: number,
    timeSpent: number
  ): DifficultyProgression {
    const requirements = this.LEVEL_REQUIREMENTS[track];
    const currentLevel = this.getCurrentLevel(track, questionsCompleted, accuracy);
    const nextLevel = this.getNextLevel(currentLevel);
    const progressToNext = this.calculateProgressToNext(track, currentLevel, questionsCompleted, accuracy);
    
    const unlockedLevels = this.getUnlockedLevels(track, questionsCompleted, accuracy);
    const lockedLevels = this.getLockedLevels(track, questionsCompleted, accuracy);

    return {
      track,
      currentLevel,
      nextLevel,
      progressToNext,
      questionsCompleted,
      questionsRequired: requirements[currentLevel].questionsRequired,
      unlockedLevels,
      lockedLevels
    };
  }

  /**
   * Get current difficulty level based on progress
   */
  private static getCurrentLevel(track: LearningTrack, questionsCompleted: number, accuracy: number): DifficultyLevel {
    const requirements = this.LEVEL_REQUIREMENTS[track];
    
    // Check advanced level
    if (questionsCompleted >= requirements.advanced.questionsRequired && 
        accuracy >= requirements.advanced.accuracyRequired) {
      return 'advanced';
    }
    
    // Check intermediate level
    if (questionsCompleted >= requirements.intermediate.questionsRequired && 
        accuracy >= requirements.intermediate.accuracyRequired) {
      return 'intermediate';
    }
    
    // Default to beginner
    return 'beginner';
  }

  /**
   * Get next difficulty level
   */
  private static getNextLevel(currentLevel: DifficultyLevel): DifficultyLevel | null {
    const currentIndex = this.LEVEL_ORDER.indexOf(currentLevel);
    return currentIndex < this.LEVEL_ORDER.length - 1 ? this.LEVEL_ORDER[currentIndex + 1] : null;
  }

  /**
   * Calculate progress to next level
   */
  private static calculateProgressToNext(
    track: LearningTrack,
    currentLevel: DifficultyLevel,
    questionsCompleted: number,
    accuracy: number
  ): number {
    const nextLevel = this.getNextLevel(currentLevel);
    if (!nextLevel) return 100; // Already at max level

    const requirements = this.LEVEL_REQUIREMENTS[track];
    const currentReq = requirements[currentLevel];
    const nextReq = requirements[nextLevel];

    // Calculate progress based on questions and accuracy
    const questionProgress = Math.min(questionsCompleted / nextReq.questionsRequired, 1);
    const accuracyProgress = Math.min(accuracy / nextReq.accuracyRequired, 1);
    
    // Weighted average (70% questions, 30% accuracy)
    return Math.round((questionProgress * 0.7 + accuracyProgress * 0.3) * 100);
  }

  /**
   * Get unlocked levels
   */
  private static getUnlockedLevels(track: LearningTrack, questionsCompleted: number, accuracy: number): DifficultyLevel[] {
    const requirements = this.LEVEL_REQUIREMENTS[track];
    const unlocked: DifficultyLevel[] = [];

    for (const level of this.LEVEL_ORDER) {
      const req = requirements[level];
      if (questionsCompleted >= req.questionsRequired && accuracy >= req.accuracyRequired) {
        unlocked.push(level);
      }
    }

    return unlocked;
  }

  /**
   * Get locked levels
   */
  private static getLockedLevels(track: LearningTrack, questionsCompleted: number, accuracy: number): DifficultyLevel[] {
    const unlocked = this.getUnlockedLevels(track, questionsCompleted, accuracy);
    return this.LEVEL_ORDER.filter(level => !unlocked.includes(level));
  }

  /**
   * Check if a level is unlocked
   */
  static isLevelUnlocked(
    track: LearningTrack,
    level: DifficultyLevel,
    questionsCompleted: number,
    accuracy: number
  ): boolean {
    const requirements = this.LEVEL_REQUIREMENTS[track];
    const req = requirements[level];
    
    return questionsCompleted >= req.questionsRequired && accuracy >= req.accuracyRequired;
  }

  /**
   * Get level requirements
   */
  static getLevelRequirements(track: LearningTrack, level: DifficultyLevel): LevelRequirement {
    return this.LEVEL_REQUIREMENTS[track][level];
  }

  /**
   * Get all level requirements for a track
   */
  static getAllLevelRequirements(track: LearningTrack): Record<DifficultyLevel, LevelRequirement> {
    return this.LEVEL_REQUIREMENTS[track];
  }

  /**
   * Get progression milestones for a track
   */
  static getProgressionMilestones(
    track: LearningTrack,
    questionsCompleted: number,
    accuracy: number
  ): ProgressionMilestone[] {
    const requirements = this.LEVEL_REQUIREMENTS[track];
    const milestones: ProgressionMilestone[] = [];

    for (const level of this.LEVEL_ORDER) {
      const req = requirements[level];
      const completed = questionsCompleted >= req.questionsRequired && accuracy >= req.accuracyRequired;
      
      let progress = 0;
      if (level === 'beginner') {
        progress = Math.min(questionsCompleted / 5, 1) * 100; // First 5 questions
      } else if (level === 'intermediate') {
        progress = Math.min(questionsCompleted / req.questionsRequired, 1) * 100;
      } else if (level === 'advanced') {
        progress = Math.min(questionsCompleted / req.questionsRequired, 1) * 100;
      }

      milestones.push({
        id: `${track}-${level}`,
        title: `${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
        description: req.description,
        requirement: {
          level,
          questions: req.questionsRequired,
          accuracy: req.accuracyRequired
        },
        reward: {
          xp: req.rewards.xp,
          title: `${level.charAt(0).toUpperCase() + level.slice(1)} Master`,
          description: `Unlock ${req.rewards.unlocks.join(', ')}`
        },
        completed,
        progress: Math.round(progress)
      });
    }

    return milestones;
  }

  /**
   * Get track prerequisites
   */
  static getTrackPrerequisites(track: LearningTrack): LearningTrack[] {
    return this.TRACK_PREREQUISITES[track];
  }

  /**
   * Check if track is unlocked
   */
  static isTrackUnlocked(
    track: LearningTrack,
    completedTracks: { [key in LearningTrack]: number }
  ): boolean {
    const prerequisites = this.getTrackPrerequisites(track);
    
    return prerequisites.every(prereq => {
      const requiredQuestions = prereq === 'html' ? 10 : prereq === 'css' ? 15 : 20;
      return completedTracks[prereq] >= requiredQuestions;
    });
  }

  /**
   * Get recommended next level
   */
  static getRecommendedNextLevel(
    track: LearningTrack,
    questionsCompleted: number,
    accuracy: number
  ): DifficultyLevel | null {
    const currentLevel = this.getCurrentLevel(track, questionsCompleted, accuracy);
    const nextLevel = this.getNextLevel(currentLevel);
    
    if (!nextLevel) return null;

    const requirements = this.LEVEL_REQUIREMENTS[track];
    const nextReq = requirements[nextLevel];
    
    // Check if user is close to unlocking next level
    const questionProgress = questionsCompleted / nextReq.questionsRequired;
    const accuracyProgress = accuracy / nextReq.accuracyRequired;
    
    if (questionProgress >= 0.8 && accuracyProgress >= 0.8) {
      return nextLevel;
    }
    
    return null;
  }

  /**
   * Get level difficulty description
   */
  static getLevelDescription(level: DifficultyLevel): string {
    const descriptions = {
      beginner: 'Perfect for newcomers! Start with basic concepts and build your foundation.',
      intermediate: 'Ready for more challenge? Apply your knowledge to solve complex problems.',
      advanced: 'Expert level! Tackle advanced concepts and master the subject completely.'
    };
    
    return descriptions[level];
  }

  /**
   * Get level color
   */
  static getLevelColor(level: DifficultyLevel): string {
    const colors = {
      beginner: '#4ecdc4',
      intermediate: '#f39c12',
      advanced: '#e74c3c'
    };
    
    return colors[level];
  }

  /**
   * Get level icon
   */
  static getLevelIcon(level: DifficultyLevel): string {
    const icons = {
      beginner: '🌱',
      intermediate: '⚡',
      advanced: '🔥'
    };
    
    return icons[level];
  }

  /**
   * Calculate level completion percentage
   */
  static getLevelCompletionPercentage(
    track: LearningTrack,
    level: DifficultyLevel,
    questionsCompleted: number,
    accuracy: number
  ): number {
    const requirements = this.LEVEL_REQUIREMENTS[track];
    const req = requirements[level];
    
    const questionProgress = Math.min(questionsCompleted / req.questionsRequired, 1);
    const accuracyProgress = Math.min(accuracy / req.accuracyRequired, 1);
    
    return Math.round((questionProgress * 0.7 + accuracyProgress * 0.3) * 100);
  }
}

export default DifficultyProgressionService;
