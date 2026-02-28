/**
 * GENERATOR ORACLE - USER LOGIN API
 *
 * @copyright 2026 Generator Oracle
 */

import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/generator-oracle/authService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    const result = await loginUser({
      email: body.email,
      password: body.password,
      deviceFingerprint: body.deviceFingerprint,
      ipAddress,
      userAgent,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    // Set HTTP-only cookie for session
    response.cookies.set('oracle_session', result.sessionToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
