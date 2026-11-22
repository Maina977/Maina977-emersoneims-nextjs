/**
 * Blank templates for the pilot cards, generated in the browser (nothing is
 * fetched). The three short templates are copies of the committed files in
 * docs/; tests/validation-pilots/templates.test.ts fails if a copy drifts.
 * The two Oracle sheets are generated from the live library on demand
 * (./oracleTemplates, loaded only when the button is pressed).
 */

export const SOLAR_TEMPLATE = `# TEMPLATE ONLY. Ten EmersonEIMS systems. Do not fill from memory or from the design; every measured value needs its source file.
systemId,site_county,commissioned,designFile,toolVersion,kWp,inverterModel,batteryKwh,month,predicted_kWh,measured_kWh,measuredSource,measuredFileRef,dataGap_days,notes
SYS-01,,,,,,,,,,,,,,
SYS-02,,,,,,,,,,,,,,
SYS-03,,,,,,,,,,,,,,
SYS-04,,,,,,,,,,,,,,
SYS-05,,,,,,,,,,,,,,
SYS-06,,,,,,,,,,,,,,
SYS-07,,,,,,,,,,,,,,
SYS-08,,,,,,,,,,,,,,
SYS-09,,,,,,,,,,,,,,
SYS-10,,,,,,,,,,,,,,
`;

export const BOREHOLES_TEMPLATE = `# TEMPLATE ONLY. One row per drilled borehole from its completion record. Units: degrees (WGS84), metres, m3/h, hours, uS/cm, mg/L. positionSource: gps|address|map. setting: basement|volcanic|sedimentary|alluvial|unknown. outcome: productive|low-yield|dry. verification: verified|unverified. waterStrikesM: depths separated by ;. Never fill a value that is not in the source document.
id,lat,lon,positionSource,elevationM,drilledOn,county,setting,drilledDepthM,staticWaterLevelM,waterStrikesM,testedYieldM3h,pumpTestRateM3h,pumpTestDurationH,pumpTestDrawdownM,outcome,productiveThresholdM3h,ecUsCm,fluorideMgL,ironMgL,nitrateMgL,contractor,sourceDocument,verification,licence
`;

export const QS_TEMPLATE = `# TEMPLATE ONLY. Ten projects: for each, the manual BOQ prepared independently by a QS from the same drawings, and the take-off tool quantity per item. Never fill toolQty from the manual BOQ or referenceQty from the tool. rate optional (KES, dated source in notes); needed for the total check.
project,drawingSet,itemCode,description,unit,referenceQty,toolQty,rate,referenceSource,notes
`;

/** Starts a browser download of text held in memory. No network request is made. */
export function downloadBlob(name: string, data: BlobPart, type: string): void {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
