'use client';

/**
 * GENERATOR ORACLE AUTH PROVIDER
 * React context for authentication state management
 *
 * @copyright 2026 Generator Oracle
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface OracleUser {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  role: 'admin' | 'manager' | 'technician' | 'viewer';
  organization_id: number | null;
  license_key: string | null;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
  avatar_url: string | null;
}

interface AuthContextValue {
  user: OracleUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string, deviceFingerprint?: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  organizationId?: number;
  licenseKey?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const AuthContext = createContext<AuthContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

export function OracleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<OracleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  /**
   * Check current session
   */
  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/generator-oracle/auth/session');
      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Session check error:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login
   */
  const login = useCallback(async (
    email: string,
    password: string,
    deviceFingerprint?: string
  ): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/generator-oracle/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, deviceFingerprint }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Login failed');
        return false;
      }

      setUser(data.user);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register
   */
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/generator-oracle/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || 'Registration failed');
        return false;
      }

      // Auto-login after registration
      return await login(data.email, data.password);
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetch('/api/generator-oracle/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh session
   */
  const refreshSession = useCallback(async () => {
    await checkSession();
  }, [checkSession]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Context value
  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    refreshSession,
    clearError,
  }), [user, isLoading, error, login, register, logout, refreshSession, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Use Oracle auth context
 */
export function useOracleAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useOracleAuth must be used within an OracleAuthProvider');
  }
  return context;
}

/**
 * Use require auth - throws if not authenticated
 */
export function useRequireAuth(): OracleUser {
  const { user, isLoading, isAuthenticated } = useOracleAuth();

  if (isLoading) {
    throw new Promise(() => {}); // Suspend for loading
  }

  if (!isAuthenticated || !user) {
    throw new Error('Authentication required');
  }

  return user;
}

/**
 * Check if user has specific role
 */
export function useHasRole(...roles: OracleUser['role'][]): boolean {
  const { user } = useOracleAuth();
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Check if user is admin
 */
export function useIsAdmin(): boolean {
  return useHasRole('admin');
}

/**
 * Check if user is manager or admin
 */
export function useIsManager(): boolean {
  return useHasRole('admin', 'manager');
}
