// CORE DECISION ENGINE - RISK ASSESSMENT
// Evaluates risks for solar installations

export interface RiskAssessment {
  id: string;
  projectId: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  overallScore: number;
  categories: RiskCategory[];
  mitigationPlan: MitigationAction[];
  insuranceRecommendations: string[];
  timestamp: Date;
}

export interface RiskCategory {
  name: string;
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  impact: number;
  likelihood: number;
  riskScore: number;
  description: string;
  mitigation: string;
}

export interface MitigationAction {
  action: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost: number;
  responsible: string;
  deadline: Date;
}

class RiskEngine {
  async assessProjectRisk(
    projectId: string,
    projectData: {
      location: string;
      systemSize: number;
      roofType: string;
      gridReliability: number;
      budget: number;
      installerExperience: string;
    }
  ): Promise<RiskAssessment> {
    const categories: RiskCategory[] = [];
    
    // Technical risks
    categories.push(await this.assessTechnicalRisk(projectData));
    
    // Financial risks
    categories.push(await this.assessFinancialRisk(projectData));
    
    // Operational risks
    categories.push(await this.assessOperationalRisk(projectData));
    
    // Regulatory risks
    categories.push(await this.assessRegulatoryRisk(projectData));
    
    // Environmental risks
    categories.push(await this.assessEnvironmentalRisk(projectData));
    
    // Calculate overall score
    const overallScore = categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length;
    let overallRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (overallScore > 75) overallRisk = 'critical';
    else if (overallScore > 50) overallRisk = 'high';
    else if (overallScore > 25) overallRisk = 'medium';
    
    // Generate mitigation plan
    const mitigationPlan = this.generateMitigationPlan(categories);
    
    // Insurance recommendations
    const insuranceRecommendations = this.getInsuranceRecommendations(categories);
    
    return {
      id: this.generateId(),
      projectId,
      overallRisk,
      overallScore: Math.round(overallScore),
      categories,
      mitigationPlan,
      insuranceRecommendations,
      timestamp: new Date()
    };
  }
  
  private async assessTechnicalRisk(projectData: any): Promise<RiskCategory> {
    const factors: RiskFactor[] = [];
    let score = 0;
    
    // Roof condition risk
    const roofRisk: RiskFactor = {
      name: 'Roof Condition',
      impact: 40,
      likelihood: projectData.roofType === 'old_tile' ? 60 : 20,
      riskScore: 0,
      description: projectData.roofType === 'old_tile' ? 'Aged roof may require reinforcement' : 'Roof structure appears sound',
      mitigation: 'Conduct structural assessment before installation'
    };
    roofRisk.riskScore = (roofRisk.impact * roofRisk.likelihood) / 100;
    factors.push(roofRisk);
    score += roofRisk.riskScore;
    
    // Grid reliability risk
    const gridRisk: RiskFactor = {
      name: 'Grid Reliability',
      impact: 50,
      likelihood: 100 - projectData.gridReliability,
      riskScore: 0,
      description: `Grid reliability is ${projectData.gridReliability}%`,
      mitigation: 'Add battery backup for outage protection'
    };
    gridRisk.riskScore = (gridRisk.impact * gridRisk.likelihood) / 100;
    factors.push(gridRisk);
    score += gridRisk.riskScore;
    
    // Installer experience risk
    const installerRisk: RiskFactor = {
      name: 'Installer Experience',
      impact: 35,
      likelihood: projectData.installerExperience === 'inexperienced' ? 70 : 
                  projectData.installerExperience === 'moderate' ? 30 : 10,
      riskScore: 0,
      description: `Installer experience level: ${projectData.installerExperience}`,
      mitigation: 'Require certified installer with references'
    };
    installerRisk.riskScore = (installerRisk.impact * installerRisk.likelihood) / 100;
    factors.push(installerRisk);
    score += installerRisk.riskScore;
    
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (score > 50) level = 'high';
    else if (score > 25) level = 'medium';
    
    return {
      name: 'Technical Risks',
      score: Math.min(100, score),
      level,
      factors
    };
  }
  
  private async assessFinancialRisk(projectData: any): Promise<RiskCategory> {
    const factors: RiskFactor[] = [];
    let score = 0;
    
    // Budget risk
    const budgetRisk: RiskFactor = {
      name: 'Budget Adequacy',
      impact: 45,
      likelihood: projectData.budget < 800000 ? 60 : 20,
      riskScore: 0,
      description: `Budget: KSh ${projectData.budget.toLocaleString()}`,
      mitigation: 'Explore financing options or phased implementation'
    };
    budgetRisk.riskScore = (budgetRisk.impact * budgetRisk.likelihood) / 100;
    factors.push(budgetRisk);
    score += budgetRisk.riskScore;
    
    // Payback period risk
    const estimatedPayback = this.estimatePayback(projectData);
    const paybackRisk: RiskFactor = {
      name: 'Payback Period',
      impact: 40,
      likelihood: estimatedPayback > 8 ? 70 : estimatedPayback > 6 ? 40 : 15,
      riskScore: 0,
      description: `Estimated payback: ${estimatedPayback} years`,
      mitigation: 'Optimize system size for better ROI'
    };
    paybackRisk.riskScore = (paybackRisk.impact * paybackRisk.likelihood) / 100;
    factors.push(paybackRisk);
    score += paybackRisk.riskScore;
    
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (score > 50) level = 'high';
    else if (score > 25) level = 'medium';
    
    return {
      name: 'Financial Risks',
      score: Math.min(100, score),
      level,
      factors
    };
  }
  
