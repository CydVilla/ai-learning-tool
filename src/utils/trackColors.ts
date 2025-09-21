import { LearningTrack } from '../types';

export interface TrackColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  shadow: string;
  gradient: string;
}

export const TRACK_COLORS: Record<LearningTrack, TrackColorScheme> = {
  html: {
    primary: '#ff6b6b',
    secondary: '#ff8e8e',
    accent: '#ff5252',
    background: 'rgba(255, 107, 107, 0.1)',
    text: '#ffffff',
    border: 'rgba(255, 107, 107, 0.3)',
    shadow: 'rgba(255, 107, 107, 0.2)',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)'
  },
  css: {
    primary: '#4ecdc4',
    secondary: '#6dd5d0',
    accent: '#26a69a',
    background: 'rgba(78, 205, 196, 0.1)',
    text: '#ffffff',
    border: 'rgba(78, 205, 196, 0.3)',
    shadow: 'rgba(78, 205, 196, 0.2)',
    gradient: 'linear-gradient(135deg, #4ecdc4, #6dd5d0)'
  },
  javascript: {
    primary: '#45b7d1',
    secondary: '#6bc5d8',
    accent: '#2196f3',
    background: 'rgba(69, 183, 209, 0.1)',
    text: '#ffffff',
    border: 'rgba(69, 183, 209, 0.3)',
    shadow: 'rgba(69, 183, 209, 0.2)',
    gradient: 'linear-gradient(135deg, #45b7d1, #6bc5d8)'
  }
};

export const getTrackColors = (track: LearningTrack): TrackColorScheme => {
  return TRACK_COLORS[track];
};

export const getTrackIcon = (track: LearningTrack): string => {
  const icons = {
    html: 'H',
    css: 'C',
    javascript: 'J'
  };
  return icons[track];
};

export const getTrackName = (track: LearningTrack): string => {
  const names = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript'
  };
  return names[track];
};

export const getTrackDescription = (track: LearningTrack): string => {
  const descriptions = {
    html: 'Master the foundation of web development with HTML. Learn about tags, structure, semantic markup, and accessibility.',
    css: 'Style your websites beautifully with CSS. Learn layouts, animations, responsive design, and modern CSS features.',
    javascript: 'Add interactivity to your websites with JavaScript. Master functions, DOM manipulation, async programming, and modern ES6+ features.'
  };
  return descriptions[track];
};

export const getTrackDifficulty = (track: LearningTrack): 'beginner' | 'intermediate' | 'advanced' => {
  const difficulties = {
    html: 'beginner' as const,
    css: 'beginner' as const,
    javascript: 'intermediate' as const
  };
  return difficulties[track];
};

export const getTrackTotalQuestions = (track: LearningTrack): number => {
  const totals = {
    html: 50,
    css: 60,
    javascript: 80
  };
  return totals[track];
};

export const getTrackPrerequisites = (track: LearningTrack): LearningTrack[] => {
  const prerequisites = {
    html: [] as LearningTrack[],
    css: ['html'] as LearningTrack[],
    javascript: ['html', 'css'] as LearningTrack[]
  };
  return prerequisites[track];
};

export const isTrackUnlocked = (track: LearningTrack, completedTracks: { [key in LearningTrack]: number }): boolean => {
  const prerequisites = getTrackPrerequisites(track);
  
  return prerequisites.every(prereq => {
    const requiredQuestions = prereq === 'html' ? 10 : prereq === 'css' ? 15 : 20;
    return completedTracks[prereq] >= requiredQuestions;
  });
};

export const getTrackProgressColor = (track: LearningTrack, percentage: number): string => {
  const colors = getTrackColors(track);
  
  if (percentage >= 100) return colors.accent;
  if (percentage >= 75) return colors.primary;
  if (percentage >= 50) return colors.secondary;
  return colors.border;
};

export const getTrackStatusColor = (track: LearningTrack, status: 'locked' | 'unlocked' | 'completed'): string => {
  const colors = getTrackColors(track);
  
  switch (status) {
    case 'locked':
      return '#95a5a6';
    case 'unlocked':
      return colors.primary;
    case 'completed':
      return colors.accent;
    default:
      return colors.primary;
  }
};

export const getTrackBadgeColor = (track: LearningTrack, type: 'difficulty' | 'progress' | 'achievement'): string => {
  const colors = getTrackColors(track);
  
  switch (type) {
    case 'difficulty':
      return colors.secondary;
    case 'progress':
      return colors.primary;
    case 'achievement':
      return colors.accent;
    default:
      return colors.primary;
  }
};

export const getTrackTheme = (track: LearningTrack) => {
  const colors = getTrackColors(track);
  
  return {
    colors,
    icon: getTrackIcon(track),
    name: getTrackName(track),
    description: getTrackDescription(track),
    difficulty: getTrackDifficulty(track),
    totalQuestions: getTrackTotalQuestions(track),
    prerequisites: getTrackPrerequisites(track)
  };
};

export default TRACK_COLORS;
