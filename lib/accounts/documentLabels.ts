/**
 * Status labels for approvable documents. Pure (browser- and server-safe).
 *
 * Unless the server has verified an approval by a verified reviewer of the
 * EXACT current revision, every document keeps its existing label: Solar
 * DRAFT, Generator Oracle sign-off NOT VERIFIED, Building BOQ DRAFT (not
 * certified).
 */
import { DRAFT_NOTICE } from '@/lib/qs/boq';
import type { Tool } from './config';

export interface ApprovalStatus {
  approved: boolean;
  label: string;
  reason: string;
  reviewer?: { name: string; registration: string; approvedAt: string };
  /** The latest recorded rejection of this exact revision, if any (the document stays unapproved). */
  rejection?: { name: string; registration: string; rejectedAt: string; reason: string };
}

export function documentLabel(tool: Tool, documentType: string, approved: boolean): string {
  if (tool === 'solar' && documentType === 'proposal') return approved ? 'FOR ISSUE' : 'DRAFT';
  if (tool === 'oracle' && documentType === 'service-signoff') return approved ? 'SIGNED OFF — verified reviewer, exact revision' : 'NOT VERIFIED';
  if (tool === 'building' && documentType === 'boq-certification') return approved ? 'CERTIFIED — verified reviewer, exact revision' : DRAFT_NOTICE;
  return 'NOT VERIFIED';
}
