// CORE AI - FINANCIAL MODEL
// AI-powered financial analysis and optimization

export interface FinancialAnalysisRequest {
  systemSpecs: {
    sizeKw: number;
    batteryKwh: number;
    componentQuality: 'economy' | 'standard' | 'premium';
  };
  location: {
    country: string;
    region: string;
    tariff: number;
    escalationRate?: number;
  };
  financing: {
    type: 'cash' | 'loan' | 'lease' | 'ppa';
    downPaymentPercent?: number;
    interestRate?: number;
    termYears?: number;
  };
  userProfile: {
    creditScore?: number;
    monthlyBill: number;
    riskTolerance: 'low' | 'medium' | 'high';
  };
}

export interface FinancialAnalysisResponse {
  summary: FinancialSummary;
  cashFlows: CashFlowProjection[];
  metrics: FinancialMetrics;
  optimization: OptimizationSuggestions;
  riskAssessment: RiskAssessment;
}

export interface FinancialSummary {
  totalInvestment: number;
  netPresentValue: number;
  internalRateOfReturn: number;
  paybackPeriod: number;
  levelizedCost: number;
  returnOnInvestment: number;
}

export interface CashFlowProjection {
  year: number;
  savings: number;
  costs: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  debtService?: number;
}

export interface FinancialMetrics {
  profitabilityIndex: number;
  modifiedIRR: number;
  equivalentAnnualAnnuity: number;
  benefitCostRatio: number;
  carbonAbatementCost: number;
}

export interface OptimizationSuggestions {
  recommendations: string[];
  potentialSavings: number;
  optimalFinancing: string;
  roiImprovement: number;
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high';
  score: number;
  factors: RiskFactor[];
  mitigationStrategies: string[];
}

export interface RiskFactor {
  name: string;
  impact: number;
  likelihood: number;
  description: string;
}

class FinancialModel {
  async analyze(request: FinancialAnalysisRequest): Promise<FinancialAnalysisResponse> {
    // Calculate base costs
    const totalInvestment = this.calculateInvestment(request);
    const annualSavings = this.calculateAnnualSavings(request);
    const annualCosts = this.calculateAnnualCosts(request);
    
    // Generate cash flow projections
    const cashFlows = this.generateCashFlows(request, totalInvestment, annualSavings, annualCosts);
    
    // Calculate metrics
    const metrics = this.calculateMetrics(cashFlows, totalInvestment);
    
    // Run optimization
    const optimization = await this.optimizeFinancing(request, cashFlows);
    
    // Assess risks
    const riskAssessment = this.assessRisks(request, cashFlows);
    
    return {
      summary: {
        totalInvestment,
        netPresentValue: metrics.npv,
        internalRateOfReturn: metrics.irr,
        paybackPeriod: metrics.payback,
        levelizedCost: metrics.lcoe,
        returnOnInvestment: metrics.roi
      },
      cashFlows,
      metrics: {
        profitabilityIndex: metrics.pi,
        modifiedIRR: metrics.mirr,
        equivalentAnnualAnnuity: metrics.eaa,
        benefitCostRatio: metrics.bcr,
        carbonAbatementCost: metrics.cac
      },
      optimization,
      riskAssessment
    };
  }
  
  private calculateInvestment(request: FinancialAnalysisRequest): number {
    const equipmentCost = request.systemSpecs.sizeKw * 95000;
    const batteryCost = request.systemSpecs.batteryKwh * 36000;
    const qualityMultiplier = {
      economy: 0.85,
      standard: 1.0,
      premium: 1.25
    };
    
    const baseCost = equipmentCost + batteryCost;
    const adjustedCost = baseCost * qualityMultiplier[request.systemSpecs.componentQuality];
    
    return Math.round(adjustedCost);
  }
  
  private calculateAnnualSavings(request: FinancialAnalysisRequest): number {
    const annualProduction = request.systemSpecs.sizeKw * 4.8 * 365 * 0.85;
    const tariff = request.location.tariff;
    const escalation = request.location.escalationRate || 0.03;
    
    return annualProduction * tariff / 1000 * (1 + escalation);
  }
  
  private calculateAnnualCosts(request: FinancialAnalysisRequest): number {
    const maintenanceCost = request.systemSpecs.sizeKw * 1500;
    const insuranceCost = request.systemSpecs.sizeKw * 1000;
    return maintenanceCost + insuranceCost;
  }
  
