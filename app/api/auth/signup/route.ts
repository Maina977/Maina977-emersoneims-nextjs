import { query } from '@/lib/db/postgres';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password, name, phone } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return Response.json(
        { error: 'Email, password, and name required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    const userId = `USER-${Date.now()}`;

    // Create user
    await query(
      `INSERT INTO users (id, email, passwordHash, fullName, phone)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, email, passwordHash, name, phone]
    );

    // Create customer profile
    const customerId = `CUST-${Date.now()}`;
    await query(
      `INSERT INTO customers (customerId, userId, defaultCity)
       VALUES ($1, $2, $3)`,
      [customerId, userId, 'Nairobi']
    );

    // Set session cookie (in production, use proper session management)
    const response = Response.json({
      success: true,
      userId,
      customerId,
      message: 'Account created successfully',
    });

    response.headers.set(
      'Set-Cookie',
      `userId=${userId}; Path=/; HttpOnly; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
