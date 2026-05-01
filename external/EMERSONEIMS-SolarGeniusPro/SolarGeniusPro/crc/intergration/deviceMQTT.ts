// MQTT DEVICE INTEGRATION
// IoT device communication for real-time monitoring

import * as mqtt from 'mqtt';

export interface DeviceMessage {
  deviceId: string;
  type: 'telemetry' | 'alert' | 'command' | 'status';
  timestamp: Date;
  data: any;
}

export interface TelemetryData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  temperature: number;
  frequency: number;
  status: string;
}

export interface DeviceCommand {
  commandId: string;
  deviceId: string;
  action: string;
  params: any;
  timestamp: Date;
}

class DeviceMQTT {
  private client: mqtt.MqttClient | null = null;
  private connected: boolean = false;
  private messageHandlers: Map<string, (message: DeviceMessage) => void> = new Map();
  private telemetryCache: Map<string, TelemetryData> = new Map();
  
  constructor() {
    this.connect();
  }
  
  private connect(): void {
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    const options = {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      clientId: `solargenius_${Math.random().toString(36).substr(2, 10)}`
    };
    
    this.client = mqtt.connect(brokerUrl, options);
    
    this.client.on('connect', () => {
      console.log('MQTT Connected to broker');
      this.connected = true;
      this.subscribeToTopics();
    });
    
    this.client.on('error', (error) => {
      console.error('MQTT Error:', error);
      this.connected = false;
      setTimeout(() => this.connect(), 5000);
    });
    
    this.client.on('message', (topic, message) => {
      this.handleMessage(topic, message.toString());
    });
  }
  
  private subscribeToTopics(): void {
    if (!this.client) return;
    
    // Subscribe to device telemetry topics
    this.client.subscribe('solargenius/+/telemetry');
    this.client.subscribe('solargenius/+/alert');
    this.client.subscribe('solargenius/+/status');
    this.client.subscribe('solargenius/+/command/response');
  }
  
  private handleMessage(topic: string, payload: string): void {
    try {
      const parts = topic.split('/');
      const deviceId = parts[1];
      const type = parts[2] as 'telemetry' | 'alert' | 'status';
      
      const data = JSON.parse(payload);
      const message: DeviceMessage = {
        deviceId,
        type,
        timestamp: new Date(),
        data
      };
      
      // Cache telemetry data
      if (type === 'telemetry') {
        this.telemetryCache.set(deviceId, data);
      }
      
      // Call registered handlers
      const handler = this.messageHandlers.get(deviceId);
      if (handler) {
        handler(message);
      }
      
      // Global handlers
      const globalHandler = this.messageHandlers.get('*');
      if (globalHandler) {
        globalHandler(message);
      }
    } catch (error) {
      console.error('Error handling MQTT message:', error);
    }
  }
  
  async publishTelemetry(deviceId: string, data: TelemetryData): Promise<void> {
    if (!this.client || !this.connected) {
      throw new Error('MQTT not connected');
    }
    
    const topic = `solargenius/${deviceId}/telemetry`;
    this.client.publish(topic, JSON.stringify(data));
  }
  
  async sendCommand(deviceId: string, action: string, params: any = {}): Promise<string> {
    if (!this.client || !this.connected) {
      throw new Error('MQTT not connected');
    }
    
    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const command: DeviceCommand = {
      commandId,
      deviceId,
      action,
      params,
      timestamp: new Date()
    };
    
    const topic = `solargenius/${deviceId}/command`;
    this.client.publish(topic, JSON.stringify(command));
    
    return commandId;
  }
  
  async getDeviceStatus(deviceId: string): Promise<{ online: boolean; lastSeen?: Date; telemetry?: TelemetryData }> {
    const telemetry = this.telemetryCache.get(deviceId);
    
    return {
      online: telemetry !== undefined,
      lastSeen: telemetry ? new Date() : undefined,
      telemetry
    };
  }
  
  registerDeviceHandler(deviceId: string, handler: (message: DeviceMessage) => void): void {
    this.messageHandlers.set(deviceId, handler);
  }
  
  unregisterDeviceHandler(deviceId: string): void {
    this.messageHandlers.delete(deviceId);
  }
  
  async getConnectedDevices(): Promise<string[]> {
    // In production, query device registry
    return Array.from(this.telemetryCache.keys());
  }
  
  async simulateDeviceData(deviceId: string): Promise<void> {
    // For testing - simulate device telemetry
    setInterval(() => {
      const telemetry: TelemetryData = {
        voltage: 230 + (Math.random() - 0.5) * 10,
        current: 10 + Math.random() * 15,
        power: 2300 + Math.random() * 3000,
        energy: 10 + Math.random() * 5,
        temperature: 35 + Math.random() * 10,
        frequency: 50 + (Math.random() - 0.5) * 0.5,
        status: 'operational'
      };
      this.publishTelemetry(deviceId, telemetry);
    }, 5000);
  }
  
  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.connected = false;
    }
  }
}

export const deviceMQTT = new DeviceMQTT();