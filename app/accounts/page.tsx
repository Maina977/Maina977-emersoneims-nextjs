/**
 * Accounts (Report B): preview only. 404 unless ACCOUNTS_ENABLED is exactly
 * "true", and always 404 in production (lib/accounts/config.ts). Never
 * indexed, not in the sitemap.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { accountsEnabled } from '@/lib/accounts/config';
import AccountsApp from '@/components/accounts/AccountsApp';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Accounts (preview)',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AccountsPage() {
  if (!accountsEnabled()) notFound();
  return <AccountsApp />;
}
