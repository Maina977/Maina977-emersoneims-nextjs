/**
 * Safe fetch utility that validates JSON responses
 * Prevents "Unexpected token '<'" errors when HTML is returned instead of JSON
 */

export interface SafeFetchOptions extends RequestInit {
  expectJson?: boolean;
  timeout?: number;
}

export class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public contentType?: string
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

/**
 * Safely fetch and parse JSON response with validation
 * @param url - The URL to fetch
 * @param options - Fetch options with additional safety checks
 * @returns Parsed JSON data
 * @throws FetchError if response is not valid JSON
 */
export async function safeFetch<T = any>(
  url: string,
  options: SafeFetchOptions = {}
): Promise<T> {
  const { expectJson = true, timeout = 10000, ...fetchOptions } = options;

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check if response is OK
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      // Try to get error details from response
      try {
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          // Only include first 200 chars to avoid huge error messages
          errorMessage += ` - ${text.substring(0, 200)}`;
        }
      } catch {
        // Ignore parsing errors
      }

      throw new FetchError(errorMessage, response.status, contentType || undefined);
    }

    // If we expect JSON, validate content-type
    if (expectJson) {
      const contentType = response.headers.get('content-type');
      
      if (!contentType?.includes('application/json')) {
        // Try to get a preview of what was actually returned
        const text = await response.text();
        const preview = text.substring(0, 100);
        
        throw new FetchError(
          `Expected JSON but received ${contentType || 'unknown content type'}. ` +
          `Response starts with: ${preview}${text.length > 100 ? '...' : ''}`,
          response.status,
          contentType || undefined
        );
      }

      // Parse and return JSON
      return await response.json();
    }

    // If not expecting JSON, return response as-is
    return response as unknown as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof FetchError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new FetchError(`Request timeout after ${timeout}ms`);
      }
      throw new FetchError(`Fetch failed: ${error.message}`);
    }

    throw new FetchError('Unknown fetch error');
  }
}

/**
 * Safely parse JSON with error handling
 * @param text - JSON string to parse
 * @returns Parsed object or null if parsing fails
 */
export function safeJsonParse<T = any>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Check if a response is valid JSON before parsing
 * @param response - Fetch Response object
 * @returns true if response is JSON
 */
export function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json') ?? false;
}
