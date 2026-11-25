/**
 * GENERATOR ORACLE SYNC API
 * Cloud sync endpoint for fault database
 *
 * @copyright 2026 Generator Oracle
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/db';
import { isNewerVersion } from '@/lib/generator-oracle/versionManager';
import { withdrawnRouteResponse } from '@/lib/generator-oracle/safety/withdrawal';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface FaultVersionRow {
  id: number;
  version: string;
  fault_count: number;
  checksum: string;
  changelog: string[] | null;
  released_at: Date;
  is_current: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

async function initSyncTables(): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_fault_versions (
        id SERIAL PRIMARY KEY,
        version VARCHAR(20) NOT NULL UNIQUE,
        fault_count INTEGER DEFAULT 0,
        checksum VARCHAR(64),
        changelog JSONB,
        released_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_current BOOLEAN DEFAULT FALSE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_fault_updates (
        id SERIAL PRIMARY KEY,
        version_id INTEGER REFERENCES oracle_fault_versions(id),
        fault_id VARCHAR(100) NOT NULL,
        action VARCHAR(10) NOT NULL,
        fault_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_fault_versions_current ON oracle_fault_versions(is_current)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_fault_updates_version ON oracle_fault_updates(version_id)`);

    return true;
  } catch (error) {
    console.error('Failed to init sync tables:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Check for updates
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientVersion = searchParams.get('version') || '0.0.0';

    const pool = await getPostgresPool();

    if (!pool) {
      // Return static version info if no database
      return NextResponse.json({
        hasUpdate: false,
        currentVersion: clientVersion,
        latestVersion: '1.0.0',
        changeCount: 0,
        message: 'Database unavailable - using local data',
      });
    }

    await initSyncTables();

    // Get current version
    const versionResult = await pool.query(
      `SELECT * FROM oracle_fault_versions WHERE is_current = true LIMIT 1`
    );

    if (versionResult.rows.length === 0) {
      // No versions in database - create initial
      const initialVersion = '1.0.0';
      await pool.query(
        `INSERT INTO oracle_fault_versions (version, fault_count, is_current)
         VALUES ($1, 0, true)
         ON CONFLICT (version) DO NOTHING`,
        [initialVersion]
      );

      return NextResponse.json({
        hasUpdate: isNewerVersion(initialVersion, clientVersion),
        currentVersion: clientVersion,
        latestVersion: initialVersion,
        changeCount: 0,
      });
    }

    const latest = versionResult.rows[0] as unknown as FaultVersionRow;

    // Check if client needs update
    const hasUpdate = isNewerVersion(latest.version, clientVersion);

    // Count changes if update needed
    let changeCount = 0;
    if (hasUpdate) {
      // Get all versions between client and latest
      const changesResult = await pool.query(
        `SELECT SUM(fault_count) as total FROM oracle_fault_versions
         WHERE version > $1 AND version <= $2`,
        [clientVersion, latest.version]
      );
      const total = changesResult.rows[0]?.total;
      changeCount = typeof total === 'number' ? total : parseInt(String(total || '0'));
    }

    return NextResponse.json({
      hasUpdate,
      currentVersion: clientVersion,
      latestVersion: latest.version,
      changeCount,
      releasedAt: latest.released_at,
      changelog: latest.changelog,
    });
  } catch (error) {
    console.error('Sync check error:', error);
    return NextResponse.json(
      { error: 'Failed to check for updates' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Download updates
// ═══════════════════════════════════════════════════════════════════════════════

// SAFETY WITHDRAWAL (management rule, 2026-11-25). POST returned the full controller
// fault library (diagnostic steps, reset steps, solutions) - the same data as the withdrawn
// /api/generator-oracle/fault-code (review finding S2). It answers 503 with the shared notice
// before doing any work. Previous version: git show fa565ab1:app/api/generator-oracle/sync/route.ts
export async function POST() {
  return withdrawnRouteResponse();
}
