'use client';

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║   INTERACTIVE TROUBLESHOOTER - Generator Oracle                               ║
 * ║   Copyright © 2024-2026 EmersonEIMS. All Rights Reserved.                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 *
 * This component provides step-by-step interactive troubleshooting with
 * engagement questions, follow-ups, and detailed guidance.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Wrench,
  HelpCircle,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Zap,
  Fuel,
  Thermometer,
  Settings,
  Cpu,
  Battery,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TROUBLESHOOTING SCENARIOS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

interface TroubleshootingStep {
  id: string;
  question: string;
  instruction?: string;
  tools?: string[];
  safetyWarning?: string;
  expectedResult?: string;
  options: {
    label: string;
    nextStep: string;
    action?: string;
  }[];
  partNumbers?: { brand: string; partNo: string; price: string }[];
  image?: string;
  video?: string;
  tip?: string;
}

interface TroubleshootingScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: string;
  steps: Record<string, TroubleshootingStep>;
  startStep: string;
}

const SCENARIOS: TroubleshootingScenario[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO 1: ECM NOT COMMUNICATING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ecm-no-communication',
    title: 'ECM Not Communicating with Controller',
    description: 'New or existing ECM fails to communicate with the generator controller',
    icon: <Cpu className="w-6 h-6" />,
    category: 'ECM/Controller',
    difficulty: 4,
    estimatedTime: '30-60 minutes',
    startStep: 'initial',
    steps: {
      'initial': {
        id: 'initial',
        question: 'Is this a NEW ECM that was just installed, or an EXISTING ECM that stopped communicating?',
        options: [
          { label: '🆕 New ECM - just installed', nextStep: 'new-ecm-check' },
          { label: '📦 Existing ECM - was working before', nextStep: 'existing-ecm-check' },
        ],
      },
      'new-ecm-check': {
        id: 'new-ecm-check',
        question: 'Did you verify the ECM part number matches your engine model EXACTLY?',
        instruction: 'Check the ECM label for the part number and compare with your engine serial number (ESN) requirements.',
        tip: 'Even ECMs that look identical may have different software/calibration. Wrong part = no communication.',
        options: [
          { label: '✅ Yes, part number is correct', nextStep: 'new-ecm-power' },
          { label: '❌ Not sure / May be wrong', nextStep: 'wrong-part-solution' },
        ],
      },
      'wrong-part-solution': {
        id: 'wrong-part-solution',
        question: 'The ECM part number MUST match your engine. Here\'s how to verify:',
        instruction: `
**Step 1:** Find your Engine Serial Number (ESN) on the engine dataplate
**Step 2:** Contact the ECM supplier with the ESN
**Step 3:** Verify the ECM calibration code matches your engine's CPL/Control Parts List

**Common ECM Part Numbers by Engine:**
| Engine | ECM Part Number |
|--------|-----------------|
| Cummins QSB6.7 | 4921684, 2897338 |
| Cummins QSX15 | 4963807, 4995445 |
| CAT C9 | 349-9425, 349-9426 |
| Perkins 1104D | T402825, T403149 |
        `,
        safetyWarning: 'Using wrong ECM can damage engine or void warranty',
        options: [
          { label: '✅ I\'ve verified - part is correct', nextStep: 'new-ecm-power' },
          { label: '❌ Part number is wrong - need correct ECM', nextStep: 'solution-wrong-ecm' },
        ],
      },
      'solution-wrong-ecm': {
        id: 'solution-wrong-ecm',
        question: '✅ SOLUTION FOUND: You need the correct ECM for your engine.',
        instruction: `
**Action Required:**
1. Return the incorrect ECM to supplier
2. Provide your Engine Serial Number (ESN) to get correct part
3. For Cummins: Call 1-800-CUMMINS with ESN
4. For CAT: Use parts.cat.com with engine serial
5. For Perkins: Contact authorized Perkins dealer

**Has this resolved your issue?**
        `,
        options: [
          { label: '✅ Yes, I\'ll get the correct ECM', nextStep: 'resolved' },
          { label: '🔄 The ECM IS correct, let me continue', nextStep: 'new-ecm-power' },
        ],
      },
      'new-ecm-power': {
        id: 'new-ecm-power',
        question: 'Let\'s check ECM power supply. Do you have a multimeter available?',
        tools: ['Digital Multimeter', 'Wiring Diagram'],
        options: [
          { label: '✅ Yes, I have a multimeter', nextStep: 'check-ecm-voltage' },
          { label: '❌ No multimeter available', nextStep: 'no-multimeter' },
        ],
      },
      'no-multimeter': {
        id: 'no-multimeter',
        question: 'A multimeter is ESSENTIAL for ECM diagnostics.',
        instruction: `
You cannot properly diagnose ECM communication issues without voltage testing.

**Recommended Multimeters:**
| Model | Price (KES) | Features |
|-------|-------------|----------|
| Fluke 87V | 45,000 | Professional grade, True RMS |
| UNI-T UT61E | 8,500 | Good budget option |
| Mastech MS8268 | 4,500 | Basic but adequate |

**Where to buy in Kenya:**
- Nairobi: Luthuli Avenue electronics shops
- Online: Jumia, Kilimall
        `,
        options: [
          { label: '✅ I\'ll get a multimeter and continue', nextStep: 'check-ecm-voltage' },
          { label: '📞 I need EmersonEIMS to diagnose this', nextStep: 'contact-support' },
        ],
      },
      'check-ecm-voltage': {
        id: 'check-ecm-voltage',
        question: 'Check the ECM power supply pins with key ON (engine OFF):',
        instruction: `
**Testing Procedure:**

1. Set multimeter to DC Voltage (20V or 50V range)
2. Connect black lead to chassis ground
3. Test these ECM connector pins:

| Pin Function | Expected Voltage | If Wrong |
|--------------|------------------|----------|
| Battery + (constant) | 24V ±2V | Check battery/fuse |
| Ignition Switched | 24V when key ON | Check key switch circuit |
| Ground | 0V (continuity to chassis) | Check ground strap |

**For Cummins CM2350:**
- Pin 1: Battery +
- Pin 2: Ground
- Pin 72: Key Switch

**What did you find?**
        `,
        safetyWarning: 'Key must be ON but engine OFF. Disconnect starting circuit if necessary.',
        options: [
          { label: '✅ All voltages correct (24V/24V/0V)', nextStep: 'check-can-bus' },
          { label: '❌ Battery voltage missing or low', nextStep: 'fix-battery-power' },
          { label: '❌ Key switch voltage missing', nextStep: 'fix-key-switch' },
          { label: '❌ Ground is not 0V/no continuity', nextStep: 'fix-ground' },
        ],
      },
      'fix-battery-power': {
        id: 'fix-battery-power',
        question: '⚡ ECM is not receiving battery power. Check these:',
        instruction: `
**Diagnostic Steps:**

1. **Check main fuse** - Usually 5A or 10A fuse for ECM
   - Location: Fuse box near batteries or inline near ECM
   - Cummins: Check F1 in junction box

2. **Check battery connections**
   - Clean terminals (remove corrosion)
   - Verify tight connection
   - Check battery voltage (should be 24V+ for 24V system)

3. **Trace wiring**
   - Look for damaged/chafed wires
   - Check connectors for corrosion
   - Verify wire continuity with multimeter

**Did you find the problem?**
        `,
        options: [
          { label: '✅ Fixed - ECM now has power', nextStep: 'check-can-bus' },
          { label: '🔌 Found blown fuse', nextStep: 'fuse-blown' },
          { label: '🔋 Battery voltage is low', nextStep: 'low-battery' },
          { label: '❌ Still no power - need more help', nextStep: 'contact-support' },
        ],
      },
      'fuse-blown': {
        id: 'fuse-blown',
        question: 'Blown fuse indicates a short circuit. DO NOT just replace the fuse!',
        instruction: `
**⚠️ WARNING: Replacing fuse without finding short will blow new fuse and may cause fire!**

**Find the short circuit:**
1. Disconnect ECM connector
2. Replace fuse
3. If fuse blows again = short is in wiring, not ECM
4. If fuse holds = short may be in ECM (rare)

**Common short circuit locations:**
- Chafed wire touching metal
- Water damage in connectors
- Pinched wire in harness
- Damaged ECM (internal short)

**Test each section:**
1. Disconnect sections of harness one at a time
2. Replace fuse after each disconnect
3. When fuse stops blowing, you found the bad section
        `,
        safetyWarning: 'Electrical shorts can cause fires. Properly repair all wiring.',
        options: [
          { label: '✅ Found and fixed the short', nextStep: 'check-can-bus' },
          { label: '🔥 Cannot find the short circuit', nextStep: 'contact-support' },
        ],
      },
      'check-can-bus': {
        id: 'check-can-bus',
        question: 'Now let\'s check the CAN bus communication. Can you measure CAN High and CAN Low?',
        instruction: `
**CAN Bus Diagnostics:**

With key ON, engine OFF, measure at ECM connector:

| Signal | Expected Voltage | Location |
|--------|------------------|----------|
| CAN High | 2.5V - 3.5V | Usually yellow wire |
| CAN Low | 1.5V - 2.5V | Usually green wire |
| Difference | ~2V during active comm | |

**If both are 0V:** No CAN network power
**If both are 2.5V steady:** No communication (but network powered)
**If both are same voltage:** Possible short between CAN H and CAN L

**CAN bus termination:**
Measure resistance between CAN H and CAN L:
- Should be 60 ohms (two 120-ohm resistors in parallel)
- Open circuit = missing termination
- 120 ohms = one termination missing
        `,
        tools: ['Multimeter', 'Oscilloscope (optional)'],
        options: [
          { label: '✅ CAN voltages look correct (~2.5V each)', nextStep: 'can-good-check-config' },
          { label: '❌ Both CAN wires show 0V', nextStep: 'can-no-power' },
          { label: '❌ Both show same steady voltage', nextStep: 'can-no-comm' },
          { label: '❓ I don\'t know which pins are CAN', nextStep: 'find-can-pins' },
        ],
      },
      'can-good-check-config': {
        id: 'can-good-check-config',
        question: 'CAN bus hardware looks good. The issue is likely SOFTWARE/CONFIGURATION.',
        instruction: `
**New ECM requires initialization before use!**

**For Cummins ECM:**
1. Connect Cummins INSITE software
2. Go to "ECM" > "Feature Unlock"
3. Enter engine serial number
4. Download correct calibration file
5. Perform "Trip Reset"

**For Caterpillar ECM:**
1. Connect CAT ET software
2. Flash program with correct flash file
3. Enter engine serial number in configuration
4. Calibrate injector trim codes

**For Perkins ECM:**
1. Connect EST software
2. Program engine serial number
3. Download correct dataset

**Do you have the diagnostic software?**
        `,
        options: [
          { label: '✅ Yes, I have the software - will program ECM', nextStep: 'resolved' },
          { label: '❌ No software - need EmersonEIMS assistance', nextStep: 'contact-support' },
          { label: '🔧 Already programmed but still no communication', nextStep: 'deep-diagnosis' },
        ],
      },
      'can-no-comm': {
        id: 'can-no-comm',
        question: 'CAN network is powered but no communication. Check termination resistors.',
        instruction: `
**CAN Bus Termination Test:**

1. Turn key OFF
2. Disconnect CAN cable from both ends (ECM and Controller)
3. Measure resistance at the cable:
   - Should be 60 ohms if both terminators present
   - 120 ohms if one terminator missing
   - Open circuit if both missing

**Adding termination:**
- 120-ohm resistor between CAN H and CAN L at each end
- Only two terminators in entire network
- Terminators go at the TWO ENDS of the network (furthest points)

**Termination Resistor Part Numbers:**
- DSE: 131-0020 (120 ohm)
- Generic: Any 120 ohm 0.25W resistor works

**Did adding/fixing termination solve it?**
        `,
        options: [
          { label: '✅ Yes! Added termination and it works now', nextStep: 'resolved' },
          { label: '❌ Termination is correct but still no communication', nextStep: 'can-good-check-config' },
        ],
      },
      'existing-ecm-check': {
        id: 'existing-ecm-check',
        question: 'The ECM was working before. What happened just before it stopped?',
        options: [
          { label: '⚡ Power surge / lightning', nextStep: 'power-surge-damage' },
          { label: '💧 Water got into the ECM area', nextStep: 'water-damage' },
          { label: '🔧 Someone was working on the wiring', nextStep: 'wiring-disturbed' },
          { label: '❓ Nothing - it just stopped', nextStep: 'check-ecm-voltage' },
        ],
      },
      'power-surge-damage': {
        id: 'power-surge-damage',
        question: '⚡ Power surge can damage ECM internally. Test for damage:',
        instruction: `
**Post-Surge Diagnosis:**

1. **Check for burnt smell** - open ECM enclosure if possible
2. **Visual inspection** - look for blackened components
3. **Check power supply voltages** - may have damaged voltage regulators
4. **Test outputs** - check if ECM drives outputs correctly

**If ECM is damaged, replacement is required.**

**Preventing future damage:**
- Install surge protector on main power
- Add transient voltage suppressor on ECM power input
- Ensure proper grounding

**Is there visible damage to the ECM?**
        `,
        options: [
          { label: '✅ No visible damage - let me test further', nextStep: 'check-ecm-voltage' },
          { label: '❌ Yes, ECM appears damaged', nextStep: 'ecm-replacement-needed' },
        ],
      },
      'ecm-replacement-needed': {
        id: 'ecm-replacement-needed',
        question: '❌ ECM requires replacement. Here are your options:',
        instruction: `
**ECM Replacement Options:**

| Option | Cost (KES) | Turnaround |
|--------|------------|------------|
| New OEM ECM | 150,000 - 850,000 | 1-4 weeks |
| Remanufactured ECM | 80,000 - 400,000 | 1-2 weeks |
| ECM Repair Service | 35,000 - 150,000 | 3-7 days |

**EmersonEIMS Services:**
- ECM diagnosis and repair
- Expedited replacement sourcing
- Programming and installation

**Important:** When installing new ECM:
1. Transfer calibration data from old ECM if possible
2. Record all fault codes before removal
3. New ECM needs programming with engine serial number
        `,
        partNumbers: [
          { brand: 'Cummins QSB6.7', partNo: '4921684', price: '380,000' },
          { brand: 'Cummins QSX15', partNo: '4963807', price: '650,000' },
          { brand: 'CAT C9', partNo: '349-9425', price: '520,000' },
        ],
        options: [
          { label: '📞 Contact EmersonEIMS for ECM service', nextStep: 'contact-support' },
          { label: '✅ I have a replacement ECM', nextStep: 'new-ecm-check' },
        ],
      },
      'deep-diagnosis': {
        id: 'deep-diagnosis',
        question: 'Advanced diagnosis required. Let\'s check specific parameters:',
        instruction: `
**Advanced Checks:**

1. **ECM Software Version Compatibility**
   - Controller and ECM must have compatible software
   - DSE controllers need specific ECM protocol support
   - Check controller manual for supported ECM types

2. **J1939 Address Conflict**
   - ECM should be address 0x00
   - Controller typically 0x17 or 0x27
   - No two devices can have same address

3. **Baud Rate Mismatch**
   - Standard J1939 is 250 kbps
   - Both devices must match

4. **Protocol Settings**
   - Verify ECM is set to J1939 (not proprietary)
   - Check controller is expecting J1939 data

**Using diagnostic software, can you check ECM configuration?**
        `,
        options: [
          { label: '✅ Found the issue and fixed it', nextStep: 'resolved' },
          { label: '📞 Need professional assistance', nextStep: 'contact-support' },
        ],
      },
      'resolved': {
        id: 'resolved',
        question: '✅ Great! Has your issue been resolved?',
        instruction: `
**Post-Repair Checklist:**

1. ☐ Clear all fault codes
2. ☐ Verify all parameters reading correctly
3. ☐ Test start and stop
4. ☐ Load test if possible
5. ☐ Document what was done for future reference

**Preventive Measures:**
- Regular connection inspections
- Surge protection installation
- Proper maintenance scheduling
        `,
        options: [
          { label: '✅ Yes! Problem solved - thank you!', nextStep: 'feedback-positive' },
          { label: '❌ Still having issues', nextStep: 'contact-support' },
        ],
      },
      'feedback-positive': {
        id: 'feedback-positive',
        question: '🎉 Excellent! We\'re glad Generator Oracle helped you.',
        instruction: `
**Thank you for using Generator Oracle!**

Your feedback helps us improve. Consider:
- Sharing this tool with fellow technicians
- Contacting EmersonEIMS for parts and service needs
- Bookmarking Generator Oracle for future diagnostics

**Need generator parts or professional service?**
📞 Call: +254 XXX XXX XXX
📧 Email: info@emersoneims.com
🌐 Web: www.emersoneims.com
        `,
        options: [
          { label: '🔄 Start new troubleshooting session', nextStep: 'initial' },
          { label: '📞 Contact EmersonEIMS for service', nextStep: 'contact-support' },
        ],
      },
      'contact-support': {
        id: 'contact-support',
        question: '📞 EmersonEIMS Professional Support',
        instruction: `
**We're here to help!**

**Contact EmersonEIMS:**
📞 Phone: +254 XXX XXX XXX
📧 Email: support@emersoneims.com
🌐 Website: www.emersoneims.com

**When you call, have ready:**
- Generator make and model
- Engine serial number
- Controller type
- Description of the problem
- What you've already tried

**Our services:**
- On-site diagnosis and repair
- ECM programming and replacement
- Controller configuration
- Parts supply (genuine and quality aftermarket)
- 24/7 emergency service available
        `,
        options: [
          { label: '🔄 Try more troubleshooting steps', nextStep: 'initial' },
        ],
      },
      // Add placeholder steps for other branches
      'fix-key-switch': {
        id: 'fix-key-switch',
        question: 'Key switch circuit has no voltage. Check these:',
        instruction: `
**Key Switch Circuit Diagnosis:**

1. Check key switch contacts with multimeter
2. Verify relay (if equipped) is working
3. Trace wire from key switch to ECM
4. Check for corroded connections

**Common issues:**
- Failed key switch
- Blown fuse in key switch circuit
- Damaged wire
        `,
        options: [
          { label: '✅ Fixed the key switch circuit', nextStep: 'check-can-bus' },
          { label: '❌ Need more help', nextStep: 'contact-support' },
        ],
      },
      'fix-ground': {
        id: 'fix-ground',
        question: 'Ground connection is faulty. This is critical!',
        instruction: `
**Ground Fault Diagnosis:**

Poor ground causes erratic ECM behavior and communication failures.

**Check:**
1. ECM ground wire to engine block
2. Engine block to chassis ground strap
3. Battery negative to chassis ground

**Repair:**
- Clean all ground connections to bare metal
- Apply dielectric grease after tightening
- Torque battery terminals properly
        `,
        options: [
          { label: '✅ Fixed ground connections', nextStep: 'check-can-bus' },
          { label: '❌ Need more help', nextStep: 'contact-support' },
        ],
      },
      'low-battery': {
        id: 'low-battery',
        question: 'Low battery voltage can prevent ECM operation.',
        instruction: `
**Battery Test:**

Minimum voltages:
- 12V system: 12.4V (12.6V fully charged)
- 24V system: 24.8V (25.2V fully charged)

**If low:**
1. Charge battery fully
2. Test battery under load
3. Check charging system (alternator)
4. Check for parasitic drain
        `,
        options: [
          { label: '✅ Battery now charged/replaced', nextStep: 'check-can-bus' },
          { label: '❌ Battery won\'t hold charge', nextStep: 'contact-support' },
        ],
      },
      'water-damage': {
        id: 'water-damage',
        question: 'Water damage to ECM - immediate action needed!',
        instruction: `
**Water Damage Recovery:**

1. Disconnect battery IMMEDIATELY
2. Remove ECM from enclosure
3. Dry with compressed air (low pressure)
4. Let dry for 24-48 hours
5. Inspect for corrosion

**If corrosion present:**
- Clean with electronic contact cleaner
- May need professional board repair
        `,
        safetyWarning: 'Do NOT power on wet electronics!',
        options: [
          { label: '✅ Dried out and working', nextStep: 'check-can-bus' },
          { label: '❌ Signs of corrosion/damage', nextStep: 'ecm-replacement-needed' },
        ],
      },
      'wiring-disturbed': {
        id: 'wiring-disturbed',
        question: 'Wiring was disturbed. Common issues:',
        instruction: `
**Post-Work Troubleshooting:**

1. Check all connectors were fully seated
2. Verify no wires pinched or cut
3. Confirm polarity is correct
4. Check for loose terminals in connectors

**Use pin-out diagram to verify each wire position.**
        `,
        options: [
          { label: '✅ Found wiring issue and fixed', nextStep: 'check-can-bus' },
          { label: '❌ Wiring looks correct', nextStep: 'check-ecm-voltage' },
        ],
      },
      'can-no-power': {
        id: 'can-no-power',
        question: 'No CAN bus power. Check J1939 network power supply:',
        instruction: `
**CAN Network Power:**

Some CAN networks have separate 5V power supply for transceivers.

**Check:**
1. ECM internal 5V supply (check at CAN transceiver chip)
2. External CAN power supply if equipped
3. Shorted CAN wire pulling down voltage
        `,
        options: [
          { label: '✅ Found and fixed CAN power issue', nextStep: 'can-good-check-config' },
          { label: '❌ Cannot find CAN power source', nextStep: 'contact-support' },
        ],
      },
      'find-can-pins': {
        id: 'find-can-pins',
        question: 'CAN bus pin locations by ECM type:',
        instruction: `
**Common ECM CAN Pin Locations:**

| ECM Model | CAN High Pin | CAN Low Pin |
|-----------|--------------|-------------|
| Cummins CM2350 | Pin 45 | Pin 46 |
| Cummins CM870 | Pin 42 | Pin 43 |
| CAT ADEM4 | Pin J1-40 | Pin J1-41 |
| Perkins 1300 | Pin 14 | Pin 15 |

**Wire Colors (typical):**
- CAN High: Yellow or Yellow/Black
- CAN Low: Green or Green/Black

**Refer to your engine wiring diagram for exact pinout.**
        `,
        options: [
          { label: '✅ Found CAN pins - will test', nextStep: 'check-can-bus' },
          { label: '❓ Still unsure - need wiring diagram', nextStep: 'contact-support' },
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO 2: GENERATOR SHUTS DOWN ON LOAD
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'shutdown-on-load',
    title: 'Generator Shuts Down Under Load',
    description: 'Generator runs fine at idle but trips or shuts down when load is applied',
    icon: <Zap className="w-6 h-6" />,
    category: 'Engine/Electrical',
    difficulty: 3,
    estimatedTime: '45-90 minutes',
    startStep: 'load-percentage',
    steps: {
      'load-percentage': {
        id: 'load-percentage',
        question: 'At approximately what load percentage does the generator shut down?',
        instruction: 'This helps narrow down the cause. Different load levels point to different issues.',
        options: [
          { label: '📊 25-30% load', nextStep: 'low-load-trip' },
          { label: '📊 50% load', nextStep: 'mid-load-trip' },
          { label: '📊 75%+ load', nextStep: 'high-load-trip' },
          { label: '❓ Not sure / varies', nextStep: 'check-fault-code' },
        ],
      },
      'check-fault-code': {
        id: 'check-fault-code',
        question: 'What fault code is displayed when it shuts down?',
        instruction: `
Check the controller display immediately after shutdown.
Common shutdown fault codes:

| Code | Meaning | Primary Cause |
|------|---------|---------------|
| High Temp | Overheating | Cooling system |
| Low Oil | Oil pressure | Lubrication |
| Over Speed | RPM too high | Governor |
| Under Speed | RPM too low | Fuel system |
| Over Voltage | V too high | AVR |
| Under Voltage | V too low | AVR/Excitation |
        `,
        options: [
          { label: '🌡️ High Temperature fault', nextStep: 'overheating' },
          { label: '🛢️ Low Oil Pressure fault', nextStep: 'oil-pressure' },
          { label: '⚡ Voltage fault (over/under)', nextStep: 'voltage-issue' },
          { label: '🔄 Speed fault (over/under)', nextStep: 'speed-issue' },
          { label: '❓ No fault code shown', nextStep: 'no-fault-investigate' },
        ],
      },
      'low-load-trip': {
        id: 'low-load-trip',
        question: 'Trip at 25-30% load usually indicates FUEL SUPPLY issues.',
        instruction: `
**Likely Causes (in order of probability):**

1. **Restricted fuel supply** - Cannot deliver enough fuel
   - Clogged fuel filter
   - Collapsed fuel suction hose
   - Fuel tank vent blocked

2. **Air in fuel system**
   - Loose connection on suction side
   - Cracked fuel line

3. **Fuel lift pump weak**
   - Not providing enough pressure

**First Check:** Replace fuel filters. When were they last changed?
        `,
        options: [
          { label: '🔧 Fuel filters are new/clean', nextStep: 'fuel-supply-good' },
          { label: '❓ Filters are old - will replace', nextStep: 'replace-filters' },
        ],
      },
      'replace-filters': {
        id: 'replace-filters',
        question: 'Replace fuel filters and test.',
        instruction: `
**Fuel Filter Replacement:**

1. Turn off fuel supply valve
2. Place container under filter housing
3. Remove old filter
4. Install new filter (note direction arrows)
5. Prime fuel system:
   - Manual pump on filter housing OR
   - Key ON/OFF cycle 3 times
6. Start and run, check for leaks

**Part Numbers:**
| Engine | Primary Filter | Secondary Filter |
|--------|----------------|------------------|
| Cummins 6BT | FF5052 | FS1212 |
| Cummins QSB | FF5485 | FS19732 |
| CAT C7/C9 | 1R-0751 | 326-1644 |
| Perkins 1104 | 26560145 | 26561117 |

**Did replacing filters solve the problem?**
        `,
        options: [
          { label: '✅ Yes! Running under load now', nextStep: 'resolved-positive' },
          { label: '❌ No, still trips', nextStep: 'fuel-supply-good' },
        ],
      },
      'fuel-supply-good': {
        id: 'fuel-supply-good',
        question: 'Let\'s check fuel delivery pressure and air leaks.',
        instruction: `
**Fuel Pressure Test:**

Install fuel pressure gauge AFTER fuel filter:
- Before fuel pump: Should see slight vacuum on suction side
- After fuel pump: Pressure varies by engine
  - Mechanical injection: 3-5 bar
  - Common rail: 5-10 bar (low pressure side)

**Air Leak Test:**
1. Inspect all fuel lines for cracks
2. Check clamps are tight
3. Look for wet spots (fuel seepage)
4. Clear plastic fuel line helps visualize air bubbles

**Fuel Tank Vent:**
- Open fuel cap while running
- If engine runs better = blocked vent

**What did you find?**
        `,
        options: [
          { label: '🛢️ Found air leak', nextStep: 'fix-air-leak' },
          { label: '📊 Low fuel pressure', nextStep: 'low-fuel-pressure' },
          { label: '✅ Blocked vent fixed it', nextStep: 'resolved-positive' },
          { label: '❌ Everything looks okay', nextStep: 'mid-load-trip' },
        ],
      },
      'mid-load-trip': {
        id: 'mid-load-trip',
        question: 'Trip at 50% load often indicates GOVERNOR or TURBO issues.',
        instruction: `
**50% Load Trip Causes:**

1. **Governor not responding fast enough**
   - Actuator sluggish
   - Linkage binding
   - Governor settings need adjustment

2. **Turbocharger lag/issues**
   - Wastegate not opening properly
   - Turbo bearings worn
   - Boost leak in intercooler

3. **Injector timing off**
   - Timing retarded = loss of power

**Quick Test:**
Apply load SLOWLY (over 30 seconds). Does it hold?
If yes = governor response issue
If no = mechanical/fuel issue
        `,
        options: [
          { label: '✅ Slow load application works', nextStep: 'governor-issue' },
          { label: '❌ Still trips even with slow loading', nextStep: 'high-load-trip' },
        ],
      },
      'high-load-trip': {
        id: 'high-load-trip',
        question: 'Trip at 75%+ load indicates engine cannot produce rated power.',
        instruction: `
**High Load Trip Causes:**

1. **Exhaust restriction**
   - DPF clogged (if equipped)
   - Muffler collapsed
   - Exhaust backpressure too high

2. **Air filter severely restricted**
   - Check restriction indicator
   - Replace if in doubt

3. **Injectors worn**
   - Not delivering rated fuel
   - Poor spray pattern

4. **Low compression**
   - Worn rings
   - Valve issues

5. **Altitude/Temperature**
   - High altitude = less power
   - High ambient temp = derate

**What's your exhaust backpressure? (should be <3" H2O)**
        `,
        options: [
          { label: '💨 Exhaust seems restricted', nextStep: 'exhaust-restriction' },
          { label: '🌡️ Running in high altitude/hot weather', nextStep: 'derating' },
          { label: '🔧 May need injector/compression test', nextStep: 'engine-mechanical' },
        ],
      },
      'overheating': {
        id: 'overheating',
        question: 'Overheating under load. Check cooling system:',
        instruction: `
**Cooling System Checklist:**

1. ☐ Coolant level correct?
2. ☐ Radiator fins clean (not blocked)?
3. ☐ Fan belt tight and not slipping?
4. ☐ Fan clutch engaging (if equipped)?
5. ☐ Thermostat opening?
6. ☐ Water pump working?
7. ☐ No air in cooling system?
8. ☐ Coolant mixture correct (50/50)?

**Under Load Specific:**
- Load increases heat generation
- Airflow may be restricted
- May need auxiliary cooling
        `,
        options: [
          { label: '🌡️ Found cooling issue - will fix', nextStep: 'resolved-positive' },
          { label: '❌ Cooling system looks okay', nextStep: 'contact-support-load' },
        ],
      },
      'voltage-issue': {
        id: 'voltage-issue',
        question: 'Voltage fault under load is usually AVR related.',
        instruction: `
**Voltage Under Load Diagnosis:**

**Under Voltage:**
- AVR not responding to load
- Check AVR sensing wires
- Verify AVR adjustment (increase voltage droop compensation)
- Exciter field circuit issue

**Over Voltage:**
- AVR overcompensating
- Sensing wires on wrong phase
- AVR adjustment needed

**AVR Adjustment:**
1. Locate AVR potentiometers
2. VOLT pot - sets no-load voltage
3. STAB pot - stability/hunting
4. DROOP pot - load compensation

**Adjust in small increments, test under load after each change.**
        `,
        options: [
          { label: '✅ AVR adjustment fixed it', nextStep: 'resolved-positive' },
          { label: '❌ AVR may be faulty', nextStep: 'avr-replacement' },
        ],
      },
      'governor-issue': {
        id: 'governor-issue',
        question: 'Governor/actuator response is slow. Here\'s how to diagnose:',
        instruction: `
**Governor System Diagnosis:**

1. **Check actuator movement**
   - Should move smoothly from min to max
   - Any binding = lubricate or replace

2. **Check governor controller**
   - Gain settings may need increase
   - Stability settings may need adjustment

3. **Linkage check**
   - All connections tight
   - No excessive play
   - Springs in good condition

**Electronic Governor Adjustments:**
- Increase GAIN for faster response
- Increase DROOP for stability
- Check for "hunting" at idle
        `,
        options: [
          { label: '✅ Adjusted governor - working now', nextStep: 'resolved-positive' },
          { label: '❌ Actuator appears faulty', nextStep: 'contact-support-load' },
        ],
      },
      'resolved-positive': {
        id: 'resolved-positive',
        question: '✅ Excellent! Has your generator been tested under full load successfully?',
        instruction: `
**Post-Repair Testing:**

1. Start generator, let warm up 5 minutes
2. Apply load in 25% increments
3. Hold each load level for 2 minutes
4. Monitor: voltage, frequency, temperature
5. Test at rated load for 15+ minutes

**All parameters stable?**
        `,
        options: [
          { label: '✅ Yes! All working perfectly', nextStep: 'feedback-success' },
          { label: '❌ Still having some issues', nextStep: 'contact-support-load' },
        ],
      },
      'feedback-success': {
        id: 'feedback-success',
        question: '🎉 Great job! Generator Oracle helped solve your issue.',
        instruction: `
**Remember to:**
- Document what was repaired
- Update maintenance log
- Schedule preventive maintenance

**EmersonEIMS is here for:**
- Genuine parts supply
- Professional service
- 24/7 emergency support

📞 +254 XXX XXX XXX
        `,
        options: [
          { label: '🔄 Start new troubleshooting', nextStep: 'load-percentage' },
        ],
      },
      'contact-support-load': {
        id: 'contact-support-load',
        question: 'Professional diagnosis recommended.',
        instruction: `
**This issue may require:**
- Specialized diagnostic equipment
- Load bank testing
- On-site inspection

**Contact EmersonEIMS:**
📞 +254 XXX XXX XXX
📧 support@emersoneims.com

**We offer:**
- Mobile service units
- Full diagnostic capability
- All major brand expertise
        `,
        options: [
          { label: '🔄 Try more troubleshooting', nextStep: 'load-percentage' },
        ],
      },
      // Add remaining placeholder steps
      'no-fault-investigate': {
        id: 'no-fault-investigate',
        question: 'No fault displayed - may be electrical protection tripping.',
        instruction: 'Check circuit breakers, emergency stop, and safety switches.',
        options: [
          { label: '🔄 Back to load diagnosis', nextStep: 'load-percentage' },
        ],
      },
      'oil-pressure': {
        id: 'oil-pressure',
        question: 'Low oil pressure under load:',
        instruction: 'Check oil level, oil viscosity, oil filter, and oil pump.',
        options: [
          { label: '✅ Fixed oil issue', nextStep: 'resolved-positive' },
          { label: '📞 Need help', nextStep: 'contact-support-load' },
        ],
      },
      'speed-issue': {
        id: 'speed-issue',
        question: 'Speed fault under load - governor or fuel issue.',
        instruction: 'Check fuel delivery and governor response.',
        options: [
          { label: '🔄 Check fuel system', nextStep: 'low-load-trip' },
          { label: '🔄 Check governor', nextStep: 'governor-issue' },
        ],
      },
      'fix-air-leak': {
        id: 'fix-air-leak',
        question: 'Fix the air leak and bleed fuel system.',
        instruction: 'Tighten connection or replace line. Bleed air from system.',
        options: [
          { label: '✅ Air leak fixed', nextStep: 'resolved-positive' },
        ],
      },
      'low-fuel-pressure': {
        id: 'low-fuel-pressure',
        question: 'Low fuel pressure - check fuel pump.',
        instruction: 'Test fuel lift pump output. Replace if weak.',
        options: [
          { label: '✅ Replaced fuel pump', nextStep: 'resolved-positive' },
          { label: '📞 Need help', nextStep: 'contact-support-load' },
        ],
      },
      'exhaust-restriction': {
        id: 'exhaust-restriction',
        question: 'Clear exhaust restriction.',
        instruction: 'Check muffler, DPF, and exhaust piping for blockage.',
        options: [
          { label: '✅ Cleared restriction', nextStep: 'resolved-positive' },
        ],
      },
      'derating': {
        id: 'derating',
        question: 'Engine is derating due to environmental conditions.',
        instruction: 'High altitude or temperature reduces available power. May need larger generator.',
        options: [
          { label: '✅ Understood', nextStep: 'resolved-positive' },
        ],
      },
      'engine-mechanical': {
        id: 'engine-mechanical',
        question: 'Mechanical issues suspected. Professional testing needed.',
        instruction: 'Compression test and injector testing recommended.',
        options: [
          { label: '📞 Contact EmersonEIMS', nextStep: 'contact-support-load' },
        ],
      },
      'avr-replacement': {
        id: 'avr-replacement',
        question: 'AVR may need replacement.',
        instruction: `
**Common AVR Part Numbers:**
- Stamford AS440: 8,500 KES
- Stamford SX460: 12,000 KES
- Leroy Somer R448: 15,000 KES
- Mecc Alte DSR: 10,000 KES
        `,
        options: [
          { label: '📞 Order AVR from EmersonEIMS', nextStep: 'contact-support-load' },
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO 3: ENGINE WON'T START
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'engine-no-start',
    title: 'Engine Won\'t Start',
    description: 'Generator cranks but won\'t start, or no crank at all',
    icon: <Battery className="w-6 h-6" />,
    category: 'Starting System',
    difficulty: 2,
    estimatedTime: '20-45 minutes',
    startStep: 'crank-check',
    steps: {
      'crank-check': {
        id: 'crank-check',
        question: 'Does the engine crank (turn over) when you press start?',
        options: [
          { label: '✅ Yes - cranks but won\'t fire', nextStep: 'cranks-no-start' },
          { label: '❌ No - nothing happens', nextStep: 'no-crank' },
          { label: '🔊 Clicking sound only', nextStep: 'clicking' },
          { label: '🐌 Cranks very slowly', nextStep: 'slow-crank' },
        ],
      },
      'cranks-no-start': {
        id: 'cranks-no-start',
        question: 'Engine cranks but won\'t start. Check these in order:',
        instruction: `
**Diesel engines need: Fuel, Air, Compression, Timing**

**Quick Checks:**
1. Is there fuel in the tank?
2. Is the fuel shutoff valve open?
3. Is the emergency stop reset?
4. Any fault codes on controller?
        `,
        options: [
          { label: '🛢️ Fuel issue suspected', nextStep: 'fuel-check' },
          { label: '⚡ Electrical/Sensor issue', nextStep: 'sensor-check' },
          { label: '🔧 Mechanical issue', nextStep: 'mechanical-check' },
          { label: '❓ Not sure where to start', nextStep: 'fuel-check' },
        ],
      },
      'fuel-check': {
        id: 'fuel-check',
        question: 'Let\'s verify fuel delivery:',
        instruction: `
**Fuel System Diagnosis:**

1. **Loosen injector line at one injector**
2. **Crank engine for 5 seconds**
3. **Watch for fuel spray**

| Result | Meaning |
|--------|---------|
| Strong spray | Fuel OK - check timing |
| Weak dribble | Air in system or weak pump |
| No fuel | No supply - check tank/filter/pump |
| Foamy fuel | Air leak in suction side |

**What did you observe?**
        `,
        safetyWarning: 'Fuel spray is under pressure. Wear eye protection!',
        options: [
          { label: '💪 Strong fuel spray', nextStep: 'check-timing' },
          { label: '💧 Weak or no fuel', nextStep: 'bleed-fuel' },
          { label: '🫧 Foamy/bubbly fuel', nextStep: 'find-air-leak' },
        ],
      },
      'bleed-fuel': {
        id: 'bleed-fuel',
        question: 'Bleed air from fuel system:',
        instruction: `
**Fuel Bleeding Procedure:**

1. Check fuel tank has fuel
2. Open bleed screw on fuel filter housing
3. Operate manual priming pump (or crank engine)
4. Wait for solid fuel flow (no bubbles)
5. Close bleed screw
6. Repeat at injection pump if equipped with bleed point
7. Crank engine - should start

**If no manual pump:**
- Crank in 10-second bursts
- Wait 30 seconds between cranks
- Repeat until starts (up to 5-6 times)

**Did bleeding solve it?**
        `,
        options: [
          { label: '✅ Yes! Engine started', nextStep: 'resolved-start' },
          { label: '❌ Still no fuel', nextStep: 'check-fuel-pump' },
        ],
      },
      'check-fuel-pump': {
        id: 'check-fuel-pump',
        question: 'Fuel pump may be failed. Test it:',
        instruction: `
**Fuel Pump Test:**

**Electric pump:**
- Listen for pump running (key ON)
- Check fuse and relay
- Check voltage at pump connector

**Mechanical pump:**
- Disconnect output line
- Crank engine
- Should see fuel pulses

**Part Numbers:**
| Engine | Pump Part# | Price |
|--------|-----------|-------|
| Cummins 6BT | 3936316 | 18,000 |
| Perkins 1104 | ULPK0038 | 12,000 |
        `,
        options: [
          { label: '✅ Pump is working', nextStep: 'check-fuel-shutoff' },
          { label: '❌ Pump is dead', nextStep: 'replace-pump' },
        ],
      },
      'check-fuel-shutoff': {
        id: 'check-fuel-shutoff',
        question: 'Check fuel shutoff solenoid:',
        instruction: `
**Fuel Shutoff Solenoid:**

This electromagnetic valve must OPEN to allow fuel.

**Test:**
1. Turn key ON (don\'t crank)
2. Listen for "click" at solenoid
3. Manually push solenoid core in - feel for resistance
4. Measure 12V/24V at solenoid connector

**If no click:**
- Check wiring to solenoid
- Check controller output
- Solenoid may be failed
        `,
        options: [
          { label: '✅ Solenoid is working', nextStep: 'sensor-check' },
          { label: '❌ Solenoid not clicking', nextStep: 'fix-solenoid' },
        ],
      },
      'no-crank': {
        id: 'no-crank',
        question: 'No crank at all. Check battery and starting circuit:',
        instruction: `
**No Crank Diagnosis:**

1. **Check battery voltage**: Should be 12.6V (12V) or 25.2V (24V)
2. **Check battery terminals**: Clean and tight?
3. **Check emergency stop**: Is it released?
4. **Check safety switches**: Oil pressure bypass, etc.
5. **Check controller**: Is it powered? Any faults?
        `,
        options: [
          { label: '🔋 Battery voltage low', nextStep: 'charge-battery' },
          { label: '⚡ Battery OK, still no crank', nextStep: 'check-starter-circuit' },
        ],
      },
      'clicking': {
        id: 'clicking',
        question: 'Clicking sound = starter solenoid engaging but not enough power.',
        instruction: `
**Causes of clicking:**
1. Low battery
2. Poor battery connections
3. Failed starter motor
4. Engine seized

**Test:** Jump battery with known good battery or booster.
        `,
        options: [
          { label: '✅ Jumping helped - battery issue', nextStep: 'charge-battery' },
          { label: '❌ Still clicking with jump', nextStep: 'check-starter' },
        ],
      },
      'slow-crank': {
        id: 'slow-crank',
        question: 'Slow cranking = battery weak or high resistance:',
        instruction: `
**Slow Crank Causes:**
1. Discharged battery
2. Wrong viscosity oil (too thick)
3. Weak starter motor
4. High resistance in cables
5. Engine mechanical drag

**Try:** Charge battery, clean terminals, retest.
        `,
        options: [
          { label: '✅ Charged battery - cranks fast now', nextStep: 'cranks-no-start' },
          { label: '❌ Still slow after charging', nextStep: 'check-starter' },
        ],
      },
      'sensor-check': {
        id: 'sensor-check',
        question: 'Check engine sensors - may be preventing start:',
        instruction: `
**Critical Start Sensors:**

1. **Crankshaft Position Sensor** - Engine won\'t start without this
2. **Camshaft Position Sensor** - Required for injection timing
3. **Speed Sensor** - Controller needs to see cranking RPM

**Check:** Look for fault codes indicating sensor failure.
        `,
        options: [
          { label: '🔧 Found sensor fault', nextStep: 'replace-sensor' },
          { label: '✅ No sensor faults', nextStep: 'mechanical-check' },
        ],
      },
      'mechanical-check': {
        id: 'mechanical-check',
        question: 'Mechanical checks if all else passes:',
        instruction: `
**Mechanical Issues Preventing Start:**

1. **Timing off** - Belt/chain jumped teeth
2. **Compression loss** - Stuck valve, blown gasket
3. **Injection timing** - Pump timing way off

**Compression Test:**
- Remove injector, install gauge
- Should be 20-30 bar (290-435 psi)
- Compare all cylinders (within 10%)
        `,
        options: [
          { label: '📞 Need professional help', nextStep: 'contact-start-help' },
          { label: '🔧 Will check timing/compression', nextStep: 'resolved-start' },
        ],
      },
      'charge-battery': {
        id: 'charge-battery',
        question: 'Charge or replace battery:',
        instruction: `
**Battery Service:**
- Charge for 8+ hours
- Test under load after charging
- Replace if won't hold charge

**Battery sizes:**
- Typical generator: 100Ah - 200Ah
- Price: 18,000 - 45,000 KES
        `,
        options: [
          { label: '✅ Battery charged/replaced', nextStep: 'crank-check' },
        ],
      },
      'check-starter-circuit': {
        id: 'check-starter-circuit',
        question: 'Check starter circuit path:',
        instruction: `
1. Key switch output (should see voltage in START position)
2. Starter relay/contactor
3. Wiring to starter solenoid
4. Starter solenoid
5. Starter motor
        `,
        options: [
          { label: '✅ Found wiring issue', nextStep: 'resolved-start' },
          { label: '❌ Starter may be bad', nextStep: 'check-starter' },
        ],
      },
      'check-starter': {
        id: 'check-starter',
        question: 'Test starter motor directly:',
        instruction: `
**Direct Starter Test:**
1. Use jumper wire from battery + to starter solenoid terminal
2. Starter should engage and crank
3. If not, starter is failed

**Starter Part Numbers:**
| Engine | Starter | Price |
|--------|---------|-------|
| Cummins | 3957593 | 45,000 |
| CAT | 307-7177 | 85,000 |
        `,
        options: [
          { label: '✅ Starter works - wiring issue', nextStep: 'check-starter-circuit' },
          { label: '❌ Starter failed', nextStep: 'replace-starter' },
        ],
      },
      'replace-starter': {
        id: 'replace-starter',
        question: 'Starter motor replacement:',
        instruction: `
**Starter Replacement:**
1. Disconnect battery negative
2. Remove electrical connections from starter
3. Remove mounting bolts (usually 2-3)
4. Remove starter
5. Install new starter
6. Torque bolts to spec (35-45 Nm typical)
7. Reconnect wires
8. Reconnect battery
9. Test
        `,
        options: [
          { label: '✅ Replaced starter - working now', nextStep: 'resolved-start' },
          { label: '📞 Need help sourcing starter', nextStep: 'contact-start-help' },
        ],
      },
      'check-timing': {
        id: 'check-timing',
        question: 'Fuel is present but engine won\'t fire. Check timing.',
        instruction: 'Verify injection timing marks align. Timing chain/belt may have jumped.',
        options: [
          { label: '✅ Timing is correct', nextStep: 'mechanical-check' },
          { label: '❌ Timing is off', nextStep: 'contact-start-help' },
        ],
      },
      'find-air-leak': {
        id: 'find-air-leak',
        question: 'Find and fix air leak in fuel system.',
        instruction: 'Check all fuel line connections on suction side. Look for cracks or loose fittings.',
        options: [
          { label: '✅ Fixed air leak', nextStep: 'bleed-fuel' },
        ],
      },
      'replace-pump': {
        id: 'replace-pump',
        question: 'Replace fuel lift pump.',
        instruction: 'Order correct pump for your engine. Installation typically takes 30-60 minutes.',
        options: [
          { label: '✅ Pump replaced', nextStep: 'bleed-fuel' },
        ],
      },
      'fix-solenoid': {
        id: 'fix-solenoid',
        question: 'Fix or replace fuel shutoff solenoid.',
        instruction: 'Check wiring first. If wiring OK, replace solenoid.',
        options: [
          { label: '✅ Solenoid working now', nextStep: 'cranks-no-start' },
        ],
      },
      'replace-sensor': {
        id: 'replace-sensor',
        question: 'Replace faulty sensor.',
        instruction: 'Order correct sensor. Clear fault codes after replacement.',
        options: [
          { label: '✅ Sensor replaced', nextStep: 'resolved-start' },
        ],
      },
      'resolved-start': {
        id: 'resolved-start',
        question: '✅ Is the engine starting now?',
        options: [
          { label: '✅ Yes! Running perfectly', nextStep: 'success-start' },
          { label: '❌ Still won\'t start', nextStep: 'contact-start-help' },
        ],
      },
      'success-start': {
        id: 'success-start',
        question: '🎉 Excellent! Engine is running.',
        instruction: 'Let it warm up, then test under load. Document what was repaired.',
        options: [
          { label: '🔄 Start new troubleshooting', nextStep: 'crank-check' },
        ],
      },
      'contact-start-help': {
        id: 'contact-start-help',
        question: '📞 Professional assistance needed.',
        instruction: `
**Contact EmersonEIMS:**
📞 +254 XXX XXX XXX
📧 support@emersoneims.com

We have mobile service units with full diagnostic capability.
        `,
        options: [
          { label: '🔄 Try more steps', nextStep: 'crank-check' },
        ],
      },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function InteractiveTroubleshooter() {
  const [selectedScenario, setSelectedScenario] = useState<TroubleshootingScenario | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [satisfaction, setSatisfaction] = useState<'none' | 'positive' | 'negative'>('none');

  const currentStep = selectedScenario?.steps[currentStepId];

  const selectScenario = useCallback((scenario: TroubleshootingScenario) => {
    setSelectedScenario(scenario);
    setCurrentStepId(scenario.startStep);
    setHistory([scenario.startStep]);
    setSatisfaction('none');
  }, []);

  const goToStep = useCallback((stepId: string) => {
    setCurrentStepId(stepId);
    setHistory(prev => [...prev, stepId]);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentStepId(newHistory[newHistory.length - 1]);
    }
  }, [history]);

  const resetSession = useCallback(() => {
    setSelectedScenario(null);
    setCurrentStepId('');
    setHistory([]);
    setSatisfaction('none');
  }, []);

  // Scenario Selection View
  if (!selectedScenario) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            🔧 Interactive Troubleshooting Guide
          </h2>
          <p className="text-slate-400">
            Select your problem and we'll guide you step-by-step to the solution
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCENARIOS.map((scenario) => (
            <motion.button
              key={scenario.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectScenario(scenario)}
              className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-left hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 group-hover:bg-cyan-500/30 transition-colors">
                  {scenario.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{scenario.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{scenario.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2 py-1 bg-slate-700/50 rounded text-slate-300">
                      {scenario.category}
                    </span>
                    <span className="text-slate-500">
                      ~{scenario.estimatedTime}
                    </span>
                    <span className="text-yellow-400">
                      {'★'.repeat(scenario.difficulty)}{'☆'.repeat(5 - scenario.difficulty)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-400 mb-1">Don't see your problem?</h4>
              <p className="text-sm text-blue-300/70">
                Use the AI Expert Chat for any generator question. Our AI can diagnose complex issues
                and guide you through any troubleshooting scenario.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Troubleshooting View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={resetSession}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h2 className="font-semibold text-white">{selectedScenario.title}</h2>
            <p className="text-sm text-slate-400">Step {history.length} of troubleshooting</p>
          </div>
        </div>
        <button
          onClick={resetSession}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
      </div>

      {/* Progress */}
      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((history.length / 8) * 100, 100)}%` }}
        />
      </div>

      {/* Current Step */}
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStepId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Question Card */}
            <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {currentStep.question}
                  </h3>

                  {currentStep.instruction && (
                    <div className="mt-4 p-4 bg-slate-900/50 rounded-xl">
                      <div
                        className="text-sm text-slate-300 prose prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: currentStep.instruction
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br>')
                            .replace(/\|(.+)\|/g, '<code>$1</code>')
                        }}
                      />
                    </div>
                  )}

                  {currentStep.safetyWarning && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-sm text-red-300">{currentStep.safetyWarning}</span>
                    </div>
                  )}

                  {currentStep.tools && currentStep.tools.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-amber-300">
                        Tools needed: {currentStep.tools.join(', ')}
                      </span>
                    </div>
                  )}

                  {currentStep.tip && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                      <span className="text-sm text-amber-300">💡 {currentStep.tip}</span>
                    </div>
                  )}

                  {currentStep.partNumbers && currentStep.partNumbers.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-slate-400 text-left">
                            <th className="pb-2">Brand/Model</th>
                            <th className="pb-2">Part Number</th>
                            <th className="pb-2">Price (KES)</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-300">
                          {currentStep.partNumbers.map((part, i) => (
                            <tr key={i} className="border-t border-slate-700/50">
                              <td className="py-2">{part.brand}</td>
                              <td className="py-2 font-mono">{part.partNo}</td>
                              <td className="py-2">{part.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentStep.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => goToStep(option.nextStep)}
                  className="w-full p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl text-left hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all flex items-center justify-between group"
                >
                  <span className="text-white">{option.label}</span>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </motion.button>
              ))}
            </div>

            {/* Back Button */}
            {history.length > 1 && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Go back to previous step</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Section (shows on resolution screens) */}
      {currentStepId.includes('resolved') || currentStepId.includes('feedback') || currentStepId.includes('success') ? (
        <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
          <h4 className="font-medium text-white mb-4">Was this troubleshooting guide helpful?</h4>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSatisfaction('positive')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                satisfaction === 'positive'
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:text-green-400'
              } border`}
            >
              <ThumbsUp className="w-5 h-5" />
              Yes, it helped!
            </button>
            <button
              onClick={() => setSatisfaction('negative')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                satisfaction === 'negative'
                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:text-red-400'
              } border`}
            >
              <ThumbsDown className="w-5 h-5" />
              Need more help
            </button>
          </div>
          {satisfaction === 'positive' && (
            <p className="mt-3 text-sm text-green-400">
              Thank you for your feedback! Generator Oracle is here whenever you need it.
            </p>
          )}
          {satisfaction === 'negative' && (
            <p className="mt-3 text-sm text-slate-400">
              We're sorry the guide didn't fully resolve your issue. Please contact EmersonEIMS
              for professional assistance.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
