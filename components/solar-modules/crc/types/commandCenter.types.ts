// Command Center AI Type Definitions

export interface AdvisorMessage {
  id: string;
  type: 'recommendation' | 'insight' | 'alert' | 'tip';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

export interface VoiceCommand {
  command: string;
  intent: string;
  entities: Record<string, any>;
  confidence: number;
}

export interface VoiceResponse {
  text: string;
  action?: string;
  data?: any;
  confidence: number;
}

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
  recommendations: string[];
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewedBy?: string;
}

export interface SmartAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  category: 'performance' | 'maintenance' | 'safety' | 'financial' | 'weather';
  source: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
  actions: AlertAction[];
}

export interface AlertAction {
  label: string;
  action: string;
  params: Record<string, any>;
}

export interface ExecutiveMetrics {
  period: { start: Date; end: Date };
  financial: {
    totalRevenue: number;
    totalSavings: number;
    projectedROI: number;
    averagePayback: number;
  };
  operational: {
    totalSystems: number;
    totalCapacityMW: number;
    activeProjects: number;
    completedProjects: number;
  };
  performance: {
    averageSystemEfficiency: number;
    averageUptime: number;
    totalEnergyGenerated: number;
    co2Offset: number;
  };
}