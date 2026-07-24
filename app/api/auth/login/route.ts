import { query } from '@/lib/db/postgres';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user
    const result = await query(
      'SELECT id, passwordHash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (passwordHash !== user.passwordhash) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get customer ID
    const customerResult = await query(
      'SELECT customerId FROM customers WHERE userId = $1',
      [user.id]
    );

    const customerId = customerResult.rows[0]?.customerid || null;

    // Set session cookie
    const response = Response.json({
      success: true,
      userId: user.id,
      customerId,
      message: 'Logged in successfully',
    });

    response.headers.set(
      'Set-Cookie',
      `userId=${user.id}; Path=/; HttpOnly; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}
