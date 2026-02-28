/**
 * GENERATOR ORACLE VAPID KEY API
 * Returns the public VAPID key for push subscription
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return NextResponse.json(
      {
        success: false,
        error: 'VAPID keys not configured',
        message: 'Push notifications are not available. Configure VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.',
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    success: true,
    publicKey,
  });
}
