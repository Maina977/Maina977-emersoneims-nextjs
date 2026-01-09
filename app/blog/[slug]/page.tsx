import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Blog articles database - in production this would come from CMS/database
const blogArticles: Record<string, {
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: string;
}> = {
  'complete-guide-generator-sizing-kenya': {
    title: 'Complete Guide to Generator Sizing in Kenya',
    description: 'Learn how to calculate the right generator size for your home or business. Includes formulas, examples, and expert tips for Kenyan power requirements.',
    category: 'Generators',
    date: '2025-01-15',
    readTime: '8 min read',
    author: 'Emerson Technical Team',
    content: `
## Why Generator Sizing Matters

Choosing the wrong generator size is one of the most common and costly mistakes we see at Emerson Energy. An undersized generator won't power your essential equipment, while an oversized one wastes fuel and money.

After 20+ years of installing generators across Kenya, here's our complete guide to getting it right.

## Step 1: List Your Power Requirements

First, identify everything you need to power during an outage:

### Essential Loads (Must Have)
- **Lighting** - LED bulbs use 7-15W each, incandescent use 60-100W
- **Refrigerator** - 100-400W running, 1,200-2,000W starting
- **Phone chargers** - 5-10W each
- **Laptop** - 50-100W
- **WiFi router** - 10-20W

### Comfort Loads (Nice to Have)
- **Television** - 80-200W
- **Fans** - 50-100W each
- **Air conditioner** - 1,000-5,000W (depends on BTU rating)
- **Water heater** - 1,500-4,500W

### Business Loads (For Offices/Shops)
- **Desktop computer** - 200-500W
- **Printer** - 50-500W (laser printers draw more)
- **POS machine** - 30-50W
- **Security system** - 50-200W
- **Cold room** - 3,000-10,000W

## Step 2: Calculate Total Wattage

Add up all your running watts, then account for starting watts (motors need 2-3x running watts to start).

### Formula:
**Total Running Watts + Highest Starting Watts = Minimum Generator Size**

### Example Calculation:
| Item | Running Watts | Starting Watts |
|------|---------------|----------------|
| 10 LED lights | 100W | 100W |
| Refrigerator | 200W | 1,200W |
| TV | 150W | 150W |
| 2 Fans | 160W | 160W |
| WiFi Router | 15W | 15W |
| **Total** | **625W** | N/A |

Minimum size: 625W + 1,200W (fridge starting) = **1,825W**

For safety, add 20-25%: 1,825W x 1.25 = **2,280W minimum**

Recommended: **3kVA generator** (accounts for future additions)

## Step 3: Consider These Kenya-Specific Factors

### Altitude Adjustment
Nairobi is at 1,795m altitude. Generators lose about 3.5% power per 300m above sea level.

**Derating for Nairobi:** Multiply needed watts by 1.2 to compensate.

### Power Factor
Kenya uses 50Hz power. Most generators are rated at 0.8 power factor.

**Formula:** kVA x 0.8 = kW available

A 10kVA generator provides ~8kW actual power.

### Voltage Requirements
- Single phase: 240V (homes, small businesses)
- Three phase: 415V (industrial, large motors)

## Generator Sizing Quick Reference Table

| Application | Recommended Size | Notes |
|-------------|-----------------|-------|
| Small apartment | 2.5-3.5 kVA | Lights, fridge, TV, phones |
| 3-bedroom house | 5-7.5 kVA | Add AC or water heater |
| Large home | 10-15 kVA | Multiple ACs, full backup |
| Small shop | 5-10 kVA | Lighting, refrigeration |
| Medium office | 15-25 kVA | Computers, AC, equipment |
| Restaurant | 25-50 kVA | Kitchen equipment, cold rooms |
| Factory | 50-500+ kVA | Industrial motors, machinery |

## Fuel Consumption Guide

At 75% load (efficient operation):

| Generator Size | Diesel (L/hr) | Petrol (L/hr) |
|----------------|---------------|---------------|
| 5 kVA | 1.2-1.5 | 2.0-2.5 |
| 10 kVA | 2.5-3.0 | N/A (diesel only) |
| 20 kVA | 4.0-5.0 | N/A |
| 50 kVA | 10-12 | N/A |

## Common Sizing Mistakes to Avoid

1. **Ignoring starting watts** - Motors need 2-3x power to start
2. **No room for growth** - Always add 20-25% buffer
3. **Forgetting power factor** - kVA ≠ kW
4. **Altitude ignorance** - Critical in highland areas
5. **Single device focus** - Consider everything running simultaneously

## Need Expert Help?

Our team has sized thousands of generators across Kenya. For a free consultation:

📞 **Call:** 0768 860 655 or 0782914717
📍 **Visit:** Our showroom in Nairobi
💬 **WhatsApp:** Send your power bill for instant sizing

We'll analyze your actual consumption and recommend the perfect generator size, brand, and model for your specific needs.

---

*Published by Emerson Energy - Kenya's trusted power solutions partner since 2005*
    `,
  },
  'solar-power-investment-roi-kenya': {
    title: 'Solar Power ROI: Is Solar Worth It in Kenya 2025?',
    description: 'A detailed analysis of solar panel investment in Kenya. Calculate your payback period, understand tariff savings, and maximize your solar investment returns.',
    category: 'Solar',
    date: '2025-01-12',
    readTime: '10 min read',
    author: 'Emerson Solar Division',
    content: `
## The Real Question: Will Solar Save Me Money?

With Kenya Power tariffs rising and solar panel prices falling, 2025 is the best time to go solar. But is it actually worth it for YOUR situation?

Let's break down the numbers honestly.

## Current Kenya Power Tariffs (2025)

| Category | Rate per kWh | Notes |
|----------|-------------|-------|
| Domestic (0-100 units) | KES 12.00 | Lifeline rate |
| Domestic (>100 units) | KES 15.80 | Standard rate |
| Small Commercial | KES 14.50 | Shops, offices |
| Commercial/Industrial | KES 12.20 | Large businesses |
| Fuel Cost Charge | KES 3.50+ | Variable monthly |

**Real cost example:** A home using 500 kWh/month pays approximately KES 9,500-12,000 including all levies.

## Solar System Costs in Kenya (2025)

| System Size | Panels | Battery | Total Cost | Monthly Savings |
|-------------|--------|---------|------------|-----------------|
| 3 kW (small home) | 6 x 550W | 5 kWh LiFePO4 | KES 380,000-450,000 | KES 6,000-8,000 |
| 5 kW (medium home) | 10 x 550W | 10 kWh LiFePO4 | KES 600,000-750,000 | KES 10,000-15,000 |
| 10 kW (large home/office) | 18 x 550W | 20 kWh LiFePO4 | KES 1,200,000-1,500,000 | KES 20,000-30,000 |
| 20 kW (commercial) | 36 x 550W | 40 kWh LiFePO4 | KES 2,500,000-3,200,000 | KES 45,000-60,000 |

*Prices include installation, inverter, mounting, and wiring*

## ROI Calculation Formula

**Payback Period = Total System Cost ÷ Annual Savings**

### Example: 5kW System for a Nairobi Home

**Current Situation:**
- Monthly bill: KES 15,000
- Annual cost: KES 180,000

**With 5kW Solar:**
- System cost: KES 650,000
- Monthly savings: KES 12,000 (80% offset)
- Annual savings: KES 144,000

**Payback Period:** 650,000 ÷ 144,000 = **4.5 years**

**System lifespan:** 25+ years

**Total savings over 25 years:** KES 3,600,000 - KES 650,000 = **KES 2,950,000 profit**

## Factors That Improve Your ROI

### 1. High Energy Consumption
The more you use, the more you save. Homes/businesses spending KES 15,000+ monthly see the best returns.

### 2. Daytime Usage
If you use most power during daylight (offices, shops), you need smaller batteries = lower cost.

### 3. Net Metering (Coming Soon)
Kenya is piloting net metering. When active, you can sell excess power back to Kenya Power.

### 4. Rising Tariffs
Kenya Power tariffs have increased 15-20% over the past 3 years. This trend continues, making solar more valuable annually.

### 5. Location
Kenya gets 5-6 peak sun hours daily - among the best in Africa for solar.

## Factors That Reduce Your ROI

### 1. Low Consumption
If your bill is under KES 5,000/month, the payback period extends to 7-10 years.

### 2. Shading
Trees or buildings blocking your roof reduce output by 20-50%.

### 3. Nighttime Usage
Heavy nighttime use requires larger batteries, increasing costs.

### 4. Financing Costs
If financing at 15%+ interest, factor in interest payments.

## Is Solar Right for You? Checklist

✅ **YES, prioritize solar if:**
- Monthly bill exceeds KES 10,000
- You own your property
- Roof gets full sunlight
- You experience frequent outages
- You're planning to stay 5+ years

⚠️ **MAYBE, consult first if:**
- Bill is KES 5,000-10,000
- Partial roof shading
- Renting with flexible landlord
- Considering relocation in 3-5 years

❌ **WAIT if:**
- Bill under KES 5,000
- Renting without landlord approval
- Heavy tree coverage
- Planning to move within 2 years

## Financing Options in Kenya

| Option | Rate | Terms | Best For |
|--------|------|-------|----------|
| Cash purchase | 0% | Immediate | Best ROI |
| Asset financing | 12-18% | 1-5 years | Most customers |
| Lease-to-own | 15-20% | 3-7 years | Cash-constrained |
| Solar loans | 14-22% | 1-4 years | Quick approval |

## What Happens During Outages?

With a properly sized battery system:
- Automatic switchover in <10ms
- Essential loads run 8-24 hours (depending on battery size)
- Solar recharges batteries during day
- Generator backup for extended outages (optional)

## Our Recommendation

For most Kenyan homes and businesses spending KES 10,000+ monthly on power:

**A 5-10 kW system pays for itself in 3-5 years and saves millions over its lifetime.**

This is one of the best investments you can make in Kenya today.

## Get Your Free Assessment

We'll analyze your actual Kenya Power bills and design a system that maximizes your ROI.

📞 **Call:** 0768 860 655 or 0782914717
📧 **Email:** Send your last 3 months' power bills
🏠 **Site Visit:** Free assessment within Nairobi

---

*Emerson Energy - Powering Kenya's future with solar since 2010*
    `,
  },
  'generator-maintenance-checklist': {
    title: '47-Point Generator Maintenance Checklist',
    description: 'The ultimate maintenance guide to extend your generator lifespan. Daily, weekly, monthly, and annual maintenance tasks explained by our expert technicians.',
    category: 'Maintenance',
    date: '2025-01-10',
    readTime: '12 min read',
    author: 'Emerson Service Team',
    content: `
## Why Maintenance Matters

A well-maintained generator can last 20,000+ hours. Neglected ones fail at 5,000 hours. That's the difference between 20 years and 5 years of service.

Our 47-point checklist covers everything you need to keep your generator running perfectly.

## DAILY CHECKS (5 minutes)

Do these every day your generator runs:

### Visual Inspection
1. ✅ Check for oil leaks under and around the generator
2. ✅ Look for fuel leaks around connections and filters
3. ✅ Check coolant level in reservoir (don't open hot radiator!)
4. ✅ Inspect battery terminals for corrosion
5. ✅ Verify all guards and covers are in place

### Operational Checks
6. ✅ Check oil level with dipstick (should be between marks)
7. ✅ Verify fuel level is adequate
8. ✅ Listen for unusual sounds during operation
9. ✅ Check exhaust color (should be clear or light gray)
10. ✅ Monitor control panel for warning lights

## WEEKLY CHECKS (15 minutes)

### Engine System
11. ✅ Check air filter condition (hold up to light - should see through)
12. ✅ Inspect drive belts for cracks, fraying, proper tension
13. ✅ Check radiator fins for debris/damage
14. ✅ Verify coolant hoses are tight and not cracked
15. ✅ Test battery voltage (should be 12.5V+ when off, 14V+ charging)

### Fuel System
16. ✅ Drain water separator/fuel filter
17. ✅ Check fuel lines for cracks or leaks
18. ✅ Verify fuel tank vent is clear
19. ✅ Inspect fuel cap seal

### Electrical
20. ✅ Check all cable connections are tight
21. ✅ Verify ground connection is secure
22. ✅ Inspect control panel for any loose wiring
23. ✅ Test emergency stop button functions

## MONTHLY CHECKS (30 minutes)

### Deep Inspection
24. ✅ Clean air filter or replace if damaged
25. ✅ Check alternator belt tension and condition
26. ✅ Inspect exhaust system for leaks
27. ✅ Clean battery terminals and apply protector
28. ✅ Check ATS (Automatic Transfer Switch) operation

### Testing
29. ✅ Run generator under load for 30 minutes minimum
30. ✅ Check all gauges: oil pressure, water temp, voltage, frequency
31. ✅ Test automatic start function (if equipped)
32. ✅ Verify output voltage under load (should be 240V ±5%)
33. ✅ Check frequency stability (should be 50Hz ±1Hz)

### Documentation
34. ✅ Record running hours
35. ✅ Log fuel consumption
36. ✅ Note any observations or concerns
37. ✅ Update maintenance log

## QUARTERLY CHECKS (1-2 hours)

### Oil & Filters
38. ✅ Change engine oil (or at manufacturer intervals)
39. ✅ Replace oil filter
40. ✅ Replace fuel filter(s)
41. ✅ Replace air filter element

### Cooling System
42. ✅ Test coolant concentration with refractometer
43. ✅ Check thermostat operation
44. ✅ Clean radiator externally
45. ✅ Inspect water pump for leaks

### Electrical System
46. ✅ Test battery load capacity
47. ✅ Check starter motor engagement

## SERVICE INTERVALS TABLE

| Component | Interval | Notes |
|-----------|----------|-------|
| Engine oil | 250 hours or 6 months | Use manufacturer grade |
| Oil filter | Every oil change | Quality filters only |
| Fuel filter | 500 hours or annually | Check monthly |
| Air filter | 500 hours or as needed | Clean weekly |
| Coolant | 2,000 hours or 2 years | Use proper mix |
| Spark plugs (petrol) | 500 hours | Gap to spec |
| Injectors (diesel) | 2,000 hours | Professional service |
| Valve adjustment | 2,000 hours | Professional service |
| Full overhaul | 10,000-15,000 hours | Major service |

## WARNING SIGNS - CALL US IMMEDIATELY

🚨 **Engine:**
- Blue or black exhaust smoke
- Knocking or unusual sounds
- Oil pressure drops below normal
- Excessive vibration

🚨 **Electrical:**
- Output voltage fluctuations >10%
- Frequency instability
- Warning lights staying on
- Burning smell from control panel

🚨 **Cooling:**
- Coolant leaking
- Temperature above normal
- Coolant discolored or oily
- Radiator damage

🚨 **Fuel:**
- Diesel in oil (dipstick smells like fuel)
- Black smoke
- Hard starting
- Fuel consumption increased

## COMMON MAINTENANCE MISTAKES

1. **Ignoring the air filter** - Dirty filter kills engines faster than anything
2. **Wrong oil type** - Always use manufacturer-specified grade
3. **Skipping load tests** - Generators need regular exercise
4. **Letting fuel sit** - Diesel degrades, use stabilizer for storage
5. **Ignoring small leaks** - Today's drip is tomorrow's failure
6. **DIY injector work** - Always use professionals for fuel injection
7. **Cheap filters** - Genuine/quality filters protect your investment

## STORAGE PROCEDURES

If not using for extended periods:

1. Run generator for 30 minutes at load to warm thoroughly
2. Drain fuel or add stabilizer (follow directions)
3. Change oil while engine is warm
4. Fog engine if storing 3+ months
5. Disconnect battery and store separately
6. Cover generator but allow ventilation
7. Run monthly for 30 minutes under load

## FREE MAINTENANCE SERVICE

Emerson Energy offers comprehensive maintenance packages:

| Package | Coverage | Price |
|---------|----------|-------|
| Basic | Quarterly service, parts extra | KES 8,000/year |
| Standard | Quarterly + emergency calls | KES 15,000/year |
| Premium | Monthly visits + all parts | KES 35,000/year |
| Enterprise | 24/7 coverage + priority | Custom quote |

All packages include:
- Certified technicians
- Genuine/OEM parts
- Detailed service reports
- WhatsApp support

## Schedule Your Service

📞 **Call:** 0768 860 655 or 0782914717
📍 **WhatsApp:** Send your generator model for instant quote
🏠 **Coverage:** All 47 counties in Kenya

---

*Keep this checklist handy! Print it and post near your generator.*

*Emerson Energy - Expert generator maintenance since 2005*
    `,
  },
  'diesel-vs-petrol-generators': {
    title: 'Diesel vs Petrol Generators: Which Is Right for You?',
    description: 'Compare fuel efficiency, maintenance costs, lifespan, and performance between diesel and petrol generators. Make an informed buying decision.',
    category: 'Generators',
    date: '2025-01-08',
    readTime: '6 min read',
    author: 'Emerson Technical Team',
    content: `
## The Great Debate: Diesel or Petrol?

This is the most common question we get asked. The answer depends on your specific needs, usage patterns, and budget. Let's compare honestly.

## Quick Comparison Table

| Factor | Diesel Generator | Petrol Generator |
|--------|-----------------|------------------|
| Fuel cost/liter | KES 185-195 | KES 195-210 |
| Fuel efficiency | Excellent (30-40% better) | Good |
| Purchase price | Higher (20-40% more) | Lower |
| Maintenance cost | Lower long-term | Higher long-term |
| Lifespan | 20,000-30,000 hours | 2,000-5,000 hours |
| Noise level | Louder | Quieter |
| Available sizes | 3kVA to 2000kVA+ | 1kVA to 15kVA |
| Best for | Commercial, heavy use | Residential, occasional |

## Choose DIESEL If:

✅ You'll run the generator 4+ hours daily
✅ Commercial or industrial application
✅ Need reliability for business operations
✅ Looking for 10+ year lifespan
✅ Prioritize long-term savings over upfront cost
✅ Need larger capacity (10kVA+)
✅ Fuel storage safety is manageable

### Diesel Advantages
- **Fuel efficiency:** Uses 30-40% less fuel for same power
- **Durability:** Built for continuous heavy use
- **Longevity:** 20,000+ hour lifespan with maintenance
- **Torque:** Better performance under heavy loads
- **Safety:** Diesel is less flammable than petrol

### Diesel Disadvantages
- **Higher purchase price:** 20-40% more upfront
- **Noise:** Generally louder than petrol equivalents
- **Weight:** Heavier, harder to move
- **Cold starts:** Can struggle in cold weather
- **Emissions:** Higher particulate output

## Choose PETROL If:

✅ Occasional/emergency use only (< 200 hours/year)
✅ Residential backup power
✅ Need portability
✅ Budget-conscious initial purchase
✅ Small power needs (under 10kVA)
✅ Noise is a major concern

### Petrol Advantages
- **Lower purchase price:** More affordable upfront
- **Quieter operation:** Less noise disturbance
- **Lighter weight:** Easy to move around
- **Easy starting:** Reliable in all weather
- **Widely available:** Petrol stations everywhere

### Petrol Disadvantages
- **Fuel cost:** Higher consumption rate
- **Shorter lifespan:** 2,000-5,000 hours typical
- **Maintenance:** More frequent service needed
- **Limited sizes:** Rarely available above 15kVA
- **Safety:** Petrol is highly flammable

## Cost Comparison Over 10 Years

### Scenario: Running 4 hours daily (1,460 hours/year)

**5kVA Petrol Generator:**
- Purchase: KES 150,000
- Fuel: 2.5L/hr × 1,460 hrs × KES 200 = KES 730,000/year
- Maintenance: KES 25,000/year
- Replacement at year 3 and 7 (short lifespan)
- **10-year cost: KES 8,350,000+**

**5kVA Diesel Generator:**
- Purchase: KES 350,000
- Fuel: 1.5L/hr × 1,460 hrs × KES 190 = KES 416,100/year
- Maintenance: KES 15,000/year
- No replacement needed
- **10-year cost: KES 4,661,000**

**Diesel saves: KES 3,689,000 over 10 years**

## Real World Recommendations

### Home Backup (Occasional Use)
**Recommendation: Petrol 3-5kVA**
- Lower upfront cost
- Easier storage
- Sufficient for lights, fridge, TV
- Examples: Honda EU30is, Kipor KGE6500

### Small Business (Daily Use)
**Recommendation: Diesel 10-20kVA**
- Fuel savings add up
- Reliable for business continuity
- Professional installation with ATS
- Examples: Perkins 15kVA, Cummins 20kVA

### Factory/Commercial (Heavy Use)
**Recommendation: Diesel 50kVA+**
- No other viable option
- Industrial grade reliability
- 24/7 capability
- Examples: Caterpillar, Cummins, FG Wilson

### Construction Sites
**Recommendation: Diesel 25-100kVA**
- Rugged construction
- Fuel efficient for long days
- Powers heavy equipment
- Mobile configurations available

## Hybrid Option: Dual Fuel

Some generators can run on both diesel and gas (LPG/natural gas):

**Advantages:**
- Fuel flexibility
- Lower emissions on gas
- Cost optimization

**Best for:** Facilities with natural gas access

## Our Expert Opinion

After 20+ years in Kenya:

> "For any application over 200 running hours per year, diesel is the only sensible choice. The fuel savings alone pay for the price difference within 2-3 years, and you'll still have 15-20 years of service life remaining."

**However**, for pure emergency backup used less than 50 hours annually, petrol makes sense due to lower upfront cost.

## Need Help Deciding?

We stock both diesel and petrol generators from trusted brands. Let us analyze your specific situation:

📞 **Call:** 0768 860 655 or 0782914717
📧 **Email:** Tell us your power needs and usage pattern
🏠 **Visit:** See both types in action at our showroom

We'll give you honest advice - even if it means recommending a cheaper option.

---

*Emerson Energy - Honest advice, quality products since 2005*
    `,
  },
  'solar-battery-storage-guide': {
    title: 'Solar Battery Storage: Complete Kenya Guide 2025',
    description: 'Everything you need to know about solar batteries in Kenya. Types, sizing, costs, and how to choose the best battery for your solar system.',
    category: 'Solar',
    date: '2025-01-05',
    readTime: '9 min read',
    author: 'Emerson Solar Division',
    content: `
## Why Battery Storage Matters

Solar panels only generate power during daylight. Without batteries, you're still dependent on Kenya Power at night and during outages. The right battery system provides:

- Power during blackouts
- Nighttime electricity from stored solar
- Reduced grid dependence
- Emergency backup capability

## Battery Types Compared

### 1. Lithium Iron Phosphate (LiFePO4) - RECOMMENDED

**The gold standard for solar storage in 2025.**

| Specification | Value |
|---------------|-------|
| Cycle life | 4,000-6,000+ cycles |
| Depth of discharge | 80-100% |
| Efficiency | 95-98% |
| Lifespan | 10-15 years |
| Safety | Excellent (no thermal runaway) |
| Weight | Light (compared to lead-acid) |
| Price | KES 45,000-60,000 per kWh |

**Best brands:** BYD, Pylontech, Victron, Dyness, Felicity

### 2. Lithium NMC (Nickel Manganese Cobalt)

**Higher energy density, used in some premium systems.**

| Specification | Value |
|---------------|-------|
| Cycle life | 2,000-4,000 cycles |
| Depth of discharge | 80-90% |
| Efficiency | 95-97% |
| Lifespan | 8-12 years |
| Safety | Good (requires BMS) |
| Price | KES 40,000-55,000 per kWh |

**Best brands:** LG Chem, Samsung SDI, Tesla Powerwall

### 3. Lead-Acid (AGM/Gel) - Budget Option

**Traditional technology, lower upfront cost.**

| Specification | Value |
|---------------|-------|
| Cycle life | 500-1,500 cycles |
| Depth of discharge | 50% (recommended) |
| Efficiency | 80-85% |
| Lifespan | 3-5 years |
| Safety | Good (maintenance-free AGM) |
| Weight | Very heavy |
| Price | KES 15,000-25,000 per kWh |

**Best brands:** Trojan, Rolls, Victron AGM

### Comparison Summary

| Factor | LiFePO4 | Lead-Acid |
|--------|---------|-----------|
| Upfront cost | Higher | Lower |
| 10-year cost | **Lower** | Higher |
| Usable capacity | 100% | 50% |
| Replacement | Once (maybe) | 2-3 times |
| Space needed | Small | Large |
| Weight | Light | Very heavy |

**Our recommendation:** LiFePO4 for any serious solar installation. The 10-year total cost is actually lower than lead-acid when you factor in replacements.

## Battery Sizing Guide

### Step 1: Calculate Daily Usage

List everything running at night/during outages:

| Item | Watts | Hours | Wh/day |
|------|-------|-------|--------|
| LED lights (10) | 100W | 6h | 600 Wh |
| Refrigerator | 150W | 12h | 1,800 Wh |
| TV | 100W | 4h | 400 Wh |
| WiFi Router | 15W | 24h | 360 Wh |
| Phone charging | 50W | 3h | 150 Wh |
| **Total** | | | **3,310 Wh** |

### Step 2: Add Buffer

Multiply by 1.2 for inefficiency: 3,310 × 1.2 = **3,972 Wh ≈ 4 kWh**

### Step 3: Consider Days of Autonomy

How many days backup without sun?

- Residential (grid-tied): 1 day = **4 kWh**
- Off-grid/critical: 2-3 days = **8-12 kWh**
- Business continuity: 1-2 days = **4-8 kWh**

### Step 4: Account for Depth of Discharge

- LiFePO4: Full capacity available (4 kWh battery = 4 kWh usable)
- Lead-Acid: Only 50% usable (8 kWh battery = 4 kWh usable)

## Popular Battery Configurations

### Small Home (2-3 bedrooms)
- **System:** 5 kWh LiFePO4
- **Backup time:** 8-12 hours (essentials)
- **Price:** KES 250,000-350,000
- **Brands:** Dyness B4850, Pylontech US3000C

### Medium Home (4-5 bedrooms)
- **System:** 10 kWh LiFePO4
- **Backup time:** 12-24 hours
- **Price:** KES 450,000-600,000
- **Brands:** BYD B-Box, Pylontech stack

### Large Home/Small Office
- **System:** 15-20 kWh LiFePO4
- **Backup time:** 24-48 hours
- **Price:** KES 700,000-1,000,000
- **Brands:** Multiple Pylontech/BYD units

### Commercial/Industrial
- **System:** 50-200+ kWh
- **Backup time:** As required
- **Price:** Custom quotation
- **Brands:** BYD HVS, container solutions

## Inverter Compatibility

Your inverter must be compatible with your battery type:

| Inverter Brand | LiFePO4 | Lead-Acid | Features |
|----------------|---------|-----------|----------|
| Victron | ✅ | ✅ | Premium, expandable |
| Growatt | ✅ | ✅ | Good value |
| Deye | ✅ | ✅ | Popular in Kenya |
| Voltronic (Axpert) | ✅ | ✅ | Budget-friendly |
| SMA | ✅ | ✅ | German quality |

**Important:** Ensure your inverter has the correct communication protocol for your battery brand (CAN, RS485, etc.)

## Installation Best Practices

### Location Requirements
- Well-ventilated area (batteries generate heat)
- Protected from direct sunlight
- Away from living areas (for lead-acid)
- Elevated from floor (flood protection)
- Easy access for maintenance

### Safety Requirements
- Proper fusing and disconnect switches
- Battery management system (BMS) for lithium
- Temperature monitoring
- Fire extinguisher nearby (Class D for lithium)
- Proper signage

### Wiring Requirements
- Correct cable sizing for current
- Short cable runs to inverter
- Quality terminals and connectors
- Proper grounding

## Warranty Comparison

| Brand | Warranty | Cycles Guaranteed |
|-------|----------|-------------------|
| Pylontech | 10 years | 6,000 cycles |
| BYD | 10 years | 6,000 cycles |
| Dyness | 10 years | 6,000 cycles |
| Felicity | 5 years | 3,000 cycles |
| Trojan (Lead) | 2 years | 1,200 cycles |

## Our Top Picks for 2025

### Best Value: Dyness B4850
- 4.8 kWh capacity
- 6,000+ cycle life
- Excellent Kenya support
- KES 220,000-280,000

### Best Premium: BYD B-Box
- Modular and expandable
- Industry-leading safety
- 10-year warranty
- KES 300,000-400,000 per 5 kWh

### Best Budget: Felicity LiFePO4
- Good performance
- Local support available
- KES 180,000-220,000 per 5 kWh

## Free Consultation

Not sure which battery is right for you? Our solar team will:

1. Analyze your power usage
2. Recommend optimal battery size
3. Match with compatible inverter
4. Provide complete system quote

📞 **Call:** 0768 860 655 or 0782914717
📧 **Email:** Send your Kenya Power bill for analysis
🏠 **Site Visit:** Free in Nairobi area

---

*Emerson Energy - Your trusted solar partner in Kenya*
    `,
  },
  'kenya-power-outages-solutions': {
    title: 'How to Protect Your Business From Kenya Power Outages',
    description: 'Strategies to minimize downtime during power cuts. UPS systems, automatic transfer switches, and hybrid power solutions explained.',
    category: 'Solutions',
    date: '2025-01-02',
    readTime: '7 min read',
    author: 'Emerson Commercial Team',
    content: `
## The Cost of Power Outages

In Kenya, power outages cost businesses an estimated KES 60 billion annually. For your business, every minute of downtime means:

- Lost revenue
- Damaged equipment
- Spoiled inventory
- Unhappy customers
- Reduced productivity

Here's how to protect your operations.

## Understanding Your Risk

### High-Risk Businesses
- Supermarkets & cold storage
- Hospitals & clinics
- Data centers & IT companies
- Manufacturing plants
- Hotels & restaurants
- Banks & financial services

### Medium-Risk Businesses
- Retail shops
- Professional offices
- Schools
- Petrol stations

### Lower-Risk Businesses
- Mobile-only operations
- Outdoor services
- Home-based businesses

## Protection Levels

### Level 1: Basic Protection (UPS Only)

**Best for:** Offices with computers, POS systems

**How it works:** Battery backup provides 5-30 minutes of power, enough to save work and shut down properly.

**Components:**
- Line-interactive or online UPS
- 600VA-3000VA capacity
- Surge protection built-in

**Cost:** KES 15,000-80,000

**Limitations:** Short runtime, not for continuous operation

### Level 2: Standard Protection (UPS + Generator)

**Best for:** Most businesses needing continuous operation

**How it works:** UPS provides instant backup while generator starts (10-30 seconds), then generator takes over.

**Components:**
- UPS system (sized for startup gap)
- Diesel generator (sized for full load)
- Manual or automatic transfer

**Cost:** KES 200,000-1,000,000+

**Benefits:** Hours/days of backup, handles any outage

### Level 3: Premium Protection (UPS + Generator + ATS)

**Best for:** Critical operations requiring zero downtime

**How it works:** Automatic Transfer Switch (ATS) seamlessly switches to generator within seconds, with UPS bridging the gap.

**Components:**
- Online double-conversion UPS
- Diesel generator with auto-start
- Automatic Transfer Switch (ATS)
- Remote monitoring system

**Cost:** KES 500,000-5,000,000+

**Benefits:** Zero perceived downtime, fully automated

### Level 4: Maximum Protection (Hybrid Solar + Generator + UPS)

**Best for:** Businesses wanting independence from Kenya Power

**How it works:** Solar provides daily power, batteries store excess, generator serves as ultimate backup, UPS ensures zero gaps.

**Components:**
- Solar panel array
- Battery storage system
- Hybrid inverter
- Diesel generator
- Advanced monitoring

**Cost:** KES 1,000,000-10,000,000+

**Benefits:** Reduced power bills, environmental benefits, maximum reliability

## Automatic Transfer Switch (ATS) Explained

An ATS is the brain of your backup system:

1. Monitors mains power continuously
2. Detects outage within milliseconds
3. Sends start signal to generator
4. Waits for generator to stabilize (10-30 seconds)
5. Transfers load to generator
6. When mains return, waits for stability
7. Transfers back to mains
8. Sends stop signal to generator

### ATS Types

| Type | Transfer Time | Best For | Price Range |
|------|---------------|----------|-------------|
| Contactor-based | 100-500ms | General business | KES 80,000-200,000 |
| Motorized | 2-5 seconds | Light commercial | KES 50,000-100,000 |
| Static (no-break) | <10ms | Critical loads | KES 200,000-500,000 |

### Top ATS Brands
- ABB
- Schneider Electric  
- Socomec
- Deep Sea Electronics
- ComAp

## Generator Sizing for Business

### Quick Sizing Guide

| Business Type | Typical Load | Recommended Size |
|---------------|--------------|------------------|
| Small shop | 3-5 kW | 10 kVA diesel |
| Medium office | 10-20 kW | 30 kVA diesel |
| Restaurant | 15-30 kW | 40-60 kVA diesel |
| Small factory | 50-100 kW | 125-150 kVA diesel |
| Supermarket | 80-200 kW | 250-400 kVA diesel |

### Must Include
- 20-25% safety margin
- Motor starting currents (3x running)
- Future expansion
- Altitude derating (Nairobi: multiply by 1.2)

## UPS Selection for Business

### UPS Technologies

**Line-Interactive:** 
- Switches to battery when power drops
- 2-5ms transfer time
- Best for: Computers, small equipment
- Price: KES 15,000-50,000

**Online Double-Conversion:**
- Always running on battery (continuously charged)
- Zero transfer time
- Best for: Servers, medical equipment
- Price: KES 80,000-500,000+

### UPS Sizing Formula

**kVA needed = (Total Watts × 1.25) ÷ 0.8**

Example: 2,000W load × 1.25 = 2,500 ÷ 0.8 = **3.1 kVA UPS minimum**

## Maintenance Requirements

### Generator Maintenance
- Monthly: Run under load 30 minutes
- Quarterly: Oil change, filter replacement
- Annual: Full service, load bank test
- Cost: KES 20,000-100,000/year depending on size

### UPS Maintenance
- Monthly: Visual inspection, log review
- Quarterly: Battery check, cleaning
- Every 3-4 years: Battery replacement
- Cost: KES 10,000-50,000/year

### ATS Maintenance
- Monthly: Manual transfer test
- Annual: Full inspection, contact cleaning
- Cost: KES 5,000-20,000/year

## Implementation Checklist

1. ☐ Audit current power usage (request bill analysis)
2. ☐ Identify critical vs non-critical loads
3. ☐ Determine acceptable downtime
4. ☐ Calculate total power requirement
5. ☐ Choose protection level
6. ☐ Select appropriate equipment
7. ☐ Plan installation timeline
8. ☐ Budget for maintenance
9. ☐ Train staff on procedures
10. ☐ Document emergency protocols

## Common Mistakes to Avoid

1. **Undersizing generators** - Motor starting loads catch people out
2. **Skipping the UPS** - Generator needs 10-30 seconds to start
3. **No maintenance plan** - Backup systems fail from neglect
4. **DIY electrical work** - Always use licensed electricians
5. **Ignoring fuel storage** - Keep minimum 2-3 days supply
6. **No load testing** - Test monthly under real conditions

## Complete Business Packages

We offer turnkey solutions:

### Small Business Package
- 15 kVA diesel generator
- Basic ATS
- 1 kVA UPS for critical
- Installation and commissioning
- **From KES 450,000**

### Medium Business Package
- 30-60 kVA diesel generator
- Automatic ATS with monitoring
- 3 kVA UPS system
- Annual maintenance contract
- **From KES 900,000**

### Enterprise Package
- Custom-sized generator
- Premium ATS with remote monitoring
- Modular UPS system
- 24/7 support contract
- **Custom quotation**

## Get Protected Today

Don't wait for the next outage to cost you money. Contact us for:

📞 **Call:** 0768 860 655 or 0782914717
📧 **Email:** Request site survey
🏢 **Coverage:** All 47 counties

Free consultation and site survey in Nairobi area.

---

*Emerson Energy - Keeping Kenya's businesses running since 2005*
    `,
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = blogArticles[slug];
  
  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${article.title} | Emerson Energy Blog`,
    description: article.description,
    keywords: `${article.category.toLowerCase()}, Kenya, ${article.title.toLowerCase()}`,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(blogArticles).map((slug) => ({ slug }));
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = blogArticles[slug];

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Article Header */}
      <header className="relative py-16 px-4 bg-gradient-to-b from-orange-900/30 to-black">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-orange-500 hover:text-orange-400 mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          
          <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm rounded-full mb-4">
            {article.category}
          </span>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-300 mb-6">
            {article.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span>By {article.author}</span>
            <span>•</span>
            <span>{new Date(article.date).toLocaleDateString('en-KE', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert prose-orange prose-lg
          prose-headings:text-white prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-800 prose-h2:pb-2
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-strong:text-orange-500
          prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
          prose-ul:text-gray-300 prose-ol:text-gray-300
          prose-li:marker:text-orange-500
          prose-table:border-gray-700 prose-td:border-gray-700 prose-th:border-gray-700
          prose-th:bg-gray-800/50 prose-th:text-white prose-th:font-semibold
          prose-td:text-gray-300
          prose-blockquote:border-orange-500 prose-blockquote:bg-gray-900/50 prose-blockquote:rounded
          prose-code:text-orange-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
        ">
          <div dangerouslySetInnerHTML={{ 
            __html: article.content
              .replace(/## /g, '<h2>')
              .replace(/### /g, '<h3>')
              .replace(/\n\n/g, '</p><p>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n- /g, '<li>')
              .replace(/\| /g, '<td>')
              .replace(/---/g, '<hr/>')
          }} />
        </div>
      </article>

      {/* Related Articles / CTA */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Need Expert Help?</h2>
          <p className="text-gray-400 mb-8">
            Our team is ready to help with your power needs. Free consultation available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:0768860665" 
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-semibold hover:opacity-90 transition"
            >
              📞 Call 0768 860 655
            </a>
            <a 
              href="https://wa.me/254768860655" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
