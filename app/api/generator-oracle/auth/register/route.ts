/**
 * GENERATOR ORACLE - USER REGISTRATION API
 *
 * @copyright 2026 Generator Oracle
 */

import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/generator-oracle/authService';

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

    // Security sweep 2026-11-26: self-registration never chooses its own role,
    // organisation or licence. These came from the request body, so anyone could
    // register as `admin` of any existing organisation and then read its members
    // or deactivate them (the team routes trust the stored role and
    // organisation). New accounts are always a technician with no organisation
    // and no licence; organisation membership must come from an admin.
    const result = await registerUser({
      email: body.email,
      password: body.password,
      name: body.name,
      phone: body.phone,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
