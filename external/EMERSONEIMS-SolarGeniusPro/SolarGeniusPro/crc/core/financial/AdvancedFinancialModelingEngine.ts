/**
 * ADVANCED FINANCIAL MODELING ENGINE
 * ==================================
 * Calculate ROI with incentives, financing options, break-even analysis
 * Supports government incentives (US 30% ITC, Kenyan subsidies, etc.)
 * 25-year NPV projections with price escalation
 * 
 * @version 1.0.0
 * @author SolarGeniusPro AI Team
 */

export interface FinancialModel {
  location: string;
  systemSize: number; // kW
  systemCost: number; // KSH
  annualProduction: number; // kWh
  roi: ROIAnalysis;
  financing: FinancingOptions;
  breakEven: BreakEvenAnalysis;
  npvAnalysis: NPVAnalysis;
  governmentIncentives: IncentiveAnalysis;
  scenarios: FinancialScenario[];
}

export interface ROIAnalysis {
  year1: number; // KSH savings
  year5: number;
  year10: number;
  year25: number;
  paybackPeriodMonths: number;
  roiPercentage: number;
}

export interface FinancingOptions {
  cash: {
    totalCost: number;
    upfront: boolean;
  };
  loan: {
    loanAmount: number;
    interestRate: number; // %
    loanTerm: number; // years
    monthlyPayment: number;
    totalInterest: number;
  };
  esco: {
    monthlyPayment: number; // ESCO payment
    systemOwner: string; // ESCO or Customer
    savingsShare: number; // % of savings to customer
  };
  lease: {
    monthlyPayment: number;
    term: number; // years
    maintenanceIncluded: boolean;
  };
}

export interface BreakEvenAnalysis {
  breakEvenDate: Date;
  daysToBreakEven: number;
  monthsToBreakEven: number;
  cumulativeSavingsAtBreakEven: number;
}

export interface NPVAnalysis {
  discountRate: number; // %
  npv: number; // KSH
  irr: number; // Internal Rate of Return %
  projections: YearProjection[];
}

export interface YearProjection {
  year: number;
  production: number; // kWh
  costSavings: number; // KSH
  maintenanceCost: number;
  degradation: number; // %
  netCashFlow: number;
  cumulativeCashFlow: number;
  systemValue: number;
}

export interface IncentiveAnalysis {
  country: string;
  governmentGrants: IncentiveItem[];
  taxCredits: IncentiveItem[];
  netMeteringCredit: IncentiveItem[];
  totalIncentiveValue: number; // KSH
}

export interface IncentiveItem {
  name: string;
  value: number; // KSH
  percentageOfCost: number; // %
  eligibility: string;
  description: string;
}

export interface FinancialScenario {
  name: string; // 'Best Case' | 'Base Case' | 'Worst Case'
  electricityPriceEscalation: number; // %/year
  systemDegradation: number; // %/year
  maintenanceCost: number; // KSH/year
  roi25Year: number; // KSH
  paybackMonths: number;
}

// ============================================================================
// FINANCIAL MODELING ENGINE
// ============================================================================

export class AdvancedFinancialModelingEngine {
  private incentiveDatabase: Record<string, any> = {
    'USA': {
      grants: [
        { name: 'ITC 30%', value: 0.30, type: 'percentage' },
      ],
      netMetering: true,
    },
    'Kenya': {
      grants: [
        { name: 'Government Subsidy', value: 50000, type: 'fixed' },
      ],
      netMetering: false,
      tax: 0.16,
    },
    'South Africa': {
      grants: [
        { name: 'VAT Exemption', value: 0.15, type: 'percentage' },
      ],
      tax: 0.15,
      netMetering: true,
    },
  };

  /**
   * Generate complete financial model
   */
  public generateFinancialModel(params: {
    location: string;
    systemSize: number; // kW
    systemCost: number; // KSH
    avgMonthlyBill: number; // KSH (current)
    interestRate?: number; // %
    loanTerm?: number; // years
    maintenanceCostPerYear?: number;
    systemDegradation?: number; // %/year (default 0.7%)
  }): FinancialModel {
    const degredation = params.systemDegradation || 0.007;
    const maintenanceCost = params.maintenanceCostPerYear || params.systemCost * 0.01; // 1% of cost
    const annualProduction = this.estimateAnnualProduction(params.systemSize, params.location);

    // Calculate current annual bill
    const currentAnnualBill = params.avgMonthlyBill * 12;

    // Get incentives
    const incentives = this.getGovernmentIncentives(params.location, params.systemCost);

    // Generate financing options
    const financing = this.generateFinancingOptions(
      params.systemCost - incentives.totalValue,
      params.interestRate || 10,
      params.loanTerm || 5
    );

    // Calculate 25-year projections
    const projections = this.generate25YearProjections(
      annualProduction,
      currentAnnualBill,
      maintenanceCost,
      degredation,
      incentives.totalValue
    );

    // ROI Analysis
    const roi = this.calculateROI(projections);

    // Break-even
    const breakEven = this.calculateBreakEven(projections, financing.cash.totalCost);

    // NPV
    const npv = this.calculateNPV(projections, financing.cash.totalCost, 0.12); // 12% discount rate

    // Scenarios
    const scenarios = this.generateScenarios(
      projections,
      annualProduction,
      currentAnnualBill,
      maintenanceCost
    );

    return {
      location: params.location,
      systemSize: params.systemSize,
      systemCost: params.systemCost,
      annualProduction,
      roi,
      financing,
      breakEven,
      npvAnalysis: npv,
      governmentIncentives: incentives,
      scenarios,
    };
  }

