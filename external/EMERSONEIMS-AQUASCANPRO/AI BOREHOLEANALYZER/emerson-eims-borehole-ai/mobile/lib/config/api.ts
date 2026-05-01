export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  endpoints: {
    analysis: '/api/v1/analysis',
    reports: '/api/v1/reports',
    auth: '/api/v1/auth',
    users: '/api/v1/users',
    payments: '/api/v1/payments'
  }
};