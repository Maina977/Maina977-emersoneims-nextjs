// DECISION SUMMARY
// Summarizes AI decisions for executive review

export interface DecisionSummary {
  id: string;
  title: string;
  description: string;
  type: 'recommendation' | 'alert' | 'insight' | 'action_required';
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: {
    financial: number;
    timeline: number;
    risk: number;
  };
  reasoning: string[];
  supportingData: Record<string, any>;
  recommendations: string[];
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewedBy?: string;
}

class DecisionSummaryService {
  private summaries: DecisionSummary[] = [];
  private maxSummaries: number = 1000;
  
  async create(summary: Omit<DecisionSummary, 'id' | 'timestamp' | 'status'>): Promise<DecisionSummary> {
    const newSummary: DecisionSummary = {
      ...summary,
      id: this.generateId(),
      timestamp: new Date(),
      status: 'pending'
    };
    
    this.summaries.push(newSummary);
    
    if (this.summaries.length > this.maxSummaries) {
      this.summaries = this.summaries.slice(-this.maxSummaries);
    }
    
    return newSummary;
  }
  
  async getDecision(id: string): Promise<DecisionSummary | null> {
    return this.summaries.find(s => s.id === id) || null;
  }
  
  async getDecisions(options?: {
    type?: string;
    priority?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<DecisionSummary[]> {
    let results = [...this.summaries];
    
    if (options?.type) {
      results = results.filter(s => s.type === options.type);
    }
    if (options?.priority) {
      results = results.filter(s => s.priority === options.priority);
    }
    if (options?.status) {
      results = results.filter(s => s.status === options.status);
    }
    if (options?.startDate) {
      results = results.filter(s => s.timestamp >= options.startDate!);
    }
    if (options?.endDate) {
      results = results.filter(s => s.timestamp <= options.endDate!);
    }
    
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const limit = options?.limit || 50;
    return results.slice(0, limit);
  }
  
  async getPendingDecisions(): Promise<DecisionSummary[]> {
    return this.getDecisions({ status: 'pending' });
  }
  
  async getHighPriorityDecisions(): Promise<DecisionSummary[]> {
    return this.getDecisions({ priority: 'high' });
  }
  
  async getCriticalDecisions(): Promise<DecisionSummary[]> {
    return this.getDecisions({ priority: 'critical' });
  }
  
  async reviewDecision(id: string, reviewerId: string): Promise<DecisionSummary | null> {
    const decision = await this.getDecision(id);
    if (!decision) return null;
    
    decision.status = 'reviewed';
    decision.reviewedBy = reviewerId;
    
    const index = this.summaries.findIndex(s => s.id === id);
    if (index !== -1) this.summaries[index] = decision;
    
    return decision;
  }
  
  async approveDecision(id: string, reviewerId: string): Promise<DecisionSummary | null> {
    const decision = await this.getDecision(id);
    if (!decision) return null;
    
    decision.status = 'approved';
    decision.reviewedBy = reviewerId;
    
    const index = this.summaries.findIndex(s => s.id === id);
    if (index !== -1) this.summaries[index] = decision;
    
    return decision;
  }
  
  async rejectDecision(id: string, reviewerId: string, reason?: string): Promise<DecisionSummary | null> {
    const decision = await this.getDecision(id);
    if (!decision) return null;
    
    decision.status = 'rejected';
    decision.reviewedBy = reviewerId;
    if (reason) decision.reasoning.push(`Rejected: ${reason}`);
    
    const index = this.summaries.findIndex(s => s.id === id);
    if (index !== -1) this.summaries[index] = decision;
    
    return decision;
  }
  
  async getExecutiveSummary(tenantId: string, days: number = 7): Promise<{
    totalDecisions: number;
    pendingCount: number;
    criticalCount: number;
    financialImpact: number;
    topRecommendations: DecisionSummary[];
    decisionsByType: Record<string, number>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const decisions = await this.getDecisions({ startDate });
    const tenantDecisions = decisions.filter(d => d.supportingData.tenantId === tenantId);
    
    const pendingCount = tenantDecisions.filter(d => d.status === 'pending').length;
    const criticalCount = tenantDecisions.filter(d => d.priority === 'critical').length;
    const financialImpact = tenantDecisions.reduce((sum, d) => sum + d.impact.financial, 0);
    
    const decisionsByType: Record<string, number> = {};
    for (const d of tenantDecisions) {
      decisionsByType[d.type] = (decisionsByType[d.type] || 0) + 1;
    }
    
    const topRecommendations = tenantDecisions
      .filter(d => d.type === 'recommendation')
      .sort((a, b) => b.impact.financial - a.impact.financial)
      .slice(0, 5);
    
    return {
      totalDecisions: tenantDecisions.length,
      pendingCount,
      criticalCount,
      financialImpact,
      topRecommendations,
      decisionsByType
    };
  }
  
  async createSystemRecommendation(
    tenantId: string,
    currentSystemKw: number,
    recommendedSystemKw: number,
    savings: number
  ): Promise<DecisionSummary> {
    return this.create({
      title: 'System Upgrade Recommendation',
      description: `Upgrade from ${currentSystemKw}kW to ${recommendedSystemKw}kW`,
      type: 'recommendation',
      priority: savings > 500000 ? 'high' : 'medium',
      impact: {
        financial: savings,
        timeline: 30,
        risk: 15
      },
      reasoning: [
        `Current system covers ${Math.round(currentSystemKw / recommendedSystemKw * 100)}% of needs`,
        `Upgrade would save KSh ${savings.toLocaleString()} over 10 years`,
        `Payback period: ${Math.round(recommendedSystemKw * 95000 / (savings / 10))} months`
      ],
      supportingData: {
        tenantId,
        currentSystemKw,
        recommendedSystemKw,
        savings
      },
      recommendations: [
        `Install ${recommendedSystemKw}kW system`,
        `Add battery backup for complete independence`,
        `Apply for net metering`
      ]
    });
  }
  
  private generateId(): string {
    return `dec_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const decisionSummary = new DecisionSummaryService();