// Security and Authentication Type Definitions

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'engineer' | 'client' | 'technician' | 'viewer';
  permissions: Permission[];
  mfaEnabled: boolean;
  createdAt: Date;
  lastLogin: Date;
}

export type Permission =
  | 'create:project'
  | 'view:project'
  | 'edit:project'
  | 'delete:project'
  | 'generate:quote'
  | 'view:reports'
  | 'download:pdf'
  | 'manage:users'
  | 'view:analytics'
  | 'manage:system';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface Session {
  id: string;
  userId: string;
  tenantId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

export interface EncryptedData {
  iv: string;
  encrypted: string;
  authTag?: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  statusCode?: number;
}

export interface AuditEntry {
  id: string;
  userId: string;
  tenantId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}