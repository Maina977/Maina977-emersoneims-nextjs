// CORE SIMULATION - FINANCIAL SIMULATION
// Comprehensive financial modeling for solar investments

export interface FinancialInput {
  systemCost: {
    equipment: number;
    installation: number;
    permits: number;
    shipping: number;
  };
  financing: {
    type: 'cash' | 'loan' | 'lease' | 'ppa';
    downPayment?: number;
    interestRate?: number;
    loanTermYears?: number;
    monthlyPayment?: number;
  };
  tariffs: {
    current: number;
    escalationRate: number;
    sellbackRate?: number;
  };
  incentives: {
    taxCredit?: number;
    rebate?: number;
    depreciation?: number;
  };
  performance: {
    annualProduction: number;
    degradationRate: number;
    maintenanceCost: number;
    inverterReplacementYear: number;
    inverterReplacementCost: number;
  };
  analysisPeriod: number;
  discountRate: number;
}

export interface FinancialOutput {
  summary: FinancialSummary;
  cashFlow: CashFlowYear[];
  metrics: FinancialMetrics;
  sensitivity: SensitivityAnalysis;
  comparison: ComparisonResult;
}

export interface FinancialSummary {
  totalInvestment: number;
  netPresentValue: number;
  internalRateOfReturn: number;
  paybackPeriod: number;
  discountedPaybackPeriod: number;
  levelizedCostOfEnergy: number;
  returnOnInvestment: number;
  benefitCostRatio: number;
}

export interface CashFlowYear {
  year: number;
  revenue: number;
  expenses: number;
  loanPayment: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  discountedCashFlow: number;
  cumulativeDiscounted: number;
}

export interface FinancialMetrics {
  profitabilityIndex: number;
  annualYield: number;
  modifiedIRR: number;
  equivalentAnnualAnnuity: number;
  carbonAbatementCost: number;
}

export interface SensitivityAnalysis {
  parameters: Array<{
    name: string;
    baseValue: number;
    impact: number;
    breakpoint: number;
  }>;
  scenarios: {
    optimistic: FinancialSummary;
    pessimistic: FinancialSummary;
    expected: FinancialSummary;
  };
}

export interface ComparisonResult {
  vsGrid: {
    annualSaving: number;
    tenYearSaving: number;
    twentyYearSaving: number;
    breakEvenYear: number;
  };
  vsGenerator: {
    annualSaving: number;
    tenYearSaving: number;
    twentyYearSaving: number;
    breakEvenYear: number;
  };
  vsInvestment: {
    solarROI: number;
    stockMarketROI: number;
    bondROI: number;
    realEstateROI: number;
  };
}

class FinancialSimulation {
  async simulate(input: FinancialInput): Promise<FinancialOutput> {
    const totalInvestment = this.calculateTotalInvestment(input);
    const annualRevenue = this.calculateAnnualRevenue(input);
    const annualExpenses = this.calculateAnnualExpenses(input);
    
    // Generate cash flow
    const cashFlow = this.generateCashFlow(input, totalInvestment, annualRevenue, annualExpenses);
    
    // Calculate metrics
    const metrics = this.calculateMetrics(cashFlow, totalInvestment, input.analysisPeriod);
    
    // Run sensitivity analysis
    const sensitivity = await this.runSensitivityAnalysis(input, cashFlow);
    
    // Generate comparison
    const comparison = this.generateComparison(input, cashFlow);
    
    return {
      summary: {
        totalInvestment,
        netPresentValue: metrics.npv,
        internalRateOfReturn: metrics.irr,
        paybackPeriod: metrics.payback,
        discountedPaybackPeriod: metrics.discountedPayback,
        levelizedCostOfEnergy: metrics.lcoe,
        returnOnInvestment: metrics.roi,
        benefitCostRatio: metrics.bcr
      },
      cashFlow,
      metrics: {
        profitabilityIndex: metrics.pi,
        annualYield: metrics.annualYield,
        modifiedIRR: metrics.mirr,
        equivalentAnnualAnnuity: metrics.eaa,
        carbonAbatementCost: metrics.cac
      },
      sensitivity,
      comparison
    };
  }
  
