// Global type augmentations for browser APIs

declare global {
  interface Navigator {
    deviceMemory?: number;
  }

  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      config?: Record<string, any>
    ) => void;
  }
}

export {};

