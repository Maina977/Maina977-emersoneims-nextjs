// QUEUE SYSTEM FOR BACKGROUND JOBS
// Manages async processing queues

export interface QueueJob {
  id: string;
  name: string;
  data: any;
  priority: 'high' | 'normal' | 'low';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  result?: any;
}

export interface QueueConfig {
  concurrency: number;
  maxAttempts: number;
  timeout: number; // milliseconds
}

class QueueSystem {
  private queues: Map<string, QueueJob[]> = new Map();
  private processing: Map<string, boolean> = new Map();
  private handlers: Map<string, (data: any) => Promise<any>> = new Map();
  private config: QueueConfig = {
    concurrency: 5,
    maxAttempts: 3,
    timeout: 30000 // 30 seconds
  };
  
  async addJob(name: string, data: any, priority: QueueJob['priority'] = 'normal'): Promise<string> {
    const id = this.generateJobId();
    const job: QueueJob = {
      id,
      name,
      data,
      priority,
      status: 'pending',
      attempts: 0,
      maxAttempts: this.config.maxAttempts,
      createdAt: new Date()
    };
    
    const queue = this.queues.get(name) || [];
    queue.push(job);
    this.queues.set(name, queue);
    
    // Sort by priority
    this.sortQueue(name);
    
    // Trigger processing
    this.processQueue(name);
    
    return id;
  }
  
  async registerHandler(name: string, handler: (data: any) => Promise<any>): Promise<void> {
    this.handlers.set(name, handler);
  }
  
  async getJob(jobId: string): Promise<QueueJob | null> {
    for (const [name, queue] of this.queues) {
      const job = queue.find(j => j.id === jobId);
      if (job) return job;
    }
    return null;
  }
  
  async getQueueStatus(name: string): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    const queue = this.queues.get(name) || [];
    
    return {
      pending: queue.filter(j => j.status === 'pending').length,
      processing: queue.filter(j => j.status === 'processing').length,
      completed: queue.filter(j => j.status === 'completed').length,
      failed: queue.filter(j => j.status === 'failed').length
    };
  }
  
  async getAllQueues(): Promise<string[]> {
    return Array.from(this.queues.keys());
  }
  
  async retryFailedJob(jobId: string): Promise<boolean> {
    const job = await this.getJob(jobId);
    if (!job || job.status !== 'failed') return false;
    
    job.status = 'pending';
    job.attempts = 0;
    job.error = undefined;
    
    const queue = this.queues.get(job.name);
    if (queue) {
      const index = queue.findIndex(j => j.id === jobId);
      if (index !== -1) {
        queue[index] = job;
        this.sortQueue(job.name);
      }
    }
    
    this.processQueue(job.name);
    return true;
  }
  
  async retryAllFailedJobs(name: string): Promise<number> {
    const queue = this.queues.get(name) || [];
    let count = 0;
    
    for (const job of queue) {
      if (job.status === 'failed') {
        job.status = 'pending';
        job.attempts = 0;
        job.error = undefined;
        count++;
      }
    }
    
    if (count > 0) {
      this.sortQueue(name);
      this.processQueue(name);
    }
    
    return count;
  }
  
  async clearQueue(name: string): Promise<number> {
    const queue = this.queues.get(name) || [];
    const count = queue.length;
    this.queues.set(name, []);
    return count;
  }
  
  async pauseQueue(name: string): Promise<void> {
    this.processing.set(name, false);
  }
  
  async resumeQueue(name: string): Promise<void> {
    this.processing.set(name, true);
    this.processQueue(name);
  }
  
  updateConfig(config: Partial<QueueConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  private async processQueue(name: string): Promise<void> {
    if (this.processing.get(name) === false) return;
    if (this.processing.get(name) === true) return;
    
    this.processing.set(name, true);
    
    try {
      const queue = this.queues.get(name) || [];
      const pendingJobs = queue.filter(j => j.status === 'pending');
      
      // Process jobs with concurrency limit
      const processingJobs = queue.filter(j => j.status === 'processing');
      const availableSlots = this.config.concurrency - processingJobs.length;
      
      const toProcess = pendingJobs.slice(0, availableSlots);
      
      for (const job of toProcess) {
        this.processJob(job).catch(console.error);
      }
    } finally {
      this.processing.set(name, false);
      
      // Check if more jobs to process
      const queue = this.queues.get(name) || [];
      const hasPending = queue.some(j => j.status === 'pending');
      if (hasPending) {
        setTimeout(() => this.processQueue(name), 100);
      }
    }
  }
  
  private async processJob(job: QueueJob): Promise<void> {
    const handler = this.handlers.get(job.name);
    if (!handler) {
      job.status = 'failed';
      job.error = `No handler registered for job: ${job.name}`;
      return;
    }
    
    job.status = 'processing';
    job.startedAt = new Date();
    job.attempts++;
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Job timeout')), this.config.timeout);
    });
    
    try {
      const result = await Promise.race([handler(job.data), timeoutPromise]);
      job.status = 'completed';
      job.completedAt = new Date();
      job.result = result;
    } catch (error) {
      job.error = error.message;
      
      if (job.attempts >= job.maxAttempts) {
        job.status = 'failed';
      } else {
        job.status = 'pending';
      }
    }
    
    // Update job in queue
    const queue = this.queues.get(job.name);
    if (queue) {
      const index = queue.findIndex(j => j.id === job.id);
      if (index !== -1) {
        queue[index] = job;
      }
    }
  }
  
  private sortQueue(name: string): void {
    const queue = this.queues.get(name);
    if (!queue) return;
    
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    queue.sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    this.queues.set(name, queue);
  }
  
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const queueSystem = new QueueSystem();