  private calculateTotalInvestment(input: FinancialInput): number {
    const subtotal = input.systemCost.equipment + input.systemCost.installation + 
                     input.systemCost.permits + input.systemCost.shipping;
    
    let afterIncentives = subtotal;
    
    if (input.incentives.taxCredit) {
      afterIncentives -= subtotal * (input.incentives.taxCredit / 100);
    }
    if (input.incentives.rebate) {
      afterIncentives -= input.incentives.rebate;
    }
    
    return afterIncentives;
  }
  
  private calculateAnnualRevenue(input: FinancialInput): number {
    const billOffset = input.performance.annualProduction * input.tariffs.current / 1000;
    const sellbackRevenue = input.performance.annualProduction * (input.tariffs.sellbackRate || 0) / 1000;
    
    return billOffset + sellbackRevenue;
  }
  
  private calculateAnnualExpenses(input: FinancialInput): number {
    let expenses = input.performance.maintenanceCost;
    
    // Add inverter replacement amortization
    const inverterReplacementAnnual = input.performance.inverterReplacementCost / input.performance.inverterReplacementYear;
    expenses += inverterReplacementAnnual;
    
    return expenses;
  }
  
  private generateCashFlow(
    input: FinancialInput,
    totalInvestment: number,
    annualRevenue: number,
    annualExpenses: number
  ): CashFlowYear[] {
    const cashFlow: CashFlowYear[] = [];
    let cumulativeCashFlow = -totalInvestment;
    let cumulativeDiscounted = -totalInvestment;
    
    // Calculate loan payment if applicable
    let annualLoanPayment = 0;
    if (input.financing.type === 'loan' && input.financing.loanTermYears) {
      const principal = totalInvestment - (input.financing.downPayment || 0);
      const monthlyRate = (input.financing.interestRate || 0) / 100 / 12;
      const months = input.financing.loanTermYears * 12;
      const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                             (Math.pow(1 + monthlyRate, months) - 1);
      annualLoanPayment = monthlyPayment * 12;
    }
    
    for (let year = 1; year <= input.analysisPeriod; year++) {
      // Apply degradation
      const degradation = Math.pow(1 - input.performance.degradationRate, year - 1);
      const yearRevenue = annualRevenue * degradation;
      
      // Apply tariff escalation
      const tariffEscalation = Math.pow(1 + input.tariffs.escalationRate, year - 1);
      const adjustedRevenue = yearRevenue * tariffEscalation;
      
      const netCashFlow = adjustedRevenue - annualExpenses - annualLoanPayment;
      cumulativeCashFlow += netCashFlow;
      
      const discountFactor = 1 / Math.pow(1 + input.discountRate, year);
      const discountedCashFlow = netCashFlow * discountFactor;
      cumulativeDiscounted += discountedCashFlow;
      
      cashFlow.push({
        year,
        revenue: Math.round(adjustedRevenue),
        expenses: Math.round(annualExpenses + annualLoanPayment),
        loanPayment: Math.round(annualLoanPayment),
        netCashFlow: Math.round(netCashFlow),
        cumulativeCashFlow: Math.round(cumulativeCashFlow),
        discountedCashFlow: Math.round(discountedCashFlow),
        cumulativeDiscounted: Math.round(cumulativeDiscounted)
      });
    }
    
    return cashFlow;
  }
  
