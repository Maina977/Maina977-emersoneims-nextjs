// CONFLICT RESOLUTION FOR OFFLINE SYNC
// Handles conflicts when multiple offline changes occur

export interface Conflict {
  id: string;
  entityType: string;
  entityId: string;
  localVersion: any;
  remoteVersion: any;
  timestamp: Date;
  resolution?: 'local' | 'remote' | 'merge';
  resolvedAt?: Date;
}

export interface MergeResult {
  success: boolean;
  merged: any;
  conflicts: Conflict[];
  warnings: string[];
}

class ConflictResolution {
  private conflicts: Map<string, Conflict> = new Map();
  
  async detectConflict(
    entityType: string,
    entityId: string,
    localVersion: any,
    remoteVersion: any
  ): Promise<Conflict | null> {
    // Check if versions differ
    if (JSON.stringify(localVersion) === JSON.stringify(remoteVersion)) {
      return null;
    }
    
    const conflict: Conflict = {
      id: `conflict_${entityType}_${entityId}_${Date.now()}`,
      entityType,
      entityId,
      localVersion,
      remoteVersion,
      timestamp: new Date()
    };
    
    this.conflicts.set(conflict.id, conflict);
    return conflict;
  }
  
  async resolveConflict(
    conflictId: string,
    resolution: 'local' | 'remote' | 'merge',
    customMerge?: (local: any, remote: any) => any
  ): Promise<MergeResult> {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) {
      return {
        success: false,
        merged: null,
        conflicts: [],
        warnings: ['Conflict not found']
      };
    }
    
    let merged: any;
    const warnings: string[] = [];
    
    switch (resolution) {
      case 'local':
        merged = conflict.localVersion;
        break;
      case 'remote':
        merged = conflict.remoteVersion;
        break;
      case 'merge':
        if (customMerge) {
          merged = customMerge(conflict.localVersion, conflict.remoteVersion);
        } else {
          merged = this.autoMerge(conflict.localVersion, conflict.remoteVersion, warnings);
        }
        break;
    }
    
    conflict.resolution = resolution;
    conflict.resolvedAt = new Date();
    
    return {
      success: true,
      merged,
      conflicts: [conflict],
      warnings
    };
  }
  
  async resolveAllConflicts(
    resolution: 'local' | 'remote' | 'merge' = 'remote'
  ): Promise<MergeResult[]> {
    const results: MergeResult[] = [];
    
    for (const conflict of this.conflicts.values()) {
      const result = await this.resolveConflict(conflict.id, resolution);
      results.push(result);
    }
    
    return results;
  }
  
  async getPendingConflicts(): Promise<Conflict[]> {
    return Array.from(this.conflicts.values())
      .filter(c => !c.resolvedAt);
  }
  
  async getConflict(entityType: string, entityId: string): Promise<Conflict | null> {
    for (const conflict of this.conflicts.values()) {
      if (conflict.entityType === entityType && conflict.entityId === entityId) {
        return conflict;
      }
    }
    return null;
  }
  
  async discardConflict(conflictId: string): Promise<void> {
    this.conflicts.delete(conflictId);
  }
  
  private autoMerge(local: any, remote: any, warnings: string[]): any {
    const merged = { ...remote };
    
    // Merge strategy: remote takes precedence, but preserve local changes for non-conflicting fields
    for (const key of Object.keys(local)) {
      if (JSON.stringify(local[key]) !== JSON.stringify(remote[key])) {
        // Conflict detected - remote wins
        warnings.push(`Field '${key}' had conflict, using remote version`);
      } else {
        merged[key] = local[key];
      }
    }
    
    return merged;
  }
  
  createMergeStrategy(strategy: string): (local: any, remote: any) => any {
    const strategies: Record<string, (local: any, remote: any) => any> = {
      'remote-wins': (local, remote) => remote,
      'local-wins': (local, remote) => local,
      'last-write-wins': (local, remote) => {
        return local.timestamp > remote.timestamp ? local : remote;
      },
      'array-merge': (local, remote) => {
        return {
          ...remote,
          items: [...(local.items || []), ...(remote.items || [])]
        };
      }
    };
    
    return strategies[strategy] || strategies['remote-wins'];
  }
}

export const conflictResolution = new ConflictResolution();