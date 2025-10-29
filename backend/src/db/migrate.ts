import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const runMigrations = async () => {
  console.log('🔄 Running database migrations...');

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const connection = await mysql.createConnection(connectionString);
  const db = drizzle(connection);

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

runMigrations()
  .then(() => {
    console.log('✨ Database is ready!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to run migrations:', error);
    process.exit(1);
  });