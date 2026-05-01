// Live Pricing Feed
//
// DATA POLICY (2026-04-20): the previous implementation of this module
// invented prices by jittering hard-coded "base prices" with Math.random()
// and synthesised historical price charts using Math.sin(). That violates
// the project data policy ("unlabelled estimates = sabotage").
//
// Until a real supplier-pricing source is wired (Solarcity Kenya REST,
// Davis & Shirtliff catalogue scrape, EPRA published price index, or
// vendor B2B API), every read path here must throw `DataUnavailableError`
// so the UI can render an honest empty state instead of fake market data.

import { DataUnavailableError } from '../provenance';

export interface PriceUpdate {
  id: string;
  componentType: string;
  componentName: string;
  price: number;
  currency: string;
  supplier: string;
  timestamp: Date;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface PriceAlert {
  id: string;
  componentName: string;
  targetPrice: number;
  currentPrice: number;
  condition: 'below' | 'above';
  triggered: boolean;
  createdAt: Date;
}

class PricingLiveFeed {
  private subscribers: Array<(update: PriceUpdate) => void> = [];
  private alerts: PriceAlert[] = [];
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    // Live feed is intentionally NOT started — there is no real source wired.
    // Call `connect(sourceFn)` from a real supplier integration to enable.
  }

  /** Wire a real price source. The callback is invoked on every tick and is
   *  expected to return a fully-formed PriceUpdate sourced from a supplier. */
  connect(sourceFn: (component: string) => Promise<PriceUpdate>, components: string[], pollMs = 60_000): void {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(async () => {
      for (const c of components) {
        try {
          const update = await sourceFn(c);
          this.notifySubscribers(update);
          this.checkAlerts(update);
        } catch {
          // Swallow per-tick errors; a real implementation should log via the
          // server's structured logger from the calling module.
        }
      }
    }, pollMs);
  }

  disconnect(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private getComponentType(component: string): string {
    if (component.includes('Solar') || component.includes('Panel')) return 'panel';
    if (component.includes('Inverter')) return 'inverter';
    if (component.includes('Battery')) return 'battery';
    return 'other';
  }

  subscribe(callback: (update: PriceUpdate) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index !== -1) this.subscribers.splice(index, 1);
    };
  }

  private notifySubscribers(update: PriceUpdate): void {
    for (const subscriber of this.subscribers) {
      subscriber(update);
    }
  }

  async getCurrentPrice(_componentName: string): Promise<PriceUpdate | null> {
    throw new DataUnavailableError(
      'pricing.current',
      'No supplier price source is wired. Per data policy, refusing to return a synthetic price. ' +
        'Wire a real source via PricingLiveFeed.connect() before calling getCurrentPrice().'
    );
  }

  async getHistoricalPrices(_componentName: string, _days: number = 30): Promise<PriceUpdate[]> {
    throw new DataUnavailableError(
      'pricing.history',
      'Historical pricing requires a real price archive (e.g. EPRA published index, supplier ' +
        'invoice database). Refusing to return Math.sin()-generated chart data.'
    );
  }

  createAlert(componentName: string, targetPrice: number, condition: 'below' | 'above'): PriceAlert {
    const alert: PriceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      componentName,
      targetPrice,
      currentPrice: 0,
      condition,
      triggered: false,
      createdAt: new Date()
    };
    this.alerts.push(alert);
    return alert;
  }

  private async checkAlerts(update: PriceUpdate): Promise<void> {
    for (const alert of this.alerts) {
      if (alert.triggered) continue;
      
      const conditionMet = alert.condition === 'below' 
        ? update.price <= alert.targetPrice 
        : update.price >= alert.targetPrice;
      
      if (conditionMet && update.componentName === alert.componentName) {
        alert.triggered = true;
        alert.currentPrice = update.price;
        this.notifyAlertTriggered(alert);
      }
    }
  }

  private notifyAlertTriggered(alert: PriceAlert): void {
    console.log(`ALERT: ${alert.componentName} ${alert.condition} ${alert.targetPrice} - Current: ${alert.currentPrice}`);
    // In production, send push notification
  }

  getAlerts(): PriceAlert[] {
    return this.alerts;
  }

  stopLiveFeed(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const pricingLiveFeed = new PricingLiveFeed();