/**
 * GENERATOR ORACLE MEDIA UPLOAD API
 * Handles photo and video uploads for diagnostics
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/db';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface MediaUploadRequest {
  id: string;
  type: 'photo' | 'video';
  dataUrl: string;
  thumbnail?: string;
  filename: string;
  mimeType: string;
  diagnosisId?: string;
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

async function initMediaTable(): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_diagnosis_media (
        id VARCHAR(50) PRIMARY KEY,
        diagnosis_id VARCHAR(100),
        media_type VARCHAR(10) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        storage_url TEXT,
        thumbnail_url TEXT,
        file_size INTEGER,
        width INTEGER,
        height INTEGER,
        duration INTEGER,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_media_diagnosis ON oracle_diagnosis_media(diagnosis_id)
    `);

    return true;
  } catch (error) {
    console.error('Failed to init media table:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Upload media
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MediaUploadRequest;

    const { id, type, dataUrl, thumbnail, filename, mimeType, diagnosisId, metadata } = body;

    // Validate required fields
    if (!id || !type || !dataUrl || !filename || !mimeType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate media type
    if (type !== 'photo' && type !== 'video') {
      return NextResponse.json(
        { success: false, error: 'Invalid media type' },
        { status: 400 }
      );
    }

    // Calculate approximate file size from base64
    const base64Data = dataUrl.split(',')[1] || dataUrl;
    const fileSize = Math.round(base64Data.length * 0.75);

    // Check size limits (10MB for photos, 50MB for videos)
    const maxSize = type === 'photo' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (fileSize > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large. Max ${type === 'photo' ? '10MB' : '50MB'}` },
        { status: 400 }
      );
    }

    const pool = await getPostgresPool();

    if (!pool) {
      // Store locally only - return success with local ID
      return NextResponse.json({
        success: true,
        id,
        url: dataUrl, // Return data URL as storage URL
        thumbnailUrl: thumbnail,
        storage: 'local',
        message: 'Stored locally (no database connection)',
      });
    }

    await initMediaTable();

    // In production, you would upload to blob storage (Vercel Blob, S3, etc.)
    // For now, we'll store a reference in the database
    // The actual data URL is stored client-side in IndexedDB

    // Store metadata in database
    await pool.query(
      `INSERT INTO oracle_diagnosis_media (
        id, diagnosis_id, media_type, filename, mime_type,
        storage_url, thumbnail_url, file_size, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        storage_url = EXCLUDED.storage_url,
        thumbnail_url = EXCLUDED.thumbnail_url,
        metadata = EXCLUDED.metadata`,
      [
        id,
        diagnosisId || null,
        type,
        filename,
        mimeType,
        `local://${id}`, // Reference to local storage
        thumbnail ? `local://${id}/thumb` : null,
        fileSize,
        JSON.stringify(metadata || {}),
      ]
    );

    return NextResponse.json({
      success: true,
      id,
      url: `local://${id}`,
      thumbnailUrl: thumbnail ? `local://${id}/thumb` : null,
      storage: 'database',
      size: fileSize,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Get media by ID or diagnosis
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const diagnosisId = searchParams.get('diagnosisId');

    const pool = await getPostgresPool();

    if (!pool) {
      return NextResponse.json({
        success: false,
        error: 'Database not available',
        message: 'Media stored locally in browser',
      });
    }

    await initMediaTable();

    if (id) {
      // Get single media item
      const result = await pool.query(
        `SELECT * FROM oracle_diagnosis_media WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Media not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        media: result.rows[0],
      });
    }

    if (diagnosisId) {
      // Get all media for a diagnosis
      const result = await pool.query(
        `SELECT * FROM oracle_diagnosis_media
         WHERE diagnosis_id = $1
         ORDER BY created_at DESC`,
        [diagnosisId]
      );

      return NextResponse.json({
        success: true,
        media: result.rows,
        count: result.rows.length,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide id or diagnosisId parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Get media error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve media' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE - Delete media
// ═══════════════════════════════════════════════════════════════════════════════

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Media ID required' },
        { status: 400 }
      );
    }

    const pool = await getPostgresPool();

    if (!pool) {
      return NextResponse.json({
        success: true,
        message: 'Delete from local storage manually',
      });
    }

    await pool.query(
      `DELETE FROM oracle_diagnosis_media WHERE id = $1`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Media deleted',
    });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
