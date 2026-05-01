// SERVICE WORKER REGISTRATION
// PWA offline capabilities

export interface ServiceWorkerConfig {
  swUrl: string;
  scope: string;
  updateInterval: number;
  onUpdateFound?: () => void;
  onUpdateReady?: () => void;
  onOfflineReady?: () => void;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig = {
    swUrl: '/sw.js',
    scope: '/',
    updateInterval: 3600000 // 1 hour
  };
  private updateCheckInterval: number | null = null;
  
  async register(config?: Partial<ServiceWorkerConfig>): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers not supported');
      return false;
    }
    
    this.config = { ...this.config, ...config };
    
    try {
      this.registration = await navigator.serviceWorker.register(
        this.config.swUrl,
        { scope: this.config.scope }
      );
      
      console.log('Service Worker registered:', this.registration);
      
      this.setupEventHandlers();
      this.startUpdateCheck();
      
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }
  
  async unregister(): Promise<boolean> {
    if (!this.registration) return false;
    
    const result = await this.registration.unregister();
    if (result) {
      this.registration = null;
      this.stopUpdateCheck();
    }
    return result;
  }
  
  async update(): Promise<boolean> {
    if (!this.registration) return false;
    
    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Service Worker update failed:', error);
      return false;
    }
  }
  
  async getStatus(): Promise<{
    isRegistered: boolean;
    isControlling: boolean;
    state: string;
    scope: string;
  }> {
    if (!this.registration) {
      return {
        isRegistered: false,
        isControlling: false,
        state: 'none',
        scope: ''
      };
    }
    
    const activeWorker = this.registration.active;
    const isControlling = activeWorker?.state === 'activated';
    
    return {
      isRegistered: true,
      isControlling,
      state: activeWorker?.state || 'unknown',
      scope: this.registration.scope
    };
  }
  
  async sendMessage(message: any): Promise<void> {
    if (!this.registration || !this.registration.active) {
      throw new Error('No active service worker');
    }
    
    this.registration.active.postMessage(message);
  }
  
  async cacheUrls(urls: string[]): Promise<void> {
    await this.sendMessage({ type: 'CACHE_URLS', urls });
  }
  
  async clearCache(): Promise<void> {
    await this.sendMessage({ type: 'CLEAR_CACHE' });
  }
  
  async getCacheSize(): Promise<number> {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        resolve(event.data.size);
      };
      
      this.sendMessage({ type: 'GET_CACHE_SIZE' });
      // This needs to be implemented with proper messaging
      resolve(0);
    });
  }
  
  private setupEventHandlers(): void {
    if (!this.registration) return;
    
    // Handle updates
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration?.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New update ready
            if (this.config.onUpdateReady) {
              this.config.onUpdateReady();
            }
          }
        });
      }
      
      if (this.config.onUpdateFound) {
        this.config.onUpdateFound();
      }
    });
    
    // Handle offline ready
    if (this.config.onOfflineReady) {
      // Check if offline ready
      this.config.onOfflineReady();
    }
  }
  
  private startUpdateCheck(): void {
    if (this.updateCheckInterval) return;
    
    this.updateCheckInterval = window.setInterval(() => {
      this.update();
    }, this.config.updateInterval);
  }
  
  private stopUpdateCheck(): void {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }
  }
}

export const serviceWorkerManager = new ServiceWorkerManager();