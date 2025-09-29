import { Pool } from 'pg'

let pool: Pool | null = null

export function getDatabaseConnection(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    })
  }
  return pool
}

export async function initializeDatabase() {
  const client = getDatabaseConnection()
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS audio_records (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        original_audio_url TEXT,
        transformed_audio_url TEXT,
        transform_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}