  /**
   * Calculate 25-year projections
   */
  private generate25YearProjections(
    yearOneProduction: number,
    currentBill: number,
    maintenanceCost: number,
    degradation: number,
    incentiveValue: number
  ): YearProjection[] {
    const projections: YearProjection[] = [];
    const electricityEscalation = 0.08; // 8% annual increase (conservative)

    for (let year = 1; year <= 25; year++) {
      const production = yearOneProduction * Math.pow(1 - degradation, year - 1);
      const avoidedBill = currentBill * Math.pow(1 + electricityEscalation, year - 1);
      const costSavings = (production / 1000) * (avoidedBill / (yearOneProduction / 1000));

      const maintenance = maintenanceCost * year;
      const netCashFlow = year === 1 ? costSavings - maintenance - incentiveValue : costSavings - maintenance;

      let cumulativeCashFlow = 0;
      for (let y = 1; y <= year; y++) {
        const yProd = yearOneProduction * Math.pow(1 - degradation, y - 1);
        const yBill = currentBill * Math.pow(1 + electricityEscalation, y - 1);
        const ySavings = (yProd / 1000) * (yBill / (yearOneProduction / 1000));
        cumulativeCashFlow += ySavings - maintenance;
      }

      // System value (residual value at end of year)
      const systemAge = year;
      const residualValue = (1 - systemAge / 25) * 100000; // Simplified

      projections.push({
        year,
        production,
        costSavings,
        maintenanceCost: maintenance,
        degradation: degradation * 100,
        netCashFlow,
        cumulativeCashFlow,
        systemValue: Math.max(0, residualValue),
      });
    }

    return projections;
  }

  /**
   * Calculate ROI metrics
   */
  private calculateROI(projections: YearProjection[]): ROIAnalysis {
    const p1 = projections[0];
    const p5 = projections[4];
    const p10 = projections[9];
    const p25 = projections[24];

    const paybackMonths = this.findPaybackPeriod(projections) * 12;

    return {
      year1: p1.costSavings,
      year5: p5.cumulativeCashFlow,
      year10: p10.cumulativeCashFlow,
      year25: p25.cumulativeCashFlow,
      paybackPeriodMonths: paybackMonths,
      roiPercentage: (p25.cumulativeCashFlow / 100000) * 100, // Assuming KSH 100k cost
    };
  }

  /**
   * Calculate break-even point
   */
  private calculateBreakEven(projections: YearProjection[], initialCost: number): BreakEvenAnalysis {
    const cumulativeProjection = projections.find((p) => p.cumulativeCashFlow >= initialCost);

    if (!cumulativeProjection) {
      return {
        breakEvenDate: new Date(Date.now() + 25 * 365 * 24 * 3600000),
        daysToBreakEven: 25 * 365,
        monthsToBreakEven: 25 * 12,
        cumulativeSavingsAtBreakEven: 0,
      };
    }

    const years = cumulativeProjection.year;
    const now = new Date();
    const breakEvenDate = new Date(now.getTime() + years * 365 * 24 * 3600000);

    return {
      breakEvenDate,
      daysToBreakEven: years * 365,
      monthsToBreakEven: years * 12,
      cumulativeSavingsAtBreakEven: cumulativeProjection.cumulativeCashFlow,
    };
  }

  /**
   * Calculate NPV
   */
  private calculateNPV(
    projections: YearProjection[],
    initialCost: number,
    discountRate: number
  ): NPVAnalysis {
    let npv = -initialCost; // Initial investment is negative

    for (const projection of projections) {
      const discountFactor = Math.pow(1 + discountRate, projection.year);
      npv += projection.netCashFlow / discountFactor;
    }

    // Simple IRR calculation (internal rate of return)
    let irr = 0;
    for (let rate = 0; rate < 0.3; rate += 0.001) {
      let testNpv = -initialCost;
      for (const projection of projections) {
        const df = Math.pow(1 + rate, projection.year);
        testNpv += projection.netCashFlow / df;
      }
      if (testNpv < 0) {
        irr = rate;
        break;
      }
    }

    return {
      discountRate,
      npv,
      irr: irr * 100,
      projections,
    };
  }

