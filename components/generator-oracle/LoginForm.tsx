'use client';

/**
 * GENERATOR ORACLE LOGIN FORM
 * Authentication form with login and registration
 *
 * @copyright 2026 Generator Oracle
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOracleAuth } from './AuthProvider';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface LoginFormProps {
  onSuccess?: () => void;
  showRegister?: boolean;
  licenseKey?: string;
  className?: string;
}

type FormMode = 'login' | 'register' | 'forgot';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function LoginForm({
  onSuccess,
  showRegister = true,
  licenseKey,
  className = '',
}: LoginFormProps) {
  const { login, register, isLoading, error, clearError } = useOracleAuth();

  const [mode, setMode] = useState<FormMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  /**
   * Handle input change
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError(null);
    clearError();
  }, [clearError]);

  /**
   * Validate form
   */
  const validateForm = useCallback((): boolean => {
    if (!formData.email) {
      setValidationError('Email is required');
      return false;
    }

    if (!formData.email.includes('@')) {
      setValidationError('Please enter a valid email');
      return false;
    }

    if (!formData.password) {
      setValidationError('Password is required');
      return false;
    }

    if (mode === 'register') {
      if (formData.password.length < 8) {
        setValidationError('Password must be at least 8 characters');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setValidationError('Passwords do not match');
        return false;
      }
    }

    return true;
  }, [formData, mode]);

  /**
   * Handle submit
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    let success = false;

    if (mode === 'login') {
      success = await login(formData.email, formData.password);
    } else if (mode === 'register') {
      success = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
        phone: formData.phone || undefined,
        licenseKey: licenseKey,
      });
    }

    if (success && onSuccess) {
      onSuccess();
    }
  }, [formData, mode, login, register, licenseKey, onSuccess, validateForm]);

  /**
   * Switch mode
   */
  const switchMode = useCallback((newMode: FormMode) => {
    setMode(newMode);
    setValidationError(null);
    clearError();
    setFormData({
      email: formData.email, // Keep email
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
    });
  }, [formData.email, clearError]);

  const displayError = validationError || error;

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4"
          animate={{
            boxShadow: ['0 0 20px rgba(168,85,247,0.5)', '0 0 40px rgba(236,72,153,0.5)', '0 0 20px rgba(168,85,247,0.5)'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-4xl">🔐</span>
        </motion.div>
        <h2 className="text-2xl font-bold text-white">
          {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
        </h2>
        <p className="text-slate-400 mt-2">
          {mode === 'login'
            ? 'Sign in to access Generator Oracle'
            : mode === 'register'
            ? 'Join the Generator Oracle community'
            : 'Enter your email to reset password'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Display */}
        <AnimatePresence>
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
            >
              ⚠️ {displayError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Name (Register only) */}
        <AnimatePresence>
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm text-slate-400 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Phone (Register only) */}
        <AnimatePresence>
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm text-slate-400 mb-2">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254 7XX XXX XXX"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password */}
        {mode !== 'forgot' && (
          <div>
            <label className="block text-sm text-slate-400 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Confirm Password (Register only) */}
        <AnimatePresence>
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm text-slate-400 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forgot Password Link */}
        {mode === 'login' && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
            </>
          ) : (
            <span>
              {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
            </span>
          )}
        </motion.button>
      </form>

      {/* Mode Switch */}
      <div className="mt-6 text-center">
        {mode === 'login' && showRegister && (
          <p className="text-slate-400">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => switchMode('register')}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign up
            </button>
          </p>
        )}
        {mode === 'register' && (
          <p className="text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => switchMode('login')}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign in
            </button>
          </p>
        )}
        {mode === 'forgot' && (
          <p className="text-slate-400">
            Remember your password?{' '}
            <button
              onClick={() => switchMode('login')}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign in
            </button>
          </p>
        )}
      </div>

      {/* License Key Notice */}
      {licenseKey && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <p className="text-green-400 text-sm text-center">
            ✓ License key will be linked to your account
          </p>
        </div>
      )}
    </div>
  );
}
