/**
 * Validation Schemas using Zod
 * Validates API request payloads
 */

import { z } from 'zod';

// Conversion tracking schema
export const conversionSchema = z.object({
  type: z.string(),
  data: z.record(z.any()),
  visitorId: z.string(),
  sessionId: z.string(),
  timestamp: z.string().or(z.number()),
});

// Event tracking schema
export const eventSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
  visitorId: z.string(),
  sessionId: z.string(),
  timestamp: z.string().or(z.number()),
});

// Visitor tracking schema
export const visitorSchema = z.object({
  event: z.string().min(1, 'Event is required'),
  data: z.object({
    id: z.string().optional(),
    sessionId: z.string().optional(),
    page: z.string().optional(),
    engagement: z.object({
      score: z.number().optional(),
    }).optional(),
    conversion: z.object({
      probability: z.number().optional(),
    }).optional(),
  }).passthrough(), // Allow additional properties
  timestamp: z.union([z.number(), z.string()]).optional().default(Date.now()),
});

// Notification schema
export const notificationSchema = z.object({
  type: z.string().optional().default('new_lead'),
  visitorId: z.string().optional(),
  conversionType: z.string().optional(),
  data: z.record(z.any()).optional(),
  timestamp: z.union([z.number(), z.string()]).optional().default(Date.now()),
});

// Type exports for TypeScript
export type ConversionInput = z.infer<typeof conversionSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type VisitorInput = z.infer<typeof visitorSchema>;
export type NotificationInput = z.infer<typeof notificationSchema>;