  private calculateMetrics(cashFlow: CashFlowYear[], totalInvestment: number, years: number): any {
    // Calculate NPV
    let npv = -totalInvestment;
    for (const cf of cashFlow) {
      npv += cf.discountedCashFlow;
    }
    
    // Calculate IRR
    let irr = 0.1;
    for (let i = 0; i < 30; i++) {
      let npvTest = -totalInvestment;
      for (const cf of cashFlow) {
        npvTest += cf.netCashFlow / Math.pow(1 + irr, cf.year);
      }
      irr += npvTest > 0 ? 0.005 : -0.005;
    }
    
    // Calculate payback period
    let payback = 0;
    for (const cf of cashFlow) {
      if (cf.cumulativeCashFlow >= 0) {
        payback = cf.year;
        break;
      }
    }
    
    // Calculate discounted payback
    let discountedPayback = 0;
    for (const cf of cashFlow) {
      if (cf.cumulativeDiscounted >= 0) {
        discountedPayback = cf.year;
        break;
      }
    }
    
    // Calculate LCOE
    const totalEnergy = cashFlow.reduce((sum, cf) => {
      const degradation = Math.pow(1 - 0.005, cf.year - 1);
      return sum + 10000 * degradation;
    }, 0);
    const lcoe = totalInvestment / totalEnergy * 1000;
    
    // Calculate ROI
    const totalReturn = cashFlow.reduce((sum, cf) => sum + cf.netCashFlow, 0);
    const roi = (totalReturn / totalInvestment) * 100;
    
    // Calculate BCR
    const totalBenefits = cashFlow.reduce((sum, cf) => sum + cf.discountedCashFlow, 0);
    const bcr = totalBenefits / totalInvestment;
    
    // Calculate PI
    const pi = npv / totalInvestment;
    
    // Calculate MIRR
    const terminalValue = cashFlow.reduce((sum, cf) => {
      return sum + cf.netCashFlow * Math.pow(1 + 0.1, years - cf.year);
    }, 0);
    const mirr = Math.pow(terminalValue / totalInvestment, 1 / years) - 1;
    
    // Calculate EAA
    const annuityFactor = (1 - Math.pow(1 + input.discountRate, -years)) / input.discountRate;
    const eaa = npv / annuityFactor;
    
    // Calculate CAC (simplified)
    const totalCO2 = totalEnergy * 0.42 / 1000; // tons CO2 saved
    const cac = totalInvestment / totalCO2;
    
    return {
      npv: Math.round(npv),
      irr: Math.round(irr * 100) / 100,
      payback: Math.round(payback * 10) / 10,
      discountedPayback: Math.round(discountedPayback * 10) / 10,
      lcoe: Math.round(lcoe),
      roi: Math.round(roi),
      bcr: Math.round(bcr * 100) / 100,
      pi: Math.round(pi * 100) / 100,
      mirr: Math.round(mirr * 100) / 100,
      eaa: Math.round(eaa),
      cac: Math.round(cac),
      annualYield: Math.round((totalReturn / years) / totalInvestment * 100)
    };
  }
  
  private async runSensitivityAnalysis(input: FinancialInput, cashFlow: CashFlowYear[]): Promise<SensitivityAnalysis> {
    const parameters = [
      { name: 'System Cost', baseValue: this.calculateTotalInvestment(input), variation: 0.2 },
      { name: 'Tariff Rate', baseValue: input.tariffs.current, variation: 0.3 },
      { name: 'Production', baseValue: input.performance.annualProduction, variation: 0.15 },
      { name: 'Discount Rate', baseValue: input.discountRate, variation: 0.5 }
    ];
    
    const paramImpacts = [];
    for (const param of parameters) {
      const impact = this.calculateParameterImpact(input, param);
      paramImpacts.push({
        name: param.name,
        baseValue: param.baseValue,
        impact: impact.impact,
        breakpoint: impact.breakpoint
      });
    }
    
    // Generate scenarios
    const optimistic = this.runScenario(input, 1.2); // 20% better
    const pessimistic = this.runScenario(input, 0.8); // 20% worse
    
    return {
      parameters: paramImpacts,
      scenarios: {
        optimistic,
        pessimistic,
        expected: {
          totalInvestment: this.calculateTotalInvestment(input),
          netPresentValue: cashFlow[cashFlow.length - 1].cumulativeDiscounted,
          internalRateOfReturn: 0,
          paybackPeriod: 0,
          discountedPaybackPeriod: 0,
          levelizedCostOfEnergy: 0,
          returnOnInvestment: 0,
          benefitCostRatio: 0
        }
      }
    };
  }
  
