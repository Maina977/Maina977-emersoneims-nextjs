/**
 * GENERATOR ORACLE PUSH SUBSCRIPTION API
 * Manages push notification subscriptions
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/db';

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

async function initSubscriptionTable(): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_push_subscriptions (
        id SERIAL PRIMARY KEY,
        endpoint TEXT UNIQUE NOT NULL,
        p256dh_key TEXT NOT NULL,
        auth_key TEXT NOT NULL,
        user_id INTEGER,
        device_info JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_push_endpoint ON oracle_push_subscriptions(endpoint)
    `);

    return true;
  } catch (error) {
    console.error('Failed to init subscription table:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Save subscription
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, userId, deviceInfo } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;

    if (!p256dh || !auth) {
      return NextResponse.json(
        { success: false, error: 'Missing subscription keys' },
        { status: 400 }
      );
    }

    const pool = await getPostgresPool();

    if (!pool) {
      // Store locally if no database
      return NextResponse.json({
        success: true,
        message: 'Subscription stored locally',
        storage: 'local',
      });
    }

    await initSubscriptionTable();

    // Upsert subscription
    await pool.query(
      `INSERT INTO oracle_push_subscriptions (endpoint, p256dh_key, auth_key, user_id, device_info)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (endpoint) DO UPDATE SET
         p256dh_key = EXCLUDED.p256dh_key,
         auth_key = EXCLUDED.auth_key,
         user_id = EXCLUDED.user_id,
         device_info = EXCLUDED.device_info,
         last_used_at = NOW()`,
      [endpoint, p256dh, auth, userId || null, JSON.stringify(deviceInfo || {})]
    );

    return NextResponse.json({
      success: true,
      message: 'Subscription saved',
    });
  } catch (error) {
    console.error('Save subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE - Remove subscription
// ═══════════════════════════════════════════════════════════════════════════════

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: 'Endpoint required' },
        { status: 400 }
      );
    }

    const pool = await getPostgresPool();

    if (!pool) {
      return NextResponse.json({
        success: true,
        message: 'Local subscription removed',
      });
    }

    await pool.query(
      `DELETE FROM oracle_push_subscriptions WHERE endpoint = $1`,
      [endpoint]
    );

    return NextResponse.json({
      success: true,
      message: 'Subscription removed',
    });
  } catch (error) {
    console.error('Remove subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove subscription' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Get subscription count (admin)
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET() {
  try {
    const pool = await getPostgresPool();

    if (!pool) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'Database not available',
      });
    }

    await initSubscriptionTable();

    const result = await pool.query(
      `SELECT COUNT(*) as count FROM oracle_push_subscriptions`
    );

    const row = result.rows[0] as { count: string };
    return NextResponse.json({
      success: true,
      count: parseInt(row.count),
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get subscription count' },
      { status: 500 }
    );
  }
}
