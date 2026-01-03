/**
 * Image Rename Mapping for SEO
 * Maps old numbered filenames to descriptive SEO-friendly names
 */

export const imageRenameMap: Record<string, string> = {
  // UPS & Power Protection
  '901.png': 'ups-power-protection-system.png',
  '902.png': 'ups-battery-bank.png',
  '903.png': 'ups-rack-mount.png',
  '904.png': 'ups-control-panel.png',
  
  // HVAC & Air Conditioning
  '909.png': 'hvac-air-conditioning-unit.png',
  '910.png': 'hvac-commercial-system.png',
  '911.png': 'hvac-industrial-cooling.png',
  '912.png': 'hvac-vrf-system.png',
  
  // Motors & Rewinding
  '920.png': 'motor-rewinding-workshop.png',
  '921.png': 'electric-motor-repair.png',
  '922.png': 'motor-diagnostics-testing.png',
  
  // Borehole & Water Systems
  '913.png': 'borehole-pump-installation.png',
  '914.png': 'water-pump-system.png',
  '915.png': 'solar-water-pumping.png',
  '916.png': 'water-treatment-plant.png',
  
  // High Voltage Infrastructure
  '917.png': 'high-voltage-transformer.png',
  '918.png': 'switchgear-panel.png',
  '919.png': 'power-distribution-board.png',
  
  // Steel & Fabrication
  '923.png': 'steel-fabrication-workshop.png',
  '924.png': 'generator-canopy-fabrication.png',
  '65.png': 'custom-control-panel.png',
  '66.png': 'structural-steel-work.png',
  
  // Incinerators
  '72.png': 'medical-waste-incinerator.png',
  '73.png': 'industrial-incinerator.png',
  '74.png': 'incinerator-emission-control.png',
  '75.png': 'waste-management-system.png',
  
  // Generator related
  '2.png': 'diesel-generator-20kva.png',
  '3.png': 'generator-control-system.png',
  '4.png': 'generator-fuel-system.png',
  '5.png': 'generator-alternator.png',
  '6.png': 'generator-exhaust-system.png',
  '10.png': 'commercial-generator-install.png',
  '11.png': 'industrial-generator-room.png',
  '12.png': 'generator-maintenance-service.png',
  '13.png': 'generator-load-testing.png',
  '14.png': 'automatic-transfer-switch.png',
  '15.png': 'generator-synchronization.png',
  '16.png': 'diesel-tank-installation.png',
  
  // Additional numbered images
  '57.png': 'solar-panel-installation-kenya.png',
  '58.png': 'solar-inverter-system.png',
  '59.png': 'solar-battery-storage.png',
  '60.png': 'rooftop-solar-commercial.png',
  '61.png': 'ground-mount-solar-farm.png',
  '62.png': 'solar-monitoring-system.png',
  '63.png': 'hybrid-solar-generator.png',
  '64.png': 'off-grid-solar-system.png',
};

export const getNewImageName = (oldName: string): string => {
  return imageRenameMap[oldName] || oldName;
};
