import { AxiosError } from 'axios';

export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  retryable: boolean;
  userMessage: string;
}

export interface ErrorContext {
  service: string;
  operation: string;
  requestId?: string;
  userId?: string;
  timestamp: string;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: { [key: string]: number };
  errorsByService: { [key: string]: number };
  lastError?: APIError;
  errorRate: number;
}

class ErrorHandlingService {
  private errorMetrics: ErrorMetrics = {
    totalErrors: 0,
    errorsByType: {},
    errorsByService: {},
    errorRate: 0
  };

  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  };

  /**
   * Handle API errors and provide user-friendly messages
   */
  handleAPIError(error: any, context: ErrorContext): APIError {
    const timestamp = new Date().toISOString();
    
    // Update error metrics
    this.updateErrorMetrics(error, context);

    // Parse different types of errors
    if (error instanceof AxiosError) {
      return this.handleAxiosError(error, context, timestamp);
    } else if (error instanceof Error) {
      return this.handleGenericError(error, context, timestamp);
    } else {
      return this.handleUnknownError(error, context, timestamp);
    }
  }

  /**
   * Handle Axios-specific errors
   */
  private handleAxiosError(error: AxiosError, context: ErrorContext, timestamp: string): APIError {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const data = error.response?.data;

    switch (status) {
      case 400:
        return {
          code: 'BAD_REQUEST',
          message: 'Invalid request parameters',
          details: data,
          timestamp,
          retryable: false,
          userMessage: 'There was an issue with your request. Please check your input and try again.'
        };

      case 401:
        return {
          code: 'UNAUTHORIZED',
          message: 'Authentication failed',
          details: data,
          timestamp,
          retryable: false,
          userMessage: 'Your session has expired. Please refresh the page and try again.'
        };

      case 403:
        return {
          code: 'FORBIDDEN',
          message: 'Access denied',
          details: data,
          timestamp,
          retryable: false,
          userMessage: 'You don\'t have permission to perform this action.'
        };

      case 404:
        return {
          code: 'NOT_FOUND',
          message: 'Resource not found',
          details: data,
          timestamp,
          retryable: false,
          userMessage: 'The requested resource was not found.'
        };

      case 429:
        return {
          code: 'RATE_LIMITED',
          message: 'Rate limit exceeded',
          details: data,
          timestamp,
          retryable: true,
          userMessage: 'Too many requests. Please wait a moment and try again.'
        };

      case 500:
        return {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
          details: data,
          timestamp,
          retryable: true,
          userMessage: 'Something went wrong on our end. Please try again later.'
        };

      case 502:
      case 503:
      case 504:
        return {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Service temporarily unavailable',
          details: data,
          timestamp,
          retryable: true,
          userMessage: 'The service is temporarily unavailable. Please try again in a few minutes.'
        };

      default:
        return {
          code: 'HTTP_ERROR',
          message: `HTTP ${status}: ${statusText}`,
          details: data,
          timestamp,
          retryable: (status || 0) >= 500,
          userMessage: 'An unexpected error occurred. Please try again.'
        };
    }
  }

  /**
   * Handle generic JavaScript errors
   */
  private handleGenericError(error: Error, context: ErrorContext, timestamp: string): APIError {
    if (error.message.includes('Network Error')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        details: error.message,
        timestamp,
        retryable: true,
        userMessage: 'Unable to connect to the server. Please check your internet connection and try again.'
      };
    }

    if (error.message.includes('timeout')) {
      return {
        code: 'TIMEOUT',
        message: 'Request timeout',
        details: error.message,
        timestamp,
        retryable: true,
        userMessage: 'The request took too long to complete. Please try again.'
      };
    }

    if (error.message.includes('API key')) {
      return {
        code: 'API_KEY_ERROR',
        message: 'API key configuration error',
        details: error.message,
        timestamp,
        retryable: false,
        userMessage: 'There\'s an issue with the API configuration. Please contact support.'
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      details: error.stack,
      timestamp,
      retryable: false,
      userMessage: 'An unexpected error occurred. Please try again or contact support if the problem persists.'
    };
  }

  /**
   * Handle unknown error types
   */
  private handleUnknownError(error: any, context: ErrorContext, timestamp: string): APIError {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Unknown error type',
      details: error,
      timestamp,
      retryable: false,
      userMessage: 'An unexpected error occurred. Please try again.'
    };
  }

  /**
   * Retry a failed operation with exponential backoff
   */
  async retryOperation<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    customConfig?: Partial<RetryConfig>
  ): Promise<T> {
    const config = { ...this.retryConfig, ...customConfig };
    let lastError: any;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        const apiError = this.handleAPIError(error, context);

        // Don't retry if error is not retryable
        if (!apiError.retryable) {
          throw apiError;
        }

        // Don't retry on last attempt
        if (attempt === config.maxRetries) {
          throw apiError;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
          config.maxDelay
        );

        console.log(`Retrying operation in ${delay}ms (attempt ${attempt + 1}/${config.maxRetries})`);
        await this.delay(delay);
      }
    }

    throw this.handleAPIError(lastError, context);
  }

  /**
   * Create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update error metrics
   */
  private updateErrorMetrics(error: any, context: ErrorContext): void {
    this.errorMetrics.totalErrors++;
    
    const errorType = this.getErrorType(error);
    this.errorMetrics.errorsByType[errorType] = (this.errorMetrics.errorsByType[errorType] || 0) + 1;
    this.errorMetrics.errorsByService[context.service] = (this.errorMetrics.errorsByService[context.service] || 0) + 1;
    
    this.errorMetrics.lastError = this.handleAPIError(error, context);
    this.errorMetrics.errorRate = this.calculateErrorRate();
  }

  /**
   * Get error type from error object
   */
  private getErrorType(error: any): string {
    if (error instanceof AxiosError) {
      return `HTTP_${error.response?.status || 'UNKNOWN'}`;
    } else if (error instanceof Error) {
      return error.constructor.name;
    } else {
      return 'UNKNOWN';
    }
  }

  /**
   * Calculate error rate
   */
  private calculateErrorRate(): number {
    // This would typically be calculated over a time window
    // For now, return a simple percentage
    return this.errorMetrics.totalErrors > 0 ? 1 : 0;
  }

  /**
   * Get error metrics
   */
  getErrorMetrics(): ErrorMetrics {
    return { ...this.errorMetrics };
  }

  /**
   * Reset error metrics
   */
  resetErrorMetrics(): void {
    this.errorMetrics = {
      totalErrors: 0,
      errorsByType: {},
      errorsByService: {},
      errorRate: 0
    };
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error: any): boolean {
    const apiError = this.handleAPIError(error, {
      service: 'unknown',
      operation: 'unknown',
      timestamp: new Date().toISOString()
    });
    return apiError.retryable;
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error: any): string {
    const apiError = this.handleAPIError(error, {
      service: 'unknown',
      operation: 'unknown',
      timestamp: new Date().toISOString()
    });
    return apiError.userMessage;
  }

  /**
   * Log error for debugging
   */
  logError(error: APIError, context: ErrorContext): void {
    console.error('API Error:', {
      code: error.code,
      message: error.message,
      context,
      timestamp: error.timestamp,
      retryable: error.retryable
    });

    // In a real application, you might want to send this to a logging service
    // like Sentry, LogRocket, or your own logging API
  }

  /**
   * Create error context
   */
  createErrorContext(service: string, operation: string, requestId?: string, userId?: string): ErrorContext {
    return {
      service,
      operation,
      requestId,
      userId,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Handle OpenAI-specific errors
   */
  handleOpenAIError(error: any, context: ErrorContext): APIError {
    const timestamp = new Date().toISOString();

    if (error.message.includes('API key')) {
      return {
        code: 'OPENAI_API_KEY_ERROR',
        message: 'OpenAI API key not configured or invalid',
        details: error.message,
        timestamp,
        retryable: false,
        userMessage: 'AI features are not available. Please check your API configuration.'
      };
    }

    if (error.message.includes('rate limit')) {
      return {
        code: 'OPENAI_RATE_LIMIT',
        message: 'OpenAI rate limit exceeded',
        details: error.message,
        timestamp,
        retryable: true,
        userMessage: 'AI service is busy. Please wait a moment and try again.'
      };
    }

    if (error.message.includes('quota')) {
      return {
        code: 'OPENAI_QUOTA_EXCEEDED',
        message: 'OpenAI quota exceeded',
        details: error.message,
        timestamp,
        retryable: false,
        userMessage: 'AI service quota exceeded. Please try again later.'
      };
    }

    if (error.message.includes('model')) {
      return {
        code: 'OPENAI_MODEL_ERROR',
        message: 'OpenAI model error',
        details: error.message,
        timestamp,
        retryable: true,
        userMessage: 'AI service is experiencing issues. Please try again.'
      };
    }

    return this.handleAPIError(error, context);
  }
}

// Export singleton instance
export const errorHandlingService = new ErrorHandlingService();
export default errorHandlingService;
