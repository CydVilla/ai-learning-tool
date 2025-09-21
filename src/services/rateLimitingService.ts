import { errorHandlingService } from './errorHandlingService';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (context: any) => string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export interface RequestCache {
  [key: string]: {
    data: any;
    timestamp: number;
    ttl: number;
  };
}

export interface RequestQueue {
  [key: string]: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
    timestamp: number;
  }>;
}

class RateLimitingService {
  private rateLimits: Map<string, RateLimitInfo> = new Map();
  private requestCounts: Map<string, number[]> = new Map();
  private requestCache: RequestCache = {};
  private requestQueue: RequestQueue = {};
  private defaultConfig: RateLimitConfig = {
    maxRequests: 10,
    windowMs: 60000, // 1 minute
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  };

  /**
   * Check if request is within rate limit
   */
  isWithinRateLimit(key: string, config?: Partial<RateLimitConfig>): RateLimitInfo {
    const rateLimitConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    const windowStart = now - rateLimitConfig.windowMs;

    // Get or create request history for this key
    let requests = this.requestCounts.get(key) || [];
    
    // Remove old requests outside the window
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if we're within the limit
    const isWithinLimit = requests.length < rateLimitConfig.maxRequests;
    
    // Update request history
    if (isWithinLimit) {
      requests.push(now);
      this.requestCounts.set(key, requests);
    }

    // Calculate rate limit info
    const resetTime = requests.length > 0 ? requests[0] + rateLimitConfig.windowMs : now + rateLimitConfig.windowMs;
    const remaining = Math.max(0, rateLimitConfig.maxRequests - requests.length);
    const retryAfter = !isWithinLimit ? Math.ceil((resetTime - now) / 1000) : undefined;

    const rateLimitInfo: RateLimitInfo = {
      limit: rateLimitConfig.maxRequests,
      remaining,
      resetTime,
      retryAfter
    };

    // Update rate limit info
    this.rateLimits.set(key, rateLimitInfo);

    return rateLimitInfo;
  }

  /**
   * Wait for rate limit to reset
   */
  async waitForRateLimit(key: string, config?: Partial<RateLimitConfig>): Promise<void> {
    const rateLimitInfo = this.rateLimits.get(key);
    
    if (rateLimitInfo && rateLimitInfo.retryAfter) {
      const delay = rateLimitInfo.retryAfter * 1000;
      console.log(`Rate limit exceeded for ${key}. Waiting ${rateLimitInfo.retryAfter} seconds...`);
      await this.delay(delay);
    }
  }

  /**
   * Queue request to be executed when rate limit allows
   */
  async queueRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    config?: Partial<RateLimitConfig>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      // Check if we can execute immediately
      const rateLimitInfo = this.isWithinRateLimit(key, config);
      
