import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import { storage } from './storage';

interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
  retries: number;
}

class SyncService {
  private isSyncing = false;
  private maxRetries = 3;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startAutoSync();
  }

  startAutoSync(intervalMs: number = 30000) {
    this.syncInterval = setInterval(() => {
      this.sync();
    }, intervalMs);
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async queueOperation(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retries'>): Promise<void> {
    const newOperation: SyncOperation = {
      ...operation,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0
    };

    const pending = await this.getPendingOperations();
    pending.push(newOperation);
    await AsyncStorage.setItem('pending_sync', JSON.stringify(pending));
  }

  async getPendingOperations(): Promise<SyncOperation[]> {
    const data = await AsyncStorage.getItem('pending_sync');
    return data ? JSON.parse(data) : [];
  }

  async sync(): Promise<{ success: boolean; syncedCount: number }> {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected || this.isSyncing) {
      return { success: false, syncedCount: 0 };
    }

    this.isSyncing = true;
    let syncedCount = 0;

    try {
      const pending = await this.getPendingOperations();
      
      for (const operation of pending) {
        try {
          const success = await this.executeOperation(operation);
          if (success) {
            syncedCount++;
            await this.removeOperation(operation.id);
          } else {
            operation.retries++;
            if (operation.retries >= this.maxRetries) {
              await this.removeOperation(operation.id);
              await this.logFailedOperation(operation);
            } else {
              await this.updateOperation(operation);
            }
          }
        } catch (error) {
          console.error('Sync operation failed:', error);
          operation.retries++;
          await this.updateOperation(operation);
        }
      }
    } finally {
      this.isSyncing = false;
    }

    return { success: true, syncedCount };
  }

  private async executeOperation(operation: SyncOperation): Promise<boolean> {
    switch (operation.type) {
      case 'create':
        return this.createEntity(operation.entity, operation.data);
      case 'update':
        return this.updateEntity(operation.entity, operation.data);
      case 'delete':
        return this.deleteEntity(operation.entity, operation.data.id);
      default:
        return false;
    }
  }

  private async createEntity(entity: string, data: any): Promise<boolean> {
    try {
      const response = await api.post(`/${entity}`, data);
      if (response.success && response.data?.id) {
        await storage.set(`${entity}_${response.data.id}`, response.data);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  private async updateEntity(entity: string, data: any): Promise<boolean> {
    try {
      const response = await api.put(`/${entity}/${data.id}`, data);
      if (response.success) {
        await storage.set(`${entity}_${data.id}`, response.data);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  private async deleteEntity(entity: string, id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/${entity}/${id}`);
      if (response.success) {
        await storage.remove(`${entity}_${id}`);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  private async removeOperation(id: string): Promise<void> {
    const pending = await this.getPendingOperations();
    const filtered = pending.filter(op => op.id !== id);
    await AsyncStorage.setItem('pending_sync', JSON.stringify(filtered));
  }

  private async updateOperation(operation: SyncOperation): Promise<void> {
    const pending = await this.getPendingOperations();
    const index = pending.findIndex(op => op.id === operation.id);
    if (index !== -1) {
      pending[index] = operation;
      await AsyncStorage.setItem('pending_sync', JSON.stringify(pending));
    }
  }

  private async logFailedOperation(operation: SyncOperation): Promise<void> {
    const failed = await this.getFailedOperations();
    failed.push(operation);
    await AsyncStorage.setItem('failed_sync', JSON.stringify(failed));
  }

  private async getFailedOperations(): Promise<SyncOperation[]> {
    const data = await AsyncStorage.getItem('failed_sync');
    return data ? JSON.parse(data) : [];
  }

  async getSyncStatus(): Promise<{
    pending: number;
    failed: number;
    lastSync: Date | null;
  }> {
    const pending = await this.getPendingOperations();
    const failed = await this.getFailedOperations();
    const lastSyncStr = await AsyncStorage.getItem('last_sync_time');
    
    return {
      pending: pending.length,
      failed: failed.length,
      lastSync: lastSyncStr ? new Date(lastSyncStr) : null
    };
  }

  async markLastSync(): Promise<void> {
    await AsyncStorage.setItem('last_sync_time', new Date().toISOString());
  }
}

export const sync = new SyncService();