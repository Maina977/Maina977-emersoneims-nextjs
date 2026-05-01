import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const API_BASE_URL = 'https://api.solargenius.com/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private token: string | null = null;

  async setToken(token: string | null) {
    this.token = token;
    if (token) {
      await AsyncStorage.setItem('auth_token', token);
    } else {
      await AsyncStorage.removeItem('auth_token');
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
          message: data.message
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.post('/auth/login', { email, password });
  }

  async register(userData: any): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.post('/auth/register', userData);
  }

  async logout(): Promise<ApiResponse> {
    return this.post('/auth/logout');
  }

  // Solar endpoints
  async calculateSystem(consumption: number, location: string): Promise<ApiResponse<any>> {
    return this.post('/solar/calculate', { consumption, location });
  }

  async generateQuote(designData: any): Promise<ApiResponse<any>> {
    return this.post('/solar/quote', designData);
  }

  async getDesigns(projectId?: string): Promise<ApiResponse<any[]>> {
    const endpoint = projectId ? `/designs?projectId=${projectId}` : '/designs';
    return this.get(endpoint);
  }

  async saveDesign(design: any): Promise<ApiResponse<any>> {
    return this.post('/designs', design);
  }

  async updateDesign(id: string, design: any): Promise<ApiResponse<any>> {
    return this.put(`/designs/${id}`, design);
  }

  async deleteDesign(id: string): Promise<ApiResponse> {
    return this.delete(`/designs/${id}`);
  }

  // Fault codes
  async getFaultCodes(brand?: string): Promise<ApiResponse<any[]>> {
    const endpoint = brand ? `/fault-codes?brand=${brand}` : '/fault-codes';
    return this.get(endpoint);
  }

  async getFaultSolution(code: string): Promise<ApiResponse<any>> {
    return this.get(`/fault-codes/${code}`);
  }

  // Weather
  async getWeather(lat: number, lng: number): Promise<ApiResponse<any>> {
    return this.get(`/weather?lat=${lat}&lng=${lng}`);
  }

  async getForecast(lat: number, lng: number, days: number = 7): Promise<ApiResponse<any>> {
    return this.get(`/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`);
  }

  // Reports
  async generateReport(designId: string, reportType: string): Promise<ApiResponse<{ url: string }>> {
    return this.post(`/reports/generate`, { designId, reportType });
  }

  async downloadReport(reportId: string): Promise<string> {
    return `${API_BASE_URL}/reports/download/${reportId}?token=${await this.getToken()}`;
  }

  // Projects
  async getProjects(): Promise<ApiResponse<any[]>> {
    return this.get('/projects');
  }

  async createProject(project: any): Promise<ApiResponse<any>> {
    return this.post('/projects', project);
  }

  async updateProject(id: string, project: any): Promise<ApiResponse<any>> {
    return this.put(`/projects/${id}`, project);
  }

  async deleteProject(id: string): Promise<ApiResponse> {
    return this.delete(`/projects/${id}`);
  }
}

export const api = new ApiService();