      if (rateLimitInfo.remaining > 0) {
        // Execute immediately
        this.executeRequest(requestFn, resolve, reject);
      } else {
        // Queue the request
        if (!this.requestQueue[key]) {
          this.requestQueue[key] = [];
        }
        
        this.requestQueue[key].push({
          resolve,
          reject,
          timestamp: Date.now()
        });

        // Process queue when rate limit resets
        this.processQueue(key, config);
      }
    });
  }

  /**
   * Process queued requests
   */
  private async processQueue(key: string, config?: Partial<RateLimitConfig>): Promise<void> {
    const queue = this.requestQueue[key];
    if (!queue || queue.length === 0) return;

    // Wait for rate limit to reset
    await this.waitForRateLimit(key, config);

    // Process requests in order
    while (queue.length > 0) {
      const rateLimitInfo = this.isWithinRateLimit(key, config);
      
      if (rateLimitInfo.remaining > 0) {
        const request = queue.shift();
        if (request) {
          // Execute the request
          this.executeRequest(
            () => Promise.resolve(),
            request.resolve,
            request.reject
          );
        }
      } else {
        // Wait for next window
        await this.waitForRateLimit(key, config);
      }
    }
  }

  /**
   * Execute a request with error handling
   */
  private async executeRequest<T>(
    requestFn: () => Promise<T>,
    resolve: (value: T) => void,
    reject: (error: any) => void
  ): Promise<void> {
    try {
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }

  /**
   * Cache request result
   */
  cacheRequest<T>(key: string, data: T, ttl: number = 300000): void { // 5 minutes default
    this.requestCache[key] = {
      data,
      timestamp: Date.now(),
      ttl
    };
  }

  /**
   * Get cached request result
   */
  getCachedRequest<T>(key: string): T | null {
    const cached = this.requestCache[key];
    
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      // Cache expired
      delete this.requestCache[key];
      return null;
    }
    
    return cached.data as T;
  }

  /**
   * Clear cache
   */
  clearCache(key?: string): void {
    if (key) {
      delete this.requestCache[key];
    } else {
      this.requestCache = {};
    }
  }

  /**
   * Get rate limit info for a key
   */
  getRateLimitInfo(key: string): RateLimitInfo | null {
    return this.rateLimits.get(key) || null;
  }

  /**
   * Reset rate limit for a key
   */
  resetRateLimit(key: string): void {
    this.requestCounts.delete(key);
    this.rateLimits.delete(key);
  }

  /**
   * Get all rate limit info
   */
  getAllRateLimitInfo(): Map<string, RateLimitInfo> {
    return new Map(this.rateLimits);
  }

  /**
   * Optimize request batching
   */
  async batchRequests<T>(
    requests: Array<() => Promise<T>>,
    batchSize: number = 5,
    delayBetweenBatches: number = 1000
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      
      // Execute batch in parallel
      const batchResults = await Promise.allSettled(
        batch.map(request => request())
      );
      
      // Process results
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`Request ${i + index} failed:`, result.reason);
          // You might want to handle failed requests differently
        }
      });
      
      // Delay between batches to respect rate limits
      if (i + batchSize < requests.length) {
        await this.delay(delayBetweenBatches);
      }
    }
    
    return results;
  }

  /**
   * Debounce requests
   */
  debounceRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    delay: number = 300
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      // Clear existing timeout
      if (this.requestQueue[key]) {
        this.requestQueue[key].forEach(request => {
          request.reject(new Error('Request debounced'));
        });
        delete this.requestQueue[key];
      }
      
      // Set new timeout
      setTimeout(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }

  /**
   * Throttle requests
   */
  throttleRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    delay: number = 1000
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      const lastRequest = this.requestCache[`throttle_${key}`];
      
      if (lastRequest && now - lastRequest.timestamp < delay) {
        // Too soon, reject
        reject(new Error('Request throttled'));
        return;
      }
      
      // Update last request time
      this.cacheRequest(`throttle_${key}`, now, delay);
      
      // Execute request
      requestFn()
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    totalEntries: number;
    expiredEntries: number;
    memoryUsage: number;
  } {
    const now = Date.now();
    let expiredEntries = 0;
    let memoryUsage = 0;
    
    Object.values(this.requestCache).forEach(entry => {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      }
      memoryUsage += JSON.stringify(entry.data).length;
    });
    
    return {
      totalEntries: Object.keys(this.requestCache).length,
      expiredEntries,
      memoryUsage
    };
  }

  /**
   * Clean up expired cache entries
   */
  cleanupCache(): void {
    const now = Date.now();
    
    Object.keys(this.requestCache).forEach(key => {
      const entry = this.requestCache[key];
      if (now - entry.timestamp > entry.ttl) {
        delete this.requestCache[key];
      }
    });
  }

  /**
   * Get request queue status
   */
  getQueueStatus(): { [key: string]: number } {
    const status: { [key: string]: number } = {};
    
    Object.keys(this.requestQueue).forEach(key => {
      status[key] = this.requestQueue[key].length;
    });
    
    return status;
  }

  /**
   * Clear request queue
   */
  clearQueue(key?: string): void {
    if (key) {
      if (this.requestQueue[key]) {
        this.requestQueue[key].forEach(request => {
          request.reject(new Error('Queue cleared'));
        });
        delete this.requestQueue[key];
      }
    } else {
      Object.keys(this.requestQueue).forEach(key => {
        this.requestQueue[key].forEach(request => {
          request.reject(new Error('Queue cleared'));
        });
      });
      this.requestQueue = {};
    }
  }
}

// Export singleton instance
export const rateLimitingService = new RateLimitingService();
export default rateLimitingService;
