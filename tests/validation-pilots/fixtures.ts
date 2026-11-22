/**
 * TEST rows only for the pilot comparison tests. Every name, file and value
 * here is fictitious ("TEST ..."); none is a real client record.
 */
import { BOREHOLE_CSV_COLUMNS } from '@/lib/aquascan-validation/importCsv';
import { csvLine } from '@/lib/validation/pilots/csv';

export const ORACLE_CSV = [
  '# TEST rows only',
  'id,brand,code,title,severity,highRisk,verified,oemManual (from register),edition,page,verdict (correct / change / remove),reviewer,comment',
  'TEST-A1,TEST brand,1,Low oil,shutdown,YES,false,TEST-MANUAL,TEST-ED,12,correct,TEST-REVIEWER,',
  'TEST-A2,TEST brand,2,High temp,shutdown,YES,false,TEST-MANUAL,,13,correct,TEST-REVIEWER,',
  'TEST-A3,TEST brand,3,Overspeed,critical,YES,false,TEST-MANUAL,TEST-ED,14,change,TEST-REVIEWER,',
  'TEST-A4,TEST brand,4,Fuel low,warning,no,false,TEST-MANUAL,TEST-ED,15,remove,TEST-REVIEWER,not in this controller',
  'TEST-A5,TEST brand,5,Charge fail,warning,no,false,,,,,,',
].join('\n');

const SOLAR_HEAD = 'systemId,site_county,commissioned,designFile,toolVersion,kWp,inverterModel,batteryKwh,month,predicted_kWh,measured_kWh,measuredSource,measuredFileRef,dataGap_days,notes';
const sol = (month: string, p: string, m: string, gap: string, notes = '', src = 'TEST portal', ref = 'TEST-ClientCo-export.csv') =>
  csvLine(['TEST-ClientCo-SYS', 'TEST county', '2025-06-01', 'TEST-ClientCo-design.pdf', 'TEST-1.0', '10', 'TEST inverter', '0', month, p, m, src, ref, gap, notes]);
export const SOLAR_CSV = [
  '# TEST rows only',
  SOLAR_HEAD,
  sol('2026-01', '1000', '950', '0'), // row 2: 5.3 % within
  sol('2026-02', '1000', '800', '0'), // row 3: 25 % over, no reason
  sol('2026-03', '1000', '800', '0', 'TEST: grid outage'), // row 4: 25 % over, reason
  sol('2026-04', '1000', '', '0'), // row 5: no measured value
  sol('2026-05', '1000', '900', '3'), // row 6: data gap
  sol('2026/06', '1000', '900', '0'), // row 7: invalid month
  'SYS-02,,,,,,,,,,,,,,', // empty template row: skipped
].join('\n');

const bh = (o: Partial<Record<(typeof BOREHOLE_CSV_COLUMNS)[number], string>>) => {
  const base: Record<string, string> = {
    id: 'TEST-BH-1', lat: '-1.2921', lon: '36.8219', positionSource: 'gps', elevationM: '1700', drilledOn: '2020-01-15', county: 'TEST county',
    setting: 'volcanic', drilledDepthM: '150', staticWaterLevelM: '40', waterStrikesM: '60;90', testedYieldM3h: '5', pumpTestRateM3h: '5',
    pumpTestDurationH: '24', pumpTestDrawdownM: '20', outcome: 'productive', productiveThresholdM3h: '1', ecUsCm: '500', fluorideMgL: '1',
    ironMgL: '0.1', nitrateMgL: '5', contractor: 'TEST Drillers', sourceDocument: 'TEST-ClientCo-completion.pdf', verification: 'verified', licence: 'TEST consent letter',
  };
  return csvLine(BOREHOLE_CSV_COLUMNS.map((c) => o[c] ?? base[c]));
};
export const BOREHOLES_CSV = [
  '# TEST rows only',
  BOREHOLE_CSV_COLUMNS.join(','),
  bh({}), // row 2: accepted
  bh({ id: 'TEST-BH-2', lat: '1.29', lon: '-36.8' }), // row 3: outside Kenya, rejected
  bh({ id: 'TEST-BH-3', drilledDepthM: 'deep' }), // row 4: refused at import
  bh({ id: 'TEST-BH-4', lat: '-0.5', lon: '37.4', positionSource: 'map', verification: 'unverified', sourceDocument: 'TEST-OtherCo-report.pdf' }), // row 5: accepted with flags
].join('\n');

export const QS_CSV = [
  '# TEST rows only',
  'project,drawingSet,itemCode,description,unit,referenceQty,toolQty,rate,referenceSource,notes',
  'TEST ClientCo House,TEST-DWG-01,A1,Concrete,m3,100,101,15000,TEST QS manual BOQ,TEST rate 2026-11',
  'TEST ClientCo House,TEST-DWG-01,A2,Blockwork,m2,200,210,2000,TEST QS manual BOQ,',
  'TEST ClientCo House,TEST-DWG-01,A3,Steel,kg,0,0,150,TEST QS manual BOQ,',
  'TEST ClientCo House,TEST-DWG-01,A4,Paint,m2,0,5,300,TEST QS manual BOQ,',
  'TEST ClientCo House,TEST-DWG-01,A5,Tiles,m2,abc,10,500,TEST QS manual BOQ,',
].join('\n');