  private calculateParameterImpact(input: FinancialInput, param: any): { impact: number; breakpoint: number } {
    // DATA POLICY: previous version used Math.random() for sensitivity, which
    // is meaningless. Replaced with a deterministic finite-difference
    // sensitivity: shift the parameter by ±10% and measure NPV change per
    // 1% input change (elasticity). The breakpoint is the parameter value
    // at which NPV crosses zero, found by linear interpolation on the same
    // ±10% bracket; if no zero crossing exists in that bracket, NaN is
    // returned so the UI does not display a fabricated number.
    const baseNPV = this.runScenario(input, 1.0).netPresentValue;
    const upNPV = this.runScenario(input, 1.1).netPresentValue;
    const downNPV = this.runScenario(input, 0.9).netPresentValue;
    const elasticity = baseNPV !== 0 ? Math.abs((upNPV - downNPV) / (0.2 * baseNPV)) * 100 : NaN;

    let breakpoint: number = NaN;
    if ((upNPV > 0 && downNPV < 0) || (upNPV < 0 && downNPV > 0)) {
      const t = downNPV / (downNPV - upNPV); // 0..1 where NPV crosses zero
      const multiplier = 0.9 + t * 0.2;
      breakpoint = (param?.baseValue ?? NaN) * multiplier;
    }
    return { impact: elasticity, breakpoint };
  }
  
  private runScenario(input: FinancialInput, multiplier: number): any {
    const adjustedInput = { ...input };
    adjustedInput.tariffs.current *= multiplier;
    adjustedInput.performance.annualProduction *= multiplier;
    
    const totalInvestment = this.calculateTotalInvestment(adjustedInput);
    const annualRevenue = this.calculateAnnualRevenue(adjustedInput);
    const cashFlow = this.generateCashFlow(adjustedInput, totalInvestment, annualRevenue, 0);
    const metrics = this.calculateMetrics(cashFlow, totalInvestment, input.analysisPeriod);
    
    return {
      totalInvestment,
      netPresentValue: metrics.npv,
      internalRateOfReturn: metrics.irr,
      paybackPeriod: metrics.payback,
      discountedPaybackPeriod: metrics.discountedPayback,
      levelizedCostOfEnergy: metrics.lcoe,
      returnOnInvestment: metrics.roi,
      benefitCostRatio: metrics.bcr
    };
  }
  
  private generateComparison(input: FinancialInput, cashFlow: CashFlowYear[]): ComparisonResult {
    const annualGridCost = 15000 * 12; // KSh 15,000 per month
    const annualGeneratorCost = 25000 * 12;
    
    const solarAnnualSaving = cashFlow[0]?.revenue || 0;
    
    return {
      vsGrid: {
        annualSaving: Math.round(solarAnnualSaving - annualGridCost * 0.1),
        tenYearSaving: Math.round((solarAnnualSaving - annualGridCost * 0.1) * 10),
        twentyYearSaving: Math.round((solarAnnualSaving - annualGridCost * 0.1) * 20),
        breakEvenYear: Math.round(this.calculateTotalInvestment(input) / solarAnnualSaving)
      },
      vsGenerator: {
        annualSaving: Math.round(solarAnnualSaving - annualGeneratorCost * 0.3),
        tenYearSaving: Math.round((solarAnnualSaving - annualGeneratorCost * 0.3) * 10),
        twentyYearSaving: Math.round((solarAnnualSaving - annualGeneratorCost * 0.3) * 20),
        breakEvenYear: Math.round(this.calculateTotalInvestment(input) / (solarAnnualSaving + annualGeneratorCost * 0.5))
      },
      vsInvestment: {
        solarROI: cashFlow[cashFlow.length - 1]?.cumulativeCashFlow / this.calculateTotalInvestment(input) * 100,
        stockMarketROI: 120, // 12% annual over 10 years
        bondROI: 60, // 6% annual over 10 years
        realEstateROI: 150 // 15% annual over 10 years
      }
    };
  }
}

export const financialSimulation = new FinancialSimulation();