  private generateCashFlows(
    request: FinancialAnalysisRequest,
    investment: number,
    annualSavings: number,
    annualCosts: number
  ): CashFlowProjection[] {
    const cashFlows: CashFlowProjection[] = [];
    let cumulativeCashFlow = -investment;
    let debtService = 0;
    
    // Calculate loan payments if applicable
    if (request.financing.type === 'loan') {
      const loanAmount = investment * (1 - (request.financing.downPaymentPercent || 0) / 100);
      const monthlyRate = (request.financing.interestRate || 12) / 100 / 12;
      const months = (request.financing.termYears || 10) * 12;
      const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                             (Math.pow(1 + monthlyRate, months) - 1);
      debtService = monthlyPayment * 12;
    }
    
    for (let year = 1; year <= 25; year++) {
      const degradation = Math.pow(0.995, year - 1);
      const tariffEscalation = Math.pow(1 + (request.location.escalationRate || 0.03), year - 1);
      
      const savings = annualSavings * degradation * tariffEscalation;
      const costs = annualCosts * (1 + 0.02 * (year - 1));
      const netCashFlow = savings - costs - debtService;
      cumulativeCashFlow += netCashFlow;
      
      cashFlows.push({
        year,
        savings: Math.round(savings),
        costs: Math.round(costs),
        netCashFlow: Math.round(netCashFlow),
        cumulativeCashFlow: Math.round(cumulativeCashFlow),
        debtService: debtService > 0 ? Math.round(debtService) : undefined
      });
    }
    
    return cashFlows;
  }
  
  private calculateMetrics(cashFlows: CashFlowProjection[], investment: number): any {
    const discountRate = 0.1;
    let npv = -investment;
    
    for (const cf of cashFlows) {
      npv += cf.netCashFlow / Math.pow(1 + discountRate, cf.year);
    }
    
    // Calculate IRR
    let irr = 0.1;
    for (let i = 0; i < 30; i++) {
      let npvTest = -investment;
      for (const cf of cashFlows) {
        npvTest += cf.netCashFlow / Math.pow(1 + irr, cf.year);
      }
      irr += npvTest > 0 ? 0.005 : -0.005;
    }
    
    // Calculate payback
    let payback = 0;
    for (const cf of cashFlows) {
      if (cf.cumulativeCashFlow >= 0) {
        payback = cf.year;
        break;
      }
    }
    
    // Calculate LCOE
    const totalEnergy = cashFlows.reduce((sum, cf) => {
      const degradation = Math.pow(0.995, cf.year - 1);
      return sum + 10000 * degradation;
    }, 0);
    const lcoe = investment / totalEnergy * 1000;
    
    // Calculate ROI
    const totalReturn = cashFlows.reduce((sum, cf) => sum + cf.netCashFlow, 0);
    const roi = (totalReturn / investment) * 100;
    
    // Calculate PI
    const pi = npv / investment;
    
    // Calculate MIRR
    const terminalValue = cashFlows.reduce((sum, cf) => {
      return sum + cf.netCashFlow * Math.pow(1 + 0.1, 25 - cf.year);
    }, 0);
    const mirr = Math.pow(terminalValue / investment, 1 / 25) - 1;
    
    // Calculate EAA
    const annuityFactor = (1 - Math.pow(1 + discountRate, -25)) / discountRate;
    const eaa = npv / annuityFactor;
    
    // Calculate BCR
    const totalBenefits = cashFlows.reduce((sum, cf) => sum + cf.savings / Math.pow(1 + discountRate, cf.year), 0);
    const bcr = totalBenefits / investment;
    
    // Calculate CAC
    const totalCO2 = totalEnergy * 0.42 / 1000;
    const cac = investment / totalCO2;
    
    return {
      npv: Math.round(npv),
      irr: Math.round(irr * 100) / 100,
      payback: Math.round(payback * 10) / 10,
      lcoe: Math.round(lcoe),
      roi: Math.round(roi),
      pi: Math.round(pi * 100) / 100,
      mirr: Math.round(mirr * 100) / 100,
      eaa: Math.round(eaa),
      bcr: Math.round(bcr * 100) / 100,
      cac: Math.round(cac)
    };
  }
  