  /**
   * Generate financing options
   */
  private generateFinancingOptions(netCost: number, interestRate: number, loanTerm: number): FinancingOptions {
    // Loan calculation
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const monthlyPayment = (netCost * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalInterest = monthlyPayment * numPayments - netCost;

    // ESCO model (customer pays from savings)
    const escoCost = netCost / loanTerm / 12;
    const savingsShare = 0.7; // Customer gets 70% of savings

    // Lease model
    const leaseCost = (netCost * 0.08) / 12; // 8% annually

    return {
      cash: {
        totalCost: netCost,
        upfront: true,
      },
      loan: {
        loanAmount: netCost,
        interestRate,
        loanTerm,
        monthlyPayment,
        totalInterest,
      },
      esco: {
        monthlyPayment: escoCost,
        systemOwner: 'ESCO',
        savingsShare,
      },
      lease: {
        monthlyPayment: leaseCost,
        term: loanTerm,
        maintenanceIncluded: true,
      },
    };
  }

  /**
   * Get government incentives
   */
  private getGovernmentIncentives(
    country: string,
    systemCost: number
  ): IncentiveAnalysis {
    const countryData = this.incentiveDatabase[country] || { grants: [] };

    const governmentGrants: IncentiveItem[] = [];
    let totalValue = 0;

    if (country === 'USA') {
      const itcValue = systemCost * 0.30;
      governmentGrants.push({
        name: 'Federal Investment Tax Credit (ITC)',
        value: itcValue,
        percentageOfCost: 30,
        eligibility: 'Residential solar installations',
        description: '30% of system cost (through 2032)',
      });
      totalValue += itcValue;
    } else if (country === 'Kenya') {
      governmentGrants.push({
        name: 'Government Solar Subsidy',
        value: 50000,
        percentageOfCost: (50000 / systemCost) * 100,
        eligibility: 'Residential/SME installations',
        description: 'Fixed subsidy for solar adoption',
      });
      totalValue += 50000;
    }

    const netMeteringCredit: IncentiveItem[] = [];
    if (country === 'USA' || country === 'South Africa') {
      netMeteringCredit.push({
        name: 'Net Metering Credits',
        value: systemCost * 0.15, // Estimated annual value
        percentageOfCost: 15,
        eligibility: 'Grid-connected systems',
        description: 'Credit for excess energy fed to grid',
      });
    }

    return {
      country,
      governmentGrants,
      taxCredits: [],
      netMeteringCredit,
      totalIncentiveValue: totalValue,
    };
  }

  /**
   * Generate scenario analysis
   */
  private generateScenarios(
    baseProjections: YearProjection[],
    annualProduction: number,
    currentBill: number,
    maintenanceCost: number
  ): FinancialScenario[] {
    return [
      {
        name: 'Best Case',
        electricityPriceEscalation: 0.12, // 12%/year
        systemDegradation: 0.005, // 0.5%/year
        maintenanceCost: maintenanceCost * 0.8,
        roi25Year: baseProjections[24].cumulativeCashFlow * 1.2,
        paybackMonths: 36,
      },
      {
        name: 'Base Case',
        electricityPriceEscalation: 0.08,
        systemDegradation: 0.007,
        maintenanceCost,
        roi25Year: baseProjections[24].cumulativeCashFlow,
        paybackMonths: 48,
      },
      {
        name: 'Worst Case',
        electricityPriceEscalation: 0.04, // 4%/year
        systemDegradation: 0.01, // 1%/year
        maintenanceCost: maintenanceCost * 1.3,
        roi25Year: baseProjections[24].cumulativeCashFlow * 0.7,
        paybackMonths: 60,
      },
    ];
  }

  /**
   * Estimate annual production
   */
  private estimateAnnualProduction(systemSizeKw: number, location: string): number {
    const locationFactors: Record<string, number> = {
      'Kenya': 1700, // kWh/kW/year (excellent resource)
      'South Africa': 1600,
      'USA': 1400,
      'Europe': 1000,
    };

    const factor = locationFactors[location] || 1200;
    return systemSizeKw * factor;
  }

  /**
   * Find payback period in years
   */
  private findPaybackPeriod(projections: YearProjection[]): number {
    const cumulative = projections.find((p) => p.cumulativeCashFlow > 0);
    return cumulative?.year || 25;
  }
}

export default AdvancedFinancialModelingEngine;
