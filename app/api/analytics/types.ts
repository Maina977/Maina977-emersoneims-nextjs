/**
 * TypeScript interfaces for Analytics API
 */

export interface ConversionRequest {
  type: string;
  data: Record<string, any>;
  visitorId?: string;
  sessionId?: string;
  timestamp?: number;
}

export interface EventRequest {
  event: string;
  data: Record<string, any>;
  visitorId?: string;
  sessionId?: string;
  timestamp?: number;
}

export interface VisitorRequest {
  event: string;
  data: {
    id?: string;
    sessionId?: string;
    page?: string;
    engagement?: {
      score?: number;
    };
    conversion?: {
      probability?: number;
    };
    [key: string]: any;
  };
  timestamp?: number;
}

export interface NotificationRequest {
  type?: string;
  visitorId?: string;
  conversionType?: string;
  data?: Record<string, any>;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
  [key: string]: any;
}

