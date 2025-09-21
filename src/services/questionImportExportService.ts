import { Question, CodeExercise, LearningTrack, DifficultyLevel, QuestionType } from '../types';
import { questionValidationService } from './questionValidationService';

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
  warnings: string[];
  items: (Question | CodeExercise)[];
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'txt';
  includeMetadata?: boolean;
  filterByTrack?: LearningTrack;
  filterByDifficulty?: DifficultyLevel;
  filterByType?: QuestionType;
  includeCodeExamples?: boolean;
  includeExplanations?: boolean;
}

export interface ExportResult {
  success: boolean;
  data: string;
  format: string;
  itemCount: number;
  size: number;
}

export interface ImportOptions {
  validate?: boolean;
  sanitize?: boolean;
  mergeDuplicates?: boolean;
  overwriteExisting?: boolean;
  track?: LearningTrack;
  difficulty?: DifficultyLevel;
}

class QuestionImportExportService {
  /**
   * Export questions to various formats
   */
  exportQuestions(
    questions: Question[],
    options: ExportOptions = { format: 'json' }
  ): ExportResult {
    try {
      let filteredQuestions = [...questions];

      // Apply filters
      if (options.filterByTrack) {
        filteredQuestions = filteredQuestions.filter(q => q.track === options.filterByTrack);
      }
      if (options.filterByDifficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === options.filterByDifficulty);
      }
      if (options.filterByType) {
        filteredQuestions = filteredQuestions.filter(q => q.type === options.filterByType);
      }

      // Remove fields if not requested
      if (!options.includeCodeExamples) {
        filteredQuestions = filteredQuestions.map(q => {
          const { codeExample, ...rest } = q;
          return rest as Question;
        });
      }
      if (!options.includeExplanations) {
        filteredQuestions = filteredQuestions.map(q => {
          const { explanation, ...rest } = q;
          return rest as Question;
        });
      }

      let data: string;
      let format: string;

      switch (options.format) {
        case 'json':
          data = this.exportToJSON(filteredQuestions, options);
          format = 'application/json';
          break;
        case 'csv':
          data = this.exportToCSV(filteredQuestions);
          format = 'text/csv';
          break;
        case 'txt':
          data = this.exportToTXT(filteredQuestions);
          format = 'text/plain';
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      return {
        success: true,
        data,
        format,
        itemCount: filteredQuestions.length,
        size: new Blob([data]).size
      };
    } catch (error) {
      return {
        success: false,
        data: '',
        format: '',
        itemCount: 0,
        size: 0
      };
    }
  }

