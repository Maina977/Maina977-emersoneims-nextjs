'use client';
// The worked example (SPN 100 FMI 1) for the Fault Center, loaded on demand.
import DetailedFaultDisplay, { DETAILED_FAULT_CODES } from './DetailedFaultDisplay';

export default function DetailedFaultExample() {
  return <DetailedFaultDisplay faultCode={DETAILED_FAULT_CODES['100-1']} />;
}
