/**
 * Cooling System Educational Content
 * EMERSON EIMS PROPRIETARY CONTENT
 */

import { EducationalContent } from '../comprehensiveEducation';

export const COOLING_CONTENT: EducationalContent[] = [
  {
    id: 'COOL_001',
    category: 'cooling',
    subcategory: 'fundamentals',
    title: 'Generator Cooling System Fundamentals for Kenya Climate',
    slug: 'generator-cooling-system-kenya',
    keywords: ['generator cooling Kenya', 'radiator maintenance Nairobi', 'diesel cooling system', 'overheating prevention'],
    summary: 'Understanding diesel generator cooling systems and maintenance requirements for reliable operation in Kenya warm climate.',
    content: [
      { heading: 'Cooling System Importance', paragraphs: ['The cooling system maintains engine temperature within safe operating range. In Kenya warm climate, cooling system reliability is especially critical.', 'Diesel engines convert only about 35-40% of fuel energy into useful work. The remainder becomes heat that must be removed.'] },
      { heading: 'System Components', paragraphs: ['Water pump circulates coolant through engine and radiator.', 'Thermostat controls coolant flow to maintain optimal temperature.', 'Radiator transfers heat from coolant to air.', 'Cooling fan pulls air through radiator.'] },
      { heading: 'Kenya Climate Considerations', paragraphs: ['Warm ambient temperatures reduce cooling temperature differential.', 'Dust and debris clog radiator fins in many Kenya locations.', 'Altitude affects cooling at highland locations.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'theory',
    estimatedReadTime: 14,
    relatedFaultCodes: ['High Temperature', 'Low Coolant', 'Cooling Fan Fault'],
    relatedContent: ['COOL_002', 'SENS_001'],
    tools: ['Coolant tester', 'Pressure tester'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'COOL_002',
    category: 'cooling',
    subcategory: 'thermostat',
    title: 'Thermostat Testing and Replacement',
    slug: 'thermostat-testing-replacement-kenya',
    keywords: ['thermostat Kenya', 'thermostat testing', 'engine thermostat', 'cooling thermostat'],
    summary: 'Diagnosing and replacing engine thermostats for proper temperature regulation.',
    content: [
      { heading: 'Thermostat Function', paragraphs: ['Thermostat controls coolant flow to maintain operating temperature.', 'Remains closed when cold, opens progressively as temperature rises.', 'Typical opening temperature: 82-88°C.'] },
      { heading: 'Testing', paragraphs: ['Visual test: Place in hot water, verify opening at rated temperature.', 'Operational test: Compare upper and lower hose temperatures.', 'Stuck closed: engine overheats. Stuck open: engine runs too cool.'] },
      { heading: 'Replacement', paragraphs: ['Always replace gasket with new.', 'Note orientation marks on thermostat.', 'Bleed air from cooling system after installation.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'repair',
    estimatedReadTime: 12,
    relatedFaultCodes: ['High Temperature', 'Overcooling', 'Thermostat Fault'],
    relatedContent: ['COOL_001', 'COOL_003'],
    tools: ['Hot water', 'Thermometer', 'New gasket'],
    partsPageLink: '/parts/cooling-system',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'COOL_003',
    category: 'cooling',
    subcategory: 'water_pump',
    title: 'Water Pump Diagnosis and Replacement',
    slug: 'water-pump-diagnosis-replacement-kenya',
    keywords: ['water pump Kenya', 'coolant pump', 'pump replacement', 'water pump failure'],
    summary: 'Identifying water pump failures and proper replacement procedures.',
    content: [
      { heading: 'Failure Signs', paragraphs: ['Coolant leak from weep hole indicates seal failure.', 'Bearing noise suggests bearing wear.', 'Overheating with full coolant may indicate impeller damage.'] },
      { heading: 'Testing', paragraphs: ['Check for weep hole leakage.', 'Feel for shaft play indicating bearing wear.', 'Check flow by temperature differential across radiator.'] },
      { heading: 'Replacement', paragraphs: ['Replace gasket/O-ring with new.', 'Check belt tension after installation.', 'Fill system and bleed air completely.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'repair',
    estimatedReadTime: 14,
    relatedFaultCodes: ['High Temperature', 'Coolant Leak', 'Low Coolant Flow'],
    relatedContent: ['COOL_001', 'COOL_002'],
    tools: ['Wrenches', 'Coolant', 'New gasket'],
    partsPageLink: '/parts/cooling-system',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'COOL_004',
    category: 'cooling',
    subcategory: 'radiator',
    title: 'Radiator Cleaning and Maintenance',
    slug: 'radiator-cleaning-maintenance-kenya',
    keywords: ['radiator cleaning Kenya', 'radiator maintenance', 'blocked radiator', 'radiator service'],
    summary: 'Maintaining radiator efficiency through proper cleaning and care.',
    content: [
      { heading: 'External Cleaning', paragraphs: ['Debris accumulates on fin surfaces reducing airflow.', 'Clean from inside out with low-pressure water.', 'Do not use high pressure that could bend fins.', 'In dusty Kenya conditions, clean more frequently.'] },
      { heading: 'Internal Cleaning', paragraphs: ['Flush cooling system to remove scale and deposits.', 'Use appropriate cleaner compatible with system materials.', 'Replace coolant with correct mixture after cleaning.'] },
      { heading: 'Inspection', paragraphs: ['Check for damaged fins and straighten if possible.', 'Inspect tanks for cracks or leaks.', 'Verify cap pressure rating and seal condition.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['High Temperature', 'Cooling Restricted'],
    relatedContent: ['COOL_001', 'COOL_005'],
    tools: ['Water hose', 'Fin comb', 'Coolant'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'COOL_005',
    category: 'cooling',
    subcategory: 'coolant',
    title: 'Coolant Selection and Management',
    slug: 'coolant-selection-management-kenya',
    keywords: ['coolant Kenya', 'antifreeze', 'coolant mixture', 'coolant replacement'],
    summary: 'Selecting and maintaining proper coolant for generator cooling systems.',
    content: [
      { heading: 'Coolant Types', paragraphs: ['Ethylene glycol-based coolants are most common.', 'OAT (Organic Acid Technology) provides extended life.', 'Never mix different coolant types.'] },
      { heading: 'Concentration', paragraphs: ['Maintain 40-50% coolant concentration even in Kenya (no freeze protection needed).', 'Proper concentration provides corrosion protection.', 'Test concentration with refractometer.'] },
      { heading: 'Replacement', paragraphs: ['Replace coolant every 2-3 years or per manufacturer schedule.', 'Flush system before refilling.', 'Use clean water for mixing - distilled is preferred.'] }
    ],
    skillLevel: 'beginner',
    contentType: 'maintenance',
    estimatedReadTime: 12,
    relatedFaultCodes: ['Low Coolant', 'Coolant Contaminated'],
    relatedContent: ['COOL_001', 'COOL_004'],
    tools: ['Refractometer', 'Drain container', 'Coolant'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'COOL_006',
    category: 'cooling',
    subcategory: 'fan',
    title: 'Cooling Fan Systems and Diagnosis',
    slug: 'cooling-fan-systems-diagnosis-kenya',
    keywords: ['cooling fan Kenya', 'fan clutch', 'electric fan', 'fan diagnosis'],
    summary: 'Understanding and troubleshooting cooling fan systems.',
    content: [
      { heading: 'Fan Types', paragraphs: ['Belt-driven fans run continuously with engine.', 'Clutch fans engage based on temperature.', 'Electric fans controlled by temperature switch or controller.'] },
      { heading: 'Diagnosis', paragraphs: ['Check fan operation at high temperature.', 'Verify belt condition and tension for belt-driven fans.', 'Test temperature switch operation for electric fans.', 'Check clutch engagement for viscous clutch fans.'] },
      { heading: 'Common Problems', paragraphs: ['Broken fan blades reduce airflow.', 'Failed clutch causes continuous or no engagement.', 'Electric fan motor failure prevents operation.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['High Temperature', 'Fan Fault', 'Cooling Fan Fault'],
    relatedContent: ['COOL_001', 'COOL_004'],
    tools: ['Temperature sensor', 'Multimeter', 'Belt tension gauge'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'COOL_007',
    category: 'cooling',
    subcategory: 'leaks',
    title: 'Cooling System Leak Detection and Repair',
    slug: 'cooling-system-leak-detection-kenya',
    keywords: ['coolant leak Kenya', 'leak detection', 'cooling leak repair', 'pressure test'],
    summary: 'Finding and fixing cooling system leaks.',
    content: [
      { heading: 'Leak Types', paragraphs: ['External leaks are visible - wet spots, drips, puddles.', 'Internal leaks into engine are not visible but coolant disappears.', 'Pressure cap leaks may only occur at high temperature.'] },
      { heading: 'Detection Methods', paragraphs: ['Visual inspection for obvious leaks.', 'Pressure testing identifies leaks under system pressure.', 'UV dye helps locate small leaks.', 'Combustion leak testing detects head gasket failures.'] },
      { heading: 'Common Leak Points', paragraphs: ['Hose connections - clamps loose or hoses deteriorated.', 'Water pump weep hole - seal failure.', 'Radiator tanks - cracking or separation.', 'Head gasket - internal leak into cylinders.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'diagnostic',
    estimatedReadTime: 14,
    relatedFaultCodes: ['Low Coolant', 'Coolant Leak', 'High Temperature'],
    relatedContent: ['COOL_001', 'COOL_003'],
    tools: ['Pressure tester', 'UV light and dye', 'Combustion leak tester'],
    lastUpdated: '2024-03-15'
  },
  {
    id: 'COOL_008',
    category: 'cooling',
    subcategory: 'overheating',
    title: 'Overheating Diagnosis and Resolution',
    slug: 'overheating-diagnosis-resolution-kenya',
    keywords: ['generator overheating Kenya', 'high temperature diagnosis', 'overheating causes', 'temperature high'],
    summary: 'Systematic approach to diagnosing and resolving engine overheating problems.',
    content: [
      { heading: 'Immediate Actions', paragraphs: ['Reduce load to lower heat generation.', 'Verify coolant level - add if low (when safe).', 'Check for obvious blockages or failures.'] },
      { heading: 'Diagnostic Steps', paragraphs: ['Verify temperature gauge/sensor accuracy.', 'Check coolant level and condition.', 'Inspect radiator for external blockage.', 'Test thermostat operation.', 'Verify water pump function.', 'Check fan operation.'] },
      { heading: 'Common Causes', paragraphs: ['Low coolant level - leaks or consumption.', 'Blocked radiator - external debris or internal scale.', 'Failed thermostat - stuck closed.', 'Water pump failure - no flow.', 'Fan malfunction - no airflow.', 'Engine overload - excess heat generation.'] }
    ],
    skillLevel: 'intermediate',
    contentType: 'troubleshooting',
    estimatedReadTime: 16,
    relatedFaultCodes: ['High Temperature', 'Overheat Shutdown'],
    relatedContent: ['COOL_001', 'COOL_002', 'COOL_003'],
    tools: ['Temperature gauge', 'Pressure tester', 'IR thermometer'],
    lastUpdated: '2024-03-15'
  }
];

export const COOLING_CONTENT_COUNT = COOLING_CONTENT.length;
