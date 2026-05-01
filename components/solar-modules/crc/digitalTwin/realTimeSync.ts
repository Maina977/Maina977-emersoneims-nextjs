// DIGITAL TWIN - REAL-TIME SYNC
// Live data synchronization with physical systems

export interface RealTimeData {
  deviceId: string;
  timestamp: Date;
  metrics: {
    power: number;
    voltage: number;
    current: number;
    frequency: number;
    temperature: number;
    energyToday: number;
    energyTotal: number;
  };
  status: 'online' | 'offline' | 'warning' | 'error';
  alerts: RealTimeAlert[];
}

export interface RealTimeAlert {
  id: string;