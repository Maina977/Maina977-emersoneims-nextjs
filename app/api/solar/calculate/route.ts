import { NextRequest, NextResponse } from 'next/server';

// Kenyan city → approx peak sun hours (kWh/m²/day)
const LOCATION_PSH: Record<string, number> = {
  nairobi: 5.5,
  mombasa: 5.8,
  kisumu: 5.2,
  nakuru: 5.4,
  eldoret: 5.0,
  thika: 5.3,
  malindi: 5.9,
  garissa: 6.2,
  kakamega: 4.8,
  nyeri: 5.1,
};

// KES market rates (approximate, mid-2025)
const PANEL_COST_PER_KW_KES = 85000;   // 400 W mono panel + mounting
const INVERTER_COST_PER_KW_KES = 40000;
const BATTERY_COST_PER_KWH_KES = 55000; // LiFePO4
const INSTALLATION_RATE = 0.15;          // 15% of equipment cost
const KPLC_RATE_KES_PER_KWH = 24.5;     // Kenya Power residential tariff (2025)
const PANEL_WATT = 400;
const SYSTEM_EFFICIENCY = 0.78;          // derate: wiring, inverter, temp, soiling
const DAYS_AUTONOMY = 1.5;              // battery backup days

function getPeakSunHours(location: string): number {
  const key = location.toLowerCase().replace(/[^a-z]/g, '');
  for (const [city, psh] of Object.entries(LOCATION_PSH)) {
    if (key.includes(city) || city.includes(key)) return psh;
  }
  return 5.3; // Kenya average fallback
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { consumption, location = 'nairobi', roofType = 'pitched', budget } = body;

    const monthlyKwh = Number(consumption);
    if (!monthlyKwh || monthlyKwh <= 0) {
      return NextResponse.json({ error: 'consumption must be a positive number (kWh/month)' }, { status: 400 });
    }

    const peakSunHours = getPeakSunHours(location);
    const dailyKwh = monthlyKwh / 30;

    // Roof-type yield factor
    const roofFactor = roofType === 'flat' ? 0.95 : roofType === 'ground' ? 1.05 : 1.0;

    // System sizing: kW needed to cover daily load with given PSH & efficiency
    const rawSystemKw = dailyKwh / (peakSunHours * SYSTEM_EFFICIENCY * roofFactor);
    const systemKw = Math.ceil(rawSystemKw * 10) / 10; // round up to 0.1 kW

    const panels = Math.ceil((systemKw * 1000) / PANEL_WATT);
    const actualSystemKw = Math.round((panels * PANEL_WATT) / 1000 * 10) / 10;

    const inverterKw = Math.ceil(actualSystemKw * 1.1 * 10) / 10; // 10% headroom
    const batteryKwh = Math.ceil(dailyKwh * DAYS_AUTONOMY * 10) / 10;

    // Annual production
    const annualProductionKwh = actualSystemKw * peakSunHours * 365 * SYSTEM_EFFICIENCY;
    const annualProductionWh = Math.round(annualProductionKwh * 1000);

    // Costs (KES)
    const equipmentCost =
      actualSystemKw * PANEL_COST_PER_KW_KES +
      inverterKw * INVERTER_COST_PER_KW_KES +
      batteryKwh * BATTERY_COST_PER_KWH_KES;
    const totalCost = Math.round(equipmentCost * (1 + INSTALLATION_RATE));

    // Monthly saving = units generated / month × tariff, capped at consumption
    const monthlyProductionKwh = annualProductionKwh / 12;
    const billableKwh = Math.min(monthlyProductionKwh, monthlyKwh);
    const monthlySaving = Math.round(billableKwh * KPLC_RATE_KES_PER_KWH);

    // Payback
    const annualSaving = monthlySaving * 12;
    const paybackYears = annualSaving > 0 ? (totalCost / annualSaving).toFixed(1) : 'N/A';

    // Carbon offset: Kenya grid factor ≈ 0.314 kg CO₂/kWh
    const carbonOffsetKgPerYear = Math.round(annualProductionKwh * 0.314);

    // Budget check
    let budgetNote: string | undefined;
    if (budget && Number(budget) > 0 && totalCost > Number(budget)) {
      const affordable = Math.floor((Number(budget) / (1 + INSTALLATION_RATE)) / (PANEL_COST_PER_KW_KES + INVERTER_COST_PER_KW_KES * 1.1 + BATTERY_COST_PER_KWH_KES * DAYS_AUTONOMY / actualSystemKw) * 10) / 10;
      budgetNote = `Budget KES ${Number(budget).toLocaleString()} is below estimated cost. Consider a ${affordable > 0 ? affordable + ' kW' : 'smaller'} system.`;
    }

    return NextResponse.json({
      systemKw: actualSystemKw,
      panels,
      batteryKwh,
      inverterKw,
      totalCost,
      monthlySaving,
      paybackYears,
      annualProduction: annualProductionWh,
      peakSunHours,
      carbonOffsetKgPerYear,
      location,
      roofType,
      ...(budgetNote ? { budgetNote } : {}),
    });
  } catch (err) {
    console.error('[solar/calculate]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Calculation failed' },
      { status: 500 }
    );
  }
}