  private async assessOperationalRisk(projectData: any): Promise<RiskCategory> {
    const factors: RiskFactor[] = [];
    let score = 0;
    
    // Maintenance risk
    const maintenanceRisk: RiskFactor = {
      name: 'Maintenance Requirements',
      impact: 30,
      likelihood: 40,
      riskScore: 0,
      description: 'Ongoing maintenance required for optimal performance',
      mitigation: 'Establish maintenance contract or schedule'
    };
    maintenanceRisk.riskScore = (maintenanceRisk.impact * maintenanceRisk.likelihood) / 100;
    factors.push(maintenanceRisk);
    score += maintenanceRisk.riskScore;
    
    // Performance degradation risk
    const degradationRisk: RiskFactor = {
      name: 'Performance Degradation',
      impact: 35,
      likelihood: 50,
      riskScore: 0,
      description: 'Panels degrade 0.5-1% annually',
      mitigation: 'Oversize system by 10-15% to account for degradation'
    };
    degradationRisk.riskScore = (degradationRisk.impact * degradationRisk.likelihood) / 100;
    factors.push(degradationRisk);
    score += degradationRisk.riskScore;
    
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (score > 50) level = 'high';
    else if (score > 25) level = 'medium';
    
    return {
      name: 'Operational Risks',
      score: Math.min(100, score),
      level,
      factors
    };
  }
  
  private async assessRegulatoryRisk(projectData: any): Promise<RiskCategory> {
    const factors: RiskFactor[] = [];
    let score = 0;
    
    const regulatoryRisk: RiskFactor = {
      name: 'Permit Requirements',
      impact: 50,
      likelihood: 60,
      riskScore: 0,
      description: 'Multiple permits may be required',
      mitigation: 'Use permit generation tool to automate applications'
    };
    regulatoryRisk.riskScore = (regulatoryRisk.impact * regulatoryRisk.likelihood) / 100;
    factors.push(regulatoryRisk);
    score += regulatoryRisk.riskScore;
    
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (score > 50) level = 'high';
    else if (score > 25) level = 'medium';
    
    return {
      name: 'Regulatory Risks',
      score: Math.min(100, score),
      level,
      factors
    };
  }
  
  private async assessEnvironmentalRisk(projectData: any): Promise<RiskCategory> {
    const factors: RiskFactor[] = [];
    let score = 0;
    
    const weatherRisk: RiskFactor = {
      name: 'Weather Events',
      impact: 35,
      likelihood: 30,
      riskScore: 0,
      description: 'Hail, storms, or extreme weather could damage system',
      mitigation: 'Ensure proper insurance coverage'
    };
    weatherRisk.riskScore = (weatherRisk.impact * weatherRisk.likelihood) / 100;
    factors.push(weatherRisk);
    score += weatherRisk.riskScore;
    
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (score > 50) level = 'high';
    else if (score > 25) level = 'medium';
    
    return {
      name: 'Environmental Risks',
      score: Math.min(100, score),
      level,
      factors
    };
  }
  
  private generateMitigationPlan(categories: RiskCategory[]): MitigationAction[] {
    const actions: MitigationAction[] = [];
    const now = new Date();
    
    for (const category of categories) {
      for (const factor of category.factors) {
        if (factor.riskScore > 20) {
          actions.push({
            action: factor.mitigation,
            priority: factor.riskScore > 40 ? 'high' : factor.riskScore > 25 ? 'medium' : 'low',
            estimatedCost: this.estimateMitigationCost(factor.name),
            responsible: 'Project Manager',
            deadline: new Date(now.getTime() + 30 * 86400000)
          });
        }
      }
    }
    
    return actions.slice(0, 5);
  }
  
  private getInsuranceRecommendations(categories: RiskCategory[]): string[] {
    const recommendations: string[] = [];
    
    recommendations.push('Property insurance covering solar equipment');
    recommendations.push('Liability insurance for installation period');
    
    for (const category of categories) {
      if (category.name === 'Environmental Risks' && category.score > 30) {
        recommendations.push('Weather damage insurance (hail/wind)');
      }
      if (category.name === 'Operational Risks' && category.score > 30) {
        recommendations.push('Performance guarantee insurance');
      }
    }
    
    return recommendations;
  }
  
  private estimatePayback(projectData: any): number {
    const estimatedCost = 969818;
    const annualSaving = projectData.systemSize * 4.8 * 365 * 0.85 * 25.5 / 1000;
    return estimatedCost / annualSaving;
  }
  
  private estimateMitigationCost(riskName: string): number {
    const costs: Record<string, number> = {
      'Roof Condition': 25000,
      'Grid Reliability': 185000,
      'Installer Experience': 0,
      'Budget Adequacy': 0,
      'Payback Period': 0,
      'Maintenance Requirements': 15000,
      'Performance Degradation': 0,
      'Permit Requirements': 10000,
      'Weather Events': 25000
    };
    return costs[riskName] || 5000;
  }
  
  private generateId(): string {
    return `risk_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const riskEngine = new RiskEngine();