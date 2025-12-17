/**
 * Database Connection Utility
 * Supports PostgreSQL (recommended for Vercel) and MongoDB
 * 
 * For Vercel, use Vercel Postgres or external database service
 * For production, consider using Prisma or Drizzle ORM
 */

// PostgreSQL support (for Vercel Postgres or external PostgreSQL)
let pgPool: any = null;

/**
 * Initialize PostgreSQL connection pool
 */
let poolInitialized = false;

export async function initPostgresPool() {
  if (pgPool) return pgPool;
  if (poolInitialized) return null; // Prevent multiple initialization attempts
  poolInitialized = true;

  try {
    // Dynamic import to avoid errors if pg is not installed
    const { Pool } = await import('pg');
    
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    await pgPool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected');
    
    return pgPool;
  } catch (error) {
    console.warn('⚠️ PostgreSQL not available:', error instanceof Error ? error.message : 'Unknown error');
    console.warn('💡 Analytics will be logged only (no database storage)');
    return null;
  }
}

/**
 * Get PostgreSQL pool (initialize if needed)
 */
export async function getPostgresPool() {
  if (!pgPool && !poolInitialized) {
    await initPostgresPool();
  }
  return pgPool;
}

// Export pool directly for direct usage
export { pgPool as pool };

/**
 * Store conversion in database
 */
export async function storeConversion(data: {
  type: string;
  data: any;
  visitorId?: string;
  sessionId?: string;
  timestamp: number;
}): Promise<string | null> {
  try {
    const pool = await getPostgresPool();
    if (!pool) {
      console.log('📝 Conversion (logged only):', data);
      return null;
    }

    // Create table if it doesn't exist (run migrations in production)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS conversions (
        id SERIAL PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        data JSONB,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        timestamp TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const result = await pool.query(
      `INSERT INTO conversions(type, data, visitor_id, session_id, timestamp) 
       VALUES($1, $2, $3, $4, $5) RETURNING id`,
      [
        data.type,
        JSON.stringify(data.data),
        data.visitorId || null,
        data.sessionId || null,
        new Date(data.timestamp),
      ]
    );

    return result.rows[0].id.toString();
  } catch (error) {
    console.error('❌ Database error (conversion):', error);
    console.log('📝 Conversion (logged only):', data);
    return null;
  }
}

/**
 * Store event in database
 */
export async function storeEvent(data: {
  event: string;
  data: any;
  visitorId?: string;
  sessionId?: string;
  timestamp: number;
}): Promise<string | null> {
  try {
    const pool = await getPostgresPool();
    if (!pool) {
      console.log('📝 Event (logged only):', data);
      return null;
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        event VARCHAR(255) NOT NULL,
        data JSONB,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        timestamp TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const result = await pool.query(
      `INSERT INTO events(event, data, visitor_id, session_id, timestamp) 
       VALUES($1, $2, $3, $4, $5) RETURNING id`,
      [
        data.event,
        JSON.stringify(data.data),
        data.visitorId || null,
        data.sessionId || null,
        new Date(data.timestamp),
      ]
    );

    return result.rows[0].id.toString();
  } catch (error) {
    console.error('❌ Database error (event):', error);
    console.log('📝 Event (logged only):', data);
    return null;
  }
}

/**
 * Store visitor data in database
 */
export async function storeVisitor(data: {
  event: string;
  data: any;
  timestamp: number;
}): Promise<string | null> {
  try {
    const pool = await getPostgresPool();
    if (!pool) {
      console.log('📝 Visitor (logged only):', data);
      return null;
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        event VARCHAR(255) NOT NULL,
        data JSONB,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        page VARCHAR(255),
        timestamp TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const result = await pool.query(
      `INSERT INTO visitors(event, data, visitor_id, session_id, page, timestamp) 
       VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        data.event,
        JSON.stringify(data.data),
        data.data.id || null,
        data.data.sessionId || null,
        data.data.page || null,
        new Date(data.timestamp),
      ]
    );

    return result.rows[0].id.toString();
  } catch (error) {
    console.error('❌ Database error (visitor):', error);
    console.log('📝 Visitor (logged only):', data);
    return null;
  }
}

/**
 * Close database connections (for cleanup)
 */
export async function closeDatabaseConnections() {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
}

