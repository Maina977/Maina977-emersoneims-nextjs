import { useAuthStore } from '../stores/authStore';
import api from '../api/client';

export const useAuth = () => {
  const { user, token, setAuth, logout, isAuthenticated } = useAuthStore();

  const login = async (email: string, password: string) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    setAuth(response.data.user, response.data.access_token);
    return response.data;
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await api.post('/api/v1/auth/register', { email, password, name });
    setAuth(response.data.user, response.data.access_token);
    return response.data;
  };

  return { user, token, login, register, logout, isAuthenticated: isAuthenticated() };
};