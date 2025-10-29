import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Use the connection string directly
const connectionString = process.env.DATABASE_URL || 'mysql://ukedvrroz7sdyq0q:pQ1RB0P6w23HuMuXfIwb@bm7ibyhsp2hyaavwdzmm-mysql.services.clever-cloud.com:3306/bm7ibyhsp2hyaavwdzmm';

console.log('🔗 Connecting to database...');

// Create connection pool
const connection = mysql.createPool(connectionString);

// Test connection
connection.getConnection()
  .then((conn) => {
    console.log('✅ Database connected successfully');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });

export const db = drizzle(connection, { schema, mode: 'default' });