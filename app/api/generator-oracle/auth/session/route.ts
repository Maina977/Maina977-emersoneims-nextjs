/**
 * GENERATOR ORACLE - SESSION VALIDATION API
 *
 * @copyright 2026 Generator Oracle
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSession, logoutAllDevices } from '@/lib/generator-oracle/authService';

/**
 * GET - Validate current session
 */
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('oracle_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false, error: 'No session' },
        { status: 401 }
      );
    }

    const result = await validateSession(sessionToken);

    if (!result.success) {
      // Clear invalid session cookie
      const response = NextResponse.json(
        { authenticated: false, error: result.error },
        { status: 401 }
      );

      response.cookies.set('oracle_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({
      authenticated: true,
      user: result.user,
    });
  } catch (error) {
    console.error('Session validation API error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Session validation failed' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Logout from all devices
 */
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('oracle_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session' },
        { status: 401 }
      );
    }

    const session = await validateSession(sessionToken);

    if (!session.success || !session.user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    await logoutAllDevices(session.user.id);

    // Clear current session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out from all devices',
    });

    response.cookies.set('oracle_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout all API error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
