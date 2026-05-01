// INPUT SANITIZATION
// Prevents XSS, SQL injection, and other injection attacks

export interface SanitizeOptions {
  stripTags?: boolean;
  stripScript?: boolean;
  allowHtml?: boolean;
  maxLength?: number;
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
}

class SanitizationService {
  private defaultOptions: SanitizeOptions = {
    stripTags: true,
    stripScript: true,
    allowHtml: false,
    maxLength: 10000
  };
  
  sanitizeString(input: string, options?: SanitizeOptions): string {
    const opts = { ...this.defaultOptions, ...options };
    let result = input;
    
    if (opts.maxLength && result.length > opts.maxLength) {
      result = result.substring(0, opts.maxLength);
    }
    
    if (opts.stripScript) {
      result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      result = result.replace(/javascript:/gi, '');
      result = result.replace(/on\w+\s*=/gi, '');
    }
    
    if (opts.stripTags && !opts.allowHtml) {
      result = result.replace(/<[^>]*>/g, '');
    }
    
    return result.trim();
  }
  
  sanitizeObject<T extends Record<string, any>>(obj: T, options?: SanitizeOptions): T {
    const result = {} as T;
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        result[key as keyof T] = this.sanitizeString(value, options) as any;
      } else if (typeof value === 'object' && value !== null) {
        result[key as keyof T] = this.sanitizeObject(value, options) as any;
      } else {
        result[key as keyof T] = value;
      }
    }
    
    return result;
  }
  
  sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email, { stripTags: true, stripScript: true });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : '';
  }
  
  sanitizePhone(phone: string): string {
    const sanitized = this.sanitizeString(phone, { stripTags: true });
    const digits = sanitized.replace(/\D/g, '');
    
    if (digits.length >= 9 && digits.length <= 12) {
      return digits;
    }
    
    return '';
  }
  
  sanitizeUrl(url: string): string {
    const sanitized = this.sanitizeString(url, { stripTags: true });
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    if (urlRegex.test(sanitized)) {
      return sanitized;
    }
    
    return '';
  }
  
  sanitizeNumber(input: any, defaultValue: number = 0): number {
    const num = Number(input);
    return isNaN(num) ? defaultValue : num;
  }
  
  sanitizeBoolean(input: any): boolean {
    if (typeof input === 'boolean') return input;
    if (typeof input === 'string') {
      return ['true', '1', 'yes', 'on'].includes(input.toLowerCase());
    }
    return Boolean(input);
  }
  
  sanitizeArray<T>(input: any[], sanitizer?: (item: any) => T): T[] {
    if (!Array.isArray(input)) return [];
    
    if (sanitizer) {
      return input.map(sanitizer);
    }
    
    return input.filter(item => item !== null && item !== undefined);
  }
  
  escapeHtml(text: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    
    return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
  }
  
  unescapeHtml(text: string): string {
    const htmlUnescapes: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'"
    };
    
    return text.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => htmlUnescapes[entity]);
  }
  
  sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^[_.-]/, '');
  }
  
  sanitizePath(path: string): string {
    return path
      .replace(/\.\./g, '')
      .replace(/\/\//g, '/')
      .replace(/^\/+/, '/');
  }
}

export const sanitization = new SanitizationService();