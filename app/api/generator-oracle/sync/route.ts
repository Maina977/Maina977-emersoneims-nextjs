/**
 * GENERATOR ORACLE SYNC API
 * Cloud sync endpoint for fault database
 *
 * @copyright 2026 Generator Oracle
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/db';
import { compareVersions, isNewerVersion } from '@/lib/generator-oracle/versionManager';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromVersion, toVersion } = body;

    const pool = await getPostgresPool();

    if (!pool) {
      // Return empty sync response
      return NextResponse.json({
        success: true,
        version: toVersion || '1.0.0',
        faults: [],
        isFullSync: true,
        message: 'Database unavailable - no remote faults',
      });
    }

    await initSyncTables();

    // For now, since we don't have fault data in the database,
    // return the built-in fault codes
    // In production, this would fetch from oracle_fault_codes table

    const { getAllFaultCodes } = await import('@/lib/generator-oracle/controllerFaultCodes');
    const allFaultCodes = getAllFaultCodes();

    // Get or create current version
    let currentVersion = toVersion || '1.0.0';

    const versionResult = await pool.query(
      `SELECT version FROM oracle_fault_versions WHERE is_current = true LIMIT 1`
    );

    if (versionResult.rows.length > 0) {
      currentVersion = (versionResult.rows[0] as { version: string }).version;
    }

    // Determine if full sync or delta sync
    const isFullSync = !fromVersion || fromVersion === '0.0.0' ||
                       compareVersions(fromVersion, '1.0.0') < 0;

    if (isFullSync) {
      return NextResponse.json({
        success: true,
        version: currentVersion,
        faults: allFaultCodes,
        isFullSync: true,
        faultCount: allFaultCodes.length,
      });
    }

    // Delta sync - get only changed faults
    // For now, return all faults since we don't track deltas yet
    return NextResponse.json({
      success: true,
      version: currentVersion,
      faults: allFaultCodes,
      removed: [],
      isFullSync: false, // Would be true delta in production
      faultCount: allFaultCodes.length,
    });
  } catch (error) {
    console.error('Sync download error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download updates' },
      { status: 500 }
    );
  }
}
