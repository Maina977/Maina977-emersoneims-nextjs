// SESSION MANAGEMENT
// Manages user sessions and tokens

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
  deviceInfo?: string;
  isActive: boolean;
}

export interface SessionConfig {
  maxAge: number; // milliseconds
  refreshThreshold: number; // milliseconds
  maxConcurrentSessions: number;
}

class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private userSessions: Map<string, Set<string>> = new Map();
  private config: SessionConfig = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    refreshThreshold: 24 * 60 * 60 * 1000, // 1 day
    maxConcurrentSessions: 5
  };
  
  async createSession(
    userId: string,
    tenantId: string,
    ipAddress: string,
    userAgent: string,
    deviceInfo?: string
  ): Promise<Session> {
    // Check concurrent session limit
    const userSessionIds = this.userSessions.get(userId) || new Set();
    if (userSessionIds.size >= this.config.maxConcurrentSessions) {
      await this.cleanupOldestSessions(userId);
    }
    
    const sessionId = this.generateSessionId();
    const token = this.generateToken();
    const now = new Date();
    
    const session: Session = {
      id: sessionId,
      userId,
      tenantId,
      token,
      createdAt: now,
      expiresAt: new Date(now.getTime() + this.config.maxAge),
      lastActivity: now,
      ipAddress,
      userAgent,
      deviceInfo,
      isActive: true
    };
    
    this.sessions.set(sessionId, session);
    
    const userSessions = this.userSessions.get(userId) || new Set();
    userSessions.add(sessionId);
    this.userSessions.set(userId, userSessions);
    
    return session;
  }
  
  async getSession(sessionId: string): Promise<Session | null> {
    const session = this.sessions.get(sessionId);
    
    if (!session || !session.isActive) {
      return null;
    }
    
    if (new Date() > session.expiresAt) {
      await this.invalidateSession(sessionId);
      return null;
    }
    
    // Refresh if needed
    const timeToExpiry = session.expiresAt.getTime() - Date.now();
    if (timeToExpiry < this.config.refreshThreshold) {
      session.expiresAt = new Date(Date.now() + this.config.maxAge);
      this.sessions.set(sessionId, session);
    }
    
    session.lastActivity = new Date();
    this.sessions.set(sessionId, session);
    
    return session;
  }
  
  async getSessionByToken(token: string): Promise<Session | null> {
    for (const session of this.sessions.values()) {
      if (session.token === token && session.isActive) {
        return this.getSession(session.id);
      }
    }
    return null;
  }
  
  async validateSession(sessionId: string, token: string): Promise<boolean> {
    const session = await this.getSession(sessionId);
    return session !== null && session.token === token;
  }
  
  async invalidateSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    session.isActive = false;
    this.sessions.set(sessionId, session);
    
    const userSessions = this.userSessions.get(session.userId);
    if (userSessions) {
      userSessions.delete(sessionId);
      if (userSessions.size === 0) {
        this.userSessions.delete(session.userId);
      }
    }
    
    return true;
  }
  
  async invalidateAllUserSessions(userId: string): Promise<number> {
    const userSessions = this.userSessions.get(userId);
    if (!userSessions) return 0;
    
    let count = 0;
    for (const sessionId of userSessions) {
      await this.invalidateSession(sessionId);
      count++;
    }
    
    this.userSessions.delete(userId);
    return count;
  }
  
  async invalidateOtherSessions(userId: string, currentSessionId: string): Promise<number> {
    const userSessions = this.userSessions.get(userId);
    if (!userSessions) return 0;
    
    let count = 0;
    for (const sessionId of userSessions) {
      if (sessionId !== currentSessionId) {
        await this.invalidateSession(sessionId);
        count++;
      }
    }
    
    return count;
  }
  
  async getUserActiveSessions(userId: string): Promise<Session[]> {
    const userSessions = this.userSessions.get(userId);
    if (!userSessions) return [];
    
    const activeSessions: Session[] = [];
    for (const sessionId of userSessions) {
      const session = await this.getSession(sessionId);
      if (session) {
        activeSessions.push(session);
      }
    }
    
    return activeSessions;
  }
  
  async cleanupExpiredSessions(): Promise<number> {
    let count = 0;
    const now = new Date();
    
    for (const [sessionId, session] of this.sessions) {
      if (session.expiresAt < now || !session.isActive) {
        await this.invalidateSession(sessionId);
        count++;
      }
    }
    
    return count;
  }
  
  async cleanupOldestSessions(userId: string): Promise<void> {
    const sessions = await this.getUserActiveSessions(userId);
    
    if (sessions.length >= this.config.maxConcurrentSessions) {
      const sorted = sessions.sort((a, b) => 
        a.lastActivity.getTime() - b.lastActivity.getTime()
      );
      
      const toRemove = sorted.length - this.config.maxConcurrentSessions + 1;
      for (let i = 0; i < toRemove; i++) {
        await this.invalidateSession(sorted[i].id);
      }
    }
  }
  
  async updateSessionConfig(config: Partial<SessionConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
  }
  
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }
  
  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  getSessionCount(): number {
    return this.sessions.size;
  }
  
  getActiveSessionCount(): number {
    let count = 0;
    for (const session of this.sessions.values()) {
      if (session.isActive && session.expiresAt > new Date()) {
        count++;
      }
    }
    return count;
  }
}

export const sessionManager = new SessionManager();