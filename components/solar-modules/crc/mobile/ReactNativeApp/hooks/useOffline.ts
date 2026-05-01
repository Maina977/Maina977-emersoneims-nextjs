import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingOperations: number;
}

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingOperations, setPendingOperations] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true);
    });
    
    loadPendingCount();
    
    return () => unsubscribe();
  }, []);

  const loadPendingCount = async () => {
    try {
      const pending = await AsyncStorage.getItem('pending_operations');
      const count = pending ? JSON.parse(pending).length : 0;
      setPendingOperations(count);
      
      const lastSyncStr = await AsyncStorage.getItem('last_sync');
      if (lastSyncStr) setLastSync(new Date(lastSyncStr));
    } catch (error) {
      console.error('Failed to load pending count:', error);
    }
  };

  const queueOperation = async (type: string, data: any): Promise<void> => {
    try {
      const existing = await AsyncStorage.getItem('pending_operations');
      const operations = existing ? JSON.parse(existing) : [];
      operations.push({
        id: Date.now(),
        type,
        data,
        timestamp: new Date(),
        retries: 0
      });
      await AsyncStorage.setItem('pending_operations', JSON.stringify(operations));
      setPendingOperations(operations.length);
    } catch (error) {
      console.error('Failed to queue operation:', error);
    }
  };

  const syncNow = async (): Promise<boolean> => {
    if (!isOnline || isSyncing) return false;
    
    setIsSyncing(true);
    try {
      const existing = await AsyncStorage.getItem('pending_operations');
      const operations = existing ? JSON.parse(existing) : [];
      
      for (const op of operations) {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          // Success - remove from queue
        } catch (error) {
          op.retries++;
          if (op.retries >= 3) {
            // Failed permanently
          }
        }
      }
      
      const remaining = operations.filter((op: any) => op.retries < 3);
      await AsyncStorage.setItem('pending_operations', JSON.stringify(remaining));
      await AsyncStorage.setItem('last_sync', new Date().toISOString());
      
      setPendingOperations(remaining.length);
      setLastSync(new Date());
      
      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const cacheData = async (key: string, data: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  };

  const getCachedData = async (key: string): Promise<any> => {
    try {
      const data = await AsyncStorage.getItem(`cache_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  };

  const clearCache = async (): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  return {
    isOffline: !isOnline,
    isOnline,
    pendingOperations,
    lastSync,
    isSyncing,
    queueOperation,
    syncNow,
    cacheData,
    getCachedData,
    clearCache,
    syncStatus: { isOnline, lastSync, pendingOperations }
  };
};