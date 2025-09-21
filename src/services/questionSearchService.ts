import { Question, CodeExercise, LearningTrack, DifficultyLevel, QuestionType } from '../types';

export interface SearchFilters {
  track?: LearningTrack;
  difficulty?: DifficultyLevel;
  type?: QuestionType;
  tags?: string[];
  minXP?: number;
  maxXP?: number;
  hasCodeExample?: boolean;
  hasExplanation?: boolean;
  text?: string;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'difficulty' | 'xp' | 'id' | 'random';
  sortOrder?: 'asc' | 'desc';
  fuzzy?: boolean;
  caseSensitive?: boolean;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  filters: SearchFilters;
  options: SearchOptions;
}

export interface SearchSuggestion {
  text: string;
  type: 'track' | 'difficulty' | 'type' | 'tag' | 'text';
  count: number;
}

class QuestionSearchService {
  /**
   * Search questions with filters and options
   */
  searchQuestions(
    questions: Question[],
    filters: SearchFilters = {},
    options: SearchOptions = {}
  ): SearchResult<Question> {
    let filteredQuestions = [...questions];

    // Apply filters
    filteredQuestions = this.applyFilters(filteredQuestions, filters);

    // Apply text search
    if (filters.text) {
      filteredQuestions = this.applyTextSearch(filteredQuestions, filters.text, options);
    }

    // Sort results
    filteredQuestions = this.sortResults(filteredQuestions, options);

    // Apply pagination
    const total = filteredQuestions.length;
    const limit = options.limit || 20;
    const offset = options.offset || 0;
    const paginatedQuestions = filteredQuestions.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      items: paginatedQuestions,
      total,
      hasMore,
      filters,
      options
    };
  }

  /**
   * Search code exercises with filters and options
   */
  searchCodeExercises(
    exercises: CodeExercise[],
    filters: SearchFilters = {},
    options: SearchOptions = {}
  ): SearchResult<CodeExercise> {
    let filteredExercises = [...exercises];

    // Apply filters
    filteredExercises = this.applyFilters(filteredExercises, filters);

    // Apply text search
    if (filters.text) {
      filteredExercises = this.applyTextSearch(filteredExercises, filters.text, options);
    }

    // Sort results
    filteredExercises = this.sortResults(filteredExercises, options);

    // Apply pagination
    const total = filteredExercises.length;
    const limit = options.limit || 20;
    const offset = options.offset || 0;
    const paginatedExercises = filteredExercises.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      items: paginatedExercises,
      total,
      hasMore,
      filters,
      options
    };
  }

  /**
   * Get search suggestions based on query
   */
  getSearchSuggestions(
    questions: Question[],
    exercises: CodeExercise[],
    query: string,
    limit: number = 10
  ): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Track suggestions
    const tracks: LearningTrack[] = ['html', 'css', 'javascript'];
    tracks.forEach(track => {
      if (track.includes(queryLower)) {
        const count = this.getCountByTrack(questions, exercises, track);
        suggestions.push({
          text: track,
          type: 'track',
          count
        });
      }
    });

    // Difficulty suggestions
    const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
    difficulties.forEach(difficulty => {
      if (difficulty.includes(queryLower)) {
        const count = this.getCountByDifficulty(questions, exercises, difficulty);
        suggestions.push({
          text: difficulty,
          type: 'difficulty',
          count
        });
      }
    });

    // Type suggestions
    const types: QuestionType[] = ['multiple-choice', 'fill-in-the-blank', 'true-false', 'code-exercise'];
    types.forEach(type => {
      if (type.includes(queryLower)) {
        const count = this.getCountByType(questions, exercises, type);
        suggestions.push({
          text: type,
          type: 'type',
          count
        });
      }
    });

    // Text suggestions from questions and exercises
    const textSuggestions = this.getTextSuggestions(questions, exercises, query, limit);
    suggestions.push(...textSuggestions);

    // Sort by relevance and limit
    return suggestions
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get popular search terms
   */
  getPopularSearchTerms(questions: Question[], exercises: CodeExercise[]): string[] {
    const terms: { [key: string]: number } = {};

    // Extract terms from questions
    questions.forEach(question => {
      const words = this.extractWords(question.question);
      words.forEach(word => {
        if (word.length > 3) {
          terms[word] = (terms[word] || 0) + 1;
        }
      });
    });

    // Extract terms from exercises
    exercises.forEach(exercise => {
      const words = this.extractWords(exercise.description);
      words.forEach(word => {
        if (word.length > 3) {
          terms[word] = (terms[word] || 0) + 1;
        }
      });
    });

    // Return top terms
    return Object.entries(terms)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([term]) => term);
  }

  /**
   * Get search statistics
   */
  getSearchStats(questions: Question[], exercises: CodeExercise[]): {
    totalQuestions: number;
    totalExercises: number;
    byTrack: { [key in LearningTrack]: number };
    byDifficulty: { [key in DifficultyLevel]: number };
    byType: { [key in QuestionType]: number };
  } {
    const byTrack = {
      html: 0,
      css: 0,
      javascript: 0
    };

    const byDifficulty = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };

    const byType = {
      'multiple-choice': 0,
      'fill-in-the-blank': 0,
      'true-false': 0,
      'code-exercise': 0
    };

    // Count questions
    questions.forEach(question => {
      byTrack[question.track]++;
      byDifficulty[question.difficulty]++;
      byType[question.type]++;
    });

    // Count exercises
    exercises.forEach(exercise => {
      byTrack[exercise.track]++;
      byDifficulty[exercise.difficulty]++;
      byType[exercise.type]++;
    });

    return {
      totalQuestions: questions.length,
      totalExercises: exercises.length,
      byTrack,
      byDifficulty,
      byType
    };
  }

  /**
   * Apply filters to items
   */
  private applyFilters<T extends Question | CodeExercise>(
    items: T[],
    filters: SearchFilters
  ): T[] {
    return items.filter(item => {
      // Track filter
      if (filters.track && item.track !== filters.track) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulty && item.difficulty !== filters.difficulty) {
        return false;
      }

      // Type filter
      if (filters.type && item.type !== filters.type) {
        return false;
      }

      // XP range filter
      if (filters.minXP !== undefined && item.xp < filters.minXP) {
        return false;
      }
      if (filters.maxXP !== undefined && item.xp > filters.maxXP) {
        return false;
      }

      // Code example filter
      if (filters.hasCodeExample !== undefined) {
        const hasCodeExample = 'codeExample' in item && item.codeExample;
        if (hasCodeExample !== filters.hasCodeExample) {
          return false;
        }
      }

      // Explanation filter
      if (filters.hasExplanation !== undefined) {
        const hasExplanation = item.explanation && item.explanation.length > 0;
        if (hasExplanation !== filters.hasExplanation) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Apply text search to items
   */
  private applyTextSearch<T extends Question | CodeExercise>(
    items: T[],
    text: string,
    options: SearchOptions
  ): T[] {
    const searchText = options.caseSensitive ? text : text.toLowerCase();
    const fuzzy = options.fuzzy || false;

    return items.filter(item => {
      const searchableText = this.getSearchableText(item);
      const itemText = options.caseSensitive ? searchableText : searchableText.toLowerCase();

      if (fuzzy) {
        return this.fuzzyMatch(itemText, searchText);
      } else {
        return itemText.includes(searchText);
      }
    });
  }

  /**
   * Get searchable text from item
   */
  private getSearchableText(item: Question | CodeExercise): string {
    let text = '';

    if ('question' in item) {
      text += item.question + ' ';
    }
    if ('description' in item) {
      text += item.description + ' ';
    }
    if (item.explanation) {
      text += item.explanation + ' ';
    }
    if ('options' in item && item.options) {
      text += item.options.join(' ') + ' ';
    }
    if ('codeExample' in item && item.codeExample) {
      text += item.codeExample + ' ';
    }
    if ('starterCode' in item && item.starterCode) {
      text += item.starterCode + ' ';
    }

    return text;
  }

  /**
   * Sort results based on options
   */
  private sortResults<T extends Question | CodeExercise>(
    items: T[],
    options: SearchOptions
  ): T[] {
    const sortBy = options.sortBy || 'relevance';
    const sortOrder = options.sortOrder || 'asc';

    return items.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          break;
        case 'xp':
          comparison = a.xp - b.xp;
          break;
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'random':
          comparison = Math.random() - 0.5;
          break;
        case 'relevance':
        default:
          // For relevance, we could implement a scoring system
          // For now, just sort by ID
          comparison = a.id.localeCompare(b.id);
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * Fuzzy string matching
   */
  private fuzzyMatch(text: string, pattern: string): boolean {
    const textLower = text.toLowerCase();
    const patternLower = pattern.toLowerCase();

    let patternIndex = 0;
    for (let i = 0; i < textLower.length && patternIndex < patternLower.length; i++) {
      if (textLower[i] === patternLower[patternIndex]) {
        patternIndex++;
      }
    }

    return patternIndex === patternLower.length;
  }

  /**
   * Extract words from text
   */
  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Get count by track
   */
  private getCountByTrack(questions: Question[], exercises: CodeExercise[], track: LearningTrack): number {
    return questions.filter(q => q.track === track).length + 
           exercises.filter(e => e.track === track).length;
  }

  /**
   * Get count by difficulty
   */
  private getCountByDifficulty(questions: Question[], exercises: CodeExercise[], difficulty: DifficultyLevel): number {
    return questions.filter(q => q.difficulty === difficulty).length + 
           exercises.filter(e => e.difficulty === difficulty).length;
  }

  /**
   * Get count by type
   */
  private getCountByType(questions: Question[], exercises: CodeExercise[], type: QuestionType): number {
    return questions.filter(q => q.type === type).length + 
           exercises.filter(e => e.type === type).length;
  }

  /**
   * Get text suggestions
   */
  private getTextSuggestions(
    questions: Question[],
    exercises: CodeExercise[],
    query: string,
    limit: number
  ): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Get unique words from questions and exercises
    const allItems = [...questions, ...exercises];
    const words = new Set<string>();

    allItems.forEach(item => {
      const text = this.getSearchableText(item);
      const extractedWords = this.extractWords(text);
      extractedWords.forEach(word => {
        if (word.includes(queryLower) && word.length > 3) {
          words.add(word);
        }
      });
    });

    // Convert to suggestions
    words.forEach(word => {
      const count = allItems.filter(item => {
        const text = this.getSearchableText(item);
        return text.toLowerCase().includes(word);
      }).length;

      suggestions.push({
        text: word,
        type: 'text',
        count
      });
    });

    return suggestions.slice(0, limit);
  }
}

// Export singleton instance
export const questionSearchService = new QuestionSearchService();
export default questionSearchService;