  private async optimizeFinancing(request: FinancialAnalysisRequest, cashFlows: CashFlowProjection[]): Promise<OptimizationSuggestions> {
    const recommendations = [];
    let potentialSavings = 0;
    
    // Analyze financing options
    const cashScenario = await this.evaluateFinancingScenario({ ...request, financing: { type: 'cash' } });
    const loanScenario = await this.evaluateFinancingScenario({ ...request, financing: { type: 'loan', downPaymentPercent: 20, interestRate: 12, termYears: 10 } });
    
    let optimalFinancing = 'cash';
    let roiImprovement = 0;
    
    if (loanScenario.metrics.irr > cashScenario.metrics.irr) {
      optimalFinancing = 'loan';
      roiImprovement = loanScenario.metrics.irr - cashScenario.metrics.irr;
      recommendations.push('Loan financing improves ROI by ' + roiImprovement.toFixed(1) + '%');
    }
    
    // Check for battery optimization
    if (request.systemSpecs.batteryKwh === 0 && request.userProfile.riskTolerance !== 'low') {
      recommendations.push('Adding battery backup would increase energy independence by 40%');
      potentialSavings += 25000;
    }
    
    // Check for component quality upgrade
    if (request.systemSpecs.componentQuality !== 'premium' && request.userProfile.riskTolerance === 'high') {
      recommendations.push('Premium components provide better long-term reliability and warranty');
    }
    
    return {
      recommendations,
      potentialSavings: Math.round(potentialSavings),
      optimalFinancing,
      roiImprovement: Math.round(roiImprovement * 100) / 100
    };
  }
  
  private async evaluateFinancingScenario(request: FinancialAnalysisRequest): Promise<any> {
    const investment = this.calculateInvestment(request);
    const annualSavings = this.calculateAnnualSavings(request);
    const cashFlows = this.generateCashFlows(request, investment, annualSavings, 0);
    return this.calculateMetrics(cashFlows, investment);
  }
  
  private assessRisks(request: FinancialAnalysisRequest, cashFlows: CashFlowProjection[]): RiskAssessment {
    const factors: RiskFactor[] = [];
    let score = 0;
    
    // Payback period risk
    const payback = cashFlows.find(cf => cf.cumulativeCashFlow >= 0)?.year || 25;
    if (payback > 10) {
      score += 30;
      factors.push({
        name: 'Extended Payback Period',
        impact: 30,
        likelihood: 70,
        description: `Payback period of ${payback} years exceeds typical 8-10 year range`
      });
    }
    
    // Tariff volatility risk
    factors.push({
      name: 'Tariff Volatility',
      impact: 25,
      likelihood: 40,
      description: 'Future electricity tariff changes could affect savings'
    });
    
    // Technology risk
    if (request.systemSpecs.componentQuality !== 'premium') {
      score += 20;
      factors.push({
        name: 'Component Quality',
        impact: 20,
        likelihood: 30,
        description: 'Standard quality components may have higher failure rates'
      });
    }
    
    // Credit risk for financing
    if (request.financing.type === 'loan' && (!request.userProfile.creditScore || request.userProfile.creditScore < 600)) {
      score += 25;
      factors.push({
        name: 'Financing Approval Risk',
        impact: 25,
        likelihood: 50,
        description: 'Lower credit score may affect loan approval or rates'
      });
    }
    
    let level: 'low' | 'medium' | 'high' = 'low';
    if (score > 60) level = 'high';
    else if (score > 30) level = 'medium';
    
    const mitigationStrategies = [];
    if (level !== 'low') {
      mitigationStrategies.push('Consider shorter loan term to reduce interest');
      mitigationStrategies.push('Add battery backup for energy independence');
      mitigationStrategies.push('Request multiple financing quotes');
    }
    
    return {
      level,
      score,
      factors,
      mitigationStrategies
    };
  }
  
  async compareScenarios(scenarios: FinancialAnalysisRequest[]): Promise<{
    bestByMetric: Record<string, any>;
    rankings: Array<{ scenario: string; score: number }>;
    recommendation: string;
  }> {
    const results = [];
    
    for (const scenario of scenarios) {
      const analysis = await this.analyze(scenario);
      results.push({
        name: `${scenario.systemSpecs.sizeKw}kW - ${scenario.financing.type}`,
        metrics: analysis.metrics,
        summary: analysis.summary
      });
    }
    
    // Find best by each metric
    const bestByMetric: Record<string, any> = {
      roi: results.reduce((best, curr) => curr.summary.returnOnInvestment > best.summary.returnOnInvestment ? curr : best, results[0]),
      payback: results.reduce((best, curr) => curr.summary.paybackPeriod < best.summary.paybackPeriod ? curr : best, results[0]),
      npv: results.reduce((best, curr) => curr.summary.netPresentValue > best.summary.netPresentValue ? curr : best, results[0])
    };
    
    // Calculate overall score
    const rankings = results.map(r => ({
      scenario: r.name,
      score: (r.summary.returnOnInvestment / 100) * 0.4 + 
             (1 / r.summary.paybackPeriod) * 0.3 + 
             (r.summary.netPresentValue / 1000000) * 0.3
    })).sort((a, b) => b.score - a.score);
    
    return {
      bestByMetric,
      rankings,
      recommendation: rankings[0]?.scenario || 'No clear recommendation'
    };
  }
}

export const financialModel = new FinancialModel();