  /**
   * Export code exercises to various formats
   */
  exportCodeExercises(
    exercises: CodeExercise[],
    options: ExportOptions = { format: 'json' }
  ): ExportResult {
    try {
      let filteredExercises = [...exercises];

      // Apply filters
      if (options.filterByTrack) {
        filteredExercises = filteredExercises.filter(e => e.track === options.filterByTrack);
      }
      if (options.filterByDifficulty) {
        filteredExercises = filteredExercises.filter(e => e.difficulty === options.filterByDifficulty);
      }

      // Remove fields if not requested
      if (!options.includeExplanations) {
        filteredExercises = filteredExercises.map(e => {
          const { explanation, ...rest } = e;
          return rest as CodeExercise;
        });
      }

      let data: string;
      let format: string;

      switch (options.format) {
        case 'json':
          data = this.exportToJSON(filteredExercises, options);
          format = 'application/json';
          break;
        case 'csv':
          data = this.exportToCSV(filteredExercises);
          format = 'text/csv';
          break;
        case 'txt':
          data = this.exportToTXT(filteredExercises);
          format = 'text/plain';
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      return {
        success: true,
        data,
        format,
        itemCount: filteredExercises.length,
        size: new Blob([data]).size
      };
    } catch (error) {
      return {
        success: false,
        data: '',
        format: '',
        itemCount: 0,
        size: 0
      };
    }
  }

  /**
   * Import questions from various formats
   */
  importQuestions(
    data: string,
    options: ImportOptions = { validate: true, sanitize: true }
  ): ImportResult {
    const result: ImportResult = {
      success: false,
      imported: 0,
      failed: 0,
      errors: [],
      warnings: [],
      items: []
    };

    try {
      // Try to parse as JSON first
      let parsedData: any;
      try {
        parsedData = JSON.parse(data);
      } catch (jsonError) {
        // Try to parse as CSV
        parsedData = this.parseCSV(data);
      }

      if (!Array.isArray(parsedData)) {
        result.errors.push('Data must be an array of questions');
        return result;
      }

      const items: (Question | CodeExercise)[] = [];

      for (let i = 0; i < parsedData.length; i++) {
        const item = parsedData[i];
        
        try {
          // Sanitize if requested
          let processedItem = item;
          if (options.sanitize) {
            if (item.type === 'code-exercise') {
              const sanitized = questionValidationService.sanitizeCodeExercise(item);
              processedItem = sanitized.sanitized;
              result.warnings.push(...sanitized.warnings);
            } else {
              const sanitized = questionValidationService.sanitizeQuestion(item);
              processedItem = sanitized.sanitized;
              result.warnings.push(...sanitized.warnings);
            }
          }

          // Validate if requested
          if (options.validate) {
            let validation;
            if (processedItem.type === 'code-exercise') {
              validation = questionValidationService.validateCodeExercise(processedItem);
            } else {
              validation = questionValidationService.validateQuestion(processedItem);
            }

            if (!validation.isValid) {
              result.errors.push(`Item ${i + 1}: ${validation.errors.join(', ')}`);
              result.failed++;
              continue;
            }

            result.warnings.push(...validation.warnings);
          }

          // Apply default track/difficulty if specified
          if (options.track) {
            processedItem.track = options.track;
          }
          if (options.difficulty) {
            processedItem.difficulty = options.difficulty;
          }

          items.push(processedItem);
          result.imported++;
        } catch (error) {
          result.errors.push(`Item ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.failed++;
        }
      }

      result.items = items;
      result.success = result.imported > 0;
    } catch (error) {
      result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Import code exercises from various formats
   */
  importCodeExercises(
    data: string,
    options: ImportOptions = { validate: true, sanitize: true }
  ): ImportResult {
    const result: ImportResult = {
      success: false,
      imported: 0,
      failed: 0,
      errors: [],
      warnings: [],
      items: []
    };

    try {
      // Try to parse as JSON first
      let parsedData: any;
      try {
        parsedData = JSON.parse(data);
      } catch (jsonError) {
        // Try to parse as CSV
        parsedData = this.parseCSV(data);
      }

      if (!Array.isArray(parsedData)) {
        result.errors.push('Data must be an array of code exercises');
        return result;
      }

      const items: CodeExercise[] = [];

      for (let i = 0; i < parsedData.length; i++) {
        const item = parsedData[i];
        
        try {
          // Ensure it's a code exercise
          if (item.type !== 'code-exercise') {
            item.type = 'code-exercise';
          }

          // Sanitize if requested
          let processedItem = item;
          if (options.sanitize) {
            const sanitized = questionValidationService.sanitizeCodeExercise(item);
            processedItem = sanitized.sanitized;
            result.warnings.push(...sanitized.warnings);
          }

          // Validate if requested
          if (options.validate) {
            const validation = questionValidationService.validateCodeExercise(processedItem);
            if (!validation.isValid) {
              result.errors.push(`Item ${i + 1}: ${validation.errors.join(', ')}`);
              result.failed++;
              continue;
            }
            result.warnings.push(...validation.warnings);
          }

          // Apply default track/difficulty if specified
          if (options.track) {
            processedItem.track = options.track;
          }
          if (options.difficulty) {
            processedItem.difficulty = options.difficulty;
          }

          items.push(processedItem);
          result.imported++;
        } catch (error) {
          result.errors.push(`Item ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.failed++;
        }
      }

      result.items = items;
      result.success = result.imported > 0;
    } catch (error) {
      result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Export to JSON format
   */
  private exportToJSON(items: (Question | CodeExercise)[], options: ExportOptions): string {
    const exportData: any = {
      items,
      metadata: options.includeMetadata ? {
        exportedAt: new Date().toISOString(),
        itemCount: items.length,
        format: 'json',
        version: '1.0.0'
      } : undefined
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export to CSV format
   */
  private exportToCSV(items: (Question | CodeExercise)[]): string {
    if (items.length === 0) return '';

    const headers = [
      'id', 'type', 'track', 'difficulty', 'xp',
      'question', 'description', 'options', 'correctAnswer',
      'explanation', 'codeExample', 'starterCode', 'testCases'
    ];

    const rows = items.map(item => {
      const row: string[] = [];
      
      row.push(item.id || '');
      row.push(item.type || '');
      row.push(item.track || '');
      row.push(item.difficulty || '');
      row.push(item.xp?.toString() || '');
      
      if ('question' in item) {
        row.push(this.escapeCSV(item.question || ''));
        row.push('');
        row.push(this.escapeCSV(JSON.stringify(item.options || [])));
        row.push(this.escapeCSV(item.correctAnswer || ''));
      } else {
        row.push('');
        row.push(this.escapeCSV(item.description || ''));
        row.push('');
        row.push('');
      }
      
      row.push(this.escapeCSV(item.explanation || ''));
      row.push(this.escapeCSV(('codeExample' in item ? item.codeExample : '') || ''));
      row.push(this.escapeCSV(('starterCode' in item ? item.starterCode : '') || ''));
      row.push(this.escapeCSV(('testCases' in item ? JSON.stringify(item.testCases) : '') || ''));
      
      return row.join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Export to TXT format
   */
  private exportToTXT(items: (Question | CodeExercise)[]): string {
    return items.map((item, index) => {
      let text = `=== Item ${index + 1} ===\n`;
      text += `ID: ${item.id}\n`;
      text += `Type: ${item.type}\n`;
      text += `Track: ${item.track}\n`;
      text += `Difficulty: ${item.difficulty}\n`;
      text += `XP: ${item.xp}\n\n`;

      if ('question' in item) {
        text += `Question: ${item.question}\n\n`;
        if (item.options) {
          text += `Options:\n`;
          item.options.forEach((option, i) => {
            text += `  ${i + 1}. ${option}\n`;
          });
          text += `\nCorrect Answer: ${item.correctAnswer}\n\n`;
        }
      } else {
        text += `Description: ${item.description}\n\n`;
        if (item.testCases) {
          text += `Test Cases:\n`;
          item.testCases.forEach((testCase, i) => {
            text += `  ${i + 1}. Input: ${testCase.input} -> Output: ${testCase.expectedOutput}\n`;
          });
          text += `\n`;
        }
      }

      if (item.explanation) {
        text += `Explanation: ${item.explanation}\n\n`;
      }

      if ('codeExample' in item && item.codeExample) {
        text += `Code Example:\n${item.codeExample}\n\n`;
      }

      if ('starterCode' in item && item.starterCode) {
        text += `Starter Code:\n${item.starterCode}\n\n`;
      }

      return text;
    }).join('\n');
  }

  /**
   * Parse CSV data
   */
  private parseCSV(data: string): any[] {
    const lines = data.split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const items: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCSVLine(line);
      if (values.length !== headers.length) continue;

      const item: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        
        // Parse specific fields
        if (header === 'xp') {
          item[header] = parseInt(value) || 0;
        } else if (header === 'options' || header === 'testCases') {
          try {
            item[header] = JSON.parse(value);
          } catch {
            item[header] = value;
          }
        } else {
          item[header] = value;
        }
      });

      items.push(item);
    }

    return items;
  }

  /**
   * Parse a single CSV line
   */
  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  }

  /**
   * Escape CSV value
   */
  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Download data as file
   */
  downloadFile(data: string, filename: string, mimeType: string): void {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Read file content
   */
  readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string || '');
      };
      reader.onerror = (e) => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  }
}

// Export singleton instance
export const questionImportExportService = new QuestionImportExportService();
export default questionImportExportService;
