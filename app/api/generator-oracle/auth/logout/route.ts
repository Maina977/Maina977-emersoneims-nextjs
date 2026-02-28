/**
 * GENERATOR ORACLE - USER LOGOUT API
 *
 * @copyright 2026 Generator Oracle
 */

import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '@/lib/generator-oracle/authService';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('oracle_session')?.value;

    if (sessionToken) {
      await logoutUser(sessionToken);
    }

    // Clear the session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
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
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
